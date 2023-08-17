import { useEffect, useState, useMemo, useRef } from 'react';
import { useDesktopConnectionContext } from '../../context/DesktopConnectionContext';
import { AuthResponseStatus } from '../../model/auth/AuthResponse';
import DesktopAuthService from '../../services/api/auth/DesktopAuthService';
import Logger from '../../utils/Logger';
import AuthRequest from '../../model/auth/AuthRequest';
import { useAuthRequestsContext } from '../../context/AuthRequestsContext';
import { useAllowedUsersContext } from '../../context/AllowedUsersContext';
import { useOnlinePrescenceContext } from '../../context/OnlinePrescenceContext';
import { useSocketConnectionContext } from '../../context/SocketConnectionContext';

const useDesktopAuth = () => {
  const { connection } = useDesktopConnectionContext();
  const { socket, isReady, connectionId } = useSocketConnectionContext();
  const [joinedAuthRoom, setJoinedAuthRoom] = useState(false);
  const [joinedPlayerRoom, setJoinedPlayerRoom] = useState(false);
  const authService = useMemo(() => new DesktopAuthService(socket), []);
  const authRequests = useAuthRequestsContext();
  const allowedUsers = useAllowedUsersContext();
  const onlinePrescence = useOnlinePrescenceContext();

  // Need to access these inside the socket callback :(
  const acceptAutomatic = useRef(connection.settings.automatic);
  const allowedUsersRef = useRef(allowedUsers);

  const joinAuthRoom = async (roomId: string) => {
    const res = await authService.joinAuthRoom(roomId);
    if (res.hasError) return;
    setJoinedAuthRoom(res.data);
  };

  const joinPlayerRoom = async (roomId: string) => {
    const res = await authService.joinPlayerRoom(roomId);
    if (res.hasError) return;
    setJoinedPlayerRoom(res.data);
  };

  const onAuthRequested = async (request: AuthRequest) => {
    if (acceptAutomatic.current || allowedUsersRef.current.get(request.userId)) {
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
    
    if (status == AuthResponseStatus.AUTHORIZED) {
      // Add to the list of authorized users before sending response
      allowedUsers.add({ nickname: request.nickname, userId: request.userId, joinedAt: new Date() });
    }

    const res = await authService.sendAuthResponse(response);
    if (res.hasError) return false;
    // Remove request from list
    if (status !== AuthResponseStatus.PENDING) {
      authRequests.remove(request);
    }
    return false;
  };

  const revokeAuthorization = async (userId: string, clientId: string) => {
    const res = await authService.sendAuthRevocation(userId, clientId);
    if (res.hasError) return false;
    allowedUsers.remove(userId);
    return true;
  };

  const onUserConnected = (userId: string, clientId: string, reconnected?: boolean) => {
    if (!allowedUsersRef.current.get(userId)) {
      revokeAuthorization(userId, clientId);
      Logger.warn('Unauthorized user tried to connect', { userId });
      return;
    }
    Logger.success(`User ${reconnected ? 'Connected' : 'Reconnected'}`, { userId, clientId });
    onlinePrescence.addUnique({ userId, clientId });
    authService.notifyHostConnection(clientId);
  };

  useEffect(() => {
    if (connection.authRoom?.id && socket && isReady) {
      joinAuthRoom(connection.authRoom.id);
      authService.onAuthRequested(onAuthRequested);
    }
  }, [socket, isReady, connection.authRoom]);

  useEffect(() => {
    if (connection.playerRoom?.id && isReady) {
      joinPlayerRoom(connection.playerRoom?.id);
    }
  }, [isReady, connection.authRoom]);

  useEffect(() => {
    if (isReady) {
      authService.onUserConnected(res => onUserConnected(res.userId, res.clientId, false));
      authService.onUserReconnected(res => onUserConnected(res.userId, res.clientId, true));
      authService.onUserDisconnected((res) => {
        Logger.warn('User Disconnected', res);
        onlinePrescence.remove({ ...res, clientId: '' });
      });
    }
  }, [isReady]);

  useEffect(() => {
    acceptAutomatic.current = connection.settings.automatic;
  }, [connection.settings.automatic]);

  useEffect(() => {
    allowedUsersRef.current = allowedUsers;
  }, [allowedUsers]);

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
    authorizeRequest,
    revokeAuthorization,
  };
};

export default useDesktopAuth;
