import { useEffect, useState, useMemo, useRef } from 'react';
import { useDesktopConnectionContext } from '../../context/DesktopConnectionContext';
import useSocketConnection from './useSocketConnection';
import { AuthResponseStatus } from '../../model/auth/AuthResponse';
import DesktopAuthService from '../../services/api/auth/DesktopAuthService';
import Logger from '../../utils/Logger';
import AuthRequest from '../../model/auth/AuthRequest';
import useDictionary from '../common/useDictionary';

const useDesktopAuth = () => {
  const { connection, authUsers } = useDesktopConnectionContext();
  const { socket, isReady, connectionId } = useSocketConnection(true);
  const [joinedAuthRoom, setJoinedAuthRoom] = useState(false);
  const [joinedPlayerRoom, setJoinedPlayerRoom] = useState(false);
  const authService = useMemo(() => new DesktopAuthService(socket), []);
  const authRequests = useDictionary<AuthRequest>((i) => i.clientId);
  // Need to access these inside the socket callback :(
  const acceptAutomatic = useRef(connection.settings.automatic);
  const authUsersRef = useRef(authUsers);

  const joinAuthRoom = async (roomId: string) => {
    const ok = await authService.joinAuthRoom(roomId);
    setJoinedAuthRoom(ok);
  };

  const joinPlayerRoom = async (roomId: string) => {
    const ok = await authService.joinPlayerRoom(roomId);
    setJoinedPlayerRoom(ok);
  };

  const onAuthRequested = async (request: AuthRequest) => {
    if (acceptAutomatic.current || authUsersRef.current.get(request.userId)) {
      authorizeRequest(request, AuthResponseStatus.AUTHORIZED);
      return;
    }
    authRequests.add(request);
    await authorizeRequest(request, AuthResponseStatus.PENDING);
  };

  const authorizeRequest = async (request: AuthRequest, status: AuthResponseStatus) => {
    Logger.info('Response', request.clientId, status);
    const playerRoomId = status == AuthResponseStatus.AUTHORIZED ? connection.playerRoom.id : null;
    const response = { status, clientId: request.clientId, playerRoomId };

    const ok = await authService.sendAuthResponse(response);
    if (ok && status !== AuthResponseStatus.PENDING) {
      // Remove request from list
      authRequests.remove(request);
      authUsers.add({ nickname: request.nickname, userId: request.userId, joinedAt: new Date() });
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

  useEffect(() => {
    acceptAutomatic.current = connection.settings.automatic;
  }, [connection.settings.automatic]);
  useEffect(() => {
    authUsersRef.current = authUsers;
  }, [authUsers]);

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
  };
};

export default useDesktopAuth;
