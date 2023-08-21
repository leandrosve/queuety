import React, { useEffect, useMemo, useCallback, useState } from 'react';
import Logger from '../../utils/Logger';
import useQueue from './useQueue';
import { QueueAction, QueueActionRequest, QueueActionType } from '../../model/queue/QueueActions';
import MobilePlayerService from '../../services/api/player/MobilePlayerService';
import { YoutubeVideoDetail } from '../../services/api/YoutubeService';
import { v4 as uuid } from 'uuid';
import QueueItem from '../../model/player/QueueItem';

const useMobileQueue = (playerRoomId?: string | null, userId?: string | null) => {
  const [lastLocalAction, setLastLocalAction] = useState<QueueActionRequest>();
  const registerLastAction = useCallback(
    (action: QueueAction) => {
      const request = { eventId: 'event-' + uuid().substring(0, 5), userId, ...action };
      setLastLocalAction(request);
    },
    [setLastLocalAction, userId]
  );
  const [queue, dispatch] = useQueue(null, registerLastAction);

  const [items, length, currentIndex, currentItem] = useMemo(() => {
    const index = queue.items.findIndex((i) => i.id === queue.currentId);
    return [queue.items, queue.items.length, index, queue.items[index]];
  }, [queue]);

  const onAddNow = useCallback(
    (video: YoutubeVideoDetail) => dispatch({ type: QueueActionType.ADD_NOW, payload: { id: uuid(), video }, isLocal: true }),
    [dispatch]
  );
  const onAddLast = useCallback(
    (video: YoutubeVideoDetail) => dispatch({ type: QueueActionType.ADD_LAST, payload: { id: uuid(), video }, isLocal: true }),
    [dispatch]
  );
  const onAddNext = useCallback(
    (video: YoutubeVideoDetail) => dispatch({ type: QueueActionType.ADD_NEXT, payload: { id: uuid(), video }, isLocal: true }),
    [dispatch]
  );
  const onSkip = useCallback(() => dispatch({ type: QueueActionType.PLAY_NEXT, isLocal: true }), [dispatch]);
  const onClear = useCallback(() => {
    dispatch({ type: QueueActionType.CLEAR, isLocal: true });
  }, [dispatch]);
  const onChangeOrder = useCallback(
    (itemId: string, destinationIndex: number) =>
      dispatch({ type: QueueActionType.CHANGE_ORDER, payload: { itemId, destinationIndex }, isLocal: true }),
    [dispatch]
  );
  const onRemove = useCallback((itemId: string) => dispatch({ type: QueueActionType.REMOVE, payload: itemId, isLocal: true }), [dispatch]);
  const onPlay = useCallback(
    (item: QueueItem) => dispatch({ type: QueueActionType.PLAY_NOW, payload: { itemId: item.id }, isLocal: true }),
    [dispatch]
  );

  const processEvent = (action: QueueActionRequest) => {
    console.log('my userId is', userId);
    Logger.info('Received player event', action);
    if (action.userId === userId) {
      Logger.info('Player event was triggered by this user - discarding');
      return;
    }

    action.isLocal = false;
    dispatch(action);
  };

  useEffect(() => {
    if (!playerRoomId || !lastLocalAction || !lastLocalAction.isLocal || !lastLocalAction.userId) return;
    MobilePlayerService.sendMobilePlayerAction(playerRoomId, lastLocalAction);
  }, [lastLocalAction]);

  useEffect(() => {
    if (!playerRoomId || !userId) return;
    MobilePlayerService.onPlayerEvent(processEvent);
    MobilePlayerService.onCompletePlayerStatus(({ queue }) => {
      dispatch({ type: QueueActionType.INITIALIZE, payload: queue });
    });
    console.log('no??');
    MobilePlayerService.sendCompletePlayerStatusRequest();
  }, [playerRoomId, userId]);
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
      onChangeOrder,
      onRemove,
      onPlay,
      onSkip,
    },
  };
};

export default useMobileQueue;
