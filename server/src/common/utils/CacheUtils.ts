export default class CacheUtils {
  public static videoDetailsCacheKey(videoId: string) {
    return `video-detail_${videoId}`;
  }
}
