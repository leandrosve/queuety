import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

export interface SocketConnection {
  socket: Socket;
  isReady: boolean;
  connectionId: string;
  loading: boolean;
  connect: () => void;
}

const useSocketStatus = (socket: Socket, autoConnect?: boolean): SocketConnection => {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [connectionId, setConnectionId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const connect = () => {
    setLoading(true);
    socket.connect();
  };

  const onSocketConnected = (id: string) => {
    setLoading(false);
    setIsReady(true);
    setConnectionId(id);
  };
  const onDisconnected = () => setIsReady(false);

  useEffect(() => {
    if (!socket) return;
    socket.on('connection', onSocketConnected);
    socket.on('disconnect', onDisconnected);
    return () => {
      socket.off('connection', onSocketConnected);
      socket.off('disconnect', onDisconnected);
    };
  }, [socket]);

  useEffect(() => {
    if (socket && autoConnect) {
      connect();
    }
  }, [socket]);

  return { socket, isReady, connectionId, loading, connect };
};

export default useSocketStatus;
