import { useEffect, useState, useRef, useCallback } from 'react';
import QueueItem from '../../model/player/QueueItem';
import PlayerState from '../../model/player/PlayerState';
import PlayerStatus from '../../model/player/PlayerStatus';

interface PlayerInnerStatus extends Omit<PlayerStatus, 'fullscreen'> {}
const defaultStatus: PlayerInnerStatus = {
  isReady: false,
  currentTime: 0,
  duration: 0,
  videoId: '',
  state: PlayerState.UNSTARTED,
  rate: 1,
  volume: 1,
};
/**
 *
 * @param containerId the ID of the container that will become the iframe
 * @param queueItem the item to play, it's important to differentiate between different items even if they are the same video
 */
const useYoutubePlayer = (containerId: string, queueItem: QueueItem, onVideoEnded: () => void) => {
  const playerRef = useRef<YT.Player>();
  const [initialized, setInitialized] = useState<boolean>(false);
  const [status, setStatus] = useState<PlayerInnerStatus>(defaultStatus);
  const [isFocused, setIsFocused] = useState(false);

  const initialize = async () => {
    new YT.Player(containerId, {
      videoId: queueItem.video.id,
      playerVars: {
        autoplay: 1,
        start: 0,
        rel: 0,
        loop: 1,
        mute: 0, // N.B. here the mute settings.
      },
      events: {
        onReady,
        onStateChange,
        onPlaybackRateChange,
      },
    });
  };

  const onReady = (event: YT.PlayerEvent) => {
    const player = event.target;
    playerRef.current = event.target;
    setStatus((p) => ({
      ...p,
      isReady: true,
      duration: player.getDuration() || 0,
      currentTime: player.getCurrentTime() || 0,
      rate: player.getPlaybackRate() || 1,
    }));
  };
  const getVideoIdFromURL = (videoURL?: string) => {
    // expected format: https://www.youtube.com/watch?v=ciTKItglVZk
    return videoURL?.split('v=')[1] || '';
  };

  const onStateChange = useCallback(
    (event: YT.OnStateChangeEvent) => {
      const player = event.target;
      let nextStatus: Partial<PlayerInnerStatus> = {
        state: (player.getPlayerState() as PlayerState) ?? PlayerState.UNSTARTED,
        videoId: getVideoIdFromURL(player?.getVideoUrl()),
        rate: player.getPlaybackRate(),
        volume: player.isMuted() ? 0 : player.getVolume(),
      };

      if (event.data !== PlayerState.UNSTARTED) {
        nextStatus.duration = player.getDuration() || 0;
        nextStatus.currentTime = player.getCurrentTime() || 0;
      }

      if (event.data === PlayerState.ENDED) {
        nextStatus.currentTime = player.getDuration() || 0;
        onVideoEnded();
      }

      setStatus((p) => {
        return { ...p, ...nextStatus };
      });
    },
    [playerRef]
  );

  const onPlaybackRateChange = useCallback((e: YT.OnPlaybackRateChangeEvent) => {
    const player = playerRef.current;
    if (!player) return;
    setStatus((p) => ({ ...p, rate: e.data, currentTime: player.getCurrentTime() }));
  }, []);

  const onTimeChange = useCallback(
    (time: number) => {
      const player = playerRef.current;
      if (!player) return;
      player.seekTo(time, true);
      if (time < Math.floor(player.getDuration())) {
        console.log("PLAY VIDEO", time, player.getDuration());
        player.playVideo();
      }
    },
    [playerRef]
  );

  const onRateChange = useCallback(
    (rate: number) => {
      playerRef.current?.setPlaybackRate(rate);
      setStatus((p) => ({ ...p, rate }));
    },
    [playerRef]
  );

  const onVolumeChange = useCallback(
    (level: number) => {
      playerRef.current?.setVolume(level);
      if (level > 0) playerRef.current?.unMute();
      setStatus((p) => ({ ...p, volume: level }));
    },
    [playerRef]
  );

  const onPlay = useCallback(() => {
    playerRef.current?.playVideo();
  }, [playerRef]);

  const onForward = useCallback(
    (seconds: number) => {
      const player = playerRef.current;
      player?.seekTo((player?.getCurrentTime() || 0) + seconds, true);
    },
    [playerRef]
  );

  const onRewind = useCallback(
    (seconds: number) => {
      const player = playerRef.current;
      player?.seekTo((player?.getCurrentTime() || 0) - seconds, true);
    },
    [playerRef]
  );

  const onPause = useCallback(() => {
    playerRef.current?.pauseVideo();
  }, [playerRef]);

  const checkVolume = useCallback(() => {
    const player = playerRef.current;
    const vol = player?.isMuted() ? 0 : player?.getVolume();
    setStatus((p) => {
      if (p.volume == vol) return p;
      return { ...p, volume: vol ?? p.volume };
    });
  }, [playerRef]);

  const getCurrentPlayerStatus = useCallback((): PlayerInnerStatus | null => {
    const player = playerRef.current;
    if (!player) return null;
    return {
      state: player.getPlayerState(),
      currentTime: player.getCurrentTime(),
      duration: player.getDuration(),
      isReady: true,
      videoId: getVideoIdFromURL(player.getVideoUrl()),
      rate: player.getPlaybackRate(),
      volume: player.isMuted() ? 0 : player.getVolume(),
    };
  }, [playerRef]);

  useEffect(() => {
    if (status.isReady && queueItem) {
      setStatus((p) => ({ ...p, currentTime: 0 }));
      playerRef.current?.stopVideo();
      playerRef.current?.loadVideoById(queueItem.video.id, 0.01);
      playerRef.current?.playVideo();
    }
  }, [queueItem]);

  useEffect(() => {
    if (initialized || !queueItem) return;
    initialize();
    setInitialized(true);
  }, [queueItem]);

  useEffect(() => {
    window.addEventListener('focusin', () => {
      setTimeout(() => setIsFocused(document.activeElement?.id == 'player-container'), 300);
    });
    window.addEventListener('blur', () => {
      setTimeout(() => setIsFocused(document.activeElement?.id == 'player-container'), 300);
    });
  }, []);

  useEffect(() => {
    let interval: number;
    if (isFocused) {
      interval = setInterval(checkVolume, 1000);
    } else {
      setTimeout(checkVolume, 500);
    }
    return () => clearInterval(interval);
  }, [isFocused]);

  return {
    ref: playerRef,
    getCurrentPlayerStatus,
    status,
    controls: {
      onTimeChange,
      onPlay,
      onPause,
      onForward,
      onRewind,
      onRateChange,
      onVolumeChange,
    },
  };
};

export default useYoutubePlayer;
