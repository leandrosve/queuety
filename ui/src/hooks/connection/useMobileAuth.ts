import { useEffect, useMemo, useState } from 'react';
import Logger from '../../utils/Logger';
import AuthResponse, { AuthResponseStatus } from '../../model/auth/AuthResponse';
import MobileAuthService from '../../services/api/auth/MobileAuthService';
import { useSettingsContext } from '../../context/SettingsContext';
import ConnectionService from '../../services/api/ConnectionService';

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
  JOINING_PLAYER_ROOM = 'JOINING_PLAYER_ROOM',
  JOINED_PLAYER_ROOM = 'JOINED_PLAYER_ROOM',
  TIMEOUT = 'TIMEOUT',
}

export enum AuthError {}

const CONFIRMATION_TIMEOUT = 25_000; // ms

const useMobileAuth = () => {
  const authService = useMemo(() => new MobileAuthService(), []);
  const { settings } = useSettingsContext();
  const [isSocketReady, setIsSocketReady] = useState<boolean>(false);
  const [connectionId, setConnectionId] = useState<string>('');
  const [playerRoomId, setPlayerRoomId] = useState<string | null>(authService.getSavedPlayerRoom());
  const [userId, setUserId] = useState<string>(localStorage.getItem('userId') || '');

  const [authRoomId, setAuthRoomId] = useState<string | null>();

  const [status, setStatus] = useState<MobileAuthStatus>(MobileAuthStatus.UNSTARTED);

  const [error, setError] = useState<string | null>(null);

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
    authService.connect();
  };

  const onSocketConnected = (connectId: string) => {
    setConnectionId(connectId);
    setStatus(MobileAuthStatus.CONNECTED_TO_SOCKET);
    setIsSocketReady(true);

    if (playerRoomId) {
      joinPlayerRoom(playerRoomId);
    }
    //joinAuthRoom(authRoomId); uncomment this after testing
  };

  // Join Auth Room

  const joinAuthRoom = async (authRoomId: string) => {
    setStatus(MobileAuthStatus.JOINING_AUTH_ROOM);
    const ok = await authService.joinAuthRoom(authRoomId);
    if (ok) {
      setStatus(MobileAuthStatus.JOINED_AUTH_ROOM);
      sendAuthRequest(authRoomId);
    } else {
      setError('invalid_auth_room');
    }
  };
  // Send Auth Request
  const sendAuthRequest = async (authRoomId: string) => {
    setStatus(MobileAuthStatus.SENDING_AUTH_REQUEST);
    const ok = await authService.sendAuthRequest({ authRoomId, nickname: settings.nickname, userId: userId });
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
    const ok = await authService.joinPlayerRoom(playerRoomId);
    if (ok) {
      setStatus(MobileAuthStatus.JOINED_PLAYER_ROOM);
      authService.savePlayerRoom(playerRoomId);
    }
  };

  const onTimeout = () => {
    authService.onConfirmationTimeout();
    setStatus(MobileAuthStatus.TIMEOUT);
  };

  const onDisconnected = () => setIsSocketReady(false);

  useEffect(() => {
    authService.onConnected(onSocketConnected);
    authService.onDisconnected(onDisconnected);
    authService.onAuthConfirmation(onAuthResponse);
    connectToSocket();
    return () => {
      authService.cleanup();
    };
  }, []);

  useEffect(() => {
    Logger.info(status);
    let timeout: number;
    if (status === MobileAuthStatus.SENT_AUTH_REQUEST) {
      timeout = setTimeout(() => {
        onTimeout();
      }, CONFIRMATION_TIMEOUT);
    }
    return () => clearTimeout(timeout);
  }, [status]);

  useEffect(() => {
    if (!userId) retrieveUserId();
  }, []);

  return {
    status,
    error,
    isSocketReady,
    connectionId,
    authRoomId,
    playerRoomId,
    userId,
    onTrigger,
  };
};

export default useMobileAuth;
