import './MeetingForm.css';

/**
 * Controlled form for meeting parameters.
 * Inputs are disabled while timer is running.
 */
export default function MeetingForm({
  participantsStr,
  rateStr,
  isRunning,
  onParticipantsChange,
  onRateChange,
}) {
  return (
    <div className="meeting-form">
      <div className="form-group">
        <label className="form-label" htmlFor="participants">
          Кількість учасників
        </label>
        <input
          className="form-control"
          id="participants"
          type="number"
          min="1"
          step="1"
          placeholder="наприклад, 5"
          value={participantsStr}
          disabled={isRunning}
          onChange={e => onParticipantsChange(e.target.value)}
        />
        <span className="form-hint">осіб на зустрічі</span>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="rate">
          Середня годинна ставка
        </label>
        <input
          className="form-control"
          id="rate"
          type="number"
          min="0"
          step="1"
          placeholder="наприклад, 50"
          value={rateStr}
          disabled={isRunning}
          onChange={e => onRateChange(e.target.value)}
        />
        <span className="form-hint">$/год на одну особу</span>
      </div>
    </div>
  );
}
