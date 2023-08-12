import React, { useState, PropsWithChildren, useEffect, useContext } from 'react';
import ConnectionService from '../services/api/ConnectionService';

export interface ConnectionData {
  playerRoom: RoomData;
  authRoom: RoomData;
}

interface RoomData {
  id: string | null;
  loading?: boolean;
}

export type DesktopConnectionContextProps = {
  connection: ConnectionData;
  regenAuthRoom: () => void;
};

const DesktopConnectionContext = React.createContext<DesktopConnectionContextProps>({
  connection: { playerRoom: { id: null }, authRoom: { id: null } },
  regenAuthRoom: () => {},
});

const getInitialPlayerRoom = () => {
  const currentConnection = JSON.parse(localStorage.getItem('connection') || '{}');
  return { id: currentConnection?.playerRoomId };
};

const getInitialAuthRoom = () => {
  const currentConnection = JSON.parse(localStorage.getItem('connection') || '{}');
  return { id: currentConnection?.authRoomId };
};

export const DesktopConnectionProvider = ({ children }: PropsWithChildren) => {
  const [playerRoom, setPlayerRoom] = useState<RoomData>(getInitialPlayerRoom());
  const [authRoom, setAuthRoom] = useState<RoomData>(getInitialAuthRoom());

  const retrievePlayerRoomId = async () => {
    setPlayerRoom({ id: null, loading: true });
    const res = await ConnectionService.getPlayerRoomId();
    if (res.hasError) return;
    setPlayerRoom({ id: res.data.roomId });
  };

  const retrieveAuthRoomId = async () => {
    setAuthRoom({ id: null, loading: true });
    const res = await ConnectionService.getAuthRoomId();
    if (res.hasError) return;
    setAuthRoom({ id: res.data.roomId });
  };

  useEffect(() => {
    if (!playerRoom?.id) {
      retrievePlayerRoomId();
    }
    if (!authRoom?.id) {
      retrieveAuthRoomId();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('connection', JSON.stringify({ playerRoomId: playerRoom.id, authRoomId: authRoom.id }));
  }, [playerRoom, authRoom]);

  return (
    <DesktopConnectionContext.Provider value={{ connection: { playerRoom, authRoom }, regenAuthRoom: retrieveAuthRoomId }}>
      {children}
    </DesktopConnectionContext.Provider>
  );
};

export const useDesktopConnectionContext = () => {
  return useContext(DesktopConnectionContext);
};
