import { io } from 'socket.io-client';

const URL = 'https://6454-181-166-233-228.ngrok-free.app';
//const URL = 'http://192.168.0.226:3334';
export const createSocket = (autoConnect?: boolean, namespace?: string) => {
  return io(URL + namespace, { autoConnect: !!autoConnect, extraHeaders: { 'ngrok-skip-browser-warning': 'true' } });
};

export const authSocket = createSocket(false, '/auth');
export const playerSocket = createSocket(false, '/player');
