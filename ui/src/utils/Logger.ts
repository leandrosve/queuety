export default class Logger {
  private static log(color: string, background: string, objects: any[]) {
    console.log('%c' + objects.map(o => o instanceof Object ? JSON.stringify(o, null, 4) : o).join(", "),  `background-color: ${background};color: ${color}`);
  }

  public static info(...objects: any[]) {
    this.log('#296fa8', '#90cdf4', objects);
  }

  public static warn(...objects: any[]) {
    this.log('#7f611f', '#f4d990', objects);
  }

  public static danger(...objects: any[]) {
    this.log('#a82929', '#f49090', objects);
  }

  public static success(...objects: any[]) {
    this.log('#1f7f2f', '#9ff490', objects);
  }
}
