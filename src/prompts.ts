// One gratitude prompt per day. The prompt for a day is picked from the day of the year,
// so every day shows a different one and the list repeats after its last prompt.
export const PROMPTS: string[] = [
  'Something small that went well today.',
  'A person who made your day a little easier.',
  'Something your body did for you today.',
  'A place you are glad to be in.',
  'Something you learned recently.',
  'A kind word you heard or said.',
  'Something from nature that lifted your mood.',
  'A comfort you often take for granted.',
  'A moment of quiet you enjoyed.',
  'Something you are looking forward to.',
  'A skill or talent you are thankful for.',
  'Something that made you laugh.',
  'A song, book or film that stayed with you.',
  'Something you were able to do for someone else.',
  'A challenge that taught you something.',
  'Something good in your home.',
  'A tool or invention that makes life easier.',
  'A friend, past or present, you are grateful for.',
  'Something about today you would like to remember.',
  'A taste or smell you enjoyed.',
  'Your health, in one small way.',
  'Something you finished, however small.',
  'A teacher, colleague or mentor who helped you.',
  'A choice you made that you are glad about.',
  'The weather, or the light, today.',
  'Something you forgave, or were forgiven for.',
  'A routine that helps you through the day.',
  'Something new you tried.',
  'A memory that makes you smile.',
  'Something you were allowed to rest from.',
  'A reason to feel hopeful about tomorrow.',
];

// Day of the year, 0 for 1 January. Counted in whole days from UTC dates, so daylight saving does not shift it.
export const dayOfYear = (date: Date): number => {
  const day = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const newYearEve = Date.UTC(date.getFullYear(), 0, 0);
  return Math.round((day - newYearEve) / (1000 * 60 * 60 * 24)) - 1;
};

export const promptForDay = (date: Date): string => {
  const index = ((dayOfYear(date) % PROMPTS.length) + PROMPTS.length) % PROMPTS.length;
  return PROMPTS[index];
};

// The last seven days, today first, for the list on the full page.
export const recentDays = (today: Date) =>
  Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    return { date, prompt: promptForDay(date) };
  });
