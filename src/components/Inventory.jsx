// src/components/Inventory.jsx
import React from 'react';
import { Box, DollarSign } from 'lucide-react';
import { PART_TYPES } from '../data/constants';
import { CategoryTabs, PartIcon } from './Shared';

export default function Inventory({ inventory, addToBuild, sellPart, category = 'ALL', setCategory, darkMode, maxCapacity = 50 }) {
  return (
    <section className={`rounded-2xl border overflow-hidden shadow-2xl transition-colors ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className={`p-6 ${darkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2 italic text-blue-400">
            <Box /> Local Storage
          </h2>
          <span className={`text-xs font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Capacity: {inventory.length} / {maxCapacity}
          </span>
        </div>
        <CategoryTabs current={category} set={setCategory} types={{ PC: 'PC', ...PART_TYPES }} darkMode={darkMode} />
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
        {inventory.filter(p => category === 'ALL' || p.type === category).length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-600">
            <Box size={48} className="mx-auto mb-4 opacity-10" />
            <p className="uppercase text-xs font-black tracking-widest">No matching parts</p>
            <button onClick={() => setCategory('ALL')} className="text-blue-500 text-[10px] mt-2 underline">Show All</button>
          </div>
        ) : (
          inventory.filter(p => category === 'ALL' || p.type === category).map(part => (
            <div key={part.invId} className={`p-4 rounded-xl border flex justify-between items-center ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-white shadow-sm'}`}><PartIcon type={part.type} /></div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">{part.type}</p>
                  <h4 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-800'}`}>{part.name}</h4>
                  <div className="flex gap-2 text-[10px] font-mono mt-1">
                    {part.socket && <span className="text-blue-400 bg-blue-900/30 px-1 rounded">{part.socket}</span>}
                    {part.perf && <span className="text-amber-400">PERF:{part.perf}</span>}
                    {part.wattage && <span className="text-emerald-400">C:{part.wattage}W</span>}
                  </div>
                  {part.type === PART_TYPES.MOTHERBOARD && (
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">
                      {part.memoryType} • Max {part.maxRam}GB • {part.ramSlots} Slots
                    </div>
                  )}
                  {part.type === PART_TYPES.RAM && (
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">
                      {part.memoryType} • {part.capacity}GB • {part.speed}MHz
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => sellPart(part)}
                  className="p-2 rounded-lg bg-rose-900/30 text-rose-500 hover:bg-rose-600 hover:text-white transition-colors"
                  title={`Sell for $${Math.floor(part.price / 2)}`}
                >
                  <DollarSign size={16} />
                </button>
                <button 
                  onClick={() => addToBuild(part)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-black transition-all"
                >
                  {part.type === 'PC' ? 'LOAD' : 'INSTALL'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}