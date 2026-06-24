'use client';
import { useEffect } from 'react';
import { useTeletextStore } from '@/store/teletext';

export default function NotFoundPage({ pageNum }: { pageNum: number }) {
  const { navigate, setFastTextLinks } = useTeletextStore();

  useEffect(() => {
    setFastTextLinks({
      red:    { page: 100, label: 'HOME' },
      green:  { page: 101, label: 'NEWS' },
      yellow: { page: 999, label: 'RANDOM' },
      blue:   { page: 500, label: 'QUIZ' },
    });
  }, [setFastTextLinks]);

  return (
    <div className="tt-reveal h-full flex flex-col items-center justify-center tt-text px-2">
      <div className="text-tt-cyan text-center">
        <div className="text-[2em] font-bold tt-blink">■</div>
        <div className="mt-2 text-tt-yellow font-bold">PAGE {pageNum}</div>
        <div className="text-tt-white mt-1">THIS PAGE DOES NOT EXIST</div>
        <div className="text-tt-white/60 mt-0.5 text-[0.85em]">
          ON A REAL TELETEXT SYSTEM, YOU WOULD WAIT<br />
          FOR THE PAGE TO APPEAR... AND WAIT... AND WAIT...
        </div>
      </div>
      <div className="mt-6 flex gap-4">
        <button onClick={() => navigate(100)} className="bg-tt-cyan text-black px-4 py-0.5 font-bold hover:bg-tt-white">
          P100 HOME
        </button>
        <button onClick={() => navigate(999)} className="bg-tt-yellow text-black px-4 py-0.5 font-bold hover:bg-tt-white">
          P999 RANDOM
        </button>
      </div>
    </div>
  );
}
