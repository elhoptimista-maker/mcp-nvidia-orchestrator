---
name: nvidia-mcp-orchestrator
description: A powerful multi-model consensus and synthesis engine for NVIDIA NIM. Orchestrates 8 specialized expert groups for coding, UI/UX, security, and more.
author: Esteban Iturra <esteba.iturra.c@gmail.com>
version: 1.1.0
tags: [nvidia, mcp, ai, orchestrator, llama3, multi-model]
---

# NVIDIA MCP Orchestrator

This skill provides a high-level interface to the NVIDIA NIM model ecosystem using the Model Context Protocol (MCP). It uses a "swarm of experts" architecture to provide superior answers through consensus and synthesis.

## Features
- **Expert Routing**: Automatically picks the best model for the task (Coding, Vision, Security, etc.).
- **Consensus Engine**: Consults multiple experts in parallel to compare results.
- **Master Synthesis**: Uses Llama 3.3 70B to unify expert opinions into a definitive answer.

## Usage

### As an MCP Server
Install via npx:
```bash
npx -y mcp-nvidia-orchestrator
```

### Expert Categories
- `reasoning`: Complex logic and problem solving.
- `coding`: High-performance software engineering.
- `ui_ux`: Aesthetic design and premium layouts.
- `vision`: Image analysis and mockup interpretation.
- `creative`: Social media assets and copy.
- `security`: PII detection and security audits.
- `data`: Embeddings and data extraction.
- `ops`: Infrastructure and performance.

## Requirements
- NVIDIA API Key from [build.nvidia.com](https://build.nvidia.com/)
