import React, { useEffect, useMemo, useRef, useState } from 'react';
import { socket } from '../../socket';
import Logger from '../../utils/Logger';
import AuthResponseDTO, { AuthResponseStatus } from '../../model/auth/AuthResponseDTO';
import MobileAuthService from '../../services/api/auth/MobileAuthService';

export enum Status {
  UNSTARTED = 'UNSTARTED',
  CONNECTING_TO_SOCKET = 'CONNECTING_TO_SOCKET',
  CONNECTED_TO_SOCKET = 'CONNECTED_TO_SOCKET',
  JOINING_AUTH_ROOM = 'JOINING_AUTH_ROOM',
  JOINED_AUTH_ROOM = 'JOINED_AUTH_ROOM',
  SENDING_AUTH_REQUEST = 'SENDING_AUTH_REQUEST',
  SENT_AUTH_REQUEST = 'SENT_AUTH_REQUEST',
  AUTH_REQUEST_ACCEPTED = 'AUTH_REQUEST_ACCEPTED',
  AUTH_REQUEST_DENIED = 'AUTH_REQUEST_DENIED',
  JOINING_PLAYER_ROOM = 'JOINING_PLAYER_ROOM',
  JOINED_PLAYER_ROOM = 'JOINED_PLAYER_ROOM',
  TIMEOUT = 'TIMEOUT',
}

const CONFIRMATION_TIMEOUT = 25_000; // ms

const useMobileAuth = (authRoomId: string) => {
  const [isSocketReady, setIsSocketReady] = useState<boolean>(false);
  const [connectionId, setConnectionId] = useState<string>('');
  const [playerRoomId, setPlayerRoomId] = useState<string>('');

  const [status, setStatus] = useState<Status>(Status.UNSTARTED);

  const authService = useMemo(() => new MobileAuthService(), []);

  const onTrigger = (authRoom: string) => {
    if (!isSocketReady || !authRoom) return;
    joinAuthRoom(authRoom);
  };
  // Initial Connection

  const connectToSocket = () => {
    setStatus(Status.CONNECTING_TO_SOCKET);
    authService.connect();
  };

  const onSocketConnected = (connectId: string) => {
    setConnectionId(connectId);
    setStatus(Status.CONNECTED_TO_SOCKET);
    setIsSocketReady(true);
    //joinAuthRoom(authRoomId); uncomment this after testing
  };

  // Join Auth Room

  const joinAuthRoom = async (roomId: string) => {
    setStatus(Status.JOINING_AUTH_ROOM);
    const ok = await authService.joinAuthRoom(roomId);
    if (ok) onJoinedAuthRoom();
  };

  const onJoinedAuthRoom = () => {
    setStatus(Status.JOINED_AUTH_ROOM);
    sendAuthRequest();
  };

  // Send Auth Request
  const sendAuthRequest = async () => {
    setStatus(Status.SENDING_AUTH_REQUEST);
    const ok = await authService.sendAuthRequest(authRoomId);
    if (ok) setStatus(Status.SENT_AUTH_REQUEST);
  };

  const onAuthConfirmation = (confirmation: AuthResponseDTO) => {
    if (confirmation.status !== AuthResponseStatus.AUTHORIZED) {
      setStatus(Status.AUTH_REQUEST_DENIED);
      return;
    }
    if (!confirmation.playerRoomId) return;
    setStatus(Status.AUTH_REQUEST_ACCEPTED);
    setPlayerRoomId(confirmation.playerRoomId);
    joinPlayerRoom(confirmation.playerRoomId);
  };

  // Join Player Room
  const joinPlayerRoom = (playerRoomId: string) => {
    setStatus(Status.JOINED_PLAYER_ROOM);
    authService.joinPlayerRoom(playerRoomId, () => setStatus(Status.JOINED_PLAYER_ROOM));
  };

  const onTimeout = () => {
    authService.onConfirmationTimeout();
    setStatus(Status.TIMEOUT);
  };

  const onDisconnected = () => setIsSocketReady(false);

  useEffect(() => {
    authService.onConnected(onSocketConnected);
    authService.onDisconnected(onDisconnected);
    authService.onAuthConfirmation(onAuthConfirmation);

    connectToSocket();
    return () => {
      authService.cleanup();
    };
  }, []);

  useEffect(() => {
    Logger.info(status);
    let timeout: number;
    if (status === Status.SENT_AUTH_REQUEST) {
      timeout = setTimeout(() => {
        onTimeout();
      }, CONFIRMATION_TIMEOUT);
    }
    return () => clearTimeout(timeout);
  }, [status]);

  useEffect(() => {
    if (authRoomId && authRoomId.startsWith('auth-')) {
      onTrigger(authRoomId);
    }
  }, [authRoomId]);

  return {
    status,
    isSocketReady,
    connectionId,
    authRoomId,
    playerRoomId,
    onTrigger,
  };
};

export default useMobileAuth;
