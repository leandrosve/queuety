import { useCallback, useEffect, useMemo, useState } from 'react';
import DesktopPlayerService from '../../services/api/player/DesktopPlayerService';
import PlayerState from '../../model/player/PlayerState';
import useYoutubePlayer from './useYoutubePlayer';
import QueueItem from '../../model/player/QueueItem';
import PlayerStatus from '../../model/player/PlayerStatus';
import { PlayerStatusAction, PlayerStatusActionType } from '../../model/player/PlayerActions';
import Logger from '../../utils/Logger';
import PlayerUtils from '../../utils/PlayerUtils';
import { usePlayerStatusContext } from '../../context/PlayerStatusContext';
import { useOnlinePrescenceContext } from '../../context/OnlinePrescenceContext';

export interface PlayerControls {
  onTimeChange: (time: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onForward: (seconds: number) => void;
  onRewind: (seconds: number) => void;
  onFullscreenChange: (value: boolean) => void;
  onRateChange: (value: number) => void;
  onVolumeChange: (value: number) => void;
}

const useDesktopPlayer = (
  playerRoomId: string,
  currentItem: QueueItem,
  onVideoEnded: () => void,
  onStateChanged?: (state: PlayerState) => void
): { status: PlayerStatus; controls: PlayerControls } => {
  //const { status } = usePlayerStatusContext();
  const { controls: innerControls, getCurrentPlayerStatus, status } = useYoutubePlayer('player-container', currentItem, onVideoEnded);
  const [lastPlayerAction, setLastPlayerAction] = useState<PlayerStatusAction>();
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const { updateStatus: updateStatusContext } = usePlayerStatusContext();
  const onlineUsers = useOnlinePrescenceContext();

  // Need to keep track of the previous and current status to avoid sending full payloads
  const [statusHistory, setStatusHistory] = useState<{ prev: PlayerStatus; current: PlayerStatus }>({
    prev: { ...status, fullscreen },
    current: { ...status, fullscreen },
  });

  const onFullscreenChange = useCallback((value: boolean) => {
    setFullscreen(value);
    document.documentElement.setAttribute('data-fullscreen', value ? 'on' : 'off');
  }, []);

  const controls: PlayerControls = useMemo(() => ({ ...innerControls, onFullscreenChange }), [innerControls, onFullscreenChange]);

  const onPlayerStatusAction = useCallback(
    (action: PlayerStatusAction) => {
      Logger.info(`Received player status action`, action, action.type);
      if (!action.type) return;
      switch (action.type) {
        case PlayerStatusActionType.PLAY:
          innerControls.onPlay();
          break;
        case PlayerStatusActionType.PAUSE:
          innerControls.onPause();
          break;
        case PlayerStatusActionType.CHANGE_TIME:
          innerControls.onTimeChange(action.payload.time);
          innerControls.onPlay();
          break;
        case PlayerStatusActionType.CHANGE_FULLSCREEN:
          onFullscreenChange(action.payload.value);
          break;
        case PlayerStatusActionType.CHANGE_RATE:
          innerControls.onRateChange(action.payload.value);
          break;
        case PlayerStatusActionType.CHANGE_VOLUME:
          innerControls.onVolumeChange(action.payload.value);
          break;
        case PlayerStatusActionType.REWIND:
          innerControls.onRewind(action.payload.seconds);
          break;
        case PlayerStatusActionType.FORWARD:
          innerControls.onForward(action.payload.seconds);
          break;
        default:
          break;
      }
    },
    [innerControls]
  );

  useEffect(() => {
    if (lastPlayerAction) {
      onPlayerStatusAction(lastPlayerAction);
    }
  }, [lastPlayerAction]);

  useEffect(() => {
    DesktopPlayerService.onPlayerStatusAction((action) => {
      setLastPlayerAction(action);
    });
    DesktopPlayerService.onCompleteQueueRequest(({ clientId }) => {
      const currentPlayerStatus = getCurrentPlayerStatus();
      if (!currentPlayerStatus) return;
      DesktopPlayerService.sendPlayerStatus(clientId, currentPlayerStatus);
    });
  }, []);

  useEffect(() => {
    const isBuffering = status.state === PlayerState.BUFFERING;
    const current = { ...status, fullscreen };
    updateStatusContext(current);
    // So it doesn't make too many unnecesary requests
    const debounceTime = isBuffering ? 600 : 200;
    const timeout = setTimeout(() => {
      // Need to do this in separate effects so it doesn't generate any loops
      setStatusHistory((prev) => ({ prev: prev.current, current }));
    }, debounceTime);

    return () => clearTimeout(timeout);
  }, [status, fullscreen]);

  useEffect(() => {
    onStateChanged?.(status.state);
  }, [status.state]);

  useEffect(() => {
    if (!playerRoomId || !DesktopPlayerService.isReady()) return;
    if (!onlineUsers.data.length) return;
    let payload: null | Partial<PlayerStatus> = statusHistory.current;
    if (statusHistory.prev) {
      payload = PlayerUtils.getStatusDifference(statusHistory.prev, statusHistory.current);
    }
    if (!payload) return;
    DesktopPlayerService.sendPlayerStatus(playerRoomId, payload);
  }, [statusHistory]);

  return {
    status: statusHistory.current,
    controls,
  };
};

export default useDesktopPlayer;
