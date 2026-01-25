// src/App.jsx
import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, ClipboardList, Wrench, ShoppingBag, Box, TrendingUp, Globe, RefreshCw, Monitor, DollarSign, BookOpen } from 'lucide-react';
import { musicPlayer } from './utils/sound';
import { SpeedInsights } from "@vercel/speed-insights/react"
import { signInAnonymously } from "firebase/auth";
import { auth, db } from "./utils/firebase";
import { Analytics } from "@vercel/analytics/react"
import { onSnapshot, collection, query, deleteDoc } from 'firebase/firestore';
import { useGameStore } from './store/gameStore';
import { calculateBuildStats } from './utils/gameLogic';

// Import Components
import Header from './components/Header';
import Workshop from './components/Workshop';
import Shop from './components/Shop';
import Inventory from './components/Inventory.jsx';
import JobBoard from './components/JobBoard';
import Upgrades from './components/Upgrades';
import Trading from './components/Trading';
import Profile from './components/Profile';
import Devlogs from './components/Devlogs';
import Leaderboard from './components/Leaderboard';
import NewsTicker from './components/NewsTicker';
import SettingsModal from './components/SettingsModal';
import CelebrationOverlay from './components/CelebrationOverlay';

export default function App() {
  // --- STORE SELECTORS ---
  const money = useGameStore(state => state.money);
  const inventory = useGameStore(state => state.inventory);
  const settings = useGameStore(state => state.settings);
  const activeOrders = useGameStore(state => state.activeOrders);
  const activeRequests = useGameStore(state => state.activeRequests);
  const skills = useGameStore(state => state.skills);
  const builds = useGameStore(state => state.builds);
  const activeBench = useGameStore(state => state.activeBench);
  const ownedUpgrades = useGameStore(state => state.ownedUpgrades);
  const achievements = useGameStore(state => state.achievements);
  const jobHistory = useGameStore(state => state.jobHistory);
  const view = useGameStore(state => state.view);
  const reputation = useGameStore(state => state.reputation);
  const jobsCompleted = useGameStore(state => state.jobsCompleted);
  const orderTab = useGameStore(state => state.orderTab);
  const message = useGameStore(state => state.message);
  const user = useGameStore(state => state.user);
  const unreadSales = useGameStore(state => state.unreadSales);
  const binningHistory = useGameStore(state => state.binningHistory);
  const celebration = useGameStore(state => state.celebration);
  
  // --- STORE ACTIONS ---
  const setMoney = useGameStore(state => state.setMoney);
  const setInventory = useGameStore(state => state.setInventory);
  const setAchievements = useGameStore(state => state.setAchievements);
  const setView = useGameStore(state => state.setView);
  const setOrderTab = useGameStore(state => state.setOrderTab);
  const initOrders = useGameStore(state => state.initOrders);
  const setUser = useGameStore(state => state.setUser);
  const notify = useGameStore(state => state.notify);
  const checkAchievements = useGameStore(state => state.checkAchievements);
  const addSaleNotification = useGameStore(state => state.addSaleNotification);
  const markSalesRead = useGameStore(state => state.markSalesRead);
  const setCelebration = useGameStore(state => state.setCelebration);
  
  // Action Handlers
  const buyPart = useGameStore(state => state.buyPart);
  const buyPallet = useGameStore(state => state.buyPallet);
  const sellPart = useGameStore(state => state.sellPart);
  const addToBuild = useGameStore(state => state.addToBuild);
  const removeFromBuild = useGameStore(state => state.removeFromBuild);
  const clearBuild = useGameStore(state => state.clearBuild);
  const saveBuildToInventory = useGameStore(state => state.saveBuildToInventory);
  const fulfillOrder = useGameStore(state => state.fulfillOrder);
  const reshuffleJobs = useGameStore(state => state.reshuffleJobs);
  const buyUpgrade = useGameStore(state => state.buyUpgrade);
  const binPart = useGameStore(state => state.binPart);
  const unlockSkill = useGameStore(state => state.unlockSkill);

  const [showSettings, setShowSettings] = useState(false);
  const [inventoryCategory, setInventoryCategory] = useState('ALL');

  const currentBuild = builds[activeBench] || {};
  
  // Init Orders on load
  useEffect(() => {
    initOrders();
  }, [initOrders]);

  const buildStats = calculateBuildStats(currentBuild, skills);
  const netWorth = money + inventory.reduce((acc, item) => acc + (item.price || 0), 0);

  // Achievement Check
  useEffect(() => {
    checkAchievements();
  }, [money, inventory, achievements, jobsCompleted, checkAchievements]);

  // Console Cheats
  useEffect(() => {
    window.cheat_unlockSkin = () => {
      if (!achievements.includes('wealth_100k')) {
        setAchievements(prev => [...prev, 'wealth_100k']);
        notify("Cheat Activated: Gold Workbench Unlocked!", "success");
      }
    };
  }, [achievements, settings.sfx, notify, setAchievements]);

  // Music Effect
  useEffect(() => {
    musicPlayer.toggle(settings.music);
  }, [settings.music]);

  // Auto-clear celebration
  useEffect(() => {
    if (celebration) {
      const timer = setTimeout(() => setCelebration(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [celebration, setCelebration]);

  useEffect(() => {
    console.log("🔌 Testing Firebase connection...");
    signInAnonymously(auth)
      .then((userCredential) => {
        console.log("✅ Firebase Connected! User ID:", userCredential.user.uid);
        setUser(userCredential.user);
      })
      .catch((error) => console.error("❌ Firebase Connection Failed:", error));
  }, [setUser]);

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
          const newId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

          if (data.type === 'EARNINGS') {
            setMoney(prev => prev + data.amount);
            notify(`You sold items on the market! Earned $${data.amount}`, 'success');
            addSaleNotification();
            deleteDoc(docRef).catch(e => console.error("Error clearing inbox", e));
          } else if (data.type === 'ITEM') {
             const newItem = { ...data.item, invId: newId() };
             setInventory(prev => [...prev, newItem]);
             notify(`Trade complete! Received ${newItem.name}.`, 'success');
             deleteDoc(docRef).catch(e => console.error("Error clearing inbox", e));
          }
        }
      });
    });
    return () => unsub();
  }, [user, setMoney, setInventory, notify, addSaleNotification]);

  // Trading Logic
  const handlePostTrade = (invId) => {
    setInventory(prev => prev.filter(p => p.invId !== invId));
    notify("Item listed on market", "success");
  };

  const handleBuyTrade = (part, price) => {
    useGameStore.setState(state => ({
      money: state.money - price,
      inventory: [...state.inventory, { ...part, invId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}` }]
    }));
    notify(`Bought ${part.name} from market`, "success");
  };

  const handleItemTrade = (incomingPart, outgoingPartInvId) => {
    setInventory(prev => {
      const newInventory = prev.filter(p => p.invId !== outgoingPartInvId);
      newInventory.push({ ...incomingPart, invId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}` });
      return newInventory;
    });
    notify(`Traded for ${incomingPart.name}`, "success");
  };

  const handleCancelTrade = (trade) => {
    setInventory(prev => [...prev, trade.part]);
    notify("Trade cancelled. Item returned to inventory.", "info");
  };

  const disassembleBuild = (pcItem) => {
    setInventory(prev => {
      const withoutPC = prev.filter(i => i.invId !== pcItem.invId);
      const parts = Object.values(pcItem.parts).map(p => ({
        ...p,
        invId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }));
      return [...withoutPC, ...parts];
    });
    notify("PC disassembled. Parts returned to inventory.", "info");
  };

  const sellBuildInstant = (pcItem) => {
     setInventory(prev => prev.filter(i => i.invId !== pcItem.invId));
     const dealmakerBonus = 1 + (skills.dealmaker * 0.05);
     const showroomBonus = ownedUpgrades.includes('showroom') ? 1.05 : 1;
     const sellPrice = Math.floor(pcItem.price * 0.8 * dealmakerBonus * showroomBonus); // Instant sell penalty
     setMoney(m => m + sellPrice);
     notify(`Sold PC for $${sellPrice}`, "success");
  };

  const handleSlotClick = (type) => {
    setInventoryCategory(type);
    setView('inventory');
  };

  const handleViewChange = (newView) => {
    if (newView === 'inventory') setInventoryCategory('ALL');
    setView(newView);
  };

  return (
    <div className={`min-h-screen font-sans pb-20 md:pb-0 transition-colors duration-300 ${settings.darkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-100 text-slate-800'}`}>
      <SpeedInsights />
      <Analytics />
      <Header money={money} view={view} setView={handleViewChange} inventoryCount={inventory.length} toggleSettings={() => setShowSettings(true)} darkMode={settings.darkMode} />
      <NewsTicker darkMode={settings.darkMode} />

      <CelebrationOverlay />

      {message.text && (
        <div className={`fixed top-20 right-4 z-[60] p-4 rounded-lg shadow-2xl border flex items-center gap-3 animate-bounce
          ${message.type === 'success' ? 'bg-emerald-900 border-emerald-500 text-emerald-100' : 
            message.type === 'error' ? 'bg-rose-900 border-rose-500 text-rose-100' : 
            'bg-blue-900 border-blue-500 text-blue-100'}`}>
          {message.type === 'success' ? <CheckCircle2 /> : message.type === 'error' ? <AlertTriangle /> : <ClipboardList />}
          <span className="font-semibold">{message.text}</span>
        </div>
      )}

      <SettingsModal show={showSettings} onClose={() => setShowSettings(false)} />

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
          {view === 'shop' && <Shop buyPart={buyPart} money={money} darkMode={settings.darkMode} settings={settings} skills={skills} buyPallet={buyPallet} />}
          {view === 'inventory' && <Inventory inventory={inventory} addToBuild={addToBuild} sellPart={sellPart} binPart={binPart} money={money} category={inventoryCategory} setCategory={setInventoryCategory} darkMode={settings.darkMode} maxCapacity={50 + (skills.logistics * 5) + (ownedUpgrades.includes('storage_1') ? 50 : 0) + (ownedUpgrades.includes('storage_2') ? 100 : 0)} />}
          {view === 'upgrades' && <Upgrades darkMode={settings.darkMode} skills={skills} unlockSkill={unlockSkill} money={money} ownedUpgrades={ownedUpgrades} buyUpgrade={buyUpgrade} />}
          {view === 'trading' && <Trading inventory={inventory} onPostTrade={handlePostTrade} money={money} onBuyTrade={handleBuyTrade} onItemTrade={handleItemTrade} onCancelTrade={handleCancelTrade} user={user} darkMode={settings.darkMode} netWorth={netWorth} unreadSales={unreadSales} onClearUnreadSales={markSalesRead} />}
          {view === 'profile' && <Profile user={user} money={money} reputation={reputation} jobsCompleted={jobsCompleted} darkMode={settings.darkMode} skills={skills} achievements={achievements} netWorth={netWorth} jobHistory={jobHistory} binningHistory={binningHistory} />}
          {view === 'devlogs' && <Devlogs darkMode={settings.darkMode} setView={setView} />}
          {view === 'leaderboard' && <Leaderboard user={user} netWorth={netWorth} darkMode={settings.darkMode} />}
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

          <div className="flex justify-end">
            <button onClick={reshuffleJobs} className="text-[10px] flex items-center gap-1 bg-slate-200 hover:bg-slate-300 text-slate-600 px-2 py-1 rounded transition-colors dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700">
              <RefreshCw size={12} /> Reshuffle (${Math.floor(50 * (1 - (skills.connections * 0.10)))})
            </button>
          </div>

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

      <footer className="text-center pb-24 md:pb-8 text-xs opacity-50 flex flex-col md:flex-row justify-center gap-4">
        <button 
          onClick={() => setView('devlogs')}
          className="hover:underline hover:text-blue-500 transition-colors inline-flex items-center justify-center gap-1"
        >
          <BookOpen size={12} /> Devlogs
        </button>
        <span className="hidden md:inline">•</span>
        <a 
          href="https://docs.google.com/document/d/1221bM02jpfA6YKCZuM6xBSmHvGQMGH0yS8hxCkSmDxM/edit?usp=sharing" 
          target="_blank" 
          rel="noreferrer" 
          className="hover:underline hover:text-blue-500 transition-colors inline-flex items-center justify-center gap-1"
        >
          <ClipboardList size={12} /> Read the Official Game Guide
        </a>
      </footer>

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