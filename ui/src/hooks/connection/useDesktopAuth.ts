import { useEffect, useState, useMemo } from 'react';
import { useDesktopConnectionContext } from '../../context/DesktopConnectionContext';
import useSocketConnection from './useSocketConnection';
import { AuthResponseStatus } from '../../model/auth/AuthResponse';
import DesktopAuthService from '../../services/api/auth/DesktopAuthService';
import Logger from '../../utils/Logger';
import AuthUser from '../../model/auth/AuthUser';
import { v4 as uuidv4 } from 'uuid';
import AuthRequest from '../../model/auth/AuthRequest';

const useDesktopAuth = () => {
  const { connection } = useDesktopConnectionContext();
  const { socket, isReady, connectionId } = useSocketConnection(true);
  const [joinedAuthRoom, setJoinedAuthRoom] = useState(false);
  const [joinedPlayerRoom, setJoinedPlayerRoom] = useState(false);

  const [authRequests, setAuthRequests] = useState<AuthRequest[]>([]);
  const authService = useMemo(() => new DesktopAuthService(socket), []);

  const [authorizedUsers, setAuthorizedUsers] = useState<AuthUser[]>([]);

  const joinAuthRoom = async (roomId: string) => {
    const ok = await authService.joinAuthRoom(roomId);
    setJoinedAuthRoom(ok);
  };

  const joinPlayerRoom = async (roomId: string) => {
    const ok = await authService.joinPlayerRoom(roomId);
    setJoinedPlayerRoom(ok);
  };

  const onAuthRequested = async (request: AuthRequest) => {
    setAuthRequests((p) => [...p.filter((i) => i.clientId !== request.clientId), request]);
    await authorizeRequest(request, AuthResponseStatus.PENDING);
  };

  const authorizeRequest = async (request: AuthRequest, status: AuthResponseStatus) => {
    Logger.info('Response', request.clientId, status);
    const playerRoomId = status == AuthResponseStatus.AUTHORIZED ? connection.playerRoom.id : null;
    const response = { status, clientId: request.clientId, playerRoomId };

    const userId = `user-${uuidv4()}`;

    const ok = await authService.sendAuthResponse(response);
    if (ok && status !== AuthResponseStatus.PENDING) {
      // Remove request from list
      setAuthRequests((p) => p.filter((i) => i.clientId !== request.clientId));
      setAuthorizedUsers((p) => [...p, { id: userId, nickname: request.nickname }]);
    }
  };

  useEffect(() => {
    if (connection.authRoom?.id && socket && isReady) {
      joinAuthRoom(connection.authRoom.id);
      authService.onAuthRequested(onAuthRequested);
    }
  }, [socket, isReady, connection.authRoom]);

  useEffect(() => {
    if (connection.playerRoom?.id && socket && isReady) {
      joinPlayerRoom(connection.playerRoom?.id);
    }
  }, [socket, isReady, connection.authRoom]);

  return {
    joinedAuthRoom,
    isSocketReady: isReady,
    connectionId: connectionId,
    authRoom: {
      id: connection?.authRoom.id,
      joined: joinedAuthRoom,
    },
    playerRoom: {
      id: connection?.playerRoom.id,
      joined: joinedPlayerRoom,
    },
    authRequests,
    authorizeRequest,
    authorizedUsers
  };
};

export default useDesktopAuth;
