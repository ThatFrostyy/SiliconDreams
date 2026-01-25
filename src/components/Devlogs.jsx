import React, { useState } from 'react';
import { BookOpen, ChevronLeft, Calendar, FileText } from 'lucide-react';
import { DEVLOGS } from '../devlogs';

export default function Devlogs({ darkMode, setView }) {
  const [selectedLog, setSelectedLog] = useState(null);

  return (
    <section className={`rounded-2xl border overflow-hidden shadow-2xl transition-colors min-h-[600px] ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className={`p-6 border-b ${darkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
        <div className="flex items-center gap-4">
          {selectedLog && (
            <button onClick={() => setSelectedLog(null)} className="p-2 rounded-full hover:bg-slate-500/20 transition-colors">
              <ChevronLeft />
            </button>
          )}
          <h2 className="text-xl font-bold flex items-center gap-2 italic text-blue-400">
            <BookOpen /> Developer Logs
          </h2>
        </div>
      </div>

      <div className="p-6">
        {selectedLog ? (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="mb-6">
              <h1 className={`text-2xl font-black mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{selectedLog.title}</h1>
              <div className="flex items-center gap-2 text-xs opacity-60 font-mono">
                <Calendar size={12} /> {selectedLog.date}
              </div>
            </div>
            <div className={`prose ${darkMode ? 'prose-invert' : ''} max-w-none whitespace-pre-wrap text-sm leading-relaxed opacity-80`}>
              {selectedLog.content}
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {DEVLOGS.map(log => (
              <div 
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className={`p-4 rounded-xl border cursor-pointer transition-all group ${darkMode ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-blue-500/50' : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-blue-300'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`font-bold text-lg group-hover:text-blue-500 transition-colors ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{log.title}</h3>
                  <span className="text-[10px] font-mono opacity-50 bg-slate-500/10 px-2 py-1 rounded">{log.date}</span>
                </div>
                <p className="text-xs opacity-60 line-clamp-2">{log.summary}</p>
                <div className="mt-3 text-[10px] font-bold text-blue-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Read More <ChevronLeft size={10} className="rotate-180" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}