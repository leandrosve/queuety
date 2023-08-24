import i18next from 'i18next';

export default class FormatUtils {
  private static DATE_UNITS = {
    year: 31_536_000,
    month: 2_592_000,
    week: 604_800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

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

  public static timeAgo(date: Date) {
    let lang = i18next.language;
    if (!['en', 'es', 'pt', 'ja'].includes(lang)) lang = 'en';
    const secondsDiff = (Date.now() - date.getTime()) / 1000;
    let value: number = 0;
    let timeUnit: Intl.RelativeTimeFormatUnit = 'day';
    for (const [unit, secondsInUnit] of Object.entries(this.DATE_UNITS)) {
      if (secondsDiff >= secondsInUnit || unit === 'second') {
        value = Math.floor(secondsDiff / secondsInUnit) * -1;
        timeUnit = unit as Intl.RelativeTimeFormatUnit;
        break;
      }
    }

    const formatter = new Intl.RelativeTimeFormat([lang], { numeric: 'always', style: 'long', localeMatcher: 'lookup' });
    return formatter.format(value, timeUnit);
  }

  public static shortenNumber(number: number): string {
    const decPlaces = Math.pow(10, 1);
    var abbrev = ['K', 'M', 'B', 'T'];
    for (var i = abbrev.length - 1; i >= 0; i--) {
      var size = Math.pow(10, (i + 1) * 3);
      if (size <= number) {
        number = Math.round((number * decPlaces) / size) / decPlaces;
        if (number == 1000 && i < abbrev.length - 1) {
          number = 1;
          i++;
        }
        return `${Math.floor(number)}${abbrev[i]}`;
      }
    }
    return number.toString();
  }

  public static shortenUserId(userId: string): string {
    return `#${userId.slice(-5)}`;
  }

  public static getColorForNickname = (nickname: string) => {
    const COLORS = ['purple', 'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'cyan', 'pink'];
    let hash = 0;
    if (!nickname) return 'teal';
    for (var i = 0; i < nickname.length; i++) {
      hash = nickname.charCodeAt(i) + hash;
    }
    const position = hash % 9;
    return COLORS[position];
  };
}
