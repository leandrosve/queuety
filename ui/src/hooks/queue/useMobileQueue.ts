import React, { useEffect, useMemo } from 'react';
import Logger from '../../utils/Logger';
import PlayerService from '../../services/api/player/PlayerService';
import useQueue from './useQueue';
import { QueueActionRequest } from '../../model/queue/QueueActions';
import queueMocks from '../../components/app/shared/player/queue/queueMocks';
import { QueueStatus } from '../../model/queue/Queue';

const useMobileQueue = (playerRoomId?: string | null) => {
  const [queue, dispatch] = useQueue({
    items: queueMocks,
    currentId: queueMocks[0].id,
    status: QueueStatus.UNSTARTED,
  });
  const [items, length, currentIndex, currentItem] = useMemo(() => {
    const index = queue.items.findIndex((i) => i.id === queue.currentId);
    return [queue.items, queue.items.length, index, queue.items[index]];
  }, [queue]);

  const processEvent = (action: QueueActionRequest) => {
    Logger.info('player action', action);
    dispatch(action);
  };

  useEffect(() => {
    if (!playerRoomId) return;
    PlayerService.connect(() => {
      PlayerService.joinPlayerRoom(playerRoomId, false, 'user-asdasd', 'test');
      setTimeout(() => {
        PlayerService.onPlayerEvent(processEvent);
      }, 1000);
    });
  }, [playerRoomId]);
  return {
    queue: {
      items,
      length,
      currentIndex,
      currentItem,
    },
  };
};

export default useMobileQueue;
