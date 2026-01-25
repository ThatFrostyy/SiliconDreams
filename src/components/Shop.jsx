// src/components/Shop.jsx
import React, { useState } from 'react';
import { ShoppingBag, Package, HelpCircle } from 'lucide-react';
import { PARTS_CATALOG, PART_TYPES } from '../data/constants';
import { CategoryTabs, PartIcon } from './Shared';

export default function Shop({ buyPart, money, darkMode, skills, buyPallet }) {
  const [shopCategory, setShopCategory] = useState('ALL');
  
  const getDiscountedPrice = (price) => Math.floor(price * (1 - ((skills?.barter || 0) * 0.03)));

  return (
    <section className={`rounded-2xl border overflow-hidden shadow-2xl transition-colors ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className={`p-6 ${darkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
        <h2 className="text-xl font-bold flex items-center gap-2 italic text-emerald-400 mb-4">
          <ShoppingBag /> Component Market
        </h2>
        
        <div className="flex gap-2 mb-4">
            <button onClick={() => setShopCategory('ALL')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${shopCategory !== 'MYSTERY' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>Components</button>
            <button onClick={() => setShopCategory('MYSTERY')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${shopCategory === 'MYSTERY' ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>Mystery Pallets</button>
        </div>

        {shopCategory !== 'MYSTERY' && (
        <CategoryTabs current={shopCategory} set={setShopCategory} types={{ PC: 'PC', ...PART_TYPES }} darkMode={darkMode} />
        )}
      </div>
      
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto custom-scrollbar">
        {shopCategory === 'MYSTERY' ? (
            <>
                <div className={`p-5 rounded-xl border flex flex-col gap-3 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex justify-between items-start">
                        <div className="p-3 rounded-lg bg-amber-500/10 text-amber-500"><Package size={32} /></div>
                        <div className="text-right">
                            <h3 className="font-bold text-lg">Standard Pallet</h3>
                            <p className="text-xs opacity-60">Contains 3-5 Random Parts</p>
                        </div>
                    </div>
                    <button onClick={() => buyPallet('STANDARD')} className="w-full py-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-lg shadow-amber-500/20">
                        Buy for $500
                    </button>
                </div>
                <div className={`p-5 rounded-xl border flex flex-col gap-3 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex justify-between items-start">
                        <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500"><Package size={32} /></div>
                        <div className="text-right">
                            <h3 className="font-bold text-lg">Medium Pallet</h3>
                            <p className="text-xs opacity-60">Better Odds, Mid-Tier Parts</p>
                        </div>
                    </div>
                    <button onClick={() => buyPallet('MEDIUM')} className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20">
                        Buy for $1,000
                    </button>
                </div>
                <div className={`p-5 rounded-xl border flex flex-col gap-3 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex justify-between items-start">
                        <div className="p-3 rounded-lg bg-purple-500/10 text-purple-500"><HelpCircle size={32} /></div>
                        <div className="text-right">
                            <h3 className="font-bold text-lg">Premium Pallet</h3>
                            <p className="text-xs opacity-60">High-End Parts Guaranteed</p>
                        </div>
                    </div>
                    <button onClick={() => buyPallet('PREMIUM')} className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-500/20">
                        Buy for $2,500
                    </button>
                </div>
            </>
        ) : (
            PARTS_CATALOG.filter(p => shopCategory === 'ALL' || p.type === shopCategory).map(part => {
            const finalPrice = getDiscountedPrice(part.price);
            const hasDiscount = finalPrice < part.price;
            
            return (
            <div key={part.id} className={`p-4 rounded-xl border flex justify-between items-center hover:border-emerald-500/50 transition-all group ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg group-hover:bg-emerald-900 transition-colors ${darkMode ? 'bg-slate-700' : 'bg-white shadow-sm'}`}>
                    <PartIcon type={part.type} />
                </div>
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
                        <br/>
                        <span className="text-slate-500">SATA:{part.sataSlots || 0} • PATA:{part.pataSlots || 0} • M.2:{part.m2Slots || 0}</span>
                        <br/><span className="text-blue-500">{part.gpuInterface}</span>
                    </div>
                    )}
                    {part.type === PART_TYPES.STORAGE && (
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">
                        {part.interface} Interface
                    </div>
                    )}
                    {part.type === PART_TYPES.PSU && (
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">SATA:{part.sataConnectors} • Molex:{part.molexConnectors}</div>
                    )}
                    {part.type === PART_TYPES.GPU && (
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">
                        {part.interface}
                    </div>
                    )}
                </div>
                </div>
                <button 
                onClick={() => buyPart(part)}
                disabled={money < finalPrice}
                className={`px-4 py-2 rounded-lg font-bold transition-all flex flex-col items-end gap-0 text-xs ${money >= finalPrice ? 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                >
                <span>${finalPrice}</span>
                {hasDiscount && <span className="text-[9px] line-through opacity-60">${part.price}</span>}
                </button>
            </div>
            )})
        )}
      </div>
    </section>
  );
}