import { IsNotEmpty, IsIn, IsString } from 'class-validator';

export class AuthRequestDTO {
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsNotEmpty()
  authRoomId: string;

  @IsNotEmpty()
  userId: string;
}
