import { Controller, Get, Req, Param, Query } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { ApiHeader, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Youtube')
@Controller('youtube')
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Get('/video/:videoId')
  @ApiParam({
    name: 'videoId',
  })
  getVideoDetails(@Param('videoId') videoId: string) {
    return this.youtubeService.getVideoDetails(videoId);
  }

  @Get('/playlist/:playlistId')
  @ApiParam({
    name: 'playlistId',
  })
  getPlaylistDetails(@Param('playlistId') playlistId: string) {
    return this.youtubeService.getPlaylistDetails(playlistId);
  }

  @Get('/playlistItems/:playlistId')
  @ApiParam({
    name: 'playlistId',
  })
  getPlaylistItems(@Param('playlistId') playlistId: string, @Query('pageToken') pageToken: string) {
    return this.youtubeService.getPlaylistItems(playlistId, 50, pageToken);
  }
}
