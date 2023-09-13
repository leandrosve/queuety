import { useEffect, useRef, useState } from 'react';
import AuthResponse, { AuthResponseStatus } from '../../model/auth/AuthResponse';
import MobileAuthService from '../../services/api/auth/MobileAuthService';
import { useSettingsContext } from '../../context/SettingsContext';
import ConnectionService from '../../services/api/ConnectionService';
import Logger from '../../utils/Logger';
import StorageUtils, { StorageKey } from '../../utils/StorageUtils';
import MobilePlayerService from '../../services/api/player/MobilePlayerService';
import HostData from '../../model/auth/HostData';
import AuthUtils from '../../utils/AuthUtils';

export enum MobileAuthStatus {
  UNSTARTED = 'UNSTARTED',
  CONNECTING_TO_SOCKET = 'CONNECTING_TO_SOCKET',
  CONNECTED_TO_SOCKET = 'CONNECTED_TO_SOCKET',
  JOINING_AUTH_ROOM = 'JOINING_AUTH_ROOM',
  JOINED_AUTH_ROOM = 'JOINED_AUTH_ROOM',
  SENDING_AUTH_REQUEST = 'SENDING_AUTH_REQUEST',
  SENT_AUTH_REQUEST = 'SENT_AUTH_REQUEST',
  AUTH_REQUEST_PENDING = 'AUTH_REQUEST_PENDING',
  AUTH_REQUEST_ACCEPTED = 'AUTH_REQUEST_ACCEPTED',
  AUTH_REQUEST_DENIED = 'AUTH_REQUEST_DENIED',
  AUTH_REQUEST_STALED = 'AUTH_REQUEST_STALED',
  JOINING_PLAYER_ROOM = 'JOINING_PLAYER_ROOM',
  JOINED_PLAYER_ROOM = 'JOINED_PLAYER_ROOM',
  TIMEOUT = 'TIMEOUT',
}

export enum AuthError {
  TIMEOUT = 'TIMEOUT',
  HOST_DISCONNECTED = 'HOST_DISCONNECTED',
  INVALID_AUTH_ROOM = 'INVALID_AUTH_ROOM',
  AUTH_REVOKED = 'AUTH_REVOKED',
}

export enum HostStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTED = 'CONNECTED',
  WAITING = 'WAITING',
}

const getSavedHostData = (): HostData | null => {
  const res = StorageUtils.get(StorageKey.HOST);
  if (res) return JSON.parse(res);
  return null;
};
const useMobileAuth = () => {
  const { settings } = useSettingsContext();
  const [isSocketReady, setIsSocketReady] = useState<boolean>(false);
  const [connectionId, setConnectionId] = useState<string>('');
  const [playerRoomId, setPlayerRoomId] = useState<string | null>(StorageUtils.get(StorageKey.PLAYER_ROOM_ID));
  const [userId, setUserId] = useState<string>(StorageUtils.get(StorageKey.USER_ID) || '');
  const [authRoomId, setAuthRoomId] = useState<string | null>();
  const [host, setHost] = useState<HostData | null>(getSavedHostData());
  const [rejectionTimeout, setRejectionTimeout] = useState<number>(0);
  const nicknameRef = useRef(settings.nickname);

  const [status, setStatus] = useState<MobileAuthStatus>(MobileAuthStatus.UNSTARTED);

  const [error, setError] = useState<AuthError | null>(null);
  const [hostStatus, setHostStatus] = useState<HostStatus>(HostStatus.WAITING);

  const retrieveUserId = async () => {
    const res = await ConnectionService.getUserId();
    if (!res.hasError) {
      setUserId(res.data.userId);
      StorageUtils.set(StorageKey.USER_ID, res.data.userId);
    }
  };
  const onTrigger = (authRoom: string) => {
    authRoom = authRoom.trim();
    if (!isSocketReady || !authRoom || !userId) {
      Logger.warn('Connection is not ready yet');
      return;
    }
    const hostRejection = AuthUtils.getMobileRejection(authRoom);
    if (hostRejection?.remainingSeconds) {
      Logger.warn(`Auth was recently rejected from authRoom`);
      setStatus(MobileAuthStatus.AUTH_REQUEST_DENIED);
      setRejectionTimeout(hostRejection.remainingSeconds);
      updateHost(hostRejection.host);
      return;
    }
    updateHost(null);
    setAuthRoomId(authRoom);
    joinAuthRoom(authRoom);
  };
  // Initial Connection

  const connect = () => {
    setStatus(MobileAuthStatus.CONNECTING_TO_SOCKET);
    MobileAuthService.connect(onConnected);
    MobilePlayerService.connect();
  };

  const onCancel = async () => {
    setStatus(MobileAuthStatus.CONNECTED_TO_SOCKET);
    setAuthRoomId(null);
    setHost(null);
    setHostStatus(HostStatus.WAITING);
    await MobileAuthService.restart();
  };

  const onConnected = (connectId: string) => {
    setConnectionId(connectId);
    setStatus(MobileAuthStatus.CONNECTED_TO_SOCKET);
    setIsSocketReady(true);
  };

  // Join Auth Room

  const joinAuthRoom = async (authRoomId: string) => {
    setStatus(MobileAuthStatus.JOINING_AUTH_ROOM);
    const ok = await MobileAuthService.joinAuthRoom(authRoomId, true, userId);
    if (ok) {
      setStatus(MobileAuthStatus.JOINED_AUTH_ROOM);
      sendAuthRequest(authRoomId);
    } else {
      setError(AuthError.INVALID_AUTH_ROOM);
    }
  };
  // Send Auth Request
  const sendAuthRequest = async (authRoomId: string) => {
    setStatus(MobileAuthStatus.SENDING_AUTH_REQUEST);
    const ok = await MobileAuthService.sendAuthRequest({ authRoomId, nickname: settings.nickname, userId: userId });
    if (ok) setStatus(MobileAuthStatus.SENT_AUTH_REQUEST);
  };

  const onAuthResponse = (response: AuthResponse) => {
    updateHost(response.host);
    if (response.status === AuthResponseStatus.PENDING) {
      setStatus(MobileAuthStatus.AUTH_REQUEST_PENDING);
      return;
    }
    if (response.status === AuthResponseStatus.DENIED) {
      setStatus(MobileAuthStatus.AUTH_REQUEST_DENIED);
      AuthUtils.setMobileRejection(response.authRoomId, response.host);
      return;
    }
    if (!response.playerRoomId) return;
    setStatus(MobileAuthStatus.AUTH_REQUEST_ACCEPTED);
    setPlayerRoomId(response.playerRoomId);
    joinPlayerRoom(response.playerRoomId);
  };

  // Join Player Room
  const joinPlayerRoom = async (playerRoomId: string) => {
    setStatus(MobileAuthStatus.JOINING_PLAYER_ROOM);
    const res = await MobilePlayerService.joinPlayerRoom(playerRoomId, userId, nicknameRef.current);
    if (!res.hasError) {
      Logger.success('Joined player room');
      history.pushState(null, '', location.origin);
      setStatus(MobileAuthStatus.JOINED_PLAYER_ROOM);
      StorageUtils.set(StorageKey.PLAYER_ROOM_ID, playerRoomId);
    }
  };

  const onDisconnected = () => setIsSocketReady(false);

  const onHostDisconnected = () => {
    Logger.warn('Host disconnected');
    setStatus((prev) => (prev === MobileAuthStatus.AUTH_REQUEST_PENDING ? MobileAuthStatus.AUTH_REQUEST_STALED : prev));
    setHostStatus(HostStatus.DISCONNECTED);
  };

  const updateHost = (hostData: HostData | null) => {
    setHost(hostData);
    if (hostData == null) {
      StorageUtils.remove(StorageKey.HOST);
      return;
    }
    StorageUtils.set(StorageKey.HOST, JSON.stringify(hostData));
  };
  const onHostReconnected = (hostData: { userId: string; nickname: string }) => {
    Logger.success('Host Re-connected', hostData);
    updateHost({ userId: hostData.userId, nickname: hostData.nickname });
    setHostStatus(HostStatus.CONNECTED);
    MobilePlayerService.notifyUserReconnection(nicknameRef.current);
  };

  const onHostConnected = (hostData: { userId: string; nickname: string }) => {
    Logger.success('Host Connected', hostData);
    updateHost({ userId: hostData.userId, nickname: hostData.nickname });
    setHostStatus(HostStatus.CONNECTED);
    setHostStatus(HostStatus.CONNECTED);
  };

  const onAuthRevocation = () => {
    Logger.warn('Auth revoked by host');
    MobileAuthService.restart();
    //MobileAuthService.cleanup();
    setPlayerRoomId(null);
    updateHost(null);
    StorageUtils.remove(StorageKey.PLAYER_ROOM_ID);
    setAuthRoomId(null);
    setHostStatus(HostStatus.DISCONNECTED);
    setStatus(MobileAuthStatus.AUTH_REQUEST_DENIED);
    setError(AuthError.AUTH_REVOKED);
  };

  useEffect(() => {
    MobileAuthService.setUserId(userId);
    if (!userId) return;
    MobileAuthService.onConnected(onConnected);
    MobileAuthService.onDisconnected(onDisconnected);
    MobileAuthService.onAuthConfirmation(onAuthResponse);
    MobileAuthService.onHostDisconnected(onHostDisconnected);

    MobilePlayerService.onAuthRevocation(onAuthRevocation);
    MobilePlayerService.onHostConnected(onHostConnected);
    MobilePlayerService.onHostReconnected(onHostReconnected);
    MobilePlayerService.onHostDisconnected(onHostDisconnected);
    connect();
    return () => {
      //MobileAuthService.cleanup();
      //MobilePlayerService.cleanup();
    };
  }, [userId]);

  useEffect(() => {
    AuthUtils.clearOldMobileRejections();
    if (!userId) {
      retrieveUserId();
      return;
    }
    if (playerRoomId) {
      joinPlayerRoom(playerRoomId);
    }
  }, []);

  useEffect(() => {
    if (authRoomId && status == MobileAuthStatus.JOINED_PLAYER_ROOM) {
      StorageUtils.set(StorageKey.MOBILE_AUTH_ROOM_ID, authRoomId);
    }
  }, [authRoomId, status]);

  useEffect(() => {
    nicknameRef.current = settings.nickname;
  }, [settings.nickname]);
  return {
    status,
    error,
    host,
    hostStatus,
    isSocketReady,
    connectionId,
    authRoomId,
    rejectionTimeout,
    playerRoomId,
    onCancel,
    userId,
    onTrigger,
  };
};

export default useMobileAuth;
