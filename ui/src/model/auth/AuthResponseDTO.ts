export enum AuthResponseStatus {
  AUTHORIZED = 'AUTHORIZED',
  PENDING = 'PENDING',
  DENIED = 'DENIED',
}

export default interface AuthResponseDTO {
  playerRoomId?: string | null;
  status: AuthResponseStatus;
  clientId: string;
}
