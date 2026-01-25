export const MODIFIERS = {
  // Standard Modifiers
  'overclocked': { id: 'overclocked', label: 'Overclocked', color: 'text-rose-500', perfMult: 1.1, priceMult: 1.1 },
  'used': { id: 'used', label: 'Used', color: 'text-slate-500', perfMult: 0.9, priceMult: 0.7 },
  
  // Binning Modifiers
  'golden_chip': { id: 'golden_chip', label: 'Golden Chip', color: 'text-amber-400', perfMult: 1.1, priceMult: 1.2 },
  'silver_sample': { id: 'silver_sample', label: 'Silver Sample', color: 'text-slate-300', perfMult: 1.05, priceMult: 1.1 },
  'dud': { id: 'dud', label: 'Dud', color: 'text-amber-700', perfMult: 0.95, priceMult: 0.8 },
  'unstable': { id: 'unstable', label: 'Unstable', color: 'text-red-600', perfMult: 1.15, priceMult: 0.5, unreliable: true },
  'rusty': { id: 'rusty', label: 'Rusty', color: 'text-orange-800', perfMult: 0.8, priceMult: 0.4, unreliable: true },
};

export const getRandomModifier = (tier = 'STANDARD') => {
  const roll = Math.random();
  
  if (tier === 'PREMIUM') {
    if (roll > 0.85) return MODIFIERS['golden_chip']; // 15%
    if (roll > 0.65) return MODIFIERS['overclocked']; // 20%
    if (roll > 0.50) return MODIFIERS['silver_sample']; // 15%
    if (roll > 0.45) return MODIFIERS['used']; // 5%
    return null; // 45% Clean
  }
  
  if (tier === 'MEDIUM') {
    if (roll > 0.95) return MODIFIERS['golden_chip']; // 5%
    if (roll > 0.85) return MODIFIERS['overclocked']; // 10%
    if (roll > 0.75) return MODIFIERS['used']; // 10%
    if (roll > 0.70) return MODIFIERS['dud']; // 5%
    return null;
  }

  // Standard (Low Tier - More bad stuff)
  if (roll > 0.98) return MODIFIERS['golden_chip']; // 2% Jackpot
  if (roll > 0.90) return MODIFIERS['overclocked']; // 8%
  if (roll > 0.60) return MODIFIERS['used']; // 30%
  if (roll > 0.40) return MODIFIERS['dud']; // 20%
  if (roll > 0.30) return MODIFIERS['rusty']; // 10%
  if (roll > 0.25) return MODIFIERS['unstable']; // 5%
  return null;
};

export const getBinningResult = (skillLevel = 0) => {
  const roll = Math.random();
  
  // Skill improves chances
  const goldenChance = 0.95 - (skillLevel * 0.02); // Base 5%, up to 15% at Lvl 5
  const silverChance = 0.80 - (skillLevel * 0.03); // Base 15%, up to 30% at Lvl 5
  const unstableChance = 0.70; // Fixed 10% threshold relative to others
  const dudChance = 0.40 - (skillLevel * 0.02); // Reduces dud chance

  if (roll > goldenChance) return MODIFIERS['golden_chip'];
  if (roll > silverChance) return MODIFIERS['silver_sample'];
  if (roll > unstableChance) return MODIFIERS['unstable'];
  if (roll > dudChance) return MODIFIERS['dud'];
  return null; // Average Chip
};

export const applyModifier = (part, modifier) => {
  if (!modifier) return part;
  const basePerf = Number(part.perf) || 0;
  const basePrice = Number(part.price) || 0;

  return {
    ...part,
    modifierId: modifier.id,
    name: `${modifier.label} ${part.name}`,
    originalName: part.originalName || part.name,
    perf: Math.floor(basePerf * (modifier.perfMult || 1)),
    price: Math.floor(basePrice * (modifier.priceMult || 1)),
    isUnreliable: modifier.unreliable || false
  };
};

export const getModifierById = (id) => {
  return MODIFIERS[id] || { label: '', color: '' };
};

export const isUnreliable = (part) => {
  return part.isUnreliable || false;
};