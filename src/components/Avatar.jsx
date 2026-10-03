const colors = [
  'from-teal-600 to-emerald-700',
  'from-sky-600 to-blue-700',
  'from-rose-600 to-pink-700',
  'from-amber-600 to-orange-700',
  'from-violet-600 to-purple-700',
  'from-slate-500 to-slate-700',
];

// same name always lands on the same color
const pickColor = (name) => {
  let sum = 0;
  for (const ch of name) sum += ch.charCodeAt(0);
  return colors[sum % colors.length];
};

export default function Avatar({ name, online }) {
  return (
    <div className="relative shrink-0">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br text-base font-semibold uppercase text-white shadow-md ring-2 ring-white dark:ring-slate-800 ${pickColor(name)}`}
      >
        {name[0]}
      </div>
      {online !== undefined && (
        <span className="absolute bottom-0 right-0 flex h-3.5 w-3.5">
          {online && (
            <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-emerald-400" />
          )}
          <span
            className={`relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-900 ${online ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
          />
        </span>
      )}
    </div>
  );
}
