import { Injectable, Inject, Logger, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map, pluck } from 'rxjs';
import 'dotenv/config';
import CacheUtils from 'src/common/utils/CacheUtils';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import YoutubeVideoDetail, { YoutubeVideoDetailCacheItem } from './dto/YoutubeVideoDetail';
import FormatUtils from 'src/common/utils/FormatUtils';

@Injectable()
export class YoutubeService {
  private readonly logger = new Logger(YoutubeService.name);
  private readonly YOUTUBE_DATA_API_KEY: string;
  constructor(private readonly httpService: HttpService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.YOUTUBE_DATA_API_KEY = process.env.YOUTUBE_DATA_API || '';
  }

  async getVideoDetails(videoId: string) {
    const cacheKey = CacheUtils.videoDetailsCacheKey(videoId);
    const cached: YoutubeVideoDetailCacheItem = await this.cacheManager.get(cacheKey);
    if (cached) {
      if (cached.missing) {
        this.logger.warn(`Video '${videoId}' was found as missing in cache`);
        throw new BadRequestException({ error: 'video_not_found' });
      }
      this.logger.log(`Found video '${videoId}' in cache`);
      return cached.item;
    }
    const detail: YoutubeVideoDetail | null = await this.retrieveVideoDetails(videoId);
    await this.cacheManager.set(
      cacheKey,
      { missing: !detail, item: detail },
      7_200_000 // 2 hour
    );

    if (!detail) throw new BadRequestException({ error: 'video_not_found' });
    return detail;
  }

  private async retrieveChannelThumbnail(channelId: string): Promise<string> {
    this.logger.log(`Feching channel '${channelId}' from Youtube Data API`);
    const params = `part=snippet&id=${channelId}`;
    const res = await this.makeYoutubeRequest('channels', params);
    const rawItem = res?.items?.[0];
    return rawItem.snippet.thumbnails.default.url;
  }

  private async retrieveVideoDetails(videoId: string): Promise<YoutubeVideoDetail | null> {
    const params = `part=id,snippet,status,statistics,contentDetails&id=${videoId}`;
    this.logger.log(`Feching video '${videoId}' from Youtube Data API`);
    const res = await this.makeYoutubeRequest('videos', params);
    const rawItem = res?.items?.[0];
    if (!rawItem) return null;
    const channelThumbnail = await this.retrieveChannelThumbnail(rawItem.snippet.channelId);
    return {
      id: rawItem.id,
      title: rawItem.snippet.title,
      embeddable: rawItem.status.embeddable,
      channelId: rawItem.snippet.channelId,
      channelThumbnail: channelThumbnail,
      channelTitle: rawItem.snippet.channelTitle,
      viewCount: Number(rawItem.statistics.viewCount),
      duration: FormatUtils.iso8601ToSeconds(rawItem.contentDetails.duration),
      publishedAt: rawItem.snippet.publishedAt,
    };
  }

  private async makeYoutubeRequest(path: string, params: string) {
    return await firstValueFrom(
      this.httpService
        .get(`https://youtube.googleapis.com/youtube/v3/${path}?${params}&key=${this.YOUTUBE_DATA_API_KEY}`)
        .pipe(map((res) => res.data))
        .pipe(
          catchError(() => {
            throw new BadRequestException({ error: 'youtube_api_error' });
          })
        )
    );
  }
}
