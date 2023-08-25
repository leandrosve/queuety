import { useEffect, useState } from 'react';
import MobilePlayerService from '../../services/api/player/MobilePlayerService';
import PlayerStatus from '../../model/player/PlayerStatus';
import PlayerState from '../../model/player/PlayerState';
import Logger from '../../utils/Logger';
import { PlayerControls } from './useDesktopPlayer';
import { PlayerStatusActionType } from '../../model/player/PlayerActions';

const initialStatus: PlayerStatus = {
  currentTime: 0,
  state: -1,
  playbackRate: PlayerState.UNSTARTED,
  duration: 1,
  isReady: false,
  videoId: '',
};

export interface MobilePlayerControls extends PlayerControls {
  onFullscreenChange: (value: boolean) => void;
}

const useMobilePlayerStatus = (): { status: PlayerStatus; controls: MobilePlayerControls } => {
  const [status, setStatus] = useState<PlayerStatus>(initialStatus);

  const onPlay = () => {
    setStatus((p) => ({ ...p, state: PlayerState.PLAYING }));
    MobilePlayerService.sendPlayerStatusAction({ type: PlayerStatusActionType.PLAY, payload: null });
  };
  const onPause = () => {
    setStatus((p) => ({ ...p, state: PlayerState.PAUSED }));
    MobilePlayerService.sendPlayerStatusAction({ type: PlayerStatusActionType.PAUSE, payload: null });
  };

  const onTimeChange = (timeSeconds: number) => {
    setStatus((p) => ({ ...p, state: PlayerState.BUFFERING }));
    MobilePlayerService.sendPlayerStatusAction({ type: PlayerStatusActionType.CHANGE_TIME, payload: { time: timeSeconds } });
  };

  const onFullscreenChange = (value: boolean) => {
    MobilePlayerService.sendPlayerStatusAction({ type: PlayerStatusActionType.CHANGE_FULLSCREEN, payload: { value } });
  };

  useEffect(() => {
    MobilePlayerService.onPlayerStatus((res) => {
      Logger.info('Received player status', res);
      setStatus({ ...res.status });
    });
  }, []);
  return {
    status,
    controls: {
      onPause,
      onPlay,
      onForward: () => {},
      onRewind: () => {},
      onFullscreenChange,
      onTimeChange,
    },
  };
};

export default useMobilePlayerStatus;
