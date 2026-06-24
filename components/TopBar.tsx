'use client';
import { useEffect, useState } from 'react';
import { useTeletextStore } from '@/store/teletext';

const DAYS   = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

export default function TopBar() {
  const { currentPage, inputBuffer } = useTeletextStore();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const isTyping = inputBuffer.length > 0;

  // Build page display: "P101" settled, "P1__" while typing
  const rawPage  = String(currentPage);
  const digits   = isTyping ? inputBuffer : rawPage;
  const padded   = (digits + '___').slice(0, Math.max(3, digits.length));
  const pageStr  = 'P' + padded.replace(/_/g, '-');

  const timeStr = now
    ? `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    : '--:--:--';

  const dateStr = now
    ? `${DAYS[now.getDay()]} ${pad(now.getDate())} ${MONTHS[now.getMonth()]}`
    : '';

  return (
    <header className="ceefax-header tt-text shrink-0">
      {/* Service name */}
      <div className="ceefax-header-brand">
        <span className="text-tt-red">M</span>
        <span className="text-tt-green">E</span>
        <span className="text-tt-yellow">F</span>
        <span className="text-tt-cyan">A</span>
        <span className="text-tt-magenta">X</span>
      </div>

      {/* Page number — yellow + blink while typing, cyan when settled */}
      <div className={`ceefax-header-page ${isTyping ? 'text-tt-yellow' : 'text-tt-cyan'} font-bold`}>
        {isTyping
          ? <>{pageStr.slice(0, -1)}<span className="tt-blink">_</span></>
          : pageStr
        }
      </div>

      {/* Date + time */}
      <div className="ceefax-header-clock">
        <span className="text-tt-white">{dateStr}</span>
        {dateStr && <span className="text-tt-white/40 mx-1">|</span>}
        <span className="text-tt-yellow">{timeStr}</span>
      </div>
    </header>
  );
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}
