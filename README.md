# 🟢 NVIDIA NIM Expert Orchestrator (MCP)

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![MCP Protocol](https://img.shields.io/badge/MCP-Supported-blue.svg)](https://modelcontextprotocol.io)
[![NVIDIA NIM](https://img.shields.io/badge/NVIDIA-NIM-green.svg)](https://www.nvidia.com/en-us/ai-data-science/generative-ai/nim/)

A powerful **Model Context Protocol (MCP)** server that orchestrates a swarm of NVIDIA NIM models. It features an intelligent consensus engine that consults specialized experts and synthesizes their responses for maximum accuracy and creativity.

## 🚀 Key Features

- **8 Specialized Expert Groups**: Automated routing to models optimized for coding, UI/UX, security, reasoning, and more.
- **Consensus & Synthesis**: Optional multi-model polling to compare expert opinions and generate a unified, high-quality answer.
- **Library & Server Modes**: Use it as a standalone MCP server for Claude/Cursor or as a TypeScript library in your own apps.
- **Production Ready**: Built-in retries, timeouts, and fallback mechanisms using the latest Llama 3.3 70B for synthesis.

---

## 🛠️ Installation & Setup

### 1. Get your NVIDIA API Key
Get your free or enterprise API key at [build.nvidia.com](https://build.nvidia.com/).

### 2. Install as a Server
To use this with a client like **Claude Desktop**, add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "nvidia-orchestrator": {
      "command": "npx",
      "args": ["-y", "mcp-nvidia-orchestrator"],
      "env": {
        "NVIDIA_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### 3. Use as a Library
```bash
npm install mcp-nvidia-orchestrator
```

```typescript
import { NvidiaOrchestrator } from 'mcp-nvidia-orchestrator/orchestrator';

const orchestrator = new NvidiaOrchestrator("your_api_key");

const response = await orchestrator.ask(
  "Create a high-performance shader for a glass effect",
  "coding",
  true // Enable multi-model consensus
);

console.log(response.content);
```

---

## 🧠 Expert Groups

The orchestrator routes your requests to specialized model groups:

| Category | Best For... | Primary Model |
| :--- | :--- | :--- |
| **Reasoning** | Logic, Math, Strategy | Llama-3.1-405b-instruct |
| **Coding** | Software engineering, Code review | DeepSeek-Coder-V2-Instruct |
| **UI/UX** | Aesthetics, Premium layouts, Animations | Llama-3.1-70b-instruct |
| **Vision** | Mockups, Diagrams, Bug screenshots | Llama-3.2-90b-vision-instruct |
| **Creative** | Copywriting, Social Media, Assets | Nemotron-340b-instruct |
| **Security** | PII detection, Vulnerabilities | Llama-3-70b-instruct |
| **Data** | Extraction, Embeddings, SQL | Llama-3.1-8b-instruct |
| **Ops** | Infrastructure, K8s, Performance | Llama-3.1-70b-instruct |

---

## 🏗️ Architecture

The orchestrator uses a **Consensus Engine**:
1. **Selection**: Picks the best expert group for the task.
2. **Parallel Execution**: Queries 2-3 expert models simultaneously.
3. **Synthesis**: A "Master Model" (Llama 3.3 70B) analyzes all responses and crafts the definitive final output.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Developed with ❤️ for the AI Community.*
