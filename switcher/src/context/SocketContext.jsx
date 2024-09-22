import socketio from "socket.io-client";
const socketUrl = import.meta.env.VITE_SOCKET_URL;
import React, {  useContext } from 'react';

const socket = socketio.connect(socketUrl);
const SocketContext = React.createContext();

export const SocketProvider = ({ children }) => {
    return (
      <SocketContext.Provider value={{ socket }}>
        {children}
      </SocketContext.Provider>
    );
  };
  
export const useSocketContext = () => useContext(SocketContext);