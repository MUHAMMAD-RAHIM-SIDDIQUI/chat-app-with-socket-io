export default function MessageBubble({ message, mine }) {
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex animate-message-in ${mine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] px-3.5 py-2 text-sm leading-relaxed md:max-w-[65%] ${
          mine
            ? 'rounded-2xl rounded-br-md bg-brand text-white shadow-md shadow-teal-900/15'
            : 'rounded-2xl rounded-bl-md border border-slate-200/70 bg-white text-slate-800 shadow-soft dark:border-slate-700/60 dark:bg-slate-800 dark:text-slate-100'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
        <span
          className={`mt-1 block text-right text-[10px] leading-none ${mine ? 'text-white/80' : 'text-slate-400 dark:text-slate-400'}`}
        >
          {time}
        </span>
      </div>
    </div>
  );
}
