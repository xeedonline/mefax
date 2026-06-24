'use client';
import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTeletextStore } from '@/store/teletext';
import TopBar from './TopBar';
import BottomBar from './BottomBar';
import PageRouter from './PageRouter';
import TVRemote from './TVRemote';

const SCREENSAVER_IDLE_MS = 5 * 60 * 1000;

interface Props { initialPage: number; }

export default function TeletextApp({ initialPage }: Props) {
  const router = useRouter();
  const {
    currentPage, crtMode, scanlineMode, flickerMode,
    navigate, addDigit, goBack, setPage,
    screensaverActive, setScreensaver,
  } = useTeletextStore();

  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (initialPage !== currentPage) setPage(initialPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    router.replace(`/${currentPage}`, { scroll: false });
  }, [currentPage, router]);

  // Screensaver idle timer
  const resetIdle = useCallback(() => {
    setScreensaver(false);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setScreensaver(true), SCREENSAVER_IDLE_MS);
  }, [setScreensaver]);

  useEffect(() => {
    resetIdle();
    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('touchstart', resetIdle);
    return () => {
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('touchstart', resetIdle);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [resetIdle]);

  useEffect(() => {
    if (!screensaverActive) return;
    const PAGES = [100, 101, 150, 200, 300, 500, 600, 1983, 999];
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % PAGES.length;
      navigate(PAGES[i]);
    }, 8000);
    return () => clearInterval(id);
  }, [screensaverActive, navigate]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const tag = (document.activeElement as HTMLElement)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    if (e.key >= '0' && e.key <= '9' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      addDigit(e.key);
      return;
    }
    switch (e.key) {
      case 'ArrowRight': case 'PageDown':
        e.preventDefault(); navigate(Math.min(currentPage + 1, 899)); break;
      case 'ArrowLeft': case 'PageUp':
        e.preventDefault(); navigate(Math.max(currentPage - 1, 100)); break;
      case 'ArrowUp':
        e.preventDefault(); navigate(Math.min(currentPage + 100, 899)); break;
      case 'ArrowDown':
        e.preventDefault(); navigate(Math.max(currentPage - 100, 100)); break;
      case 'Backspace':
        e.preventDefault(); goBack(); break;
      case 'Home':
        e.preventDefault(); navigate(100); break;
      case 'End':
        e.preventDefault(); navigate(999); break;
    }
  }, [currentPage, addDigit, navigate, goBack]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Touch swipe
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);
  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) < 50 && Math.abs(dy) < 50) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) navigate(Math.min(currentPage + 1, 899));
      else navigate(Math.max(currentPage - 1, 100));
    }
  }, [currentPage, navigate]);

  useEffect(() => {
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);

  const screenCls = [
    'flex flex-col bg-black overflow-hidden flex-1 min-h-0',
    crtMode     && 'crt-scanlines',
    flickerMode && 'crt-flicker',
  ].filter(Boolean).join(' ');

  return (
    <>
      {/* Screensaver dimmer */}
      {screensaverActive && (
        <div
          className="fixed inset-0 bg-black/40 z-[100] cursor-pointer"
          onClick={() => setScreensaver(false)}
        />
      )}

      {/* ── Outer shell ── */}
      <div className="h-dvh bg-black lg:bg-[#060606] flex flex-col lg:flex-row lg:items-center lg:justify-center overflow-hidden lg:gap-5 lg:p-4">

        {/* TV screen — full viewport on mobile, bezel on desktop */}
        <div className="tv-bezel flex flex-col flex-1 min-h-0">
          <div className={screenCls}>
            <TopBar />
            <main className="flex-1 min-h-0 overflow-hidden relative tt-text">
              <PageRouter page={currentPage} />
            </main>
            <BottomBar />
          </div>
        </div>

        {/* TV remote — desktop only */}
        <div className="hidden lg:block shrink-0 self-center overflow-y-auto" style={{ maxHeight: 'calc(100dvh - 2rem)' }}>
          <TVRemote />
        </div>

      </div>
    </>
  );
}
