import { useState, useMemo, useCallback, useEffect } from 'react';
import { QueueAction, QueueActionType, QueueActionRequest } from '../../model/queue/QueueActions';
import useQueue from './useQueue';
import { YoutubeVideoDetail } from '../../services/api/YoutubeService';
import QueueItem from '../../model/player/QueueItem';
import { v4 as uuid } from 'uuid';
import Logger from '../../utils/Logger';
import PlayerService from '../../services/api/player/PlayerService';
import StorageUtils, { StorageKey } from '../../utils/StorageUtils';
import { Queue, QueueStatus } from '../../model/queue/Queue';

const getInitialQueueInfo = (): Queue => {
  const q = StorageUtils.get(StorageKey.QUEUE);
  if (q) return JSON.parse(q) as Queue;
  return { items: [], currentId: null, status: QueueStatus.UNSTARTED };
};

const useDesktopQueue = (playerRoomId?: string | null) => {
  const [isSocketReady, setIsSocketReady] = useState<boolean>(false);
  const [lastAction, setLastAction] = useState<QueueActionRequest>();
  const registerLastAction = useCallback(
    (action: QueueAction) => {
      setLastAction({ actionId: 'action-' + uuid(), ...action });
    },
    [setLastAction]
  );
  const [queue, dispatch] = useQueue(getInitialQueueInfo(), registerLastAction);
  const [items, length, currentIndex, currentItem] = useMemo(() => {
    const index = queue.items.findIndex((i) => i.id === queue.currentId);
    return [queue.items, queue.items.length, index, queue.items[index]];
  }, [queue]);

  const onAddNow = useCallback(
    (video: YoutubeVideoDetail) => dispatch({ type: QueueActionType.ADD_NOW, payload: { id: uuid(), video } }),
    [dispatch]
  );
  const onAddLast = useCallback(
    (video: YoutubeVideoDetail) => dispatch({ type: QueueActionType.ADD_LAST, payload: { id: uuid(), video } }),
    [dispatch]
  );
  const onAddNext = useCallback(
    (video: YoutubeVideoDetail) => dispatch({ type: QueueActionType.ADD_NEXT, payload: { id: uuid(), video } }),
    [dispatch]
  );
  const onClear = useCallback(() => {
    dispatch({ type: QueueActionType.CLEAR });
  }, [dispatch]);
  const onUpdate = useCallback(
    (itemId: string, destinationIndex: number) => dispatch({ type: QueueActionType.CHANGE_ORDER, payload: { itemId, destinationIndex } }),
    [dispatch]
  );
  const onRemove = useCallback((itemId: string) => dispatch({ type: QueueActionType.REMOVE, payload: itemId }), [dispatch]);
  const onPlay = useCallback((item: QueueItem) => dispatch({ type: QueueActionType.PLAY_NOW, payload: { itemId: item.id } }), [dispatch]);

  useEffect(() => {
    Logger.debug('player ready', isSocketReady);

    if (!lastAction || !playerRoomId || !isSocketReady) return;
    Logger.debug('Last Queue Action: ', lastAction);
    console.log('hola??');
    PlayerService.sendPlayerAction(playerRoomId, lastAction);
  }, [lastAction]);

  useEffect(() => {
    console.log("holaa?")
    PlayerService.connect(() => {
      console.log("holaaa response")
      setIsSocketReady(true)});
  }, []);

  useEffect(() => {
    StorageUtils.set(StorageKey.QUEUE, JSON.stringify(queue));
  }, [queue]);

  return {
    queue: {
      items,
      length,
      currentIndex,
      currentItem,
    },
    controls: {
      onAddNow,
      onAddLast,
      onAddNext,
      onClear,
      onUpdate,
      onRemove,
      onPlay,
    },
  };
};
export default useDesktopQueue;
