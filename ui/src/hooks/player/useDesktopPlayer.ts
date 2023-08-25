import { useCallback, useEffect, useState } from 'react';
import { usePlayerStatusContext } from '../../context/PlayerStatusContext';
import DesktopPlayerService from '../../services/api/player/DesktopPlayerService';
import PlayerState from '../../model/player/PlayerState';
import useYoutubePlayer from './useYoutubePlayer';
import QueueItem from '../../model/player/QueueItem';
import PlayerStatus from '../../model/player/PlayerStatus';
import { PlayerStatusAction, PlayerStatusActionType } from '../../model/player/PlayerActions';
import Logger from '../../utils/Logger';

export interface PlayerControls {
  onTimeChange: (time: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onForward: (seconds: number) => void;
  onRewind: (seconds: number) => void;
}

export interface PlayerExtraStatus {
  fullscreen: boolean;
}

export interface PlayerExtraControls {
  onFullscreenChange: (value: boolean) => void;
}

export interface PlayerExtraOptions {
  status: PlayerExtraStatus;
  controls: PlayerExtraControls;
}

const useDesktopPlayer = (
  playerRoomId: string,
  currentItem: QueueItem,
  onVideoEnded: () => void
): { status: PlayerStatus; controls: PlayerControls; extraOptions: PlayerExtraOptions } => {
  const { status } = usePlayerStatusContext();
  const { controls, getCurrentPlayerStatus } = useYoutubePlayer('player-container', currentItem, onVideoEnded);
  const [lastPlayerAction, setLastPlayerAction] = useState<PlayerStatusAction>();
  const [extraStatus, setExtraStatus] = useState<PlayerExtraStatus>({ fullscreen: false });

  const onPlayerStatusAction = useCallback(
    (action: PlayerStatusAction) => {
      Logger.info(`Received player status action`, action, action.type);
      if (!action.type) return;
      switch (action.type) {
        case PlayerStatusActionType.PLAY:
          controls.onPlay();
          break;
        case PlayerStatusActionType.PAUSE:
          controls.onPause();
          break;
        case PlayerStatusActionType.CHANGE_TIME:
          controls.onTimeChange(action.payload.time);
          controls.onPlay();
          break;
        case PlayerStatusActionType.CHANGE_FULLSCREEN:
          onFullscreenChange(action.payload.value);
          break;
        default:
          break;
      }
    },
    [controls]
  );

  const onFullscreenChange = useCallback((fullscreen: boolean) => {
    setExtraStatus((p) => ({ ...p, fullscreen }));
  }, []);

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
    if (!playerRoomId || !DesktopPlayerService.isReady()) return;
    const isBuffering = status.state === PlayerState.BUFFERING;
    const timeoutTime = isBuffering ? 600 : 200;
    const timeout = setTimeout(() => {
      DesktopPlayerService.sendPlayerStatus(playerRoomId, status);
    }, timeoutTime);
    return () => clearTimeout(timeout);
  }, [status]);
  return {
    status,
    controls,
    extraOptions: {
      status: extraStatus,
      controls: {
        onFullscreenChange,
      },
    },
  };
};

export default useDesktopPlayer;
