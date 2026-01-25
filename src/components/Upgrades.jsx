// src/components/Upgrades.jsx
import React, { useState } from 'react';
import { TrendingUp, Lock, Check, ArrowUpCircle } from 'lucide-react';
import { SKILLS, OFFICE_UPGRADES } from '../data/constants';

export default function Upgrades({ darkMode, skills, unlockSkill, money, ownedUpgrades, buyUpgrade }) {
  const [activeCategory, setActiveCategory] = useState('Business');
  const categories = ['Business', 'Technical', 'Operations', 'Office'];

  return (
    <section className={`rounded-2xl border overflow-hidden shadow-xl ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className={`p-6 border-b ${darkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
        <h2 className="text-xl font-bold flex items-center gap-2 italic text-purple-500">
          <TrendingUp /> Skill Tree
        </h2>
        <p className="text-xs opacity-60 mt-1">Invest in your skills to improve efficiency and profits.</p>
      </div>

      {/* Category Tabs */}
      <div className={`flex border-b ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeCategory === cat ? (darkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-blue-600') : 'text-slate-500 hover:text-slate-400'}`}
          >{cat}</button>
        ))}
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeCategory === 'Office' && Object.values(OFFICE_UPGRADES).map(upgrade => {
            const isOwned = ownedUpgrades.includes(upgrade.id);
            const canAfford = money >= upgrade.cost;
            
            return (
                <div key={upgrade.id} className={`p-5 rounded-xl border relative overflow-hidden transition-all ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-800'}`}>{upgrade.name}</h3>
                            <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">One-Time Purchase</div>
                        </div>
                        {isOwned ? <div className="bg-emerald-500/20 text-emerald-500 p-2 rounded-full"><Check size={20} /></div> : <div className="bg-slate-500/10 text-slate-400 p-2 rounded-full"><Lock size={20} /></div>}
                    </div>
                    <p className="text-xs opacity-70 mb-4 h-8">{upgrade.description}</p>
                    
                    {!isOwned ? (
                        <button 
                            onClick={() => buyUpgrade(upgrade)}
                            disabled={!canAfford}
                            className={`w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${canAfford ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                        >
                            <ArrowUpCircle size={14} /> Buy (${upgrade.cost.toLocaleString()})
                        </button>
                    ) : (
                        <div className="w-full py-2 rounded-lg font-bold text-xs bg-emerald-500/10 text-emerald-500 text-center border border-emerald-500/20">OWNED</div>
                    )}
                </div>
            );
        })}
        {Object.values(SKILLS).filter(s => s.category === activeCategory).map(skill => {
          const currentLevel = skills[skill.id];
          const isMaxed = currentLevel >= skill.maxLevel;
          const cost = Math.floor(skill.baseCost * Math.pow(skill.costMultiplier, currentLevel));
          const canAfford = money >= cost;

          return (
            <div key={skill.id} className={`p-5 rounded-xl border relative overflow-hidden transition-all ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-800'}`}>{skill.name}</h3>
                  <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">Level {currentLevel} / {skill.maxLevel}</div>
                </div>
                {isMaxed ? <div className="bg-emerald-500/20 text-emerald-500 p-2 rounded-full"><Check size={20} /></div> : <div className="bg-slate-500/10 text-slate-400 p-2 rounded-full"><Lock size={20} /></div>}
              </div>
              
              <p className="text-xs opacity-70 mb-4 h-8">{skill.description}</p>
              <div className="text-xs font-mono text-emerald-500 mb-4">{skill.effect}</div>

              {!isMaxed ? (
                <button 
                  onClick={() => unlockSkill(skill.id)}
                  disabled={!canAfford}
                  className={`w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${canAfford ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                >
                  <ArrowUpCircle size={14} /> Upgrade (${cost.toLocaleString()})
                </button>
              ) : (
                <div className="w-full py-2 rounded-lg font-bold text-xs bg-emerald-500/10 text-emerald-500 text-center border border-emerald-500/20">MAX LEVEL</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}