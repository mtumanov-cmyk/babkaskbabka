import { useState, useEffect, useRef, useCallback } from 'react';
import MeetingForm from './components/MeetingForm';
import MeetingDisplay from './components/MeetingDisplay';
import CurrencySelector from './components/CurrencySelector';
import MeetingHistory from './components/MeetingHistory';
import { calcCost } from './utils/calcCost';
import { formatTime } from './utils/formatTime';
import { DEFAULT_CURRENCY } from './utils/currencies';

const LS_KEY = 'groshpal-history';

// Load history from localStorage on first render
function loadHistory() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function App() {
  // ── Form state ────────────────────────────────────────────────────────────
  const [participantsStr, setParticipantsStr] = useState('2');
  const [rateStr, setRateStr] = useState('50');
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);

  // ── Timer state ───────────────────────────────────────────────────────────
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  // Accumulated seconds at the moment the timer was last paused
  const baseElapsedRef = useRef(0);

  // ── History (persisted in localStorage) ──────────────────────────────────
  const [history, setHistory] = useState(loadHistory);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(history));
  }, [history]);

  // ── Derived values ────────────────────────────────────────────────────────
  const participants = Number(participantsStr);
  const rate         = Number(rateStr);

  const isValid =
    participantsStr !== '' && !isNaN(participants) && participants >= 1 &&
    rateStr         !== '' && !isNaN(rate)         && rate >= 0;

  const cost = isValid ? calcCost(elapsed, participants, rate) : 0;

  // ── Timer effect ──────────────────────────────────────────────────────────
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
      baseElapsedRef.current = elapsed;
      setIsRunning(false);

      // Save meeting record to history
      const record = {
        id:           Date.now(),
        date:         new Date().toLocaleString('uk-UA'),
        participants,
        rate,
        currencyCode: currency.code,
        symbol:       currency.symbol,
        elapsed,
        duration:     formatTime(elapsed),
        cost:         calcCost(elapsed, participants, rate),
      };
      setHistory(prev => [record, ...prev]);
    } else {
      setIsRunning(true);
    }
  }, [isRunning, elapsed, participants, rate, currency]);

  const handleReset = useCallback(() => {
    baseElapsedRef.current = 0;
    setIsRunning(false);
    setElapsed(0);
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
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

        <CurrencySelector
          currency={currency}
          onChange={setCurrency}
          disabled={isRunning}
        />

        <MeetingForm
          participantsStr={participantsStr}
          rateStr={rateStr}
          isRunning={isRunning}
          currency={currency}
          onParticipantsChange={setParticipantsStr}
          onRateChange={setRateStr}
        />

        <MeetingDisplay
          elapsed={elapsed}
          cost={cost}
          isRunning={isRunning}
          currency={currency}
        />

        <div className="controls">
          <button
            className={`btn btn-primary${isRunning ? ' running' : ''}`}
            onClick={handleStartStop}
            disabled={!isValid}
          >
            {isRunning ? 'Зупинити' : 'Почати зустріч'}
          </button>
          <button className="btn btn-secondary" onClick={handleReset}>
            Скинути
          </button>
        </div>
      </main>

      <MeetingHistory history={history} onClear={handleClearHistory} />

      <footer className="page-footer">Дані зберігаються локально</footer>
    </div>
  );
}
