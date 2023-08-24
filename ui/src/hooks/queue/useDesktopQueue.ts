import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { QueueAction, QueueActionRequest, QueueActionType } from '../../model/queue/QueueActions';
import useQueue, { QueueControls } from './useQueue';
import QueueItem from '../../model/player/QueueItem';
import { v4 as uuid } from 'uuid';
import Logger from '../../utils/Logger';
import StorageUtils, { StorageKey } from '../../utils/StorageUtils';
import { Queue, QueueStatus } from '../../model/queue/Queue';
import DesktopPlayerService from '../../services/api/player/DesktopPlayerService';
import { useOnlinePrescenceContext } from '../../context/OnlinePrescenceContext';
import useDesktopNotifications from '../notifications/useDesktopNotifications';

const getInitialQueueInfo = (): Queue => {
  const emptyQueue: Queue = { items: [], currentId: null, status: QueueStatus.UNSTARTED };
  const q = StorageUtils.get(StorageKey.QUEUE);
  if (q) return { ...emptyQueue, ...JSON.parse(q) };
  return { items: [], currentId: null, status: QueueStatus.UNSTARTED };
};

export interface QueueData {
  items: QueueItem[];
  currentIndex: number;
  length: number;
  currentItem: QueueItem;
}

const useDesktopQueue = (playerRoomId: string, userId: string): { queue: QueueData; controls: QueueControls } => {
  const [isSocketReady, setIsSocketReady] = useState<boolean>(false);
  const onlineUsers = useOnlinePrescenceContext();
  const [actions, setActions] = useState<{ previous?: QueueActionRequest; last: QueueActionRequest }>();
  const notifications = useDesktopNotifications();

  const registerLastAction = useCallback(
    (action: QueueAction) => {
      setActions((prev) => {
        const previous = prev?.last;
        const last = { eventId: 'event-' + uuid().substring(0, 5), previousEventId: prev?.last?.eventId, ...action };
        return { previous, last };
      });
    },
    [setActions]
  );
  const { queue, controls, dispatch } = useQueue(userId, getInitialQueueInfo(), registerLastAction);

  const [items, length, currentIndex, currentItem] = useMemo(() => {
    const index = queue.items.findIndex((i) => i.id === queue.currentId);
    return [queue.items, queue.items.length, index, queue.items[index]];
  }, [queue]);

  const queueRef = useRef(queue);

  useEffect(() => {
    if (!actions?.last || !playerRoomId || !isSocketReady) return;
    if (onlineUsers.data.length) {
      DesktopPlayerService.sendPlayerAction(playerRoomId, actions?.last);
    }
    if (actions.last) {
      notifications.queueAction(actions.last);
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

  return {
    queue: {
      items,
      length,
      currentIndex,
      currentItem,
    },
    controls,
  };
};
export default useDesktopQueue;
