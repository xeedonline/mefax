'use client';
import { useState, useRef } from 'react';
import { useTeletextStore } from '@/store/teletext';

const FAST_COLOURS = [
  { key: 'red'    as const, bg: 'bg-tt-red',     label: 'RED'    },
  { key: 'green'  as const, bg: 'bg-tt-green',   label: 'GRN'    },
  { key: 'yellow' as const, bg: 'bg-tt-yellow',  label: 'YLW'    },
  { key: 'blue'   as const, bg: 'bg-tt-blue',    label: 'BLU'    },
];

export default function BottomBar() {
  const { fastTextLinks, navigate, addDigit, clearInput, inputBuffer, currentPage } = useTeletextStore();
  const [typed, setTyped] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePageGo = () => {
    const val = typed.trim();
    if (!val) return;
    const n = parseInt(val, 10);
    if (!isNaN(n)) navigate(n);
    setTyped('');
  };

  const handleInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handlePageGo();
  };

  return (
    <footer className="bg-black border-t border-tt-cyan/30 shrink-0 tt-text">
      {/* FastText row */}
      <div className="flex items-stretch">
        {FAST_COLOURS.map(({ key, bg, label }) => {
          const link = fastTextLinks[key];
          return (
            <button
              key={key}
              className={`flex-1 py-1 text-center transition-opacity ${
                link ? `${bg} text-black font-bold cursor-pointer hover:opacity-90 active:opacity-70` : `${bg} text-black/40 cursor-default`
              }`}
              onClick={() => link && navigate(link.page)}
              disabled={!link}
              aria-label={link ? `${label}: ${link.label} (page ${link.page})` : label}
            >
              <span className="text-xs sm:text-sm leading-none block">
                {link ? link.label.toUpperCase().slice(0, 12) : label}
              </span>
              {link && (
                <span className="text-xs leading-none block opacity-70">
                  P{link.page}
                </span>
              )}
            </button>
          );
        })}

        {/* Page input */}
        <div className="flex items-center gap-1 px-2 border-l border-tt-cyan/30">
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            maxLength={4}
            value={typed}
            onChange={(e) => setTyped(e.target.value.replace(/\D/g, ''))}
            onKeyDown={handleInputKey}
            className="w-12 bg-tt-black text-tt-cyan border border-tt-cyan/50 text-center py-0.5 outline-none focus:border-tt-cyan tt-text"
            placeholder="100"
            aria-label="Enter page number"
          />
          <button
            onClick={handlePageGo}
            className="bg-tt-cyan text-black font-bold px-2 py-0.5 hover:bg-tt-white active:bg-tt-yellow transition-colors"
          >
            GO
          </button>
        </div>
      </div>

      {/* Settings row (mobile-hidden on very small) */}
      <SettingsRow />
    </footer>
  );
}

function SettingsRow() {
  const { crtMode, scanlineMode, flickerMode, audioEnabled, toggleCRT, toggleScanlines, toggleFlicker, toggleAudio, navigate } = useTeletextStore();

  return (
    <div className="flex items-center justify-between px-2 py-0.5 border-t border-tt-cyan/20 text-tt-white/50 text-xs">
      <div className="flex gap-3">
        <button onClick={toggleCRT}       className={`hover:text-tt-cyan ${crtMode ? 'text-tt-cyan' : ''}`}>CRT</button>
        <button onClick={toggleScanlines}  className={`hover:text-tt-cyan ${scanlineMode ? 'text-tt-cyan' : ''}`}>SCAN</button>
        <button onClick={toggleFlicker}    className={`hover:text-tt-cyan ${flickerMode ? 'text-tt-cyan' : ''}`}>FLKR</button>
        <button onClick={toggleAudio}      className={`hover:text-tt-cyan ${audioEnabled ? 'text-tt-cyan' : ''}`}>SND</button>
      </div>
      <div className="flex gap-3">
        <button onClick={() => navigate(100)}  className="hover:text-tt-white">HOME</button>
        <button onClick={() => navigate(999)}  className="hover:text-tt-yellow">RAND</button>
        <button onClick={() => navigate(1983)} className="hover:text-tt-green">1983</button>
        <button onClick={() => navigate(500)}  className="hover:text-tt-cyan">QUIZ</button>
      </div>
    </div>
  );
}
