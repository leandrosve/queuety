import React, { useEffect, useState } from 'react';
import { useDesktopConnectionContext } from '../../context/DesktopConnectionContext';
import useSocketConnection from './useSocketConnection';
import Logger from '../../utils/Logger';
import AuthResponseDTO, { AuthResponseStatus } from '../../model/auth/AuthResponseDTO';

interface AuthRequest {
  clientId: string;
}

const useDesktopAuth = () => {
  const { connection } = useDesktopConnectionContext();
  const { socket, isReady, connectionId } = useSocketConnection(true);
  const [joinedAuthRoom, setJoinedAuthRoom] = useState(false);

  const [authRequests, setAuthRequests] = useState<AuthRequest[]>([]);

  const joinAuthRoom = (roomId: string) => {
    socket.emit('join-auth-room', { authRoomId: roomId }, (success: boolean) => setJoinedAuthRoom(!!success));
  };

  const onAuthRequest = (some: AuthRequest) => {
    Logger.info(`Received Auth request ${some}`);
    setAuthRequests((p) => [...p.filter((i) => i.clientId !== some.clientId), some]);
  };

  const authorizeRequest = (clientId: string, accepted: boolean) => {
    const status = accepted ? AuthResponseStatus.AUTHORIZED : AuthResponseStatus.DENIED;
    const payload: AuthResponseDTO = { status, clientId, playerRoomId: connection.playerRoom.id };
    socket.emit('send-auth-confirmation', payload, () => {
      setAuthRequests((p) => p.filter((i) => i.clientId !== clientId));
    });
  };

  useEffect(() => {
    if (connection.authRoom?.id && socket && isReady) {
      joinAuthRoom(connection.authRoom.id);
      socket.on('receive-auth-request', onAuthRequest);
    }
  }, [socket, isReady, connection.authRoom]);

  return {
    joinedAuthRoom,
    isSocketReady: isReady,
    connectionId: connectionId,
    authRoomId: connection?.authRoom.id,
    authRequests,
    authorizeRequest,
  };
};

export default useDesktopAuth;
