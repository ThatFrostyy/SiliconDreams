// src/data/constants.js

export const PART_TYPES = {
  CPU: 'CPU',
  MOTHERBOARD: 'Motherboard',
  RAM: 'RAM',
  GPU: 'GPU',
  STORAGE: 'Storage',
  PSU: 'PSU',
  COOLER: 'Cooler',
  CASE: 'Case'
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

export const FORM_FACTORS = {
  ITX: 'Mini-ITX',
  mATX: 'Micro-ATX',
  ATX: 'ATX',
  EATX: 'E-ATX'
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
  // Business
  negotiation: { id: 'negotiation', category: 'Business', name: "Silver Tongue", description: "Increases job payouts.", effect: "+5% Payout / Lvl", maxLevel: 5, baseCost: 500, costMultiplier: 1.5 },
  marketing: { id: 'marketing', category: 'Business', name: "Influencer", description: "Attracts VIP clients.", effect: "+5% VIP Chance / Lvl", maxLevel: 5, baseCost: 1000, costMultiplier: 2.0 },
  dealmaker: { id: 'dealmaker', category: 'Business', name: "Deal Maker", description: "Better sell prices for parts.", effect: "+5% Sell Price / Lvl", maxLevel: 5, baseCost: 600, costMultiplier: 1.4 },

  // Technical
  efficiency: { id: 'efficiency', category: 'Technical', name: "Fast Learner", description: "Gains reputation faster.", effect: "+10% Reputation / Lvl", maxLevel: 5, baseCost: 300, costMultiplier: 1.5 },
  overclocking: { id: 'overclocking', category: 'Technical', name: "Overclocker", description: "Boosts total system performance.", effect: "+1% Perf / Lvl", maxLevel: 5, baseCost: 1500, costMultiplier: 1.8 },
  optimization: { id: 'optimization', category: 'Technical', name: "Power Efficiency", description: "Reduces power draw of parts.", effect: "-2% Power / Lvl", maxLevel: 5, baseCost: 400, costMultiplier: 1.4 },
  binning: { id: 'binning', category: 'Technical', name: "Silicon Lottery", description: "Better chance for Golden Chips.", effect: "+Chance / Lvl", maxLevel: 5, baseCost: 2000, costMultiplier: 1.5 },
  
  // Operations
  barter: { id: 'barter', category: 'Operations', name: "Bulk Buyer", description: "Reduces component costs.", effect: "-3% Shop Prices / Lvl", maxLevel: 5, baseCost: 800, costMultiplier: 1.5 },
  logistics: { id: 'logistics', category: 'Operations', name: "Logistics", description: "Increases inventory capacity.", effect: "+5 Slots / Lvl", maxLevel: 5, baseCost: 400, costMultiplier: 1.3 },
  connections: { id: 'connections', category: 'Operations', name: "Networking", description: "Reduces job reshuffle cost.", effect: "-10% Cost / Lvl", maxLevel: 5, baseCost: 200, costMultiplier: 1.5 },
};

export const OFFICE_UPGRADES = {
  storage_1: { id: 'storage_1', category: 'Office', name: "Expanded Storage", description: "Adds 50 slots to inventory.", cost: 2000 },
  storage_2: { id: 'storage_2', category: 'Office', name: "Warehouse Space", description: "Adds 100 slots to inventory.", cost: 5000 },
  bench_2: { id: 'bench_2', category: 'Office', name: "Second Workbench", description: "Build two PCs at once.", cost: 5000 },
  showroom: { id: 'showroom', category: 'Office', name: "Showroom", description: "Increases PC sell value by 5%.", cost: 8000 },
  tip_jar: { id: 'tip_jar', category: 'Office', name: "Tip Jar", description: "Increases tip amount by 50%.", cost: 1500 }
};

export const ACHIEVEMENTS = [
  { id: 'wealth_100k', title: "Tycoon", description: "Earn $100,000", reward: "Gold Workbench Skin" },
  { id: 'perf_500', title: "Power User", description: "Build a PC with 500+ Performance", reward: "Master Builder Title" }
];

export const RIVAL_COMPANIES = [
  { id: 'rival_1', name: "Pear Inc.", netWorth: 5000000, color: "text-slate-400" },
  { id: 'rival_2', name: "Macrohard", netWorth: 2000000, color: "text-blue-400" },
  { id: 'rival_3', name: "Star Industries", netWorth: 1000000, color: "text-purple-400" },
  { id: 'rival_4', name: "Tech Tips Ltd", netWorth: 500000, color: "text-orange-400" },
  { id: 'rival_5', name: "Nexus Gamers", netWorth: 250000, color: "text-slate-500" },
  { id: 'rival_6', name: "The Verge PC", netWorth: 100000, color: "text-rose-400" },
  { id: 'rival_7', name: "Bitwit Builds", netWorth: 50000, color: "text-emerald-400" },
  { id: 'rival_8', name: "Jayz Two Cents", netWorth: 25000, color: "text-cyan-400" },
  { id: 'rival_9', name: "Garage Fixer", netWorth: 5000, color: "text-amber-700" }
];

export const REVIEW_TEMPLATES = {
  5: [
    "Absolutely amazing! Runs everything on Ultra.",
    "Blazing fast delivery and top-tier performance!",
    "Exceeded my expectations. Will recommend to everyone!",
    "Wow! This PC is a beast. Thank you!"
  ],
  4: [
    "Great PC, works as expected.",
    "Solid build, good value for money.",
    "Happy with the purchase. Thanks.",
    "Good job, runs my games well."
  ],
  3: [
    "It works. Nothing special.",
    "Met the requirements, but took a while.",
    "Decent PC, but I expected a bit more.",
    "It's okay. Does the job."
  ],
  2: [
    "Barely meets the specs. Disappointed.",
    "Runs hot and loud. Not great.",
    "I guess it works, but I'm not impressed.",
    "Meh. Could have been better."
  ],
  1: [
    "Terrible. Crashes constantly.",
    "Ripoff! I could have built this better myself.",
    "Worst experience ever. Do not buy.",
    "Complete waste of money."
  ]
};

export const PARTS_CATALOG = [
  // --- CPUs (Chronological) ---
  { id: 'cpu_q9550', type: PART_TYPES.CPU, name: 'Core 2 Quad Q9550', price: 15, socket: SOCKETS.LGA775, power: 95, perf: 12, releaseYear: 2008 },
  { id: 'cpu_i3_2100', type: PART_TYPES.CPU, name: 'Intel i3-2100', price: 20, socket: SOCKETS.LGA1155, power: 65, perf: 15, releaseYear: 2011 },
  { id: 'cpu_i5_2400', type: PART_TYPES.CPU, name: 'Intel i5-2400', price: 30, socket: SOCKETS.LGA1155, power: 95, perf: 20, releaseYear: 2011 },
  { id: 'cpu_fx6300', type: PART_TYPES.CPU, name: 'AMD FX-6300', price: 35, socket: SOCKETS.AM3, power: 95, perf: 22, releaseYear: 2012 },
  { id: 'cpu_i7_2600k', type: PART_TYPES.CPU, name: 'Intel i7-2600K', price: 45, socket: SOCKETS.LGA1155, power: 95, perf: 30, releaseYear: 2011 },
  { id: 'cpu_r5_1600', type: PART_TYPES.CPU, name: 'Ryzen 5 1600', price: 65, socket: SOCKETS.AM4, power: 65, perf: 45, releaseYear: 2017 },
  { id: 'cpu1', type: PART_TYPES.CPU, name: 'Ryzen 3 3100', price: 85, socket: SOCKETS.AM4, power: 65, perf: 40, releaseYear: 2020 },
  { id: 'cpu_r5_3600', type: PART_TYPES.CPU, name: 'Ryzen 5 3600', price: 95, socket: SOCKETS.AM4, power: 65, perf: 55, releaseYear: 2019 },
  { id: 'cpu2', type: PART_TYPES.CPU, name: 'Intel i5-10400', price: 130, socket: SOCKETS.LGA1200, power: 65, perf: 60, releaseYear: 2020 },
  { id: 'cpu3', type: PART_TYPES.CPU, name: 'Ryzen 7 5800X', price: 230, socket: SOCKETS.AM4, power: 105, perf: 85, releaseYear: 2020 },
  { id: 'cpu_i5_12600k', type: PART_TYPES.CPU, name: 'Intel i5-12600K', price: 240, socket: SOCKETS.LGA1700, power: 125, perf: 82, releaseYear: 2021 },
  { id: 'cpu_r5_5600', type: PART_TYPES.CPU, name: 'Ryzen 5 5600', price: 125, socket: SOCKETS.AM4, power: 65, perf: 70, releaseYear: 2022 },
  { id: 'cpu_r5_7600', type: PART_TYPES.CPU, name: 'Ryzen 5 7600', price: 200, socket: SOCKETS.AM5, power: 65, perf: 90, releaseYear: 2023 },
  { id: 'cpu_r7_7700', type: PART_TYPES.CPU, name: 'Ryzen 7 7700', price: 290, socket: SOCKETS.AM5, power: 65, perf: 105, releaseYear: 2023 },
  { id: 'cpu_r7_7800x3d', type: PART_TYPES.CPU, name: 'Ryzen 7 7800X3D', price: 400, socket: SOCKETS.AM5, power: 120, perf: 140, releaseYear: 2023 },
  { id: 'cpu4', type: PART_TYPES.CPU, name: 'Ryzen 9 7950X', price: 520, socket: SOCKETS.AM5, power: 170, perf: 115, releaseYear: 2022 },
  { id: 'cpu_r7_9800x3d', type: PART_TYPES.CPU, name: 'Ryzen 7 9800X3D', price: 550, socket: SOCKETS.AM5, power: 120, perf: 165, releaseYear: 2024 },
  { id: 'cpu_i9_14900k', type: PART_TYPES.CPU, name: 'Intel i9-14900K', price: 580, socket: SOCKETS.LGA1700, power: 253, perf: 110, releaseYear: 2023 },
  { id: 'cpu_tr_5995wx', type: PART_TYPES.CPU, name: 'Threadripper 5995WX', price: 4200, socket: SOCKETS.TR4, power: 280, perf: 250, releaseYear: 2022 },
  { id: 'cpu_e8400', type: PART_TYPES.CPU, name: 'Core 2 Duo E8400', price: 8, socket: SOCKETS.LGA775, power: 65, perf: 6, releaseYear: 2008 },
  { id: 'cpu_i7_920', type: PART_TYPES.CPU, name: 'Intel i7-920 (First Gen)', price: 25, socket: SOCKETS.LGA1155, power: 130, perf: 18, releaseYear: 2008 },
  { id: 'cpu_r9_3900x', type: PART_TYPES.CPU, name: 'Ryzen 9 3900X', price: 180, socket: SOCKETS.AM4, power: 105, perf: 80, releaseYear: 2019 },
  { id: 'cpu_i7_14700k', type: PART_TYPES.CPU, name: 'Intel i7-14700K', price: 410, socket: SOCKETS.LGA1700, power: 253, perf: 105, releaseYear: 2023 },
  { id: 'cpu_r9_9950x', type: PART_TYPES.CPU, name: 'Ryzen 9 9950X', price: 650, socket: SOCKETS.AM5, power: 170, perf: 180, releaseYear: 2024 },
  { id: 'cpu_p4_530', type: PART_TYPES.CPU, name: 'Pentium 4 530 (3.0GHz)', price: 10, socket: SOCKETS.LGA775, power: 84, perf: 5, releaseYear: 2004 },
  { id: 'cpu_p4_670', type: PART_TYPES.CPU, name: 'Pentium 4 670 (3.8GHz)', price: 18, socket: SOCKETS.LGA775, power: 115, perf: 8, releaseYear: 2005 },
  { id: 'cpu_e6600', type: PART_TYPES.CPU, name: 'Core 2 Duo E6600', price: 12, socket: SOCKETS.LGA775, power: 65, perf: 10, releaseYear: 2006 },
  { id: 'cpu_q6600', type: PART_TYPES.CPU, name: 'Core 2 Quad Q6600', price: 20, socket: SOCKETS.LGA775, power: 95, perf: 18, releaseYear: 2007 },

  // --- MOTHERBOARDS (Chronological by Socket) ---
  { id: 'mobo_p5pe', type: PART_TYPES.MOTHERBOARD, name: 'ASUS P5PE-VM', price: 25, socket: SOCKETS.LGA775, ramSlots: 2, maxRam: 2, memoryType: 'DDR', sataSlots: 2, pataSlots: 2, m2Slots: 0, gpuInterface: GPU_INTERFACES.AGP, releaseYear: 2006 },
  { id: 'mobo_k8v', type: PART_TYPES.MOTHERBOARD, name: 'ASUS K8V-X SE', price: 30, socket: SOCKETS.AM3, ramSlots: 2, maxRam: 2, memoryType: 'DDR', sataSlots: 2, pataSlots: 2, m2Slots: 0, gpuInterface: GPU_INTERFACES.AGP, releaseYear: 2005 },
  { id: 'mobo_865', type: PART_TYPES.MOTHERBOARD, name: '865PE Neo2', price: 20, socket: SOCKETS.LGA775, formFactor: FORM_FACTORS.ATX, ramSlots: 4, maxRam: 4, memoryType: 'DDR2', sataSlots: 2, pataSlots: 2, m2Slots: 0, gpuInterface: GPU_INTERFACES.AGP, releaseYear: 2003 },
  { id: 'mobo_p45', type: PART_TYPES.MOTHERBOARD, name: 'Gigabyte GA-EP45-UD3P', price: 25, socket: SOCKETS.LGA775, formFactor: FORM_FACTORS.ATX, ramSlots: 4, maxRam: 16, memoryType: 'DDR2', sataSlots: 6, pataSlots: 2, m2Slots: 0, gpuInterface: GPU_INTERFACES.PCIE, releaseYear: 2008 },
  { id: 'mobo_d2991', type: PART_TYPES.MOTHERBOARD, name: 'Fujitsu D2991-A1 (OEM)', price: 30, socket: SOCKETS.LGA1155, formFactor: FORM_FACTORS.mATX, ramSlots: 2, maxRam: 16, memoryType: 'DDR3', sataSlots: 4, pataSlots: 0, m2Slots: 0, gpuInterface: GPU_INTERFACES.PCIE, releaseYear: 2011 },
  { id: 'mobo_970', type: PART_TYPES.MOTHERBOARD, name: '970A Chipset', price: 45, socket: SOCKETS.AM3, formFactor: FORM_FACTORS.ATX, ramSlots: 4, maxRam: 32, memoryType: 'DDR3', sataSlots: 6, pataSlots: 0, m2Slots: 0, gpuInterface: GPU_INTERFACES.PCIE, releaseYear: 2011 },
  { id: 'mobo_a320', type: PART_TYPES.MOTHERBOARD, name: 'A320M-K', price: 50, socket: SOCKETS.AM4, formFactor: FORM_FACTORS.mATX, ramSlots: 2, maxRam: 32, memoryType: 'DDR4', sataSlots: 4, pataSlots: 0, m2Slots: 1, gpuInterface: GPU_INTERFACES.PCIE, releaseYear: 2017 },
  { id: 'mobo_z77', type: PART_TYPES.MOTHERBOARD, name: 'Z77 Extreme', price: 70, socket: SOCKETS.LGA1155, formFactor: FORM_FACTORS.ATX, ramSlots: 4, maxRam: 32, memoryType: 'DDR3', sataSlots: 4, pataSlots: 0, m2Slots: 0, gpuInterface: GPU_INTERFACES.PCIE, releaseYear: 2012 },
  { id: 'mobo1', type: PART_TYPES.MOTHERBOARD, name: 'B450 Budget Board', price: 75, socket: SOCKETS.AM4, formFactor: FORM_FACTORS.mATX, ramSlots: 4, maxRam: 64, memoryType: 'DDR4', sataSlots: 4, pataSlots: 0, m2Slots: 1, gpuInterface: GPU_INTERFACES.PCIE, releaseYear: 2018 },
  { id: 'mobo2', type: PART_TYPES.MOTHERBOARD, name: 'H410M Entry', price: 85, socket: SOCKETS.LGA1200, formFactor: FORM_FACTORS.mATX, ramSlots: 2, maxRam: 32, memoryType: 'DDR4', sataSlots: 4, pataSlots: 0, m2Slots: 0, gpuInterface: GPU_INTERFACES.PCIE, releaseYear: 2020 },
  { id: 'mobo_b660', type: PART_TYPES.MOTHERBOARD, name: 'B660M Pro', price: 120, socket: SOCKETS.LGA1700, formFactor: FORM_FACTORS.mATX, ramSlots: 4, maxRam: 128, memoryType: 'DDR4', sataSlots: 4, pataSlots: 0, m2Slots: 2, gpuInterface: GPU_INTERFACES.PCIE, releaseYear: 2022 },
  { id: 'mobo_b650', type: PART_TYPES.MOTHERBOARD, name: 'B650 Gaming', price: 180, socket: SOCKETS.AM5, formFactor: FORM_FACTORS.ATX, ramSlots: 4, maxRam: 128, memoryType: 'DDR5', sataSlots: 4, pataSlots: 0, m2Slots: 3, gpuInterface: GPU_INTERFACES.PCIE, releaseYear: 2022 },
  { id: 'mobo3', type: PART_TYPES.MOTHERBOARD, name: 'X570 Gaming Pro', price: 190, socket: SOCKETS.AM4, formFactor: FORM_FACTORS.ATX, ramSlots: 4, maxRam: 128, memoryType: 'DDR4', sataSlots: 6, pataSlots: 0, m2Slots: 2, gpuInterface: GPU_INTERFACES.PCIE, releaseYear: 2019 },
  { id: 'mobo_z690', type: PART_TYPES.MOTHERBOARD, name: 'Z690 Aorus Elite', price: 210, socket: SOCKETS.LGA1700, formFactor: FORM_FACTORS.ATX, ramSlots: 4, maxRam: 128, memoryType: 'DDR5', sataSlots: 6, pataSlots: 0, m2Slots: 3, gpuInterface: GPU_INTERFACES.PCIE, releaseYear: 2021 },
  { id: 'mobo4', type: PART_TYPES.MOTHERBOARD, name: 'X670E High-End', price: 400, socket: SOCKETS.AM5, formFactor: FORM_FACTORS.EATX, ramSlots: 4, maxRam: 128, memoryType: 'DDR5', sataSlots: 6, pataSlots: 0, m2Slots: 4, gpuInterface: GPU_INTERFACES.PCIE, releaseYear: 2022 },
  { id: 'mobo_trx40', type: PART_TYPES.MOTHERBOARD, name: 'Zenith II Extreme Alpha', price: 850, socket: SOCKETS.TR4, formFactor: FORM_FACTORS.EATX, ramSlots: 8, maxRam: 256, memoryType: 'DDR4', sataSlots: 8, pataSlots: 0, m2Slots: 4, gpuInterface: GPU_INTERFACES.PCIE, releaseYear: 2019 },
  { id: 'mobo_g31', type: PART_TYPES.MOTHERBOARD, name: 'MSI G31M-P21 (Budget)', price: 15, socket: SOCKETS.LGA775, formFactor: FORM_FACTORS.mATX, ramSlots: 2, maxRam: 4, memoryType: 'DDR2', sataSlots: 4, pataSlots: 1, m2Slots: 0, gpuInterface: GPU_INTERFACES.PCIE, releaseYear: 2008 },
  { id: 'mobo_m5a97', type: PART_TYPES.MOTHERBOARD, name: 'ASUS M5A97 R2.0', price: 55, socket: SOCKETS.AM3, formFactor: FORM_FACTORS.ATX, ramSlots: 4, maxRam: 32, memoryType: 'DDR3', sataSlots: 6, pataSlots: 0, m2Slots: 0, gpuInterface: GPU_INTERFACES.PCIE, releaseYear: 2012 },
  { id: 'mobo_x670e_godlike', type: PART_TYPES.MOTHERBOARD, name: 'X670E GODLIKE', price: 700, socket: SOCKETS.AM5, formFactor: FORM_FACTORS.EATX, ramSlots: 4, maxRam: 192, memoryType: 'DDR5', sataSlots: 8, pataSlots: 0, m2Slots: 6, gpuInterface: GPU_INTERFACES.PCIE, releaseYear: 2022 },

  // --- RAM (Chronological) ---
  { id: 'ram_ddr_512', type: PART_TYPES.RAM, name: '512MB DDR 400MHz', price: 3, power: 2, perf: 1, speed: 400, capacity: 0.5, memoryType: 'DDR', releaseYear: 2002 },
  { id: 'ram_ddr_1', type: PART_TYPES.RAM, name: '1GB DDR 400MHz', price: 7, power: 2, perf: 2, speed: 400, capacity: 1, memoryType: 'DDR', releaseYear: 2003 },
  { id: 'ram_ddr2_1', type: PART_TYPES.RAM, name: '1GB DDR2 667MHz', price: 4, power: 2, perf: 2, speed: 667, capacity: 1, memoryType: 'DDR2', releaseYear: 2005 },
  { id: 'ram_ddr2_4', type: PART_TYPES.RAM, name: '4GB DDR2 800MHz', price: 15, power: 3, perf: 5, speed: 800, capacity: 4, memoryType: 'DDR2', releaseYear: 2007 },
  { id: 'ram_ddr2_2', type: PART_TYPES.RAM, name: '2GB DDR2 800MHz', price: 5, power: 2, perf: 3, speed: 800, capacity: 2, memoryType: 'DDR2', releaseYear: 2006 },
  { id: 'ram_ddr3_4', type: PART_TYPES.RAM, name: '4GB DDR3 1600MHz', price: 10, power: 3, perf: 5, speed: 1600, capacity: 4, memoryType: 'DDR3', releaseYear: 2010 },
  { id: 'ram_ddr3_8', type: PART_TYPES.RAM, name: '8GB DDR3 1866MHz', price: 20, power: 4, perf: 8, speed: 1866, capacity: 8, memoryType: 'DDR3', releaseYear: 2012 },
  { id: 'ram1', type: PART_TYPES.RAM, name: '8GB DDR4 2666MHz', price: 35, power: 5, perf: 10, speed: 2666, capacity: 8, memoryType: 'DDR4', releaseYear: 2016 },
  { id: 'ram2', type: PART_TYPES.RAM, name: '16GB DDR4 3200MHz', price: 65, power: 10, perf: 25, speed: 3200, capacity: 16, memoryType: 'DDR4', releaseYear: 2018 },
  { id: 'ram_ddr5_16', type: PART_TYPES.RAM, name: '16GB DDR5 5200MHz', price: 90, power: 12, perf: 35, speed: 5200, capacity: 16, memoryType: 'DDR5', releaseYear: 2021 },
  { id: 'ram3', type: PART_TYPES.RAM, name: '32GB DDR5 6000MHz', price: 150, power: 15, perf: 50, speed: 6000, capacity: 32, memoryType: 'DDR5', releaseYear: 2022 },
  { id: 'ram_workstation', type: PART_TYPES.RAM, name: '128GB DDR4 ECC Kit', price: 600, power: 30, perf: 80, speed: 3200, capacity: 128, memoryType: 'DDR4', releaseYear: 2019 },

  // --- GPUs (Chronological) ---
  { id: 'gpu_9800pro', type: PART_TYPES.GPU, name: 'Radeon 9800 Pro', price: 35, power: 47, perf: 12, interface: GPU_INTERFACES.AGP, len: 190, releaseYear: 2003 },
  { id: 'gpu_fx5900', type: PART_TYPES.GPU, name: 'GeForce FX 5900 Ultra', price: 40, power: 59, perf: 14, interface: GPU_INTERFACES.AGP, len: 210, releaseYear: 2003 },
  { id: 'gpu_6800gt', type: PART_TYPES.GPU, name: 'GeForce 6800 GT', price: 55, power: 67, perf: 20, interface: GPU_INTERFACES.AGP, len: 215, releaseYear: 2004 },
  { id: 'gpu_hd3850', type: PART_TYPES.GPU, name: 'Radeon HD 3850 (AGP)', price: 70, power: 75, perf: 28, interface: GPU_INTERFACES.AGP, len: 230, releaseYear: 2007 },
  { id: 'gpu_fx5200', type: PART_TYPES.GPU, name: 'GeForce FX 5200', price: 15, power: 20, perf: 4, interface: GPU_INTERFACES.AGP, len: 170, releaseYear: 2003 },
  { id: 'gpu_730', type: PART_TYPES.GPU, name: 'GT 730 1GB GDDR5', price: 25, power: 38, perf: 8, interface: GPU_INTERFACES.PCIE, len: 150, releaseYear: 2014 },
  { id: 'gpu_gt1030', type: PART_TYPES.GPU, name: 'GT 1030', price: 40, power: 30, perf: 12, interface: GPU_INTERFACES.PCIE, len: 150, releaseYear: 2017 },
  { id: 'gpu_750ti', type: PART_TYPES.GPU, name: 'GTX 750 Ti', price: 50, power: 60, perf: 25, interface: GPU_INTERFACES.PCIE, len: 175, releaseYear: 2014 },
  { id: 'gpu_1050ti', type: PART_TYPES.GPU, name: 'GTX 1050 Ti', price: 75, power: 75, perf: 30, interface: GPU_INTERFACES.PCIE, len: 180, releaseYear: 2016 },
  { id: 'gpu_970', type: PART_TYPES.GPU, name: 'GTX 970', price: 80, power: 145, perf: 45, interface: GPU_INTERFACES.PCIE, len: 265, releaseYear: 2014 },
  { id: 'gpu_rx580', type: PART_TYPES.GPU, name: 'RX 580 8GB', price: 100, power: 185, perf: 35, interface: GPU_INTERFACES.PCIE, len: 240, releaseYear: 2017 },
  { id: 'gpu_rx6600', type: PART_TYPES.GPU, name: 'Radeon RX 6600', price: 210, power: 132, perf: 68, interface: GPU_INTERFACES.PCIE, len: 200, releaseYear: 2021 },
  { id: 'gpu_1660s', type: PART_TYPES.GPU, name: 'GTX 1660 Super', price: 160, power: 125, perf: 55, interface: GPU_INTERFACES.PCIE, len: 230, releaseYear: 2019 },
  { id: 'gpu_rtx2060', type: PART_TYPES.GPU, name: 'RTX 2060', price: 200, power: 160, perf: 60, interface: GPU_INTERFACES.PCIE, len: 230, releaseYear: 2019 },
  { id: 'gpu_1080ti', type: PART_TYPES.GPU, name: 'GTX 1080 Ti', price: 250, power: 250, perf: 95, interface: GPU_INTERFACES.PCIE, len: 270, releaseYear: 2017 },
  { id: 'gpu2', type: PART_TYPES.GPU, name: 'RTX 3060', price: 290, power: 170, perf: 75, interface: GPU_INTERFACES.PCIE, len: 240, releaseYear: 2021 },
  { id: 'gpu_rx7800xt', type: PART_TYPES.GPU, name: 'RX 7800 XT', price: 500, power: 263, perf: 120, interface: GPU_INTERFACES.PCIE, len: 280, releaseYear: 2023 },
  { id: 'gpu_3080', type: PART_TYPES.GPU, name: 'RTX 3080', price: 550, power: 320, perf: 110, interface: GPU_INTERFACES.PCIE, len: 300, releaseYear: 2020 },
  { id: 'gpu_4080', type: PART_TYPES.GPU, name: 'RTX 4080 Super', price: 1050, power: 320, perf: 140, interface: GPU_INTERFACES.PCIE, len: 330, releaseYear: 2024 },
  { id: 'gpu3', type: PART_TYPES.GPU, name: 'RTX 4090', price: 1850, power: 450, perf: 180, interface: GPU_INTERFACES.PCIE, len: 358, releaseYear: 2022 },
  { id: 'gpu_a6000', type: PART_TYPES.GPU, name: 'NVIDIA RTX A6000', price: 4300, power: 300, perf: 220, interface: GPU_INTERFACES.PCIE, len: 267, releaseYear: 2020 },
  { id: 'gpu_8800gt', type: PART_TYPES.GPU, name: 'GeForce 8800 GT', price: 20, power: 105, perf: 10, interface: GPU_INTERFACES.PCIE, len: 230, releaseYear: 2007 },
  { id: 'gpu_gtx660', type: PART_TYPES.GPU, name: 'GTX 660 2GB', price: 35, power: 140, perf: 18, interface: GPU_INTERFACES.PCIE, len: 240, releaseYear: 2012 },
  { id: 'gpu_rtx4070ti', type: PART_TYPES.GPU, name: 'RTX 4070 Ti Super', price: 800, power: 285, perf: 130, interface: GPU_INTERFACES.PCIE, len: 310, releaseYear: 2024 },
  { id: 'gpu_titan_rtx', type: PART_TYPES.GPU, name: 'TITAN RTX (Collector Item)', price: 1200, power: 280, perf: 150, interface: GPU_INTERFACES.PCIE, len: 267, releaseYear: 2018 },

  // --- STORAGE ---
  { id: 'hdd_40_pata', type: PART_TYPES.STORAGE, name: '40GB Quantum Fireball', price: 5, power: 10, perf: 1, interface: INTERFACES.PATA, capacity: 40, releaseYear: 2001 },
  { id: 'hdd_80_pata', type: PART_TYPES.STORAGE, name: '80GB Maxtor DiamondMax', price: 8, power: 10, perf: 2, interface: INTERFACES.PATA, capacity: 80, releaseYear: 2003 },
  { id: 'hdd_160_sata', type: PART_TYPES.STORAGE, name: '160GB WD Blue', price: 12, power: 8, perf: 3, interface: INTERFACES.SATA, capacity: 160, releaseYear: 2006 },
  { id: 'hdd_250', type: PART_TYPES.STORAGE, name: '250GB HDD', price: 10, power: 8, perf: 2, interface: INTERFACES.PATA, capacity: 250, releaseYear: 2005 },
  { id: 'hdd_250_sata', type: PART_TYPES.STORAGE, name: '250GB HDD', price: 14, power: 8, perf: 3, interface: INTERFACES.SATA, capacity: 250, releaseYear: 2007 },
  { id: 'hdd_500', type: PART_TYPES.STORAGE, name: '500GB HDD', price: 18, power: 8, perf: 5, interface: INTERFACES.SATA, capacity: 500, releaseYear: 2009 },
  { id: 'hdd_1tb', type: PART_TYPES.STORAGE, name: '1TB HDD', price: 30, power: 9, perf: 10, interface: INTERFACES.SATA, capacity: 1000, releaseYear: 2011 },
  { id: 'ssd_sata', type: PART_TYPES.STORAGE, name: '500GB SATA SSD', price: 40, power: 4, perf: 15, interface: INTERFACES.SATA, capacity: 500, releaseYear: 2015 },
  { id: 'ssd_sata_1tb', type: PART_TYPES.STORAGE, name: '1TB SATA SSD', price: 70, power: 4, perf: 20, interface: INTERFACES.SATA, capacity: 1000, releaseYear: 2017 },
  { id: 'ssd2', type: PART_TYPES.STORAGE, name: '1TB NVMe Gen4', price: 85, power: 5, perf: 45, interface: INTERFACES.M2, capacity: 1000, releaseYear: 2020 },
  { id: 'ssd_gen5', type: PART_TYPES.STORAGE, name: '4TB NVMe Gen5', price: 450, power: 10, perf: 90, interface: INTERFACES.M2, capacity: 4000, releaseYear: 2023 },

  // --- PSUs ---
  { id: 'psu_generic', type: PART_TYPES.PSU, name: '300W Generic', price: 20, wattage: 300, sataConnectors: 2, molexConnectors: 4, releaseYear: 2010 },
  { id: 'psu1', type: PART_TYPES.PSU, name: '450W Bronze', price: 45, wattage: 450, sataConnectors: 4, molexConnectors: 3, releaseYear: 2015 },
  { id: 'psu2', type: PART_TYPES.PSU, name: '750W Gold', price: 110, wattage: 750, sataConnectors: 8, molexConnectors: 4, releaseYear: 2018 },
  { id: 'psu_1000', type: PART_TYPES.PSU, name: '1000W Platinum', price: 220, wattage: 1000, sataConnectors: 12, molexConnectors: 6, releaseYear: 2020 },
  { id: 'psu3', type: PART_TYPES.PSU, name: '1600W Titanium', price: 480, wattage: 1600, sataConnectors: 16, molexConnectors: 8, releaseYear: 2022 },

  // --- COOLERS ---
  { id: 'cooler_stock', type: PART_TYPES.COOLER, name: 'Stock Cooler', price: 0, power: 5, perf: 1, cooling: 65, height: 50, radSize: 0, sockets: [SOCKETS.AM4, SOCKETS.LGA1155, SOCKETS.LGA1200, SOCKETS.AM5], releaseYear: 2010 },
  { id: 'cooler_air_budget', type: PART_TYPES.COOLER, name: 'Hyper 212 Evo', price: 35, power: 5, perf: 2, cooling: 150, height: 159, radSize: 0, sockets: [SOCKETS.AM4, SOCKETS.LGA1155, SOCKETS.LGA1200, SOCKETS.LGA1700, SOCKETS.AM5, SOCKETS.AM3], releaseYear: 2011 },
  { id: 'cooler_air_high', type: PART_TYPES.COOLER, name: 'Noctua NH-D15', price: 100, power: 5, perf: 5, cooling: 250, height: 165, radSize: 0, sockets: [SOCKETS.AM4, SOCKETS.LGA1700, SOCKETS.AM5, SOCKETS.TR4], releaseYear: 2014 },
  { id: 'cooler_aio_240', type: PART_TYPES.COOLER, name: '240mm AIO Liquid', price: 120, power: 10, perf: 8, cooling: 280, height: 30, radSize: 240, sockets: [SOCKETS.AM4, SOCKETS.LGA1700, SOCKETS.AM5], releaseYear: 2018 },
  { id: 'cooler_aio_360', type: PART_TYPES.COOLER, name: '360mm AIO Liquid', price: 180, power: 15, perf: 12, cooling: 350, height: 30, radSize: 360, sockets: [SOCKETS.AM4, SOCKETS.LGA1700, SOCKETS.AM5, SOCKETS.TR4], releaseYear: 2020 },

  // --- CASES ---
  { id: 'case_cardboard', type: PART_TYPES.CASE, name: 'Cardboard Box', price: 0, formFactors: [FORM_FACTORS.ITX, FORM_FACTORS.mATX, FORM_FACTORS.ATX, FORM_FACTORS.EATX], maxGpuLen: 999, maxCoolerHeight: 999, maxRadSize: 999, storageSlots: 999, airflow: 0, releaseYear: 1900 },
  { id: 'case_office', type: PART_TYPES.CASE, name: 'Generic Office Case', price: 30, formFactors: [FORM_FACTORS.mATX, FORM_FACTORS.ATX], maxGpuLen: 250, maxCoolerHeight: 150, maxRadSize: 0, storageSlots: 2, airflow: 1, releaseYear: 2005 },
  { id: 'case_gaming_mid', type: PART_TYPES.CASE, name: 'NZXT H510', price: 80, formFactors: [FORM_FACTORS.ITX, FORM_FACTORS.mATX, FORM_FACTORS.ATX], maxGpuLen: 320, maxCoolerHeight: 165, maxRadSize: 240, storageSlots: 3, airflow: 2, releaseYear: 2019 },
  { id: 'case_gaming_full', type: PART_TYPES.CASE, name: 'Corsair 7000D', price: 200, formFactors: [FORM_FACTORS.ITX, FORM_FACTORS.mATX, FORM_FACTORS.ATX, FORM_FACTORS.EATX], maxGpuLen: 450, maxCoolerHeight: 190, maxRadSize: 360, storageSlots: 6, airflow: 4, releaseYear: 2021 },
  { id: 'case_sff', type: PART_TYPES.CASE, name: 'Terra SFF', price: 180, formFactors: [FORM_FACTORS.ITX], maxGpuLen: 300, maxCoolerHeight: 50, maxRadSize: 0, storageSlots: 2, airflow: 1, releaseYear: 2023 },
  { id: 'case_open_air', type: PART_TYPES.CASE, name: 'Open Air Test Bench', price: 150, formFactors: [FORM_FACTORS.ITX, FORM_FACTORS.mATX, FORM_FACTORS.ATX, FORM_FACTORS.EATX], maxGpuLen: 999, maxCoolerHeight: 999, maxRadSize: 999, storageSlots: 10, airflow: 5, releaseYear: 2015 },
];

export const ORDER_TEMPLATES = [
  { title: "Office PC", minPerf: 20, budget: 500, description: "Just need to run Excel. Don't overspend." },
  { title: "Retro Station", minPerf: 40, budget: 900, description: "I only play games from 2004. Keep it simple." },
  { title: "Budget Gamer", minPerf: 60, budget: 1300, description: "I want to play Valorant and CS2 on a budget." },
  { title: "Mid Gaming PC", minPerf: 90, budget: 1000, description: "Fortnite and Minecraft player here. 1080p High settings." },
  { title: "Esports Pro", minPerf: 120, budget: 1400, description: "I need 240Hz in competitive shooters. Performance over graphics." },
  { title: "Content Creator", minPerf: 160, budget: 2000, description: "Editing 4K video is a nightmare on my current laptop." },
  { title: "Streaming Setup", minPerf: 200, budget: 2500, description: "Single PC setup for streaming and gaming at the same time." },
  { title: "Crypto Miner", minPerf: 220, budget: 3000, description: "I need raw GPU power and a PSU that won't melt." },
  { title: "Enthusiast Grade", minPerf: 300, budget: 4000, description: "High refresh rate 1440p/4K gaming is my life." },
  { id: "workstation_01", title: "AI Training Station", minPerf: 400, budget: 12000, description: "I'm training local LLMs. Give me all the VRAM and threads you can find." },
  { id: "overkill_01", title: "The Overkill Rig", minPerf: 550, budget: 13000, description: "Price is a social construct. I want the absolute best parts in existence." },
];

export const REQUEST_TEMPLATES = [
  // --- LOW TIER / BUDGET CHALLENGES ---
  { 
    title: "The 'Doom 3' Nostalgic", 
    budget: 450, 
    description: "I want to play Doom 3 like it's 2004. I need a GeForce 6800 GT and a Pentium 4. If it doesn't sound like a jet engine, you didn't do it right.", 
    req: { partId: 'gpu_6800gt', minPerf: 15 } 
  },
  { 
    title: "Grandpa's Word Processor", 
    budget: 150, 
    description: "My grandson said I need a 'new' computer for my memoirs. I only have $150.", 
    req: { minRam: 1, minStorage: 40 } 
  },
  { 
    title: "The 'Legacy' Lab", 
    budget: 300, 
    description: "We have some ancient scientific software that only runs on PATA drives. Build us a reliable workstation with at least 80GB of 'old school' storage.", 
    req: { interface: INTERFACES.PATA, minStorage: 80 } 
  },
  { 
    title: "The 'My Son's First PC' Mom", 
    budget: 300, 
    description: "My son wants to play 'The Minecraft'. I have very little money. Make it work!", 
    req: { minPerf: 15 } 
  },
  { 
    title: "Retro XP", 
    budget: 350, 
    description: "I need to run Windows XP. Must have an AGP slot!", 
    req: { gpuInterface: GPU_INTERFACES.AGP, minPerf: 20 } 
  },
  { 
    title: "Office Fleet Manager", 
    budget: 400, 
    description: "I need a basic machine for the accounting department. 8GB RAM is plenty.", 
    req: { minRam: 8, minPerf: 20 } 
  },
  { 
    title: "The 'Craigslist' Specialist", 
    budget: 200, 
    description: "I just need it to run Google Chrome without exploding. Used parts are fine.", 
    req: { minRam: 2, minPerf: 10 } 
  },
  { 
    title: "League of Legends Addict", 
    budget: 500, 
    description: "I play League 14 hours a day. I don't need a 4090 just enough RAM for gaming, I just need it to stay above 144fps so I stop losing LP.", 
    req: { minPerf: 40, minRam: 8 } 
  },
  { 
    title: "The 'Used-to-be' Gamer", 
    budget: 450, 
    description: "I haven't gamed since 2007. Build me something that can run Crysis. I still have nightmares about that game.", 
    req: { minPerf: 35, gpuInterface: GPU_INTERFACES.PCIE } 
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
    description: "I hate fan noise. Give me the 750W Gold PSU so the fans barely spin.", 
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
    description: "I heard the Ryzen 7 7800X3D cpu is the best for gaming. I want one! Please use a 240mm AIO for cooling.",
    req: { partId: 'cpu_r7_7800x3d', minPerf: 200, radSize: 240 }
  },
  {
    title: "SFF Enthusiast",
    budget: 2500,
    description: "I need a high-end PC in the smallest case possible. Must use the Terra SFF case and an air cooler that fits.",
    req: { partId: 'case_sff', minPerf: 150 }
  },

  // --- UPGRADE / REPAIR REQUESTS ---
  {
    title: "Repair: The 'Garage Find'",
    type: 'REPAIR',
    budget: 200,
    description: "I found this in my dad's garage. It has an AGP slot! The hard drive makes a clicking sound like a woodpecker. Please fix it.",
    req: { minStorage: 80, gpuInterface: GPU_INTERFACES.AGP },
    startingParts: [
      { id: 'cpu_p4_530' }, { id: 'mobo_p5pe' }, { id: 'ram_ddr_512' }, { id: 'gpu_fx5200' }, { id: 'psu_generic' },
      { id: 'case_office' }, { id: 'cooler_stock' },
      { id: 'hdd_80_pata', modifier: 'clicking' } 
    ]
  },
  {
    title: "Repair: 'I Smelled Toast'",
    type: 'REPAIR',
    budget: 450,
    description: "I tried to overclock my i3 and I heard a 'pop'. Now the room smells like burnt ozone. Help.",
    req: { minPerf: 25 },
    startingParts: [
      { id: 'cpu_i3_2100', modifier: 'burnt', isJobPart: true }, { id: 'mobo_d2991', isJobPart: true }, { id: 'ram_ddr3_4', isJobPart: true }, { id: 'gpu_730', isJobPart: true }, { id: 'psu_generic', isJobPart: true }, { id: 'hdd_500', isJobPart: true },
      { id: 'case_office' }, { id: 'cooler_stock' }
    ]
  },
  {
    title: "Upgrade: The 'Bottleneck' Special",
    type: 'UPGRADE',
    budget: 1200,
    description: "I put an RTX 3080 in my old PC and now it runs slower than before. Someone said my 'LGA775' CPU and RAM arethe problem? Fix it. (Must include a case with better airflow)",
    req: { minPerf: 100, minRam: 16, minAirflow: 2 },
    startingParts: [
      { id: 'cpu_q9550', isJobPart: true }, { id: 'mobo_p45', isJobPart: true }, { id: 'ram_ddr2_2', isJobPart: true }, { id: 'ram_ddr2_2', isJobPart: true }, { id: 'gpu_3080', isJobPart: true }, { id: 'psu2', isJobPart: true }, { id: 'ssd_sata', isJobPart: true },
      { id: 'case_office', isJobPart: true }, { id: 'cooler_air_budget', isJobPart: true }
    ]
  },
  {
    title: "Repair: Dead GPU",
    type: 'REPAIR',
    budget: 400,
    description: "My PC won't display anything. I think the GPU is fried. Please swap it out.",
    req: { minPerf: 30, gpuInterface: GPU_INTERFACES.PCIE },
    startingParts: [
      { id: 'cpu_i3_2100', isJobPart: true }, { id: 'mobo_d2991', isJobPart: true }, { id: 'ram_ddr3_4', isJobPart: true }, { id: 'hdd_500', isJobPart: true }, { id: 'psu_generic', isJobPart: true },
      { id: 'case_office' }, { id: 'cooler_stock' },
      { id: 'gpu_750ti', modifier: 'dud', isJobPart: true } // The broken part
    ]
  },
  {
    title: "Repair: Blue Screen of Death",
    type: 'REPAIR',
    budget: 300,
    description: "My computer keeps crashing. My nephew said the RAM is 'rusty'. Can you replace it?",
    req: { minRam: 8 },
    startingParts: [
      { id: 'cpu_fx6300', isJobPart: true }, { id: 'mobo_970', isJobPart: true }, { id: 'gpu_730', isJobPart: true }, { id: 'hdd_500', isJobPart: true }, { id: 'psu_generic', isJobPart: true },
      { id: 'case_office' }, { id: 'cooler_stock' },
      { id: 'ram_ddr3_4', modifier: 'rusty', isJobPart: true }, { id: 'ram_ddr3_4', modifier: 'rusty', isJobPart: true }
    ]
  },
  {
    title: "Repair: Power Surge Victim",
    type: 'REPAIR',
    budget: 600,
    description: "Lightning struck near my house. Now my PC won't turn on. I think the PSU and GPU are toast. (Requires 450W+ PSU)",
    req: { partId: 'psu1', minPerf: 40 },
    startingParts: [
      { id: 'cpu_i5_2400', isJobPart: true }, { id: 'mobo_d2991', isJobPart: true }, { id: 'ram_ddr3_8', isJobPart: true }, { id: 'hdd_500', isJobPart: true },
      { id: 'case_office' }, { id: 'cooler_stock' },
      { id: 'psu_generic', modifier: 'dud', isJobPart: true }, // Dead PSU
      { id: 'gpu_750ti', modifier: 'dud', isJobPart: true } // Dead GPU
    ]
  },
  {
    title: "Repair: Rusty Rig",
    type: 'REPAIR',
    budget: 250,
    description: "I left my PC in the garage. It boots but crashes constantly. Can you replace the rusty RAM and add a bigger HDD?",
    req: { minRam: 8, minStorage: 500 },
    startingParts: [
      { id: 'cpu_fx6300', isJobPart: true }, { id: 'mobo_970', isJobPart: true }, { id: 'gpu_730', isJobPart: true }, { id: 'psu_generic', isJobPart: true },
      { id: 'case_office' }, { id: 'cooler_stock' },
      { id: 'ram_ddr3_4', modifier: 'rusty', isJobPart: true }, { id: 'ram_ddr3_4', modifier: 'rusty', isJobPart: true }, { id: 'hdd_250', modifier: 'rusty', isJobPart: true }
    ]
  },

  // --- UPGRADE JOBS ---
  {
    title: "Upgrade: Ray Tracing Ready",
    type: 'UPGRADE',
    budget: 1000,
    description: "My GTX 1080 Ti is legendary, but it lacks Ray Tracing features. Upgrade me to an RTX 3080. You can keep the old card.",
    req: { partId: 'gpu_3080' },
    startingParts: [
      { id: 'cpu_i7_2600k', isJobPart: true }, { id: 'mobo_z77', isJobPart: true }, { id: 'ram_ddr3_8', isJobPart: true }, { id: 'ram_ddr3_8', isJobPart: true }, { id: 'ssd_sata', isJobPart: true }, { id: 'psu2', isJobPart: true },
      { id: 'case_gaming_mid', isJobPart: true }, { id: 'cooler_air_high', isJobPart: true },
      { id: 'gpu_1080ti', isJobPart: true }
    ]
  },
  {
    title: "Upgrade: CPU Bottleneck",
    type: 'UPGRADE',
    budget: 600,
    description: "I bought a fast GPU but my old Ryzen 5 1600 is holding it back. Upgrade me to a Ryzen 7 5800X.",
    req: { partId: 'cpu3' },
    startingParts: [
      { id: 'cpu_r5_1600', isJobPart: true }, { id: 'mobo3', isJobPart: true }, { id: 'ram2', isJobPart: true }, { id: 'ssd2', isJobPart: true }, { id: 'psu1', isJobPart: true },
      { id: 'case_gaming_mid', isJobPart: true }, { id: 'cooler_air_budget', isJobPart: true },
      { id: 'gpu2', isJobPart: true }
    ]
  },
  {
    title: "Upgrade: Next Gen Jump",
    type: 'UPGRADE',
    budget: 1500,
    description: "I want to move to the AM5 platform. I need a Ryzen 5 7600, and DDR5 RAM. (Requires minimum 16GB RAM)",
    req: { partId: 'cpu_r5_7600', minRam: 16 },
    startingParts: [
      { id: 'cpu_r5_3600', isJobPart: true }, { id: 'mobo1', isJobPart: true }, { id: 'ram1', isJobPart: true }, { id: 'ram1', isJobPart: true }, { id: 'ssd2', isJobPart: true }, { id: 'psu1', isJobPart: true },
      { id: 'case_gaming_mid', isJobPart: true }, { id: 'cooler_air_budget', isJobPart: true },
      { id: 'gpu_1660s', isJobPart: true }
    ]
  },
  {
    title: "Upgrade: Storage & Memory",
    type: 'UPGRADE',
    budget: 800,
    description: "My PC is running out of space and memory. I need 32GB of RAM and a 1TB NVMe SSD.",
    req: { minRam: 32, minStorage: 1000, interface: INTERFACES.M2 },
    startingParts: [
      { id: 'cpu2', isJobPart: true }, { id: 'mobo2', isJobPart: true }, { id: 'ram1', isJobPart: true }, { id: 'hdd_500', isJobPart: true }, { id: 'psu_generic', isJobPart: true },
      { id: 'case_office', isJobPart: true }, { id: 'cooler_stock', isJobPart: true },
      { id: 'gpu_1050ti', isJobPart: true }
    ]
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
    description: "I'm training neural networks. I need the absolute maximum VRAM possible (NVIDIA RTX A6000).", 
    req: { partId: 'gpu_a6000' } 
  },
  { 
    title: "The 'Price is No Object' Gamer", 
    budget: 4500, 
    description: "I just won the lottery. Give me an RTX 4090 and don't care about the bill. (Must use 360mm AIO)",
    req: { partId: 'gpu3', radSize: 360 }
  },
  { 
    title: "Next Gen Upgrade",
    budget: 3500,
    description: "I want the new 9000 series Ryzen. Make it happen. (Requires High Airflow Case)",
    req: { partId: 'cpu_r7_9800x3d', minAirflow: 3 }
  },
  { 
    title: "Virtualization Architect", 
    budget: 11000, 
    description: "I run 20 virtual machines at once. I need a Threadripper and 128GB of RAM. Do not fail me. (Requires Threadripper 5995WX and 360mm AIO)",
    req: { partId: 'cpu_tr_5995wx', minRam: 128, radSize: 360 }
  },
  { 
    title: "CGI Render Farm Node", 
    budget: 12000, 
    description: "We are rendering a feature film. We need the highest performance score possible (400+).", 
    req: { minPerf: 400 } 
  },
  { 
    title: "The Failed Crypto Miner", 
    budget: 2500, 
    description: "I'm giving up on ETH. Turn this mining rig into a gaming beast so I can forget my financial losses. Needs at least 32GB of RAM.", 
    req: { minPerf: 250, minRam: 32 } 
  },
  { 
    title: "Competitive Sim-Racer", 
    budget: 6000, 
    description: "I'm running a triple 4K monitor setup for iRacing. If I see a single dropped frame, I'm sending it back. (Requires RTX 4090)", 
    req: { partId: 'gpu3', minPerf: 400 } 
  },
  { 
    title: "The 'Trust Fund' Kid", 
    budget: 14000, 
    description: "My dad said I can spend whatever I want for my birthday. I want the goldest, fastest, most expensive stuff you have. All of it. (Requires 64GB of RAM)", 
    req: { minPerf: 580, minRam: 64 } 
  },

  // --- WEIRD / SPECIFIC CHALLENGES ---
  { 
    title: "The Sleeper Build", 
    budget: 1000, 
    description: "I want a modern PC, but it must use an old-school 250GB HDD as the boot drive for the 'aesthetic' noise.", 
    req: { partId: 'hdd_250_sata', minPerf: 80 } 
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
    description: "We are outfitting a new arena. Need a demo unit that screams performance. (Requires minimum 32GB RAM)",
    req: { minPerf: 250, minRam: 32 }
  },
  {
    title: "Celebrity Streamer",
    budget: 8000,
    description: "I need the best of the best. If it lags, you're fired. (Requires RTX 4090)",
    req: { partId: 'gpu3', minPerf: 350 }
  },
  {
    title: "Hollywood VFX Studio",
    budget: 15000,
    description: "We need a workstation for rendering our next blockbuster. Money is no object, but performance is everything. (Requires minimum 128GB RAM)",
    req: { minPerf: 500, minRam: 128 }
  },
  {
    title: "Hedge Fund Algo Trader",
    budget: 10000,
    description: "Milliseconds matter. I need the fastest single-core performance and 64GB of RAM. (Requires i9-14900K and liquid cooling)",
    req: { partId: 'cpu_i9_14900k', minRam: 64, minRadSize: 240 }
  },
  {
    title: "Top Secret Gov Contract",
    budget: 20000,
    description: "Classified requirements. Just give us the most expensive components you have. We need reliability.",
    req: { minPerf: 550 }
  }
];