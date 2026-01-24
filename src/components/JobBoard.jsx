// src/components/JobBoard.jsx
import React from 'react';
import { ClipboardList, TrendingUp } from 'lucide-react';

export default function JobBoard({ activeOrders, fulfillOrder, view, inventoryCount, darkMode }) {
  return (
    <div className="lg:col-span-4 space-y-6">
      <section className={`rounded-2xl border overflow-hidden shadow-xl transition-colors ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className={`p-5 border-b flex items-center justify-between text-amber-500 ${darkMode ? 'border-slate-800 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
          <div className="flex items-center gap-2">
            <ClipboardList size={20} />
            <h2 className="font-bold uppercase tracking-wider text-xs">Job Board</h2>
          </div>
          <span className="text-[10px] bg-amber-500/10 px-2 py-0.5 rounded-full font-bold">LIVE</span>
        </div>
        <div className="p-4 space-y-4">
          {activeOrders.map(order => (
            <div key={order.id} className={`border rounded-xl p-4 transition-colors group ${darkMode ? 'bg-slate-800/30 border-slate-700 hover:bg-slate-800/60' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-800'}`}>{order.title}</h3>
                <div className="text-emerald-400 font-black text-sm">${order.budget}</div>
              </div>
              <p className="text-[11px] text-slate-400 mb-4 line-clamp-2 italic leading-relaxed">
                "{order.description}"
              </p>
              <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-tighter mb-4 text-slate-500">
                <div className={`flex items-center gap-1 px-2 py-1 rounded border ${darkMode ? 'bg-slate-900/80 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <TrendingUp size={10} className="text-blue-400" /> Min Perf: {order.minPerf}
                </div>
              </div>
              
              <button 
                disabled={view !== 'workshop'}
                onClick={() => fulfillOrder(order)}
                className={`w-full py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all transform active:scale-95
                  ${view === 'workshop' 
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-lg shadow-amber-500/20' 
                    : `${darkMode ? 'bg-slate-800 text-slate-500' : 'bg-slate-200 text-slate-400'} cursor-not-allowed`}`}
              >
                DELIVER RIG
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Stats Summary */}
      <div className={`border rounded-2xl p-5 text-[10px] ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-500 uppercase font-black">Storage Capacity</span>
            <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{inventoryCount} / 50</span>
          </div>
          <div className={`w-full h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <div className="bg-blue-600 h-full" style={{ width: `${(inventoryCount / 50) * 100}%` }}></div>
          </div>
      </div>
    </div>
  );
}