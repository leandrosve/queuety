import Logger from '../../utils/Logger';

type APISuccessfulResponse<T> = {
  status: number;
  data: T;
  hasError: false;
};

type APIErrorResponse<T> = {
  status: number;
  data?: T;
  error: string;
  hasError: true;
};
export type APIResponse<T> = APIErrorResponse<T> | APISuccessfulResponse<T>;

interface Options {
  preventSignOut?: boolean;
  public?: boolean;
  headers?: Record<string, string>;
}

export default class APIService {
  protected static BASE_URL = 'http://192.168.0.226:3334/api';

  protected static PATH: string;

  protected static token?: string;

  public static initialize() {
    this.token = 'Not now';
  }

  protected static delay(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
  }

  // COMMON METHODS HERE
  private static async doFetch<T>(method: string, path: string, params?: string, body?: any, options?: Options): Promise<APIResponse<T>> {
    const headers: HeadersInit = new Headers();
    headers.set('Content-Type', 'application/json');
    if (!options?.public && this.token) headers.set('token', this.token);

    const url = `${this.BASE_URL}${this.PATH || ''}${path || ''}${params ? '?' + params : ''}`;
    try {
      const res = await fetch(url, {
        method: method,
        headers: headers,
        body: JSON.stringify(body),
      });

      const responseBody = await res.json();
      if (res.ok) {
        return { status: res.status, data: responseBody as T, hasError: false } as APISuccessfulResponse<T>;
      }
      //console.log(res);
      if (res.status == 401 && !options?.preventSignOut) {
        //Log out or desasociate from current session
      }
      return { status: res.status, error: responseBody['error'] || 'unknown', hasError: true } as APIErrorResponse<T>;
    } catch (err) {
      Logger.danger(err);
      return { status: 400, hasError: true, error: 'unknown' };
    }
  }

  protected static get<T>(path: string, params?: string) {
    return this.doFetch<T>('GET', path, params);
  }

  protected static post<T>(path: string, body?: any, options?: Options) {
    return this.doFetch<T>('POST', path, undefined, body, options);
  }

  protected static patch<T>(path: string, body?: any, options?: Options) {
    return this.doFetch<T>('PATCH', path, undefined, body, options);
  }
}
