import { CURRENCIES } from '../utils/currencies';
import './CurrencySelector.css';

/**
 * Three-button tab strip for switching between USD / EUR / UAH.
 * Disabled while timer is running.
 */
export default function CurrencySelector({ currency, onChange, disabled }) {
  return (
    <div className="currency-selector">
      {CURRENCIES.map(c => (
        <button
          key={c.code}
          className={`currency-btn${currency.code === c.code ? ' active' : ''}`}
          onClick={() => onChange(c)}
          disabled={disabled}
        >
          {c.symbol} {c.code}
        </button>
      ))}
    </div>
  );
}
