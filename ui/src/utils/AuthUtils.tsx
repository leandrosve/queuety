export default class AuthUtils {
  public static isValidAuthRoom(authRoomId: string) {
    return !!authRoomId && authRoomId.startsWith('auth-') && authRoomId.length > 15;
  }
}
