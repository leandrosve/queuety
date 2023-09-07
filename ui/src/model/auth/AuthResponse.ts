export enum AuthResponseStatus {
  AUTHORIZED = 'AUTHORIZED',
  PENDING = 'PENDING',
  DENIED = 'DENIED',
}

export default interface AuthResponse {
  playerRoomId?: string | null;
  authRoomId: string;
  status: AuthResponseStatus;
  clientId: string;
  host: { userId: string; nickname: string };
}
