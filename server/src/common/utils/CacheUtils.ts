export default class CacheUtils {
  public static videoDetailsCacheKey(videoId: string) {
    return `video-detail_${videoId}`;
  }

  public static playlistDetailsCacheKey(playlistId: string) {
    return `playlist-detail_${playlistId}`;
  }

  public static playlistItemsCacheKey(playlistId: string, pageToken: string, maxResults: number) {
    return `playlist-detail_${playlistId}_${pageToken}_${maxResults}`;
  }
}
