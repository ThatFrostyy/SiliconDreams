import React from 'react';
import { User, Trophy, Briefcase, DollarSign, Star, Award, Zap } from 'lucide-react';
import { REPUTATION_TITLES, SKILLS } from '../data/constants';

export default function Profile({ user, money, reputation, jobsCompleted, darkMode, skills }) {
  const getReputationTitle = (rep) => {
    return REPUTATION_TITLES.find(t => rep >= t.threshold)?.title || "Unknown";
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 rounded-2xl border shadow-2xl ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'}`}>
      <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
        <div className={`p-8 rounded-full ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <User size={64} className="text-blue-500" />
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-black mb-2">{user ? `Player ${user.uid.substr(0, 4)}` : 'Guest Player'}</h2>
          <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-500 font-bold">
            <Award size={20} />
            <span>{getReputationTitle(reputation)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center gap-3 mb-2 text-slate-500">
            <DollarSign size={20} />
            <span className="text-xs font-black uppercase tracking-widest">Total Wealth</span>
          </div>
          <div className="text-2xl font-black">${money.toLocaleString()}</div>
        </div>
        
        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center gap-3 mb-2 text-slate-500">
            <Briefcase size={20} />
            <span className="text-xs font-black uppercase tracking-widest">Jobs Completed</span>
          </div>
          <div className="text-2xl font-black">{jobsCompleted}</div>
        </div>

        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center gap-3 mb-2 text-slate-500">
            <Trophy size={20} />
            <span className="text-xs font-black uppercase tracking-widest">Reputation Score</span>
          </div>
          <div className="text-2xl font-black">{reputation}/100</div>
        </div>
      </div>

      <div className={`p-6 rounded-xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
        <div className="flex justify-between items-end mb-2">
          <h3 className="font-bold flex items-center gap-2"><Star className="text-amber-500" fill="currentColor" /> Reputation Progress</h3>
          <span className="text-xs font-mono opacity-60">{reputation}%</span>
        </div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-1000 ease-out"
            style={{ width: `${reputation}%` }}
          />
        </div>
        <p className="text-xs mt-4 opacity-60 leading-relaxed">
          Complete jobs successfully to increase your reputation. Higher reputation will unlock VIP clients and special requests in future updates.
        </p>
      </div>

      {/* Active Buffs Panel */}
      <div className={`mt-6 p-6 rounded-xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
        <h3 className="font-bold flex items-center gap-2 mb-4"><Zap className="text-yellow-500" fill="currentColor" /> Active Effects</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(skills).map(([skillId, level]) => {
            if (level === 0) return null;
            const skillDef = SKILLS[skillId];
            return (
              <div key={skillId} className={`p-3 rounded-lg border flex justify-between items-center ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div>
                  <div className="font-bold text-sm">{skillDef.name}</div>
                  <div className="text-[10px] opacity-60">{skillDef.description}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-emerald-500">Lvl {level}</div>
                  <div className="text-[10px] font-mono opacity-70">{skillDef.effect.replace('/ Lvl', '')}</div>
                </div>
              </div>
            );
          })}
          {Object.values(skills).every(l => l === 0) && (
            <div className="col-span-full text-center text-xs opacity-50 py-4">No active skills. Visit Upgrades to unlock buffs.</div>
          )}
        </div>
      </div>
    </div>
  );
}