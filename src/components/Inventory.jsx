// src/components/Inventory.jsx
import React, { useMemo, useState } from 'react';
import { Box, DollarSign, AlertTriangle, Microscope, X } from 'lucide-react';
import { PART_TYPES } from '../data/constants';
import { CategoryTabs, PartIcon } from './Shared';
import { getModifierById, isUnreliable, MODIFIERS } from '../utils/modifiers';

export default function Inventory({ inventory, addToBuild, sellPart, binPart, money, category = 'ALL', setCategory, darkMode, maxCapacity = 50, binningHistory = [] }) {

  const filteredInventory = useMemo(() => {
    if (category === 'ALL') return inventory;
    return inventory.filter(p => p.type === category);
  }, [inventory, category]);

  // Binning Modal State
  const [binningItem, setBinningItem] = useState(null);
  const [spinState, setSpinState] = useState('IDLE'); // IDLE, SPINNING, RESULT
  const [spinItems, setSpinItems] = useState([]);
  const [spinResult, setSpinResult] = useState(null);

  const handleBinClick = (part) => {
    setBinningItem(part);
    setSpinState('IDLE');
    setSpinItems([]);
    setSpinResult(null);
  };

  const startSpin = () => {
    const result = binPart(binningItem);
    if (!result) return; // Failed (money etc)
    
    setSpinResult(result);
    
    // Generate items for spinner
    const allModifiers = [...Object.values(MODIFIERS), { label: 'Average Chip', color: 'text-slate-500', id: 'average' }];
    const items = [];
    for (let i = 0; i < 60; i++) {
        items.push(allModifiers[Math.floor(Math.random() * allModifiers.length)]);
    }
    items[50] = result; // Target at index 50
    setSpinItems(items);
    
    // Trigger animation
    requestAnimationFrame(() => { requestAnimationFrame(() => { setSpinState('SPINNING'); }); });
    setTimeout(() => { setSpinState('RESULT'); }, 4000);
  };

  const closeBinning = () => { setBinningItem(null); setSpinState('IDLE'); };

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
        
        {binningHistory.length > 0 && (
            <div className={`mb-4 p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <h3 className="text-xs font-bold uppercase opacity-50 mb-2 flex items-center gap-2"><Microscope size={12} /> Recent Binning Results</h3>
                <div className="space-y-1">
                    {binningHistory.map(h => (
                        <div key={h.id} className="flex justify-between text-xs">
                            <span className="opacity-70">{h.partName}</span>
                            <span className={`font-bold ${h.color}`}>{h.result}</span>
                        </div>
                    ))}
                </div>
            </div>
        )}

        <CategoryTabs current={category} set={setCategory} types={{ PC: 'PC', ...PART_TYPES }} darkMode={darkMode} />
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
        {filteredInventory.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-600">
            <Box size={48} className="mx-auto mb-4 opacity-10" />
            <p className="uppercase text-xs font-black tracking-widest">No matching parts</p>
            <button onClick={() => setCategory('ALL')} className="text-blue-500 text-[10px] mt-2 underline">Show All</button>
          </div>
        ) : (
          filteredInventory.map(part => {
            const modifier = getModifierById(part.modifierId);
            
            return (
            <div key={part.invId} className={`p-4 rounded-xl border flex justify-between items-center relative overflow-hidden ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-white shadow-sm'}`}><PartIcon type={part.type} /></div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">{part.type}</p>
                  <h4 className={`font-bold text-sm ${modifier.color || (darkMode ? 'text-white' : 'text-slate-800')}`}>{part.name}</h4>
                  <div className="flex gap-2 text-[10px] font-mono mt-1">
                    {part.socket && <span className="text-blue-400 bg-blue-900/30 px-1 rounded">{part.socket}</span>}
                    {part.perf && <span className="text-amber-400">PERF:{part.perf}</span>}
                    {part.wattage && <span className="text-emerald-400">C:{part.wattage}W</span>}
                    <span className="text-emerald-500 font-bold">${part.price}</span>
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
                  {isUnreliable(part) && (
                    <div className="text-red-500 flex items-center gap-1 text-[10px] mt-1 font-bold">
                      <AlertTriangle size={10} /> Unreliable
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {part.type === 'CPU' && !part.isBinned && (
                  <button
                    onClick={() => handleBinClick(part)}
                    disabled={money < 50}
                    className={`p-2 rounded-lg transition-colors ${money >= 50 ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                    title="Bin/Test CPU ($50)"
                  >
                    <Microscope size={16} />
                  </button>
                )}
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
          )})
        )}
      </div>

      {/* Binning Spinner Modal */}
      {binningItem && (
        <div className="fixed inset-0 z-[90] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className={`w-full max-w-2xl p-8 rounded-3xl border flex flex-col items-center gap-6 shadow-2xl ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white'}`}>
                <div className="flex justify-between items-center w-full">
                    <h2 className="text-2xl font-black italic flex items-center gap-2"><Microscope className="text-blue-500" /> Silicon Lottery</h2>
                    {spinState !== 'SPINNING' && <button onClick={closeBinning}><X /></button>}
                </div>

                {spinState === 'IDLE' ? (
                    <div className="text-center space-y-4">
                        <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
                            <div className="text-4xl mb-2">🎲</div>
                            <h3 className="text-xl font-bold text-white">{binningItem.name}</h3>
                            <p className="text-slate-400">Test this CPU for hidden potential?</p>
                        </div>
                        <button onClick={startSpin} className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest rounded-xl shadow-lg shadow-amber-500/20 transition-transform active:scale-95">
                            Test Silicon ($50)
                        </button>
                    </div>
                ) : (
                    <div className="w-full space-y-6">
                        <div className="relative w-full h-32 bg-slate-950 rounded-xl border-4 border-slate-800 overflow-hidden flex items-center shadow-inner">
                            {/* Center Line */}
                            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-yellow-500 z-20 -translate-x-1/2 shadow-[0_0_10px_rgba(234,179,8,0.8)]"></div>
                            
                            {/* Strip */}
                            <div 
                                className="flex items-center h-full transition-transform duration-[4000ms] ease-[cubic-bezier(0.1,0,0.2,1)]"
                                style={{ transform: spinState === 'SPINNING' || spinState === 'RESULT' ? `translateX(calc(50% - ${50 * 128 + 64}px))` : 'translateX(0)' }}
                            >
                                {spinItems.map((item, i) => (
                                    <div key={i} className={`flex-shrink-0 w-32 h-24 mx-1 rounded-lg flex flex-col items-center justify-center text-center p-2 border border-slate-800 ${darkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>
                                        <div className={`font-black text-xs uppercase ${item.color}`}>{item.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {spinState === 'RESULT' && (
                            <div className="text-center animate-in zoom-in duration-300">
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Result</div>
                                <div className={`text-3xl font-black ${spinResult.color}`}>{spinResult.label}</div>
                                <button onClick={closeBinning} className="mt-6 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold">Collect</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
      )}
    </section>
  );
}