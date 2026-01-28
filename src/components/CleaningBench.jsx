// src/components/CleaningBench.jsx
import React, { useState, useRef } from 'react';
import { Eraser, Wind, CheckCircle2, AlertTriangle, MousePointer2 } from 'lucide-react';
import { PartIcon } from './Shared';

export default function CleaningBench({ cleaningBench, setCleaningTool, cleanSpot, inventory, placeOnCleaningMat, removeCleaningPart, darkMode }) {
  const { part, dust, stains, activeTool } = cleaningBench;
  const matRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleInteraction = (e) => {
    if (!part || !activeTool || !matRef.current) return;

    const rect = matRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    cleanSpot(x, y);
  };

  const onMouseMove = (e) => {
    if (!matRef.current) return;
    const rect = matRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });

    if (isInteracting) handleInteraction(e);
  };

  const dirtyParts = inventory.filter(p =>
    ['CPU', 'GPU', 'Motherboard', 'RAM', 'Storage'].includes(p.type) &&
    ['dusty', 'corroded', 'gunked_up', 'rusty', 'used'].includes(p.modifierId)
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Inventory Column */}
        <div className="lg:col-span-4 space-y-4">
          <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <AlertTriangle size={14} className="text-amber-500" /> Dirty Components
            </h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {dirtyParts.length === 0 ? (
                <p className="text-[10px] text-slate-600 italic text-center py-8">No dirty parts in inventory.</p>
              ) : (
                dirtyParts.map(p => (
                  <div
                    key={p.invId}
                    onClick={() => !part && placeOnCleaningMat(p)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer flex justify-between items-center group
                      ${darkMode ? 'bg-slate-800 border-slate-700 hover:border-blue-500' : 'bg-slate-50 border-slate-200 hover:border-blue-400'}
                      ${part ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <PartIcon type={p.type} size={16} />
                      <div>
                        <p className="text-xs font-bold leading-tight">{p.name}</p>
                        <p className="text-[9px] text-slate-500 font-mono uppercase">{p.modifierId}</p>
                      </div>
                    </div>
                    {!part && (
                        <div className="opacity-0 group-hover:opacity-100 text-[9px] font-black text-blue-500 bg-blue-500/10 px-2 py-1 rounded">PLACE</div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Cleaning Mat Column */}
        <div className="lg:col-span-8">
          <div className={`relative aspect-square sm:aspect-video rounded-3xl border-4 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center
            ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-300'}
          `}>

            {part ? (
              <>
                {/* Tools Overlay */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                   <button
                     onClick={() => setCleaningTool(activeTool === 'SPRAY' ? null : 'SPRAY')}
                     className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1
                       ${activeTool === 'SPRAY' ? 'bg-blue-600 border-blue-400 text-white scale-110 shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'}
                     `}
                   >
                     <Wind size={24} />
                     <span className="text-[8px] font-black tracking-tighter">ALCOHOL SPRAY</span>
                   </button>
                   <button
                     onClick={() => setCleaningTool(activeTool === 'BRUSH' ? null : 'BRUSH')}
                     className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1
                       ${activeTool === 'BRUSH' ? 'bg-amber-600 border-amber-400 text-white scale-110 shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'}
                     `}
                   >
                     <Eraser size={24} />
                     <span className="text-[8px] font-black tracking-tighter">ESD BRUSH</span>
                   </button>
                </div>

                <button
                  onClick={removeCleaningPart}
                  className="absolute top-4 right-4 z-20 p-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors text-[10px] font-bold"
                >
                  CANCEL
                </button>

                {/* Interaction Layer */}
                <div
                  ref={matRef}
                  onMouseDown={() => setIsInteracting(true)}
                  onMouseUp={() => setIsInteracting(false)}
                  onMouseLeave={() => setIsInteracting(false)}
                  onMouseMove={onMouseMove}
                  className={`relative w-full h-full flex items-center justify-center cursor-none z-10`}
                >
                  {/* The Part */}
                  <div className={`transition-all duration-500 transform ${isInteracting ? 'scale-[1.02]' : 'scale-100'}`}>
                     <PartIcon type={part.type} size={180} className="opacity-80 grayscale-[0.5]" />
                     <div className="text-center mt-4">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-500">{part.name}</p>
                     </div>
                  </div>

                  {/* Stains */}
                  {stains.map(s => (
                    <div
                      key={s.id}
                      style={{
                        left: `${s.x}%`,
                        top: `${s.y}%`,
                        width: `${s.size}px`,
                        height: `${s.size}px`,
                      }}
                      className={`absolute rounded-full blur-md transition-opacity duration-300 pointer-events-none
                        ${s.sprayed ? 'bg-blue-400/40' : 'bg-emerald-900/60'}
                      `}
                    />
                  ))}

                  {/* Dust */}
                  {dust.map(d => (
                    <div
                      key={d.id}
                      style={{
                        left: `${d.x}%`,
                        top: `${d.y}%`,
                        width: `${d.size}px`,
                        height: `${d.size}px`,
                        opacity: d.opacity
                      }}
                      className="absolute bg-slate-400/40 rounded-full blur-xl pointer-events-none"
                    />
                  ))}

                  {/* Custom Cursor */}
                  <div
                    className="absolute pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                    style={{
                      left: `${mousePos.x}%`,
                      top: `${mousePos.y}%`
                    }}
                  >
                    {activeTool === 'SPRAY' && (
                        <div className="relative">
                            <Wind size={32} className="text-blue-400 drop-shadow-lg rotate-12" />
                            {isInteracting && (
                                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/20 rounded-full animate-ping blur-sm" />
                            )}
                        </div>
                    )}
                    {activeTool === 'BRUSH' && (
                        <div className={`transition-transform ${isInteracting ? 'animate-bounce' : ''}`}>
                            <Eraser size={32} className="text-amber-500 drop-shadow-lg -rotate-12" />
                        </div>
                    )}
                    {!activeTool && <MousePointer2 size={24} className="text-white drop-shadow-lg" />}
                  </div>
                </div>

                {/* Progress Indicators */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-8">
                    <div className="flex flex-col items-center">
                        <div className="text-[10px] font-black text-slate-500 uppercase mb-1">Dust Level</div>
                        <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-slate-400 transition-all duration-300"
                              style={{ width: `${(dust.length / 20) * 100}%` }}
                            />
                        </div>
                    </div>
                    {stains.length > 0 && (
                    <div className="flex flex-col items-center">
                        <div className="text-[10px] font-black text-slate-500 uppercase mb-1">Stain Removal</div>
                        <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 transition-all duration-300"
                              style={{ width: `${(stains.filter(s => s.sprayed).length / stains.length) * 100}%` }}
                            />
                        </div>
                    </div>
                    )}
                </div>
              </>
            ) : (
              <div className="text-center space-y-4">
                <div className="p-8 rounded-full bg-blue-500/5 inline-block animate-pulse">
                    <Wind size={64} className="text-blue-500/20" />
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-500 uppercase tracking-widest">Cleaning Mat Empty</h3>
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Select a component to begin restoration</p>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className={`mt-6 p-4 rounded-xl border ${darkMode ? 'bg-blue-500/5 border-blue-500/10' : 'bg-blue-50 border-blue-100'} flex items-start gap-4`}>
             <div className="p-2 rounded-lg bg-blue-500 text-white"><AlertTriangle size={20} /></div>
             <div>
                <h4 className="text-xs font-black uppercase text-blue-500 tracking-wider">Technician Tip</h4>
                <p className="text-[11px] leading-relaxed text-slate-500 mt-1">
                    Use the <b>ESD Brush</b> to sweep away surface dust. For stubborn <b>Gunk</b> or <b>Corrosion</b>, apply <b>Alcohol Spray</b> first to loosen the residue, then brush it away. Restoration improves performance and value!
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}