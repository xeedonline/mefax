'use client';
import { useState } from 'react';
import { useTeletextStore } from '@/store/teletext';

const KEYS = ['red', 'green', 'yellow', 'blue'] as const;

const FT_STYLE: Record<string, { bg: string; text: string }> = {
  red:    { bg: '#880000', text: '#ffffff' },
  green:  { bg: '#007700', text: '#ffffff' },
  yellow: { bg: '#888800', text: '#ffffff' },
  blue:   { bg: '#0000aa', text: '#ffffff' },
};

export default function BottomBar() {
  const { fastTextLinks, navigate, currentPage } = useTeletextStore();
  const [typed, setTyped] = useState('');

  return (
    <footer className="shrink-0 tt-text">

      {/* ── FastText band ── */}
      <div className="flex" style={{ height: '2.6em' }}>
        {KEYS.map(color => {
          const link = fastTextLinks[color];
          const s    = FT_STYLE[color];
          return (
            <button
              key={color}
              onClick={() => link && navigate(link.page)}
              disabled={!link}
              className="flex-1 flex flex-col items-center justify-center transition-all"
              style={{
                background: s.bg,
                color: s.text,
                opacity: link ? 1 : 0.55,
                cursor: link ? 'pointer' : 'default',
              }}
            >
              {link ? (
                <>
                  <span className="font-bold leading-tight" style={{ fontSize: '0.8em' }}>
                    {link.label.toUpperCase().slice(0, 12)}
                  </span>
                  <span className="leading-none" style={{ fontSize: '0.6em', opacity: 0.8 }}>
                    p{link.page}
                  </span>
                </>
              ) : (
                <span style={{ fontSize: '0.6em', opacity: 0.4 }}>{color.slice(0, 3).toUpperCase()}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Mobile-only nav strip ── */}
      <div className="lg:hidden flex items-center gap-1 px-1 py-1 bg-black border-t border-white/10">
        <button
          onClick={() => navigate(Math.max(currentPage - 1, 100))}
          className="text-tt-cyan border border-tt-cyan/40 px-2 py-0.5 font-bold"
          style={{ fontSize: '0.8em' }}
        >◄</button>

        <button
          onClick={() => navigate(100)}
          className="text-tt-white border border-white/20 px-2 py-0.5"
          style={{ fontSize: '0.8em' }}
        >HOME</button>

        <input
          type="text"
          inputMode="numeric"
          maxLength={4}
          value={typed}
          onChange={e => setTyped(e.target.value.replace(/\D/g, ''))}
          onKeyDown={e => {
            if (e.key === 'Enter' && typed) {
              navigate(parseInt(typed, 10));
              setTyped('');
            }
          }}
          placeholder="P___"
          className="flex-1 bg-black text-tt-cyan border border-tt-cyan/40 text-center py-0.5 outline-none"
          style={{ fontSize: '0.9em', fontFamily: 'var(--font-teletext)' }}
        />

        <button
          onClick={() => { if (typed) { navigate(parseInt(typed, 10)); setTyped(''); } }}
          className="bg-tt-cyan text-black font-bold px-2 py-0.5"
          style={{ fontSize: '0.8em' }}
        >GO</button>

        <button
          onClick={() => navigate(Math.min(currentPage + 1, 899))}
          className="text-tt-cyan border border-tt-cyan/40 px-2 py-0.5 font-bold"
          style={{ fontSize: '0.8em' }}
        >►</button>
      </div>

    </footer>
  );
}
