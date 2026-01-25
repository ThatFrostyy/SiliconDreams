import { PART_TYPES, REQUEST_TEMPLATES, ORDER_TEMPLATES } from '../data/constants';

export const generateRequest = (reputation = 0, marketingLevel = 0) => {
  const vipChanceThreshold = 0.85 - (marketingLevel * 0.05); // Base 15% + 5% per level
  const isVip = Math.random() > vipChanceThreshold;
  
  // Filter templates based on reputation to balance progression
  const availableTemplates = REQUEST_TEMPLATES.filter(t => {
    if (reputation < 25) return t.budget <= 1500; // Novice: Low budget only
    if (reputation < 50) return t.budget <= 5000; // Trusted: Mid budget
    if (reputation < 75) return t.budget <= 10000; // Expert: High budget
    return true; // Tycoon: All jobs
  });

  const templates = availableTemplates.length > 0 ? availableTemplates : REQUEST_TEMPLATES;
  const template = templates[Math.floor(Math.random() * templates.length)];
  const budgetMultiplier = isVip ? 1.5 : 1;
  
  let targetPerf = 0;
  // Use template's minPerf if specified, otherwise derive from budget
  if (template.req && template.req.minPerf) {
    targetPerf = Math.floor(template.req.minPerf * budgetMultiplier);
  } else {
    targetPerf = Math.floor((template.budget * budgetMultiplier) / 12);
  }

  // Cap performance requirement to achievable limits (max possible is ~650)
  if (targetPerf > 600) targetPerf = 600;

  return {
    ...template,
    id: `req_${Math.random().toString(36).substr(2, 5)}`,
    type: 'REQUEST',
    minPerf: targetPerf,
    budget: Math.floor(template.budget * budgetMultiplier),
    isVip,
    title: isVip ? `VIP: ${template.title}` : template.title,
    description: isVip ? `(VIP CLIENT) ${template.description}` : template.description
  };
};

export const generateOrderLocal = (activeOrders = [], excludeTitle = null) => {
  const activeTitles = activeOrders.map(o => o.title);
  if (excludeTitle) activeTitles.push(excludeTitle);

  let available = ORDER_TEMPLATES.filter(t => !activeTitles.includes(t.title));

  // If all orders are active, fallback to the full list *minus* the one we're excluding
  if (available.length === 0 && excludeTitle) {
    available = ORDER_TEMPLATES.filter(t => t.title !== excludeTitle);
  } else if (available.length === 0) {
    // If still no options (i.e., all orders are active and none to exclude), use the full list
    available = ORDER_TEMPLATES;
  }

  const template = available[Math.floor(Math.random() * available.length)];

  return {
    ...template,
    id: `ord_${Math.random().toString(36).substr(2, 5)}`,
    type: 'STANDARD'
  };
};

export const calculateBuildStats = (build, skills = {}) => {
  const parts = Object.values(build);
  let totalPower = parts.reduce((acc, p) => acc + (p.power || 0), 0);
  
  // Optimization Skill Bonus
  const powerReduction = 1 - ((skills.optimization || 0) * 0.02);
  totalPower = Math.floor(totalPower * powerReduction);
  
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
  
  // Bottleneck Logic: GPU cannot exceed 1.5x CPU performance
  if (cpu && gpu) {
      const cpuPerf = cpu.perf || 0;
      const gpuPerf = gpu.perf || 0;
      if (gpuPerf > cpuPerf * 1.5) {
           bottleneckPenalty = gpuPerf - (cpuPerf * 1.5);
           rawPerf -= bottleneckPenalty;
      }
  }

  const totalPerf = Math.floor(rawPerf * perfMultiplier);

  // Overclocking Skill Bonus
  const ocBonus = 1 + ((skills.overclocking || 0) * 0.01);
  const finalPerf = Math.floor(totalPerf * ocBonus);
  
  return { totalPower, totalPerf: finalPerf, bottleneckPenalty, ramBonus };
};