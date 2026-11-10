import { describe, expect, it } from 'vitest';
import { PROMPT_COUNT, dayOfYear, promptForDay, recentDays } from '../prompts';

describe('the gratitude prompts', () => {
  it('counts the day of the year from 0 on 1 January', () => {
    expect(dayOfYear(new Date(2026, 0, 1))).toBe(0);
    expect(dayOfYear(new Date(2026, 1, 1))).toBe(31);
  });

  it('gives a different prompt on consecutive days', () => {
    expect(promptForDay(new Date(2026, 5, 1))).not.toBe(promptForDay(new Date(2026, 5, 2)));
  });

  it('repeats after the last prompt', () => {
    expect(promptForDay(new Date(2026, 0, 1 + PROMPT_COUNT))).toBe(promptForDay(new Date(2026, 0, 1)));
  });

  it('lists seven days, today first', () => {
    const days = recentDays(new Date(2026, 5, 10));
    expect(days).toHaveLength(7);
    expect(days[0].date.getDate()).toBe(10);
    expect(days[6].date.getDate()).toBe(4);
  });
});
