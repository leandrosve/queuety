import PlayerStatus from '../model/player/PlayerStatus';

export default class PlayerUtils {
  public static getStatusDifference(previous: PlayerStatus, current: PlayerStatus): Partial<PlayerStatus> | null {
    let difference: Partial<PlayerStatus> = { ...current };
    Object.keys(current).forEach((k) => {
      const key = k as keyof PlayerStatus;
      if (previous[key] === current[key]) {
        delete difference[key];
      }
    });
    let hasChanged = Object.keys(difference).length > 0;
    if (!hasChanged) return null;
    if (difference.currentTime !== undefined) {
      difference.state = current.state;
    }
    return difference;
  }
}
