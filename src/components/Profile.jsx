import React from 'react';
import { User, Trophy, Briefcase, DollarSign, Star, Award, Zap, History } from 'lucide-react';
import { REPUTATION_TITLES, SKILLS, ACHIEVEMENTS } from '../data/constants';

export default function Profile({ user, money, reputation, jobsCompleted, darkMode, skills, achievements, jobHistory }) {
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

      {/* Job History Panel */}
      <div className={`mt-6 p-6 rounded-xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
        <h3 className="font-bold flex items-center gap-2 mb-4"><History className="text-blue-400" /> Job History (Last 10)</h3>
        <div className="space-y-3">
            {jobHistory && jobHistory.length > 0 ? jobHistory.map(job => (
                <div key={job.id} className={`p-3 rounded-lg border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-sm">{job.title}</span>
                        <span className="text-emerald-500 font-mono text-xs font-bold">+${job.reward}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex text-amber-400 text-[10px] gap-0.5">
                            {"⭐".repeat(job.stars)}
                        </div>
                        <span className="text-[10px] opacity-50">{job.date}</span>
                    </div>
                    <p className="text-xs italic opacity-70 mt-2">"{job.review}"</p>
                </div>
            )) : (
                <div className="text-center opacity-50 text-xs py-4">No jobs completed yet.</div>
            )}
        </div>
      </div>
    </div>
  );
}