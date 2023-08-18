import { useEffect, useRef, useState } from 'react';
import AuthResponse, { AuthResponseStatus } from '../../model/auth/AuthResponse';
import MobileAuthService from '../../services/api/auth/MobileAuthService';
import { useSettingsContext } from '../../context/SettingsContext';
import ConnectionService from '../../services/api/ConnectionService';
import Logger from '../../utils/Logger';

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

const useMobileAuth = () => {
  const { settings } = useSettingsContext();
  const [isSocketReady, setIsSocketReady] = useState<boolean>(false);
  const [connectionId, setConnectionId] = useState<string>('');
  const [playerRoomId, setPlayerRoomId] = useState<string | null>(MobileAuthService.getSavedPlayerRoom());
  const [userId, setUserId] = useState<string>(localStorage.getItem('userId') || '');
  const [authRoomId, setAuthRoomId] = useState<string | null>();
  const nicknameRef = useRef(settings.nickname);

  const [status, setStatus] = useState<MobileAuthStatus>(MobileAuthStatus.UNSTARTED);

  const [error, setError] = useState<AuthError | null>(null);
  const [hostStatus, setHostStatus] = useState<HostStatus>(HostStatus.WAITING);

  const retrieveUserId = async () => {
    const res = await ConnectionService.getUserId();
    if (!res.hasError) {
      setUserId(res.data.userId);
      localStorage.setItem('userId', res.data.userId);
    }
  };
  const onTrigger = (authRoom: string) => {
    authRoom = authRoom.trim();
    if (!isSocketReady || !authRoom || !userId) return;
    setAuthRoomId(authRoom);
    joinAuthRoom(authRoom);
  };
  // Initial Connection

  const connectToSocket = () => {
    setStatus(MobileAuthStatus.CONNECTING_TO_SOCKET);
    MobileAuthService.connect();
  };

  const onSocketConnected = (connectId: string) => {
    setConnectionId(connectId);
    setStatus(MobileAuthStatus.CONNECTED_TO_SOCKET);
    setIsSocketReady(true);
  };

  // Join Auth Room

  const joinAuthRoom = async (authRoomId: string) => {
    setStatus(MobileAuthStatus.JOINING_AUTH_ROOM);
    const ok = await MobileAuthService.joinAuthRoom(authRoomId);
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
    if (response.status === AuthResponseStatus.PENDING) {
      setStatus(MobileAuthStatus.AUTH_REQUEST_PENDING);
      return;
    }
    if (response.status === AuthResponseStatus.DENIED) {
      setStatus(MobileAuthStatus.AUTH_REQUEST_DENIED);
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
    const ok = await MobileAuthService.joinPlayerRoom(playerRoomId, false, userId, nicknameRef.current);
    if (ok) {
      history.pushState(null, '', location.origin);
      setStatus(MobileAuthStatus.JOINED_PLAYER_ROOM);
      MobileAuthService.savePlayerRoom(playerRoomId);
    }
  };

  const onDisconnected = () => setIsSocketReady(false);

  const onHostDisconnected = () => {
    Logger.warn('Host disconnected');
    setStatus((prev) => (prev <= MobileAuthStatus.AUTH_REQUEST_PENDING ? MobileAuthStatus.AUTH_REQUEST_STALED : prev));
    setHostStatus(HostStatus.DISCONNECTED);
  };

  const onHostReconnected = () => {
    Logger.success('Host Re-connected');
    setHostStatus(HostStatus.CONNECTED);
    MobileAuthService.notifyUserReconnection(nicknameRef.current);
  };

  const onHostConnected = () => {
    Logger.success('Host Connected');
    setHostStatus(HostStatus.CONNECTED);
  };

  const onAuthRevocation = () => {
    Logger.warn('Auth revoked by host');
    MobileAuthService.restart();
    //MobileAuthService.cleanup();
    setPlayerRoomId(null);
    MobileAuthService.removeSavedPlayerRoom();
    setAuthRoomId(null);
    setHostStatus(HostStatus.DISCONNECTED);
    setStatus(MobileAuthStatus.AUTH_REQUEST_DENIED);
    setError(AuthError.AUTH_REVOKED);
  };

  useEffect(() => {
    MobileAuthService.setUserId(userId);
    if (!userId) return;
    MobileAuthService.onConnected(onSocketConnected);
    MobileAuthService.onDisconnected(onDisconnected);
    MobileAuthService.onAuthConfirmation(onAuthResponse);
    MobileAuthService.onAuthRevocation(onAuthRevocation);
    MobileAuthService.onHostConnected(onHostConnected);
    MobileAuthService.onHostReconnected(onHostReconnected);
    MobileAuthService.onHostDisconnected(onHostDisconnected);
    connectToSocket();
    return () => {
      MobileAuthService.cleanup();
    };
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      retrieveUserId();
      return;
    }
    if (playerRoomId) {
      joinPlayerRoom(playerRoomId);
    }
  }, []);

  useEffect(() => {
    MobileAuthService.setAuthRoomId(authRoomId);
    MobileAuthService.setPlayerRoomId(playerRoomId);
  }, [playerRoomId, authRoomId]);
  useEffect(() => {
    nicknameRef.current = settings.nickname;
  }, [settings.nickname]);
  return {
    status,
    error,
    hostStatus,
    isSocketReady,
    connectionId,
    authRoomId,
    playerRoomId,
    userId,
    onTrigger,
  };
};

export default useMobileAuth;
