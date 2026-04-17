/**
 * Generates a CSV file from meeting history and triggers browser download.
 * @param {Array} history
 */
export function exportToCsv(history) {
  if (!history.length) return;

  const headers = ['Дата', 'Учасники', 'Ставка', 'Валюта', 'Тривалість', 'Сума'];
  const rows = history.map(r => [
    `"${r.date}"`,
    r.participants,
    r.rate,
    r.currencyCode,
    r.duration,
    r.cost.toFixed(2),
  ]);

  const csv = [headers, ...rows].map(row => row.join(',')).join('\n');

  // BOM for correct Ukrainian characters in Excel
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'groshpal-history.csv';
  a.click();
  URL.revokeObjectURL(url);
}
