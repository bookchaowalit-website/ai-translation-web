import { NextResponse } from "next/server";
import { EN_TO_TH, MAX_TEXT_LENGTH, TH_TO_EN, translate, type Direction } from "@/lib/translation";

// Stateless JSON-RPC MCP endpoint over the same 8-word dictionary the page uses. No translation API is called.

type RpcRequest = { id?: number | string | null; method?: string; params?: { name?: string; arguments?: Record<string, unknown> } };

const TOOLS = [
  {
    name: "translate",
    description: "Word-by-word EN/TH dictionary lookup over 8 words; unknown words stay unchanged",
    inputSchema: { type: "object", properties: { text: { type: "string", maxLength: MAX_TEXT_LENGTH }, direction: { type: "string", enum: ["en-th", "th-en"] } }, required: ["text"] },
  },
  { name: "get_dictionary", description: "Return the 8 English to Thai dictionary entries", inputSchema: { type: "object", properties: {} } },
];

class RpcError extends Error {
  constructor(readonly code: number, message: string) {
    super(message);
  }
}

function callTool(name: string | undefined, args: Record<string, unknown> = {}) {
  switch (name) {
    case "translate": {
      if (typeof args.text !== "string") throw new RpcError(-32602, "text must be a string");
      if (args.text.length > MAX_TEXT_LENGTH) throw new RpcError(-32602, `text must be at most ${MAX_TEXT_LENGTH} characters`);
      const direction = args.direction ?? "en-th";
      if (direction !== "en-th" && direction !== "th-en") throw new RpcError(-32602, "direction must be en-th or th-en");
      return { direction, text: args.text, translation: translate(args.text, direction as Direction) };
    }
    case "get_dictionary":
      return { entries: EN_TO_TH, reverse: TH_TO_EN };
    default:
      throw new RpcError(-32602, `Unknown tool: ${String(name)}`);
  }
}

export async function POST(request: Request) {
  let id: RpcRequest["id"] = null;
  try {
    const body = (await request.json()) as RpcRequest;
    id = body.id ?? null;
    let result: unknown;
    switch (body.method) {
      case "initialize":
        result = {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: { name: "Translation Dictionary", version: "1.0.0" },
        };
        break;
      case "tools/list":
        result = { tools: TOOLS };
        break;
      case "tools/call":
        result = callTool(body.params?.name, body.params?.arguments);
        break;
      default:
        throw new RpcError(-32601, `Unknown method: ${String(body.method)}`);
    }
    return NextResponse.json({ jsonrpc: "2.0", id, result });
  } catch (error) {
    const code = error instanceof RpcError ? error.code : -32700;
    const message = error instanceof RpcError ? error.message : "Parse error";
    return NextResponse.json({ jsonrpc: "2.0", id, error: { code, message } }, { status: 400 });
  }
}
