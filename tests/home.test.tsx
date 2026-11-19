import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

describe("home page", () => {
  it("renders the App shell with the sample translation, the vocabulary and the dictionary-limits notice", () => {
    const html = renderToString(<Home />);
    expect(html).toContain("Make the meaning cross the table.");
    expect(html).toContain('class="as-top"');
    expect(html).toContain("hello portfolio developer");
    expect(html).toContain("สวัสดี ผลงาน นักพัฒนา");
    expect(html).toContain("a lookup of <!-- -->8<!-- --> words, not machine translation");
    expect(html).toContain("Dictionary lookup · no AI model, no API");
    expect(html).toContain("Unknown words stay unchanged");
    expect(html).toContain('href="https://bookchaowalit.com/"');
  });
});
