import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = 'http://localhost:3333';

export const createSocket = (autoConnect?:boolean) => io(URL, { autoConnect: !!autoConnect });

export const socket = io(URL, { autoConnect: false });
