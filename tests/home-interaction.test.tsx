// @vitest-environment happy-dom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import Home from "@/app/page";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root;
let host: HTMLDivElement;
const $ = <T extends Element = HTMLElement>(selector: string) => host.querySelector(selector) as T | null;
const button = (text: string) => [...host.querySelectorAll("button")].find((b) => b.textContent?.trim().startsWith(text)) as HTMLButtonElement;
const press = (el: Element) => act(() => { el.dispatchEvent(new MouseEvent("click", { bubbles: true })); });
const chip = (word: string) => [...host.querySelectorAll(".tr-vocab button")].find((b) => b.querySelector(`span[lang]`)?.textContent === word) as HTMLButtonElement;
const source = () => $<HTMLTextAreaElement>("#source-text")!;
const target = () => $<HTMLTextAreaElement>("#translation-text")!;
function type(el: HTMLTextAreaElement, value: string) {
  act(() => {
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")!.set!.call(el, value);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

beforeEach(() => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  act(() => root.render(<Home />));
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

describe("translation desk", () => {
  it("names unknown words and adds vocabulary words to the source", () => {
    expect($(".tr-unknown")).toBeNull();
    type(source(), "hello brave world");
    expect(target().value).toBe("สวัสดี brave โลก");
    expect($(".tr-unknown")!.textContent).toContain("brave");
    press(chip("today"));
    expect(source().value).toBe("hello brave world today");
    type(source(), "");
    press(chip("you"));
    expect(source().value).toBe("you");
  });

  it("keeps the unknown-words live region in the DOM before the first unknown word", () => {
    type(source(), "hello world");
    const region = $(".tr-panes [role='status']")!;
    expect(region).not.toBeNull();
    expect(region.textContent).toBe("");
    type(source(), "hello brave world");
    expect($(".tr-panes [role='status']")).toBe(region);
    expect(region.textContent).toContain("brave");
  });

  it("shows a short unknown-word preview and puts the rest behind a disclosure", () => {
    const words = Array.from({ length: 30 }, (_, i) => `zz${i}`);
    type(source(), words.join(" "));
    const preview = $(".tr-unknown")!.textContent!;
    expect(preview).toContain("zz7");
    expect(preview).not.toContain("zz8");
    expect(preview).toContain("and 22 more");
    const all = $<HTMLDetailsElement>(".tr-unknown-all")!;
    expect(all.open).toBe(false);
    expect(all.textContent).toContain("Show all 30 unknown words");
    expect(all.textContent).toContain("zz29");
  });

  it("refuses a chip that would push the text over the limit and says why", () => {
    const full = "a".repeat(4996);
    type(source(), full);
    press(chip("today"));
    expect(source().value.length).toBe(4996);
    expect($(".tr-chip-notice")!.textContent).toContain("No room to add “today”");
    press(chip("you"));
    expect(source().value.length).toBe(5000);
    expect(source().value.endsWith("a you")).toBe(true);
    expect($(".tr-chip-notice")!.textContent).toBe("");
  });

  it("shortens a very long unknown word in the preview", () => {
    type(source(), "b".repeat(300));
    expect($(".tr-unknown b")!.textContent).toBe(`${"b".repeat(40)}…`);
  });

  it("keeps a trailing line break when a chip is added", () => {
    type(source(), "hello\n");
    press(chip("today"));
    expect(source().value).toBe("hello\ntoday");
  });

  it("gives each chip an accessible name with the word and its translation", () => {
    const name = chip("today").textContent!.replace("→", "").replace(/\s+/g, " ").trim();
    expect(chip("today").hasAttribute("aria-label")).toBe(false);
    expect(name).toBe("Add today, meaning วันนี้");
  });

  it("switches direction with the sample, and swap carries the translation across", () => {
    press(button("TH → EN"));
    expect(button("TH → EN").getAttribute("aria-pressed")).toBe("true");
    expect(target().value).toBe("hello portfolio developer");
    press(button("EN → TH"));
    expect(target().value).toBe("สวัสดี ผลงาน นักพัฒนา");
    press(button("Swap direction"));
    expect(source().value).toBe("สวัสดี ผลงาน นักพัฒนา");
    expect(target().value).toBe("hello portfolio developer");
    expect(host.textContent).toContain("Thai (ไทย)");
  });
});
