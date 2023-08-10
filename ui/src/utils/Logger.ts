export default class Logger {
  private static log(color: string, background: string, ...objects: object[]) {
    console.log('%c' + objects, `background-color: ${background};color: ${color}`);
  }

  public static info(...objects: (object | string)[]) {
    this.log('#296fa8', '#90cdf4', objects);
  }

  public static warn(...objects: (object | string)[]) {
    this.log('#7f611f', '#f4d990', objects);
  }

  public static danger(...objects: (object | string)[]) {
    this.log('#a82929', '#f49090', objects);
  }

  public static success(...objects: (object | string)[]) {
    this.log('#1f7f2f', '#9ff490', objects);
  }
}
