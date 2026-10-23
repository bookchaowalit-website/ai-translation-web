// The 8-word EN/TH dictionary and the token lookup used by the page and the MCP route.

export type Direction = "en-th" | "th-en";

export const EN_TO_TH: Record<string, string> = { hello: "สวัสดี", world: "โลก", portfolio: "ผลงาน", developer: "นักพัฒนา", project: "โปรเจกต์", thank: "ขอบคุณ", you: "คุณ", today: "วันนี้" };
export const TH_TO_EN: Record<string, string> = Object.fromEntries(Object.entries(EN_TO_TH).map(([key, value]) => [value, key]));

/** The sample phrase shown when a direction is picked. */
export const SAMPLE_INPUT: Record<Direction, string> = { "en-th": "hello portfolio developer", "th-en": "สวัสดี ผลงาน นักพัฒนา" };

export function dictionaryFor(direction: Direction): Record<string, string> {
  return direction === "en-th" ? EN_TO_TH : TH_TO_EN;
}

/** Replace each whitespace-separated word found in the dictionary; unknown words and spacing stay unchanged. */
export function translate(text: string, direction: Direction): string {
  const dictionary = dictionaryFor(direction);
  return text
    .split(/(\s+)/)
    .map((token) => {
      if (/^\s+$/.test(token)) return token;
      return dictionary[token.toLowerCase()] || dictionary[token] || token;
    })
    .join("");
}

export function otherDirection(direction: Direction): Direction {
  return direction === "en-th" ? "th-en" : "en-th";
}
