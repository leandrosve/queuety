import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { QueueAction, QueueActionRequest } from '../../model/queue/QueueActions';
import useQueue, { QueueControls } from './useQueue';
import QueueItem from '../../model/player/QueueItem';
import { v4 as uuid } from 'uuid';
import Logger from '../../utils/Logger';
import StorageUtils, { StorageKey } from '../../utils/StorageUtils';
import { Queue, QueueStatus } from '../../model/queue/Queue';
import DesktopPlayerService from '../../services/api/player/DesktopPlayerService';
import { useOnlinePrescenceContext } from '../../context/OnlinePrescenceContext';

const getInitialQueueInfo = (): Queue => {
  const q = StorageUtils.get(StorageKey.QUEUE);
  if (q) return JSON.parse(q) as Queue;
  return { items: [], currentId: null, status: QueueStatus.UNSTARTED };
};

export interface QueueData {
  items: QueueItem[];
  currentIndex: number;
  length: number;
  currentItem: QueueItem;
}

const useDesktopQueue = (playerRoomId?: string | null): { queue: QueueData; controls: QueueControls } => {
  const [isSocketReady, setIsSocketReady] = useState<boolean>(false);
  const onlineUsers = useOnlinePrescenceContext();
  const [actions, setActions] = useState<{ previous?: QueueActionRequest; last: QueueActionRequest }>();

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
  const { queue, controls, dispatch } = useQueue(getInitialQueueInfo(), registerLastAction);

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
  }, [actions]);

  useEffect(() => {
    DesktopPlayerService.onCompletePlayerStatusRequest(({ clientId }) => {
      Logger.info(`Received complete status request from clientId: ${clientId}`);
      DesktopPlayerService.sendCompletePlayerStatus(clientId, queueRef.current);
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
