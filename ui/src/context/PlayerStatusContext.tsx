import React, { PropsWithChildren, useContext, useState } from 'react';

interface PlayerStatus {
  currentTime: number;
  state: YT.PlayerState;
  playbackRate: number;
}

interface PlayerStatusContextProps {
  status: PlayerStatus;
  updateStatus: (status: PlayerStatus) => void;
}

export const PlayerStatusContext = React.createContext<PlayerStatusContextProps>({
  status: {
    currentTime: 0,
    state: -1,
    playbackRate: 1,
  },
  updateStatus: () => {},
});

export const PlayerStatusProvider = ({ children }: PropsWithChildren) => {
  const [status, setStatus] = useState<PlayerStatus>({ currentTime: 0, state: YT.PlayerState.UNSTARTED, playbackRate: 1 });
  const updateStatus = (status: PlayerStatus) => {
    setStatus(status);
  };

  return <PlayerStatusContext.Provider value={{ updateStatus, status }}>{children}</PlayerStatusContext.Provider>;
};

export const usePlayerStatusContext = () => {
  return useContext(PlayerStatusContext);
};
