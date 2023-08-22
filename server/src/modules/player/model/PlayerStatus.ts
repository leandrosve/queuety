export default interface PlayerStatus {
  isReady: boolean;
  duration: number;
  currentTime: number;
  state: PlayerState;
  playbackRate: number;
}

export enum PlayerState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  CUED = 4,
}
