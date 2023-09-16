export default interface YoutubeVideoDetail {
  id: string;
  title: string;
  thumbnail: string;
  channelId: string;
  channelTitle: string;
  channelThumbnail: string;
  publishedAt: string;
  viewCount: number;
  duration: number;
  embeddable: boolean;
  live: boolean;
}

export type YoutubeVideoDetailCacheItem =
  | undefined
  | {
      missing: true;
    }
  | { missing: false; item: YoutubeVideoDetail };
