// src/data/constants.js

export const PART_TYPES = {
  CPU: 'CPU',
  MOTHERBOARD: 'Motherboard',
  RAM: 'RAM',
  GPU: 'GPU',
  STORAGE: 'Storage',
  PSU: 'PSU'
};

export const SOCKETS = {
  LGA775: 'LGA775',   // Mid 2000s
  AM3: 'AM3',         // Late 2000s
  LGA1155: 'LGA1155', // Early 2010s
  AM4: 'AM4',         // 2017-2022
  LGA1200: 'LGA1200', // 2020
  LGA1700: 'LGA1700', // 2021+
  AM5: 'AM5',         // 2022+
  TR4: 'TR4'          // High-End Workstation
};

export const INTERFACES = {
  PATA: 'PATA',
  SATA: 'SATA',
  M2: 'M.2'
};

export const GPU_INTERFACES = {
  AGP: 'AGP',
  PCIE: 'PCIe x16'
};

export const REPUTATION_TITLES = [
  { threshold: 90, title: "Tech Tycoon" },
  { threshold: 75, title: "Expert Builder" },
  { threshold: 50, title: "Trusted Technician" },
  { threshold: 25, title: "Novice Builder" },
  { threshold: 0, title: "Garage Tinkerer" }
];

export const SKILLS = {
  negotiation: { id: 'negotiation', name: "Silver Tongue", description: "Increases job payouts.", effect: "+5% Payout / Lvl", maxLevel: 5, baseCost: 500, costMultiplier: 1.5 },
  barter: { id: 'barter', name: "Bulk Buyer", description: "Reduces component costs.", effect: "-3% Shop Prices / Lvl", maxLevel: 5, baseCost: 800, costMultiplier: 1.5 },
  marketing: { id: 'marketing', name: "Influencer", description: "Attracts VIP clients.", effect: "+5% VIP Chance / Lvl", maxLevel: 5, baseCost: 1000, costMultiplier: 2.0 },
  efficiency: { id: 'efficiency', name: "Fast Learner", description: "Gains reputation faster.", effect: "+10% Reputation / Lvl", maxLevel: 5, baseCost: 300, costMultiplier: 1.5 }
};

export const PARTS_CATALOG = [
  // --- CPUs (Chronological) ---
  { id: 'cpu_q9550', type: PART_TYPES.CPU, name: 'Core 2 Quad Q9550', price: 15, socket: SOCKETS.LGA775, power: 95, perf: 12 },
  { id: 'cpu_i3_2100', type: PART_TYPES.CPU, name: 'Intel i3-2100', price: 20, socket: SOCKETS.LGA1155, power: 65, perf: 15 },
  { id: 'cpu_i5_2400', type: PART_TYPES.CPU, name: 'Intel i5-2400', price: 30, socket: SOCKETS.LGA1155, power: 95, perf: 20 },
  { id: 'cpu_fx6300', type: PART_TYPES.CPU, name: 'AMD FX-6300', price: 35, socket: SOCKETS.AM3, power: 95, perf: 22 },
  { id: 'cpu_i7_2600k', type: PART_TYPES.CPU, name: 'Intel i7-2600K', price: 45, socket: SOCKETS.LGA1155, power: 95, perf: 30 },
  { id: 'cpu_r5_1600', type: PART_TYPES.CPU, name: 'Ryzen 5 1600', price: 65, socket: SOCKETS.AM4, power: 65, perf: 45 },
  { id: 'cpu1', type: PART_TYPES.CPU, name: 'Ryzen 3 3100', price: 85, socket: SOCKETS.AM4, power: 65, perf: 40 },
  { id: 'cpu_r5_3600', type: PART_TYPES.CPU, name: 'Ryzen 5 3600', price: 95, socket: SOCKETS.AM4, power: 65, perf: 55 },
  { id: 'cpu2', type: PART_TYPES.CPU, name: 'Intel i5-10400', price: 130, socket: SOCKETS.LGA1200, power: 65, perf: 60 },
  { id: 'cpu3', type: PART_TYPES.CPU, name: 'Ryzen 7 5800X', price: 230, socket: SOCKETS.AM4, power: 105, perf: 85 },
  { id: 'cpu_i5_12600k', type: PART_TYPES.CPU, name: 'Intel i5-12600K', price: 240, socket: SOCKETS.LGA1700, power: 125, perf: 82 },
  { id: 'cpu_r5_5600', type: PART_TYPES.CPU, name: 'Ryzen 5 5600', price: 125, socket: SOCKETS.AM4, power: 65, perf: 70 },
  { id: 'cpu_r5_7600', type: PART_TYPES.CPU, name: 'Ryzen 5 7600', price: 200, socket: SOCKETS.AM5, power: 65, perf: 90 },
  { id: 'cpu_r7_7700', type: PART_TYPES.CPU, name: 'Ryzen 7 7700', price: 290, socket: SOCKETS.AM5, power: 65, perf: 105 },
  { id: 'cpu_r7_7800x3d', type: PART_TYPES.CPU, name: 'Ryzen 7 7800X3D', price: 400, socket: SOCKETS.AM5, power: 120, perf: 140 },
  { id: 'cpu4', type: PART_TYPES.CPU, name: 'Ryzen 9 7950X', price: 520, socket: SOCKETS.AM5, power: 170, perf: 115 },
  { id: 'cpu_r7_9800x3d', type: PART_TYPES.CPU, name: 'Ryzen 7 9800X3D', price: 550, socket: SOCKETS.AM5, power: 120, perf: 165 },
  { id: 'cpu_i9_14900k', type: PART_TYPES.CPU, name: 'Intel i9-14900K', price: 580, socket: SOCKETS.LGA1700, power: 253, perf: 110 },
  { id: 'cpu_tr_5995wx', type: PART_TYPES.CPU, name: 'Threadripper 5995WX', price: 4200, socket: SOCKETS.TR4, power: 280, perf: 250 },

  // --- MOTHERBOARDS (Chronological by Socket) ---
  { id: 'mobo_865', type: PART_TYPES.MOTHERBOARD, name: '865PE Neo2', price: 20, socket: SOCKETS.LGA775, ramSlots: 4, maxRam: 4, memoryType: 'DDR2', sataSlots: 2, pataSlots: 2, m2Slots: 0, gpuInterface: GPU_INTERFACES.AGP },
  { id: 'mobo_p45', type: PART_TYPES.MOTHERBOARD, name: 'Gigabyte GA-EP45-UD3P', price: 25, socket: SOCKETS.LGA775, ramSlots: 4, maxRam: 16, memoryType: 'DDR2', sataSlots: 6, pataSlots: 2, m2Slots: 0, gpuInterface: GPU_INTERFACES.PCIE },
  { id: 'mobo_d2991', type: PART_TYPES.MOTHERBOARD, name: 'Fujitsu D2991-A1 (OEM)', price: 30, socket: SOCKETS.LGA1155, ramSlots: 2, maxRam: 16, memoryType: 'DDR3', sataSlots: 4, pataSlots: 0, m2Slots: 0, gpuInterface: GPU_INTERFACES.PCIE },
  { id: 'mobo_970', type: PART_TYPES.MOTHERBOARD, name: '970A Chipset', price: 45, socket: SOCKETS.AM3, ramSlots: 4, maxRam: 32, memoryType: 'DDR3', sataSlots: 6, pataSlots: 0, m2Slots: 0, gpuInterface: GPU_INTERFACES.PCIE },
  { id: 'mobo_a320', type: PART_TYPES.MOTHERBOARD, name: 'A320M-K', price: 50, socket: SOCKETS.AM4, ramSlots: 2, maxRam: 32, memoryType: 'DDR4', sataSlots: 4, pataSlots: 0, m2Slots: 1, gpuInterface: GPU_INTERFACES.PCIE },
  { id: 'mobo_z77', type: PART_TYPES.MOTHERBOARD, name: 'Z77 Extreme', price: 70, socket: SOCKETS.LGA1155, ramSlots: 4, maxRam: 32, memoryType: 'DDR3', sataSlots: 4, pataSlots: 0, m2Slots: 0, gpuInterface: GPU_INTERFACES.PCIE },
  { id: 'mobo1', type: PART_TYPES.MOTHERBOARD, name: 'B450 Budget Board', price: 75, socket: SOCKETS.AM4, ramSlots: 4, maxRam: 64, memoryType: 'DDR4', sataSlots: 4, pataSlots: 0, m2Slots: 1, gpuInterface: GPU_INTERFACES.PCIE },
  { id: 'mobo2', type: PART_TYPES.MOTHERBOARD, name: 'H410M Entry', price: 85, socket: SOCKETS.LGA1200, ramSlots: 2, maxRam: 32, memoryType: 'DDR4', sataSlots: 4, pataSlots: 0, m2Slots: 0, gpuInterface: GPU_INTERFACES.PCIE },
  { id: 'mobo_b660', type: PART_TYPES.MOTHERBOARD, name: 'B660M Pro', price: 120, socket: SOCKETS.LGA1700, ramSlots: 4, maxRam: 128, memoryType: 'DDR4', sataSlots: 4, pataSlots: 0, m2Slots: 2, gpuInterface: GPU_INTERFACES.PCIE },
  { id: 'mobo_b650', type: PART_TYPES.MOTHERBOARD, name: 'B650 Gaming', price: 180, socket: SOCKETS.AM5, ramSlots: 4, maxRam: 128, memoryType: 'DDR5', sataSlots: 4, pataSlots: 0, m2Slots: 3, gpuInterface: GPU_INTERFACES.PCIE },
  { id: 'mobo3', type: PART_TYPES.MOTHERBOARD, name: 'X570 Gaming Pro', price: 190, socket: SOCKETS.AM4, ramSlots: 4, maxRam: 128, memoryType: 'DDR4', sataSlots: 6, pataSlots: 0, m2Slots: 2, gpuInterface: GPU_INTERFACES.PCIE },
  { id: 'mobo_z690', type: PART_TYPES.MOTHERBOARD, name: 'Z690 Aorus Elite', price: 210, socket: SOCKETS.LGA1700, ramSlots: 4, maxRam: 128, memoryType: 'DDR5', sataSlots: 6, pataSlots: 0, m2Slots: 3, gpuInterface: GPU_INTERFACES.PCIE },
  { id: 'mobo4', type: PART_TYPES.MOTHERBOARD, name: 'X670E High-End', price: 400, socket: SOCKETS.AM5, ramSlots: 4, maxRam: 128, memoryType: 'DDR5', sataSlots: 6, pataSlots: 0, m2Slots: 4, gpuInterface: GPU_INTERFACES.PCIE },
  { id: 'mobo_trx40', type: PART_TYPES.MOTHERBOARD, name: 'Zenith II Extreme Alpha', price: 850, socket: SOCKETS.TR4, ramSlots: 8, maxRam: 256, memoryType: 'DDR4', sataSlots: 8, pataSlots: 0, m2Slots: 4, gpuInterface: GPU_INTERFACES.PCIE },

  // --- RAM (Chronological) ---
  { id: 'ram_ddr2_2', type: PART_TYPES.RAM, name: '2GB DDR2 800MHz', price: 5, power: 2, perf: 3, speed: 800, capacity: 2, memoryType: 'DDR2' },
  { id: 'ram_ddr3_4', type: PART_TYPES.RAM, name: '4GB DDR3 1600MHz', price: 10, power: 3, perf: 5, speed: 1600, capacity: 4, memoryType: 'DDR3' },
  { id: 'ram_ddr3_8', type: PART_TYPES.RAM, name: '8GB DDR3 1866MHz', price: 20, power: 4, perf: 8, speed: 1866, capacity: 8, memoryType: 'DDR3' },
  { id: 'ram1', type: PART_TYPES.RAM, name: '8GB DDR4 2666MHz', price: 35, power: 5, perf: 10, speed: 2666, capacity: 8, memoryType: 'DDR4' },
  { id: 'ram2', type: PART_TYPES.RAM, name: '16GB DDR4 3200MHz', price: 65, power: 10, perf: 25, speed: 3200, capacity: 16, memoryType: 'DDR4' },
  { id: 'ram_ddr5_16', type: PART_TYPES.RAM, name: '16GB DDR5 5200MHz', price: 90, power: 12, perf: 35, speed: 5200, capacity: 16, memoryType: 'DDR5' },
  { id: 'ram3', type: PART_TYPES.RAM, name: '32GB DDR5 6000MHz', price: 150, power: 15, perf: 50, speed: 6000, capacity: 32, memoryType: 'DDR5' },
  { id: 'ram_workstation', type: PART_TYPES.RAM, name: '128GB DDR4 ECC Kit', price: 600, power: 30, perf: 80, speed: 3200, capacity: 128, memoryType: 'DDR4' },

  // --- GPUs (Chronological) ---
  { id: 'gpu_fx5200', type: PART_TYPES.GPU, name: 'GeForce FX 5200', price: 15, power: 20, perf: 4, interface: GPU_INTERFACES.AGP },
  { id: 'gpu_730', type: PART_TYPES.GPU, name: 'GT 730 1GB GDDR5', price: 25, power: 38, perf: 8, interface: GPU_INTERFACES.PCIE },
  { id: 'gpu_gt1030', type: PART_TYPES.GPU, name: 'GT 1030', price: 40, power: 30, perf: 12, interface: GPU_INTERFACES.PCIE },
  { id: 'gpu_750ti', type: PART_TYPES.GPU, name: 'GTX 750 Ti', price: 50, power: 60, perf: 25, interface: GPU_INTERFACES.PCIE },
  { id: 'gpu_1050ti', type: PART_TYPES.GPU, name: 'GTX 1050 Ti', price: 75, power: 75, perf: 30, interface: GPU_INTERFACES.PCIE },
  { id: 'gpu_970', type: PART_TYPES.GPU, name: 'GTX 970', price: 80, power: 145, perf: 45, interface: GPU_INTERFACES.PCIE },
  { id: 'gpu_rx580', type: PART_TYPES.GPU, name: 'RX 580 8GB', price: 100, power: 185, perf: 35, interface: GPU_INTERFACES.PCIE },
  { id: 'gpu_rx6600', type: PART_TYPES.GPU, name: 'Radeon RX 6600', price: 210, power: 132, perf: 68, interface: GPU_INTERFACES.PCIE },
  { id: 'gpu_1660s', type: PART_TYPES.GPU, name: 'GTX 1660 Super', price: 160, power: 125, perf: 55, interface: GPU_INTERFACES.PCIE },
  { id: 'gpu_rtx2060', type: PART_TYPES.GPU, name: 'RTX 2060', price: 200, power: 160, perf: 60, interface: GPU_INTERFACES.PCIE },
  { id: 'gpu_1080ti', type: PART_TYPES.GPU, name: 'GTX 1080 Ti', price: 250, power: 250, perf: 95, interface: GPU_INTERFACES.PCIE },
  { id: 'gpu2', type: PART_TYPES.GPU, name: 'RTX 3060', price: 290, power: 170, perf: 75, interface: GPU_INTERFACES.PCIE },
  { id: 'gpu_rx7800xt', type: PART_TYPES.GPU, name: 'RX 7800 XT', price: 500, power: 263, perf: 120, interface: GPU_INTERFACES.PCIE },
  { id: 'gpu_3080', type: PART_TYPES.GPU, name: 'RTX 3080', price: 550, power: 320, perf: 110, interface: GPU_INTERFACES.PCIE },
  { id: 'gpu_4080', type: PART_TYPES.GPU, name: 'RTX 4080 Super', price: 1050, power: 320, perf: 140, interface: GPU_INTERFACES.PCIE },
  { id: 'gpu3', type: PART_TYPES.GPU, name: 'RTX 4090', price: 1850, power: 450, perf: 180, interface: GPU_INTERFACES.PCIE },
  { id: 'gpu_a6000', type: PART_TYPES.GPU, name: 'NVIDIA RTX A6000', price: 4300, power: 300, perf: 220, interface: GPU_INTERFACES.PCIE },

  // --- STORAGE ---
  { id: 'hdd_250', type: PART_TYPES.STORAGE, name: '250GB HDD', price: 10, power: 8, perf: 2, interface: INTERFACES.PATA, capacity: 250 },
  { id: 'ssd_sata', type: PART_TYPES.STORAGE, name: '500GB SATA SSD', price: 40, power: 4, perf: 15, interface: INTERFACES.SATA, capacity: 500 },
  { id: 'ssd2', type: PART_TYPES.STORAGE, name: '1TB NVMe Gen4', price: 85, power: 5, perf: 45, interface: INTERFACES.M2, capacity: 1000 },
  { id: 'ssd_gen5', type: PART_TYPES.STORAGE, name: '4TB NVMe Gen5', price: 450, power: 10, perf: 90, interface: INTERFACES.M2, capacity: 4000 },

  // --- PSUs ---
  { id: 'psu_generic', type: PART_TYPES.PSU, name: '300W Generic', price: 20, wattage: 300, sataConnectors: 2, molexConnectors: 4 },
  { id: 'psu1', type: PART_TYPES.PSU, name: '450W Bronze', price: 45, wattage: 450, sataConnectors: 4, molexConnectors: 3 },
  { id: 'psu2', type: PART_TYPES.PSU, name: '750W Gold', price: 110, wattage: 750, sataConnectors: 8, molexConnectors: 4 },
  { id: 'psu_1000', type: PART_TYPES.PSU, name: '1000W Platinum', price: 220, wattage: 1000, sataConnectors: 12, molexConnectors: 6 },
  { id: 'psu3', type: PART_TYPES.PSU, name: '1600W Titanium', price: 480, wattage: 1600, sataConnectors: 16, molexConnectors: 8 },
];

export const ORDER_TEMPLATES = [
  { title: "Office PC", minPerf: 20, budget: 250, description: "Just need to run Excel. Don't overspend." },
  { title: "Retro Station", minPerf: 40, budget: 450, description: "I only play games from 2004. Keep it simple." },
  { title: "Budget Gamer", minPerf: 60, budget: 650, description: "I want to play Valorant and CS2 on a budget." },
  { title: "Mid Gaming PC", minPerf: 90, budget: 1000, description: "Fortnite and Minecraft player here. 1080p High settings." },
  { title: "Esports Pro", minPerf: 120, budget: 1400, description: "I need 240Hz in competitive shooters. Performance over graphics." },
  { title: "Content Creator", minPerf: 160, budget: 2000, description: "Editing 4K video is a nightmare on my current laptop." },
  { title: "Streaming Setup", minPerf: 200, budget: 2500, description: "Single PC setup for streaming and gaming at the same time." },
  { title: "Crypto Miner", minPerf: 220, budget: 3000, description: "I need raw GPU power and a PSU that won't melt." },
  { title: "Enthusiast Grade", minPerf: 300, budget: 4000, description: "High refresh rate 1440p/4K gaming is my life." },
  { id: "workstation_01", title: "AI Training Station", minPerf: 400, budget: 11000, description: "I'm training local LLMs. Give me all the VRAM and threads you can find." },
  { id: "overkill_01", title: "The Overkill Rig", minPerf: 550, budget: 13000, description: "Price is a social construct. I want the absolute best parts in existence." },
];

export const REQUEST_TEMPLATES = [
  // --- LOW TIER / BUDGET CHALLENGES ---
  { 
    title: "The 'My Son's First PC' Mom", 
    budget: 300, 
    description: "My son wants to play 'The Minecraft'. I have very little money. Make it work!", 
    req: { minPerf: 15 } 
  },
  { 
    title: "Retro XP", 
    budget: 350, 
    description: "I need to run Windows XP and my old AGP capture card. Must have an AGP slot!", 
    req: { gpuInterface: GPU_INTERFACES.AGP } 
  },
  { 
    title: "Office Fleet Manager", 
    budget: 400, 
    description: "I need a basic machine for the accounting department. 8GB RAM is plenty.", 
    req: { minRam: 8, minPerf: 20 } 
  },

  // --- MID TIER / SPECIALIZED ---
  { 
    title: "Aspiring Streamer", 
    budget: 900, 
    description: "I want to stream 1080p. I've heard the GTX 1660 Super and 16GB of RAM is the sweet spot!", 
    req: { partId: 'gpu_1660s', minRam: 16 } 
  },
  { 
    title: "The 'Silent' Accountant", 
    budget: 600, 
    description: "I hate fan noise. Give me the 720W PSU so the fans barely spin.", 
    req: { partId: 'psu2' } // Requires the 750W Gold
  },
  { 
    title: "4K Movie Box", 
    budget: 800, 
    description: "This is for my home theater. I need at least 1TB of NVMe storage for my 'legal' movies.", 
    req: { minStorage: 1000, interface: INTERFACES.M2 } 
  },
  { 
    title: "NVIDIA Fanboy", 
    budget: 650, 
    description: "Must have a GTX 970. Don't ask why.", 
    req: { partId: 'gpu_970' } 
  },
  { 
    title: "X3D Gaming", 
    budget: 2000, 
    description: "I heard the Ryzen 7 7800X3D cpu is the best for gaming. I want one!", 
    req: { partId: 'cpu_r7_7800x3d', minPerf: 200 } 
  },

  // --- HIGH TIER / BIG PROFIT JOBS ---
  { 
    title: "4K Video Editor", 
    budget: 1800, 
    description: "My 4K timelines are lagging. I need 64GB of RAM and at least a Ryzen 9 or i9 class chip.", 
    req: { minRam: 64, minPerf: 110 } 
  },
  { 
    title: "Deep Learning Researcher", 
    budget: 5500, 
    description: "I'm training neural networks. I need the absolute maximum VRAM possible.", 
    req: { partId: 'gpu_a6000' } 
  },
  { 
    title: "The 'Price is No Object' Gamer", 
    budget: 4500, 
    description: "I just won the lottery. Give me an RTX 4090 and don't care about the bill.", 
    req: { partId: 'gpu3' } 
  },
  { 
    title: "Next Gen Upgrade",
    budget: 3500,
    description: "I want the new 9000 series Ryzen. Make it happen.",
    req: { partId: 'cpu_r7_9800x3d' }
  },
  { 
    title: "Virtualization Architect", 
    budget: 7500, 
    description: "I run 20 virtual machines at once. I need a Threadripper and 128GB of RAM. Do not fail me.", 
    req: { partId: 'cpu_tr_5995wx', minRam: 128 } 
  },
  { 
    title: "CGI Render Farm Node", 
    budget: 12000, 
    description: "We are rendering a feature film. We need the highest performance score possible (400+).", 
    req: { minPerf: 400 } 
  },

  // --- WEIRD / SPECIFIC CHALLENGES ---
  { 
    title: "The Sleeper Build", 
    budget: 1000, 
    description: "I want a modern PC, but it must use an old-school 250GB HDD as the boot drive for the 'aesthetic' noise.", 
    req: { partId: 'hdd_250', minPerf: 80 } 
  },
  { 
    title: "Data Hoarder", 
    budget: 1200, 
    description: "I need 4TB of storage space minimum. I don't care if it's slow, just big.", 
    req: { minStorage: 4000 } 
  },
  
  // --- VIP / HIGH END ---
  {
    title: "Pro Esports Arena",
    budget: 5000,
    description: "We are outfitting a new arena. Need a demo unit that screams performance.",
    req: { minPerf: 250, minRam: 32 }
  },
  {
    title: "Celebrity Streamer",
    budget: 8000,
    description: "I need the best of the best. If it lags, you're fired.",
    req: { partId: 'gpu3', minPerf: 350 }
  },
  {
    title: "Hollywood VFX Studio",
    budget: 15000,
    description: "We need a workstation for rendering our next blockbuster. Money is no object, but performance is everything.",
    req: { minPerf: 500, minRam: 128 }
  },
  {
    title: "Hedge Fund Algo Trader",
    budget: 10000,
    description: "Milliseconds matter. I need the fastest single-core performance and zero bottlenecks.",
    req: { partId: 'cpu_i9_14900k', minRam: 64 }
  },
  {
    title: "Top Secret Gov Contract",
    budget: 20000,
    description: "Classified requirements. Just give us the most expensive components you have. We need reliability.",
    req: { minPerf: 550 }
  }
];