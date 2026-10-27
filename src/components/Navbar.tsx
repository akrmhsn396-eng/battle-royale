import React from 'react';
import { AppTab } from '../types';
import { soundManager } from '../utils/audio';
import { Swords, UserPlus, Code2, Users, Volume2, VolumeX } from 'lucide-react';

interface NavbarProps {
  currentTab: AppTab;
  setTab: (tab: AppTab) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setTab, soundEnabled, setSoundEnabled }) => {
  const toggleAudio = () => {
    const newState = soundManager.toggleSound();
    setSoundEnabled(newState);
  };

  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      {/* Zone 1: Single text element wordmark */}
      <div 
        onClick={() => { soundManager.playMenuClick(); setTab('select'); }}
        className="flex items-center gap-2 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
          <Swords className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 block">
            Mobile Fighter
          </span>
          <span className="text-[10px] text-red-400 font-mono tracking-widest uppercase block">
            Arcade & Python Studio
          </span>
        </div>
      </div>

      {/* Zone 2: 4-5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
        <button
          onClick={() => { soundManager.playMenuClick(); setTab('select'); }}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
            currentTab === 'select' ? 'text-red-400 font-semibold' : ''
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Fighter Roster</span>
        </button>
        <button
          onClick={() => { soundManager.playMenuClick(); setTab('arena'); }}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
            currentTab === 'arena' ? 'text-red-400 font-semibold' : ''
          }`}
        >
          <Swords className="w-4 h-4" />
          <span>Arcade Arena</span>
        </button>
        <button
          onClick={() => { soundManager.playMenuClick(); setTab('creator'); }}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
            currentTab === 'creator' ? 'text-red-400 font-semibold' : ''
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>AI Fighter Creator</span>
        </button>
        <button
          onClick={() => { soundManager.playMenuClick(); setTab('kivy'); }}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
            currentTab === 'kivy' ? 'text-red-400 font-semibold' : ''
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Kivy Mobile Project</span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={toggleAudio}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-2 text-xs font-medium"
          title="Toggle Sound Effects"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          <span className="hidden sm:inline">{soundEnabled ? 'Audio On' : 'Muted'}</span>
        </button>
        <button
          onClick={() => { soundManager.playMenuClick(); setTab('arena'); }}
          className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-red-600 to-amber-600 rounded-xl hover:from-red-500 hover:to-amber-500 transition-all shadow-lg shadow-red-600/30 whitespace-nowrap shrink-0"
        >
          Quick Fight
        </button>
      </div>
    </header>
  );
};
