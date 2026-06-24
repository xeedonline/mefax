'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useTeletextStore } from '@/store/teletext';

const GAMES: Record<number, string> = {
  700: 'INDEX',
  701: 'SNAKE',
  702: 'PONG',
  703: 'HANGMAN',
  704: 'NUMBER GUESS',
};

export default function GamesPage({ pageNum }: { pageNum: number }) {
  const { navigate, setFastTextLinks } = useTeletextStore();

  useEffect(() => {
    setFastTextLinks({
      red:    { page: 701, label: 'SNAKE' },
      green:  { page: 702, label: 'PONG' },
      yellow: { page: 703, label: 'HANGMAN' },
      blue:   { page: 704, label: 'GUESS' },
    });
  }, [setFastTextLinks]);

  if (pageNum === 701) return <SnakeGame />;
  if (pageNum === 703) return <HangmanGame />;
  if (pageNum === 704) return <NumberGuessGame />;

  return (
    <div className="tt-reveal h-full overflow-hidden px-1 tt-text">
      <div className="bg-tt-green text-black font-bold text-center py-0.5">
        ▶ RETRO GAMES ◀
      </div>
      <div className="mt-2 text-tt-cyan text-center">CHOOSE YOUR GAME</div>
      <div className="mt-3 space-y-2 px-2">
        {[
          { page: 701, title: 'SNAKE',        desc: 'EAT DOTS. AVOID THE TAIL.', color: 'text-tt-red' },
          { page: 702, title: 'PONG',         desc: 'CLASSIC PADDLE GAME.',      color: 'text-tt-yellow' },
          { page: 703, title: 'HANGMAN',      desc: 'GUESS THE WORD.',           color: 'text-tt-cyan' },
          { page: 704, title: 'GUESS A NUMBER', desc: 'CAN YOU FIND IT IN TIME?', color: 'text-tt-green' },
        ].map(g => (
          <button
            key={g.page}
            onClick={() => navigate(g.page)}
            className="w-full text-left flex items-center gap-3 hover:bg-tt-blue/20 px-1 py-0.5 transition-colors border border-transparent hover:border-tt-cyan"
          >
            <span className="text-tt-white w-4">{g.page - 700}.</span>
            <div>
              <div className={`font-bold ${g.color}`}>{g.title}</div>
              <div className="text-tt-white/60 text-[0.85em]">{g.desc}</div>
            </div>
          </button>
        ))}
      </div>
      <div className="mt-4 text-tt-white/40 text-center text-[0.8em]">
        ALL GAMES REMAIN IN TELETEXT STYLE
      </div>
    </div>
  );
}

// ── SNAKE GAME ──
const GRID_W = 20, GRID_H = 16;
type Dir = 'UP'|'DOWN'|'LEFT'|'RIGHT';
type Cell = { x: number; y: number };

function SnakeGame() {
  const [snake, setSnake] = useState<Cell[]>([{x:10,y:8},{x:9,y:8},{x:8,y:8}]);
  const [food,  setFood]  = useState<Cell>({x:15,y:8});
  const [dir,   setDir]   = useState<Dir>('RIGHT');
  const [phase, setPhase] = useState<'start'|'playing'|'dead'>('start');
  const [score, setScore] = useState(0);
  const dirRef = useRef<Dir>('RIGHT');

  const placeFood = (body: Cell[]): Cell => {
    let f: Cell;
    do { f = { x: Math.floor(Math.random() * GRID_W), y: Math.floor(Math.random() * GRID_H) }; }
    while (body.some(c => c.x === f.x && c.y === f.y));
    return f;
  };

  const tick = useCallback(() => {
    setSnake(prev => {
      const d = dirRef.current;
      const head = prev[0];
      const next = {
        x: (head.x + (d==='RIGHT'?1:d==='LEFT'?-1:0) + GRID_W) % GRID_W,
        y: (head.y + (d==='DOWN' ?1:d==='UP'  ?-1:0) + GRID_H) % GRID_H,
      };
      if (prev.slice(1).some(c => c.x===next.x && c.y===next.y)) {
        setPhase('dead');
        return prev;
      }
      const ate = next.x===food.x && next.y===food.y;
      const newSnake = [next, ...prev.slice(0, ate ? undefined : -1)];
      if (ate) {
        setScore(s => s + 10);
        setFood(placeFood(newSnake));
      }
      return newSnake;
    });
  }, [food]);

  useEffect(() => {
    if (phase !== 'playing') return;
    const id = setInterval(tick, 200);
    return () => clearInterval(id);
  }, [phase, tick]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp:'UP', ArrowDown:'DOWN', ArrowLeft:'LEFT', ArrowRight:'RIGHT',
        w:'UP', s:'DOWN', a:'LEFT', d:'RIGHT',
      };
      const d = map[e.key];
      if (!d) return;
      e.preventDefault();
      const opp = { UP:'DOWN', DOWN:'UP', LEFT:'RIGHT', RIGHT:'LEFT' } as Record<Dir, Dir>;
      if (d !== opp[dirRef.current]) { dirRef.current = d; setDir(d); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const reset = () => {
    const initial = [{x:10,y:8},{x:9,y:8},{x:8,y:8}];
    setSnake(initial);
    setDir('RIGHT');
    dirRef.current = 'RIGHT';
    setFood(placeFood(initial));
    setScore(0);
    setPhase('playing');
  };

  const snakeSet = new Set(snake.map(c => `${c.x},${c.y}`));

  return (
    <div className="tt-reveal h-full flex flex-col tt-text">
      <div className="bg-tt-green text-black font-bold text-center py-0.5">
        🐍 SNAKE  SCORE: {score}
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="border border-tt-green/50">
          {Array.from({length: GRID_H}, (_, y) => (
            <div key={y} className="flex">
              {Array.from({length: GRID_W}, (_, x) => {
                const isHead  = snake[0].x===x && snake[0].y===y;
                const isBody  = snakeSet.has(`${x},${y}`) && !isHead;
                const isFood  = food.x===x && food.y===y;
                return (
                  <span
                    key={x}
                    className={`w-[1ch] text-center leading-none ${
                      isHead ? 'text-tt-white bg-tt-green' :
                      isBody ? 'text-tt-green' :
                      isFood ? 'text-tt-yellow' :
                      'text-black'
                    }`}
                  >
                    {isHead ? '■' : isBody ? '▪' : isFood ? '●' : ' '}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {phase === 'start' && (
        <div className="text-center pb-2">
          <button onClick={reset} className="bg-tt-green text-black px-4 py-0.5 font-bold">START</button>
          <div className="text-tt-white/50 text-[0.8em] mt-1">ARROW KEYS TO MOVE</div>
        </div>
      )}
      {phase === 'dead' && (
        <div className="text-center pb-2">
          <div className="text-tt-red font-bold tt-blink">GAME OVER!</div>
          <button onClick={reset} className="bg-tt-red text-white px-4 py-0.5 font-bold mt-1">TRY AGAIN</button>
        </div>
      )}
      {/* D-pad for mobile */}
      {phase === 'playing' && (
        <div className="flex flex-col items-center pb-1 gap-0.5">
          <button onClick={() => {dirRef.current='UP';setDir('UP');}} className="bg-tt-green/30 text-tt-white px-3">▲</button>
          <div className="flex gap-2">
            <button onClick={() => {dirRef.current='LEFT';setDir('LEFT');}} className="bg-tt-green/30 text-tt-white px-3">◀</button>
            <button onClick={() => {dirRef.current='DOWN';setDir('DOWN');}} className="bg-tt-green/30 text-tt-white px-3">▼</button>
            <button onClick={() => {dirRef.current='RIGHT';setDir('RIGHT');}} className="bg-tt-green/30 text-tt-white px-3">▶</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── HANGMAN ──
const WORDS = ['TELETEXT','CEEFAX','BROADCAST','ANTENNA','TELEVISION','EIGHTIES','SATELLITE','CHANNEL','FREQUENCY','PROGRAMME'];
const STAGES = [
  '  ___\n |   |\n |\n |\n |\n_|_',
  '  ___\n |   |\n |   O\n |\n |\n_|_',
  '  ___\n |   |\n |   O\n |   |\n |\n_|_',
  '  ___\n |   |\n |   O\n |  /|\n |\n_|_',
  '  ___\n |   |\n |   O\n |  /|\\\n |\n_|_',
  '  ___\n |   |\n |   O\n |  /|\\\n |  /\n_|_',
  '  ___\n |   |\n |   O\n |  /|\\\n |  / \\\n_|_',
];

function HangmanGame() {
  const [word, setWord]       = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [phase, setPhase]     = useState<'playing'|'won'|'lost'>('playing');

  const wrong  = [...guessed].filter(l => !word.includes(l)).length;
  const display = word.split('').map(l => guessed.has(l) ? l : '_').join(' ');
  const won    = word.split('').every(l => guessed.has(l));

  useEffect(() => {
    if (won) setPhase('won');
    else if (wrong >= 6) setPhase('lost');
  }, [won, wrong]);

  const guess = (l: string) => {
    if (phase !== 'playing' || guessed.has(l)) return;
    setGuessed(g => new Set([...g, l]));
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key.length === 1 && e.key >= 'a' && e.key <= 'z') guess(e.key.toUpperCase());
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [guess]);

  const reset = () => {
    setWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
    setGuessed(new Set());
    setPhase('playing');
  };

  return (
    <div className="tt-reveal h-full flex flex-col tt-text px-1">
      <div className="bg-tt-cyan text-black font-bold text-center py-0.5">
        HANGMAN — TELETEXT EDITION
      </div>
      <div className="flex gap-4 mt-1 flex-1">
        <pre className="text-tt-yellow text-[0.7em] leading-tight">{STAGES[Math.min(wrong, STAGES.length-1)]}</pre>
        <div className="flex-1">
          <div className="text-tt-white text-[1.2em] tracking-widest mt-2">{display}</div>
          <div className="text-tt-white/50 text-[0.8em] mt-1">WRONG: {wrong}/6</div>
          {phase === 'won'  && <div className="text-tt-green font-bold tt-blink">YOU WIN! 🎉</div>}
          {phase === 'lost' && <div className="text-tt-red font-bold tt-blink">WORD: {word}</div>}
        </div>
      </div>
      <div className="flex flex-wrap gap-0.5 justify-center py-1">
        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => (
          <button
            key={l}
            onClick={() => guess(l)}
            className={`w-[1.6ch] text-center text-[0.9em] font-bold transition-colors ${
              guessed.has(l)
                ? word.includes(l) ? 'text-tt-green' : 'text-tt-red/50'
                : 'text-tt-white hover:text-tt-yellow'
            }`}
            disabled={guessed.has(l) || phase !== 'playing'}
          >
            {l}
          </button>
        ))}
      </div>
      {phase !== 'playing' && (
        <div className="text-center pb-1">
          <button onClick={reset} className="bg-tt-cyan text-black px-4 py-0.5 font-bold">NEW WORD</button>
        </div>
      )}
    </div>
  );
}

// ── NUMBER GUESS ──
function NumberGuessGame() {
  const [secret]   = useState(() => Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess]   = useState('');
  const [attempts, setAttempts] = useState(0);
  const [hint, setHint]     = useState('');
  const [won, setWon]       = useState(false);

  const submit = () => {
    const n = parseInt(guess, 10);
    if (isNaN(n) || n < 1 || n > 100) return;
    setAttempts(a => a + 1);
    if (n === secret) { setHint(`CORRECT! ${secret} — IN ${attempts + 1} GUESSES`); setWon(true); }
    else if (n < secret) setHint(`TOO LOW! TRY HIGHER...`);
    else setHint(`TOO HIGH! TRY LOWER...`);
    setGuess('');
  };

  return (
    <div className="tt-reveal h-full flex flex-col items-center justify-center tt-text px-2">
      <div className="bg-tt-magenta text-black font-bold text-center w-full py-0.5">
        GUESS THE NUMBER — 1 TO 100
      </div>
      <div className="mt-4 text-tt-cyan">I AM THINKING OF A NUMBER...</div>
      <div className="text-tt-white/60 mt-1">ATTEMPTS: {attempts}</div>
      <div className={`mt-2 font-bold ${won ? 'text-tt-green' : 'text-tt-yellow'}`}>{hint || 'ENTER YOUR FIRST GUESS'}</div>
      {!won && (
        <div className="flex gap-2 mt-4">
          <input
            type="number"
            min={1} max={100}
            value={guess}
            onChange={e => setGuess(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            className="bg-black text-tt-white border border-tt-cyan w-16 text-center py-0.5 outline-none"
            placeholder="??"
          />
          <button onClick={submit} className="bg-tt-cyan text-black px-4 font-bold hover:bg-tt-yellow">GUESS</button>
        </div>
      )}
    </div>
  );
}
