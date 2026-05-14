import OpenAI from "openai";
import { EXPERT_GROUPS, DEFAULT_SYNTHESIZER, NVIDIA_BASE_URL } from "./config.js";

export interface OrchestratorResponse {
  content: string;
  isError: boolean;
  expertsConsulted?: number;
  expertsFailed?: number;
  synthesisUsed?: boolean;
}

export class NvidiaOrchestrator {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey,
      baseURL: NVIDIA_BASE_URL,
    });
  }

  async ask(prompt: string, category: string, multiModel: boolean = false): Promise<OrchestratorResponse> {
    const models = EXPERT_GROUPS[category];
    if (!models) {
      throw new Error(`Categoría no válida: ${category}`);
    }

    const modelsToConsult = multiModel ? models : [models[0]];
    
    // Consultas en paralelo con reintentos
    const responses = await Promise.all(
      modelsToConsult.map(async (model) => {
        return this.queryModelWithRetry(model, prompt);
      })
    );

    const successfulResponses = responses.filter(r => !r.isError);

    if (successfulResponses.length === 0) {
      return {
        content: `Error: Todos los modelos expertos fallaron. ${responses[0].content}`,
        isError: true
      };
    }

    if (!multiModel || successfulResponses.length === 1) {
      return {
        content: successfulResponses[0].content,
        isError: false,
        expertsConsulted: 1,
        synthesisUsed: false
      };
    }

    // Paso de Síntesis
    try {
      const synthesisPrompt = `
Eres un orquestador de IA de nivel senior. Tu objetivo es producir la respuesta técnica definitiva basándote en la consulta: "${prompt}".

Has recibido aportes de modelos expertos:
${successfulResponses.map((r, i) => `--- INICIO EXPERTO ${i + 1} (${r.model}) ---\n${r.content}\n--- FIN EXPERTO ${i + 1} ---`).join("\n\n")}

INSTRUCCIONES:
1. Genera una solución INTEGRAL y UNIFICADA.
2. Si hay contradicciones, usa tu juicio técnico para decidir la mejor opción.
3. No menciones el proceso de síntesis.
      `;

      const synthesis = await this.openai.chat.completions.create({
        model: DEFAULT_SYNTHESIZER,
        messages: [{ role: "user", content: synthesisPrompt }],
        max_tokens: 2048
      });

      return {
        content: synthesis.choices[0].message.content || "Error en la síntesis.",
        isError: false,
        expertsConsulted: successfulResponses.length,
        expertsFailed: responses.length - successfulResponses.length,
        synthesisUsed: true
      };
    } catch (synthError: any) {
      console.error("Fallo en la síntesis, devolviendo mejor respuesta individual:", synthError.message);
      const bestFallback = successfulResponses[0];
      return {
        content: `${bestFallback.content}\n\n> [!WARNING]\n> La síntesis falló. Mostrando respuesta de respaldo del modelo: ${bestFallback.model}.`,
        isError: false,
        expertsConsulted: successfulResponses.length,
        synthesisUsed: false
      };
    }
  }

  private async queryModelWithRetry(model: string, prompt: string, retries: number = 2): Promise<{ model: string, content: string, isError: boolean }> {
    for (let i = 0; i <= retries; i++) {
      try {
        const completion = await this.openai.chat.completions.create({
          model: model,
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1024,
        }, {
          timeout: 45000
        });
        return {
          model,
          content: completion.choices[0].message.content || "Sin respuesta.",
          isError: false
        };
      } catch (err: any) {
        console.error(`Intento ${i + 1} fallido para ${model}: ${err.message}`);
        if (i === retries) {
          return { model, content: err.message, isError: true };
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    return { model, content: "Error desconocido", isError: true };
  }
}
