'use client';
import { useTeletextStore } from '@/store/teletext';

export default function TVRemote() {
  const {
    navigate, addDigit, goBack,
    fastTextLinks, currentPage,
    crtMode, scanlineMode, flickerMode,
    toggleCRT, toggleScanlines, toggleFlicker,
  } = useTeletextStore();

  const fl = fastTextLinks;

  return (
    <div className="remote-body flex flex-col" style={{ gap: '9px' }}>

      {/* IR emitter */}
      <div className="flex justify-center">
        <div className="remote-ir" />
      </div>

      {/* Brand */}
      <div className="text-center tracking-[0.25em] remote-brand-text">
        <span className="text-tt-red">M</span>
        <span className="text-tt-green">E</span>
        <span className="text-tt-yellow">F</span>
        <span className="text-tt-cyan">A</span>
        <span className="text-tt-magenta">X</span>
      </div>

      {/* FastText color buttons */}
      <div className="grid grid-cols-4 gap-[4px]">
        <button className="rbtn rbtn-red"  onClick={() => fl.red    && navigate(fl.red.page)}>RED</button>
        <button className="rbtn rbtn-grn"  onClick={() => fl.green  && navigate(fl.green.page)}>GRN</button>
        <button className="rbtn rbtn-ylw"  onClick={() => fl.yellow && navigate(fl.yellow.page)}>YLW</button>
        <button className="rbtn rbtn-blu"  onClick={() => fl.blue   && navigate(fl.blue.page)}>BLU</button>
      </div>

      <div className="remote-divider" />

      {/* Navigation cross */}
      <div className="flex flex-col items-center" style={{ gap: '3px' }}>
        {/* Up */}
        <button className="rbtn rbtn-nav" onClick={() => navigate(Math.min(currentPage + 100, 899))}>▲</button>
        {/* Middle row */}
        <div className="flex items-center" style={{ gap: '3px' }}>
          <button className="rbtn rbtn-nav" onClick={() => navigate(Math.max(currentPage - 1, 100))}>◄</button>
          <button className="rbtn rbtn-nav rbtn-ok" onClick={() => navigate(100)}>OK</button>
          <button className="rbtn rbtn-nav" onClick={() => navigate(Math.min(currentPage + 1, 899))}>►</button>
        </div>
        {/* Down */}
        <button className="rbtn rbtn-nav" onClick={() => navigate(Math.max(currentPage - 100, 100))}>▼</button>
      </div>

      <div className="remote-divider" />

      {/* Function buttons */}
      <div className="grid grid-cols-3 gap-[4px]">
        <button className="rbtn rbtn-fn" onClick={() => navigate(100)}>TEXT</button>
        <button className="rbtn rbtn-fn">HOLD</button>
        <button className="rbtn rbtn-fn" onClick={() => navigate(999)}>MIX</button>
      </div>

      {/* Number keypad */}
      <div className="grid grid-cols-3 gap-[4px]">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
          <button key={n} className="rbtn rbtn-num" onClick={() => addDigit(String(n))}>{n}</button>
        ))}
        <button className="rbtn rbtn-fn" style={{ fontSize: '9px' }} onClick={() => navigate(1983)}>1983</button>
        <button className="rbtn rbtn-num" onClick={() => addDigit('0')}>0</button>
        <button className="rbtn rbtn-fn" onClick={goBack}>⌫</button>
      </div>

      <div className="remote-divider" />

      {/* CRT effect toggles */}
      <div className="grid grid-cols-3 gap-[4px]">
        <button className={`rbtn rbtn-fn ${crtMode      ? 'rbtn-on' : ''}`} onClick={toggleCRT}>CRT</button>
        <button className={`rbtn rbtn-fn ${scanlineMode ? 'rbtn-on' : ''}`} onClick={toggleScanlines}>SCAN</button>
        <button className={`rbtn rbtn-fn ${flickerMode  ? 'rbtn-on' : ''}`} onClick={toggleFlicker}>FLKR</button>
      </div>

      {/* Index / back shortcuts */}
      <div className="grid grid-cols-2 gap-[4px]">
        <button className="rbtn rbtn-fn" onClick={() => navigate(100)}>INDEX</button>
        <button className="rbtn rbtn-fn" onClick={goBack}>BACK</button>
      </div>
    </div>
  );
}
