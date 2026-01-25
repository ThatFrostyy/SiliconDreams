// src/components/SettingsModal.jsx
import React from 'react';
import { Settings, X, Music, Volume2, VolumeX, Moon, Sun, Trash2 } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export default function SettingsModal({ show, onClose }) {
  const { settings, setSettings, resetGame } = useGameStore(state => ({
    settings: state.settings,
    setSettings: state.setSettings,
    resetGame: state.resetGame,
  }));

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset your game? All progress will be lost.")) {
      resetGame();
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`${settings.darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} border rounded-2xl p-6 w-full max-w-md shadow-2xl`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2"><Settings /> Settings</h2>
          <button onClick={onClose} className="hover:text-rose-500"><X /></button>
        </div>

        <div className="space-y-4">
          <div className={`flex justify-between items-center p-4 rounded-xl ${settings.darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <div className="flex items-center gap-3">
              {settings.music ? <Music className="text-blue-500" /> : <Music className="text-slate-500" />}
              <span className="font-bold">Music</span>
            </div>
            <button onClick={() => setSettings(s => ({...s, music: !s.music}))} className={`w-12 h-6 rounded-full transition-colors relative ${settings.music ? 'bg-blue-600' : 'bg-slate-600'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.music ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          <div className={`flex justify-between items-center p-4 rounded-xl ${settings.darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <div className="flex items-center gap-3">
              {settings.sfx ? <Volume2 className="text-emerald-500" /> : <VolumeX className="text-slate-500" />}
              <span className="font-bold">Sound Effects</span>
            </div>
            <button onClick={() => setSettings(s => ({...s, sfx: !s.sfx}))} className={`w-12 h-6 rounded-full transition-colors relative ${settings.sfx ? 'bg-emerald-600' : 'bg-slate-600'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.sfx ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          <div className={`flex justify-between items-center p-4 rounded-xl ${settings.darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <div className="flex items-center gap-3">
              {settings.darkMode ? <Moon className="text-purple-500" /> : <Sun className="text-amber-500" />}
              <span className="font-bold">Theme</span>
            </div>
            <button onClick={() => setSettings(s => ({...s, darkMode: !s.darkMode}))} className={`w-12 h-6 rounded-full transition-colors relative ${settings.darkMode ? 'bg-purple-600' : 'bg-amber-500'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.darkMode ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          <div className="pt-4 border-t border-slate-700/50">
            <button
              onClick={handleReset}
              className="w-full py-3 rounded-xl font-bold bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center gap-2 transition-colors shadow-lg shadow-rose-900/20"
            >
              <Trash2 size={20} /> Reset Game Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
