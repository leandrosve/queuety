export default class FormatUtils {
  /**
   *
   * @param isoString example: "PT#H#M#S" or "PT14M33S"
   */
  public static iso8601ToSeconds(isoString: string) {
    if (isoString === 'P0D') return 0; // Livestream
    let totalSeconds = 0;
    isoString = isoString.split('PT')[1];
    const units = ['H', 'M', 'S'];
    const multipliers = [3600, 60, 1];
    for (let i = 0; i < units.length; i++) {
      const unit = units[i];
      const multiplier = multipliers[i];
      const parts = isoString.split(unit);
      if (parts.length > 1) {
        totalSeconds += Number(parts[0]) * multiplier;
        isoString = parts[1];
      }
    }
    return totalSeconds;
  }
}
