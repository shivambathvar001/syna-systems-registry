import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const server = new Server({
  name: "syna-zero-trust-server",
  version: "1.0.0",
}, {
  capabilities: {
    tools: {},
  },
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "query_operational_metrics",
        description: "Securely query operational latency data without raw DB access.",
        inputSchema: {
          type: "object",
          properties: {
            node_id: { type: "string" },
          },
        },
      },
    ],
  };
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("SYNA_MCP_SERVER_CONNECTED");
}

run().catch(console.error);
