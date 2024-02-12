import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { QueueActionRequest, QueueActionType } from '../../model/queue/QueueActions';
import useQueue, { QueueControls } from './useQueue';
import QueueItem from '../../model/player/QueueItem';
import { v4 as uuid } from 'uuid';
import Logger from '../../utils/Logger';
import StorageUtils, { StorageKey } from '../../utils/StorageUtils';
import { Queue, QueueStatus } from '../../model/queue/Queue';
import DesktopPlayerService from '../../services/api/player/DesktopPlayerService';
import { useOnlinePrescenceContext } from '../../context/OnlinePrescenceContext';
import { useDesktopNotificationsContext } from '../../context/DesktopNotificationsContext';
import PlayerState from '../../model/player/PlayerState';
import { YoutubePlaylistItem } from '../../services/api/YoutubeService';

const getInitialQueueInfo = (): Queue => {
  const emptyQueue: Queue = { items: [], currentId: null, status: QueueStatus.UNSTARTED, loop: false, currentPlaylistItem: null };
  const q = StorageUtils.get(StorageKey.QUEUE);
  if (q) return { ...emptyQueue, ...JSON.parse(q) };
  return emptyQueue;
};

export interface QueueData {
  items: QueueItem[];
  currentIndex: number;
  length: number;
  currentItem: QueueItem;
  currentPlaylistItem: YoutubePlaylistItem | null;
  loop: boolean;
}

const useDesktopQueue = (
  playerRoomId: string,
  userId: string
): { queue: QueueData; controls: QueueControls; updatePlayerState: (state: PlayerState) => void } => {
  const [isSocketReady, setIsSocketReady] = useState<boolean>(false);
  const onlineUsers = useOnlinePrescenceContext();
  const [actions, setActions] = useState<{ previous?: QueueActionRequest; last: QueueActionRequest }>();
  const notifications = useDesktopNotificationsContext();
  const [queueStatus, setQueueStatus] = useState<QueueStatus>(QueueStatus.ENDED);

  const registerLastAction = useCallback(
    (action: QueueActionRequest) => {
      setActions((prev) => {
        const previous = prev?.last;
        const eventId = action.eventId ? action.eventId : 'event-' + uuid().substring(0, 5);
        const last = { previousEventId: prev?.last?.eventId, ...action, eventId };
        return { previous, last };
      });
    },
    [setActions]
  );
  const { queue, controls, dispatch } = useQueue(userId, getInitialQueueInfo(), registerLastAction);

  const [items, length, currentIndex, currentItem, currentPlaylistItem] = useMemo(() => {
    const index = queue.items.findIndex((i) => i.id === queue.currentId);
    return [queue.items, queue.items.length, index, queue.items[index], queue.currentPlaylistItem];
  }, [queue]);

  const queueRef = useRef(queue);

  const updatePlayerState = useCallback(
    (state: PlayerState) => {
      const finished = state === PlayerState.ENDED && currentIndex + 1 >= length;
      setQueueStatus(finished ? QueueStatus.ENDED : QueueStatus.ACTIVE);
    },
    [currentIndex, length]
  );

  useEffect(() => {
    if (!actions?.last || !playerRoomId || !isSocketReady) return;
    if (onlineUsers.data.length) {
      DesktopPlayerService.sendPlayerAction(playerRoomId, actions?.last);
    }
    if (actions.last) {
      notifications.addQueueAction(actions.last);
      StorageUtils.setRaw(StorageKey.LAST_QUEUE_EVENT_ID, actions.last.eventId);
    }
  }, [actions]);

  useEffect(() => {
    DesktopPlayerService.onCompleteQueueRequest(({ clientId }) => {
      Logger.info(`Received complete status request from clientId: ${clientId}`);
      DesktopPlayerService.sendCompleteQueue(clientId, {
        timestamp: new Date().getTime(),
        type: QueueActionType.INITIALIZE,
        userId,
        payload: queueRef.current,
      });
    });
    DesktopPlayerService.onMobilePlayerEvent((action) => {
      if (action?.type) Logger.info(`Received mobile player event`, action);
      dispatch(action);
    });
    DesktopPlayerService.connect(() => {
      setIsSocketReady(true);
    });
  }, []);

  useEffect(() => {
    queueRef.current = queue;
    StorageUtils.set(StorageKey.QUEUE, JSON.stringify(queue));
  }, [queue]);

  useEffect(() => {
    controls.onChangeStatus(queueStatus);
  }, [queueStatus, dispatch]);

  return {
    queue: {
      items,
      length,
      currentIndex,
      currentItem,
      loop: queue.loop,
      currentPlaylistItem,
    },
    controls,
    updatePlayerState,
  };
};
export default useDesktopQueue;
