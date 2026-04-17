import { formatTime } from '../utils/formatTime';
import './MeetingDisplay.css';

/** Returns CSS class based on cost thresholds (work.ua palette). */
function getCostColorClass(cost) {
  if (cost < 10) return 'green';
  if (cost < 50) return 'yellow';
  return 'red';
}

/**
 * Displays live elapsed time, burned cost, and running status badge.
 */
export default function MeetingDisplay({ elapsed, cost, isRunning }) {
  const colorClass = getCostColorClass(cost);

  return (
    <div className="meeting-display">
      <div className="display-cost-wrap">
        <span className="display-label">Спалено</span>
        <div className={`cost ${colorClass}`}>
          ${cost.toFixed(2)}
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
  );
}
