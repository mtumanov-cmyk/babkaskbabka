import { useState, useEffect, useRef, useCallback } from 'react';
import MeetingForm from './components/MeetingForm';
import MeetingDisplay from './components/MeetingDisplay';
import { calcCost } from './utils/calcCost';

export default function App() {
  // ── Form state (strings to avoid NaN in controlled inputs) ───────────────
  const [participantsStr, setParticipantsStr] = useState('2');
  const [rateStr, setRateStr] = useState('50');

  // ── Timer state ───────────────────────────────────────────────────────────
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0); // total seconds displayed

  // Ref holds the accumulated seconds at the moment of last Start click.
  // Using ref (not state) so the interval closure always reads the fresh value
  // without re-creating the effect.
  const baseElapsedRef = useRef(0);

  // ── Derived values ────────────────────────────────────────────────────────
  const participants = Number(participantsStr);
  const rate = Number(rateStr);

  const isValid =
    participantsStr !== '' && !isNaN(participants) && participants >= 1 &&
    rateStr !== ''         && !isNaN(rate)         && rate >= 0;

  const cost = isValid ? calcCost(elapsed, participants, rate) : 0;

  // ── Timer effect: starts/stops interval when isRunning changes ────────────
  useEffect(() => {
    if (!isRunning) return;

    const startTimestamp = Date.now();

    const id = setInterval(() => {
      setElapsed(
        baseElapsedRef.current + Math.floor((Date.now() - startTimestamp) / 1000)
      );
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleStartStop = useCallback(() => {
    if (isRunning) {
      // Freeze the current elapsed before stopping so it persists on next Start
      baseElapsedRef.current = elapsed;
      setIsRunning(false);
    } else {
      setIsRunning(true);
    }
  }, [isRunning, elapsed]);

  const handleReset = useCallback(() => {
    baseElapsedRef.current = 0;
    setIsRunning(false);
    setElapsed(0);
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="page">
      <header className="page-header">
        <span className="logo">
          <span className="logo-dot" />
          Грошопал
        </span>
      </header>

      <main className="card">
        <div className="card-header">
          <h1 className="card-title">Калькулятор вартості зустрічі</h1>
          <p className="card-subtitle">
            Введіть кількість учасників та ставку — і побачите в реальному часі,
            скільки коштує ваша зустріч.
          </p>
        </div>

        <MeetingForm
          participantsStr={participantsStr}
          rateStr={rateStr}
          isRunning={isRunning}
          onParticipantsChange={setParticipantsStr}
          onRateChange={setRateStr}
        />

        <MeetingDisplay
          elapsed={elapsed}
          cost={cost}
          isRunning={isRunning}
        />

        <div className="controls">
          <button
            className={`btn btn-primary${isRunning ? ' running' : ''}`}
            onClick={handleStartStop}
            disabled={!isValid}
          >
            {isRunning ? 'Зупинити' : 'Почати зустріч'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleReset}
          >
            Скинути
          </button>
        </div>
      </main>

      <footer className="page-footer">Дані зберігаються локально</footer>
    </div>
  );
}
