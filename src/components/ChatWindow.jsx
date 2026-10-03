import { useEffect, useRef } from 'react';
import Avatar from './Avatar';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

export default function ChatWindow({
  partner,
  me,
  messages,
  loading,
  online,
  typing,
  error,
  onDismissError,
  onSend,
  onTyping,
  onBack,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  let status = 'Offline';
  if (typing) status = 'typing...';
  else if (online) status = 'Online';

  return (
    <section className="flex min-w-0 flex-1 flex-col bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200/70 bg-white/80 px-3 py-3 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 md:px-4">
        <button
          onClick={onBack}
          aria-label="Back to people"
          className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition duration-150 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 active:scale-95 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
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
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
        </button>
        <Avatar name={partner.username} online={online} />
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900 dark:text-slate-100">{partner.username}</p>
          <p
            className={`text-xs font-medium ${
              typing
                ? 'text-teal-700 dark:text-teal-300'
                : online
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {status}
          </p>
        </div>
      </header>

      {error && (
        <div className="relative z-10 h-0">
          <div
            role="alert"
            className="absolute inset-x-3 top-3 mx-auto flex max-w-md animate-toast-in items-center gap-3 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm text-red-700 shadow-float dark:border-red-500/30 dark:bg-slate-800 dark:text-red-300"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
            <span className="min-w-0 flex-1">{error}</span>
            <button
              onClick={onDismissError}
              className="shrink-0 rounded-lg px-2 py-1 font-semibold transition duration-150 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 active:scale-95 dark:hover:bg-red-500/10"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="chat-pattern flex-1 space-y-2 overflow-y-auto px-3 py-4 md:px-6">
        {loading && (
          <div className="flex flex-col items-center gap-3 py-16 text-sm text-slate-500 dark:text-slate-400">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-6 w-6 animate-spin text-teal-600 dark:text-teal-400"
              fill="none"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
              <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <p>Loading messages...</p>
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="flex animate-fade-in flex-col items-center gap-3 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-teal-600 shadow-soft dark:bg-slate-800 dark:text-teal-400">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </span>
            <p className="max-w-xs text-sm text-slate-600 dark:text-slate-300">
              No messages yet. Say hi to {partner.username}.
            </p>
          </div>
        )}

        {messages.map((m) => (
          <MessageBubble key={m._id} message={m} mine={m.sender === me._id} />
        ))}

        {typing && (
          <div className="flex animate-message-in justify-start">
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-200/70 bg-white px-3.5 py-2.5 text-xs text-slate-500 shadow-soft dark:border-slate-700/60 dark:bg-slate-800 dark:text-slate-400">
              <span className="flex gap-1">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-500"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </span>
              {partner.username} is typing
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <MessageInput
        key={partner._id}
        onSend={onSend}
        onTyping={onTyping}
        partnerName={partner.username}
      />
    </section>
  );
}
