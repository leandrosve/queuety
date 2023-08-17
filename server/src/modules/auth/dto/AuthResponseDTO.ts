import { IsNotEmpty, IsIn, IsString, IsOptional, ValidateIf } from 'class-validator';

export class AuthResponseDTO {
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsNotEmpty()
  @IsIn(['AUTHORIZED', 'DENIED', 'PENDING'])
  status: 'AUTHORIZED' | 'DENIED' | 'PENDING';

  @IsOptional()
  @ValidateIf((o) => o.status == 'AUTHORIZED')
  @IsString()
  playerRoomId: string;
}
