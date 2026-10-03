import { useEffect, useRef, useState } from 'react';

export default function MessageInput({ onSend, onTyping, partnerName }) {
  const [text, setText] = useState('');
  const typingTimer = useRef(null);
  const isTyping = useRef(false);

  // this component is re-created for every chat (see key in ChatWindow),
  // so the first onTyping always points at the right person
  useEffect(() => {
    return () => {
      clearTimeout(typingTimer.current);
      if (isTyping.current) onTyping(false);
    };
  }, []);

  const handleChange = (e) => {
    setText(e.target.value);

    if (!isTyping.current) {
      isTyping.current = true;
      onTyping(true);
    }

    // no keystrokes for 1.5s means they stopped typing
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      isTyping.current = false;
      onTyping(false);
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    clearTimeout(typingTimer.current);
    if (isTyping.current) {
      isTyping.current = false;
      onTyping(false);
    }

    onSend(trimmed);
    setText('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-slate-200/70 bg-white/70 p-3 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/70 md:p-4"
    >
      <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1.5 pl-5 shadow-float transition duration-200 focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-500/15 dark:border-slate-700 dark:bg-slate-800 dark:focus-within:border-teal-400 dark:focus-within:ring-teal-400/20">
        <input
          type="text"
          value={text}
          onChange={handleChange}
          maxLength={2000}
          placeholder={`Message ${partnerName}`}
          className="min-w-0 flex-1 bg-transparent py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-md shadow-teal-800/25 transition duration-200 hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/40 active:scale-95 disabled:cursor-not-allowed disabled:bg-none disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:active:scale-100 dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-[18px] w-[18px] -translate-x-px translate-y-px"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
          <span className="sr-only">Send</span>
        </button>
      </div>
    </form>
  );
}
