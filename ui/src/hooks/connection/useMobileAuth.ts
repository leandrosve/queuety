import React, { useEffect, useRef, useState } from 'react';
import { socket } from '../../socket';
import Logger from '../../utils/Logger';

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

const CONFIRMATION_TIMEOUT = 5_000; // ms

const useMobileAuth = (authRoomId: string) => {
  const [isSocketReady, setIsSocketReady] = useState<boolean>(false);
  const [connectionId, setConnectionId] = useState<string>('');
  const [playerRoomId, setPlayerRoomId] = useState<string>('');

  const [status, setStatus] = useState<Status>(Status.UNSTARTED);

  const onTrigger = (authRoom: string) => {
    console.log('ON TRIGGER', authRoom);
    if (!isSocketReady || !authRoom) return;
    joinAuthRoom(authRoom);
  };
  // Initial Connection

  const connectToSocket = () => {
    setStatus(Status.CONNECTING_TO_SOCKET);
    socket.connect();
  };

  const onSocketConnected = (connectId: string) => {
    setConnectionId(connectId);
    setStatus(Status.CONNECTED_TO_SOCKET);
    setIsSocketReady(true);
    //joinAuthRoom(authRoomId); uncomment this after testing
  };

  // Join Auth Room

  const joinAuthRoom = (roomId: string) => {
    setStatus(Status.JOINING_AUTH_ROOM);
    socket.emit('join-auth-room', { authRoomId: roomId }, (success: boolean) => {
      if (success) onJoinedAuthRoom();
    });
  };

  const onJoinedAuthRoom = () => {
    setStatus(Status.JOINED_AUTH_ROOM);
    sendAuthRequest();
  };

  // Send Auth Request
  const sendAuthRequest = () => {
    setStatus(Status.SENDING_AUTH_REQUEST);
    socket.emit('send-auth-request', { authRoomId: authRoomId }, (sent: boolean) => {
      if (sent) {
        console.log({ authRoomId });
        setStatus(Status.SENT_AUTH_REQUEST);
      }
    });
  };

  const onAuthConfirmation = (confirmation: { accepted: boolean; playerRoomId: string }) => {
    console.log({ confirmation });
    setStatus(confirmation.accepted ? Status.AUTH_REQUEST_ACCEPTED : Status.AUTH_REQUEST_DENIED);
    if (!confirmation.accepted) return;
    setPlayerRoomId(confirmation.playerRoomId);
    joinPlayerRoom(confirmation.playerRoomId);
  };

  // Join Player Room
  const joinPlayerRoom = (playerRoomId: string) => {
    setStatus(Status.JOINED_PLAYER_ROOM);
    socket.emit('join-player-room', { playerRoomId }, (res: boolean) => {
      if (res) setStatus(Status.JOINED_PLAYER_ROOM);
    });
  };

  const onTimeout = () => {
    socket.off('receive-auth-confirmation');
    setStatus(Status.TIMEOUT);
  };

  const onDisconnected = () => setIsSocketReady(false);

  useEffect(() => {
    socket.on('connection', onSocketConnected);
    socket.on('disconnect', onDisconnected);
    socket.once('receive-auth-confirmation', onAuthConfirmation);

    connectToSocket();
    return () => {
      console.log('disconnect');
      socket.off('connection', onSocketConnected);
      socket.off('disconnect', onDisconnected);
      socket.off('receive-auth-confirmation', onAuthConfirmation);
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
