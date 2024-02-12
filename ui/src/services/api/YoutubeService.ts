import APIService from './APIService';

export interface YoutubeVideoDetail {
  id: string;
  title: string;
  thumbnail: string;
  embeddable: boolean;
  channelId: string;
  channelTitle: string;
  channelThumbnail: string;
  viewCount: number;
  duration: number;
  publishedAt: string;
  live: boolean;
  isPlaylist: boolean;
  itemCount?: number;
  playlistItems?: [];
}

export interface YoutubePlaylistDetail {
  id: string;
  title: string;
  thumbnail: string;
  channelId: string;
  channelTitle: string;
  channelThumbnail: string;
  itemCount: number;
  publishedAt: string;
}

export interface YoutubePlaylistItem {
  playlistId: string,
  detail: YoutubeVideoDetail,
  index: number,
}

export default class YoutubeService extends APIService {
  protected static PATH: string = '/youtube';

  public static async getVideoDetails(videoId: string) {
    return this.get<YoutubeVideoDetail>(`/video/${videoId}`);
  }

  public static async getPlaylistDetails(playlistId: string) {
    return this.get<YoutubeVideoDetail>(`/playlist/${playlistId}`);
  }

  public static async getPlaylistItems(playlistId: string) {
    return this.get<{ items: YoutubeVideoDetail[]; nextPageToken: string }>(`/playlistItems/${playlistId}`);
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
