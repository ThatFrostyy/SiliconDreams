import React from 'react';
import { User, Trophy, Briefcase, DollarSign, Star, Award, Zap, Globe } from 'lucide-react';
import { REPUTATION_TITLES, SKILLS, ACHIEVEMENTS, RIVAL_COMPANIES } from '../data/constants';

export default function Profile({ user, money, reputation, jobsCompleted, darkMode, skills, achievements, netWorth }) {
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
          Complete jobs successfully to increase your reputation. Higher reputation will unlock VIP clients and special requests.
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

      {/* Achievements Panel */}
      <div className={`mt-6 p-6 rounded-xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
        <h3 className="font-bold flex items-center gap-2 mb-4"><Trophy className="text-purple-500" fill="currentColor" /> Achievements</h3>
        <div className="grid grid-cols-1 gap-3">
            {ACHIEVEMENTS.map(ach => {
                const unlocked = achievements && achievements.includes(ach.id);
                return (
                    <div key={ach.id} className={`p-4 rounded-lg border flex justify-between items-center ${unlocked ? (darkMode ? 'bg-purple-900/20 border-purple-500/30' : 'bg-purple-50 border-purple-200') : (darkMode ? 'bg-slate-900 border-slate-800 opacity-50' : 'bg-slate-50 border-slate-200 opacity-50')}`}>
                        <div>
                            <h4 className={`font-bold text-sm ${unlocked ? 'text-purple-400' : 'text-slate-500'}`}>{ach.title}</h4>
                            <p className="text-xs opacity-70">{ach.description}</p>
                        </div>
                        <div className="text-right">
                            {unlocked ? <span className="text-[10px] font-bold bg-purple-500 text-white px-2 py-1 rounded-full">UNLOCKED</span> : <span className="text-[10px] font-bold bg-slate-700 text-slate-400 px-2 py-1 rounded-full">LOCKED</span>}
                            <div className="text-[10px] mt-1 opacity-60">Reward: {ach.reward}</div>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      {/* Leaderboard Panel */}
      <div className={`mt-6 p-6 rounded-xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
        <h3 className="font-bold flex items-center gap-2 mb-4"><Globe className="text-blue-500" fill="currentColor" /> Industry Leaderboard</h3>
        <div className="space-y-2">
            {[...RIVAL_COMPANIES, { id: 'player', name: user ? `Player ${user.uid.substr(0, 4)}` : 'You', netWorth: netWorth, color: "text-emerald-400 font-black", isPlayer: true }]
                .sort((a, b) => b.netWorth - a.netWorth)
                .map((company, index) => (
                    <div key={company.id} className={`flex items-center justify-between p-3 rounded-lg border ${company.isPlayer ? (darkMode ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-emerald-50 border-emerald-200') : (darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200')}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full font-black text-sm ${index === 0 ? 'bg-yellow-500 text-black' : (index === 1 ? 'bg-slate-400 text-black' : (index === 2 ? 'bg-orange-700 text-white' : 'bg-slate-800 text-slate-500'))}`}>
                                {index + 1}
                            </div>
                            <div>
                                <div className={`font-bold text-sm ${company.color || (darkMode ? 'text-slate-300' : 'text-slate-700')}`}>{company.name}</div>
                                {company.isPlayer && <div className="text-[10px] text-emerald-500 font-bold uppercase">That's You!</div>}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-mono font-bold text-sm">${company.netWorth.toLocaleString()}</div>
                            <div className="text-[10px] opacity-50 uppercase">Net Worth</div>
                        </div>
                    </div>
                ))
            }
        </div>
      </div>
    </div>
  );
}