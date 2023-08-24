import { useEffect, useState, useRef, useCallback } from 'react';
import { usePlayerStatusContext } from '../../context/PlayerStatusContext';
import QueueItem from '../../model/player/QueueItem';
import PlayerState from '../../model/player/PlayerState';
import PlayerStatus from '../../model/player/PlayerStatus';

/**
 *
 * @param containerId the ID of the container that will become the iframe
 * @param queueItem the item to play, it's important to differentiate between different items even if they are the same video
 */
const useYoutubePlayer = (containerId: string, queueItem: QueueItem, onVideoEnded: () => void) => {
  const playerRef = useRef<YT.Player>();
  const [isReady, setIsReady] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [state, setState] = useState<PlayerState>(PlayerState.UNSTARTED);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [initialized, setInitialized] = useState(false);

  const { updateStatus } = usePlayerStatusContext();

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
    setIsReady(true);
    playerRef.current = event.target;
    playerRef.current.playVideo();
    setDuration(playerRef.current.getDuration() || 0);
    setCurrentTime(playerRef.current.getCurrentTime() || 0);
    setPlaybackRate(playerRef.current.getPlaybackRate() || 1);
  };

  const onStateChange = (event: YT.OnStateChangeEvent) => {
    setState((playerRef.current?.getPlayerState() as PlayerState) || PlayerState.UNSTARTED);
    if (event.data !== PlayerState.UNSTARTED) {
      setDuration(playerRef.current?.getDuration() || 0);
      setCurrentTime(playerRef.current?.getCurrentTime() || 0);
    }

    if (event.data === PlayerState.ENDED) {
      setCurrentTime(playerRef.current?.getDuration() || 0);
      onVideoEnded();
    }
  };

  const onPlaybackRateChange = (e: YT.OnPlaybackRateChangeEvent) => {
    setPlaybackRate(e.data);
  };

  const onTimeChange = (time: number) => {
    playerRef.current?.seekTo(time, true);
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

  const getCurrentPlayerStatus = useCallback((): PlayerStatus | null => {
    const player = playerRef.current;
    if (!player) return null;
    return {
      state: player.getPlayerState(),
      currentTime: player.getCurrentTime(),
      duration: player.getDuration(),
      isReady: true,
      playbackRate: player.getPlaybackRate(),
    };
  }, [playerRef]);

  useEffect(() => {
    if (isReady && queueItem) {
      setCurrentTime(0);
      playerRef.current?.stopVideo();
      playerRef.current?.loadVideoById(queueItem.video.id, 0.01);
    }
  }, [queueItem]);

  useEffect(() => {
    updateStatus({ state, currentTime, playbackRate, duration, isReady });
  }, [state, currentTime, playbackRate, duration, isReady]);

  useEffect(() => {
    if (initialized || !queueItem) return;
    initialize();
    setInitialized(true);
  }, [queueItem]);

  return {
    ref: playerRef,
    getCurrentPlayerStatus,
    status: {
      isReady,
      duration,
      currentTime,
      state,
      playbackRate,
    },
    controls: {
      onTimeChange,
      onPlay,
      onPause,
      onForward,
      onRewind,
    },
  };
};

export default useYoutubePlayer;
