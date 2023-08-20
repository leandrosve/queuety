import { IsNotEmpty, IsIn, IsString, IsBoolean, Validate, ValidateIf, MaxLength } from 'class-validator';

export class JoinAuthRoomRequestDTO {
  @IsString()
  @IsNotEmpty()
  authRoomId: string;
  @IsBoolean()
  host: boolean;
  @IsString()
  @ValidateIf((i) => !i.host)
  userId: string;
}
