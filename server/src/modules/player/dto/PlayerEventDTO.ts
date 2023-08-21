import { IsNotEmpty, IsIn, IsString, ValidateBy, IsNumber, IsBoolean } from 'class-validator';
import { PlayerEvent, PlayerEventRequest, PlayerEventType } from '../model/PlayerEvents';

export class PlayerEventDTO {
  @IsString()
  @IsIn(Object.values(PlayerEventType))
  type: string;

  event: PlayerEventRequest;
}

export class PlayerEventActionDTO {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNotEmpty({ groups: [PlayerEventType.ADD_LAST, PlayerEventType.ADD_NEXT, PlayerEventType.ADD_NOW] })
  video: YoutubeVideoDetailDTO;

  @IsNotEmpty({ groups: [PlayerEventType.CHANGE_ORDER, PlayerEventType.REMOVE, PlayerEventType.PLAY_NOW] })
  itemId: string;

  @IsNotEmpty({ groups: [PlayerEventType.CHANGE_ORDER] })
  destinationIndex: number;
}

export class YoutubeVideoDetailDTO {
  @IsString()
  @IsNotEmpty()
  id: string;
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  thumbnail: string;
  @IsString()
  @IsNotEmpty()
  channelId: string;
  @IsString()
  @IsNotEmpty()
  channelTitle: string;
  @IsString()
  @IsNotEmpty()
  channelThumbnail: string;
  @IsString()
  @IsNotEmpty()
  publishedAt: string;
  @IsNumber()
  viewCount: number;
  @IsNumber()
  duration: number;
  @IsBoolean()
  embeddable: boolean;
}
