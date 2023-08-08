export default class FormatUtils {
  public static formatDuration(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);
    let final = hours > 0 ? `${hours}:` : '';
    final = final + (hours > 0 && minutes < 10 ? `0${minutes}` : minutes.toString()) + ':';
    final = final + (seconds < 10 ? `0${seconds}` : seconds.toString());
    return final;
  }

  public static shortenNumber(number: number): string {
    // 2 decimal places => 100, 3 => 1000, etc
    const decPlaces = Math.pow(10, 1);
    // Enumerate number abbreviations
    var abbrev = ['K', 'M', 'B', 'T'];
    // Go through the array backwards, so we do the largest first
    for (var i = abbrev.length - 1; i >= 0; i--) {
      // Convert array index to "1000", "1000000", etc
      var size = Math.pow(10, (i + 1) * 3);
      // If the number is bigger or equal do the abbreviation
      if (size <= number) {
        // Here, we multiply by decPlaces, round, and then divide by decPlaces.
        // This gives us nice rounding to a particular decimal place.
        number = Math.round((number * decPlaces) / size) / decPlaces;
        // Handle special case where we round up to the next abbreviation
        if (number == 1000 && i < abbrev.length - 1) {
          number = 1;
          i++;
        }
        // Add the letter for the abbreviation
        return `${Math.floor(number)}${abbrev[i]}`;
      }
    }

    return number.toString();
  }
}
