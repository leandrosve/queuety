import Cookies from 'universal-cookie';
import HostData from '../model/auth/HostData';
import StorageUtils, { StorageKey } from './StorageUtils';

interface AuthRejectionData {
  host: HostData;
  expiresAt: number;
  authRoomId: string;
}

interface RejectedUserData {
  userId: string;
  expiresAt: number;
}

export default class AuthUtils {
  private static REJECTION_TIMEOUT_SECONDS = 10;

  public static isValidAuthRoom(authRoomId: string) {
    return !!authRoomId && authRoomId.startsWith('auth-') && authRoomId.length > 15;
  }

  public static clearOldMobileRejections() {
    let rejections: AuthRejectionData[] = JSON.parse(StorageUtils.get(StorageKey.REJECTIONS) || '[]');
    const minDate = new Date().getTime() - 1000 * this.REJECTION_TIMEOUT_SECONDS;
    rejections = rejections.filter((r) => r.expiresAt > minDate);
    StorageUtils.set(StorageKey.REJECTIONS, JSON.stringify(rejections));
  }

  public static setMobileRejection(authRoomId: string, host: HostData) {
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + this.REJECTION_TIMEOUT_SECONDS);
    const rejection = { authRoomId, host, expiresAt: expiresAt.getTime() };
    const rejections: AuthRejectionData[] = JSON.parse(StorageUtils.get(StorageKey.REJECTIONS) || '[]');
    const index = rejections.findIndex((r) => r.authRoomId === authRoomId);
    if (index >= 0) {
      rejections[index] = rejection;
    } else {
      rejections.push(rejection);
    }
    StorageUtils.setRaw(StorageKey.REJECTIONS, rejections);
  }

  public static getMobileRejection(authRoomId: string): { host: HostData; remainingSeconds: number } | null {
    const rejections = StorageUtils.getParsed<AuthRejectionData[]>(StorageKey.REJECTIONS, []);
    const rejection = rejections.find((r) => r.authRoomId === authRoomId);
    if (!rejection) return null;
    let remainingSeconds = Math.max(0, rejection.expiresAt - new Date().getTime()) / 1000;
    if (remainingSeconds <= 0) return null;
    return { host: rejection.host, remainingSeconds: Math.ceil(remainingSeconds) };
  }

  public static clearOldRejectedUsers() {
    let rejectedUsers = StorageUtils.getParsed<RejectedUserData[]>(StorageKey.REJECTED_USERS, []);
    const minDate = new Date().getTime() - 1000 * this.REJECTION_TIMEOUT_SECONDS;
    rejectedUsers = rejectedUsers.filter((r) => r.expiresAt > minDate);
    StorageUtils.setRaw(StorageKey.REJECTED_USERS, rejectedUsers);
  }

  public static setDesktopRejection(userId: string) {
    // Give one seconds grace just in case
    const expiresAt = new Date().getTime() + 1000 * (this.REJECTION_TIMEOUT_SECONDS - 1);
    const rejectedUser: RejectedUserData = { userId, expiresAt };
    const rejectedUsers = StorageUtils.getParsed<RejectedUserData[]>(StorageKey.REJECTED_USERS, []);
    const index = rejectedUsers.findIndex((r) => r.userId === userId);
    if (index >= 0) {
      rejectedUsers[index] = rejectedUser;
    } else {
      rejectedUsers.push(rejectedUser);
    }
    StorageUtils.setRaw(StorageKey.REJECTED_USERS, rejectedUsers);
  }

  public static getDesktopRejection(userId: string): { remainingSeconds: number } | null {
    const rejectedUsers = StorageUtils.getParsed<RejectedUserData[]>(StorageKey.REJECTED_USERS, []);
    const rejectedUser = rejectedUsers.find((r) => r.userId === userId);
    if (!rejectedUser) return null;
    let remainingSeconds = Math.max(0, rejectedUser.expiresAt - new Date().getTime()) / 1000;
    console.log(rejectedUser, remainingSeconds);
    if (remainingSeconds <= 0) return null;
    return { remainingSeconds: Math.ceil(remainingSeconds) };
  }

  public static endSession() {
    StorageUtils.clearAll({ exceptions: [StorageKey.SETTINGS, StorageKey.USER_ID] });
    location.reload();
  }
}
