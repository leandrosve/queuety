import React, { PropsWithChildren, useContext } from 'react';
import useSocketConnection, { SocketConnection } from '../hooks/connection/useSocketConnection';
import { Socket } from 'socket.io-client';

const SocketConnectionContext = React.createContext<SocketConnection>({
  socket: {} as Socket,
  isReady: false,
  connectionId: '',
  loading: true,
  connect: () => {},
});

export const SocketConnectionProvider = ({ children }: PropsWithChildren) => {
  const connection = useSocketConnection(true);

  return <SocketConnectionContext.Provider value={connection}>{children}</SocketConnectionContext.Provider>;
};

export const useSocketConnectionContext = () => {
  return useContext(SocketConnectionContext);
};
