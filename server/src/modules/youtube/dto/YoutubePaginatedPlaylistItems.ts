import YoutubeVideoDetail from './YoutubeVideoDetail';

export default interface YoutubePaginatedPlaylistItems {
  items: YoutubeVideoDetail[];
  nextPageToken: string | null;
}
