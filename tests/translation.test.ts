import { describe, expect, it } from "vitest";
import { EN_TO_TH, SAMPLE_INPUT, TH_TO_EN, dictionaryFor, otherDirection, translate } from "@/lib/translation";

describe("translate", () => {
  it("maps every known English word to Thai, ignoring case", () => {
    expect(translate("Hello WORLD", "en-th")).toBe("สวัสดี โลก");
    expect(translate(SAMPLE_INPUT["en-th"], "en-th")).toBe("สวัสดี ผลงาน นักพัฒนา");
  });

  it("maps Thai back to lower-case English", () => {
    expect(translate(SAMPLE_INPUT["th-en"], "th-en")).toBe("hello portfolio developer");
  });

  it("keeps unknown words and the original spacing", () => {
    expect(translate("hello  brave\nworld", "en-th")).toBe("สวัสดี  brave\nโลก");
    expect(translate("", "en-th")).toBe("");
  });

  it("never returns built-in object properties for words like constructor or toString", () => {
    expect(translate("constructor toString __proto__ hasOwnProperty", "en-th")).toBe("constructor toString __proto__ hasOwnProperty");
    expect(translate("valueOf", "th-en")).toBe("valueOf");
  });

  it("translates a known word that has punctuation around it, keeping the punctuation", () => {
    expect(translate("hello, world!", "en-th")).toBe("สวัสดี, โลก!");
    expect(translate("(thank you)", "en-th")).toBe("(ขอบคุณ คุณ)");
  });
});

describe("dictionary", () => {
  it("has 8 entries and an exact reverse map", () => {
    expect(Object.keys(EN_TO_TH)).toHaveLength(8);
    for (const [en, th] of Object.entries(EN_TO_TH)) expect(TH_TO_EN[th]).toBe(en);
    expect(dictionaryFor("th-en")).toBe(TH_TO_EN);
  });

  it("otherDirection flips the direction", () => {
    expect(otherDirection("en-th")).toBe("th-en");
    expect(otherDirection("th-en")).toBe("en-th");
  });
});
