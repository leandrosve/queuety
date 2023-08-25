import PlayerState from './PlayerState';

export default interface PlayerStatus {
  isReady: boolean;
  duration: number;
  currentTime: number;
  state: PlayerState;
  playbackRate: number;
  videoId: string;
}
