import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import "dotenv/config";
import { NvidiaOrchestrator } from "./src/orchestrator.js";
import { EXPERT_GROUPS } from "./src/config.js";

const nvidiaApiKey = process.env.NVIDIA_API_KEY;

if (!nvidiaApiKey) {
  console.error("Error: NVIDIA_API_KEY no está configurada en el archivo .env");
}

const orchestrator = new NvidiaOrchestrator(nvidiaApiKey || "dummy-key");

const server = new McpServer({
  name: "NVIDIA-Skills",
  version: "1.1.0",
});

server.tool(
  "nvidia_ask",
  "Consulta avanzada que utiliza inteligencia agnóstica para elegir el mejor modelo o realizar consenso multi-modelo.",
  {
    prompt: z.string().describe("La pregunta o tarea a realizar"),
    category: z.enum(Object.keys(EXPERT_GROUPS) as [string, ...string[]]).default("reasoning"),
    multiModel: z.boolean().optional().default(false).describe("Si se deben consultar múltiples expertos para consenso (más preciso)")
  },
  async ({ prompt, category, multiModel }) => {
    try {
      const result = await orchestrator.ask(prompt, category, multiModel);
      
      const responseContent = [
        { type: "text" as const, text: result.content }
      ];

      if (result.synthesisUsed) {
        responseContent.push({
          type: "text" as const,
          text: `\n\n> [!NOTE]\n> Consenso generado exitosamente por ${result.expertsConsulted} expertos.`
        });
      }

      return {
        content: responseContent,
        isError: result.isError
      };
    } catch (error: any) {
      return {
        isError: true,
        content: [{ type: "text" as const, text: `Error en el orquestador: ${error.message}` }],
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("NVIDIA MCP Server running...");
}

main().catch(console.error);
