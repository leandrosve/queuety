import React, { PropsWithChildren, useContext } from 'react';
import useSimpleList, { SimpleList, simpleListDefaults } from '../hooks/common/useSimpleList';
import useQueue from '../hooks/queue/useQueue';
import { QueueStatus, Queue } from '../model/queue/Queue';
import { QueueAction } from '../model/queue/QueueActions';

interface Props {
  queue: Queue;
  dispatch: React.Dispatch<QueueAction>;
}
const PlayerDesktopQueueContext = React.createContext<Props>({
  queue: {
    items: [],
    currentId: null,
    status: QueueStatus.UNSTARTED,
  },
  dispatch: () => {},
});

export const PlayerDesktopQueueProvider = ({ children }: PropsWithChildren) => {
  const playerDesktopQueue = useQueue((res) => console.log('Callback', res));

  return <PlayerDesktopQueueContext.Provider value={playerDesktopQueue}>{children}</PlayerDesktopQueueContext.Provider>;
};

export const usePlayerDesktopQueueContext = () => {
  return useContext(PlayerDesktopQueueContext);
};
