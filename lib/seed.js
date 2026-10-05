/* Seed e validazione delle comande demo (dati di esempio, nessun servizio reale). */
export const seed = [
  { id: 101, place: 21, items: [['Acqua', 2]], cents: 400, status: 0, time: '12:24' },
  { id: 102, place: 12, items: [['Toast', 2], ['Spritz', 1]], cents: 2100, status: 1, time: '12:20' },
  { id: 103, place: 8, items: [['Spritz', 1]], cents: 600, status: 2, time: '12:18' },
];

export const cloneSeed = () => JSON.parse(JSON.stringify(seed));

export function valid(orders) {
  return (
    Array.isArray(orders) &&
    orders.length <= 30 &&
    orders.every(
      (o) =>
        o &&
        Number.isInteger(o.id) && o.id > 0 &&
        Number.isInteger(o.place) && o.place > 0 &&
        Number.isInteger(o.cents) && o.cents > 0 &&
        Number.isInteger(o.status) && o.status >= 0 && o.status <= 3 &&
        typeof o.time === 'string' &&
        Array.isArray(o.items) && o.items.length > 0 &&
        o.items.every((item) => Array.isArray(item) && typeof item[0] === 'string' && Number.isInteger(item[1]) && item[1] > 0)
    )
  );
}
