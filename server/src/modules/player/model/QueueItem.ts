import YoutubeVideoDetail from 'src/modules/youtube/dto/YoutubeVideoDetail';

export default interface QueueItem {
  id: string;
  video: YoutubeVideoDetail;
}
