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
    press($("[aria-label='Add today']")!);
    expect(source().value).toBe("hello brave world today");
    type(source(), "");
    press($("[aria-label='Add you']")!);
    expect(source().value).toBe("you");
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
