import PlayerState from './PlayerState';

export default interface PlayerStatus {
  isReady: boolean;
  duration: number;
  currentTime: number;
  state: PlayerState;
  videoId: string;
  fullscreen: boolean;
  rate: number;
  volume: number;
}
