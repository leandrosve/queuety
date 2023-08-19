import { io } from 'socket.io-client';

const URL = 'http://192.168.0.226:3334';

export const createSocket = (autoConnect?: boolean, namespace?: string) => {
  console.log('creating socket', URL + namespace);
  return io(URL + namespace, { autoConnect: !!autoConnect });
};

export const authSocket = createSocket(false, '/auth');
export const playerSocket = createSocket(false, '/player');
