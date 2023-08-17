import { IsNotEmpty, IsIn, IsString, IsBoolean } from 'class-validator';

export class JoinPlayerRoomRequestDTO {
  @IsString()
  @IsNotEmpty()
  playerRoomId: string;
  @IsBoolean()
  host: boolean;
  @IsBoolean()
  userId: string;
}
