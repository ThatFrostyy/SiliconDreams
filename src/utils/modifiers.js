export const MODIFIERS = {
  LEGENDARY: { 
    id: 'legendary', 
    label: 'Legendary', 
    color: 'text-orange-500', 
    priceMult: 1.5, 
    perfMult: 1.25, 
    reliability: 1.0, 
    weight: 2 
  },
  MASTERWORK: { 
    id: 'masterwork', 
    label: 'Masterwork', 
    color: 'text-yellow-500', 
    priceMult: 1.3, 
    perfMult: 1.15, 
    reliability: 1.0, 
    weight: 5 
  },
  SUPERIOR: { 
    id: 'superior', 
    label: 'Superior', 
    color: 'text-emerald-500', 
    priceMult: 1.15, 
    perfMult: 1.1, 
    reliability: 1.0, 
    weight: 10 
  },
  STABLE: { 
    id: 'stable', 
    label: 'Stable', 
    color: 'text-blue-500', 
    priceMult: 1.05, 
    perfMult: 1.0, 
    reliability: 1.1, 
    weight: 15 
  },
  NORMAL: { 
    id: 'normal', 
    label: '', 
    color: '', // Inherit default color
    priceMult: 1.0, 
    perfMult: 1.0, 
    reliability: 1.0, 
    weight: 40 
  },
  USED: { 
    id: 'used', 
    label: 'Used', 
    color: 'text-stone-500', 
    priceMult: 0.7, 
    perfMult: 0.9, 
    reliability: 0.8, 
    weight: 15 
  },
  RUSTY: { 
    id: 'rusty', 
    label: 'Rusty', 
    color: 'text-amber-700', 
    priceMult: 0.5, 
    perfMult: 0.7, 
    reliability: 0.6, 
    weight: 8 
  },
  BROKEN: { 
    id: 'broken', 
    label: 'Broken', 
    color: 'text-red-600', 
    priceMult: 0.2, 
    perfMult: 0.5, 
    reliability: 0.4, 
    weight: 5 
  },
  GOLDEN: { 
    id: 'golden', 
    label: 'Golden Chip', 
    color: 'text-yellow-400', 
    priceMult: 1.2, 
    perfMult: 1.1, 
    reliability: 1.0, 
    weight: 5 
  },
  PLATINUM: { 
    id: 'platinum', 
    label: 'Platinum', 
    color: 'text-cyan-400', 
    priceMult: 1.5, 
    perfMult: 1.15, 
    reliability: 1.0, 
    weight: 2 
  },
  DUD: { 
    id: 'dud', 
    label: 'Dud', 
    color: 'text-stone-400', 
    priceMult: 0.8, 
    perfMult: 0.95, 
    reliability: 0.9, 
    weight: 20 
  },
  UNSTABLE: { 
    id: 'unstable', 
    label: 'Unstable', 
    color: 'text-rose-500', 
    priceMult: 0.6, 
    perfMult: 1.1, 
    reliability: 0.5, 
    weight: 10 
  },
};

export const getRandomModifier = () => {
  const totalWeight = Object.values(MODIFIERS).reduce((acc, mod) => acc + mod.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const mod of Object.values(MODIFIERS)) {
    random -= mod.weight;
    if (random <= 0) return mod;
  }
  return MODIFIERS.NORMAL;
};

export const getBinningResult = () => {
  const roll = Math.random();
  if (roll < 0.05) return MODIFIERS.PLATINUM; // 5%
  if (roll < 0.15) return MODIFIERS.GOLDEN;   // 10%
  if (roll < 0.30) return MODIFIERS.UNSTABLE; // 15%
  if (roll < 0.60) return MODIFIERS.DUD;      // 30%
  return MODIFIERS.NORMAL;                    // 40%
};

export const applyModifier = (part, modifier) => {
  const newPart = { ...part };
  newPart.originalName = part.name;
  newPart.modifierId = modifier.id;
  
  if (modifier.id !== 'normal') {
    newPart.name = `${modifier.label} ${part.name}`;
  }
  
  newPart.price = Math.floor(part.price * modifier.priceMult);
  if (newPart.perf) newPart.perf = Math.floor(newPart.perf * modifier.perfMult);
  newPart.reliability = (part.reliability || 1.0) * modifier.reliability;
  
  return newPart;
};

export const getModifierById = (id) => {
    return Object.values(MODIFIERS).find(m => m.id === id) || MODIFIERS.NORMAL;
};

export const isUnreliable = (part) => {
    return (part.reliability !== undefined && part.reliability < 0.8);
};