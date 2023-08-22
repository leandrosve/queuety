import React, { useEffect } from 'react';
import { usePlayerStatusContext } from '../../context/PlayerStatusContext';
import DesktopPlayerService from '../../services/api/player/DesktopPlayerService';
import PlayerState from '../../model/player/PlayerState';

const useDesktopPlayer = (playerRoomId?: string | null) => {
  const { status } = usePlayerStatusContext();

  useEffect(() => {
    if (!playerRoomId || !DesktopPlayerService.isReady()) return;
    const isBuffering = status.state === PlayerState.BUFFERING;
    const timeoutTime = isBuffering ? 500 : 200;
    const timeout = setTimeout(() => {
      console.log('status changed', status);
      DesktopPlayerService.sendPlayerStatus(playerRoomId, status);
    }, timeoutTime);
    return () => clearTimeout(timeout);
  }, [status]);
  return {};
};

export default useDesktopPlayer;
