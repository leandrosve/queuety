import React, { useState, PropsWithChildren, useEffect, useContext } from 'react';
import ConnectionService from '../services/api/ConnectionService';

export interface ConnectionData {
  playerRoom: RoomData;
  authRoom: RoomData;
  settings: Settings;
}

interface Settings {
  automatic: boolean;
}

interface RoomData {
  id: string | null;
  loading?: boolean;
}

export type DesktopConnectionContextProps = {
  connection: ConnectionData;
  regenAuthRoom: () => void;
  toggleAutoAuth: () => void;
};

const DesktopConnectionContext = React.createContext<DesktopConnectionContextProps>({
  connection: { playerRoom: { id: null }, authRoom: { id: null }, settings: { automatic: false } },
  regenAuthRoom: () => {},
  toggleAutoAuth: () => {},
});

/* TO-DO unify these*/
const getInitialPlayerRoom = () => {
  const currentConnection = JSON.parse(localStorage.getItem('connection') || '{}');
  return { id: currentConnection?.playerRoomId };
};

const getInitialAuthRoom = () => {
  const currentConnection = JSON.parse(localStorage.getItem('connection') || '{}');
  return { id: currentConnection?.authRoomId };
};

const getInitialSettings = () => {
  const currentConnection = JSON.parse(localStorage.getItem('connection') || '{}') as ConnectionData;
  return currentConnection.settings ?? { automatic: false };
};

export const DesktopConnectionProvider = ({ children }: PropsWithChildren) => {
  const [playerRoom, setPlayerRoom] = useState<RoomData>(getInitialPlayerRoom());
  const [authRoom, setAuthRoom] = useState<RoomData>(getInitialAuthRoom());
  const [settings, setSettings] = useState<Settings>(getInitialSettings());

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

  const toggleAutoAuth = () => {
    setSettings((prev) => ({ ...prev, automatic: !prev.automatic }));
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
    localStorage.setItem('connection', JSON.stringify({ playerRoomId: playerRoom.id, authRoomId: authRoom.id, settings }));
  }, [playerRoom, authRoom, settings]);

  return (
    <DesktopConnectionContext.Provider value={{ connection: { playerRoom, authRoom, settings }, regenAuthRoom: retrieveAuthRoomId, toggleAutoAuth }}>
      {children}
    </DesktopConnectionContext.Provider>
  );
};

export const useDesktopConnectionContext = () => {
  return useContext(DesktopConnectionContext);
};
