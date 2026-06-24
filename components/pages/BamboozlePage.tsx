'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useTeletextStore } from '@/store/teletext';
import questionsData from '@/data/bamboozle-questions.json';

interface Question {
  id: number;
  category: string;
  question: string;
  answers: [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
  difficulty: string;
}

const ALL_QUESTIONS = questionsData as Question[];

const CATEGORIES = [
  { key: 'all',      label: 'ALL CATEGORIES',   color: 'text-tt-white' },
  { key: 'general',  label: 'GENERAL KNOWLEDGE', color: 'text-tt-cyan' },
  { key: 'eighties', label: 'THE 1980s',          color: 'text-tt-yellow' },
  { key: 'nineties', label: 'THE 1990s',          color: 'text-tt-green' },
  { key: 'football', label: 'FOOTBALL',           color: 'text-tt-red' },
  { key: 'music',    label: 'MUSIC',              color: 'text-tt-magenta' },
  { key: 'movies',   label: 'MOVIES',             color: 'text-tt-cyan' },
  { key: 'science',  label: 'SCIENCE',            color: 'text-tt-yellow' },
];

const ANSWER_COLOURS = [
  { bg: 'bg-tt-red',     text: 'text-white',   label: 'RED'    },
  { bg: 'bg-tt-green',   text: 'text-black',   label: 'GREEN'  },
  { bg: 'bg-tt-yellow',  text: 'text-black',   label: 'YELLOW' },
  { bg: 'bg-tt-blue',    text: 'text-white',   label: 'BLUE'   },
];

const TOTAL_QUESTIONS = 10;
const TIME_PER_Q = 20; // seconds

type Phase = 'intro' | 'category' | 'question' | 'reveal' | 'gameover';

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function BamboozlePage() {
  const { navigate, setFastTextLinks } = useTeletextStore();
  const [phase, setPhase]         = useState<Phase>('intro');
  const [category, setCategory]   = useState('all');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qIndex, setQIndex]       = useState(0);
  const [selected, setSelected]   = useState<number | null>(null);
  const [score, setScore]         = useState(0);
  const [lives, setLives]         = useState(3);
  const [timeLeft, setTimeLeft]   = useState(TIME_PER_Q);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentQ = questions[qIndex];

  // Start a new game
  const startGame = useCallback((cat: string) => {
    const pool = cat === 'all' ? ALL_QUESTIONS : ALL_QUESTIONS.filter(q => q.category === cat);
    const shuffled = shuffle(pool).slice(0, TOTAL_QUESTIONS);
    setQuestions(shuffled);
    setQIndex(0);
    setScore(0);
    setLives(3);
    setSelected(null);
    setTimeLeft(TIME_PER_Q);
    setPhase('question');
  }, []);

  // Timer countdown
  useEffect(() => {
    if (phase !== 'question') { if (timerRef.current) clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          // Time's up — treat as wrong
          setSelected(-1);
          setLives(l => l - 1);
          setPhase('reveal');
          setTimeout(() => nextQuestion(), 2500);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, qIndex]);

  const handleAnswer = useCallback((idx: number) => {
    if (phase !== 'question' || selected !== null) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSelected(idx);
    if (idx === currentQ.correct) {
      setScore(s => s + Math.max(10, timeLeft * 5));
    } else {
      setLives(l => l - 1);
    }
    setPhase('reveal');
    setTimeout(() => nextQuestion(), 2000);
  }, [phase, selected, currentQ, timeLeft]);

  const nextQuestion = useCallback(() => {
    setQIndex(qi => {
      const next = qi + 1;
      if (next >= TOTAL_QUESTIONS) {
        setPhase('gameover');
        return qi;
      }
      setSelected(null);
      setTimeLeft(TIME_PER_Q);
      setPhase('question');
      return next;
    });
    setLives(l => {
      if (l <= 0) { setPhase('gameover'); }
      return l;
    });
  }, []);

  // Check lives
  useEffect(() => {
    if (lives <= 0 && phase === 'reveal') {
      setTimeout(() => setPhase('gameover'), 1500);
    }
  }, [lives, phase]);

  useEffect(() => {
    // Override fasttext to be answer buttons during game
    if (phase === 'question') {
      setFastTextLinks({
        red:    { page: 500, label: 'A' },
        green:  { page: 500, label: 'B' },
        yellow: { page: 500, label: 'C' },
        blue:   { page: 500, label: 'D' },
      });
    } else {
      setFastTextLinks({});
    }
  }, [phase, setFastTextLinks]);

  // Keyboard: 1-4 or R/G/Y/B for answers
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (phase !== 'question') return;
      const map: Record<string, number> = { '1':0,'r':0,'2':1,'g':1,'3':2,'y':2,'4':3,'b':3 };
      const idx = map[e.key.toLowerCase()];
      if (idx !== undefined) handleAnswer(idx);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase, handleAnswer]);

  // ── INTRO SCREEN ──
  if (phase === 'intro') {
    return (
      <div className="tt-reveal h-full flex flex-col items-center justify-center tt-text px-2">
        <div className="bg-tt-magenta text-black font-bold text-center w-full py-0.5 text-[1.1em]">
          ★★★ BAMBOOZLE! ★★★
        </div>
        <div className="text-tt-white text-center mt-2">THE TELETEXT QUIZ</div>
        <div className="text-tt-cyan mt-1 text-center">{TOTAL_QUESTIONS} QUESTIONS · {lives} LIVES · TIMER</div>
        <div className="mt-3 text-tt-yellow text-center">PRESS START TO BEGIN</div>
        <button
          onClick={() => setPhase('category')}
          className="mt-4 bg-tt-green text-black font-bold px-8 py-1 hover:bg-tt-cyan transition-colors"
        >
          START
        </button>
        <div className="mt-4 text-tt-white/50 text-center text-[0.85em]">
          USE COLOURED BUTTONS TO ANSWER
        </div>
      </div>
    );
  }

  // ── CATEGORY SELECT ──
  if (phase === 'category') {
    return (
      <div className="tt-reveal h-full overflow-y-auto tt-text px-1">
        <div className="bg-tt-magenta text-black font-bold text-center py-0.5">
          ★ BAMBOOZLE — CHOOSE CATEGORY ★
        </div>
        <div className="mt-2 space-y-1">
          {CATEGORIES.map((c, i) => (
            <button
              key={c.key}
              onClick={() => { setCategory(c.key); startGame(c.key); }}
              className={`w-full text-left px-2 py-0.5 flex items-center gap-2 hover:bg-tt-blue/30 transition-colors border border-transparent hover:border-tt-cyan`}
            >
              <span className="text-tt-white w-3">{i + 1}.</span>
              <span className={c.color}>{c.label}</span>
            </button>
          ))}
        </div>
        <div className="text-tt-white/50 text-center mt-3 text-[0.8em]">
          PRESS NUMBER OR CLICK TO SELECT
        </div>
      </div>
    );
  }

  // ── GAME OVER ──
  if (phase === 'gameover') {
    const grade =
      score >= 900 ? 'TELETEXT GENIUS!' :
      score >= 600 ? 'WELL DONE!' :
      score >= 300 ? 'NOT BAD!' :
      'BETTER LUCK NEXT TIME!';
    return (
      <div className="tt-reveal h-full flex flex-col items-center justify-center tt-text px-2">
        <div className="bg-tt-red text-white font-bold text-center w-full py-0.5">
          ★ GAME OVER ★
        </div>
        <div className="text-tt-yellow text-[1.2em] font-bold mt-3 text-center">
          FINAL SCORE: {score}
        </div>
        <div className="text-tt-cyan mt-1 text-center">{grade}</div>
        <div className="text-tt-white/60 mt-2 text-center text-[0.85em]">
          ANSWERED {qIndex} OF {TOTAL_QUESTIONS} QUESTIONS
        </div>
        <div className="flex gap-4 mt-6">
          <button onClick={() => { setPhase('category'); }} className="bg-tt-green text-black px-4 py-1 font-bold hover:bg-tt-cyan">PLAY AGAIN</button>
          <button onClick={() => navigate(100)} className="bg-tt-blue text-white px-4 py-1 hover:bg-tt-cyan/50">HOME</button>
        </div>
      </div>
    );
  }

  // ── QUESTION / REVEAL ──
  if (!currentQ) return null;

  const correct = currentQ.correct;

  return (
    <div className="tt-reveal h-full flex flex-col tt-text">
      {/* Header */}
      <div className="bg-tt-magenta text-black font-bold text-center py-0.5">
        ★ BAMBOOZLE! ★ Q{qIndex + 1}/{TOTAL_QUESTIONS}
      </div>

      {/* Status */}
      <div className="flex justify-between px-1 mt-0.5">
        <span className="text-tt-yellow">SCORE: {score}</span>
        <span className={`font-bold ${timeLeft <= 5 ? 'text-tt-red tt-blink' : 'text-tt-cyan'}`}>
          ⏱ {timeLeft}s
        </span>
        <span className="text-tt-red">{'♥ '.repeat(lives).trim()}</span>
      </div>

      {/* Category badge */}
      <div className="px-1 mt-0.5">
        <span className="text-tt-white/50 text-[0.8em]">{currentQ.category.toUpperCase()}</span>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center px-2">
        <div className="text-tt-white text-center text-[1.05em] leading-snug">
          {currentQ.question}
        </div>
      </div>

      {/* Answers */}
      <div className="grid grid-cols-2 gap-1 px-1 pb-1">
        {currentQ.answers.map((ans, i) => {
          const col = ANSWER_COLOURS[i];
          let extra = '';
          if (phase === 'reveal') {
            if (i === correct) extra = 'ring-2 ring-tt-white';
            else if (i === selected && selected !== correct) extra = 'opacity-40';
            else extra = 'opacity-50';
          }
          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className={`${col.bg} ${col.text} font-bold py-1 px-2 text-left flex items-center gap-1 transition-all ${extra} hover:brightness-110`}
              disabled={phase === 'reveal'}
            >
              <span className="opacity-70 text-[0.8em]">{col.label}</span>
              <span className="ml-1">{ans}</span>
              {phase === 'reveal' && i === correct && <span className="ml-auto">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
