/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GameMode = 'single' | 'duel';

export type CharacterType = 'gor' | 'gayane';

export interface PlayerState {
  score: number;
  streak: number;
  answersCount: number;
  correctAnswersCount: number;
}

export interface CharacterDetail {
  id: CharacterType;
  name: string; // "Գոռ" or "Գայանե"
  avatar: string; // Emoji or visual representation
  color: string; // Tailwind color class for borders/text
  bgPattern: string; // Tailwind background gradient/patterns
  description: string; // Armenian character description
  victoryPhrase: string; // Victory phrase in Armenian
  lossPhrase: string; // Playful failure/loss phrase in Armenian
}

export interface ConjugationQuestion {
  verb: string;
  translation: string;
  pronoun: string;
  pronounTranslation: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
}

export interface IrregularVerbPair {
  infinitive: string;
  armenian: string;
  stem: string;
  example: string;
}

export interface DialogueBubble {
  id: number;
  character: CharacterType;
  armenianText: string;
  spanishTemplate: string; // e.g., "Mañana yo {blank} en mi casa."
  correctAnswer: string;
  options: string[];
  currentSelected?: string | null;
  explanation: string;
}

export interface SpeedQuestion {
  spanishVerb: string;
  armenianMeaning: string;
  isCorrect: boolean;
  explanation: string;
}

export interface TranslationQuestion {
  armenianSentence: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
}

export interface GameDefinition {
  id: number;
  titleArm: string;
  titleSpan: string;
  descriptionArm: string;
  icon: string;
  accentColor: string;
}
