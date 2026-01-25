import React, { useState, useEffect } from 'react';
import { DEVLOGS } from '../devlogs';
import { Megaphone } from 'lucide-react';

export default function NewsTicker({ darkMode }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (DEVLOGS.length === 0) return;
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % DEVLOGS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (DEVLOGS.length === 0) return null;

  return (
    <div className={`w-full py-1.5 px-4 text-xs font-mono flex justify-center items-center gap-3 border-b transition-colors ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
      <span className="font-bold uppercase text-blue-500 flex items-center gap-1"><Megaphone size={10} /> NEWS:</span>
      <span className="animate-pulse truncate max-w-[300px] sm:max-w-none">{DEVLOGS[index].title} <span className="opacity-50 mx-1">-</span> {DEVLOGS[index].date}</span>
    </div>
  );
}