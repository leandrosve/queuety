import { IsNotEmpty, IsIn, IsString, IsBoolean, Validate, ValidateIf, MaxLength } from 'class-validator';

export class JoinPlayerRoomRequestDTO {
  @IsString()
  @IsNotEmpty()
  playerRoomId: string;
  @IsBoolean()
  host: boolean;
  @IsString()
  @ValidateIf(i => !i.host)
  userId: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ValidateIf(o => !o.host)
  nickname:string;
}
