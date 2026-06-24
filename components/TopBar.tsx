'use client';
import { useEffect, useState } from 'react';
import { useTeletextStore } from '@/store/teletext';
import { ttDate, ttTime } from '@/lib/teletext-utils';

export default function TopBar() {
  const { currentPage, inputBuffer } = useTeletextStore();
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const tick = () => {
      setTime(ttTime());
      setDate(ttDate());
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Display: P1__ while typing, P100 when settled
  const displayBuf = inputBuffer
    ? (inputBuffer + '____').slice(0, 4).replace(/_/g, '_')
    : String(currentPage).padEnd(3, ' ');

  const pageDisplay = inputBuffer
    ? `P${(inputBuffer + '___').slice(0, 4)}`
    : `P${String(currentPage).padStart(3, '0')}`;

  return (
    <header className="flex items-center justify-between bg-black border-b border-tt-cyan/30 px-2 py-0.5 shrink-0 tt-text">
      {/* Page number */}
      <div className="text-tt-cyan font-bold min-w-[5ch]">
        {pageDisplay}
      </div>

      {/* Logo / service name */}
      <div className="flex items-center gap-2">
        <span className="text-tt-white tracking-widest hidden sm:inline">
          <span className="text-tt-red">T</span>
          <span className="text-tt-green">E</span>
          <span className="text-tt-yellow">L</span>
          <span className="text-tt-cyan">E</span>
          <span className="text-tt-magenta">T</span>
          <span className="text-tt-white">E</span>
          <span className="text-tt-red">X</span>
          <span className="text-tt-green">T</span>
          <span className="text-tt-white"> UK</span>
        </span>
        <span className="text-tt-white sm:hidden">TELETEXT</span>
      </div>

      {/* Clock + date */}
      <div className="text-tt-white text-right">
        <span className="text-tt-yellow">{time}</span>
        <span className="text-tt-white/60 hidden sm:inline ml-2">{date}</span>
      </div>
    </header>
  );
}
