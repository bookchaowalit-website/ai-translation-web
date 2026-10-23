import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/mcp/route";

function rpc(body: unknown) {
  return POST(new Request("http://localhost/api/mcp", { method: "POST", body: JSON.stringify(body) }));
}

describe("MCP route", () => {
  it("echoes the JSON-RPC request id", async () => {
    const res = await rpc({ jsonrpc: "2.0", id: 7, method: "tools/list" });
    expect((await res.json()).id).toBe(7);
  });

  it("lists only the real tools", async () => {
    const { result } = await (await rpc({ jsonrpc: "2.0", id: 1, method: "tools/list" })).json();
    expect(result.tools.map((t: { name: string }) => t.name)).toEqual(["translate", "get_dictionary"]);
  });

  it("translate uses the same dictionary as the page", async () => {
    const res = await rpc({ jsonrpc: "2.0", id: 2, method: "tools/call", params: { name: "translate", arguments: { text: "hello world", direction: "en-th" } } });
    const { result } = await res.json();
    expect(result).toEqual({ direction: "en-th", text: "hello world", translation: "สวัสดี โลก" });
  });

  it("get_dictionary returns the 8 entries", async () => {
    const { result } = await (await rpc({ jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "get_dictionary" } })).json();
    expect(Object.keys(result.entries)).toHaveLength(8);
    expect(result.entries.hello).toBe("สวัสดี");
  });

  it("rejects bad arguments with invalid params", async () => {
    const res = await rpc({ jsonrpc: "2.0", id: 4, method: "tools/call", params: { name: "translate", arguments: { text: "hi", direction: "fr-th" } } });
    const body = await res.json();
    expect(body.error.code).toBe(-32602);
    expect(body.id).toBe(4);
  });

  it("rejects an unknown tool instead of pretending to call it", async () => {
    const res = await rpc({ jsonrpc: "2.0", id: 5, method: "tools/call", params: { name: "get_data" } });
    expect((await res.json()).error.code).toBe(-32602);
  });

  it("rejects an unknown method", async () => {
    const res = await rpc({ jsonrpc: "2.0", id: 6, method: "resources/list" });
    expect((await res.json()).error.code).toBe(-32601);
  });

  it("answers a parse error for a body that is not JSON", async () => {
    const res = await POST(new Request("http://localhost/api/mcp", { method: "POST", body: "{" }));
    const body = await res.json();
    expect(body.error.code).toBe(-32700);
    expect(body.id).toBeNull();
  });
});
