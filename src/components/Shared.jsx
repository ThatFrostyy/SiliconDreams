// src/components/Shared.jsx
import React from 'react';
import { Cpu, HardDrive, MemoryStick, Zap, Box } from 'lucide-react';
import { PART_TYPES } from '../data/constants';

export const PartIcon = ({ type, size = 20 }) => {
  switch(type) {
    case PART_TYPES.CPU: return <Cpu size={size} />;
    case PART_TYPES.MOTHERBOARD: return <Box size={size} />;
    case PART_TYPES.RAM: return <MemoryStick size={size} />;
    case PART_TYPES.GPU: return <Zap size={size} />;
    case PART_TYPES.STORAGE: return <HardDrive size={size} />;
    case PART_TYPES.PSU: return <Zap size={size} />;
    default: return <Box size={size} />;
  }
};

export const CategoryTabs = ({ current, set, types, darkMode }) => (
  <>
    <style>{`
      .custom-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: ${darkMode ? '#475569 #1e293b' : '#cbd5e1 #f1f5f9'};
      }
      .custom-scrollbar::-webkit-scrollbar {
        height: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: ${darkMode ? '#1e293b' : '#f1f5f9'};
        border-radius: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: ${darkMode ? '#475569' : '#cbd5e1'};
        border-radius: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: ${darkMode ? '#64748b' : '#94a3b8'};
      }
    `}</style>
    <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar">
    <button 
      onClick={() => set('ALL')}
      className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all whitespace-nowrap
        ${current === 'ALL' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : `${darkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}`}
    >
      ALL
    </button>
    {Object.values(types).map(type => (
      <button 
        key={type}
        onClick={() => set(type)}
        className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all whitespace-nowrap
          ${current === type ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : `${darkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}`}
      >
        {type.toUpperCase()}
      </button>
    ))}
    </div>
  </>
);