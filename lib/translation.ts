// The 8-word EN/TH dictionary and the token lookup used by the page and the MCP route.

export type Direction = "en-th" | "th-en";

export const EN_TO_TH: Record<string, string> = { hello: "สวัสดี", world: "โลก", portfolio: "ผลงาน", developer: "นักพัฒนา", project: "โปรเจกต์", thank: "ขอบคุณ", you: "คุณ", today: "วันนี้" };
export const TH_TO_EN: Record<string, string> = Object.fromEntries(Object.entries(EN_TO_TH).map(([key, value]) => [value, key]));

/** The sample phrase shown when a direction is picked. */
export const SAMPLE_INPUT: Record<Direction, string> = { "en-th": "hello portfolio developer", "th-en": "สวัสดี ผลงาน นักพัฒนา" };

export function dictionaryFor(direction: Direction): Record<string, string> {
  return direction === "en-th" ? EN_TO_TH : TH_TO_EN;
}

/** Longest text translate() handles; the page's textarea and the MCP route enforce the same cap. */
export const MAX_TEXT_LENGTH = 5000;

// One letter, combining mark (Thai vowels and tones) or digit.
const WORD_CHAR = new RegExp("[\\p{L}\\p{M}\\p{N}]", "u");

/**
 * Split a token into leading punctuation, the word, and trailing punctuation with two linear scans over its code
 * points (no backtracking regex, so long punctuation runs cannot cause ReDoS).
 */
export function stripPunctuation(token: string): [string, string, string] {
  const chars = Array.from(token);
  let start = 0;
  while (start < chars.length && !WORD_CHAR.test(chars[start])) start += 1;
  let end = chars.length;
  while (end > start && !WORD_CHAR.test(chars[end - 1])) end -= 1;
  return [chars.slice(0, start).join(""), chars.slice(start, end).join(""), chars.slice(end).join("")];
}

/** Own dictionary entries only, so words like "constructor" never resolve to Object.prototype members. */
function lookup(dictionary: Record<string, string>, word: string): string | undefined {
  if (Object.hasOwn(dictionary, word.toLowerCase())) return dictionary[word.toLowerCase()];
  if (Object.hasOwn(dictionary, word)) return dictionary[word];
  return undefined;
}

/**
 * Replace each whitespace-separated word found in the dictionary, keeping punctuation around it.
 * Unknown words and the original spacing stay unchanged. Only the first MAX_TEXT_LENGTH characters are used.
 */
export function translate(text: string, direction: Direction): string {
  const dictionary = dictionaryFor(direction);
  return text
    .slice(0, MAX_TEXT_LENGTH)
    .split(/(\s+)/)
    .map((token) => {
      const [before, word, after] = stripPunctuation(token);
      const translated = word ? lookup(dictionary, word) : undefined;
      return translated === undefined ? token : `${before}${translated}${after}`;
    })
    .join("");
}

export function otherDirection(direction: Direction): Direction {
  return direction === "en-th" ? "th-en" : "en-th";
}
