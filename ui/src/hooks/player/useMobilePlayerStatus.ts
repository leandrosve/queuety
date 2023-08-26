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
  duration: 1,
  isReady: false,
  videoId: '',
  fullscreen: false,
  rate: 1,
  volume: 1,
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

  const onRateChange = (value: number) => {
    MobilePlayerService.sendPlayerStatusAction({ type: PlayerStatusActionType.CHANGE_RATE, payload: { value } });
  };

  const onVolumeChange = (value: number) => {
    MobilePlayerService.sendPlayerStatusAction({ type: PlayerStatusActionType.CHANGE_VOLUME, payload: { value } });
  };

  useEffect(() => {
    MobilePlayerService.onPlayerStatus((res) => {
      Logger.info('Received player status', res?.status);
      setStatus((p) => ({ ...p, ...res.status }));
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
      onRateChange,
      onVolumeChange,
    },
  };
};

export default useMobilePlayerStatus;
