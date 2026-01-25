import React from 'react';
import { Globe, Trophy } from 'lucide-react';
import { RIVAL_COMPANIES } from '../data/constants';

export default function Leaderboard({ user, netWorth, darkMode }) {
  return (
    <section className={`rounded-2xl border overflow-hidden shadow-2xl transition-colors min-h-[600px] ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className={`p-6 border-b ${darkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
        <h2 className="text-xl font-bold flex items-center gap-2 italic text-amber-500">
          <Trophy /> Global Leaderboard
        </h2>
        <p className="text-xs opacity-60 mt-1">Top PC Tycoons by Net Worth</p>
      </div>

      <div className="p-6">
        <div className="space-y-3">
            {[...RIVAL_COMPANIES, { id: 'player', name: user ? `Player ${user.uid.substr(0, 4)}` : 'You', netWorth: netWorth || 0, color: "text-emerald-400 font-black", isPlayer: true }]
                .sort((a, b) => b.netWorth - a.netWorth)
                .map((company, index) => (
                    <div key={company.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${company.isPlayer ? (darkMode ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-emerald-50 border-emerald-200') : (darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200')} ${index === 0 ? 'border-amber-500/50 bg-amber-500/5' : ''}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 flex items-center justify-center rounded-full font-black text-lg ${index === 0 ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : (index === 1 ? 'bg-slate-400 text-black' : (index === 2 ? 'bg-orange-700 text-white' : 'bg-slate-800 text-slate-500'))}`}>
                                {index + 1}
                            </div>
                            <div>
                                <div className={`font-bold text-lg ${company.color || (darkMode ? 'text-slate-200' : 'text-slate-800')}`}>{company.name}</div>
                                {company.isPlayer && <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">That's You!</div>}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-mono font-black text-xl text-emerald-500">${company.netWorth.toLocaleString()}</div>
                            <div className="text-[10px] opacity-50 uppercase font-bold">Net Worth</div>
                        </div>
                    </div>
                ))
            }
        </div>
      </div>
    </section>
  );
}
