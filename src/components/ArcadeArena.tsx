import React, { useState, useEffect, useRef } from 'react';
import { Fighter, GameMode } from '../types';
import { soundManager } from '../utils/audio';
import { Swords, RotateCcw, ArrowLeft, Shield, Zap, Award } from 'lucide-react';

interface ArcadeArenaProps {
  player1: Fighter;
  fighters: Fighter[];
  gameMode: GameMode;
  onReturnToSelect: () => void;
}

export const ArcadeArena: React.FC<ArcadeArenaProps> = ({ player1, fighters, gameMode, onReturnToSelect }) => {
  // Opponent setup
  const availableOpponents = fighters.filter((f) => f.id !== player1.id);
  const [opponentIndex, setOpponentIndex] = useState(0);
  const currentOpponent = availableOpponents[opponentIndex % availableOpponents.length];

  // Match state
  const [p1Hp, setP1Hp] = useState(player1.health);
  const [p2Hp, setP2Hp] = useState(currentOpponent.health);
  const [p1MaxHp] = useState(player1.health);
  const [p2MaxHp] = useState(currentOpponent.health);

  const [p1Energy, setP1Energy] = useState(0);
  const [p2Energy, setP2Energy] = useState(0);

  const [p1Action, setP1Action] = useState<string>('idle');
  const [p2Action, setP2Action] = useState<string>('idle');

  const [p1Pos, setP1Pos] = useState(25); // percentage from left
  const [p2Pos, setP2Pos] = useState(75);

  const [announcerText, setAnnouncerText] = useState('ROUND 1 ... FIGHT!');
  const [matchOver, setMatchOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const [damagePopups, setDamagePopups] = useState<Array<{ id: number; text: string; x: number; y: number; isCrit: boolean }>>([]);
  const popupIdRef = useRef(0);

  const addDamagePopup = (text: string, x: number, y: number, isCrit = false) => {
    const id = popupIdRef.current++;
    setDamagePopups((prev) => [...prev, { id, text, x, y, isCrit }]);
    setTimeout(() => {
      setDamagePopups((prev) => prev.filter((p) => p.id !== id));
    }, 800);
  };

  // AI Opponent Loop
  useEffect(() => {
    if (matchOver) return;

    const aiInterval = setInterval(() => {
      if (Math.random() < 0.45) {
        // AI action
        const actions = ['punch', 'kick', 'special', 'block', 'walk'];
        const chosen = actions[Math.floor(Math.random() * actions.length)];
        setP2Action(chosen);

        if (chosen === 'punch') {
          soundManager.playPunch();
          const dmg = Math.floor(currentOpponent.attackPower * 0.3);
          setP1Hp((prev) => Math.max(0, prev - (p1Action === 'block' ? Math.floor(dmg * 0.3) : dmg)));
          addDamagePopup(`-${dmg}`, 30, 50, false);
        } else if (chosen === 'kick') {
          soundManager.playKick();
          const dmg = Math.floor(currentOpponent.attackPower * 0.45);
          setP1Hp((prev) => Math.max(0, prev - (p1Action === 'block' ? Math.floor(dmg * 0.3) : dmg)));
          addDamagePopup(`-${dmg}`, 30, 50, false);
        } else if (chosen === 'special') {
          soundManager.playSpecial();
          const dmg = Math.floor(currentOpponent.attackPower * 0.75);
          setP1Hp((prev) => Math.max(0, prev - (p1Action === 'block' ? Math.floor(dmg * 0.4) : dmg)));
          addDamagePopup(`-${dmg} SPECIAL!`, 30, 40, true);
        }

        setTimeout(() => setP2Action('idle'), 400);
      }
    }, 1200);

    return () => clearInterval(aiInterval);
  }, [matchOver, p1Action, currentOpponent]);

  // Check Win Condition
  useEffect(() => {
    if (p1Hp <= 0 && !matchOver) {
      setMatchOver(true);
      setWinner(currentOpponent.name);
      setAnnouncerText(`${currentOpponent.name.toUpperCase()} WINS!`);
    } else if (p2Hp <= 0 && !matchOver) {
      setMatchOver(true);
      setWinner(player1.name);
      soundManager.playVictory();
      setAnnouncerText(`${player1.name.toUpperCase()} WINS! PERFECT!`);
    }
  }, [p1Hp, p2Hp, matchOver, player1, currentOpponent]);

  // Player actions
  const handleP1Attack = (type: 'punch' | 'kick' | 'special') => {
    if (matchOver) return;

    if (type === 'punch') {
      soundManager.playPunch();
      setP1Action('punch');
      const dmg = Math.floor(player1.attackPower * 0.35);
      setP2Hp((prev) => Math.max(0, prev - dmg));
      setP1Energy((prev) => Math.min(100, prev + 15));
      addDamagePopup(`-${dmg}`, 70, 50, false);
    } else if (type === 'kick') {
      soundManager.playKick();
      setP1Action('kick');
      const dmg = Math.floor(player1.attackPower * 0.5);
      setP2Hp((prev) => Math.max(0, prev - dmg));
      setP1Energy((prev) => Math.min(100, prev + 25));
      addDamagePopup(`-${dmg}`, 70, 50, false);
    } else if (type === 'special') {
      if (p1Energy < 50) {
        setAnnouncerText('NOT ENOUGH ENERGY!');
        setTimeout(() => setAnnouncerText('FIGHT!'), 1000);
        return;
      }
      soundManager.playSpecial();
      setP1Action('special');
      setP1Energy(0);
      const dmg = Math.floor(player1.attackPower * 1.2);
      setP2Hp((prev) => Math.max(0, prev - dmg));
      addDamagePopup(`-${dmg} K.O. BLAST!`, 70, 40, true);
    }

    setTimeout(() => setP1Action('idle'), 400);
  };

  const handleResetMatch = () => {
    setP1Hp(p1MaxHp);
    setP2Hp(p2MaxHp);
    setP1Energy(0);
    setP2Energy(0);
    setMatchOver(false);
    setWinner(null);
    setAnnouncerText('ROUND 2 ... FIGHT!');
  };

  const handleNextOpponent = () => {
    setOpponentIndex((prev) => prev + 1);
    setP1Hp(p1MaxHp);
    setP2Hp(currentOpponent.health);
    setP1Energy(0);
    setMatchOver(false);
    setWinner(null);
    setAnnouncerText('NEXT CHALLENGER ... FIGHT!');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Bar Header */}
      <div className="flex items-center justify-between bg-slate-900/80 backdrop-blur border border-slate-800 px-6 py-3 rounded-2xl">
        <button
          onClick={onReturnToSelect}
          className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Arena</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono uppercase tracking-wider">
            {gameMode} Mode
          </span>
          <span className="text-xs text-slate-400 font-mono">
            Opponent {opponentIndex + 1} of 3
          </span>
        </div>

        <button
          onClick={handleResetMatch}
          className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-amber-400" />
          <span>Reset Match</span>
        </button>
      </div>

      {/* HUD & Health Bars */}
      <div className="grid grid-cols-2 gap-4 bg-slate-950/90 border border-slate-800 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Player 1 HUD */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-sm font-bold text-white">{player1.name}</span>
            <span className="text-xs font-mono text-red-400">{p1Hp} / {p1MaxHp} HP</span>
          </div>
          <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${(p1Hp / p1MaxHp) * 100}%` }}
            />
          </div>
          {/* Energy Super Meter */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-cyan-400">
              <span>SUPER ENERGY</span>
              <span>{p1Energy}%</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${p1Energy}%` }}
              />
            </div>
          </div>
        </div>

        {/* Player 2 / Opponent HUD */}
        <div className="space-y-2 text-right">
          <div className="flex justify-between items-end flex-row-reverse">
            <span className="text-sm font-bold text-white">{currentOpponent.name}</span>
            <span className="text-xs font-mono text-amber-400">{p2Hp} / {p2MaxHp} HP</span>
          </div>
          <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-red-600 rounded-full transition-all duration-300 ml-auto"
              style={{ width: `${(p2Hp / p2MaxHp) * 100}%` }}
            />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-amber-400 flex-row-reverse">
              <span>CPU POWER</span>
              <span>100%</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Combat Arena Canvas Screen */}
      <div className="aspect-[16/9] md:aspect-[21/9] rounded-3xl relative overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-between p-6 bg-slate-950">
        {/* Background Image / Arena */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/arcade_bg_arena_1793132396159.jpg"
            alt="Arcade Arena Background"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        {/* Announcer Banner */}
        <div className="relative z-10 text-center py-2">
          <div className="inline-block px-6 py-2 rounded-2xl bg-black/70 backdrop-blur-md border border-red-500/30 text-red-400 font-mono text-sm md:text-base tracking-widest uppercase shadow-lg shadow-red-600/20 animate-pulse">
            {announcerText}
          </div>
        </div>

        {/* Fighters Visualization Stage */}
        <div className="relative z-10 flex justify-between items-end px-12 pb-8 h-48">
          {/* Player 1 Fighter Sprite & Animation */}
          <div
            className={`flex flex-col items-center transition-all duration-200 ${
              p1Action === 'punch'
                ? 'translate-x-12 scale-105'
                : p1Action === 'kick'
                ? 'translate-x-16 scale-105'
                : p1Action === 'special'
                ? 'translate-x-20 scale-110'
                : ''
            }`}
          >
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-red-500 shadow-2xl shadow-red-600/50 bg-slate-900">
              <img
                src={player1.image}
                alt={player1.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="mt-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white border border-red-500/40">
              P1: {player1.name.split(' ')[0]}
            </span>
          </div>

          {/* Damage Popups */}
          {damagePopups.map((p) => (
            <div
              key={p.id}
              className={`absolute z-30 font-mono font-extrabold text-lg md:text-2xl pointer-events-none animate-bounce ${
                p.isCrit ? 'text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]' : 'text-red-500'
              }`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              {p.text}
            </div>
          ))}

          {/* Player 2 / Opponent Fighter Sprite & Animation */}
          <div
            className={`flex flex-col items-center transition-all duration-200 ${
              p2Action === 'punch' || p2Action === 'kick' || p2Action === 'special'
                ? '-translate-x-12 scale-105'
                : ''
            }`}
          >
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-amber-500 shadow-2xl shadow-amber-600/50 bg-slate-900">
              <img
                src={currentOpponent.image}
                alt={currentOpponent.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover scale-x-[-1]"
              />
            </div>
            <span className="mt-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white border border-amber-500/40">
              CPU: {currentOpponent.name.split(' ')[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Match Over Modal Overlay */}
      {matchOver && (
        <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">{winner} WINS!</h2>
              <p className="text-xs text-slate-400">
                {winner === player1.name ? 'Magnificent victory! Your combative prowess is legendary.' : 'Defeated in battle. Analyze your strategy and try again!'}
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleResetMatch}
                className="flex-1 py-3 rounded-xl bg-slate-800 text-white font-semibold text-xs hover:bg-slate-700 transition-colors"
              >
                Rematch
              </button>
              {winner === player1.name && opponentIndex < availableOpponents.length - 1 ? (
                <button
                  onClick={handleNextOpponent}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-semibold text-xs hover:from-red-500 hover:to-amber-500 transition-all shadow-lg shadow-red-600/30"
                >
                  Next Opponent
                </button>
              ) : (
                <button
                  onClick={onReturnToSelect}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-semibold text-xs hover:from-red-500 hover:to-amber-500 transition-all shadow-lg shadow-red-600/30"
                >
                  Return to Roster
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Arcade Touch Controls HUD (Mobile & Desktop Friendly) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => handleP1Attack('punch')}
          disabled={matchOver}
          className="py-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-red-500/50 hover:bg-red-950/20 text-white font-bold text-sm tracking-wider transition-all flex flex-col items-center gap-1 shadow-lg disabled:opacity-50"
        >
          <span className="text-red-400 font-mono text-xs">J KEY</span>
          <span>LIGHT PUNCH</span>
        </button>

        <button
          onClick={() => handleP1Attack('kick')}
          disabled={matchOver}
          className="py-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-amber-950/20 text-white font-bold text-sm tracking-wider transition-all flex flex-col items-center gap-1 shadow-lg disabled:opacity-50"
        >
          <span className="text-amber-400 font-mono text-xs">K KEY</span>
          <span>HEAVY KICK</span>
        </button>

        <button
          onClick={() => handleP1Attack('special')}
          disabled={matchOver || p1Energy < 50}
          className={`py-4 rounded-2xl border font-bold text-sm tracking-wider transition-all flex flex-col items-center gap-1 shadow-lg ${
            p1Energy >= 50
              ? 'bg-gradient-to-r from-cyan-950 to-blue-950 border-cyan-500 text-white hover:border-cyan-400 animate-pulse'
              : 'bg-slate-900 border-slate-800 text-slate-500 opacity-50 cursor-not-allowed'
          }`}
        >
          <span className="text-cyan-400 font-mono text-xs">U KEY (50% NRG)</span>
          <span>SPECIAL BLAST</span>
        </button>

        <button
          onClick={() => {
            soundManager.playMenuClick();
            setP1Action(p1Action === 'block' ? 'idle' : 'block');
          }}
          disabled={matchOver}
          className={`py-4 rounded-2xl border font-bold text-sm tracking-wider transition-all flex flex-col items-center gap-1 shadow-lg ${
            p1Action === 'block'
              ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <span className="text-emerald-400 font-mono text-xs">L KEY</span>
          <span>{p1Action === 'block' ? 'BLOCKING ACTIVE' : 'GUARD BLOCK'}</span>
        </button>
      </div>
    </div>
  );
};
