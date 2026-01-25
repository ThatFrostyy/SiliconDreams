// src/components/Workshop.jsx
import React, { useMemo } from 'react';
import { Wrench, XCircle, ChevronRight, TrendingUp, Zap, ClipboardList, CheckCircle2, AlertTriangle, Cpu, Disc, Monitor, HardDrive, Save, Trash2, DollarSign } from 'lucide-react';
import { PART_TYPES } from '../data/constants';
import { PartIcon } from './Shared';
import { calculateBuildStats } from '../utils/gameLogic';

const Slot = ({ type, label, slotKey, className = "", currentBuild, handleSlotClick, darkMode, removeFromBuild }) => {
  const key = slotKey || type;
  const part = currentBuild[key];
  const isOccupied = !!part;

  return (
    <div
      onClick={() => !isOccupied && handleSlotClick(type)}
      className={`relative group rounded-xl border-2 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center p-4
        ${isOccupied
          ? `border-blue-500/50 shadow-lg shadow-blue-900/20 ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`
          : `${darkMode ? 'bg-slate-900/50 border-slate-800 text-slate-600 hover:border-slate-600 hover:bg-slate-800/50' : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-400 hover:bg-slate-100'} border-dashed`}
        ${className}
      `}
    >
      {isOccupied ? (
        <>
          <div className="text-blue-400 mb-2"><PartIcon type={type} size={24} /></div>
          <p className="text-[10px] uppercase font-black text-slate-500 mb-1 tracking-tighter">{label}</p>
          <p className="text-xs font-bold leading-tight text-center px-2 line-clamp-2">{part.name}</p>
          <button
            onClick={(e) => { e.stopPropagation(); removeFromBuild(key); }}
            className="absolute top-2 right-2 text-rose-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <XCircle size={16} />
          </button>
        </>
      ) : (
        <>
          <div className="mb-2 opacity-20"><PartIcon type={type} size={24} /></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-center">{label}</p>
          <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
             <div className="text-[9px] text-blue-500 font-bold flex items-center gap-0.5 bg-blue-500/10 px-2 py-1 rounded-full">
                INSTALL <ChevronRight size={10} />
             </div>
          </div>
        </>
      )}
    </div>
  );
};

export default function Workshop({ currentBuild, removeFromBuild, clearBuild, handleSlotClick, darkMode, buildStats: propStats, onSaveBuild, activeBench, setActiveBench, ownedUpgrades, achievements, sellMarkup = 1.15 }) {
  
  const mobo = currentBuild[PART_TYPES.MOTHERBOARD];
  const ramSlotCount = mobo?.ramSlots || 4;

  const storageSlots = useMemo(() => {
    if (!mobo) return [{ type: PART_TYPES.STORAGE, key: PART_TYPES.STORAGE, label: 'Storage' }];
    
    const slots = [];
    // M.2 Slots
    for (let i = 1; i <= (mobo.m2Slots || 0); i++) {
        slots.push({ type: PART_TYPES.STORAGE, key: `M2_${i}`, label: `M.2 Slot ${i}`, interface: 'M.2' });
    }
    // SATA Slots
    for (let i = 1; i <= (mobo.sataSlots || 0); i++) {
        slots.push({ type: PART_TYPES.STORAGE, key: `SATA_${i}`, label: `SATA Port ${i}`, interface: 'SATA' });
    }
    // PATA Slots
    for (let i = 1; i <= (mobo.pataSlots || 0); i++) {
        slots.push({ type: PART_TYPES.STORAGE, key: `PATA_${i}`, label: `IDE Channel ${i}`, interface: 'PATA' });
    }
    return slots;
  }, [mobo]);

  const buildStats = useMemo(() => {
    const supplyPower = currentBuild[PART_TYPES.PSU]?.wattage || 0;
    
    const missingParts = Object.values(PART_TYPES).filter(type => 
      !Object.values(currentBuild).some(p => p.type === type)
    );
    const isComplete = missingParts.length === 0;
    
    const stats = propStats || calculateBuildStats(currentBuild);
    const powerOk = supplyPower >= stats.totalPower && supplyPower > 0;
    return { ...stats, supplyPower, isComplete, powerOk, missingParts };
  }, [currentBuild, propStats]);

  const totalValue = Object.values(currentBuild).reduce((sum, part) => sum + (part.price || 0), 0);
  const isGold = achievements && achievements.includes('wealth_100k');
  const slotProps = { currentBuild, handleSlotClick, darkMode, removeFromBuild };

  return (
    <div className="space-y-6">
      {ownedUpgrades && ownedUpgrades.includes('bench_2') && (
        <div className="flex gap-2">
            <button onClick={() => setActiveBench(0)} className={`flex-1 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${activeBench === 0 ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                Workbench 1
            </button>
            <button onClick={() => setActiveBench(1)} className={`flex-1 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${activeBench === 1 ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                Workbench 2
            </button>
        </div>
      )}
      <section className={`rounded-2xl border overflow-hidden shadow-2xl transition-colors ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className={`p-6 border-b flex justify-between items-center ${darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-50'}`}>
          <h2 className={`text-xl font-bold flex items-center gap-2 italic ${isGold ? 'text-amber-400' : (darkMode ? 'text-slate-100' : 'text-slate-800')}`}>
            <Wrench className="text-blue-500" /> Assembly Station
          </h2>
          <div className="flex gap-3">
            <button onClick={onSaveBuild} className="text-[10px] flex items-center gap-1 text-emerald-500 hover:text-emerald-400 transition-colors uppercase tracking-widest font-bold">
              <Save size={12} /> Save Build
            </button>
            <button onClick={clearBuild} className="text-[10px] text-slate-500 hover:text-rose-400 transition-colors underline uppercase tracking-widest font-bold">
              Clear Bench
            </button>
          </div>
        </div>

        <div className={`p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 ${isGold ? 'bg-gradient-to-br from-amber-900/20 to-yellow-900/10' : ''}`}>
            {isGold && (
                <div className="col-span-full text-center text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 py-2 rounded-lg border border-amber-500/20">✨ Gold Workbench Active: +{Math.round((sellMarkup - 1) * 100)}% PC Value ✨</div>
            )}
            
            {/* Left Column: Core Components */}
            <div className="lg:col-span-8 space-y-6">
                {/* Motherboard & CPU */}
                <div className="grid grid-cols-2 gap-4">
                    <Slot {...slotProps} type={PART_TYPES.MOTHERBOARD} label="Motherboard" className="h-40" />
                    <Slot {...slotProps} type={PART_TYPES.CPU} label="Processor" className="h-40" />
                </div>

                {/* RAM Section */}
                <div className={`p-5 rounded-xl border ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Memory Configuration</h3>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {Array.from({ length: ramSlotCount }).map((_, i) => {
                            const slotNum = i + 1;
                            const key = i === 0 ? PART_TYPES.RAM : `${PART_TYPES.RAM}_${slotNum}`;
                            return (
                                <Slot 
                                    {...slotProps}
                                    key={key} 
                                    type={PART_TYPES.RAM} 
                                    slotKey={key} 
                                    label={`DIMM ${slotNum}`} 
                                    className="h-32"
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Storage Section */}
                <div className={`p-5 rounded-xl border ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-4 bg-emerald-500 rounded-full"></div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Storage Configuration</h3>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {storageSlots.map(slot => (
                            <Slot {...slotProps} key={slot.key} type={slot.type} slotKey={slot.key} label={slot.label} className="h-24" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column: Expansion & Power */}
            <div className="lg:col-span-4 space-y-4">
                <Slot {...slotProps} type={PART_TYPES.GPU} label="Graphics Card" className="h-48" />
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                    <Slot {...slotProps} type={PART_TYPES.PSU} label="Power Supply" className="h-32" />
                </div>
            </div>
        </div>

        {/* Stats */}
        <div className={`p-6 flex flex-wrap gap-6 border-t ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex-1 min-w-[120px]">
            <p className="text-[10px] text-slate-500 uppercase font-black mb-1">System Performance</p>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-500/10' : 'bg-blue-100'}`}><TrendingUp size={20} className="text-blue-400" /></div>
              <div>
                <div className={`text-3xl font-black tracking-tight leading-none ${darkMode ? 'text-white' : 'text-slate-800'}`}>{buildStats.totalPerf}</div>
                {buildStats.bottleneckPenalty > 0 && (
                  <div className="text-[10px] text-rose-500 font-bold flex items-center gap-1">
                    <AlertTriangle size={10} /> -{buildStats.bottleneckPenalty} (Bottleneck)
                  </div>
                )}
              </div>
          </div>
          </div>
          <div className="flex-1 min-w-[120px]">
            <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Power Consumption</p>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${!buildStats.powerOk && buildStats.supplyPower > 0 ? 'bg-rose-500/10' : (darkMode ? 'bg-emerald-500/10' : 'bg-emerald-100')}`}>
                <Zap size={20} className={!buildStats.powerOk && buildStats.supplyPower > 0 ? 'text-rose-400' : 'text-emerald-400'} />
              </div>
              <div className="flex flex-col">
                <span className={`text-xl font-black ${!buildStats.powerOk && buildStats.supplyPower > 0 ? 'text-rose-400' : (darkMode ? 'text-white' : 'text-slate-800')}`}>
                    {buildStats.totalPower}W
                </span>
                <span className="text-[10px] text-slate-500 font-bold">
                    / {buildStats.supplyPower || '0'}W Capacity
                </span>
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-[120px]">
            <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Total Value</p>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-emerald-500/10' : 'bg-emerald-100'}`}><DollarSign size={20} className="text-emerald-500" /></div>
              <div className={`text-3xl font-black tracking-tight leading-none ${darkMode ? 'text-white' : 'text-slate-800'}`}>${totalValue}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Checklist */}
      <div className={`p-5 rounded-xl border ${darkMode ? 'bg-slate-900/50 border-slate-800/50' : 'bg-white border-slate-200'}`}>
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
          <ClipboardList size={14} /> Required Components
        </h3>
        <div className="flex flex-wrap gap-2">
          {Object.values(PART_TYPES).map(type => (
            <div 
                key={type} 
                className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-full border transition-colors
                ${Object.values(currentBuild).some(p => p.type === type)
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : `${darkMode ? 'bg-slate-800 border-slate-700 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-400'}`}`}
            >
              {Object.values(currentBuild).some(p => p.type === type) ? <CheckCircle2 size={12} /> : <div className="w-3 h-3 rounded-full border-2 border-slate-600" />}
              {type}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}