export type GameMode = 'arcade' | 'versus' | 'training';

export type AppTab = 'arena' | 'select' | 'creator' | 'kivy' | 'checklist';

export interface Fighter {
  id: string;
  name: string;
  title: string;
  element: string;
  health: number;
  attackPower: number;
  speed: number;
  specialMoveName: string;
  specialMoveDesc: string;
  bio: string;
  image: string;
  color: string;
  isCustom?: boolean;
}

export type FighterAction = 'idle' | 'walk' | 'punch' | 'kick' | 'special' | 'block' | 'hit' | 'win' | 'ko';
