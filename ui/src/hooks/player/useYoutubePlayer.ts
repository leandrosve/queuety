import { RefObject, useEffect, useState, useRef } from 'react';

const useYoutubePlayer = (containerId: string, videoId: string) => {
  const playerRef = useRef<YT.Player>();
  const [isReady, setIsReady] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [state, setState] = useState<YT.PlayerState>(YT.PlayerState.UNSTARTED);

  const initialize = async () => {
    new YT.Player(containerId, {
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        loop: 1,
        mute: 0, // N.B. here the mute settings.
      },
      events: {
        onReady,
        onStateChange,
      },
    });
  };

  const onReady = (event: YT.PlayerEvent) => {
    setIsReady(true);
    playerRef.current = event.target;
    playerRef.current.playVideo();
    setDuration(playerRef.current.getDuration() || 0);
    setCurrentTime(playerRef.current.getCurrentTime() || 0);
  };

  const onStateChange = (event: YT.OnStateChangeEvent) => {
    setCurrentTime(playerRef.current?.getCurrentTime() || 0);
    setDuration(playerRef.current?.getDuration() || 0);

    setState(playerRef.current?.getPlayerState() || YT.PlayerState.UNSTARTED);
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
    if (isReady) {
      console.log('NO PLEASE');
      playerRef.current?.loadVideoById(videoId);
    }
  }, [videoId]);

  useEffect(() => {
    initialize();
  }, []);

  return {
    ref: playerRef,
    isReady,
    duration,
    currentTime,
    state,
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
