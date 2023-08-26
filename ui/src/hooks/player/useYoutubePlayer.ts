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

  const initialize = async () => {
    new YT.Player(containerId, {
      videoId: queueItem.video.id,
      playerVars: {
        autoplay: 1,
        start: 0,
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
    player.playVideo();
    setStatus((p) => ({
      ...p,
      isReady: true,
      duration: player.getDuration() || 0,
      currentTime: player.getCurrentTime() || 0,
      playbackRate: player.getPlaybackRate() || 1,
    }));
  };
  const getVideoIdFromURL = (videoURL?: string) => {
    // expected format: https://www.youtube.com/watch?v=ciTKItglVZk
    return videoURL?.split('v=')[1] || '';
  };

  const onStateChange = (event: YT.OnStateChangeEvent) => {
    const player = event.target;
    let nextStatus: Partial<PlayerInnerStatus> = {
      state: (player.getPlayerState() as PlayerState) || PlayerState.UNSTARTED,
      videoId: getVideoIdFromURL(player?.getVideoUrl()),
      rate: player.getPlaybackRate(),
      volume: player.getVolume(),
    };

    if (event.data !== PlayerState.UNSTARTED) {
      nextStatus.duration = player.getDuration() || 0;
      nextStatus.currentTime = player.getCurrentTime() || 0;
    }

    if (event.data === PlayerState.ENDED) {
      nextStatus.currentTime = player.getCurrentTime() || 0;
    }

    setStatus((p) => {
      return { ...p, ...nextStatus };
    });
  };

  const onPlaybackRateChange = (e: YT.OnPlaybackRateChangeEvent) => {
    setStatus((p) => ({ ...p, playbackRate: e.data }));
  };

  const onTimeChange = (time: number) => {
    console.log('TIME CHANGE', !!playerRef.current, time);
    playerRef.current?.seekTo(time, true);
    playerRef.current?.playVideo();
  };

  const onRateChange = (rate: number) => {
    playerRef.current?.setPlaybackRate(rate);
    setStatus((p) => ({ ...p, rate }));
  };

  const onVolumeChange = (level: number) => {
    playerRef.current?.setVolume(level);
    setStatus((p) => ({ ...p, volume: level }));
  };

  const onPlay = () => {
    playerRef.current?.playVideo();
  };

  const onForward = (seconds: number) => {
    const player = playerRef.current;
    player?.seekTo((player?.getCurrentTime() || 0) + seconds, true);
  };

  const onRewind = (seconds: number) => {
    const player = playerRef.current;
    player?.seekTo((player?.getCurrentTime() || 0) - seconds, true);
  };

  const onPause = () => {
    playerRef.current?.pauseVideo();
  };

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
      volume: player.getVolume(),
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
