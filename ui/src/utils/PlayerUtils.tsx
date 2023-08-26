import { PlayerQuality } from '../model/player/PlayerQuality';
import PlayerStatus from '../model/player/PlayerStatus';

export default class PlayerUtils {
  public static getStatusDifference(previous: PlayerStatus, current: PlayerStatus): Partial<PlayerStatus> {
    let difference: Partial<PlayerStatus> = { ...current };
    Object.keys(current).forEach((k) => {
      const key = k as keyof PlayerStatus;
      switch (key) {
        case 'resolutions': {
          const bothEmpty = !previous.resolutions.length && !current.resolutions.length;
          const unchanged = JSON.stringify(previous.resolutions) === JSON.stringify(current.resolutions);
          if (bothEmpty || unchanged) {
            delete difference.resolutions;
          }
          break;
        }
        default: {
          if (previous[key] === current[key]) {
            delete difference[key];
          }
          break;
        }
      }
    });
    return difference;
  }

  public static getResolutionValues = (values: string[]): number[] => {
    const map: Record<string, number> = {
      ['tiny']: 144,
      ['small']: 240,
      ['medium']: 360,
      ['large']: 480,
      ['auto']: -1,
    };
    return values.map((v) => {
      if (v.startsWith('hd')) {
        return Number(v.substring(2));
      }
      return map[v] ?? -1;
    });
  };

  //Reverse operation
  public static getSuggestedResolution = (value: number): PlayerQuality => {
    const map: Record<number, string> = {
      [144]: 'tiny',
      [240]: 'small',
      [360]: 'medium',
      [480]: 'large',
      [720]: 'hd720',
      [1080]: 'hd1080',
      [2160]: 'hd2160',
      [-1]: 'auto',
    };
    return (map[value] || 'auto') as PlayerQuality;
  };
}
