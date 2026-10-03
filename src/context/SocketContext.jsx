import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { API_URL } from '../api/axios';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [disconnected, setDisconnected] = useState(false);

  const userId = user?._id;

  useEffect(() => {
    if (!userId) return;

    const s = io(API_URL, {
      auth: { token: localStorage.getItem('token') },
    });

    s.on('connect', () => setDisconnected(false));
    s.on('disconnect', () => setDisconnected(true));
    s.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
      setDisconnected(true);
    });
    s.on('online-users', setOnlineUsers);

    setSocket(s);

    return () => {
      s.disconnect();
      setSocket(null);
      setOnlineUsers([]);
      setDisconnected(false);
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, disconnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
