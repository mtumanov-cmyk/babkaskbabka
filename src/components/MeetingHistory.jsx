import { exportToCsv } from '../utils/exportCsv';
import './MeetingHistory.css';

/**
 * Table of past meetings saved during this session.
 * Persisted via Local Storage (managed in App.jsx).
 */
export default function MeetingHistory({ history, onClear }) {
  if (!history.length) return null;

  return (
    <section className="history-card">
      <div className="history-header">
        <h2 className="history-title">Історія зустрічей</h2>
        <div className="history-actions">
          <button className="btn-export" onClick={() => exportToCsv(history)}>
            Експорт CSV
          </button>
          <button className="btn-clear" onClick={onClear}>
            Очистити
          </button>
        </div>
      </div>

      <div className="history-table-wrap">
        <table className="history-table">
          <thead>
            <tr>
              <th>Дата</th>
              <th>Учасники</th>
              <th>Ставка</th>
              <th>Тривалість</th>
              <th>Сума</th>
            </tr>
          </thead>
          <tbody>
            {history.map(r => (
              <tr key={r.id}>
                <td>{r.date}</td>
                <td>{r.participants} ос.</td>
                <td>{r.symbol}{r.rate}/год</td>
                <td className="mono">{r.duration}</td>
                <td className="cost-cell">{r.symbol}{r.cost.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
