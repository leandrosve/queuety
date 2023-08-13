import React, { PropsWithChildren, useContext } from 'react';
import useMobileAuth, { MobileAuthStatus } from '../hooks/connection/useMobileAuth';

export type MobileAuthContextProps = {
  status: MobileAuthStatus;
  error: string | null;
  isSocketReady: boolean;
  connectionId: string;
  authRoomId: string | null | undefined;
  playerRoomId: string | null;
  onTrigger: (authRoom: string) => void;
};

const MobileAuthContext = React.createContext<MobileAuthContextProps>({
  status: MobileAuthStatus.UNSTARTED,
  error: '',
  isSocketReady: false,
  connectionId: '',
  authRoomId: null,
  playerRoomId: null,
  onTrigger: () => {},
});

export const MobileAuthProvider = ({ children }: PropsWithChildren) => {
  const data = useMobileAuth();

  return <MobileAuthContext.Provider value={data}>{children}</MobileAuthContext.Provider>;
};

export const useMobileAuthContext = () => {
    return useContext(MobileAuthContext);
  };
