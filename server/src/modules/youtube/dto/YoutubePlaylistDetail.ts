import YoutubeVideoDetail from './YoutubeVideoDetail';

export default interface YoutubePlaylistDetail {
  id: string;
  title: string;
  thumbnail: string;
  channelId: string;
  channelTitle: string;
  channelThumbnail: string;
  itemCount: number;
  publishedAt: string;
  videos: YoutubeVideoDetail[];
}
