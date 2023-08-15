import React, { PropsWithChildren, useContext } from 'react';
import useDesktopAuth from '../hooks/connection/useDesktopAuth';
import { Dictionary } from '../hooks/common/useDictionary';
import AuthRequest from '../model/auth/AuthRequest';
import { AuthResponseStatus } from '../model/auth/AuthResponse';

export type DesktopAuthContextProps = {
  joinedAuthRoom: boolean;
  isSocketReady: boolean;
  connectionId: string;
  authRoom: {
    id: string | null;
    joined: boolean;
  };
  playerRoom: {
    id: string | null;
    joined: boolean;
  };
  authorizeRequest: (request: AuthRequest, status: AuthResponseStatus) => Promise<void>;
};

const initial = {
  joinedAuthRoom: false,
  isSocketReady: false,
  connectionId: '',
  authRoom: {
    id: '',
    joined: false,
  },
  playerRoom: {
    id: '',
    joined: false,
  },
  authorizeRequest: async () => {},
};

const DesktopAuthContext = React.createContext<DesktopAuthContextProps>(initial);

export const DesktopAuthProvider = ({ children }: PropsWithChildren) => {
  const data = useDesktopAuth();

  return <DesktopAuthContext.Provider value={data}>{children}</DesktopAuthContext.Provider>;
};

export const useDesktopAuthContext = () => {
  return useContext(DesktopAuthContext);
};
