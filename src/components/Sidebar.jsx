import { useState } from 'react';
import Avatar from './Avatar';

export default function Sidebar({
  users,
  loading,
  selectedId,
  onSelect,
  onlineUsers,
  unread,
  me,
  onLogout,
  className = '',
}) {
  const [query, setQuery] = useState('');

  const isOnline = (id) => onlineUsers.includes(id);

  // online people first, then alphabetical
  const visible = users
    .filter((u) => u.username.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => {
      const diff = Number(isOnline(b._id)) - Number(isOnline(a._id));
      return diff || a.username.localeCompare(b.username);
    });

  return (
    <aside
      className={`w-full flex-col border-r border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 md:w-80 ${className}`}
    >
      <div className="flex items-center gap-3 border-b border-slate-200/80 p-4 dark:border-slate-800">
        <Avatar name={me.username} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-slate-900 dark:text-slate-100">{me.username}</p>
          <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Signed in
          </p>
        </div>
        <button
          onClick={onLogout}
          aria-label="Log out"
          title="Log out"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition duration-150 hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 active:scale-95 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="m16 17 5-5-5-5" />
            <path d="M21 12H9" />
          </svg>
        </button>
      </div>

      <div className="p-3">
        <div className="relative">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people"
            className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 transition duration-200 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-teal-400 dark:focus:bg-slate-800 dark:focus:ring-teal-400/20"
          />
        </div>
      </div>

      <ul className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-3">
        {loading && (
          <li className="flex animate-pulse flex-col items-center gap-2 px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21a8 8 0 0 1 16 0" />
              </svg>
            </span>
            <span>Loading users...</span>
          </li>
        )}

        {!loading && users.length === 0 && (
          <li className="flex flex-col items-center gap-2 px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>
            <span>No other users yet. Register a second account to start a chat.</span>
          </li>
        )}

        {!loading && users.length > 0 && visible.length === 0 && (
          <li className="flex flex-col items-center gap-2 px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </span>
            <span className="break-all">Nobody matches "{query}"</span>
          </li>
        )}

        {visible.map((u) => (
          <li key={u._id}>
            <button
              onClick={() => onSelect(u)}
              className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 active:scale-[0.99] ${
                selectedId === u._id
                  ? 'bg-teal-50 dark:bg-teal-500/10'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              {selectedId === u._id && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-2.5 left-0 top-2.5 w-1 rounded-r-full bg-brand"
                />
              )}
              <Avatar name={u.username} online={isOnline(u._id)} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-900 dark:text-slate-100">{u.username}</p>
                <p
                  className={`text-xs ${
                    isOnline(u._id)
                      ? 'font-medium text-emerald-700 dark:text-emerald-400'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {isOnline(u._id) ? 'Online' : 'Offline'}
                </p>
              </div>
              {unread[u._id] > 0 && (
                <span className="min-w-[1.375rem] rounded-full bg-brand px-2 py-0.5 text-center text-xs font-semibold text-white shadow-sm shadow-teal-800/25">
                  {unread[u._id]}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
