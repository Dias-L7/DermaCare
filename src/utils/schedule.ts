export type DayItem = {
  offset: number;
  date: Date;
};

export function getDays(count: number): DayItem[] {
  const result: DayItem[] = [];
  for (let offset = 0; offset < count; offset += 1) {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    result.push({ offset, date });
  }
  return result;
}
