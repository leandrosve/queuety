import { Controller, Get, Req, Param } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { ApiHeader, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Youtube')
@Controller('youtube')
export class YoutubeController {
  constructor(
    private readonly youtubeService: YoutubeService,
    
  ) {}

  @Get('/:videoId')
  @ApiParam({
    name: 'videoId',
  })
  getVideoDetails(@Param('videoId') videoId: string) {
    return this.youtubeService.getVideoDetails(videoId);
  }
}
