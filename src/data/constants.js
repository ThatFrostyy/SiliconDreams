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

export const PARTS_CATALOG = [
  // --- CPUs (Chronological) ---
  { id: 'cpu_q9550', type: PART_TYPES.CPU, name: 'Core 2 Quad Q9550', price: 15, socket: SOCKETS.LGA775, power: 95, perf: 12 },
  { id: 'cpu_i3_2100', type: PART_TYPES.CPU, name: 'Intel i3-2100', price: 20, socket: SOCKETS.LGA1155, power: 65, perf: 15 },
  { id: 'cpu_fx6300', type: PART_TYPES.CPU, name: 'AMD FX-6300', price: 35, socket: SOCKETS.AM3, power: 95, perf: 22 },
  { id: 'cpu_i7_2600k', type: PART_TYPES.CPU, name: 'Intel i7-2600K', price: 45, socket: SOCKETS.LGA1155, power: 95, perf: 30 },
  { id: 'cpu1', type: PART_TYPES.CPU, name: 'Ryzen 3 3100', price: 85, socket: SOCKETS.AM4, power: 65, perf: 40 },
  { id: 'cpu2', type: PART_TYPES.CPU, name: 'Intel i5-10400', price: 130, socket: SOCKETS.LGA1200, power: 65, perf: 60 },
  { id: 'cpu3', type: PART_TYPES.CPU, name: 'Ryzen 7 5800X', price: 280, socket: SOCKETS.AM4, power: 105, perf: 85 },
  { id: 'cpu_i5_12600k', type: PART_TYPES.CPU, name: 'Intel i5-12600K', price: 240, socket: SOCKETS.LGA1700, power: 125, perf: 75 },
  { id: 'cpu4', type: PART_TYPES.CPU, name: 'Ryzen 9 7950X', price: 520, socket: SOCKETS.AM5, power: 170, perf: 115 },
  { id: 'cpu_i9_14900k', type: PART_TYPES.CPU, name: 'Intel i9-14900K', price: 580, socket: SOCKETS.LGA1700, power: 253, perf: 110 },
  { id: 'cpu_tr_5995wx', type: PART_TYPES.CPU, name: 'Threadripper 5995WX', price: 4200, socket: SOCKETS.TR4, power: 280, perf: 250 },

  // --- MOTHERBOARDS (Chronological by Socket) ---
  { id: 'mobo_865', type: PART_TYPES.MOTHERBOARD, name: '865PE Neo2', price: 20, socket: SOCKETS.LGA775, ramSlots: 4, maxRam: 4, memoryType: 'DDR2', sataSlots: 2, pataSlots: 2, m2Slots: 0, gpuInterface: GPU_INTERFACES.AGP },
  { id: 'mobo_p45', type: PART_TYPES.MOTHERBOARD, name: 'Gigabyte GA-EP45-UD3P', price: 25, socket: SOCKETS.LGA775, ramSlots: 4, maxRam: 16, memoryType: 'DDR2', sataSlots: 6, pataSlots: 2, m2Slots: 0, gpuInterface: GPU_INTERFACES.PCIE },
  { id: 'mobo_d2991', type: PART_TYPES.MOTHERBOARD, name: 'Fujitsu D2991-A1 (OEM)', price: 30, socket: SOCKETS.LGA1155, ramSlots: 2, maxRam: 16, memoryType: 'DDR3', sataSlots: 4, pataSlots: 0, m2Slots: 0, gpuInterface: GPU_INTERFACES.PCIE },
  { id: 'mobo_970', type: PART_TYPES.MOTHERBOARD, name: '970A Chipset', price: 45, socket: SOCKETS.AM3, ramSlots: 4, maxRam: 32, memoryType: 'DDR3', sataSlots: 6, pataSlots: 0, m2Slots: 0, gpuInterface: GPU_INTERFACES.PCIE },
  { id: 'mobo_z77', type: PART_TYPES.MOTHERBOARD, name: 'Z77 Extreme', price: 70, socket: SOCKETS.LGA1155, ramSlots: 4, maxRam: 32, memoryType: 'DDR3', sataSlots: 4, pataSlots: 0, m2Slots: 0, gpuInterface: GPU_INTERFACES.PCIE },
  { id: 'mobo1', type: PART_TYPES.MOTHERBOARD, name: 'B450 Budget Board', price: 75, socket: SOCKETS.AM4, ramSlots: 4, maxRam: 64, memoryType: 'DDR4', sataSlots: 4, pataSlots: 0, m2Slots: 1, gpuInterface: GPU_INTERFACES.PCIE },
  { id: 'mobo2', type: PART_TYPES.MOTHERBOARD, name: 'H410M Entry', price: 85, socket: SOCKETS.LGA1200, ramSlots: 2, maxRam: 32, memoryType: 'DDR4', sataSlots: 4, pataSlots: 0, m2Slots: 0, gpuInterface: GPU_INTERFACES.PCIE },
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
  { id: 'gpu_750ti', type: PART_TYPES.GPU, name: 'GTX 750 Ti', price: 45, power: 60, perf: 25, interface: GPU_INTERFACES.PCIE },
  { id: 'gpu_970', type: PART_TYPES.GPU, name: 'GTX 970', price: 80, power: 145, perf: 45, interface: GPU_INTERFACES.PCIE },
  { id: 'gpu_1660s', type: PART_TYPES.GPU, name: 'GTX 1660 Super', price: 160, power: 125, perf: 55, interface: GPU_INTERFACES.PCIE },
  { id: 'gpu2', type: PART_TYPES.GPU, name: 'RTX 3060', price: 290, power: 170, perf: 75, interface: GPU_INTERFACES.PCIE },
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
  { title: "Office PC", minPerf: 20, budget: 350, description: "Just need to run Excel. Don't overspend." },
  { title: "Retro Station", minPerf: 40, budget: 600, description: "I only play games from 2004. Keep it simple." },
  { title: "Mid Gaming PC", minPerf: 80, budget: 1100, description: "Fortnite and Minecraft player here." },
  { title: "Content Creator", minPerf: 150, budget: 2200, description: "Editing 4K video is a nightmare on my current laptop." },
  { title: "Crypto Miner", minPerf: 180, budget: 3200, description: "I need raw GPU power and a PSU that won't melt." },
  { id: "workstation_01", title: "AI Training Station", minPerf: 350, budget: 6500, description: "I'm training local LLMs. Give me all the VRAM and threads you can find." },
  { id: "overkill_01", title: "The Overkill Rig", minPerf: 450, budget: 9500, description: "Price is a social construct. I want the absolute best parts in existence." },
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
    title: "Retro XP Battlestation", 
    budget: 450, 
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
    budget: 1200, 
    description: "I want to stream 1080p. I've heard the GTX 1660 Super is the sweet spot!", 
    req: { partId: 'gpu_1660s', minRam: 16 } 
  },
  { 
    title: "The 'Silent' Accountant", 
    budget: 900, 
    description: "I hate fan noise. Give me a high-efficiency PSU so the fans barely spin.", 
    req: { partId: 'psu2' } // Requires the 750W Gold
  },
  { 
    title: "4K Movie Box", 
    budget: 1100, 
    description: "This is for my home theater. I need at least 1TB of NVMe storage for my 'legal' movies.", 
    req: { minStorage: 1000, interface: INTERFACES.M2 } 
  },
  { 
    title: "NVIDIA Fanboy", 
    budget: 800, 
    description: "Must have a GTX 970. Don't ask why.", 
    req: { partId: 'gpu_970' } 
  },

  // --- HIGH TIER / BIG PROFIT JOBS ---
  { 
    title: "4K Video Editor", 
    budget: 2800, 
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
    title: "Virtualization Architect", 
    budget: 7500, 
    description: "I run 20 virtual machines at once. I need a Threadripper and 128GB of RAM. Do not fail me.", 
    req: { partId: 'cpu_tr_5995wx', minRam: 128 } 
  },
  { 
    title: "CGI Render Farm Node", 
    budget: 9000, 
    description: "We are rendering a feature film. We need the highest performance score possible (400+).", 
    req: { minPerf: 400 } 
  },

  // --- WEIRD / SPECIFIC CHALLENGES ---
  { 
    title: "The Sleeper Build", 
    budget: 1500, 
    description: "I want a modern PC, but it must use an old-school 250GB HDD as the boot drive for the 'aesthetic' noise.", 
    req: { partId: 'hdd_250', minPerf: 80 } 
  },
  { 
    title: "Data Hoarder", 
    budget: 1200, 
    description: "I need 4TB of storage space minimum. I don't care if it's slow, just big.", 
    req: { minStorage: 4000 } 
  }
];