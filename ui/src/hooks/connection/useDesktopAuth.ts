import { useEffect, useState, useRef } from 'react';
import { useDesktopConnectionContext } from '../../context/DesktopConnectionContext';
import AuthResponse, { AuthResponseStatus } from '../../model/auth/AuthResponse';
import DesktopAuthService from '../../services/api/auth/DesktopAuthService';
import Logger from '../../utils/Logger';
import AuthRequest from '../../model/auth/AuthRequest';
import { useAuthRequestsContext } from '../../context/AuthRequestsContext';
import { useAllowedUsersContext } from '../../context/AllowedUsersContext';
import { useOnlinePrescenceContext } from '../../context/OnlinePrescenceContext';
import useSocketStatus from './useSocketStatus';
import AuthService from '../../services/api/auth/AuthService';
import DesktopPlayerService from '../../services/api/player/DesktopPlayerService';
import { useSettingsContext } from '../../context/SettingsContext';
import { useDesktopNotificationsContext } from '../../context/DesktopNotificationsContext';
import FormatUtils from '../../utils/FormatUtils';

const useDesktopAuth = () => {
  const { connection } = useDesktopConnectionContext();
  const { isReady, connectionId } = useSocketStatus(AuthService._socket, true);
  const [joinedAuthRoom, setJoinedAuthRoom] = useState(false);
  const [joinedPlayerRoom, setJoinedPlayerRoom] = useState(false);
  const authRequests = useAuthRequestsContext();
  const allowedUsers = useAllowedUsersContext();
  const onlinePrescence = useOnlinePrescenceContext();
  const notifications = useDesktopNotificationsContext();
  const { settings } = useSettingsContext();
  // Need to access these inside the socket callback :(
  const acceptAutomatic = useRef(connection.settings.automatic);
  const allowedUsersRef = useRef(allowedUsers);

  const joinAuthRoom = async (roomId: string) => {
    const res = await DesktopAuthService.joinAuthRoom(roomId);
    if (res.hasError) return;
    setJoinedAuthRoom(res.data);
  };

  const joinPlayerRoom = async (roomId: string, userId: string, nickname: string) => {
    const res = await DesktopPlayerService.joinPlayerRoom(roomId, userId, nickname);
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
    const response: AuthResponse = {
      status,
      clientId: request.clientId,
      playerRoomId,
      host: { userId: FormatUtils.shortenUserId(connection.userId || ''), nickname: settings.nickname },
    };

    if (status == AuthResponseStatus.AUTHORIZED) {
      // Add to the list of authorized users before sending response
      const allowedUser = { nickname: request.nickname, userId: request.userId, joinedAt: new Date(), clientId: request.clientId };
      allowedUsers.add(allowedUser);
      notifications.addUserJoined(allowedUser);
    }

    const res = await DesktopAuthService.sendAuthResponse(response);
    if (res.hasError) return false;
    // Remove request from list
    if (status !== AuthResponseStatus.PENDING) {
      authRequests.remove(request);
    }
    return true;
  };

  const revokeAuthorization = async (userId: string, clientId: string) => {
    const res = await DesktopPlayerService.sendAuthRevocation(userId, clientId);
    return res.hasError;
  };

  const onUserConnected = (userId: string, clientId: string, reconnected?: boolean, nickname?: string) => {
    console.log('USER RECONNECTED', userId, clientId, nickname);
    if (!allowedUsersRef.current.get(userId)) {
      revokeAuthorization(userId, clientId);
      Logger.warn('Unauthorized user tried to connect', { userId });
      return;
    }
    allowedUsers.update({ userId, clientId, ...(nickname ? { nickname } : {}) });
    Logger.success(`User ${reconnected ? 'Connected' : 'Reconnected'}: ${userId}`);
    onlinePrescence.addUnique(userId);
    Logger.info('SEND NOTIFY HOST CONNECTION');
    if (!connection.userId) return;
    DesktopPlayerService.notifyHostConnection(clientId, settings.nickname, connection.userId);
  };

  const onUserChanged = (userId: string, nickname: string) => {
    allowedUsers.update({ userId, nickname });
  };

  useEffect(() => {
    if (connection.authRoom?.id && connection.userId && isReady) {
      joinAuthRoom(connection.authRoom.id);
      DesktopAuthService.onAuthRequested(onAuthRequested);
    }
  }, [isReady, connection.authRoom, connection.userId]);

  useEffect(() => {
    if (connection.playerRoom?.id && connection.userId && settings.nickname && isReady) {
      joinPlayerRoom(connection.playerRoom?.id, connection.userId, settings.nickname);
    }
  }, [isReady, connection.authRoom, connection.userId]);

  useEffect(() => {
    if (isReady) {
      DesktopPlayerService.onUserConnected((res) => onUserConnected(res.userId, res.clientId, false, res.nickname));
      DesktopPlayerService.onUserReconnected((res) => onUserConnected(res.userId, res.clientId, true, res.nickname));
      DesktopPlayerService.onUserChanged((res) => onUserChanged(res.userId, res.nickname));

      DesktopPlayerService.onUserDisconnected((res) => {
        Logger.warn('User Disconnected:' + res?.userId);
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
