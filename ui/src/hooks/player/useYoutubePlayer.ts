import { RefObject, useEffect, useState, useRef } from 'react';
import { usePlayerStatusContext } from '../../context/PlayerStatusContext';
import { usePlayerQueueContext } from '../../context/PlayerQueueContext';
import QueueItem from '../../model/player/QueueItem';

/**
 *
 * @param containerId the ID of the container that will become the iframe
 * @param queueItem the item to play, it's important to differentiate between different items even if they are the same video
 */
const useYoutubePlayer = (containerId: string, queueItem: QueueItem) => {
  const playerRef = useRef<YT.Player>();
  const [isReady, setIsReady] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [state, setState] = useState<YT.PlayerState>(YT.PlayerState.UNSTARTED);
  const [playbackRate, setPlaybackRate] = useState<number>(1);

  const { updateStatus } = usePlayerStatusContext();
  const { goNext } = usePlayerQueueContext();

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
    setState(playerRef.current?.getPlayerState() || YT.PlayerState.UNSTARTED);
    if (event.data !== YT.PlayerState.UNSTARTED) {
      setDuration(playerRef.current?.getDuration() || 0);
      setCurrentTime(playerRef.current?.getCurrentTime() || 0);
    }

    if (event.data === YT.PlayerState.ENDED) {
      setCurrentTime(playerRef.current?.getDuration() || 0);
      goNext();
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

  useEffect(() => {
    if (isReady && queueItem) {
      setCurrentTime(0);
      playerRef.current?.stopVideo();
      playerRef.current?.loadVideoById(queueItem.video.id, 0.01);
    }
  }, [queueItem]);

  // Esto ta mal
  useEffect(() => {
    updateStatus({ state, currentTime, playbackRate });
  }, [state, currentTime]);

  useEffect(() => {
    initialize();
  }, []);

  return {
    ref: playerRef,
    isReady,
    duration,
    currentTime,
    state,
    playbackRate,
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
