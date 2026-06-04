/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  GameMode,
  CharacterType,
  PlayerState,
  ConjugationQuestion,
  IrregularVerbPair,
  DialogueBubble,
  SpeedQuestion,
  TranslationQuestion
} from './types';
import {
  CHARACTERS,
  GAMES,
  CONJUGATION_QUESTIONS,
  IRREGULAR_VERBS,
  DIALOGUE_BUBBLES,
  SPEED_QUESTIONS,
  TRANSLATION_QUESTIONS
} from './data';
import {
  Trophy,
  Volume2,
  VolumeX,
  Home,
  BookOpen,
  Users,
  User,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Clock,
  Sparkles,
  Smile,
  HelpCircle,
  ChevronRight,
  Undo,
  Gamepad2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from './SoundManager';
import GrammarGuide from './GrammarGuide';
import ConfettiVisualizer from './ConfettiVisualizer';

export default function App() {
  // Navigation & Core States
  // Screen sequence: 'welcome' | 'char_select' | 'hub' | 'play' | 'final'
  const [screen, setScreen] = useState<'welcome' | 'char_select' | 'hub' | 'play' | 'final'>('welcome');
  const [gameMode, setGameMode] = useState<GameMode>('single');
  const [playerChar, setPlayerChar] = useState<CharacterType>('gor'); // Selected character for single mode
  const [activeGameId, setActiveGameId] = useState<number | null>(null);

  // Scores State (Persistent during session)
  const [gorState, setGorState] = useState<PlayerState>({
    score: 0,
    streak: 0,
    answersCount: 0,
    correctAnswersCount: 0,
  });

  const [gayaneState, setGayaneState] = useState<PlayerState>({
    score: 0,
    streak: 0,
    answersCount: 0,
    correctAnswersCount: 0,
  });

  // Global settings
  const [soundOn, setSoundOn] = useState(true);
  const [showGrammarModal, setShowGrammarModal] = useState(false);
  const [completedGames, setCompletedGames] = useState<number[]>([]);

  // Current Game Play States
  const [currentRound, setCurrentRound] = useState(0);
  const [activeTurn, setActiveTurn] = useState<CharacterType>('gor'); // Tracks whose turn it is to answer (used in both Single and Duel)
  const [isAiAnswering, setIsAiAnswering] = useState(false);
  const [aiSpeech, setAiSpeech] = useState<string>('');
  
  // Game Question States
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [gameScoreGor, setGameScoreGor] = useState(0); // Tracks current game score for validation page
  const [gameScoreGayane, setGameScoreGayane] = useState(0);

  // Match Game (Game 3) Specific local states
  const [selectedInfinitive, setSelectedInfinitive] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]); // infinitives that have been matched
  const [wrongMatch, setWrongMatch] = useState<string | null>(null); // visual feedback for error
  const [game3RoundPairs, setGame3RoundPairs] = useState<IrregularVerbPair[]>([]);

  // Speed Game (Game 5) Specific local states (Timer)
  const [timeLeft, setTimeLeft] = useState(10);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sentence Architect (Game 6) Specific local states
  const [assembledWords, setAssembledWords] = useState<string[]>([]);

  // Sound preference coordination
  useEffect(() => {
    sound.toggleSound(soundOn);
  }, [soundOn]);

  // Track leader
  const leader = useMemo(() => {
    if (gorState.score > gayaneState.score) return 'gor';
    if (gayaneState.score > gorState.score) return 'gayane';
    return null; // Tie
  }, [gorState.score, gayaneState.score]);

  // Game initialization helper
  const handleStartGame = (gameId: number) => {
    sound.playClick();
    setActiveGameId(gameId);
    setCurrentRound(0);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setAssembledWords([]);
    setMatchedPairs([]);
    setSelectedInfinitive(null);
    setGameScoreGor(0);
    setGameScoreGayane(0);
    
    // In single player, activeTurn is always playerChar on first round.
    // In duel player, Gor starts.
    const startingTurn: CharacterType = gameMode === 'single' ? playerChar : 'gor';
    setActiveTurn(startingTurn);
    setIsAiAnswering(false);
    setAiSpeech('');

    // Pre-process Game 3 Match-Up pairs (pick 4 random verbs)
    if (gameId === 3) {
      const shuffled = [...IRREGULAR_VERBS].sort(() => 0.5 - Math.random());
      setGame3RoundPairs(shuffled.slice(0, 4));
    }

    // Trigger timer for Game 5
    if (gameId === 5) {
      startSpeedTimer();
    }

    setScreen('play');
  };

  // Speed timer code
  const startSpeedTimer = () => {
    setTimeLeft(10);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          // Timer ran out, trigger automatically incorrect action
          handleSelectOption('', false); // Empty string represents timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Trigger automated AI turn in Single Player mode
  useEffect(() => {
    if (screen === 'play' && gameMode === 'single' && activeTurn !== playerChar && !isAnswerRevealed && !isAiAnswering) {
      setIsAiAnswering(true);
      
      // Funny text bubbles representing the AI thinking
      const thinkingPhrases = [
        `${CHARACTERS[activeTurn].name}-ը խորասուզվում է քերականության աղյուսակի մեջ...`,
        `${CHARACTERS[activeTurn].name}-ը փնտրում է անկանոն բայի հիմքը իր գրքում...`,
        `${CHARACTERS[activeTurn].name}-ը ժպտում է և պատրաստվում պատասխանել...`,
        `${CHARACTERS[activeTurn].name}-ը վստահորեն գրում է իսպաներեն թարգմանությունը...`
      ];
      setAiSpeech(thinkingPhrases[Math.floor(Math.random() * thinkingPhrases.length)]);

      const timer = setTimeout(() => {
        // AI selects their answer
        let answerToCore = '';
        let isCorrectChoice = false;

        // 80% chance of correct answer, 20% wrong
        const rollSuccess = Math.random() < 0.8;

        if (activeGameId === 3) {
          // AI wants to find a match in Game 3!
          // Find unmatched infinitives
          const unmatchedInfinitiveList = game3RoundPairs
            .map((v) => v.infinitive)
            .filter((inf) => !matchedPairs.includes(inf));
          
          if (unmatchedInfinitiveList.length > 0) {
            const infinitiveToMatch = unmatchedInfinitiveList[Math.floor(Math.random() * unmatchedInfinitiveList.length)];
            const pair = game3RoundPairs.find((v) => v.infinitive === infinitiveToMatch)!;
            
            // Set selectedInfinitive first (simulate clicking)
            setSelectedInfinitive(infinitiveToMatch);
            sound.playClick();
            
            // In a timeout, do the stem click
            setTimeout(() => {
              const stemsLeft = game3RoundPairs
                .filter((v) => !matchedPairs.includes(v.infinitive))
                .map((v) => v.stem);
              
              let stemToClick = pair.stem;
              if (!rollSuccess && stemsLeft.length > 1) {
                const wrongStems = stemsLeft.filter((s) => s !== pair.stem);
                stemToClick = wrongStems[Math.floor(Math.random() * wrongStems.length)];
              }
              
              setIsAiAnswering(false);
              setAiSpeech(`Կարծում եմ՝ "${infinitiveToMatch}"-ի հիմքն է "${stemToClick}"-ը:`);
              handleGame3StemClick(stemToClick);
            }, 800);
          } else {
            setIsAiAnswering(false);
          }
          return;
        }

        if (activeGameId === 1) {
          const q = CONJUGATION_QUESTIONS[currentRound % CONJUGATION_QUESTIONS.length];
          answerToCore = rollSuccess ? q.correctAnswer : q.options.find((o) => o !== q.correctAnswer) || q.options[0];
          isCorrectChoice = answerToCore === q.correctAnswer;
        } else if (activeGameId === 4) {
          const q = DIALOGUE_BUBBLES[currentRound % DIALOGUE_BUBBLES.length];
          answerToCore = rollSuccess ? q.correctAnswer : q.options.find((o) => o !== q.correctAnswer) || q.options[0];
          isCorrectChoice = answerToCore === q.correctAnswer;
        } else if (activeGameId === 5) {
          const q = SPEED_QUESTIONS[currentRound % SPEED_QUESTIONS.length];
          // For speed yes/no, option is TRUE check
          answerToCore = rollSuccess ? (q.isCorrect ? 'yes' : 'no') : (q.isCorrect ? 'no' : 'yes');
          isCorrectChoice = (answerToCore === 'yes' && q.isCorrect) || (answerToCore === 'no' && !q.isCorrect);
        } else if (activeGameId === 6) {
          const q = TRANSLATION_QUESTIONS[currentRound % TRANSLATION_QUESTIONS.length];
          answerToCore = rollSuccess ? q.correctAnswer : q.options.find((o) => o !== q.correctAnswer) || q.options[0];
          isCorrectChoice = answerToCore === q.correctAnswer;
        }

        setIsAiAnswering(false);
        setAiSpeech(rollSuccess 
          ? `¡Creo que es "${activeGameId === 5 ? (answerToCore === 'yes' ? 'Ճիշտ է' : 'Սխալ է') : answerToCore}"! Easy peasy!` 
          : 'Oops, ¡tal vez esta opción!'
        );
        handleSelectOption(answerToCore, isCorrectChoice);
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, [screen, activeTurn, currentRound, activeGameId, gameMode, selectedInfinitive, game3RoundPairs, matchedPairs]);

  // Handle selecting answer
  const handleSelectOption = (optionValue: string, isCorrectOverride?: boolean) => {
    if (isAnswerRevealed) return;

    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedOption(optionValue);
    
    let isCorrect = false;
    if (isCorrectOverride !== undefined) {
      isCorrect = isCorrectOverride;
    } else {
      // Manual check based on game type
      if (activeGameId === 1) {
        isCorrect = optionValue === CONJUGATION_QUESTIONS[currentRound % CONJUGATION_QUESTIONS.length].correctAnswer;
      } else if (activeGameId === 4) {
        isCorrect = optionValue === DIALOGUE_BUBBLES[currentRound % DIALOGUE_BUBBLES.length].correctAnswer;
      } else if (activeGameId === 5) {
        const q = SPEED_QUESTIONS[currentRound % SPEED_QUESTIONS.length];
        isCorrect = (optionValue === 'yes' && q.isCorrect) || (optionValue === 'no' && !q.isCorrect);
      } else if (activeGameId === 6) {
        isCorrect = optionValue === TRANSLATION_QUESTIONS[currentRound % TRANSLATION_QUESTIONS.length].correctAnswer;
      }
    }

    setIsAnswerCorrect(isCorrect);
    setIsAnswerRevealed(true);

    if (isCorrect) {
      sound.playCorrect();
      // Add scores to active turn player
      updatePlayerScore(activeTurn, true);
    } else {
      sound.playWrong();
      updatePlayerScore(activeTurn, false);
    }
  };

  // Helper for matching irregular pairs in Game 3
  const handleGame3InfinitiveClick = (infinitive: string) => {
    if (isAnswerRevealed || matchedPairs.includes(infinitive)) return;
    sound.playClick();
    setSelectedInfinitive(infinitive);
  };

  const handleGame3StemClick = (stem: string) => {
    if (!selectedInfinitive || isAnswerRevealed) return;

    const findMatch = game3RoundPairs.find((v) => v.infinitive === selectedInfinitive);
    if (findMatch && findMatch.stem === stem) {
      sound.playCorrect();
      const updatedMatches = [...matchedPairs, selectedInfinitive];
      setMatchedPairs(updatedMatches);
      setSelectedInfinitive(null);

      // Give points to the individual player who found this match!
      updatePlayerScore(activeTurn, true);

      // Check if all 4 matched
      if (updatedMatches.length === game3RoundPairs.length) {
        setIsAnswerCorrect(true);
        setIsAnswerRevealed(true);
      } else {
        // Switch turn to the other player!
        setActiveTurn((prev) => (prev === 'gor' ? 'gayane' : 'gor'));
      }
    } else {
      sound.playWrong();
      setWrongMatch(stem);
      setTimeout(() => {
        setWrongMatch(null);
        setSelectedInfinitive(null);
        // Mismatch switches turn too!
        setActiveTurn((prev) => (prev === 'gor' ? 'gayane' : 'gor'));
      }, 700);
    }
  };

  // State rating logic
  const updatePlayerScore = (player: CharacterType, correct: boolean) => {
    const scoreAddValue = correct ? 100 : 0;
    
    if (player === 'gor') {
      setGorState((prev) => ({
        score: prev.score + scoreAddValue,
        streak: correct ? prev.streak + 1 : 0,
        answersCount: prev.answersCount + 1,
        correctAnswersCount: prev.correctAnswersCount + (correct ? 1 : 0),
      }));
      if (correct) setGameScoreGor((prev) => prev + 100);
    } else {
      setGayaneState((prev) => ({
        score: prev.score + scoreAddValue,
        streak: correct ? prev.streak + 1 : 0,
        answersCount: prev.answersCount + 1,
        correctAnswersCount: prev.correctAnswersCount + (correct ? 1 : 0),
      }));
      if (correct) setGameScoreGayane((prev) => prev + 100);
    }
  };

  // Move forward in game loop
  const handleNextRound = () => {
    sound.playClick();
    setIsAnswerRevealed(false);
    setIsAnswerCorrect(false);
    setSelectedOption(null);
    setAssembledWords([]);

    // We do 20 rounds for a complete game
    const totalRoundsCount = 20;

    if (currentRound + 1 >= totalRoundsCount) {
      // Game over for this game! Add to completed games
      if (activeGameId !== null && !completedGames.includes(activeGameId)) {
        setCompletedGames([...completedGames, activeGameId]);
      }
      sound.playLevelUp();
      
      // If all games are done, go to final screen, otherwise return to list
      if (completedGames.length + 1 >= GAMES.length) {
        setScreen('final');
      } else {
        setScreen('hub');
      }
    } else {
      setCurrentRound((prev) => prev + 1);
      
      // In duel mode, alternate turn.
      // In single-player mode, alternate turn so the player and AI take turns answering!
      setActiveTurn((prev) => (prev === 'gor' ? 'gayane' : 'gor'));

      // If next is Speed YES/NO game, reset the timer!
      if (activeGameId === 5) {
        startSpeedTimer();
      }

      // Re-shuffle Game 3 pairs just in case
      if (activeGameId === 3) {
        const shuffled = [...IRREGULAR_VERBS].sort(() => 0.5 - Math.random());
        setGame3RoundPairs(shuffled.slice(0, 4));
        setMatchedPairs([]);
        setSelectedInfinitive(null);
      }
    }
  };

  // Reset total championship
  const handleResetSession = () => {
    sound.playClick();
    setGorState({ score: 0, streak: 0, answersCount: 0, correctAnswersCount: 0 });
    setGayaneState({ score: 0, streak: 0, answersCount: 0, correctAnswersCount: 0 });
    setCompletedGames([]);
    setScreen('welcome');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 flex flex-col justify-between relative overflow-x-hidden">
      
      {/* Background Visual Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl -z-10" />

      {/* Persistent Beautiful Top Bar */}
      <header className="bg-indigo-600 text-white min-h-[5rem] flex items-center py-4 px-6 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => {
              sound.playClick();
              setScreen('welcome');
            }}
            id="logo-home-btn"
            className="flex items-center gap-4 cursor-pointer group"
          >
            <div className="bg-white/20 p-2.5 rounded-lg text-xs font-black tracking-widest text-white shadow-inner group-hover:scale-105 transition-all uppercase">
              ARM ↔ ESP
            </div>
            <div className="text-left">
              <span className="text-[10px] font-black tracking-wider text-amber-300 uppercase">Իսպաներենի Ապառնի</span>
              <h1 className="text-lg font-black tracking-tight text-white uppercase font-sans">DUELO DE FUTURO</h1>
            </div>
          </button>

          {/* Core score overlay header */}
          {screen !== 'welcome' && (
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl">
              <div className="flex items-center gap-2">
                <span className="text-lg">👦🏻</span>
                <span className="text-xs font-bold text-white/95">Գոռ`</span>
                <span className="text-sm font-black text-amber-300 font-mono">{gorState.score}</span>
                {leader === 'gor' && <Trophy size={14} className="text-amber-300 animate-bounce" />}
              </div>
              <div className="h-4 w-[1px] bg-white/20" />
              <div className="flex items-center gap-2">
                <span className="text-lg">👧🏻</span>
                <span className="text-xs font-bold text-white/95">Գայանե`</span>
                <span className="text-sm font-black text-rose-300 font-mono">{gayaneState.score}</span>
                {leader === 'gayane' && <Trophy size={14} className="text-amber-300 animate-bounce" />}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:block bg-amber-400 text-indigo-900 px-4 py-1.5 rounded-full font-black text-xs self-center tracking-widest uppercase">
              COMPETICIÓN EN VIVO
            </div>
            
            <button
              onClick={() => {
                sound.playClick();
                setShowGrammarModal(true);
              }}
              id="top-grammar-guide-btn"
              className="px-4 py-2 rounded-xl text-xs font-black text-indigo-950 bg-amber-400 hover:bg-amber-305 cursor-pointer transition-all flex items-center gap-1.5 shadow-sm"
            >
              <BookOpen size={14} />
              <span>Կանոններ</span>
            </button>

            <button
              onClick={handleResetSession}
              id="top-reset-btn"
              className="px-4 py-2 rounded-xl text-xs font-black text-white bg-rose-600 hover:bg-rose-700 cursor-pointer transition-all flex items-center gap-1.5 shadow-sm"
              title="Սկսել նորից (Сброс)"
            >
              <RefreshCw size={14} />
              <span>Սկսել նորից / Reset</span>
            </button>

            <button
              onClick={() => setSoundOn(!soundOn)}
              id="top-audio-toggle"
              className="p-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 cursor-pointer transition-all"
              title="Ձայնային էֆեկտներ"
            >
              {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Area */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex-1 w-full flex flex-col justify-center">
        
        <AnimatePresence mode="wait">

          {/* SCREEN 1: Welcome Screen */}
          {screen === 'welcome' && (
            <motion.div
              key="welcome-screen"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-4"
            >
              {/* Marketing & Explanations side */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 bg-[#F2F4FF] border-2 border-indigo-250 px-4 py-2 rounded-full text-xs font-black text-indigo-800 uppercase tracking-widest shadow-sm">
                  <Sparkles size={14} className="text-indigo-600 animate-pulse" />
                  <span>Ինտերակտիվ Իսպաներեն Խաղ-Մրցույթ</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none uppercase">
                  Սովորենք <br className="hidden md:block" />
                  <span className="bg-gradient-to-r from-indigo-600 via-sky-500 to-rose-600 bg-clip-text text-transparent">
                    Ապառնի Ժամանակը
                  </span>
                </h1>

                <p className="text-slate-650 text-base md:text-lg leading-relaxed max-w-xl font-medium">
                  Խաղացեք Գոռի և Գայանեի հետ իսպաներենի ապառնի ժամանակի (<span className="font-mono bg-amber-400 text-indigo-950 px-2 py-0.5 rounded-md font-black text-sm">Tiempo Futuro</span>) 6 յուրահատուկ խաղերը։ Մրցե՛ք ընկերոջ հետ կամ խաղացեք սմարթֆոնի խելացի AI համակարգի դեմ:
                </p>

                {/* Character previews */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Gor Preview Card styled exactly like Vibrant Palette */}
                  <div className="bg-sky-100 rounded-3xl border-b-8 border-sky-300 p-5 flex gap-4 shadow-md items-center">
                    <div className="w-16 h-16 bg-white rounded-full border-4 border-sky-400 overflow-hidden flex items-center justify-center text-3xl font-bold text-sky-600 shrink-0 shadow-inner">
                      👦🏻
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sky-900 flex items-center gap-1.5">
                        {CHARACTERS.gor.name}
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-black bg-sky-200 text-sky-850 tracking-wider">
                          ԱՐԿԱԾԱՅԻՆ
                        </span>
                      </h3>
                      <p className="text-xs text-sky-900 mt-1 line-clamp-2 leading-relaxed font-semibold">{CHARACTERS.gor.description}</p>
                    </div>
                  </div>

                  {/* Gayane Preview Card styled exactly like Vibrant Palette */}
                  <div className="bg-rose-100 rounded-3xl border-b-8 border-rose-300 p-5 flex gap-4 shadow-md items-center">
                    <div className="w-16 h-16 bg-white rounded-full border-4 border-rose-400 overflow-hidden flex items-center justify-center text-3xl font-bold text-rose-600 shrink-0 shadow-inner">
                      👧🏻
                    </div>
                    <div>
                      <h3 className="font-extrabold text-rose-900 flex items-center gap-1.5">
                        {CHARACTERS.gayane.name}
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-black bg-rose-200 text-rose-850 tracking-wider">
                          ԳԻՏԱԿ
                        </span>
                      </h3>
                      <p className="text-xs text-rose-900 mt-1 line-clamp-2 leading-relaxed font-semibold">{CHARACTERS.gayane.description}</p>
                    </div>
                  </div>
                </div>

                {/* Game mode selectors */}
                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setGameMode('single');
                      setScreen('char_select');
                    }}
                    id="welcome-single-mode-btn"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-6 rounded-2xl shadow-xl hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-3 group text-center"
                  >
                    <User className="w-5 h-5 group-hover:scale-110 transition-transform text-amber-350" />
                    <div>
                      <span className="block text-[10px] tracking-wider text-indigo-200 uppercase font-black">Խաղալ AI-ի դեմ</span>
                      <span className="text-sm font-sans uppercase">Մեկ Խաղացող</span>
                    </div>
                    <ArrowRight size={16} className="text-amber-350" />
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick();
                      setGameMode('duel');
                      setScreen('hub');
                    }}
                    id="welcome-duel-mode-btn"
                    className="flex-1 bg-white border-4 border-indigo-100 text-slate-800 hover:border-indigo-400 font-black py-4 px-6 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-3 text-center hover:scale-[1.01]"
                  >
                    <Users className="w-5 h-5 text-indigo-600" />
                    <div>
                      <span className="block text-[10px] tracking-wider text-slate-400 font-extrabold uppercase">PASS-AND-PLAY</span>
                      <span className="text-sm font-sans uppercase text-indigo-900">Դուել (2 Խաղացող)</span>
                    </div>
                    <ChevronRight size={16} className="text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Grammar quick preview side */}
              <div className="lg:col-span-5 bg-white rounded-[2.5rem] shadow-xl border-4 border-indigo-100 p-6 space-y-5 relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-2 rounded-full font-black text-xs uppercase shadow-lg tracking-widest">
                  ԿԱՆՈՆՆԵՐԻ ՈՒՂԵՑՈՒՅՑ
                </div>
                
                <div className="pt-4 flex items-center justify-between">
                  <h3 className="font-black text-indigo-950 flex items-center gap-2">
                    <BookOpen size={18} className="text-indigo-605" />
                    Ապառնիի Կանոնակարգը
                  </h3>
                  <span className="text-xs bg-amber-405 text-indigo-900 font-mono font-bold px-2 py-0.5 rounded-full">El Futuro Simple</span>
                </div>

                <div className="space-y-4 text-xs text-slate-700 leading-relaxed font-semibold">
                  <p className="bg-sky-100 text-sky-950 p-4 rounded-xl border border-sky-200/50">
                    💡 Իսպաներենում ապառնի ժամանակը շատ պարզ է. վերջավորությունները ավելացնում ենք <strong className="text-sky-950 font-black">ուղղակի անորոշ բային</strong>։
                  </p>
                  <p className="bg-rose-100 text-rose-950 p-4 rounded-xl border border-rose-200/50">
                    🎯 <strong className="text-rose-955">Օրինակ՝</strong> <code className="font-mono font-bold text-amber-950">cantar</code> (երգել) + <code className="font-mono font-bold text-indigo-900">-é</code> = <strong className="font-mono bg-amber-300 text-indigo-955 px-1.5 py-0.5 rounded-md font-black">cantaré</strong> (Ես կերգեմ)։
                  </p>
                  <p className="bg-amber-50 text-amber-850 p-4 rounded-xl border border-amber-200/50">
                    ⚔️ Որոշ բայեր ապառնիում ունեն փոխված հիմքեր, օրինակ՝ <code className="font-mono font-bold text-slate-800">hacer</code>-ը դառնում է <code className="font-mono text-indigo-900 font-bold">har-</code> (haré, harás):
                  </p>
                </div>
              </div>
            </motion.div>
          )}
          {screen === 'char_select' && (
            <motion.div
              key="char-select-screen"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="max-w-2xl mx-auto space-y-6 text-center py-6"
            >
              <div>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-200">
                  Կերպարի Ընտրություն
                </span>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-4 uppercase">Ո՞ւմ անունից ես ցանկանում խաղալ:</h2>
                <p className="text-slate-600 text-sm mt-1 max-w-lg mx-auto font-medium">
                  Ընտրիր քո կերպարը: Մյուս կերպարը կդառնա քո AI մրցակիցը, ով խաղի ընթացքում զուգահեռ կպատասխանի հարցերին:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                {Object.values(CHARACTERS).map((char) => {
                  const isSelected = playerChar === char.id;
                  const isGor = char.id === 'gor';
                  return (
                    <button
                      key={char.id}
                      onClick={() => {
                        sound.playClick();
                        setPlayerChar(char.id);
                      }}
                      id={`char-select-${char.id}`}
                      className={`text-left rounded-[2rem] p-6 border-4 transition-all cursor-pointer relative flex flex-col justify-between h-72 shadow-md ${
                        isSelected
                          ? `border-indigo-600 ${isGor ? 'bg-sky-50 shadow-sky-100 ring-4 ring-sky-300/30' : 'bg-rose-50 shadow-rose-100 ring-4 ring-rose-300/30'} scale-[1.01]`
                          : `border-indigo-100 bg-white hover:border-indigo-300 hover:scale-[1.005]`
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-4 right-4 bg-indigo-600 text-white rounded-full p-1.5 w-8 h-8 flex items-center justify-center text-xs font-black shadow-md">
                          ✓
                        </div>
                      )}
                      
                      <div>
                        <div className={`text-5xl mb-4 p-3 rounded-2xl w-fit ${isGor ? 'bg-sky-100/80 border border-sky-200' : 'bg-rose-100/80 border border-rose-200'}`}>
                          {char.avatar}
                        </div>
                        <h3 className={`text-xl font-black ${isGor ? 'text-sky-900' : 'text-rose-900'}`}>{char.name}</h3>
                        <p className={`text-xs mt-2 leading-relaxed font-semibold ${isGor ? 'text-sky-800' : 'text-rose-800'}`}>{char.description}</p>
                      </div>

                      <div className="border-t border-slate-100 pt-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 italic">
                        « {char.victoryPhrase} »
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-6 flex items-center justify-between">
                <button
                  onClick={() => {
                    sound.playClick();
                    setScreen('welcome');
                  }}
                  id="char-select-back"
                  className="px-6 py-3 border-2 border-slate-200 text-slate-600 rounded-xl font-black text-xs uppercase cursor-pointer hover:bg-slate-50 transition-all"
                >
                  Հետ
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    setScreen('hub');
                  }}
                  id="char-select-confirm"
                  className="px-8 py-3 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl font-black text-xs uppercase cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-indigo-600/10"
                >
                  Սկսել Մրցաշարը
                </button>
              </div>
            </motion.div>
          )}

          {/* SCREEN 3: Games Hub */}
          {screen === 'hub' && (
            <motion.div
              key="hub-screen"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8 py-4"
            >
              {/* Score header widgets */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Gor Card styled in Sky Blue */}
                <div className={`p-6 rounded-[2rem] border-b-8 shadow-md flex items-center justify-between transition-all bg-sky-100 border-sky-300 text-sky-950 relative overflow-hidden`}>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white rounded-full border-4 border-sky-400 overflow-hidden flex items-center justify-center text-2xl shadow-inner shrink-0">
                      👦🏻
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sky-900 flex items-center gap-1.5 flex-wrap">
                        Գոռ
                        {leader === 'gor' && <span className="bg-amber-300 text-indigo-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">ԱՌԱՋԱՏԱՐ ⭐</span>}
                        {gameMode === 'single' && playerChar === 'gor' && <span className="text-[9px] bg-sky-200 text-sky-900 font-extrabold px-1.5 py-0.5 rounded">ԴՈՒ</span>}
                        {gameMode === 'single' && playerChar === 'gayane' && <span className="text-[9px] bg-rose-200 text-rose-900 font-extrabold px-1.5 py-0.5 rounded">BOT AI</span>}
                      </h3>
                      <div className="text-[10px] text-sky-800 font-black mt-1 uppercase tracking-wider">Արդյունավետություն՝ {gorState.answersCount > 0 ? Math.round((gorState.correctAnswersCount / gorState.answersCount) * 100) : 0}%</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-3xl font-black font-sans text-sky-950">{gorState.score}</div>
                    <span className="text-[10px] text-sky-800 block uppercase font-black tracking-wider">միավոր</span>
                  </div>
                </div>

                {/* Score Ratio Gauge styled beautifully */}
                <div className="bg-white border-4 border-indigo-150 p-6 rounded-[2rem] shadow-md text-center flex flex-col justify-between relative overflow-hidden">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#6366F1] font-black block">Ընդհանուր Մրցակցություն</span>
                    <h3 className="text-xs font-black text-slate-700 mt-1 uppercase">Ապակտիվացված խաղեր՝ {completedGames.length} / 6</h3>
                  </div>
                  
                  {/* Gauge ratio bar */}
                  <div className="my-4">
                    <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex border border-indigo-100 shadow-inner">
                      <div
                        className="bg-sky-400 h-full transition-all duration-500"
                        style={{
                          width: `${
                            gorState.score + gayaneState.score > 0
                              ? (gorState.score / (gorState.score + gayaneState.score)) * 100
                              : 50
                          }%`,
                        }}
                      />
                      <div
                        className="bg-rose-400 h-full transition-all duration-500"
                        style={{
                          width: `${
                            gorState.score + gayaneState.score > 0
                              ? (gayaneState.score / (gorState.score + gayaneState.score)) * 100
                              : 50
                          }%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-indigo-900 font-sans mt-2 font-black uppercase tracking-wider">
                      <span className="text-sky-650">Գոռ ({gorState.score + gayaneState.score > 0 ? Math.round((gorState.score / (gorState.score + gayaneState.score)) * 100) : 50}%)</span>
                      <span className="text-rose-650">Գայանե ({gorState.score + gayaneState.score > 0 ? Math.round((gayaneState.score / (gorState.score + gayaneState.score)) * 100) : 50}%)</span>
                    </div>
                  </div>
                </div>

                {/* Gayane Card styled in Rose Pink */}
                <div className={`p-6 rounded-[2rem] border-b-8 shadow-md flex items-center justify-between transition-all bg-rose-100 border-rose-300 text-rose-950 relative overflow-hidden`}>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white rounded-full border-4 border-rose-400 overflow-hidden flex items-center justify-center text-2xl shadow-inner shrink-0">
                      👧🏻
                    </div>
                    <div>
                      <h3 className="font-extrabold text-rose-900 flex items-center gap-1.5 flex-wrap">
                        Գայանե
                        {leader === 'gayane' && <span className="bg-amber-300 text-indigo-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">ԱՌԱՋԱՏԱՐ ⭐</span>}
                        {gameMode === 'single' && playerChar === 'gayane' && <span className="text-[9px] bg-rose-200 text-rose-900 font-extrabold px-1.5 py-0.5 rounded">ԴՈՒ</span>}
                        {gameMode === 'single' && playerChar === 'gor' && <span className="text-[9px] bg-sky-200 text-sky-900 font-extrabold px-1.5 py-0.5 rounded">BOT AI</span>}
                      </h3>
                      <div className="text-[10px] text-rose-800 font-black mt-1 uppercase tracking-wider">Արդյունավետություն՝ {gayaneState.answersCount > 0 ? Math.round((gayaneState.correctAnswersCount / gayaneState.answersCount) * 100) : 0}%</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-3xl font-black font-sans text-rose-950">{gayaneState.score}</div>
                    <span className="text-[10px] text-rose-800 block uppercase font-black tracking-wider">միավոր</span>
                  </div>
                </div>
              </div>

              {/* Game list section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tight">
                    <Gamepad2 className="text-indigo-600 w-8 h-8" />
                    Մրցաշարի {GAMES.length} Խաղերը
                  </h2>
                  <span className="text-xs font-black uppercase tracking-widest text-[#6366F1] bg-[#EEF2FF] px-3 py-1.5 rounded-full border border-indigo-100 shadow-xs">Կիսվիր և մրցիր</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {GAMES.map((game, index) => {
                    const isDone = completedGames.includes(game.id);
                    return (
                      <div
                        key={game.id}
                        className={`bg-white border-4 rounded-[2.5rem] p-6 shadow-md hover:shadow-lg transition-all flex flex-col justify-between group relative overflow-hidden ${
                          isDone ? 'border-emerald-300 bg-emerald-50/10' : 'border-indigo-100'
                        }`}
                      >
                        {isDone && (
                          <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-bl-2xl flex items-center gap-1 shadow-sm">
                            ՀԱՆՁՆՎԱԾ ✓
                          </div>
                        )}

                        <div className="space-y-4">
                          <div className={`text-4xl p-3.5 rounded-2xl w-fit group-hover:scale-105 transition-transform border ${isDone ? 'bg-emerald-100 border-emerald-200 text-emerald-700' : 'bg-indigo-50 border-indigo-100 text-indigo-705'}`}>
                            {game.icon}
                          </div>
                          <div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-550 block font-mono">
                              ԽԱՂ {index + 1} • {game.titleSpan}
                            </span>
                            <h3 className="text-lg font-black text-slate-900 mt-1 uppercase tracking-tight">{game.titleArm}</h3>
                            <p className="text-xs text-slate-600 mt-2 leading-relaxed font-semibold">{game.descriptionArm}</p>
                          </div>
                        </div>

                        <div className="pt-5 mt-5 border-t border-indigo-50 flex items-center justify-between gap-2">
                          <span className="text-[10px] font-black text-[#6366F1] uppercase tracking-wider bg-[#EEF2FF] px-2.5 py-1 rounded-md">
                            {gameMode === 'single' ? 'Մենախաղ + AI' : '2-Player Դուել'}
                          </span>
                          <button
                            onClick={() => handleStartGame(game.id)}
                            id={`start-game-${game.id}`}
                            className={`px-5 py-3 rounded-xl font-black text-xs cursor-pointer uppercase transition-all flex items-center gap-1.5 ${
                              isDone
                                ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300 hover:bg-emerald-200 font-extrabold shadow-sm'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/10'
                            }`}
                          >
                            <span>{isDone ? 'Կրկնել' : 'Խաղալ'}</span>
                            <ArrowRight size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Navigation help controls */}
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-indigo-100">
                <button
                  onClick={handleResetSession}
                  id="hub-to-welcome-btn"
                  className="px-6 py-3.5 border-2 border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-xl font-black text-xs flex items-center gap-2 cursor-pointer uppercase"
                >
                  <Home size={14} />
                  Վերադառնալ Գլխավոր Էջ
                </button>

                <div className="text-xs text-indigo-900 font-bold uppercase tracking-wide">
                  Ամբողջ իսպաներեն թագավորությունը կբացահայտվի {GAMES.length} խաղերն ավարտելուց հետո:
                </div>
              </div>
            </motion.div>
          )}

          {/* SCREEN 4: Active Game Gameplay Arena */}
          {screen === 'play' && activeGameId !== null && (
            <motion.div
              key="play-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-4xl mx-auto space-y-6 py-2"
            >
              {/* Game header panel */}
              <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-4 border-4 border-indigo-950 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl" />
                <div className="flex items-center gap-4">
                  <div className="text-4xl p-3 bg-indigo-950/80 rounded-2xl w-fit border border-indigo-500/20">
                    {GAMES.find((v) => v.id === activeGameId)?.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-black tracking-widest text-[#6366F1] uppercase">
                      ԽԱՂ {GAMES.findIndex((g) => g.id === activeGameId) + 1} / {GAMES.length} • {GAMES.find((v) => v.id === activeGameId)?.titleSpan}
                    </span>
                    <h2 className="text-xl font-black uppercase tracking-tight text-white">{GAMES.find((v) => v.id === activeGameId)?.titleArm}</h2>
                  </div>
                </div>

                {/* Score meters */}
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-2 rounded-2xl">
                  <div className="text-center px-4">
                    <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest block mb-0.5">👦🏻 Գոռ</span>
                    <div className="text-lg font-black font-sans text-sky-450">{gameScoreGor}</div>
                  </div>
                  <div className="w-[1px] h-8 bg-white/10" />
                  <div className="text-center px-4">
                    <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest block mb-0.5">👧🏻 Գայանե</span>
                    <div className="text-lg font-black font-sans text-rose-450">{gameScoreGayane}</div>
                  </div>
                </div>
              </div>

              {/* ACTIVE TURN CARD */}
              <div className="bg-white border-4 border-indigo-100 rounded-[2.5rem] p-6 shadow-md relative mt-4 pt-8">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-5 py-2 rounded-full font-black text-[10px] uppercase shadow-lg tracking-widest flex items-center gap-1.5 whitespace-nowrap border-2 border-indigo-400">
                  <Sparkles size={11} className="text-amber-300 animate-spin-slow" />
                  ԸՆԹԱՑԻԿ ՓՈՒԼ / EN CURSO
                </div>

                <div className="flex items-center justify-between border-b border-indigo-50 pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-2.5xl border-2 border-indigo-100 shadow-inner">
                      {CHARACTERS[activeTurn].avatar}
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-black block">Հերթը պատկանում է</span>
                      <h3 className="text-base font-black text-indigo-950 uppercase tracking-tight">
                        {CHARACTERS[activeTurn].name}
                        {gameMode === 'single' && activeTurn !== playerChar && <span className="ml-2 text-[9px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-black border border-rose-200">AI ռակուրս...</span>}
                      </h3>
                    </div>
                  </div>

                  {activeGameId === 5 && !isAnswerRevealed && (
                    <div className="flex items-center gap-1.5 bg-red-100 text-red-800 border-2 border-red-300 px-3 py-1.5 rounded-xl font-mono text-xs font-black shadow-xs">
                      <Clock size={14} className="animate-spin text-red-600" />
                      {timeLeft} վրկ.
                    </div>
                  )}

                  {/* Round Counter */}
                  <div className="text-xs font-bold text-slate-400 justify-self-end">
                    Փուլ՝ <span className="text-[#6366F1] font-black font-mono text-base bg-indigo-50 px-2.5 py-1 rounded border border-indigo-150">{currentRound + 1} / 20</span>
                  </div>
                </div>

                {/* AI Speeking Bubble (Single mode only) */}
                {gameMode === 'single' && activeTurn !== playerChar && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 bg-violet-50 text-violet-800 border-2 border-violet-100 p-4 rounded-2xl text-xs font-medium flex gap-2 items-center"
                  >
                    <span className="text-xl">⚙️</span>
                    <div>
                      <p className="font-extrabold text-[10px] uppercase text-violet-600 tracking-wider">Խելացի Bot-ի Մտորումները</p>
                      <p className="mt-0.5">{aiSpeech}</p>
                    </div>
                  </motion.div>
                )}

                {/* GAME INTERFACE CONDITIONAL ROUTING */}
                <div className="p-2">
                  
                  {/* GAME 1: CONJUGATION BUILDER */}
                  {activeGameId === 1 && (
                    <div className="space-y-6">
                      {(() => {
                        const question = CONJUGATION_QUESTIONS[currentRound % CONJUGATION_QUESTIONS.length];
                        return (
                          <>
                            <div className="text-center space-y-2 py-4">
                              <span className="text-sm font-black font-mono text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full">
                                {question.pronoun.toUpperCase()} ({question.pronounTranslation})
                              </span>
                              <h3 className="text-2xl font-black text-slate-900 mt-2">
                                Conjugue: <span className="underline decoration-amber-500">{question.verb}</span> ({question.translation})
                              </h3>
                              <p className="text-xs text-slate-400">Կազմիր բայի ապառնի ձևը տվյալ դերանվան համար</p>
                            </div>

                            {/* Conjugation Assembly Visual */}
                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center">
                              <div className="text-2xl font-black font-mono tracking-wide text-slate-800">
                                {question.verb} + <span className="text-amber-600 underline">{selectedOption ? selectedOption.replace(question.verb, '-') : '____'}</span>
                              </div>
                              {isAnswerRevealed && (
                                <div className="text-base font-extrabold text-slate-700 font-mono mt-3">
                                  = {question.correctAnswer} <span className="text-slate-400 font-normal">({question.pronounTranslation} կ{question.translation})</span>
                                </div>
                              )}
                            </div>

                            {/* Options grid */}
                            <div className="grid grid-cols-2 gap-4">
                              {question.options.map((option, idx) => {
                                const isSelected = selectedOption === option;
                                const isCorrect = option === question.correctAnswer;
                                return (
                                  <button
                                    key={idx}
                                    id={`g1-option-${idx}`}
                                    onClick={() => handleSelectOption(option)}
                                    disabled={activeTurn !== playerChar && gameMode === 'single'}
                                    className={`py-4 px-6 rounded-2xl font-bold font-mono text-sm transition-all text-center border cursor-pointer ${
                                      isAnswerRevealed
                                        ? isCorrect
                                          ? 'bg-emerald-500 border-emerald-600 text-white shadow-md'
                                          : isSelected
                                            ? 'bg-rose-500 border-rose-600 text-white shadow-md'
                                            : 'bg-white border-slate-100 text-slate-400 opacity-60'
                                        : 'bg-white border-slate-200 hover:border-amber-500 hover:bg-amber-50/10 hover:scale-[1.01] text-slate-700'
                                    }`}
                                  >
                                    {option}
                                  </button>
                                );
                              })}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}

                  {/* GAME 3: IRREGULAR CANYON MATCH */}
                  {activeGameId === 3 && (
                    <div className="space-y-6">
                      <div className="text-center space-y-1">
                        <span className="text-xs bg-rose-50 text-rose-700 px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                          Զուգընկերների միացում
                        </span>
                        <h3 className="text-lg font-black text-slate-800 mt-2">
                          Միացրու անորոշ բայը իր ճիշտ ապառնիի անկանոն հիմքի հետ:
                        </h3>
                        <p className="text-xs text-slate-400">Օրինակ՝ tener → tendr- (կունենամ)</p>
                      </div>

                      <div className="grid grid-cols-2 gap-8 items-start py-4">
                        {/* Infinitives on Left */}
                        <div className="space-y-3">
                          <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block text-center">Անորոշ բայ</span>
                          {game3RoundPairs.map((v) => {
                            const isMatched = matchedPairs.includes(v.infinitive);
                            const isSelected = selectedInfinitive === v.infinitive;
                            return (
                              <button
                                key={v.infinitive}
                                id={`g3-infinitive-${v.infinitive}`}
                                onClick={() => handleGame3InfinitiveClick(v.infinitive)}
                                disabled={(isMatched || isAnswerRevealed) || (activeTurn !== playerChar && gameMode === 'single')}
                                className={`w-full py-4 px-5 rounded-2xl font-bold font-mono text-sm border text-left flex justify-between items-center transition-all cursor-pointer ${
                                  isMatched
                                    ? 'bg-emerald-500 border-emerald-600 text-white font-black opacity-80'
                                    : isSelected
                                      ? 'bg-rose-500 border-rose-600 text-white shadow-md shadow-rose-500/10'
                                      : 'bg-white border-slate-200 hover:border-rose-400 hover:bg-rose-50/10'
                                }`}
                              >
                                <span>{v.infinitive}</span>
                                <span className={`text-xs ml-2 font-sans font-normal ${isMatched || isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                                  ({v.armenian})
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Stems on Right */}
                        <div className="space-y-3">
                          <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block text-center">Ապառնիի հիմք</span>
                          {[...game3RoundPairs]
                            .map((v) => v.stem)
                            .sort() // Shuffler sorting stems alphabetically
                            .map((stem) => {
                              const isMatched = game3RoundPairs.some((v) => v.stem === stem && matchedPairs.includes(v.infinitive));
                              const isWrong = wrongMatch === stem;
                              return (
                                <button
                                  key={stem}
                                  id={`g3-stem-${stem}`}
                                  onClick={() => handleGame3StemClick(stem)}
                                  disabled={(!selectedInfinitive || isMatched || isAnswerRevealed) || (activeTurn !== playerChar && gameMode === 'single')}
                                  className={`w-full py-4 px-5 rounded-2xl font-bold font-mono text-sm border transition-all text-center cursor-pointer ${
                                    isMatched
                                      ? 'bg-emerald-500 border-emerald-600 text-white opacity-80'
                                      : isWrong
                                        ? 'bg-rose-500 border-rose-600 text-white animate-shake'
                                        : 'bg-white border-slate-200 hover:bg-slate-50'
                                  }`}
                                >
                                  {stem}
                                </button>
                              );
                            })}
                        </div>
                      </div>

                      {isAnswerRevealed && (
                        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-xs text-emerald-800">
                          <strong>Հիանալի է:</strong> Բոլոր անկանոն հիմքերը ճիշտ զուգորդվեցին: Դրանք չափազանց կարևոր են իսպաներենով ճիշտ խոսելու համար:
                        </div>
                      )}
                    </div>
                  )}

                  {/* GAME 4: DIALOGUE DUEL */}
                  {activeGameId === 4 && (
                    <div className="space-y-6">
                      {(() => {
                        const question = DIALOGUE_BUBBLES[currentRound % DIALOGUE_BUBBLES.length];
                        return (
                          <>
                            <div className="text-center py-2">
                              <span className="text-xs bg-teal-50 text-teal-700 px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                                Diálogo — Futuro Simple
                              </span>
                              <h3 className="text-base font-black text-slate-800 mt-2">
                                Գոռ և Գայանե․ «Կգնանք կինոթատրոն միասին»
                              </h3>
                            </div>

                            {/* Dialogue display frame */}
                            <div className="bg-slate-50 border border-slate-100/80 rounded-3xl p-6 min-h-[160px] flex flex-col justify-center space-y-4">
                              <div className={`flex gap-3 items-start ${question.character === 'gor' ? 'justify-end' : 'justify-start'}`}>
                                {question.character !== 'gor' && <span className="text-3xl">👧🏻</span>}
                                <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                                  question.character === 'gor'
                                    ? 'bg-orange-500 text-white rounded-tr-none'
                                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                                }`}>
                                  <p className="text-[10px] opacity-75 font-semibold uppercase">{question.character === 'gor' ? 'Գոռ' : 'Գայանե'}</p>
                                  <p className="text-xs mt-0.5 opacity-90 leading-relaxed font-semibold">{question.armenianText}</p>
                                  <p className="text-sm font-bold font-mono mt-2 pt-2 border-t border-black/10">
                                    {question.spanishTemplate.replace('{blank}', selectedOption ? selectedOption : '_______')}
                                  </p>
                                </div>
                                {question.character === 'gor' && <span className="text-3xl">👦🏻</span>}
                              </div>
                            </div>

                            {/* Option selection buttons */}
                            <div className="grid grid-cols-2 gap-4">
                              {question.options.map((option, idx) => {
                                const isSelected = selectedOption === option;
                                const isCorrect = option === question.correctAnswer;
                                return (
                                  <button
                                    key={idx}
                                    id={`g4-option-${idx}`}
                                    onClick={() => handleSelectOption(option)}
                                    disabled={activeTurn !== playerChar && gameMode === 'single'}
                                    className={`py-4 px-6 rounded-2xl font-bold font-mono text-sm transition-all border text-center cursor-pointer ${
                                      isAnswerRevealed
                                        ? isCorrect
                                          ? 'bg-emerald-500 border-emerald-600 text-white'
                                          : isSelected
                                            ? 'bg-rose-500 border-rose-600 text-white'
                                            : 'bg-white border-slate-100 text-slate-300'
                                        : 'bg-white border-slate-200 hover:border-teal-500 hover:bg-teal-50/10'
                                    }`}
                                  >
                                    {option}
                                  </button>
                                );
                              })}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}

                  {/* GAME 5: SPEED YES/NO RUNNER */}
                  {activeGameId === 5 && (
                    <div className="space-y-6">
                      {(() => {
                        const question = SPEED_QUESTIONS[currentRound % SPEED_QUESTIONS.length];
                        return (
                          <>
                            <div className="text-center py-2">
                              <span className="text-xs bg-violet-50 text-violet-700 px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                                Ճի՞շտ է, թե՞ Սխալ (Verdadero o Falso)
                              </span>
                              <h3 className="text-sm font-medium text-slate-500 mt-2">
                                Ուշադրությո՛ւն, ժամանակը սահմանափակ է
                              </h3>
                            </div>

                            {/* Flashcard panel */}
                            <div className="bg-[#FAF8F5] border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center space-y-4 max-w-sm mx-auto shadow-sm">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono block">Իսպաներեն արտահայտություն</span>
                              <h3 className="text-2xl font-extrabold text-slate-800 font-mono underline decoration-violet-400">
                                {question.spanishVerb}
                              </h3>
                              <div className="text-slate-400 text-xs">նշանակո՞ւմ է արդյոք՝</div>
                              <h4 className="text-lg font-black text-violet-800">
                                « {question.armenianMeaning} »
                              </h4>
                            </div>

                            {/* Dual action buttons */}
                            <div className="flex gap-4 max-w-md mx-auto">
                              <button
                                onClick={() => handleSelectOption('yes')}
                                disabled={isAnswerRevealed || (activeTurn !== playerChar && gameMode === 'single')}
                                id="g5-btn-yes"
                                className={`flex-1 py-4 px-6 rounded-2xl font-black text-sm uppercase transition-all flex items-center justify-center gap-2 cursor-pointer border-2 ${
                                  isAnswerRevealed
                                    ? question.isCorrect
                                      ? 'bg-emerald-500 border-emerald-600 text-white'
                                      : selectedOption === 'yes'
                                        ? 'bg-rose-500 border-rose-600 text-white'
                                        : 'bg-white border-slate-100 text-slate-300'
                                    : 'bg-white border-emerald-500 text-emerald-700 hover:bg-emerald-50'
                                }`}
                              >
                                Ճիշտ է ✅
                              </button>

                              <button
                                onClick={() => handleSelectOption('no')}
                                disabled={isAnswerRevealed || (activeTurn !== playerChar && gameMode === 'single')}
                                id="g5-btn-no"
                                className={`flex-1 py-4 px-6 rounded-2xl font-black text-sm uppercase transition-all flex items-center justify-center gap-2 cursor-pointer border-2 ${
                                  isAnswerRevealed
                                    ? !question.isCorrect
                                      ? 'bg-emerald-500 border-emerald-600 text-white'
                                      : selectedOption === 'no'
                                        ? 'bg-rose-500 border-rose-600 text-white'
                                        : 'bg-white border-slate-100 text-slate-300'
                                    : 'bg-white border-rose-500 text-rose-700 hover:bg-rose-50'
                                }`}
                              >
                                Սխալ է ❌
                              </button>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}

                  {/* GAME 6: APARRNI TRANSLATOR */}
                  {activeGameId === 6 && (
                    <div className="space-y-6">
                      {(() => {
                        const question = TRANSLATION_QUESTIONS[currentRound % TRANSLATION_QUESTIONS.length];
                        return (
                          <>
                            <div className="text-center py-2">
                              <span className="text-xs bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-full font-bold uppercase tracking-widest">
                                Ապառնի Թարգմանություն
                              </span>
                              <h4 className="text-lg font-black text-slate-800 mt-4 leading-relaxed">
                                « {question.armenianSentence} »
                              </h4>
                              <p className="text-xs text-slate-400 mt-1.5">Ընտրիր ճիշտ իսպաներեն թարգմանությունը</p>
                            </div>

                            {/* Option selection buttons */}
                            <div className="flex flex-col gap-3 max-w-xl mx-auto">
                              {question.options.map((option, idx) => {
                                const isSelected = selectedOption === option;
                                const isCorrect = option === question.correctAnswer;
                                return (
                                  <button
                                    key={idx}
                                    id={`g6-option-${idx}`}
                                    onClick={() => handleSelectOption(option)}
                                    disabled={activeTurn !== playerChar && gameMode === 'single'}
                                    className={`py-4 px-6 rounded-2xl font-bold font-mono text-xs md:text-sm transition-all border text-left flex items-center gap-3 cursor-pointer ${
                                      isAnswerRevealed
                                        ? isCorrect
                                          ? 'bg-emerald-500 border-emerald-600 text-white shadow-md'
                                          : isSelected
                                            ? 'bg-rose-500 border-rose-600 text-white shadow-md'
                                            : 'bg-white border-slate-100 text-slate-300 pointer-events-none'
                                        : 'bg-white border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/10 hover:translate-x-1 shadow-sm'
                                    }`}
                                  >
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] border shrink-0 ${
                                      isAnswerRevealed
                                        ? isCorrect
                                          ? 'bg-emerald-600 border-emerald-700 text-white'
                                          : isSelected
                                            ? 'bg-rose-600 border-rose-700 text-white'
                                            : 'bg-slate-50 border-slate-100 text-slate-300'
                                        : 'bg-slate-50 border-slate-200 text-slate-500'
                                    }`}>
                                      {String.fromCharCode(65 + idx)}
                                    </span>
                                    <span className="flex-1">{option}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}

                </div>
              </div>

              {/* FEEDBACK & REVELATION PANEL */}
              <AnimatePresence>
                {isAnswerRevealed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`rounded-3xl p-5 border-2 ${
                      isAnswerCorrect
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-rose-50 border-rose-200 text-rose-900'
                    }`}
                  >
                    <div className="flex gap-3">
                      {isAnswerCorrect ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 mt-0.5" />
                      ) : (
                        <XCircle className="w-6 h-6 text-rose-600 mt-0.5" />
                      )}
                      <div className="space-y-1.5 flex-1">
                        <h4 className="font-extrabold text-sm uppercase">
                          {isAnswerCorrect ? 'Ճիշտ պատասխան է: ¡Excelente!' : 'Սխալ պատասխան: ¡Ánimo!'}
                        </h4>
                        
                        <p className="text-xs leading-relaxed opacity-95">
                          {activeGameId === 1 && CONJUGATION_QUESTIONS[currentRound % CONJUGATION_QUESTIONS.length].explanation}
                          {activeGameId === 3 && 'Հիանալի է՛: Բոլոր անկանոն բայերի հիմքերը հաջողությամբ համապատասխանեցվեցին: Շարունակենք մարզվել:'}
                          {activeGameId === 4 && DIALOGUE_BUBBLES[currentRound % DIALOGUE_BUBBLES.length].explanation}
                          {activeGameId === 5 && SPEED_QUESTIONS[currentRound % SPEED_QUESTIONS.length].explanation}
                          {activeGameId === 6 && TRANSLATION_QUESTIONS[currentRound % TRANSLATION_QUESTIONS.length].explanation}
                        </p>

                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={handleNextRound}
                            id="play-next-round-btn"
                            className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase cursor-pointer flex items-center gap-1.5 transition-all text-white ${
                              isAnswerCorrect ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                            }`}
                          >
                            <span>Հաջորդը</span>
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Danger exit actions */}
              <div className="flex justify-between items-center text-xs">
                <button
                  onClick={() => {
                    sound.playClick();
                    if (confirm('Արդյո՞ք ցանկանում եք լքել ընթացիկ խաղը: Ձեր կուտակած միավորները կկորչեն:')) {
                      setScreen('hub');
                    }
                  }}
                  id="play-exit-btn"
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  Լքել Խաղը
                </button>

                <span className="text-slate-400 font-medium italic">Իսպաներենը հեշտ է, եթե հաճախ ես մարզվում:</span>
              </div>

            </motion.div>
          )}

          {/* SCREEN 5: Championship Final Verdict */}
          {screen === 'final' && (
            <motion.div
              key="final-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto text-center space-y-8 py-6 relative"
            >
              {/* Confetti celebration if they arrive here with complete sets */}
              <ConfettiVisualizer />

              <div className="inline-flex items-center justify-center p-5 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-500/20 border-4 border-indigo-400 animate-bounce">
                <Trophy size={48} className="text-amber-305" />
              </div>

              <div>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-200">
                  Արդյունքների Ամփոփում
                </span>
                <h1 className="text-3xl md:text-4xl font-black text-indigo-950 tracking-tight mt-4 uppercase">
                  Մրցաշարն Ավարտվե՛ց:
                </h1>
                <p className="text-slate-600 text-sm mt-1.5 font-semibold">
                  Դուք հաղթահարեցիք իսպաներենի ապառնի ժամանակի բոլոր 6 հետաքրքիր մարտահրավերները!
                </p>
              </div>

              {/* Tournament scores board with thick bordered cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-2">
                {/* Gor Final Summary */}
                <div className="bg-sky-100 border-b-8 border-sky-300 rounded-[2rem] p-6 shadow-lg relative flex flex-col justify-between h-64 text-sky-950">
                  {gorState.score >= gayaneState.score && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-650 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-md border-2 border-indigo-400">
                      👑 ՉԵՄՊԻՈՆ 👑
                    </div>
                  )}
                  <div>
                    <span className="text-4xl">👦🏻</span>
                    <h3 className="font-black text-sky-900 text-xl mt-2">Գոռ</h3>
                    <div className="text-3xl font-black text-sky-950 mt-1">{gorState.score}</div>
                    <span className="text-[10px] text-sky-850 block uppercase font-black tracking-wider">միավոր</span>
                  </div>

                  <div className="border-t border-sky-200 pt-3 text-xs text-sky-950 leading-relaxed italic mt-4 bg-sky-50/50 p-2 rounded-xl font-semibold">
                    « {gorState.score >= gayaneState.score ? CHARACTERS.gor.victoryPhrase : CHARACTERS.gor.lossPhrase} »
                  </div>
                </div>

                {/* Gayane Final Summary */}
                <div className="bg-rose-100 border-b-8 border-rose-300 rounded-[2rem] p-6 shadow-lg relative flex flex-col justify-between h-64 text-rose-950">
                  {gayaneState.score >= gorState.score && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-650 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-md border-2 border-indigo-400">
                      👑 ՉԵՄՊԻՈՆ 👑
                    </div>
                  )}
                  <div>
                    <span className="text-4xl">👧🏻</span>
                    <h3 className="font-black text-rose-900 text-xl mt-2">Գայանե</h3>
                    <div className="text-3xl font-black text-rose-955 mt-1">{gayaneState.score}</div>
                    <span className="text-[10px] text-rose-850 block uppercase font-black tracking-wider">միավոր</span>
                  </div>

                  <div className="border-t border-rose-200 pt-3 text-xs text-rose-950 leading-relaxed italic mt-4 bg-rose-50/50 p-2 rounded-xl font-semibold">
                    « {gayaneState.score >= gorState.score ? CHARACTERS.gayane.victoryPhrase : CHARACTERS.gayane.lossPhrase} »
                  </div>
                </div>
              </div>

              {/* Tournament stats details */}
              <div className="bg-white border-4 border-indigo-100 p-6 rounded-2xl text-left text-xs text-slate-750 space-y-2.5 shadow-md">
                <span className="font-emerald-950 text-indigo-900 block font-black uppercase tracking-widest text-[10px]">Ընդհանուր վիճակագրություն</span>
                <p className="font-semibold">🏆 <strong>Հաղթանակի վճիռ՝</strong> {
                  gorState.score > gayaneState.score 
                    ? `Գոռը հաղթեց ${gorState.score - gayaneState.score} միավորի գերազանցությամբ!` 
                    : gayaneState.score > gorState.score 
                      ? `Գայանեն հաղթեց ${gayaneState.score - gorState.score} միավորի գերազանցությամբ!` 
                      : 'Գրանցվեց հավասարություն՝ իսկական ընկերության հաղթանակ!'
                }</p>
                <p className="font-semibold">📈 <strong>Ճշգրտություն՝</strong> Գոռ` {gorState.answersCount > 0 ? Math.round((gorState.correctAnswersCount / gorState.answersCount) * 100) : 0}%, Գայանե՝ {gayaneState.answersCount > 0 ? Math.round((gayaneState.correctAnswersCount / gayaneState.answersCount) * 100) : 0}%</p>
              </div>

              {/* Re-action actions */}
              <div className="pt-4 flex items-center justify-center gap-4">
                <button
                  onClick={() => {
                    sound.playClick();
                    setCompletedGames([]);
                    setScreen('hub');
                  }}
                  id="final-replay-btn"
                  className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl font-black text-xs uppercase flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-650/10 transition-all"
                >
                  <RefreshCw size={14} />
                  Կրկնել Խաղերը
                </button>

                <button
                  onClick={handleResetSession}
                  id="final-new-game-btn"
                  className="px-6 py-3.5 border-2 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-black text-xs cursor-pointer uppercase transition-all"
                >
                  Ամբողջական Վերագործարկում
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* Grammar Theory Overlay Dialog/Modal */}
      <AnimatePresence>
        {showGrammarModal && (
          <div className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl relative border-4 border-indigo-100">
              <GrammarGuide onClose={() => setShowGrammarModal(false)} />
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Persistent Beautiful Footer - Styled perfectly like Vibrant Palette */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider py-6 mt-8">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>MODO: MULTIJUGADOR ARMENIA-ESPAÑA</div>
          <div className="flex gap-6 flex-wrap justify-center text-[11px] tracking-widest text-slate-400">
            <span>Gor & Gayane Game © 2026</span>
            <span className="text-emerald-400 underline cursor-pointer hover:text-emerald-300" onClick={() => setShowGrammarModal(true)}>SIGUIENTE LECCIÓN →</span>
          </div>
        </div>
      </footer>
      
    </div>
  );
}
