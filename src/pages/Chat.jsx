import { useCallback, useEffect, useRef, useState } from 'react';
import api, { getErrorMessage } from '../api/axios';
import ChatWindow from '../components/ChatWindow';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

const addMessage = (list, msg) =>
  list.some((m) => m._id === msg._id) ? list : [...list, msg];

export default function Chat() {
  const { user, logout } = useAuth();
  const { socket, onlineUsers, disconnected } = useSocket();

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [unread, setUnread] = useState({});
  const [typing, setTyping] = useState({});
  const [error, setError] = useState('');

  // the send ack can come back after the user switched chats
  const selectedIdRef = useRef(null);
  useEffect(() => {
    selectedIdRef.current = selected?._id || null;
  }, [selected]);

  const loadUsers = useCallback(async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data.users);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, []);

  useEffect(() => {
    loadUsers().finally(() => setUsersLoading(false));
  }, [loadUsers]);

  // someone registered after we loaded the list, pick them up when they come online
  useEffect(() => {
    if (usersLoading) return;
    const unknown = onlineUsers.some(
      (id) => id !== user._id && !users.some((u) => u._id === id)
    );
    if (unknown) loadUsers();
  }, [onlineUsers, usersLoading]);

  // load history whenever a different chat is opened
  useEffect(() => {
    if (!selected) return;

    let ignore = false;
    setMessages([]);
    setMessagesLoading(true);

    api
      .get(`/messages/${selected._id}`)
      .then((res) => {
        if (ignore) return;
        // keep anything that arrived live while the request was running
        setMessages((live) => {
          const history = res.data.messages;
          const extra = live.filter((m) => !history.some((h) => h._id === m._id));
          return [...history, ...extra];
        });
      })
      .catch((err) => {
        if (!ignore) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!ignore) setMessagesLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [selected?._id]);

  useEffect(() => {
    if (!socket) return;

    const onNewMessage = (msg) => {
      setTyping((prev) => ({ ...prev, [msg.sender]: false }));

      const otherId = msg.sender === user._id ? msg.receiver : msg.sender;

      if (selected && otherId === selected._id) {
        setMessages((prev) => addMessage(prev, msg));
      } else if (msg.sender !== user._id) {
        setUnread((prev) => ({ ...prev, [msg.sender]: (prev[msg.sender] || 0) + 1 }));
      }
    };

    const onTyping = ({ from }) => setTyping((prev) => ({ ...prev, [from]: true }));
    const onStopTyping = ({ from }) => setTyping((prev) => ({ ...prev, [from]: false }));

    socket.on('new-message', onNewMessage);
    socket.on('typing', onTyping);
    socket.on('stop-typing', onStopTyping);

    return () => {
      socket.off('new-message', onNewMessage);
      socket.off('typing', onTyping);
      socket.off('stop-typing', onStopTyping);
    };
  }, [socket, selected, user._id]);

  const handleSelect = (u) => {
    setSelected(u);
    setError('');
    setUnread((prev) => ({ ...prev, [u._id]: 0 }));
  };

  const handleSend = (text) => {
    if (!socket?.connected) {
      setError('Not connected to the server, try again in a moment');
      return;
    }

    socket.timeout(5000).emit('send-message', { to: selected._id, text }, (err, res) => {
      if (err) return setError('Message timed out, check your connection');
      if (res.error) return setError(res.error);

      if (res.message.receiver === selectedIdRef.current) {
        setMessages((prev) => addMessage(prev, res.message));
      }
    });
  };

  const handleTyping = (isTyping) => {
    socket?.emit(isTyping ? 'typing' : 'stop-typing', { to: selected._id });
  };

  const partnerOnline = selected ? onlineUsers.includes(selected._id) : false;

  return (
    <div className="app-h flex flex-col">
      {disconnected && (
        <div
          role="status"
          className="flex items-center justify-center gap-2 border-b border-amber-300/60 bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 px-4 py-2 text-center text-sm font-medium text-amber-900 dark:border-amber-500/30 dark:from-amber-500/15 dark:via-amber-500/10 dark:to-amber-500/15 dark:text-amber-200"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
          Connection lost. Trying to reconnect...
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        <Sidebar
          className={selected ? 'hidden md:flex' : 'flex'}
          users={users}
          loading={usersLoading}
          selectedId={selected?._id}
          onSelect={handleSelect}
          onlineUsers={onlineUsers}
          unread={unread}
          me={user}
          onLogout={logout}
        />

        {selected ? (
          <ChatWindow
            partner={selected}
            me={user}
            messages={messages}
            loading={messagesLoading}
            online={partnerOnline}
            typing={Boolean(typing[selected._id]) && partnerOnline}
            error={error}
            onDismissError={() => setError('')}
            onSend={handleSend}
            onTyping={handleTyping}
            onBack={() => setSelected(null)}
          />
        ) : (
          <div className="chat-pattern hidden flex-1 flex-col items-center justify-center gap-4 px-6 text-center md:flex">
            <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-teal-600 shadow-float dark:bg-slate-800 dark:text-teal-400">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-10 w-10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </span>
            <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
              Pick someone from the list to start chatting
            </p>
            <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">
              Your conversations show up here in real time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
