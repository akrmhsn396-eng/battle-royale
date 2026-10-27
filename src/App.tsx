import React, { useState } from 'react';
import { Fighter, GameMode, AppTab } from './types';
import { DEFAULT_FIGHTERS } from './data/fighters';
import { Navbar } from './components/Navbar';
import { CharacterSelect } from './components/CharacterSelect';
import { ArcadeArena } from './components/ArcadeArena';
import { AIFighterCreator } from './components/AIFighterCreator';
import { PythonKivyExplorer } from './components/PythonKivyExplorer';
import { DeploymentChecklist } from './components/DeploymentChecklist';

export default function App() {
  const [currentTab, setTab] = useState<AppTab>('select');
  const [fighters, setFighters] = useState<Fighter[]>(DEFAULT_FIGHTERS);
  const [selectedFighter, setSelectedFighter] = useState<Fighter>(DEFAULT_FIGHTERS[0]);
  const [opponentFighter, setOpponentFighter] = useState<Fighter>(DEFAULT_FIGHTERS[1]);
  const [gameMode, setGameMode] = useState<GameMode>('arcade');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const handleAddFighter = (newFighter: Fighter) => {
    setFighters((prev) => [newFighter, ...prev]);
    setSelectedFighter(newFighter);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      <Navbar
        currentTab={currentTab}
        setTab={setTab}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      <main className="flex-1 pb-16">
        {currentTab === 'select' && (
          <CharacterSelect
            fighters={fighters}
            selectedFighter={selectedFighter}
            setSelectedFighter={setSelectedFighter}
            opponentFighter={opponentFighter}
            setOpponentFighter={setOpponentFighter}
            gameMode={gameMode}
            setGameMode={setGameMode}
            setTab={setTab}
          />
        )}

        {currentTab === 'arena' && (
          <ArcadeArena
            player1={selectedFighter}
            fighters={fighters}
            gameMode={gameMode}
            onReturnToSelect={() => setTab('select')}
          />
        )}

        {currentTab === 'creator' && (
          <AIFighterCreator
            onAddFighter={handleAddFighter}
            setTab={setTab}
          />
        )}

        {currentTab === 'kivy' && (
          <PythonKivyExplorer />
        )}

        {currentTab === 'checklist' && (
          <DeploymentChecklist />
        )}
      </main>
    </div>
  );
}
