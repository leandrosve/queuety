import APIService, { APIResponse } from './APIService';

export interface YoutubeVideoDetail {
  id: string;
  title: string;
  embeddable: string;
  channelId: string;
  channelTitle: string;
  channelThumbnail: string;
  viewCount: number;
  duration: number;
  publishedAt: string;
}

export default class YoutubeAPIService extends APIService {
  protected static PATH: string = '/youtube';

  public static async getVideoDetails(videoId: string) {
    return this.get<YoutubeVideoDetail>(`/${videoId}`);
  }

  public static async checkVideoExists(videoId: string) {
    try {
      const res = await fetch(`https://img.youtube.com/vi/${videoId}/sddefault.jpg`, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
        },
      });
      if (res) return true;
    } catch {
      return false;
    }
  }
}
