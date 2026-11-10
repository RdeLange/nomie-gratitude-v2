import { t, type Key } from './i18n/index.svelte';
// One gratitude prompt per day. The prompt for a day is picked from the day of the year,
// so every day shows a different one and the list repeats after its last prompt.
// The prompts are kept in the translation files, as prompt01 to prompt31 (src/i18n).
export const PROMPT_COUNT = 31;

// Day of the year, 0 for 1 January. Counted in whole days from UTC dates, so daylight saving does not shift it.
export const dayOfYear = (date: Date): number => {
  const day = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const newYearEve = Date.UTC(date.getFullYear(), 0, 0);
  return Math.round((day - newYearEve) / (1000 * 60 * 60 * 24)) - 1;
};

export const promptForDay = (date: Date): string => {
  const index = ((dayOfYear(date) % PROMPT_COUNT) + PROMPT_COUNT) % PROMPT_COUNT;
  return t(`prompt${String(index + 1).padStart(2, '0')}` as Key);
};

// The last seven days, today first, for the list on the full page.
export const recentDays = (today: Date) =>
  Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    return { date, prompt: promptForDay(date) };
  });
