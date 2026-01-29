import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateOrderLocal, generateRequest, calculateBuildStats } from '../utils/gameLogic';
import { PART_TYPES, PARTS_CATALOG, REVIEW_TEMPLATES, SKILLS } from '../data/constants';
import { playSound } from '../utils/sound';
import { getRandomModifier, applyModifier, getBinningResult, MODIFIERS, isUnreliable } from '../utils/modifiers';

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
      celebration: null, // 'GOLDEN' or null
      cleaningBench: { part: null, dust: [], stains: [], activeTool: null },

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
      setCelebration: (val) => set({ celebration: val }),
      
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
           const o1 = generateOrderLocal([], 'LOW');
           const o2 = generateOrderLocal([o1], 'LOW');
           const o3 = generateOrderLocal([o1, o2], 'MID');
           const o4 = generateOrderLocal([o1, o2, o3], 'MID');
           const o5 = generateOrderLocal([o1, o2, o3, o4], 'HIGH');
           const o6 = generateOrderLocal([o1, o2, o3, o4, o5], 'HIGH');
           const o7 = generateOrderLocal([o1, o2, o3, o4, o5, o6], 'ANY');
           const o8 = generateOrderLocal([o1, o2, o3, o4, o5, o6, o7], 'ANY');
           set({ activeOrders: [o1, o2, o3, o4, o5, o6, o7, o8] });
        }
        if (activeRequests.length === 0) {
           set({ activeRequests: [
               generateRequest(reputation, skills.marketing), 
               generateRequest(reputation, skills.marketing),
               generateRequest(reputation, skills.marketing),
               generateRequest(reputation, skills.marketing)
           ] });
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
        let minCount = 3;
        let maxCount = 5;
        let poolFilter = p => p.price <= 200;

        if (type === 'PREMIUM') {
            cost = 1500; minCount = 3; maxCount = 5;
            poolFilter = p => p.price > 150;
        } else if (type === 'MEDIUM') {
            cost = 500; minCount = 4; maxCount = 6;
            poolFilter = p => p.price > 50 && p.price <= 400;
        } else {
            // Standard: More items, but cheaper/worse quality
            cost = 150; minCount = 5; maxCount = 8;
            poolFilter = p => p.price <= 100;
        }

        if (money < cost) {
          notify("Not enough money for this pallet!", "error");
          return null;
        }

        // Generate Loot
        const itemCount = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
        const newItems = [];
        const pool = PARTS_CATALOG.filter(poolFilter);

        for (let i = 0; i < itemCount; i++) {
          const part = pool[Math.floor(Math.random() * pool.length)];
          if (part) {
            const modifier = getRandomModifier(type || 'STANDARD');
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
      binPart: (part, silent = false) => {
        const { money, notify, settings, skills } = get();
        const COST = 50;
        
        if (part.type !== 'CPU') {
            notify("Only CPUs can be binned.", "error");
            return null;
        }

        if (money < COST) {
            notify("Not enough money to test ($50)", "error");
            return null;
        }

        const modifier = getBinningResult(skills.binning || 0);
        let newPart = { ...part, isBinned: true };
        let resultLabel = "Average Chip";
        let resultColor = "text-slate-500";
        
        if (modifier) {
            newPart = applyModifier(newPart, modifier);
            resultLabel = modifier.label;
            resultColor = modifier.color;
            
            if (modifier.id === 'golden_chip') {
                set({ celebration: 'GOLDEN' });
            }
            if (!silent) {
                notify(`Binning Result: ${modifier.label}`, "success");
                playSound('success', settings.sfx);
            }

        } else {
            if (!silent) {
                notify("Binning Result: Average Chip (No change)", "info");
                playSound('click', settings.sfx);
            }
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

        return modifier || { label: 'Average Chip', color: 'text-slate-500', id: 'average' };
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
        
        // 0. Case Compatibility Checks
        const pcCase = currentBuild[PART_TYPES.CASE];
        if (part.type === PART_TYPES.GPU && pcCase && part.len > pcCase.maxGpuLen) {
            notify(`GPU is too long! (${part.len}mm > ${pcCase.maxGpuLen}mm)`, 'error'); return;
        }
        if (part.type === PART_TYPES.COOLER && pcCase) {
            if (part.radSize > 0 && part.radSize > pcCase.maxRadSize) {
                notify(`Radiator is too large for this case!`, 'error'); return;
            }
            if (part.radSize === 0 && part.height > pcCase.maxCoolerHeight) {
                notify(`Cooler is too tall for this case!`, 'error'); return;
            }
        }
        if (part.type === PART_TYPES.STORAGE && pcCase) {
            const storageCount = Object.values(currentBuild).filter(p => p.type === PART_TYPES.STORAGE).length;
            if (storageCount >= pcCase.storageSlots) {
                notify(`No more storage slots available in this case!`, 'error'); return;
            }
        }
        if (part.type === PART_TYPES.MOTHERBOARD && pcCase && !pcCase.formFactors.includes(part.formFactor)) {
            notify(`Motherboard form factor (${part.formFactor}) not supported by case!`, 'error'); return;
        }
        if (part.type === PART_TYPES.CASE) {
            const mobo = currentBuild[PART_TYPES.MOTHERBOARD];
            if (mobo && !part.formFactors.includes(mobo.formFactor)) {
                notify(`Current motherboard won't fit in this case!`, 'error'); return;
            }
            const gpu = currentBuild[PART_TYPES.GPU];
            if (gpu && gpu.len > part.maxGpuLen) {
                notify(`Current GPU is too long for this case!`, 'error'); return;
            }
            const cooler = currentBuild[PART_TYPES.COOLER];
            if (cooler) {
                if (cooler.radSize > 0 && cooler.radSize > part.maxRadSize) {
                    notify(`Current radiator won't fit in this case!`, 'error'); return;
                }
                if (cooler.radSize === 0 && cooler.height > part.maxCoolerHeight) {
                    notify(`Current air cooler is too tall for this case!`, 'error'); return;
                }
            }
            const storageCount = Object.values(currentBuild).filter(p => p.type === PART_TYPES.STORAGE).length;
            if (storageCount > part.storageSlots) {
                notify(`Too many storage drives for this case!`, 'error'); return;
            }
        }

        // 1. Motherboard Dependency
        if (part.type !== PART_TYPES.MOTHERBOARD && part.type !== PART_TYPES.CASE && !currentBuild[PART_TYPES.MOTHERBOARD]) {
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

      fulfillOrder: (order) => {
        const { builds, activeBench, skills, ownedUpgrades, notify } = get();
        const currentBuild = builds[activeBench] || {};
        const parts = Object.values(currentBuild);
        const stats = calculateBuildStats(currentBuild, skills);

        // --- REPAIR/UPGRADE JOB LOGIC (Start Phase) ---
        if ((order.type === 'REPAIR' || order.type === 'UPGRADE') && !order.inProgress) {
            // 1. Generate the Customer's PC
            const customerParts = {};
            const startingPartsDef = order.startingParts || [];
            
            startingPartsDef.forEach(def => {
                const catalogPart = PARTS_CATALOG.find(p => p.id === def.id);
                if (catalogPart) {
                    let part = { ...catalogPart, invId: Math.random().toString(36).substr(2, 9), jobId: order.id };
                    
                    // Apply Modifier (e.g. 'dud', 'rusty')
                    if (def.modifier && MODIFIERS[def.modifier]) {
                        part = applyModifier(part, MODIFIERS[def.modifier]);
                    }

                    if (def.isJobPart) {
                        part.isJobPart = true;
                    }

                    // Assign to Slot
                    let key = part.type;
                    if (part.type === PART_TYPES.RAM) {
                        const count = Object.keys(customerParts).filter(k => k.startsWith('RAM')).length;
                        key = count === 0 ? 'RAM' : `RAM_${count + 1}`;
                    } else if (part.type === PART_TYPES.STORAGE) {
                        const count = Object.keys(customerParts).filter(k => k.startsWith('STORAGE') || k.startsWith('SATA') || k.startsWith('M2')).length;
                        key = `SATA_${count + 1}`; // Simplified assignment
                    }
                    customerParts[key] = part;
                }
            });

            const customerPC = {
                invId: Math.random().toString(36).substr(2, 9),
                type: 'PC',
                name: `Customer's PC (${order.title})`,
                parts: customerParts,
                price: 0, // Customer PC has no sell value initially
                perf: 0,
                power: 0
            };

            // 2. Add to Inventory & Update Order Status
            set(state => ({
                inventory: [...state.inventory, customerPC],
                activeRequests: state.activeRequests.map(r => r.id === order.id ? { ...r, inProgress: true } : r)
            }));
            notify(`${order.type === 'REPAIR' ? 'Repair' : 'Upgrade'} Job Accepted! Customer PC added to Inventory. Load it from Inventory to start.`, "success");
            return;
        }

        // Basic Validation
        if (stats.bottleneckPenalty > 0) notify(`Bottleneck detected! Perf reduced by ${stats.bottleneckPenalty}`, "error");
        
        const missingParts = Object.values(PART_TYPES).filter(type => {
            return !Object.values(currentBuild).some(p => p.type === type);
        });
        if (missingParts.length > 0) { notify(`Missing parts: ${missingParts.join(', ')}`, "error"); return; }

        if (currentBuild[PART_TYPES.CASE]?.id === 'case_cardboard') {
            notify("You cannot deliver a build in a Cardboard Box!", "error");
            return;
        }

        if (stats.totalPerf < order.minPerf) {
            notify(`Performance too low (${stats.totalPerf}/${order.minPerf})`, "error");
            return;
        }

        // --- NEW VALIDATION ---
        const penalties = [];
        if (order.req) {
            if (order.req.partId && !parts.some(p => p.id === order.req.partId)) {
                const requiredPart = PARTS_CATALOG.find(p => p.id === order.req.partId);
                penalties.push(`Incorrect Part Model (Required: ${requiredPart ? requiredPart.name : order.req.partId})`);
            }
            if (order.req.minRam) {
                const totalRam = parts.filter(p => p.type === PART_TYPES.RAM).reduce((sum, p) => sum + (p.capacity || 0), 0);
                if (totalRam < order.req.minRam) penalties.push("Insufficient RAM");
            }
            if (order.req.minStorage) {
                const totalStorage = parts.filter(p => p.type === PART_TYPES.STORAGE).reduce((sum, p) => sum + (p.capacity || 0), 0);
                if (totalStorage < order.req.minStorage) penalties.push("Insufficient Storage");
            }
            if (order.req.gpuInterface) {
                const gpu = parts.find(p => p.type === PART_TYPES.GPU);
                if (gpu && gpu.interface !== order.req.gpuInterface) penalties.push("Wrong GPU Interface");
            }
            if (order.req.interface && !parts.some(p => p.interface === order.req.interface)) {
                penalties.push(`Missing ${order.req.interface} component`);
            }
            if (order.req.radSize) {
                const cooler = parts.find(p => p.type === PART_TYPES.COOLER);
                if (!cooler || cooler.radSize !== order.req.radSize) penalties.push(`Incorrect Radiator Size (Required: ${order.req.radSize}mm)`);
            }
            if (order.req.minRadSize) {
                const cooler = parts.find(p => p.type === PART_TYPES.COOLER);
                if (!cooler || cooler.radSize < order.req.minRadSize) penalties.push(`Insufficient Radiator Size (Minimum: ${order.req.minRadSize}mm)`);
            }
            if (order.req.minAirflow) {
                const pcCase = parts.find(p => p.type === PART_TYPES.CASE);
                if (!pcCase || pcCase.airflow < order.req.minAirflow) penalties.push("Insufficient Case Airflow");
            }
            if (order.req.minCooling) {
                const cooler = parts.find(p => p.type === PART_TYPES.COOLER);
                if (!cooler || cooler.cooling < order.req.minCooling) penalties.push("Insufficient Cooling Capacity");
            }
        }

        if (parts.some(p => isUnreliable(p))) {
            penalties.push("Defective/Unreliable Part Detected");
        }

        // Calculate Rewards
        const totalCost = parts.reduce((acc, p) => acc + (p.price || 0), 0);
        const negotiationBonus = 1 + (skills.negotiation * 0.05);
        let reward = Math.floor(totalCost * 1.50 * negotiationBonus); // Increased to 1.5x in Patch 1.1
        if (reward > order.budget) reward = order.budget;

        // Rating & Tip
        let stars = 3;
        const perfRatio = stats.totalPerf / order.minPerf;
        if (perfRatio >= 1.1) stars++;
        if (perfRatio >= 1.3) stars++;
        if (Math.random() > 0.9) stars++; // Random mood bonus
        if (stars > 5) stars = 5;

        // Apply Penalties
        if (penalties.length > 0) {
            stars = 1;
            reward = Math.floor(reward * 0.5);
        }

        let tip = 0;
        const tipMultiplier = ownedUpgrades.includes('tip_jar') ? 1.5 : 1;
        if (stars === 5) tip = Math.floor(reward * 0.20 * tipMultiplier);
        else if (stars === 4) tip = Math.floor(reward * 0.10 * tipMultiplier);

        const totalPayout = reward + tip;
        let review = REVIEW_TEMPLATES[stars][Math.floor(Math.random() * REVIEW_TEMPLATES[stars].length)];
        if (penalties.length > 0) {
            review = `Disappointed: ${penalties.join(', ')}.`;
        } else if (stars < 5) {
            const cpu = parts.find(p => p.type === PART_TYPES.CPU);
            const gpu = parts.find(p => p.type === PART_TYPES.GPU);

            if (stats.bottleneckPenalty > 0) {
                review = "The CPU is bottlenecking the GPU. Performance is wasted.";
            } else if (gpu && cpu && gpu.perf < cpu.perf * 0.75) {
                review += " The GPU is a bit weak compared to the rest of the system.";
            } else if (gpu && cpu && cpu.perf < gpu.perf * 0.75) {
                review += " The CPU is a bit underpowered for this graphics card.";
            } else if (perfRatio < 1.1) {
                review += " It barely meets the performance requirements.";
            }
        }

        // Update State
        let repGain = (order.type === 'REQUEST' ? (order.isVip ? 10 : 5) : 2);
        if (penalties.length > 0) repGain = -5;

        const efficiencyBonus = 1 + (skills.efficiency * 0.10);
        const finalRepChange = repGain > 0 ? Math.floor(repGain * efficiencyBonus) : repGain;

        set(state => ({
            money: state.money + totalPayout,
            builds: { ...state.builds, [activeBench]: {} },
            reputation: Math.max(0, Math.min(state.reputation + finalRepChange, 100)),
            jobsCompleted: state.jobsCompleted + 1,
            jobHistory: [{
                id: Date.now(),
                title: order.title,
                reward: totalPayout,
                stars,
                review,
                date: new Date().toLocaleDateString(),
                penalties: penalties.length > 0 ? penalties : null,
                build: parts.map(p => p.name)
            }, ...state.jobHistory].slice(0, 10)
        }));

        if (penalties.length > 0) {
            notify(`Order Completed with Issues: ${penalties.join(', ')}`, 'error');
        } else {
            notify(`Delivered! ${"⭐".repeat(stars)} Tip: $${tip}`, 'success');
        }

        // Refresh Job
        setTimeout(() => {
            const { reputation, skills } = get();
            if (['REQUEST', 'REPAIR', 'UPGRADE'].includes(order.type)) {
                set(state => ({ activeRequests: [...state.activeRequests.filter(o => o.id !== order.id), generateRequest(reputation, skills.marketing)] }));
            } else {
                set(state => ({ activeOrders: [...state.activeOrders.filter(o => o.id !== order.id), generateOrderLocal(get().activeOrders)] }));
            }
        }, 2000);
      },

      cancelJob: (jobId) => {
        const { activeRequests, inventory, builds, notify } = get();
        
        // Check if it's a request (Repair/Upgrade)
        const request = activeRequests.find(r => r.id === jobId);
        if (request) {
             let currentJobParts = [];

             // 1. Find parts in inventory (including inside PCs)
             const newInventory = inventory.filter(p => {
                 if (p.jobId === jobId) {
                     currentJobParts.push(p);
                     return false;
                 }
                 if (p.type === 'PC' && p.parts) {
                     const pcParts = Object.values(p.parts);
                     if (pcParts.some(pp => pp.jobId === jobId)) {
                         pcParts.forEach(pp => { if (pp.jobId === jobId) currentJobParts.push(pp); });
                         return false; // Remove the whole PC if it contains customer parts
                     }
                 }
                 return true;
             });

             // 2. Find parts in builds
             const newBuilds = { ...builds };
             Object.keys(newBuilds).forEach(benchId => {
                 const build = { ...newBuilds[benchId] };
                 let changed = false;
                 Object.keys(build).forEach(slot => {
                     if (build[slot].jobId === jobId) {
                         currentJobParts.push(build[slot]);
                         delete build[slot];
                         changed = true;
                     }
                 });
                 if (changed) newBuilds[benchId] = build;
             });

             // 3. Calculate Reputation Penalty
             const originalCount = request.startingParts?.length || 0;
             const missingCount = Math.max(0, originalCount - currentJobParts.length);
             const extraPenalty = missingCount * 10;

             set(state => ({
                 activeRequests: state.activeRequests.filter(r => r.id !== jobId),
                 inventory: newInventory,
                 builds: newBuilds,
                 reputation: Math.max(0, state.reputation - 5 - extraPenalty)
             }));

             if (missingCount > 0) {
                 notify(`Job Cancelled. You lost ${missingCount} customer parts! Rep -${5 + extraPenalty}`, "error");
             } else {
                 notify("Job Cancelled. All parts returned. Reputation -5.", "info");
             }
        } else {
            set(state => ({
                activeOrders: state.activeOrders.filter(o => o.id !== jobId),
                reputation: Math.max(0, state.reputation - 2)
            }));
            notify("Order Cancelled. Reputation -2.", "info");
        }
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

      // Cleaning Bench Actions
      setCleaningTool: (tool) => set(state => ({ cleaningBench: { ...state.cleaningBench, activeTool: tool } })),

      placeOnCleaningMat: (part) => {
        const { notify } = get();
        if (['CPU', 'GPU', 'Motherboard', 'RAM', 'Storage'].indexOf(part.type) === -1) {
            notify("Only core components can be cleaned.", "error");
            return;
        }

        const dust = [];
        const stains = [];
        const count = 10 + Math.floor(Math.random() * 10);

        for (let i = 0; i < count; i++) {
            dust.push({ id: i, x: Math.random() * 60 + 20, y: Math.random() * 60 + 20, size: 15 + Math.random() * 15, opacity: 0.6 + Math.random() * 0.4 });
        }

        if (part.modifierId === 'corroded' || part.modifierId === 'gunked_up') {
            for (let i = 0; i < 5; i++) {
                stains.push({ id: i + 100, x: Math.random() * 60 + 20, y: Math.random() * 60 + 20, size: 20 + Math.random() * 10, sprayed: false });
            }
        }

        set(state => ({
            inventory: state.inventory.filter(p => p.invId !== part.invId),
            cleaningBench: { part, dust, stains, activeTool: null }
        }));
      },

      removeCleaningPart: () => {
        const { cleaningBench, inventory } = get();
        if (!cleaningBench.part) return;

        set({
            inventory: [...inventory, cleaningBench.part],
            cleaningBench: { part: null, dust: [], stains: [], activeTool: null }
        });
      },

      cleanSpot: (x, y) => {
        const { cleaningBench, settings } = get();
        const { activeTool, dust, stains } = cleaningBench;
        if (!activeTool) return;

        let newDust = [...dust];
        let newStains = [...stains];
        let changed = false;

        if (activeTool === 'BRUSH') {
            newDust = dust.filter(d => {
                const dist = Math.sqrt(Math.pow(d.x - x, 2) + Math.pow(d.y - y, 2));
                if (dist < 8) { changed = true; return false; }
                return true;
            });
            // Also brush away sprayed stains
            newStains = stains.filter(s => {
                const dist = Math.sqrt(Math.pow(s.x - x, 2) + Math.pow(s.y - y, 2));
                if (dist < 8 && s.sprayed) { changed = true; return false; }
                return true;
            });
        } else if (activeTool === 'SPRAY') {
            newStains = stains.map(s => {
                const dist = Math.sqrt(Math.pow(s.x - x, 2) + Math.pow(s.y - y, 2));
                if (dist < 12 && !s.sprayed) { changed = true; return { ...s, sprayed: true }; }
                return s;
            });
        }

        if (changed) {
            set(state => ({ cleaningBench: { ...state.cleaningBench, dust: newDust, stains: newStains } }));
            if (newDust.length === 0 && newStains.length === 0) {
                // Finished!
                const part = cleaningBench.part;
                let newModifierId = null;

                // Modifier Improvement Logic
                if (part.modifierId === 'corroded') newModifierId = 'rusty';
                else if (part.modifierId === 'rusty') newModifierId = 'used';
                else if (part.modifierId === 'gunked_up') newModifierId = 'used';
                else if (part.modifierId === 'dusty') newModifierId = null;
                else if (part.modifierId === 'used') newModifierId = null;

                const basePart = PARTS_CATALOG.find(p => p.id === part.id);
                let cleanedPart = { ...basePart, invId: part.invId, jobId: part.jobId, isJobPart: part.isJobPart };
                if (newModifierId) {
                    cleanedPart = applyModifier(cleanedPart, MODIFIERS[newModifierId]);
                }

                get().notify(`Cleaning Complete! ${part.name} improved.`, "success");
                playSound('success', settings.sfx);

                set(state => ({
                    inventory: [...state.inventory, cleanedPart],
                    cleaningBench: { part: null, dust: [], stains: [], activeTool: null }
                }));
            }
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