import { YoutubeVideoDetail } from '../../services/api/YoutubeService';

export default interface QueueItem {
  id: string;
  video: YoutubeVideoDetail;
}
