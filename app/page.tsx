"use client";

import { useMemo, useState } from "react";
import { EN_TO_TH, SAMPLE_INPUT, otherDirection, translate, type Direction } from "@/lib/translation";

export default function Home() {
  const [direction, setDirection] = useState<Direction>("en-th");
  const [input, setInput] = useState(SAMPLE_INPUT["en-th"]);
  const output = useMemo(() => translate(input, direction), [direction, input]);
  const swap = () => { setDirection(otherDirection); setInput(output); };
  const sourceLabel = direction === "en-th" ? "English / source" : "ไทย / source";
  const targetLabel = direction === "en-th" ? "ไทย / translation" : "English / translation";
  return <div className="language-desk"><main className="language-shell"><nav className="language-nav"><span className="language-mark">LANGUAGE DESK / EN · TH</span><span>Dictionary demo · local only</span></nav><header className="language-hero"><div><div className="desk-note">Two languages / one small vocabulary</div><h1>Make the meaning cross the table.</h1></div><p className="hero-aside"><strong>{Object.keys(EN_TO_TH).length}</strong> mapped words<br />dictionary lookup, not production NMT</p></header><section className="language-rail" aria-label="Translation direction"><span className="direction-label">Direction</span><button type="button" className={`direction-button ${direction === "en-th" ? "is-active" : ""}`} onClick={() => { setDirection("en-th"); setInput(SAMPLE_INPUT["en-th"]); }}>EN → TH</button><button type="button" className={`direction-button ${direction === "th-en" ? "is-active" : ""}`} onClick={() => { setDirection("th-en"); setInput(SAMPLE_INPUT["th-en"]); }}>TH → EN</button><button className="swap-button" type="button" onClick={swap} aria-label="Swap translation direction">Swap</button></section><section className="translation-workbench" aria-label="Translation workbench"><div className="text-pane-wrap"><label className="pane-label" htmlFor="source-text"><span>{sourceLabel}</span><span className="char-count">{input.length} chars</span></label><textarea id="source-text" className="text-pane" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Write a phrase" /></div><div className="workbench-arrow" aria-hidden="true">TO</div><div className="text-pane-wrap"><label className="pane-label" htmlFor="translation-text"><span>{targetLabel}</span><span className="char-count">{output.length} chars</span></label><textarea id="translation-text" className="text-pane output" readOnly value={output} aria-label="Translation result" /></div></section><footer className="translation-footer"><span>Unknown words stay unchanged so the demo never pretends to know more than its dictionary.</span><span>State is not saved.</span></footer></main></div>;
}
