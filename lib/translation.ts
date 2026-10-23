// The 8-word EN/TH dictionary and the token lookup used by the page and the MCP route.

export type Direction = "en-th" | "th-en";

export const EN_TO_TH: Record<string, string> = { hello: "สวัสดี", world: "โลก", portfolio: "ผลงาน", developer: "นักพัฒนา", project: "โปรเจกต์", thank: "ขอบคุณ", you: "คุณ", today: "วันนี้" };
export const TH_TO_EN: Record<string, string> = Object.fromEntries(Object.entries(EN_TO_TH).map(([key, value]) => [value, key]));

/** The sample phrase shown when a direction is picked. */
export const SAMPLE_INPUT: Record<Direction, string> = { "en-th": "hello portfolio developer", "th-en": "สวัสดี ผลงาน นักพัฒนา" };

export function dictionaryFor(direction: Direction): Record<string, string> {
  return direction === "en-th" ? EN_TO_TH : TH_TO_EN;
}

// Leading punctuation, the word itself (letters, Thai marks, digits), trailing punctuation.
const WORD = new RegExp("^([^\\p{L}\\p{M}\\p{N}]*)(.*?)([^\\p{L}\\p{M}\\p{N}]*)$", "su");

/** Own dictionary entries only, so words like "constructor" never resolve to Object.prototype members. */
function lookup(dictionary: Record<string, string>, word: string): string | undefined {
  if (Object.hasOwn(dictionary, word.toLowerCase())) return dictionary[word.toLowerCase()];
  if (Object.hasOwn(dictionary, word)) return dictionary[word];
  return undefined;
}

/**
 * Replace each whitespace-separated word found in the dictionary, keeping punctuation around it.
 * Unknown words and the original spacing stay unchanged.
 */
export function translate(text: string, direction: Direction): string {
  const dictionary = dictionaryFor(direction);
  return text
    .split(/(\s+)/)
    .map((token) => {
      const [, before, word, after] = WORD.exec(token) ?? ["", "", token, ""];
      const translated = word ? lookup(dictionary, word) : undefined;
      return translated === undefined ? token : `${before}${translated}${after}`;
    })
    .join("");
}

export function otherDirection(direction: Direction): Direction {
  return direction === "en-th" ? "th-en" : "en-th";
}
