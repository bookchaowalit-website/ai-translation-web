import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

describe("home page", () => {
  it("renders the desk with the sample translation and the dictionary-limits notice", () => {
    const html = renderToString(<Home />);
    expect(html).toContain("Make the meaning cross the table.");
    expect(html).toContain("hello portfolio developer");
    expect(html).toContain("สวัสดี ผลงาน นักพัฒนา");
    expect(html).toContain("<strong>8</strong> mapped words");
    expect(html).toContain("dictionary lookup, not production NMT");
    expect(html).toContain("Unknown words stay unchanged");
  });
});
