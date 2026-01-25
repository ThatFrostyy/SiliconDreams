// src/App.jsx
import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, ClipboardList, Wrench, ShoppingBag, Box, Settings, Volume2, VolumeX, Music, Moon, Sun, X, TrendingUp, Globe, Trash2, RefreshCw, Monitor, DollarSign, Crown } from 'lucide-react';
import { PART_TYPES, REQUEST_TEMPLATES, ORDER_TEMPLATES } from './data/constants';
import { playSound, musicPlayer } from './utils/sound';
import { SpeedInsights } from "@vercel/speed-insights/react"
import { signInAnonymously } from "firebase/auth";
import { auth, db } from "./utils/firebase";
import { Analytics } from "@vercel/analytics/react"
import { doc, getDoc, updateDoc, onSnapshot, collection, query, deleteDoc } from 'firebase/firestore';

// Import Components
import Header from './components/Header';
import Workshop from './components/Workshop';
import Shop from './components/Shop';
import Inventory from './components/Inventory.jsx';
import JobBoard from './components/JobBoard';
import Upgrades from './components/Upgrades';
import Trading from './components/Trading';
import Profile from './components/Profile';

const generateRequest = () => {
  const isVip = Math.random() > 0.85; // 15% chance for VIP
  const template = REQUEST_TEMPLATES[Math.floor(Math.random() * REQUEST_TEMPLATES.length)];
  const budgetMultiplier = isVip ? 1.5 : 1;
  return {
    ...template,
    id: `req_${Math.random().toString(36).substr(2, 5)}`,
    type: 'REQUEST',
    minPerf: Math.floor((template.budget * budgetMultiplier) / 12), // Dynamic perf based on budget
    budget: Math.floor(template.budget * budgetMultiplier),
    isVip,
    title: isVip ? `VIP: ${template.title}` : template.title,
    description: isVip ? `(VIP CLIENT) ${template.description}` : template.description
  };
};

const generateOrderLocal = (activeOrders = [], excludeTitle = null) => {
  const activeTitles = activeOrders.map(o => o.title);
  if (excludeTitle) activeTitles.push(excludeTitle);
  const available = ORDER_TEMPLATES.filter(t => !activeTitles.includes(t.title));
  const template = available.length > 0 
    ? available[Math.floor(Math.random() * available.length)]
    : ORDER_TEMPLATES[Math.floor(Math.random() * ORDER_TEMPLATES.length)];
  return {
    ...template,
    id: `ord_${Math.random().toString(36).substr(2, 5)}`,
    type: 'STANDARD'
  };
};

const calculateBuildStats = (build) => {
  const parts = Object.values(build);
  const totalPower = parts.reduce((acc, p) => acc + (p.power || 0), 0);
  
  const ramParts = parts.filter(p => p.type === PART_TYPES.RAM);
  let perfMultiplier = 1;
  let ramBonus = false;

  if (ramParts.length > 0) {
    const avgSpeed = ramParts.reduce((acc, r) => acc + (r.speed || 2133), 0) / ramParts.length;
    perfMultiplier = 1 + ((avgSpeed - 2133) / 10000); 
    if (ramParts.length >= 2) {
      perfMultiplier += 0.05; 
      ramBonus = true;
    }
  }

  let rawPerf = parts.reduce((acc, p) => acc + (p.perf || 0), 0);
  
  const cpu = parts.find(p => p.type === PART_TYPES.CPU);
  const gpu = parts.find(p => p.type === PART_TYPES.GPU);
  let bottleneckPenalty = 0;
  
  if (cpu && gpu) {
      const cpuPerf = cpu.perf || 0;
      const gpuPerf = gpu.perf || 0;
      if (gpuPerf > cpuPerf * 1.5) {
           bottleneckPenalty = gpuPerf - (cpuPerf * 1.5);
           rawPerf -= bottleneckPenalty;
      }
  }

  const totalPerf = Math.floor(rawPerf * perfMultiplier);
  
  return { totalPower, totalPerf, bottleneckPenalty, ramBonus };
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
  const [activeOrders, setActiveOrders] = useState(() => loadState('activeOrders', (() => {
    const o1 = generateOrderLocal([]);
    const o2 = generateOrderLocal([o1]);
    return [o1, o2];
  })()));
  const [activeRequests, setActiveRequests] = useState(() => loadState('activeRequests', [generateRequest(), generateRequest()]));
  const [currentBuild, setCurrentBuild] = useState(() => loadState('currentBuild', {}));
  const [view, setView] = useState(() => loadState('view', 'workshop')); 
  const [reputation, setReputation] = useState(() => loadState('reputation', 50));
  const [jobsCompleted, setJobsCompleted] = useState(() => loadState('jobsCompleted', 0));
  const [inventoryCategory, setInventoryCategory] = useState('ALL');
  const [orderTab, setOrderTab] = useState(() => loadState('orderTab', 'STANDARD'));
  const [message, setMessage] = useState({ text: 'Welcome to Silicon Dreams!', type: 'info' });
  const [user, setUser] = useState(null);
  
  // Save State Effects
  useEffect(() => { localStorage.setItem('money', JSON.stringify(money)); }, [money]);
  useEffect(() => { localStorage.setItem('inventory', JSON.stringify(inventory)); }, [inventory]);
  useEffect(() => { localStorage.setItem('settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('activeOrders', JSON.stringify(activeOrders)); }, [activeOrders]);
  useEffect(() => { localStorage.setItem('activeRequests', JSON.stringify(activeRequests)); }, [activeRequests]);
  useEffect(() => { localStorage.setItem('currentBuild', JSON.stringify(currentBuild)); }, [currentBuild]);
  useEffect(() => { localStorage.setItem('view', JSON.stringify(view)); }, [view]);
  useEffect(() => { localStorage.setItem('orderTab', JSON.stringify(orderTab)); }, [orderTab]);
  useEffect(() => { localStorage.setItem('reputation', JSON.stringify(reputation)); }, [reputation]);
  useEffect(() => { localStorage.setItem('jobsCompleted', JSON.stringify(jobsCompleted)); }, [jobsCompleted]);

  const buildStats = calculateBuildStats(currentBuild);

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

  const resetGame = () => {
    if (window.confirm("Are you sure you want to reset your game? All progress will be lost.")) {
      setMoney(1200);
      setInventory([]);
      setSettings({ music: false, sfx: true, darkMode: true });
      const o1 = generateOrderLocal([]);
      const o2 = generateOrderLocal([o1]);
      setActiveOrders([o1, o2]);
      setActiveRequests([generateRequest(), generateRequest()]);
      setCurrentBuild({});
      setView('workshop');
      setOrderTab('STANDARD');
      setShowSettings(false);
      notify("Game Reset Successfully", "success");
    }
  };

    useEffect(() => {
    console.log("🔌 Testing Firebase connection...");
    signInAnonymously(auth)
      .then((userCredential) => {
        console.log("✅ Firebase Connected! User ID:", userCredential.user.uid);
        setUser(userCredential.user);
      })
      .catch((error) => console.error("❌ Firebase Connection Failed:", error));
  }, []);

  // Check for earnings from Trading
  useEffect(() => {
    if (!user) return;
    
    // Listen to the 'inbox' subcollection for incoming trades/sales
    const q = query(collection(db, 'users', user.uid, 'inbox'));
    
    const unsub = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          const docRef = change.doc.ref;

          if (data.type === 'EARNINGS') {
            setMoney(prev => prev + data.amount);
            notify(`You sold items on the market! Earned $${data.amount}`, 'success');
            deleteDoc(docRef).catch(e => console.error("Error clearing inbox", e));
          } else if (data.type === 'ITEM') {
             const newItem = { ...data.item, invId: Math.random().toString(36).substr(2, 5) };
             setInventory(prev => [...prev, newItem]);
             notify(`Trade complete! Received ${newItem.name}.`, 'success');
             deleteDoc(docRef).catch(e => console.error("Error clearing inbox", e));
          }
        }
      });
    });
    return () => unsub();
  }, [user]);

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

  // Sell Logic (Half Price)
  const sellPart = (part) => {
    const sellPrice = Math.floor(part.price * (part.type === 'PC' ? 0.8 : 0.5));
    setMoney(prev => prev + sellPrice);
    setInventory(prev => prev.filter(p => p.invId !== part.invId));
    notify(`Sold ${part.name} for $${sellPrice}`, 'success');
    playSound('click', settings.sfx);
  };

  // Trading Logic
  const handlePostTrade = (invId) => {
    setInventory(prev => prev.filter(p => p.invId !== invId));
    notify("Item listed on market", "success");
  };

  const handleBuyTrade = (part, price) => {
    setMoney(prev => prev - price);
    setInventory(prev => [...prev, { ...part, invId: Math.random().toString(36).substr(2, 5) }]);
    notify(`Bought ${part.name} from market`, "success");
  };

  const handleItemTrade = (incomingPart, outgoingPartInvId) => {
    setInventory(prev => prev.filter(p => p.invId !== outgoingPartInvId));
    setInventory(prev => [...prev, { ...incomingPart, invId: Math.random().toString(36).substr(2, 5) }]);
    notify(`Traded for ${incomingPart.name}`, "success");
  };

  // PC Management Logic
  const saveBuildToInventory = () => {
    const parts = Object.values(currentBuild);
    if (parts.length === 0) { notify("Cannot save an empty build!", "error"); return; }
    
    const totalCost = parts.reduce((acc, p) => acc + (p.price || 0), 0);
    const { totalPerf } = buildStats;
    
    const newPC = {
      invId: Math.random().toString(36).substr(2, 9),
      type: 'PC',
      name: `Custom PC ${Math.floor(Math.random()*1000)}`,
      parts: currentBuild,
      price: Math.floor(totalCost * 1.15), // 15% markup value
      perf: totalPerf,
      power: buildStats.totalPower
    };
    
    setInventory(prev => [...prev, newPC]);
    setCurrentBuild({});
    notify("PC saved to inventory!", "success");
    playSound('success', settings.sfx);
  };

  const disassembleBuild = (pcItem) => {
    setInventory(prev => prev.filter(i => i.invId !== pcItem.invId));
    const parts = Object.values(pcItem.parts).map(p => ({
      ...p,
      invId: Math.random().toString(36).substr(2, 9)
    }));
    setInventory(prev => [...prev, ...parts]);
    notify("PC disassembled. Parts returned to inventory.", "info");
    playSound('click', settings.sfx);
  };

  const sellBuildInstant = (pcItem) => {
     setInventory(prev => prev.filter(i => i.invId !== pcItem.invId));
     const sellPrice = Math.floor(pcItem.price * 0.8); // Instant sell penalty
     setMoney(m => m + sellPrice);
     notify(`Sold PC for $${sellPrice}`, "success");
     playSound('cash', settings.sfx);
  };

  // Workshop Logic
  const addToBuild = (part) => {
    // Handle PC Loading (Fix for invisible parts/price inflation)
    if (part.type === 'PC') {
      if (Object.keys(currentBuild).length > 0) {
        notify("Workbench must be empty to load a PC.", "error");
        return;
      }
      setCurrentBuild(part.parts);
      setInventory(prev => prev.filter(p => p.invId !== part.invId));
      notify(`Loaded ${part.name} to workbench`, 'success');
      setView('workshop');
      return;
    }

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

  const reshuffleJobs = () => {
    if (money < 50) { notify("Not enough money to reshuffle ($50)", "error"); return; }
    setMoney(m => m - 50);
    const o1 = generateOrderLocal([]);
    const o2 = generateOrderLocal([o1]);
    setActiveOrders([o1, o2]);
    setActiveRequests([generateRequest(), generateRequest()]);
    notify("Jobs reshuffled!", "success");
    playSound('click', settings.sfx);
  };

  const fulfillOrder = (order) => {
    const parts = Object.values(currentBuild);
    const { totalPerf, totalPower, bottleneckPenalty } = buildStats;

    if (bottleneckPenalty > 0) {
      notify(`Bottleneck! CPU limits GPU. Performance reduced by ${Math.floor(bottleneckPenalty)}.`, "error");
    }
    
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
    }

    if (totalPerf < order.minPerf) {
      notify(`Performance too low (${totalPerf}/${order.minPerf}). The customer refuses to pay.`, "error");
      return;
    }

    // Reward Logic: Cover parts cost + 25% profit margin, capped at the customer's budget.
    // This prevents players from spending very little to get a huge fixed reward,
    // and encourages building quality PCs up to the budget limit.
    let calculatedReward = Math.floor(totalCost * 1.25);
    if (calculatedReward > order.budget) calculatedReward = order.budget;
    
    const profit = calculatedReward - totalCost;
    
    setMoney(prev => prev + calculatedReward);
    setCurrentBuild({});
    setReputation(prev => Math.min(prev + (order.type === 'REQUEST' ? (order.isVip ? 10 : 5) : 2), 100));
    setJobsCompleted(prev => prev + 1);
    notify(`Order Delivered! Earned $${calculatedReward} (Profit: $${profit})`, 'success');
    
    if (order.type === 'REQUEST') {
      setActiveRequests(prev => prev.filter(o => o.id !== order.id));
      setTimeout(() => setActiveRequests(prev => [...prev, generateRequest()]), 2000);
    } else {
      setActiveOrders(prev => prev.filter(o => o.id !== order.id));
      setTimeout(() => setActiveOrders(prev => {
        const newOrder = generateOrderLocal(prev, order.title);
        return [...prev, newOrder];
      }), 2000);
    }
  };

  return (
    <div className={`min-h-screen font-sans pb-20 md:pb-0 transition-colors duration-300 ${settings.darkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-100 text-slate-800'}`}>
      <SpeedInsights />
      <Analytics />
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

              <div className="pt-4 border-t border-slate-700/50">
                <button 
                  onClick={resetGame}
                  className="w-full py-3 rounded-xl font-bold bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center gap-2 transition-colors shadow-lg shadow-rose-900/20"
                >
                  <Trash2 size={20} /> Reset Game Progress
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
              buildStats={buildStats}
              inventory={inventory}
              onSaveBuild={saveBuildToInventory}
              onDisassemble={disassembleBuild}
              onSellBuild={sellBuildInstant}
            />
          )}
          {view === 'shop' && <Shop buyPart={buyPart} money={money} darkMode={settings.darkMode} />}
          {view === 'inventory' && <Inventory inventory={inventory} addToBuild={addToBuild} sellPart={sellPart} category={inventoryCategory} setCategory={setInventoryCategory} darkMode={settings.darkMode} />}
          {view === 'upgrades' && <Upgrades darkMode={settings.darkMode} />}
          {view === 'trading' && <Trading inventory={inventory} onPostTrade={handlePostTrade} money={money} onBuyTrade={handleBuyTrade} onItemTrade={handleItemTrade} user={user} darkMode={settings.darkMode} />}
          {view === 'profile' && <Profile user={user} money={money} reputation={reputation} jobsCompleted={jobsCompleted} darkMode={settings.darkMode} />}
        </div>

        {/* RIGHT COLUMN: ORDERS */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex justify-end">
            <button onClick={reshuffleJobs} className="text-[10px] flex items-center gap-1 bg-slate-200 hover:bg-slate-300 text-slate-600 px-2 py-1 rounded transition-colors dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700">
              <RefreshCw size={12} /> Reshuffle ($50)
            </button>
          </div>

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

          {/* Saved Builds Section (Moved from Workshop) */}
          {inventory && inventory.some(i => i.type === 'PC') && (
            <div className={`p-5 rounded-xl border ${settings.darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><Monitor size={16} /> Saved Builds</h3>
              <div className="grid grid-cols-1 gap-4">
                {inventory.filter(i => i.type === 'PC').map(pc => (
                  <div key={pc.invId} className={`p-4 rounded-lg border flex justify-between items-center ${settings.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <div>
                      <div className="font-bold text-sm">{pc.name}</div>
                      <div className="text-xs opacity-60 flex gap-2">
                        <span>Perf: {pc.perf}</span>
                        <span>Val: ${pc.price}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => sellBuildInstant(pc)} className="p-2 rounded bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all" title="Quick Sell (Low Price)">
                        <DollarSign size={16} />
                      </button>
                      <button onClick={() => disassembleBuild(pc)} className="p-2 rounded bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all" title="Disassemble">
                        <Wrench size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
        <button onClick={() => setView('trading')} className={`flex flex-col items-center gap-1 p-2 ${view === 'trading' ? 'text-blue-400' : 'text-slate-500'}`}>
          <Globe size={20} /> <span className="text-[10px] font-bold uppercase">Trade</span>
        </button>
        <button onClick={() => setView('upgrades')} className={`flex flex-col items-center gap-1 p-2 ${view === 'upgrades' ? 'text-blue-400' : 'text-slate-500'}`}>
          <TrendingUp size={20} /> <span className="text-[10px] font-bold uppercase">Upgrades</span>
        </button>
      </div>
    </div>
  );
}