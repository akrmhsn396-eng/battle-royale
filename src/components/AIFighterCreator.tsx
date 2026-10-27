import React, { useState } from 'react';
import { Fighter, AppTab } from '../types';
import { soundManager } from '../utils/audio';
import { UserPlus, Sparkles, Wand2, Shield, Zap, Flame, ArrowLeft } from 'lucide-react';

interface AIFighterCreatorProps {
  onAddFighter: (fighter: Fighter) => void;
  setTab: (tab: AppTab) => void;
}

export const AIFighterCreator: React.FC<AIFighterCreatorProps> = ({ onAddFighter, setTab }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdFighter, setCreatedFighter] = useState<Fighter | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    soundManager.playMenuClick();

    try {
      const res = await fetch('/api/fighter/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate fighter from AI');
      }

      const data = await res.json();
      const newFighter: Fighter = {
        id: `ai-fighter-${Date.now()}`,
        name: data.name,
        title: data.title,
        element: data.element,
        health: data.health || 1000,
        attackPower: data.attackPower || 80,
        speed: data.speed || 75,
        specialMoveName: data.specialMoveName,
        specialMoveDesc: data.specialMoveDesc,
        bio: data.bio,
        image: '/src/assets/images/fighter_cyber_ninja_1793132396611.jpg',
        color: 'from-purple-600 to-pink-500',
        isCustom: true,
      };

      setCreatedFighter(newFighter);
      onAddFighter(newFighter);
      soundManager.playVictory();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error generating fighter');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => { soundManager.playMenuClick(); setTab('select'); }}
          className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Roster</span>
        </button>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>GEMINI AI GENERATOR</span>
        </div>
      </div>

      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          AI Custom <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Fighter Studio</span>
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto text-sm">
          Describe any warrior, mythic beast, cyberpunk cyborg, or legendary martial artist, and Gemini will forge their combat stats and bio instantly.
        </p>
      </div>

      {/* Generator Form */}
      <form onSubmit={handleGenerate} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 shadow-2xl">
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
            Fighter Theme / Concept Prompt
          </label>
          <div className="flex gap-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A cybernetic ronin samurai with neon plasma katana..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs tracking-wide hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-600/30 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Forging...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Generate Fighter</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}
      </form>

      {/* Created Fighter Preview Card */}
      {createdFighter && (
        <div className="bg-slate-900 border border-purple-500/50 p-8 rounded-3xl space-y-6 shadow-2xl shadow-purple-900/20 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">{createdFighter.title}</span>
              <h2 className="text-2xl font-extrabold text-white">{createdFighter.name}</h2>
            </div>
            <span className="px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono">
              {createdFighter.element}
            </span>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">{createdFighter.bio}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono">
            <div>
              <span className="text-[10px] text-purple-400 uppercase block">Special Move</span>
              <span className="text-sm font-bold text-white">{createdFighter.specialMoveName}</span>
              <p className="text-xs text-slate-400 mt-1">{createdFighter.specialMoveDesc}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center my-auto">
              <div className="bg-slate-900 p-2 rounded-xl">
                <span className="text-[10px] text-slate-500 block">HP</span>
                <span className="text-xs font-bold text-white">{createdFighter.health}</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-xl">
                <span className="text-[10px] text-slate-500 block">ATK</span>
                <span className="text-xs font-bold text-red-400">{createdFighter.attackPower}</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-xl">
                <span className="text-[10px] text-slate-500 block">SPD</span>
                <span className="text-xs font-bold text-cyan-400">{createdFighter.speed}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={() => { soundManager.playMenuClick(); setTab('arena'); }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-semibold text-xs tracking-wide hover:from-red-500 hover:to-amber-500 transition-all shadow-lg shadow-red-600/30"
            >
              Enter Arena with {createdFighter.name}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
