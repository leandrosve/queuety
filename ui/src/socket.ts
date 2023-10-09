import { io } from 'socket.io-client';

//const URL = 'https://140d-181-166-233-228.ngrok-free.app';
const URL = import.meta.env.VITE_QUEUETY_API_URL;
export const createSocket = (autoConnect?: boolean, namespace?: string) => {
  return io(URL + namespace, { autoConnect: !!autoConnect, extraHeaders: { 'ngrok-skip-browser-warning': 'true' } });
};

export const authSocket = createSocket(false, '/auth');
export const playerSocket = createSocket(false, '/player');
