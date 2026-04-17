import { formatTime } from '../utils/formatTime';
import './MeetingDisplay.css';

/**
 * Threshold is compared in USD equivalent so it's currency-independent.
 * Trigger: green < $50, yellow < $100, red >= $100 (alarm).
 */
function getCostColorClass(cost, currencyRate) {
  const usd = cost / currencyRate;
  if (usd < 50)  return 'green';
  if (usd < 100) return 'yellow';
  return 'red';
}

export default function MeetingDisplay({ elapsed, cost, isRunning, currency }) {
  const colorClass = getCostColorClass(cost, currency.rate);
  const isAlarm = cost / currency.rate >= 100;

  return (
    <div className={`meeting-display${isAlarm ? ' alarm' : ''}`}>
      {isAlarm && (
        <div className="alarm-banner">
          🔥 Зустріч вже коштує {currency.symbol}{cost.toFixed(2)} — час завершувати!
        </div>
      )}

      <div className="display-body">
        <div className="display-cost-wrap">
          <span className="display-label">Спалено</span>
          <div className={`cost ${colorClass}`}>
            {currency.symbol}{cost.toFixed(2)}
          </div>
        </div>

        <div className="display-timer-wrap">
          <span className="display-label">Тривалість</span>
          <div className="timer">{formatTime(elapsed)}</div>
          <span className={`badge ${isRunning ? 'badge-running' : 'badge-idle'}`}>
            <span className="badge-dot" />
            {isRunning ? 'Іде зустріч' : 'Очікування'}
          </span>
        </div>
      </div>
    </div>
  );
}
