import { useEffect, useState } from 'react';
import MobilePlayerService from '../../services/api/player/MobilePlayerService';
import PlayerStatus from '../../model/player/PlayerStatus';
import PlayerState from '../../model/player/PlayerState';
import Logger from '../../utils/Logger';

const initialStatus: PlayerStatus = {
  currentTime: 0,
  state: -1,
  playbackRate: PlayerState.UNSTARTED,
  duration: 1,
  isReady: false,
};
const useMobilePlayerStatus = () => {
  const [status, setStatus] = useState<PlayerStatus>(initialStatus);
  useEffect(() => {
    MobilePlayerService.onPlayerStatus((res) => {
      Logger.info("Received player status")
      setStatus(res.status);
    });
  }, []);
  return { status };
};

export default useMobilePlayerStatus;
