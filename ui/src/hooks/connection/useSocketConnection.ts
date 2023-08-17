import React, { useEffect, useMemo, useState } from 'react';
import { createSocket } from '../../socket';
import { Socket } from 'socket.io-client';

export interface SocketConnection {
  socket: Socket;
  isReady: boolean;
  connectionId: string;
  loading: boolean;
  connect: () => void;
}

const useSocketConnection = (autoConnect?: boolean): SocketConnection => {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [connectionId, setConnectionId] = useState<string>('');
  const socket = useMemo(() => createSocket(autoConnect), []);
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
    socket.on('connection', onSocketConnected);
    socket.on('disconnect', onDisconnected);
    return () => {
      socket.off('connection', onSocketConnected);
      socket.off('disconnect', onDisconnected);
    };
  }, []);

  return { socket, isReady, connectionId, loading, connect };
};

export default useSocketConnection;
