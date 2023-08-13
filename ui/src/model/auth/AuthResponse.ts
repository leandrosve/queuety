export enum AuthResponseStatus {
  AUTHORIZED = 'AUTHORIZED',
  PENDING = 'PENDING',
  DENIED = 'DENIED',
}

export default interface AuthResponse {
  playerRoomId?: string | null;
  status: AuthResponseStatus;
  clientId: string;
}
