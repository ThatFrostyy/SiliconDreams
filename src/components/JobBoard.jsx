// src/components/JobBoard.jsx
import React from 'react';
import { ClipboardList, TrendingUp, Crown, Hammer, X } from 'lucide-react';

export default function JobBoard({ activeOrders, fulfillOrder, cancelJob, view, darkMode }) {
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
          {activeOrders.map(order => {
            const isRepairOrUpgrade = order.type === 'REPAIR' || order.type === 'UPGRADE';
            const isAccept = isRepairOrUpgrade && !order.inProgress;
            const isDisabled = !isAccept && view !== 'workshop';
            const isInProgress = order.inProgress;

            return (
            <div key={order.id} className={`border rounded-xl p-4 transition-colors group ${
              isInProgress 
                ? (darkMode ? 'bg-blue-500/10 border-blue-500/50' : 'bg-blue-50 border-blue-300')
                : (darkMode ? 'bg-slate-800/30 border-slate-700 hover:bg-slate-800/60' : 'bg-slate-50 border-slate-200 hover:bg-slate-100')
            }`}>
              {(order.isVip || isInProgress) && (
                <div className="flex flex-wrap gap-3 mb-2">
                  {order.isVip && (
                    <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter text-amber-400">
                      <Crown size={12} /> VIP Client
                    </div>
                  )}
                  {isInProgress && (
                    <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter text-blue-400">
                      <Hammer size={12} /> Active Job
                    </div>
                  )}
                </div>
              )}
              <div className="flex justify-between items-start mb-2">
                <h3 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-800'}`}>{order.title}</h3>
                <div className="flex items-center gap-2">
                  <div className="text-emerald-400 font-black text-sm">${order.budget}</div>
                  <button onClick={() => cancelJob(order.id)} className="text-slate-500 hover:text-rose-500 transition-colors" title="Cancel Job">
                    <X size={14} />
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mb-4 italic leading-relaxed">
                "{order.description}"
              </p>
              <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-tighter mb-4 text-slate-500">
                <div className={`flex items-center gap-1 px-2 py-1 rounded border ${darkMode ? 'bg-slate-900/80 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <TrendingUp size={10} className="text-blue-400" /> Min Perf: {order.minPerf}
                </div>
              </div>
              
              <button 
                disabled={isDisabled}
                onClick={() => fulfillOrder(order)}
                className={`w-full py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all transform active:scale-95
                  ${!isDisabled 
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-lg shadow-amber-500/20' 
                    : `${darkMode ? 'bg-slate-800 text-slate-500' : 'bg-slate-200 text-slate-400'} cursor-not-allowed`}`}
              >
                {isAccept ? 'ACCEPT JOB' : (order.type === 'REPAIR' ? 'DELIVER REPAIR' : 'DELIVER RIG')}
              </button>
            </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}