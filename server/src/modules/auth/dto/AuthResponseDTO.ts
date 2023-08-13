import { IsNotEmpty, IsIn, IsString } from 'class-validator';

export class AuthResponseDTO {
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsNotEmpty()
  @IsIn(['AUTHORIZED', 'DENIED', 'PENDING'])
  status: 'AUTHORIZED' | 'DENIED' | 'PENDING';

  @IsString()
  playerRoomId: string;
}
