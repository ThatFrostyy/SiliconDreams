import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateOrderLocal, generateRequest, calculateBuildStats } from '../utils/gameLogic';
import { PART_TYPES, PARTS_CATALOG, REVIEW_TEMPLATES, SKILLS } from '../data/constants';
import { playSound } from '../utils/sound';
import { getRandomModifier, applyModifier, getBinningResult } from '../utils/modifiers';

export const useGameStore = create(
  persist(
    (set, get) => ({
      // --- STATE ---
      money: 1200,
      inventory: [],
      settings: { music: false, sfx: true, darkMode: true },
      activeOrders: [],
      activeRequests: [],
      skills: { negotiation: 0, barter: 0, marketing: 0, efficiency: 0, dealmaker: 0, overclocking: 0, logistics: 0, optimization: 0, connections: 0 },
      builds: { 0: {} },
      activeBench: 0,
      ownedUpgrades: [],
      achievements: [],
      unreadSales: 0,
      jobHistory: [],
      reputation: 50,
      jobsCompleted: 0,
      orderTab: 'STANDARD',
      binningHistory: [],
      view: 'workshop',
      user: null,
      message: { text: '', type: '' }, // Notification state

      // --- SETTERS ---
      setMoney: (val) => set(state => ({ money: typeof val === 'function' ? val(state.money) : val })),
      setInventory: (val) => set(state => ({ inventory: typeof val === 'function' ? val(state.inventory) : val })),
      setSettings: (val) => set(state => ({ settings: typeof val === 'function' ? val(state.settings) : val })),
      setUser: (user) => set({ user }),
      setView: (view) => set({ view }),
      setOrderTab: (tab) => set({ orderTab: tab }),
      setActiveBench: (bench) => set({ activeBench: bench }),
      addSaleNotification: () => set(state => ({ unreadSales: state.unreadSales + 1 })),
      markSalesRead: () => set({ unreadSales: 0 }),
      
      // --- ACTIONS ---
      
      notify: (text, type) => {
        set({ message: { text, type } });
        const sfx = get().settings.sfx;
        if (type === 'error') playSound('error', sfx);
        else if (type === 'success') playSound('success', sfx);
        else playSound('click', sfx);
        
        // Auto clear after 4s
        setTimeout(() => {
            if (get().message.text === text) set({ message: { text: '', type: '' } });
        }, 4000);
      },

      initOrders: () => {
        const { activeOrders, activeRequests, reputation, skills } = get();
        if (activeOrders.length === 0) {
           const o1 = generateOrderLocal([]);
           const o2 = generateOrderLocal([o1]);
           set({ activeOrders: [o1, o2] });
        }
        if (activeRequests.length === 0) {
           set({ activeRequests: [generateRequest(reputation, skills.marketing), generateRequest(reputation, skills.marketing)] });
        }
      },

      checkAchievements: () => {
        const { money, builds, activeBench, skills, achievements, notify } = get();
        const currentBuild = builds[activeBench] || {};
        const stats = calculateBuildStats(currentBuild, skills);
        
        const newAchievements = [];
        if (money >= 100000 && !achievements.includes('wealth_100k')) {
            newAchievements.push('wealth_100k');
            notify("Achievement Unlocked: Tycoon ($100k Earned)!", "success");
        }
        if (stats.totalPerf >= 500 && !achievements.includes('perf_500')) {
            newAchievements.push('perf_500');
            notify("Achievement Unlocked: Power User (500+ Perf PC)!", "success");
        }

        if (newAchievements.length > 0) {
            set(state => ({ achievements: [...state.achievements, ...newAchievements] }));
        }
      },

      // Shop Actions
      buyPart: (part) => {
        const { money, skills, notify } = get();
        const discount = 1 - (skills.barter * 0.03);
        const finalPrice = Math.floor(part.price * discount);
        
        if (money >= finalPrice) {
          set(state => ({
            money: state.money - finalPrice,
            inventory: [...state.inventory, { ...part, invId: Math.random().toString(36).substr(2, 5) }]
          }));
          notify(`Bought ${part.name}`, 'success');
        } else {
          notify('Not enough cash!', 'error');
        }
      },

      buyPallet: (type) => {
        const { money, notify } = get();
        let cost = 500;
        if (type === 'PREMIUM') cost = 2500;
        if (type === 'MEDIUM') cost = 1000;

        if (money < cost) {
          notify("Not enough money for this pallet!", "error");
          return null;
        }

        // Generate Loot
        const itemCount = Math.floor(Math.random() * 3) + 3;
        const newItems = [];
        for (let i = 0; i < itemCount; i++) {
          let pool = PARTS_CATALOG.filter(p => p.price <= 200);
          if (type === 'PREMIUM') pool = PARTS_CATALOG.filter(p => p.price > 150);
          if (type === 'MEDIUM') pool = PARTS_CATALOG.filter(p => p.price > 50 && p.price <= 400);
          
          const part = pool[Math.floor(Math.random() * pool.length)];
          if (part) {
            const modifier = getRandomModifier();
            const modifiedPart = applyModifier(part, modifier);
            newItems.push({ ...modifiedPart, invId: Math.random().toString(36).substr(2, 5) });
          }
        }

        set(state => ({
            money: state.money - cost,
            inventory: [...state.inventory, ...newItems]
        }));
        notify(`Opened Pallet! Received ${newItems.length} items.`, "success");
        return newItems;
      },

      // Binning / Testing
      binPart: (part) => {
        const { money, notify, settings, skills } = get();
        const COST = 50;
        
        if (money < COST) {
            notify("Not enough money to test ($50)", "error");
            return;
        }

        const modifier = getBinningResult(skills.binning || 0);
        let newPart = { ...part, isBinned: true };
        let resultLabel = "Average Chip";
        let resultColor = "text-slate-500";
        
        if (modifier) {
            newPart = applyModifier(newPart, modifier);
            resultLabel = modifier.label;
            resultColor = modifier.color;
            notify(`Binning Result: ${modifier.label}`, "success");
            playSound('success', settings.sfx);
        } else {
            notify("Binning Result: Average Chip (No change)", "info");
            playSound('click', settings.sfx);
        }

        const historyEntry = {
            id: Date.now(),
            partName: part.originalName || part.name,
            result: resultLabel,
            color: resultColor,
            date: new Date().toLocaleTimeString()
        };

        set(state => ({
            money: state.money - COST,
            inventory: state.inventory.map(p => p.invId === part.invId ? newPart : p),
            binningHistory: [historyEntry, ...(state.binningHistory || [])].slice(0, 10)
        }));
      },

      // Inventory Actions
      sellPart: (part) => {
        const { skills, ownedUpgrades, notify } = get();
        const dealmakerBonus = 1 + (skills.dealmaker * 0.05);
        const showroomBonus = (part.type === 'PC' && ownedUpgrades.includes('showroom')) ? 1.05 : 1;
        const sellPrice = Math.floor(part.price * (part.type === 'PC' ? 0.8 : 0.5) * dealmakerBonus * showroomBonus);
        
        set(state => ({
            money: state.money + sellPrice,
            inventory: state.inventory.filter(p => p.invId !== part.invId)
        }));
        notify(`Sold ${part.name} for $${sellPrice}`, 'success');
      },

      // Workshop Actions
      setCurrentBuild: (newBuild) => {
        const { activeBench } = get();
        set(state => ({
            builds: { ...state.builds, [activeBench]: newBuild }
        }));
      },

      addToBuild: (part) => {
        const { builds, activeBench, notify, settings } = get();
        const currentBuild = builds[activeBench] || {};

        // Handle PC Loading
        if (part.type === 'PC') {
            if (Object.keys(currentBuild).length > 0) {
                notify("Workbench must be empty to load a PC.", "error");
                return;
            }
            set(state => ({
                builds: { ...state.builds, [activeBench]: part.parts },
                inventory: state.inventory.filter(p => p.invId !== part.invId),
                view: 'workshop'
            }));
            notify(`Loaded ${part.name} to workbench`, 'success');
            return;
        }

        // --- VALIDATION LOGIC ---
        
        // 1. Motherboard Dependency
        if (part.type !== PART_TYPES.MOTHERBOARD && !currentBuild[PART_TYPES.MOTHERBOARD]) {
             notify("Install a motherboard first.", "error"); return;
        }

        // 2. Socket Compatibility
        if (part.type === PART_TYPES.CPU) {
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

        // 3. RAM Validation
        if (part.type === PART_TYPES.RAM) {
            const mobo = currentBuild[PART_TYPES.MOTHERBOARD];
            if (part.memoryType !== mobo.memoryType) { notify(`Incompatible RAM! Board requires ${mobo.memoryType}.`, "error"); return; }
            
            const installedRamCount = Object.keys(currentBuild).filter(k => k.startsWith(PART_TYPES.RAM)).length;
            if (installedRamCount >= mobo.ramSlots) { notify(`All ${mobo.ramSlots} RAM slots are full!`, "error"); return; }
        }

        // 4. Storage Validation
        if (part.type === PART_TYPES.STORAGE) {
            const mobo = currentBuild[PART_TYPES.MOTHERBOARD];
            const interfaceType = part.interface === 'M.2' ? 'm2' : (part.interface === 'PATA' ? 'pata' : 'sata');
            const maxSlots = mobo[`${interfaceType}Slots`] || 0;
            const usedSlots = Object.values(currentBuild).filter(p => p.type === PART_TYPES.STORAGE && p.interface === part.interface).length;
            if (usedSlots >= maxSlots) { notify(`No free ${part.interface} slots available!`, "error"); return; }
        }

        // 5. Duplicate Parts (Single Slot items)
        if (part.type !== PART_TYPES.RAM && part.type !== PART_TYPES.STORAGE && currentBuild[part.type]) {
            notify(`Already have a ${part.type} in this build.`, 'error');
            return;
        }

        // Determine Slot Key
        let key = part.type;
        if (part.type === PART_TYPES.RAM) {
            // Find the first available RAM slot
            const mobo = currentBuild[PART_TYPES.MOTHERBOARD];
            for (let i = 1; i <= mobo.ramSlots; i++) {
                const slotKey = i === 1 ? PART_TYPES.RAM : `${PART_TYPES.RAM}_${i}`;
                if (!currentBuild[slotKey]) {
                    key = slotKey;
                    break;
                }
            }
        } else if (part.type === PART_TYPES.STORAGE) {
            // Find the first available Storage slot of the correct interface
            const mobo = currentBuild[PART_TYPES.MOTHERBOARD];
            const interfacePrefix = part.interface === 'M.2' ? 'M2' : (part.interface === 'PATA' ? 'PATA' : 'SATA');
            const maxSlots = mobo[`${interfacePrefix.toLowerCase()}Slots`] || 0;
            for (let i = 1; i <= maxSlots; i++) {
                const slotKey = `${interfacePrefix}_${i}`;
                if (!currentBuild[slotKey]) {
                    key = slotKey;
                    break;
                }
            }
        }

        set(state => ({
            builds: { ...state.builds, [activeBench]: { ...currentBuild, [key]: part } },
            inventory: state.inventory.filter(p => p.invId !== part.invId),
            view: 'workshop'
        }));
        notify(`Installed ${part.name}`, 'info');
        playSound('install', settings.sfx);
      },

      removeFromBuild: (type) => {
        const { builds, activeBench, settings } = get();
        const currentBuild = builds[activeBench] || {};
        const part = currentBuild[type];
        if (!part) return;

        const newBuild = { ...currentBuild };
        delete newBuild[type];

        set(state => ({
            inventory: [...state.inventory, part],
            builds: { ...state.builds, [activeBench]: newBuild }
        }));
        playSound('click', settings.sfx);
      },

      clearBuild: () => {
        const { builds, activeBench, settings } = get();
        const currentBuild = builds[activeBench] || {};
        const parts = Object.values(currentBuild);
        
        set(state => ({
            inventory: [...state.inventory, ...parts],
            builds: { ...state.builds, [activeBench]: {} }
        }));
        playSound('error', settings.sfx);
      },

      saveBuildToInventory: () => {
        const { builds, activeBench, skills, achievements, notify } = get();
        const currentBuild = builds[activeBench] || {};
        const parts = Object.values(currentBuild);
        
        if (parts.length === 0) { notify("Cannot save empty build!", "error"); return; }

        const stats = calculateBuildStats(currentBuild, skills);
        const totalCost = parts.reduce((acc, p) => acc + (p.price || 0), 0);
        const isGold = achievements.includes('wealth_100k');
        const markup = isGold ? 1.25 : 1.15;

        const newPC = {
            invId: Math.random().toString(36).substr(2, 9),
            type: 'PC',
            name: `Custom PC ${Math.floor(Math.random()*1000)}`,
            parts: currentBuild,
            price: Math.floor(totalCost * markup),
            perf: stats.totalPerf,
            power: stats.totalPower
        };

        set(state => ({
            inventory: [...state.inventory, newPC],
            builds: { ...state.builds, [activeBench]: {} }
        }));
        notify(isGold ? "PC saved! (Gold Bench Bonus)" : "PC saved to inventory!", "success");
      },

      // Job Logic
      reshuffleJobs: () => {
        const { money, skills, reputation, notify } = get();
        const cost = Math.floor(50 * (1 - (skills.connections * 0.10)));
        
        if (money < cost) { notify(`Not enough money ($${cost})`, "error"); return; }

        const o1 = generateOrderLocal([]);
        const o2 = generateOrderLocal([o1]);
        
        set(state => ({
            money: state.money - cost,
            activeOrders: [o1, o2],
            activeRequests: [generateRequest(reputation, skills.marketing), generateRequest(reputation, skills.marketing)]
        }));
        notify("Jobs reshuffled!", "success");
      },

      fulfillOrder: (order) => {
        const { builds, activeBench, skills, ownedUpgrades, notify } = get();
        const currentBuild = builds[activeBench] || {};
        const parts = Object.values(currentBuild);
        const stats = calculateBuildStats(currentBuild, skills);

        // Basic Validation
        if (stats.bottleneckPenalty > 0) notify(`Bottleneck detected! Perf reduced by ${stats.bottleneckPenalty}`, "error");
        
        const missingParts = Object.values(PART_TYPES).filter(type => !Object.values(currentBuild).some(p => p.type === type));
        if (missingParts.length > 0) { notify(`Missing parts: ${missingParts.join(', ')}`, "error"); return; }

        if (stats.totalPerf < order.minPerf) {
            notify(`Performance too low (${stats.totalPerf}/${order.minPerf})`, "error");
            return;
        }

        // Calculate Rewards
        const totalCost = parts.reduce((acc, p) => acc + (p.price || 0), 0);
        const negotiationBonus = 1 + (skills.negotiation * 0.05);
        let reward = Math.floor(totalCost * 1.25 * negotiationBonus);
        if (reward > order.budget) reward = order.budget;

        // Rating & Tip
        let stars = 3;
        const perfRatio = stats.totalPerf / order.minPerf;
        if (perfRatio >= 1.1) stars++;
        if (perfRatio >= 1.3) stars++;
        if (Math.random() > 0.9) stars++; // Random mood bonus
        if (stars > 5) stars = 5;

        let tip = 0;
        const tipMultiplier = ownedUpgrades.includes('tip_jar') ? 1.5 : 1;
        if (stars === 5) tip = Math.floor(reward * 0.20 * tipMultiplier);
        else if (stars === 4) tip = Math.floor(reward * 0.10 * tipMultiplier);

        const totalPayout = reward + tip;
        const review = REVIEW_TEMPLATES[stars][Math.floor(Math.random() * REVIEW_TEMPLATES[stars].length)];

        // Update State
        const repGain = (order.type === 'REQUEST' ? (order.isVip ? 10 : 5) : 2);
        const efficiencyBonus = 1 + (skills.efficiency * 0.10);

        set(state => ({
            money: state.money + totalPayout,
            builds: { ...state.builds, [activeBench]: {} },
            reputation: Math.min(state.reputation + Math.floor(repGain * efficiencyBonus), 100),
            jobsCompleted: state.jobsCompleted + 1,
            jobHistory: [{
                id: Date.now(),
                title: order.title,
                reward: totalPayout,
                stars,
                review,
                date: new Date().toLocaleDateString()
            }, ...state.jobHistory].slice(0, 10)
        }));

        notify(`Delivered! ${"⭐".repeat(stars)} Tip: $${tip}`, 'success');

        // Refresh Job
        setTimeout(() => {
            const { reputation, skills } = get();
            if (order.type === 'REQUEST') {
                set(state => ({ activeRequests: [...state.activeRequests.filter(o => o.id !== order.id), generateRequest(reputation, skills.marketing)] }));
            } else {
                set(state => ({ activeOrders: [...state.activeOrders.filter(o => o.id !== order.id), generateOrderLocal(get().activeOrders)] }));
            }
        }, 2000);
      },

      // Upgrades
      buyUpgrade: (upgrade) => {
        const { money, ownedUpgrades, notify } = get();
        if (ownedUpgrades.includes(upgrade.id)) return;
        if (money >= upgrade.cost) {
            set(state => ({
                money: state.money - upgrade.cost,
                ownedUpgrades: [...state.ownedUpgrades, upgrade.id]
            }));
            notify(`Purchased ${upgrade.name}!`, "success");
        } else {
            notify("Not enough money!", "error");
        }
      },

      unlockSkill: (skillId) => {
        const { money, skills, notify } = get();
        const skill = SKILLS[skillId];
        const currentLevel = skills[skillId];
        if (currentLevel >= skill.maxLevel) return;

        const cost = Math.floor(skill.baseCost * Math.pow(skill.costMultiplier, currentLevel));
        if (money >= cost) {
            set(state => ({
                money: state.money - cost,
                skills: { ...state.skills, [skillId]: currentLevel + 1 }
            }));
            notify(`Unlocked ${skill.name} Level ${currentLevel + 1}!`, "success");
        } else {
            notify("Not enough money!", "error");
        }
      },

      resetGame: () => {
        localStorage.removeItem('pc-tycoon-storage');
        window.location.reload();
      }
    }),
    { 
      name: 'pc-tycoon-storage',
      partialize: (state) => {
        // eslint-disable-next-line no-unused-vars
        const { user, message, ...rest } = state;
        return rest;
      }
    }
  )
);