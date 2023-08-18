import { io } from 'socket.io-client';

const URL = 'http://192.168.0.226:3334';

export const createSocket = (autoConnect?: boolean, namespace?: string) => {
  return io(URL + namespace, { autoConnect: !!autoConnect });
};

export const authSocket = createSocket(false, '/auth');
