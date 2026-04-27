import { describe, it, expect } from "vitest";
import { createServer } from "./mcp";

describe("mcp.ts", () => {
  it("can be imported without throwing", async () => {
    await expect(import("./mcp")).resolves.toBeDefined();
  });

  it("createServer returns a defined McpServer instance", () => {
    const server = createServer();
    expect(server).toBeDefined();
  });
});
