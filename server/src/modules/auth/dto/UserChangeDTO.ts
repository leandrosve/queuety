import { IsNotEmpty, IsString, MaxLength, MinLength, Validate } from 'class-validator';

export class UserChangeDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(3)
  nickname: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  playerRoomId: string;
}
