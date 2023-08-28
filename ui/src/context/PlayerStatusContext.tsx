import React, { PropsWithChildren, useContext, useState } from 'react';
import PlayerStatus from '../model/player/PlayerStatus';

interface PlayerStatusContextProps {
  status: PlayerStatus;
  updateStatus: (status: PlayerStatus) => void;
}

const defaultStatus = {
  currentTime: 0,
  state: -1,
  playbackRate: 1,
  duration: 0,
  isReady: false,
  videoId: '',
  fullscreen: false,
  rate: 1,
  volume: 50,
};

export const PlayerStatusContext = React.createContext<PlayerStatusContextProps>({
  status: defaultStatus,
  updateStatus: () => {},
});

export const PlayerStatusProvider = ({ children }: PropsWithChildren) => {
  const [status, setStatus] = useState<PlayerStatus>(defaultStatus);
  const updateStatus = (status: PlayerStatus) => {
    setStatus(status);
  };

  return <PlayerStatusContext.Provider value={{ updateStatus, status }}>{children}</PlayerStatusContext.Provider>;
};

export const usePlayerStatusContext = () => {
  return useContext(PlayerStatusContext);
};
