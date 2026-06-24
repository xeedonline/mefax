'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FastTextLinks } from '@/types';

interface TeletextStore {
  currentPage: number;
  inputBuffer: string;
  crtMode: boolean;
  scanlineMode: boolean;
  flickerMode: boolean;
  audioEnabled: boolean;
  fastTextLinks: FastTextLinks;
  pageHistory: number[];
  screensaverActive: boolean;

  navigate: (page: number) => void;
  goBack: () => void;
  addDigit: (digit: string) => void;
  clearInput: () => void;
  backspaceInput: () => void;
  toggleCRT: () => void;
  toggleScanlines: () => void;
  toggleFlicker: () => void;
  toggleAudio: () => void;
  setFastTextLinks: (links: FastTextLinks) => void;
  setPage: (page: number) => void;
  setScreensaver: (active: boolean) => void;
}

export const useTeletextStore = create<TeletextStore>()(
  persist(
    (set, get) => ({
      currentPage: 100,
      inputBuffer: '',
      crtMode: false,
      scanlineMode: false,
      flickerMode: false,
      audioEnabled: false,
      fastTextLinks: {},
      pageHistory: [100],
      screensaverActive: false,

      setPage: (page) => set({ currentPage: page, inputBuffer: '' }),

      navigate: (page) =>
        set((s) => ({
          currentPage: page,
          inputBuffer: '',
          fastTextLinks: {},
          pageHistory: [...s.pageHistory.slice(-30), page],
          screensaverActive: false,
        })),

      goBack: () =>
        set((s) => {
          const hist = s.pageHistory;
          if (hist.length < 2) return {};
          const next = [...hist];
          next.pop();
          const prev = next[next.length - 1] ?? 100;
          return { currentPage: prev, pageHistory: next, inputBuffer: '' };
        }),

      addDigit: (digit) => {
        const { inputBuffer } = get();
        const newBuf = inputBuffer + digit;

        if (newBuf.length === 4) {
          const page = parseInt(newBuf, 10);
          set((s) => ({
            currentPage: page,
            inputBuffer: '',
            fastTextLinks: {},
            pageHistory: [...s.pageHistory.slice(-30), page],
          }));
          return;
        }

        if (newBuf.length === 3) {
          const page = parseInt(newBuf, 10);
          // If this is a valid normal 3-digit page, navigate immediately
          // unless it might be the start of 1983 (starts with "198")
          if (newBuf === '198') {
            set({ inputBuffer: newBuf });
          } else {
            set((s) => ({
              currentPage: page,
              inputBuffer: '',
              fastTextLinks: {},
              pageHistory: [...s.pageHistory.slice(-30), page],
            }));
          }
          return;
        }

        set({ inputBuffer: newBuf });
      },

      clearInput: () => set({ inputBuffer: '' }),

      backspaceInput: () =>
        set((s) => ({ inputBuffer: s.inputBuffer.slice(0, -1) })),

      toggleCRT: () => set((s) => ({ crtMode: !s.crtMode })),
      toggleScanlines: () => set((s) => ({ scanlineMode: !s.scanlineMode })),
      toggleFlicker: () => set((s) => ({ flickerMode: !s.flickerMode })),
      toggleAudio: () => set((s) => ({ audioEnabled: !s.audioEnabled })),

      setFastTextLinks: (links) => set({ fastTextLinks: links }),
      setScreensaver: (active) => set({ screensaverActive: active }),
    }),
    {
      name: 'teletext-prefs',
      partialize: (s) => ({
        crtMode: s.crtMode,
        scanlineMode: s.scanlineMode,
        flickerMode: s.flickerMode,
        audioEnabled: s.audioEnabled,
      }),
    }
  )
);
