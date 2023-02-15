import React from 'react';
import {Socket} from 'socket.io-client';

export interface SocketInterface {
  socket: Socket<any, any>;
  setSocket: React.Dispatch<React.SetStateAction<Socket<any, any>>>;
}

export const SocketContext = React.createContext<SocketInterface>(
  {} as SocketInterface,
);
