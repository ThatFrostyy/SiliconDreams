// src/App.jsx
import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, ClipboardList, Wrench, ShoppingBag, Box, Settings, Volume2, VolumeX, Music, Moon, Sun, X, TrendingUp } from 'lucide-react';
import { generateOrder } from './utils/helpers';
import { PART_TYPES, REQUEST_TEMPLATES } from './data/constants';
import { playSound, musicPlayer } from './utils/sound';
import { SpeedInsights } from "@vercel/speed-insights/react"

// Import Components
import Header from './components/Header';
import Workshop from './components/Workshop';
import Shop from './components/Shop';
import Inventory from './components/Inventory.jsx';
import JobBoard from './components/JobBoard';
import Upgrades from './components/Upgrades';

const generateRequest = () => {
  const template = REQUEST_TEMPLATES[Math.floor(Math.random() * REQUEST_TEMPLATES.length)];
  return {
    ...template,
    id: `req_${Math.random().toString(36).substr(2, 5)}`,
    type: 'REQUEST',
    minPerf: Math.floor(template.budget / 12) // Dynamic perf based on budget
  };
};

// Helper to load state from localStorage
const loadState = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

export default function App() {
  const [money, setMoney] = useState(() => loadState('money', 1200));
  const [inventory, setInventory] = useState(() => loadState('inventory', []));
  const [settings, setSettings] = useState(() => loadState('settings', { music: false, sfx: true, darkMode: true }));
  const [showSettings, setShowSettings] = useState(false);
  const [activeOrders, setActiveOrders] = useState(() => loadState('activeOrders', [generateOrder(), generateOrder()]));
  const [activeRequests, setActiveRequests] = useState(() => loadState('activeRequests', [generateRequest(), generateRequest()]));
  const [currentBuild, setCurrentBuild] = useState(() => loadState('currentBuild', {}));
  const [view, setView] = useState('workshop'); 
  const [inventoryCategory, setInventoryCategory] = useState('ALL');
  const [orderTab, setOrderTab] = useState('STANDARD');
  const [message, setMessage] = useState({ text: 'Welcome to Silicon Dreams!', type: 'info' });
  
  // Save State Effects
  useEffect(() => { localStorage.setItem('money', JSON.stringify(money)); }, [money]);
  useEffect(() => { localStorage.setItem('inventory', JSON.stringify(inventory)); }, [inventory]);
  useEffect(() => { localStorage.setItem('settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('activeOrders', JSON.stringify(activeOrders)); }, [activeOrders]);
  useEffect(() => { localStorage.setItem('activeRequests', JSON.stringify(activeRequests)); }, [activeRequests]);
  useEffect(() => { localStorage.setItem('currentBuild', JSON.stringify(currentBuild)); }, [currentBuild]);

  // Notifications
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: '', type: '' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Music Effect
  useEffect(() => {
    musicPlayer.toggle(settings.music);
  }, [settings.music]);

  const notify = (text, type) => {
    setMessage({ text, type });
    if (type === 'error') playSound('error', settings.sfx);
    else if (type === 'success') playSound('success', settings.sfx);
    else playSound('click', settings.sfx);
  };

  // Shop Logic
  const buyPart = (part) => {
    if (money >= part.price) {
      setMoney(prev => prev - part.price);
      setInventory(prev => [...prev, { ...part, invId: Math.random().toString(36).substr(2, 5) }]);
      notify(`Bought ${part.name}`, 'success');
    } else {
      notify('Not enough cash!', 'error');
    }
  };

  // Workshop Logic
  const addToBuild = (part) => {
    // Special handling for RAM to allow multiple sticks based on motherboard slots
    if (part.type === PART_TYPES.RAM) {
      const mobo = currentBuild[PART_TYPES.MOTHERBOARD];
      if (!mobo) {
        notify("Install a motherboard first to add RAM.", "error");
        return;
      }
      if (part.memoryType !== mobo.memoryType) {
        notify(`Incompatible RAM! Board requires ${mobo.memoryType}.`, "error");
        return;
      }
      
      const installedRamKeys = Object.keys(currentBuild).filter(k => k.startsWith(PART_TYPES.RAM));
      if (installedRamKeys.length >= mobo.ramSlots) {
        notify(`All ${mobo.ramSlots} RAM slots are full!`, "error");
        return;
      }
      
      const currentRamCapacity = installedRamKeys.reduce((acc, k) => acc + currentBuild[k].capacity, 0);
      if (currentRamCapacity + part.capacity > mobo.maxRam) {
        notify(`Max RAM capacity (${mobo.maxRam}GB) exceeded!`, "error");
        return;
      }
    } else if (part.type === PART_TYPES.STORAGE) {
      const mobo = currentBuild[PART_TYPES.MOTHERBOARD];
      if (!mobo) {
        notify("Install a motherboard first to add Storage.", "error");
        return;
      }

      const iface = part.interface;
      const slotKey = iface === 'M.2' ? 'm2Slots' : (iface === 'PATA' ? 'pataSlots' : 'sataSlots');
      const maxSlots = mobo[slotKey] || 0;

      const installed = Object.values(currentBuild).filter(p => p.type === PART_TYPES.STORAGE && p.interface === iface);
      if (installed.length >= maxSlots) {
        notify(`No free ${iface} slots available!`, "error");
        return;
      }

      if (iface !== 'M.2') {
        const psu = currentBuild[PART_TYPES.PSU];
        if (!psu) {
          notify("Install a PSU first to power this drive.", "error");
          return;
        }
        const connectorKey = iface === 'PATA' ? 'molexConnectors' : 'sataConnectors';
        const maxConnectors = psu[connectorKey] || 0;
        const usedConnectors = Object.values(currentBuild).filter(p => p.type === PART_TYPES.STORAGE && p.interface === iface).length;
        if (usedConnectors >= maxConnectors) {
          notify(`No free ${iface === 'PATA' ? 'Molex' : 'SATA'} power connectors!`, "error");
          return;
        }
      }
    } else if (part.type === PART_TYPES.GPU) {
      const mobo = currentBuild[PART_TYPES.MOTHERBOARD];
      if (!mobo) {
        notify("Install a motherboard first to add a GPU.", "error");
        return;
      }
      // Default to PCIe if not specified (for backward compatibility with older saves/data if any)
      if (part.interface && mobo.gpuInterface && part.interface !== mobo.gpuInterface) {
        notify(`Incompatible GPU! Board has ${mobo.gpuInterface}, GPU is ${part.interface}.`, "error");
        return;
      }
    } else if (currentBuild[part.type]) {
      notify(`Already have a ${part.type} in this build.`, 'error');
      return;
    }

    // Socket Validation
    if (part.type === PART_TYPES.CPU && currentBuild[PART_TYPES.MOTHERBOARD]) {
      if (part.socket !== currentBuild[PART_TYPES.MOTHERBOARD].socket) {
        notify(`Socket mismatch! CPU is ${part.socket} but Board is ${currentBuild[PART_TYPES.MOTHERBOARD].socket}.`, 'error');
        return;
      }
    }
    if (part.type === PART_TYPES.MOTHERBOARD && currentBuild[PART_TYPES.CPU]) {
      if (part.socket !== currentBuild[PART_TYPES.CPU].socket) {
        notify(`Socket mismatch! Board is ${part.socket} but CPU is ${currentBuild[PART_TYPES.CPU].socket}.`, 'error');
        return;
      }
    }

    let key = part.type;
    if (part.type === PART_TYPES.RAM) {
       if (!currentBuild[PART_TYPES.RAM]) {
         key = PART_TYPES.RAM;
       } else {
         let i = 2;
         while (currentBuild[`${PART_TYPES.RAM}_${i}`]) i++;
         key = `${PART_TYPES.RAM}_${i}`;
       }
    } else if (part.type === PART_TYPES.STORAGE) {
      const mobo = currentBuild[PART_TYPES.MOTHERBOARD];
      const prefix = part.interface === 'M.2' ? 'M2' : part.interface;
      const max = mobo[`${part.interface === 'M.2' ? 'm2' : part.interface.toLowerCase()}Slots`];
      
      for (let i = 1; i <= max; i++) {
        if (!currentBuild[`${prefix}_${i}`]) {
          key = `${prefix}_${i}`;
          break;
        }
      }
      if (key === part.type) { notify("Error finding slot", "error"); return; }
    }

    setCurrentBuild(prev => ({ ...prev, [key]: part }));
    setInventory(prev => prev.filter(p => p.invId !== part.invId));
    notify(`Installed ${part.name}`, 'info');
    playSound('install', settings.sfx);
    setView('workshop'); // Auto switch back
  };

  const removeFromBuild = (type) => {
    const part = currentBuild[type];
    if (!part) return;
    setInventory(prev => [...prev, part]);
    const newBuild = { ...currentBuild };
    delete newBuild[type];
    setCurrentBuild(newBuild);
    playSound('click', settings.sfx);
  };

  const clearBuild = () => {
    Object.keys(currentBuild).forEach(type => removeFromBuild(type));
    playSound('error', settings.sfx); // Using error sound for "wipe" effect
  };

  const handleSlotClick = (type) => {
    setInventoryCategory(type);
    setView('inventory');
    playSound('click', settings.sfx);
  };

  const handleViewChange = (newView) => {
    if (newView === 'inventory') setInventoryCategory('ALL');
    setView(newView);
  };

  const fulfillOrder = (order) => {
    // Re-calculate stats locally for validation
    const parts = Object.values(currentBuild);
    const totalPower = parts.reduce((acc, p) => acc + (p.power || 0), 0);
    
    // Calculate Performance with RAM Speed Multiplier
    const ramParts = parts.filter(p => p.type === PART_TYPES.RAM);
    let perfMultiplier = 1;
    if (ramParts.length > 0) {
      const avgSpeed = ramParts.reduce((acc, r) => acc + (r.speed || 2133), 0) / ramParts.length;
      perfMultiplier = 1 + ((avgSpeed - 2133) / 10000); // Small bonus for faster RAM
      if (ramParts.length >= 2) perfMultiplier += 0.05; // Dual channel bonus
    }
    const totalPerf = Math.floor(parts.reduce((acc, p) => acc + (p.perf || 0), 0) * perfMultiplier);
    
    const totalCost = parts.reduce((acc, p) => acc + (p.price || 0), 0);
    const supplyPower = currentBuild[PART_TYPES.PSU]?.wattage || 0;
    
    const missingParts = Object.values(PART_TYPES).filter(type => 
      !Object.values(currentBuild).some(p => p.type === type)
    );

    if (missingParts.length > 0) {
      notify(`Scam Alert! You are missing: ${missingParts.join(', ')}`, "error");
      return;
    }
    if (supplyPower < totalPower || supplyPower === 0) {
      notify("Power failure! That PSU can't handle this build.", "error");
      return;
    }

    if (order.type === 'REQUEST') {
      if (order.req.minRam) {
        const ram = parts.filter(p => p.type === PART_TYPES.RAM).reduce((s, p) => s + (p.capacity || 0), 0);
        if (ram < order.req.minRam) { notify(`Need ${order.req.minRam}GB RAM!`, 'error'); return; }
      }
      if (order.req.minStorage) {
        const storage = parts.filter(p => p.type === PART_TYPES.STORAGE).reduce((s, p) => s + (p.capacity || 0), 0);
        if (storage < order.req.minStorage) { notify(`Need ${order.req.minStorage}GB Storage!`, 'error'); return; }
      }
      if (order.req.partId) {
        if (!parts.find(p => p.id === order.req.partId)) { notify(`Missing required part!`, 'error'); return; }
      }
    } else {
      if (totalPerf < order.minPerf) {
        notify("Performance too low. The customer refuses to pay.", "error");
        return;
      }
    }

    const profit = order.budget - totalCost;
    const reward = order.budget + (profit > 0 ? profit * 0.2 : 0);
    
    setMoney(prev => prev + reward);
    setCurrentBuild({});
    notify(`Order Delivered! Earned $${reward.toFixed(0)}`, 'success');
    
    if (order.type === 'REQUEST') {
      setActiveRequests(prev => prev.filter(o => o.id !== order.id));
      setTimeout(() => setActiveRequests(prev => [...prev, generateRequest()]), 2000);
    } else {
      setActiveOrders(prev => prev.filter(o => o.id !== order.id));
      setTimeout(() => setActiveOrders(prev => [...prev, generateOrder()]), 2000);
    }
  };

  return (
    <div className={`min-h-screen font-sans pb-20 md:pb-0 transition-colors duration-300 ${settings.darkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-100 text-slate-800'}`}>
      <SpeedInsights />
      <Header money={money} view={view} setView={handleViewChange} inventoryCount={inventory.length} toggleSettings={() => setShowSettings(true)} darkMode={settings.darkMode} />

      {message.text && (
        <div className={`fixed top-20 right-4 z-[60] p-4 rounded-lg shadow-2xl border flex items-center gap-3 animate-bounce
          ${message.type === 'success' ? 'bg-emerald-900 border-emerald-500 text-emerald-100' : 
            message.type === 'error' ? 'bg-rose-900 border-rose-500 text-rose-100' : 
            'bg-blue-900 border-blue-500 text-blue-100'}`}>
          {message.type === 'success' ? <CheckCircle2 /> : message.type === 'error' ? <AlertTriangle /> : <ClipboardList />}
          <span className="font-semibold">{message.text}</span>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`${settings.darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} border rounded-2xl p-6 w-full max-w-md shadow-2xl`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2"><Settings /> Settings</h2>
              <button onClick={() => setShowSettings(false)} className="hover:text-rose-500"><X /></button>
            </div>
            
            <div className="space-y-4">
              <div className={`flex justify-between items-center p-4 rounded-xl ${settings.darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <div className="flex items-center gap-3">
                  {settings.music ? <Music className="text-blue-500" /> : <Music className="text-slate-500" />}
                  <span className="font-bold">Music</span>
                </div>
                <button onClick={() => setSettings(s => ({...s, music: !s.music}))} className={`w-12 h-6 rounded-full transition-colors relative ${settings.music ? 'bg-blue-600' : 'bg-slate-600'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.music ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className={`flex justify-between items-center p-4 rounded-xl ${settings.darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <div className="flex items-center gap-3">
                  {settings.sfx ? <Volume2 className="text-emerald-500" /> : <VolumeX className="text-slate-500" />}
                  <span className="font-bold">Sound Effects</span>
                </div>
                <button onClick={() => setSettings(s => ({...s, sfx: !s.sfx}))} className={`w-12 h-6 rounded-full transition-colors relative ${settings.sfx ? 'bg-emerald-600' : 'bg-slate-600'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.sfx ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className={`flex justify-between items-center p-4 rounded-xl ${settings.darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <div className="flex items-center gap-3">
                  {settings.darkMode ? <Moon className="text-purple-500" /> : <Sun className="text-amber-500" />}
                  <span className="font-bold">Theme</span>
                </div>
                <button onClick={() => setSettings(s => ({...s, darkMode: !s.darkMode}))} className={`w-12 h-6 rounded-full transition-colors relative ${settings.darkMode ? 'bg-purple-600' : 'bg-amber-500'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.darkMode ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: ACTIVE VIEW */}
        <div className="lg:col-span-8 space-y-6">
          {view === 'workshop' && (
            <Workshop 
              currentBuild={currentBuild} 
              removeFromBuild={removeFromBuild} 
              clearBuild={clearBuild} 
              handleSlotClick={handleSlotClick} 
              darkMode={settings.darkMode}
            />
          )}
          {view === 'shop' && <Shop buyPart={buyPart} money={money} darkMode={settings.darkMode} />}
          {view === 'inventory' && <Inventory inventory={inventory} addToBuild={addToBuild} category={inventoryCategory} setCategory={setInventoryCategory} darkMode={settings.darkMode} />}
          {view === 'upgrades' && <Upgrades darkMode={settings.darkMode} />}
        </div>

        {/* RIGHT COLUMN: ORDERS */}
        <div className="lg:col-span-4 space-y-4">
          <div className={`flex p-1 rounded-lg border ${settings.darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <button onClick={() => setOrderTab('STANDARD')} className={`flex-1 py-2 text-xs font-bold rounded uppercase tracking-wider transition-all ${orderTab === 'STANDARD' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Standard</button>
            <button onClick={() => setOrderTab('REQUESTS')} className={`flex-1 py-2 text-xs font-bold rounded uppercase tracking-wider transition-all ${orderTab === 'REQUESTS' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Requests</button>
          </div>
          <JobBoard 
            activeOrders={orderTab === 'STANDARD' ? activeOrders : activeRequests} 
            fulfillOrder={fulfillOrder} 
            view={view} 
            inventoryCount={inventory.length} 
            darkMode={settings.darkMode}
          />
        </div>
      </main>

      {/* MOBILE NAV */}
      <div className={`fixed bottom-0 left-0 right-0 border-t p-2 md:hidden flex justify-around items-center z-50 ${settings.darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <button onClick={() => setView('workshop')} className={`flex flex-col items-center gap-1 p-2 ${view === 'workshop' ? 'text-blue-400' : 'text-slate-500'}`}>
          <Wrench size={20} /> <span className="text-[10px] font-bold uppercase">Work</span>
        </button>
        <button onClick={() => setView('shop')} className={`flex flex-col items-center gap-1 p-2 ${view === 'shop' ? 'text-blue-400' : 'text-slate-500'}`}>
          <ShoppingBag size={20} /> <span className="text-[10px] font-bold uppercase">Shop</span>
        </button>
        <button onClick={() => setView('inventory')} className={`flex flex-col items-center gap-1 p-2 ${view === 'inventory' ? 'text-blue-400' : 'text-slate-500'}`}>
          <Box size={20} /> <span className="text-[10px] font-bold uppercase">Inv</span>
        </button>
        <button onClick={() => setView('upgrades')} className={`flex flex-col items-center gap-1 p-2 ${view === 'upgrades' ? 'text-blue-400' : 'text-slate-500'}`}>
          <TrendingUp size={20} /> <span className="text-[10px] font-bold uppercase">Upgrades</span>
        </button>
      </div>
    </div>
  );
}