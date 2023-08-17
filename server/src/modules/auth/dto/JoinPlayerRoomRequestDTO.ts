import { IsNotEmpty, IsIn, IsString, IsBoolean, Validate, ValidateIf } from 'class-validator';

export class JoinPlayerRoomRequestDTO {
  @IsString()
  @IsNotEmpty()
  playerRoomId: string;
  @IsBoolean()
  host: boolean;
  @IsString()
  @ValidateIf(i => !i.host)
  userId: string;
}
