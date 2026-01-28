export const DEVLOGS = [
  {
    id: 'patch_1_3',
    title: "Patch 1.3: The Cleaning & Compatibility Update",
    date: "Jan 28, 2026",
    summary: "Physical compatibility, thermal throttling, and the arrival of the Cleaning Bench.",
    content: `**Patch 1.3 Changes**

**Cleaning & Restoration:**
- **The Cleaning Bench**: A new workshop module is now active! Move dirty components here to restore them to their former glory.
- **Interactive Minigame**: Use the **Alcohol Spray** (with physical travel distance) and the **ESD Brush** to manually scrub away grime.
- **Component Visuals**: Core components (CPU, GPU, RAM, Mobo, Storage) now have detailed graphical representations with visible PCBs and textures.
- **Containment**: Grime and cleaning effects are now contained strictly within the component sprites.

**Hardware & Physics:**
- **Physical Compatibility**: Cases now enforce strict limits on **GPU Length**, **Cooler Height**, **Radiator Size**, and **Motherboard Form Factor**.
- **Thermal Throttling**: If a CPU's power draw exceeds your cooler's capacity, the system will now throttle performance.
- **Airflow**: Case airflow ratings now provide a secondary modifier to overall system efficiency.
- **New Modifiers**: Added **'Dusty'**, **'Corroded'**, and **'Gunked Up'** conditions to parts.

**Economy & Quality of Life:**
- **Job Returns**: Customer hardware is now tracked by Job ID. Canceling a job will automatically return all specific parts to the customer.
- **Reputation Penalty**: Be warned: if you've sold or misplaced a customer's original part, you'll face an extra reputation penalty upon cancellation!
- **Pallet Rework**: Standard pallets now yield ~70% modified parts, making the Cleaning Bench a essential tool for profit.
- **Mobile Support**: Added full touch event support for the Cleaning Bench and Workshop interactions.`
  },
  {
    id: 'patch_1_2',
    title: "Patch 1.2: Hardware Expansion",
    date: "Jan 27, 2026",
    summary: "New parts, new jobs, and the arrival of Cases & Coolers.",
    content: `**Patch 1.2 Changes**

**Hardware Expansion:**
- **New Parts**: Added a huge variety of new CPUs, GPUs, Motherboards, and RAM to the catalog.
- **New Categories**: **CPU Coolers** and **PC Cases** are now available in the shop.
- **Dev Note**: These new parts are currently placeholders and don't affect stats yet. However, the next update will enable **Thermal Throttling** and **Form Factor Compatibility**!

**Shop & UI:**
- **Filters**: Added filters for Price, Age, Performance, and Brand in the Shop.
- **Cancel Jobs**: Added a button to cancel active jobs (with a reputation penalty).

**Jobs:**
- **New Contracts**: Added many new job templates and customer requests to utilize the new hardware.
- **Payouts**: Increased pay on some jobs.
- **Fixes**: Fixed issues with some job generation logic.

**Inventory Management:**
- **Job Parts Tag**: Parts that belong to a customer's PC (from Repair/Upgrade jobs) are now clearly marked with a "Job Part" tag. This makes it much easier to keep track of original components and avoid accidentally selling them or mixing them up!`
  },
  {
    id: 'patch_1_1',
    title: "Patch 1.1: The Economy Update",
    date: "Jan 26, 2026",
    summary: "Job rebalancing, storage overhaul, and UI improvements.",
    content: `**Patch 1.1 Changes**

**Economy & Jobs:**
- **Job Listings**: You now get 4 Standard Jobs and 4 Requests per refresh (up from 2).
- **Reshuffling**: The manual reshuffle button has been removed. Jobs now refresh automatically upon completion or expiry, and the board is guaranteed to have a mix of difficulty tiers.
- **Payouts**: Base job reward increased by 20%. Low-tier job budgets doubled to make early game smoother.
- **Structured RNG**: Job board now guarantees a mix of Low, Mid, and High tier jobs, plus a wildcard.
- **New Job Type: Repairs**: Customers will now bring you their broken PCs. Diagnose the issue (look for "Dud" or "Rusty" parts), swap them out, and keep the scrap!
- **New Job Type: Upgrades**: Customers want to upgrade their existing rigs. Swap out their old parts for new ones and keep the leftovers!

**Shop & Inventory:**
- **Pallet Rebalance**: Mystery Pallets have been significantly discounted and buffed. They are now a viable way to stock up on parts below market rate.
  - Standard: $150 (was $500)
  - Medium: $500 (was $1000)
  - Premium: $1500 (was $2500)

**Hardware:**
- **Storage Overhaul**: Added 500GB HDD, 1TB HDD, and 1TB SATA SSD to the shop.
- **UI**: Motherboard specs now highlight available slots in yellow (SATA/PATA/M.2) for better readability.`
  }
];