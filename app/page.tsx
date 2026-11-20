"use client";

import { useMemo, useState } from "react";
import { AppFoot, AppTop, Pill } from "@/components/app-shell";
import { MAX_TEXT_LENGTH, SAMPLE_INPUT, dictionaryFor, otherDirection, translate, unknownWords, type Direction } from "@/lib/translation";

// Long pastes can hold hundreds of unknown words; show a few, cut short, so the translation stays near on phones.
// The full list opens below both panes, never between the source and the translation.
const UNKNOWN_PREVIEW = 5;
const UNKNOWN_CUT = 24;
const cut = (word: string) => (word.length > UNKNOWN_CUT ? `${word.slice(0, UNKNOWN_CUT)}…` : word);
const SOURCE = "https://github.com/bookchaowalit-website/ai-translation-web";
const LABEL: Record<Direction, { from: string; to: string; lang: string; toLang: string }> = {
  "en-th": { from: "English", to: "Thai (ไทย)", lang: "en", toLang: "th" },
  "th-en": { from: "Thai (ไทย)", to: "English", lang: "th", toLang: "en" },
};

export default function Home() {
  const [direction, setDirection] = useState<Direction>("en-th");
  const [input, setInput] = useState(SAMPLE_INPUT["en-th"]);
  const output = useMemo(() => translate(input, direction), [direction, input]);
  const unknown = useMemo(() => unknownWords(input, direction), [direction, input]);
  const vocabulary = Object.entries(dictionaryFor(direction));
  const label = LABEL[direction];

  const [chipNotice, setChipNotice] = useState("");
  const pick = (next: Direction) => {
    setChipNotice("");
    setDirection(next);
    setInput(SAMPLE_INPUT[next]);
  };
  const swap = () => {
    setChipNotice("");
    setDirection(otherDirection);
    setInput(output);
  };
  const addWord = (word: string) => {
    const next = input === "" ? word : /\s$/.test(input) ? `${input}${word}` : `${input} ${word}`;
    if (next.length > MAX_TEXT_LENGTH) {
      setChipNotice(`No room to add “${word}”: the text is at the ${MAX_TEXT_LENGTH} character limit.`);
      return;
    }
    setChipNotice("");
    setInput(next);
  };
  const shown = unknown.slice(0, UNKNOWN_PREVIEW);
  const hidden = unknown.length - shown.length;
  const showAll = hidden > 0 || shown.some((word) => word.length > UNKNOWN_CUT);

  return (
    <div className="as">
      <a className="as-skip" href="#source-text">Skip to the text</a>
      <AppTop name="Translation" tagline="English ↔ Thai dictionary demo" />

      <main className="as-page">
        <div className="as-intro">
          <p className="as-eyebrow">Two languages, one small vocabulary</p>
          <h1>Make the meaning cross the table.</h1>
          <p>Type a phrase and each word the dictionary knows is swapped. It is a lookup of {vocabulary.length} words, not machine translation.</p>
          <Pill tone="grey">Dictionary lookup · no AI model, no API</Pill>
        </div>

        <div className="tr-rail">
          <div className="as-segmented-wrap">
            <span id="direction-label">Direction</span>
            <div className="as-segmented" role="group" aria-labelledby="direction-label">
              <button type="button" aria-pressed={direction === "en-th"} onClick={() => pick("en-th")}>EN → TH</button>
              <button type="button" aria-pressed={direction === "th-en"} onClick={() => pick("th-en")}>TH → EN</button>
            </div>
          </div>
          <button type="button" className="as-plain" onClick={swap}>Swap direction and text</button>
        </div>

        <div className="tr-panes">
          <section className="as-composer tr-card" aria-label="Source">
            <label className="as-field" htmlFor="source-text">
              <span className="tr-label"><span>{label.from}</span><span className="tr-meta">{input.length} / {MAX_TEXT_LENGTH} characters</span></span>
              <textarea id="source-text" lang={label.lang} maxLength={MAX_TEXT_LENGTH} value={input} onChange={(event) => { setChipNotice(""); setInput(event.target.value); }} placeholder="Write a phrase" />
            </label>
            {/* The live region stays in the DOM so the first unknown word is announced too. */}
            <div role="status">
              {unknown.length ? (
                <p className="tr-unknown">
                  Not in the dictionary, left unchanged: {shown.map((word, i) => <span key={word}>{i ? ", " : ""}<b lang={label.lang}>{cut(word)}</b></span>)}
                  {hidden ? ` and ${hidden} more` : null}{showAll ? " (full list below the translation)" : null}
                </p>
              ) : null}
            </div>
          </section>

          <section className="as-composer tr-card" aria-label="Translation">
            <label className="as-field" htmlFor="translation-text">
              <span className="tr-label"><span>{label.to}</span><span className="tr-meta">{output.length} characters</span></span>
              <textarea id="translation-text" lang={label.toLang} readOnly value={output} placeholder="The translation appears here" />
            </label>
          </section>
        </div>

        {showAll ? (
          <details className="tr-unknown-all" id="unknown-all">
            <summary>Show all {unknown.length} unknown {unknown.length === 1 ? "word" : "words"} in full</summary>
            <p lang={label.lang}>{unknown.join(", ")}</p>
          </details>
        ) : null}

        <section className="tr-vocab" aria-labelledby="vocab-heading">
          <h2 id="vocab-heading">Words it knows (tap to add)</h2>
          <ul role="list">
            {vocabulary.map(([from, to]) => (
              <li key={from}><button type="button" onClick={() => addWord(from)}><span className="sr-only">Add </span><span lang={label.lang}>{from}</span><span aria-hidden="true">→</span><span className="sr-only">, meaning </span><span lang={label.toLang}>{to}</span></button></li>
            ))}
          </ul>
          <p className="tr-chip-notice" role="status">{chipNotice}</p>
        </section>

        <p className="as-note">Unknown words stay unchanged so the demo never pretends to know more than its dictionary. Nothing is saved or sent anywhere.</p>
      </main>
      <AppFoot source={SOURCE} />
    </div>
  );
}
