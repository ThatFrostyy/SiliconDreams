// src/components/CelebrationOverlay.jsx
import React from 'react';
import { useGameStore } from '../store/gameStore';

export default function CelebrationOverlay() {
  const celebration = useGameStore(state => state.celebration);

  if (!celebration) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" />
      <div className="relative z-10 text-center animate-in zoom-in-50 duration-500 slide-in-from-bottom-10">
        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-amber-600 drop-shadow-[0_0_25px_rgba(245,158,11,0.6)]">
          {celebration === 'GOLDEN' && 'GOLDEN CHIP!'}
        </h1>
        <p className="text-white text-xl md:text-2xl font-bold mt-4 drop-shadow-md tracking-widest uppercase">
          {celebration === 'GOLDEN' && 'Legendary Silicon Found'}
        </p>
      </div>
    </div>
  );
}
