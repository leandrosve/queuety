import { useEffect, useMemo, useCallback, useState } from 'react';
import Logger from '../../utils/Logger';
import useQueue, { QueueControls } from './useQueue';
import { QueueAction, QueueActionRequest, QueueActionType } from '../../model/queue/QueueActions';
import MobilePlayerService from '../../services/api/player/MobilePlayerService';
import { v4 as uuid } from 'uuid';
import { QueueData } from './useDesktopQueue';
import StorageUtils, { StorageKey } from '../../utils/StorageUtils';
import { HostStatus } from '../connection/useMobileAuth';

const useMobileQueue = (
  playerRoomId: string,
  userId: string,
  joinedRoom: boolean,
  hostStatus: HostStatus
): { queue: QueueData; controls: QueueControls } => {
  const [lastLocalAction, setLastLocalAction] = useState<QueueActionRequest>();
  const registerLastAction = useCallback(
    (action: QueueActionRequest) => {
      const eventId = action.eventId ? action.eventId : 'event-' + uuid().substring(0, 5);
      const request = { ...action, eventId: eventId };
      setLastLocalAction(request);
    },
    [setLastLocalAction, userId]
  );
  const { queue, controls, dispatch } = useQueue(userId, undefined, registerLastAction);

  const [items, length, currentIndex, currentItem, loop] = useMemo(() => {
    const index = queue.items.findIndex((i) => i.id === queue.currentId);
    return [queue.items, queue.items.length, index, queue.items[index], queue.loop];
  }, [queue]);

  const processEvent = (action: QueueActionRequest) => {
    Logger.info('Received player event', action);
    if (action.userId === userId) {
      Logger.info('Player event was triggered by this user - discarding');
      StorageUtils.setRaw(StorageKey.LAST_QUEUE_EVENT_ID, action.eventId);

      return;
    }
    action.isLocal = false;
    StorageUtils.setRaw(StorageKey.LAST_QUEUE_EVENT_ID, action.eventId);
    dispatch(action, false);
  };

  useEffect(() => {
    if (!playerRoomId || !lastLocalAction || !lastLocalAction.isLocal || !lastLocalAction.userId) return;
    MobilePlayerService.sendMobilePlayerAction(playerRoomId, lastLocalAction);
  }, [lastLocalAction]);

  useEffect(() => {
    if (!playerRoomId || !userId || !joinedRoom || hostStatus !== HostStatus.CONNECTED) return;
    MobilePlayerService.onPlayerEvent(processEvent);
    MobilePlayerService.onCompleteQueue((action) => {
      dispatch({ ...action, type: QueueActionType.INITIALIZE, eventId: '' }, false);
    });
    MobilePlayerService.sendCompleteQueueRequest();
  }, [playerRoomId, userId, joinedRoom, hostStatus]);
  return {
    queue: {
      items,
      length,
      currentIndex,
      currentItem,
      loop,
    },
    controls,
  };
};

export default useMobileQueue;
