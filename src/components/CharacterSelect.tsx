import React from 'react';
import { Fighter, GameMode, AppTab } from '../types';
import { soundManager } from '../utils/audio';
import { Swords, Zap, Shield, Flame, Plus, Trophy } from 'lucide-react';

interface CharacterSelectProps {
  fighters: Fighter[];
  selectedFighter: Fighter;
  setSelectedFighter: (f: Fighter) => void;
  opponentFighter: Fighter;
  setOpponentFighter: (f: Fighter) => void;
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  setTab: (tab: AppTab) => void;
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({
  fighters,
  selectedFighter,
  setSelectedFighter,
  opponentFighter,
  setOpponentFighter,
  gameMode,
  setGameMode,
  setTab,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
          <Flame className="w-3.5 h-3.5" />
          <span>TOURNAMENT SELECTION</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-400">Mobile Fighter</span>
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-sm">
          Select your combatant, configure game mode, and enter the neon arcade arena to prove your mastery.
        </p>
      </div>

      {/* Game Mode Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {(['arcade', 'versus', 'training'] as GameMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => {
              soundManager.playMenuClick();
              setGameMode(mode);
            }}
            className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
              gameMode === mode
                ? 'bg-red-950/40 border-red-500/50 shadow-lg shadow-red-900/20'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-white capitalize flex items-center gap-2">
                {mode === 'arcade' && <Trophy className="w-4 h-4 text-amber-400" />}
                {mode === 'versus' && <Swords className="w-4 h-4 text-red-400" />}
                {mode === 'training' && <Zap className="w-4 h-4 text-cyan-400" />}
                {mode} Mode
              </span>
              <span className={`w-2.5 h-2.5 rounded-full ${gameMode === mode ? 'bg-red-500' : 'bg-slate-700'}`} />
            </div>
            <p className="text-xs text-slate-400">
              {mode === 'arcade' && 'Battle through 3 tough opponents to claim the championship trophy.'}
              {mode === 'versus' && 'Local 2-player combat challenge against a friend on the same device.'}
              {mode === 'training' && 'Unlimited health dojo to practice combos and special moves.'}
            </p>
          </button>
        ))}
      </div>

      {/* Fighter Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">Available Warriors</h2>
          <button
            onClick={() => { soundManager.playMenuClick(); setTab('creator'); }}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-red-400" />
            <span>Create AI Fighter</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {fighters.map((fighter) => {
            const isSelected = selectedFighter.id === fighter.id;
            return (
              <div
                key={fighter.id}
                onClick={() => {
                  soundManager.playMenuClick();
                  setSelectedFighter(fighter);
                }}
                className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'border-red-500 ring-2 ring-red-500/30 bg-slate-900 shadow-2xl shadow-red-900/30 scale-[1.02]'
                    : 'border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                {/* Fighter Image */}
                <div className="aspect-square relative overflow-hidden bg-slate-950">
                  <img
                    src={fighter.image}
                    alt={fighter.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback gradient box if image fails
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-amber-400">
                    {fighter.element}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 block mb-1">
                      {fighter.title}
                    </span>
                    <h3 className="text-lg font-bold text-white tracking-tight">{fighter.name}</h3>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2">{fighter.bio}</p>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center font-mono">
                    <div className="bg-slate-950/60 rounded-lg p-1.5">
                      <span className="text-[10px] text-slate-500 block">HP</span>
                      <span className="text-xs font-bold text-white">{fighter.health}</span>
                    </div>
                    <div className="bg-slate-950/60 rounded-lg p-1.5">
                      <span className="text-[10px] text-slate-500 block">ATK</span>
                      <span className="text-xs font-bold text-red-400">{fighter.attackPower}</span>
                    </div>
                    <div className="bg-slate-950/60 rounded-lg p-1.5">
                      <span className="text-[10px] text-slate-500 block">SPD</span>
                      <span className="text-xs font-bold text-cyan-400">{fighter.speed}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundManager.playMenuClick();
                      setSelectedFighter(fighter);
                      setTab('arena');
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-semibold text-xs tracking-wide hover:from-red-500 hover:to-amber-500 transition-all shadow-md shadow-red-600/20"
                  >
                    Select & Fight
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
