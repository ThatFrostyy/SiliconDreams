// src/components/Header.jsx
import React from 'react';
import { Monitor, DollarSign, Wrench, ShoppingBag, Box, Settings, TrendingUp, Globe, User } from 'lucide-react';

export default function Header({ money, view, setView, toggleSettings, darkMode }) {
  return (
    <div className={`p-4 sticky top-0 z-50 shadow-xl border-b flex justify-between items-center transition-colors ${darkMode ? 'bg-slate-900 text-white border-slate-700' : 'bg-white text-slate-800 border-slate-200'}`}>
      {/* Left: Logo */}
      <div className="flex items-center gap-3 w-1/4">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Monitor size={24} />
        </div>
        <div className="hidden sm:block">
          <h1 className="font-bold text-lg tracking-tight">SILICON DREAMS</h1>
          <p className="text-xs text-slate-400 font-mono">Build. Profit. Repeat.</p>
        </div>
      </div>
      
      {/* Center: Navigation */}
      <div className="hidden md:flex items-center justify-center gap-2 flex-1">
        <button onClick={() => setView('workshop')} className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold transition-all ${view === 'workshop' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800/50'}`}>
          <Wrench size={16} /> Workshop
        </button>
        <button onClick={() => setView('shop')} className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold transition-all ${view === 'shop' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800/50'}`}>
          <ShoppingBag size={16} /> Shop
        </button>
        <button onClick={() => setView('inventory')} className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold transition-all ${view === 'inventory' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800/50'}`}>
          <Box size={16} /> Inventory
        </button>
        <button onClick={() => setView('trading')} className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold transition-all ${view === 'trading' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800/50'}`}>
          <Globe size={16} /> Market
        </button>
        <button onClick={() => setView('upgrades')} className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold transition-all ${view === 'upgrades' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800/50'}`}>
          <TrendingUp size={16} /> Upgrades
        </button>
      </div>

      {/* Right: Money & Settings */}
      <div className="flex gap-4 items-center justify-end w-1/4">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
          <DollarSign size={18} className="text-emerald-400" />
          <span className="font-bold text-emerald-400">{money.toLocaleString()}</span>
        </div>
        <button onClick={() => setView('profile')} className={`p-2 rounded-full transition-colors ${view === 'profile' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-blue-400'}`}>
          <User size={20} />
        </button>
        <button onClick={toggleSettings} className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-blue-400 transition-colors">
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
}