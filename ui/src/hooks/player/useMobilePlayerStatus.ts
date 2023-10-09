import { useEffect, useState, useCallback, useMemo } from 'react';
import MobilePlayerService from '../../services/api/player/MobilePlayerService';
import PlayerStatus from '../../model/player/PlayerStatus';
import PlayerState from '../../model/player/PlayerState';
import Logger from '../../utils/Logger';
import { PlayerControls } from './useDesktopPlayer';
import { PlayerStatusAction, PlayerStatusActionType } from '../../model/player/PlayerActions';
import { useMobileAuthContext } from '../../context/MobileAuthContext';
import { HostStatus } from '../connection/useMobileAuth';

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

const useMobilePlayerStatus = (): { status: PlayerStatus; controls: MobilePlayerControls; timeTimestamp: number } => {
  const [status, setStatus] = useState<PlayerStatus>(initialStatus);
  const { hostStatus } = useMobileAuthContext();
  const timeTimestamp = useMemo(() => new Date().getTime(), [status.currentTime]);

  const sendPlayerStatusAction = useCallback(
    (action: PlayerStatusAction) => {
      if (hostStatus == HostStatus.DISCONNECTED) return false;
      const res = MobilePlayerService.sendPlayerStatusAction(action);
      return res;
    },
    [hostStatus]
  );

  const onPlay = useCallback(() => {
    if (sendPlayerStatusAction({ type: PlayerStatusActionType.PLAY, payload: null })) {
      setStatus((p) => ({ ...p, state: PlayerState.PLAYING }));
    }
  }, [sendPlayerStatusAction]);

  const onPause = useCallback(() => {
    if (sendPlayerStatusAction({ type: PlayerStatusActionType.PAUSE, payload: null })) {
      setStatus((p) => ({ ...p, state: PlayerState.PAUSED }));
    }
  }, [sendPlayerStatusAction]);

  const onTimeChange = useCallback(
    (timeSeconds: number) => {
      setStatus((p) => ({ ...p, state: p.state === PlayerState.PLAYING ? PlayerState.AWAITING_PLAYING : PlayerState.AWAITING_PAUSED }));
      sendPlayerStatusAction({ type: PlayerStatusActionType.CHANGE_TIME, payload: { time: timeSeconds } });
    },
    [sendPlayerStatusAction]
  );

  const onFullscreenChange = useCallback(
    (value: boolean) => {
      return sendPlayerStatusAction({ type: PlayerStatusActionType.CHANGE_FULLSCREEN, payload: { value } });
    },
    [sendPlayerStatusAction]
  );

  const onRateChange = useCallback(
    (value: number) => {
      return sendPlayerStatusAction({ type: PlayerStatusActionType.CHANGE_RATE, payload: { value } });
    },
    [sendPlayerStatusAction]
  );

  const onVolumeChange = useCallback(
    (value: number) => {
      return sendPlayerStatusAction({ type: PlayerStatusActionType.CHANGE_VOLUME, payload: { value } });
    },
    [sendPlayerStatusAction]
  );

  const onRewind = useCallback(
    (seconds: number) => {
      sendPlayerStatusAction({ type: PlayerStatusActionType.REWIND, payload: { seconds } });
    },
    [sendPlayerStatusAction]
  );

  const onForward = useCallback(
    (seconds: number) => {
      sendPlayerStatusAction({ type: PlayerStatusActionType.FORWARD, payload: { seconds } });
    },
    [sendPlayerStatusAction]
  );

  useEffect(() => {
    MobilePlayerService.onPlayerStatus((res) => {
      Logger.info('Received player status', res?.status);
      setStatus((p) => {
        if (res.timestamp && res.status.currentTime !== undefined) {
          const playbackRate = res.status.rate ?? p.rate;
          const timeDiff = (new Date().getTime() - res.timestamp) / 1000;
          const currentTime = res.status.currentTime + timeDiff * playbackRate;
          return { ...p, ...res.status, currentTime };
        }
        return { ...p, ...res.status };
      });
    });
  }, []);

  useEffect(() => {});
  return {
    status,
    timeTimestamp,
    controls: {
      onPause,
      onPlay,
      onForward,
      onRewind,
      onFullscreenChange,
      onTimeChange,
      onRateChange,
      onVolumeChange,
    },
  };
};

export default useMobilePlayerStatus;
