import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import registerCheckVgcTeamLegality from "./tools/checkVgcTeamLegality";
import registerParseVgcTeam from "./tools/parseVgcTeam";
import registerShareVgcTeam from "./tools/shareVgcTeam";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "pokemon-champions-vgc",
    version: "1.0.0",
  });

  registerCheckVgcTeamLegality(server);
  registerShareVgcTeam(server);
  registerParseVgcTeam(server);

  return server;
}

export async function main() {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

if (import.meta.main) {
  main();
}
