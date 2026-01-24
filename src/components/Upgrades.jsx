// src/components/Upgrades.jsx
import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function Upgrades({ darkMode }) {
  return (
    <section className={`h-full rounded-2xl border flex flex-col items-center justify-center p-10 text-center space-y-6 shadow-xl ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className={`p-6 rounded-full ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
        <TrendingUp size={64} className="text-blue-500 opacity-80" />
      </div>
      <div>
        <h2 className={`text-3xl font-black mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Upgrades</h2>
        <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Skill tree and shop upgrades coming soon!</p>
      </div>
    </section>
  );
}