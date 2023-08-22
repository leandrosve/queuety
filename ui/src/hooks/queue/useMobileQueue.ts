import React, { useEffect, useMemo, useCallback, useState } from 'react';
import Logger from '../../utils/Logger';
import useQueue from './useQueue';
import { QueueAction, QueueActionRequest, QueueActionType } from '../../model/queue/QueueActions';
import MobilePlayerService from '../../services/api/player/MobilePlayerService';
import { v4 as uuid } from 'uuid';

const useMobileQueue = (playerRoomId?: string | null, userId?: string | null) => {
  const [lastLocalAction, setLastLocalAction] = useState<QueueActionRequest>();
  const registerLastAction = useCallback(
    (action: QueueAction) => {
      const request = { eventId: 'event-' + uuid().substring(0, 5), userId, ...action };
      setLastLocalAction(request);
    },
    [setLastLocalAction, userId]
  );
  const { queue, controls, dispatch } = useQueue(null, registerLastAction);

  const [items, length, currentIndex, currentItem] = useMemo(() => {
    const index = queue.items.findIndex((i) => i.id === queue.currentId);
    return [queue.items, queue.items.length, index, queue.items[index]];
  }, [queue]);

  const processEvent = (action: QueueActionRequest) => {
    console.log('my userId is', userId);
    Logger.info('Received player event', action);
    if (action.userId === userId) {
      Logger.info('Player event was triggered by this user - discarding');
      return;
    }

    action.isLocal = false;
    dispatch(action, false);
  };

  useEffect(() => {
    if (!playerRoomId || !lastLocalAction || !lastLocalAction.isLocal || !lastLocalAction.userId) return;
    console.log('sending action', lastLocalAction.type, lastLocalAction.isLocal);
    MobilePlayerService.sendMobilePlayerAction(playerRoomId, lastLocalAction);
  }, [lastLocalAction]);

  useEffect(() => {
    if (!playerRoomId || !userId) return;
    MobilePlayerService.onPlayerEvent(processEvent);
    MobilePlayerService.onCompleteQueue(({ queue }) => {
      dispatch({ type: QueueActionType.INITIALIZE, payload: queue }, false);
    });
    MobilePlayerService.sendCompleteQueueRequest();
  }, [playerRoomId, userId]);
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

export default useMobileQueue;
