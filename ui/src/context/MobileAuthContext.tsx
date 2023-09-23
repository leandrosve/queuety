import React, { PropsWithChildren, useContext } from 'react';
import useMobileAuth, { AuthError, HostStatus, MobileAuthStatus } from '../hooks/connection/useMobileAuth';
import HostData from '../model/auth/HostData';

export type MobileAuthContextProps = {
  status: MobileAuthStatus;
  hostStatus: HostStatus;
  error: AuthError | null;
  isSocketReady: boolean;
  connectionId: string;
  authRoomId: string | null | undefined;
  playerRoomId: string | null;
  userId: string | null;
  onTrigger: (authRoom: string) => void;
  host: HostData | null;
  onCancel: () => Promise<void>;
  rejectionTimeout: number;
};

const MobileAuthContext = React.createContext<MobileAuthContextProps>({
  status: MobileAuthStatus.UNSTARTED,
  hostStatus: HostStatus.DISCONNECTED,
  error: null,
  isSocketReady: false,
  connectionId: '',
  authRoomId: null,
  userId: null,
  playerRoomId: null,
  onCancel: async () => {},
  onTrigger: () => {},
  host: null,
  rejectionTimeout: 0,
});

export const MobileAuthProvider = ({ children }: PropsWithChildren) => {
  const data = useMobileAuth();
  return <MobileAuthContext.Provider value={data}>{children}</MobileAuthContext.Provider>;
};

export const useMobileAuthContext = () => {
  return useContext(MobileAuthContext);
};
