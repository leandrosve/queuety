import { useEffect, useState, useRef } from 'react';
import { useDesktopConnectionContext } from '../../context/DesktopConnectionContext';
import { AuthResponseStatus } from '../../model/auth/AuthResponse';
import DesktopAuthService from '../../services/api/auth/DesktopAuthService';
import Logger from '../../utils/Logger';
import AuthRequest from '../../model/auth/AuthRequest';
import { useAuthRequestsContext } from '../../context/AuthRequestsContext';
import { useAllowedUsersContext } from '../../context/AllowedUsersContext';
import { useOnlinePrescenceContext } from '../../context/OnlinePrescenceContext';
import useSocketStatus from './useSocketStatus';
import AuthService from '../../services/api/auth/AuthService';

const useDesktopAuth = () => {
  const { connection } = useDesktopConnectionContext();
  const { isReady, connectionId } = useSocketStatus(AuthService._socket, true);
  const [joinedAuthRoom, setJoinedAuthRoom] = useState(false);
  const [joinedPlayerRoom, setJoinedPlayerRoom] = useState(false);
  const authRequests = useAuthRequestsContext();
  const allowedUsers = useAllowedUsersContext();
  const onlinePrescence = useOnlinePrescenceContext();

  // Need to access these inside the socket callback :(
  const acceptAutomatic = useRef(connection.settings.automatic);
  const allowedUsersRef = useRef(allowedUsers);

  const joinAuthRoom = async (roomId: string) => {
    const res = await DesktopAuthService.joinAuthRoom(roomId);
    if (res.hasError) return;
    setJoinedAuthRoom(res.data);
  };

  const joinPlayerRoom = async (roomId: string) => {
    const res = await DesktopAuthService.joinPlayerRoom(roomId);
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
      allowedUsers.add({ nickname: request.nickname, userId: request.userId, joinedAt: new Date(), clientId: request.clientId });
    }

    const res = await DesktopAuthService.sendAuthResponse(response);
    if (res.hasError) return false;
    // Remove request from list
    if (status !== AuthResponseStatus.PENDING) {
      authRequests.remove(request);
    }
    return false;
  };

  const revokeAuthorization = async (userId: string, clientId: string) => {
    const res = await DesktopAuthService.sendAuthRevocation(userId, clientId);
    return res.hasError;
  };

  const onUserConnected = (userId: string, clientId: string, reconnected?: boolean, nickname?: string) => {
    if (!allowedUsersRef.current.get(userId)) {
      revokeAuthorization(userId, clientId);
      Logger.warn('Unauthorized user tried to connect', { userId });
      return;
    }
    if (nickname) {
      allowedUsers.update({ userId, nickname, clientId });
    }
    Logger.success(`User ${reconnected ? 'Connected' : 'Reconnected'}`, { userId, clientId });
    onlinePrescence.addUnique(userId);
    DesktopAuthService.notifyHostConnection(clientId);
  };

  const onUserChanged = (userId: string, nickname: string) => {
    allowedUsers.update({ userId, nickname });
  };

  useEffect(() => {
    if (connection.authRoom?.id && isReady) {
      joinAuthRoom(connection.authRoom.id);
      DesktopAuthService.onAuthRequested(onAuthRequested);
    }
  }, [isReady, connection.authRoom]);

  useEffect(() => {
    if (connection.playerRoom?.id && isReady) {
      joinPlayerRoom(connection.playerRoom?.id);
    }
  }, [isReady, connection.authRoom]);

  useEffect(() => {
    if (isReady) {
      DesktopAuthService.onUserConnected((res) => onUserConnected(res.userId, res.clientId, false, res.nickname));
      DesktopAuthService.onUserReconnected((res) => onUserConnected(res.userId, res.clientId, true, res.nickname));
      DesktopAuthService.onUserChanged((res) => onUserChanged(res.userId, res.nickname));

      DesktopAuthService.onUserDisconnected((res) => {
        Logger.warn('User Disconnected', res);
        onlinePrescence.remove(res.userId);
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
