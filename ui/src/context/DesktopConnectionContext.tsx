import React, { useState, PropsWithChildren, useEffect, useContext } from 'react';
import ConnectionService from '../services/api/ConnectionService';
import StorageUtils, { StorageKey } from '../utils/StorageUtils';

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
  toggleAutoAuth: (value?: boolean) => void;
};

const DesktopConnectionContext = React.createContext<DesktopConnectionContextProps>({
  connection: { playerRoom: { id: null }, authRoom: { id: null }, settings: { automatic: false } },
  regenAuthRoom: () => {},
  toggleAutoAuth: () => {},
});

/* TO-DO unify these*/
const getInitialPlayerRoom = () => {
  return { id: StorageUtils.get(StorageKey.PLAYER_ROOM_ID) };
};

const getInitialAuthRoom = () => {
  return { id: StorageUtils.get(StorageKey.AUTH_ROOM_ID) };
};

const getInitialSettings = () => {
  const defaults = { automatic: false };
  const connectionSettings = JSON.parse(StorageUtils.get(StorageKey.CONNECTION_SETTINGS) || '{}');
  return { ...defaults, ...connectionSettings };
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

  const toggleAutoAuth = (value?: boolean) => {
    if (value !== undefined) {
      setSettings((prev) => ({ ...prev, automatic: value }));
      return;
    }
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
    StorageUtils.set(StorageKey.PLAYER_ROOM_ID, `${playerRoom.id}`);
    StorageUtils.set(StorageKey.AUTH_ROOM_ID, `${authRoom.id}`);
    StorageUtils.set(StorageKey.CONNECTION_SETTINGS, JSON.stringify(settings));
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
