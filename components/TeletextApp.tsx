'use client';
import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTeletextStore } from '@/store/teletext';
import TopBar from './TopBar';
import BottomBar from './BottomBar';
import PageRouter from './PageRouter';

const SCREENSAVER_IDLE_MS = 5 * 60 * 1000; // 5 minutes

interface Props {
  initialPage: number;
}

export default function TeletextApp({ initialPage }: Props) {
  const router = useRouter();
  const {
    currentPage,
    crtMode,
    scanlineMode,
    flickerMode,
    navigate,
    addDigit,
    goBack,
    setPage,
    screensaverActive,
    setScreensaver,
  } = useTeletextStore();

  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialise page from URL on first mount
  useEffect(() => {
    if (initialPage !== currentPage) {
      setPage(initialPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync URL whenever page changes
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

  // Screensaver: cycle pages every 8 seconds
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
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      // Digit keys → Teletext page input
      if (e.key >= '0' && e.key <= '9' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        addDigit(e.key);
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault();
          navigate(Math.min(currentPage + 1, 899));
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          navigate(Math.max(currentPage - 1, 100));
          break;
        case 'ArrowUp':
          e.preventDefault();
          navigate(Math.min(currentPage + 100, 899));
          break;
        case 'ArrowDown':
          e.preventDefault();
          navigate(Math.max(currentPage - 100, 100));
          break;
        case 'Backspace':
          e.preventDefault();
          goBack();
          break;
        case 'Home':
          e.preventDefault();
          navigate(100);
          break;
        case 'End':
          e.preventDefault();
          navigate(999);
          break;
      }
    },
    [currentPage, addDigit, navigate, goBack]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Touch swipe navigation
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!touchStart.current) return;
      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      const dy = e.changedTouches[0].clientY - touchStart.current.y;
      touchStart.current = null;
      if (Math.abs(dx) < 50 && Math.abs(dy) < 50) return; // too small
      if (Math.abs(dx) > Math.abs(dy)) {
        // horizontal swipe
        if (dx < 0) navigate(Math.min(currentPage + 1, 899)); // swipe left → next
        else navigate(Math.max(currentPage - 1, 100));          // swipe right → prev
      }
    },
    [currentPage, navigate]
  );

  useEffect(() => {
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);

  return (
    <div
      className={[
        'flex flex-col h-dvh bg-black overflow-hidden',
        crtMode      && 'crt-scanlines',
        flickerMode  && 'crt-flicker',
      ].filter(Boolean).join(' ')}
    >
      <TopBar />
      <main className="flex-1 overflow-hidden relative tt-text">
        <PageRouter page={currentPage} />
      </main>
      <BottomBar />

      {/* Screensaver dimmer */}
      {screensaverActive && (
        <div
          className="absolute inset-0 bg-black/30 z-50 cursor-pointer"
          onClick={() => setScreensaver(false)}
          title="Click to exit screensaver"
        />
      )}
    </div>
  );
}
