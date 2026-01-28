// src/components/CleaningBench.jsx
import React, { useState, useRef } from 'react';
import { Eraser, Wind, CheckCircle2, AlertTriangle, MousePointer2 } from 'lucide-react';
import { PartIcon } from './Shared';

const SprayMist = ({ x, y }) => (
  <div
    className="absolute pointer-events-none animate-ping origin-center"
    style={{ left: `${x}%`, top: `${y}%`, width: '100px', height: '100px', transform: 'translate(-50%, -50%)' }}
  >
    <div className="w-full h-full bg-blue-400/20 rounded-full blur-xl" />
  </div>
);

const BrushSprite = ({ isInteracting }) => (
  <div className={`pointer-events-none transition-transform ${isInteracting ? 'rotate-[-45deg] translate-y-[-10px]' : 'rotate-[-20deg]'}`}>
    <div className="w-12 h-32 bg-amber-800 rounded-t-lg border-2 border-amber-900 relative">
      <div className="absolute bottom-0 left-0 w-full h-12 bg-slate-300 border-t-2 border-slate-400 flex flex-wrap gap-0.5 p-1">
        {[...Array(20)].map((_, i) => <div key={i} className="w-0.5 h-full bg-slate-500/50" />)}
      </div>
      <div className="absolute -bottom-8 left-0 w-full h-8 bg-amber-200/40 rounded-b-lg blur-[1px]" />
    </div>
  </div>
);

const SpraySprite = ({ isInteracting }) => (
  <div className={`pointer-events-none transition-transform ${isInteracting ? 'scale-95 translate-y-1' : ''}`}>
    <div className="w-16 h-28 bg-blue-600 rounded-lg border-2 border-blue-800 relative">
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-6 h-10 bg-slate-700 rounded-t-md">
        <div className="absolute top-2 -right-4 w-4 h-2 bg-slate-800 rounded-full" /> {/* Nozzle */}
      </div>
      <div className="absolute top-4 left-2 right-2 h-10 bg-white/20 rounded font-black text-[8px] text-white flex items-center justify-center text-center leading-none">TECH<br/>CLEAN</div>
    </div>
  </div>
);

const ComponentGraphic = ({ type, name, jiggle, dust = [], stains = [] }) => {
  const pcbColor = "#1a3a3a"; // Dark forest green/teal PCB
  const traceColor = "#2d5a5a";

  const grimeOverlay = (
    <g>
      {stains.map(s => (
        <circle
          key={s.id}
          cx={`${s.x}%`}
          cy={`${s.y}%`}
          r={s.size / 2}
          fill={s.sprayed ? "#60a5fa" : "#064e3b"}
          fillOpacity={s.sprayed ? 0.6 : 0.9}
          filter="blur(4px)"
        />
      ))}
      {dust.map(d => (
        <circle
          key={d.id}
          cx={`${d.x}%`}
          cy={`${d.y}%`}
          r={d.size / 1.5}
          fill="#94a3b8"
          fillOpacity={d.opacity * 1.2}
          filter="blur(8px)"
        />
      ))}
    </g>
  );

  const motherboard = (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
      <rect x="10" y="10" width="180" height="180" fill={pcbColor} rx="4" />
      {/* PCB Traces */}
      <path d="M20 20 L50 20 M20 30 L60 30 M150 150 L180 150" stroke={traceColor} strokeWidth="0.5" fill="none" />
      {/* CPU Socket */}
      <rect x="70" y="50" width="60" height="60" fill="#222" rx="2" />
      <rect x="75" y="55" width="50" height="50" fill="#333" rx="1" />
      {/* RAM Slots */}
      <rect x="140" y="40" width="8" height="80" fill="#111" />
      <rect x="155" y="40" width="8" height="80" fill="#111" />
      {/* PCIe Slots */}
      <rect x="30" y="140" width="120" height="10" fill="#111" />
      {/* Capacitors */}
      <circle cx="50" cy="60" r="4" fill="#555" />
      <circle cx="50" cy="75" r="4" fill="#555" />
      <circle cx="50" cy="90" r="4" fill="#555" />
      {grimeOverlay}
    </svg>
  );

  const gpu = (
    <svg viewBox="0 0 300 150" className="w-full h-full">
      <rect x="10" y="30" width="280" height="90" fill="#111" rx="4" />
      <rect x="20" y="40" width="260" height="70" fill="#222" rx="2" />
      {/* Fans */}
      <circle cx="85" cy="75" r="30" fill="#151515" stroke="#333" strokeWidth="2" />
      <circle cx="215" cy="75" r="30" fill="#151515" stroke="#333" strokeWidth="2" />
      {/* Fan Blades */}
      <path d="M85 45 L85 105 M55 75 L115 75" stroke="#222" strokeWidth="4" />
      <path d="M215 45 L215 105 M185 75 L245 75" stroke="#222" strokeWidth="4" />
      {/* Backplate connector */}
      <rect x="50" y="120" width="150" height="5" fill="#c5a059" />
      {grimeOverlay}
    </svg>
  );

  const cpu = (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect x="10" y="10" width="80" height="80" fill="#c0c0c0" rx="2" />
      <rect x="20" y="20" width="60" height="60" fill="#e0e0e0" rx="1" />
      <text x="50" y="55" fontSize="8" fontWeight="bold" fill="#999" textAnchor="middle" fontFamily="monospace">{name?.substring(0, 10)}</text>
      <path d="M15 15 L25 15 M15 15 L15 25" stroke="#999" strokeWidth="1" fill="none" />
      {grimeOverlay}
    </svg>
  );

  const ram = (
    <svg viewBox="0 0 240 60" className="w-full h-full">
      <rect x="5" y="15" width="230" height="30" fill={pcbColor} rx="2" />
      {/* Memory Chips */}
      {[0,1,2,3,4,5,6,7].map(i => (
        <rect key={i} x={20 + i*25} y="20" width="15" height="20" fill="#111" rx="1" />
      ))}
      {/* Contacts */}
      <rect x="10" y="45" width="220" height="4" fill="#c5a059" />
      {grimeOverlay}
    </svg>
  );

  const storage = (
    <svg viewBox="0 0 120 160" className="w-full h-full">
      <rect x="10" y="10" width="100" height="140" fill="#333" rx="4" />
      <rect x="15" y="15" width="90" height="130" fill="#222" rx="2" />
      <rect x="25" y="30" width="70" height="40" fill="#444" rx="2" />
      <text x="60" y="55" fontSize="8" fill="#666" textAnchor="middle" fontFamily="monospace">HIGH SPEED SSD</text>
      {/* Screws */}
      <circle cx="20" cy="20" r="2" fill="#555" />
      <circle cx="100" cy="20" r="2" fill="#555" />
      <circle cx="20" cy="140" r="2" fill="#555" />
      <circle cx="100" cy="140" r="2" fill="#555" />
      {grimeOverlay}
    </svg>
  );

  const graphics = {
    'Motherboard': motherboard,
    'GPU': gpu,
    'CPU': cpu,
    'RAM': ram,
    'Storage': storage
  };

  return (
    <div className={`transition-transform duration-75 ${jiggle ? 'animate-bounce' : ''}`} style={{ width: type === 'GPU' || type === 'RAM' ? '400px' : '300px' }}>
      {graphics[type] || motherboard}
    </div>
  );
};

export default function CleaningBench({ cleaningBench, setCleaningTool, cleanSpot, inventory, placeOnCleaningMat, removeCleaningPart, darkMode }) {
  const { part, dust, stains, activeTool } = cleaningBench;
  const matRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleInteraction = (e) => {
    if (!part || !activeTool || !matRef.current) return;

    const rect = matRef.current.getBoundingClientRect();
    let x = ((e.clientX - rect.left) / rect.width) * 100;
    let y = ((e.clientY - rect.top) / rect.height) * 100;

    if (activeTool === 'SPRAY') {
        // Spray travels! Lands to the right and slightly up from nozzle
        x += 15;
        y -= 10;
    }

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

  const onTouchMove = (e) => {
    if (!matRef.current || !e.touches[0]) return;
    const touch = e.touches[0];
    const rect = matRef.current.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });

    if (isInteracting) {
        // Handle physical interaction for touch
        let ix = x;
        let iy = y;
        if (activeTool === 'SPRAY') { ix += 15; iy -= 10; }
        cleanSpot(ix, iy);
    }
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
            {/* Mat Grid Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                backgroundImage: `linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
            }} />

            {part ? (
              <>
                {/* Tools Overlay */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-3">
                   <button
                     onClick={() => setCleaningTool(activeTool === 'SPRAY' ? null : 'SPRAY')}
                     className={`w-20 h-20 rounded-2xl border-b-4 transition-all flex flex-col items-center justify-center gap-1
                       ${activeTool === 'SPRAY' ? 'bg-blue-600 border-blue-400 text-white translate-y-1 shadow-inner' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 shadow-lg'}
                     `}
                   >
                     <Wind size={24} />
                     <span className="text-[8px] font-black tracking-tighter uppercase">Spray</span>
                   </button>
                   <button
                     onClick={() => setCleaningTool(activeTool === 'BRUSH' ? null : 'BRUSH')}
                     className={`w-20 h-20 rounded-2xl border-b-4 transition-all flex flex-col items-center justify-center gap-1
                       ${activeTool === 'BRUSH' ? 'bg-amber-600 border-amber-400 text-white translate-y-1 shadow-inner' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 shadow-lg'}
                     `}
                   >
                     <Eraser size={24} />
                     <span className="text-[8px] font-black tracking-tighter uppercase">Brush</span>
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
                  onTouchStart={(e) => {
                    setIsInteracting(true);
                    if (matRef.current && e.touches[0]) {
                        const touch = e.touches[0];
                        const rect = matRef.current.getBoundingClientRect();
                        setMousePos({
                            x: ((touch.clientX - rect.left) / rect.width) * 100,
                            y: ((touch.clientY - rect.top) / rect.height) * 100
                        });
                    }
                  }}
                  onTouchEnd={() => setIsInteracting(false)}
                  onTouchMove={onTouchMove}
                  className={`relative w-full h-full flex items-center justify-center cursor-none z-10 touch-none`}
                >
                  {/* The Part */}
                  <div className={`transition-all duration-500 transform ${isInteracting ? 'scale-[1.02]' : 'scale-100'}`}>
                     <ComponentGraphic type={part.type} name={part.name} jiggle={isInteracting && activeTool === 'BRUSH'} dust={dust} stains={stains} />
                     <div className="text-center mt-4">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-500">{part.name}</p>
                     </div>
                  </div>

                  {/* Targeting Crosshair for Spray */}
                  {activeTool === 'SPRAY' && (
                    <div
                      className={`absolute pointer-events-none w-14 h-14 border-4 border-dashed border-blue-300 rounded-full flex items-center justify-center transition-opacity ${isInteracting ? 'opacity-100 scale-90' : 'opacity-80 scale-100'} filter drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]`}
                      style={{ left: `${mousePos.x + 15}%`, top: `${mousePos.y - 10}%`, transform: 'translate(-50%, -50%)' }}
                    >
                        <div className="w-3 h-3 bg-blue-400 rounded-full border-2 border-white shadow-[0_0_10px_rgba(255,255,255,1)]" />
                        {/* Crosshair Lines */}
                        <div className="absolute w-full h-0.5 bg-blue-300/30" />
                        <div className="absolute h-full w-0.5 bg-blue-300/30" />
                    </div>
                  )}

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
                            <SpraySprite isInteracting={isInteracting} />
                            {isInteracting && <SprayMist x={100} y={-50} />}
                        </div>
                    )}
                    {activeTool === 'BRUSH' && (
                        <BrushSprite isInteracting={isInteracting} />
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