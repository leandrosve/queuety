import { Injectable, Inject, Logger, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map, pluck } from 'rxjs';
import 'dotenv/config';
import CacheUtils from 'src/common/utils/CacheUtils';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import YoutubeVideoDetail, { YoutubeVideoDetailCacheItem } from './dto/YoutubeVideoDetail';
import FormatUtils from 'src/common/utils/FormatUtils';
import YoutubePlaylistDetail from './dto/YoutubePlaylistDetail';
import YoutubePaginatedPlaylistItems from './dto/YoutubePaginatedPlaylistItems';

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

  async getPlaylistDetails(playlistId: string) {
    const cacheKey = CacheUtils.playlistDetailsCacheKey(playlistId);
    const cached: YoutubeVideoDetailCacheItem = await this.cacheManager.get(cacheKey);
    if (cached) {
      if (cached.missing) {
        this.logger.warn(`Playlist '${playlistId}' was found as missing in cache`);
        throw new BadRequestException({ error: 'video_not_found' });
      }
      this.logger.log(`Found playlist '${playlistId}' in cache`);
      return cached.item;
    }
    const detail: YoutubeVideoDetail | null = await this.retrievePlaylistDetails(playlistId);
    await this.cacheManager.set(
      cacheKey,
      { missing: !detail, item: detail },
      7_200_000 // 2 hour
    );

    if (!detail) throw new BadRequestException({ error: 'video_not_found' });
    return detail;
  }

  private async retrieveChannelThumbnail(channelId: string): Promise<string | undefined> {
    return (await this.retrieveChannelListThumbnails([channelId])).get(channelId);
  }

  private async retrieveChannelListThumbnails(channelIds: string[]): Promise<Map<string, string>> {
    this.logger.log(`Feching channels '${channelIds}' from Youtube Data API`);
    const params = `part=snippet&id=${channelIds.join(',')}`;
    const res = await this.makeYoutubeRequest('channels', params);
    const channels = res?.items;
    const map = new Map();
    if (!channels.length) return map;
    channels.forEach((channel: any) => {
      map.set(channel.id, channel.snippet.thumbnails.default.url);
    });
    return map;
  }

  private async retrieveVideoDetails(videoId: string): Promise<YoutubeVideoDetail | null> {
    const params = `part=id,snippet,status,statistics,contentDetails&id=${videoId}`;
    this.logger.log(`Feching video '${videoId}' from Youtube Data API`);
    const res = await this.makeYoutubeRequest('videos', params);
    const rawItem = res?.items?.[0];
    if (!rawItem) return null;
    const channelThumbnail = await this.retrieveChannelThumbnail(rawItem.snippet.channelId);
    const videoThumbnails = rawItem.snippet.thumbnails;
    return {
      id: rawItem.id,
      title: rawItem.snippet.title,
      embeddable: rawItem.status.embeddable,
      channelId: rawItem.snippet.channelId,
      channelThumbnail: channelThumbnail ?? '',
      channelTitle: rawItem.snippet.channelTitle,
      thumbnail: (videoThumbnails.standard ?? videoThumbnails.default).url,
      viewCount: Number(rawItem.statistics.viewCount),
      duration: FormatUtils.iso8601ToSeconds(rawItem.contentDetails.duration),
      publishedAt: rawItem.snippet.publishedAt,
      live: rawItem.snippet.liveBroadcastContent === 'live',
    };
  }

  private async retrievePlaylistDetails(playlistId: string): Promise<YoutubeVideoDetail | null> {
    const params = `part=id,snippet,status,contentDetails&id=${playlistId}`;
    this.logger.log(`Feching playlist '${playlistId}' from Youtube Data API`);
    const res = await this.makeYoutubeRequest('playlists', params);
    const rawItem = res?.items?.[0];
    if (!rawItem) return null;
    const channelThumbnail = await this.retrieveChannelThumbnail(rawItem.snippet.channelId);
    const videoThumbnails = rawItem.snippet.thumbnails;
    const thumbnail = (videoThumbnails.standard ?? videoThumbnails.default).url;
    return {
      id: rawItem.id,
      title: rawItem.snippet.title,
      channelId: rawItem.snippet.channelId,
      channelThumbnail: channelThumbnail ?? '',
      channelTitle: rawItem.snippet.channelTitle,
      thumbnail: thumbnail,
      itemCount: Number(rawItem.contentDetails.itemCount),
      publishedAt: rawItem.snippet.publishedAt,
      viewCount: 0,
      duration: 0,
      live: false,
      embeddable: true,
      isPlaylist: true,
      items: [],
    };
  }

  private async retrievePlaylistItemIds(
    playlistId: string,
    maxResults: number,
    pageToken?: string
  ): Promise<{
    itemIds: string[];
    nextPageToken: string | null;
  }> {
    let params = `part=contentDetails&playlistId=${playlistId}&maxResults=${maxResults}`;
    if (pageToken) params += `&pageToken=${pageToken}`;
    this.logger.log(`Feching playlist item ids'${playlistId}' from Youtube Data API`);
    const res = await this.makeYoutubeRequest('playlistItems', params);
    const items = res?.items;
    console.log(items);
    if (!items?.length) return { itemIds: [], nextPageToken: null };
    return {
      itemIds: items.map((rawItem: any) => rawItem.contentDetails.videoId),
      nextPageToken: res?.nextPageToken,
    };
  }

  private async retrieveVideoListDetails(videoIds: string[]): Promise<YoutubeVideoDetail[]> {
    const params = `part=id,snippet,status,statistics,contentDetails&id=${videoIds.join(',')}`;
    this.logger.log(`Feching videos '${videoIds}' from Youtube Data API`);
    const res = await this.makeYoutubeRequest('videos', params);
    const rawItems = res?.items ?? [];
    const channelIds = rawItems.map((video: any) => video.snippet.channelId);
    const channelThumbnails = await this.retrieveChannelListThumbnails(channelIds);
    return rawItems.map((item: any) => {
      const videoThumbnails = item.snippet.thumbnails;
      return {
        id: item.id,
        title: item.snippet.title,
        embeddable: item.status.embeddable,
        channelId: item.snippet.channelId,
        channelThumbnail: channelThumbnails.get(item.snippet.channelId) ?? '',
        channelTitle: item.snippet.channelTitle,
        thumbnail: (videoThumbnails.standard ?? videoThumbnails.default).url,
        viewCount: Number(item.statistics.viewCount),
        duration: FormatUtils.iso8601ToSeconds(item.contentDetails.duration),
        publishedAt: item.snippet.publishedAt,
        live: item.snippet.liveBroadcastContent === 'live',
      };
    });
  }

  async getPlaylistItems(playlistId: string, maxResults: number, pageToken?: string): Promise<YoutubePaginatedPlaylistItems> {
    const pageTokenShort = pageToken?.substring(0, 10) ?? '0';
    const cacheKey = CacheUtils.playlistItemsCacheKey(playlistId, pageTokenShort, maxResults);
    const cached: YoutubePaginatedPlaylistItems | undefined = await this.cacheManager.get(cacheKey);

    if (cached) {
      this.logger.log(`Found items for playlistId: ${playlistId} and pageToken: ${pageTokenShort} in cache`);
      return cached;
    }

    const { itemIds, nextPageToken } = await this.retrievePlaylistItemIds(playlistId, maxResults, pageToken);

    let res: YoutubePaginatedPlaylistItems;
    if (!itemIds.length) {
      res = { items: [], nextPageToken: null };
    } else {
      res = {
        items: await this.retrieveVideoListDetails(itemIds),
        nextPageToken,
      };
    }

    await this.cacheManager.set(
      cacheKey,
      res,
      1_800_000 // 30min
    );
    return res;
  }

  private async makeYoutubeRequest(path: string, params: string) {
    return await firstValueFrom(
      this.httpService
        .get(`https://youtube.googleapis.com/youtube/v3/${path}?${params}&key=${this.YOUTUBE_DATA_API_KEY}`)
        .pipe(map((res) => res.data))
        .pipe(
          catchError((e) => {
            this.logger.error('Youtube API error: ' + JSON.stringify(e));
            throw new BadRequestException({ error: 'youtube_api_error' });
          })
        )
    );
  }
}
