import OpenAI from "openai";
import "dotenv/config";

const nvidiaApiKey = process.env.NVIDIA_API_KEY;

const openai = new OpenAI({
  apiKey: nvidiaApiKey,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

const prompt = "Analiza la arquitectura de un orquestador MCP que utiliza consulta en paralelo a 3 modelos expertos y una fase de síntesis final. ¿Cuáles son las ventajas competitivas de este enfoque frente a un modelo único en el contexto de desarrollo de software en 2026?";

const modelsToConsult = [
    "meta/llama-3.3-70b-instruct",
    "google/gemma-4-31b-it",
    "mistralai/mixtral-8x22b-instruct-v0.1"
];

const DEFAULT_SYNTHESIZER = "meta/llama-3.1-8b-instruct";

async function runTest() {
    console.log("--- Iniciando consulta a expertos ---");
    try {
        const responses = await Promise.all(
            modelsToConsult.map(async (model) => {
                console.log(`> Consultando: ${model}`);
                const completion = await openai.chat.completions.create({
                    model: model,
                    messages: [{ role: "user", content: prompt }],
                    max_tokens: 500
                });
                return { model, content: completion.choices[0].message.content };
            })
        );

        console.log("--- Iniciando síntesis ---");
        const synthesisPrompt = `
Eres un orquestador de IA de nivel senior. Tu objetivo es producir la respuesta técnica definitiva basándote en la consulta: "${prompt}".

Has recibido aportes de tres modelos expertos con diferentes arquitecturas:
${responses.map((r, i) => `--- INICIO EXPERTO ${i + 1} (${r.model}) ---\n${r.content}\n--- FIN EXPERTO ${i + 1} ---`).join("\n\n")}

INSTRUCCIONES DE SÍNTESIS:
1. RIGOR TÉCNICO: Si los expertos dan versiones contradictorias, prioriza la respuesta que demuestre mayor profundidad técnica o cite estándares actualizados de 2026.
2. ELIMINACIÓN DE REDUNDANCIA: No repitas introducciones genéricas de cada modelo.
3. ESTRUCTURA: Organiza la respuesta final de forma lógica.
4. OUTPUT: Genera una solución INTEGRAL.
`;

        const synthesis = await openai.chat.completions.create({
            model: DEFAULT_SYNTHESIZER,
            messages: [{ role: "user", content: synthesisPrompt }],
            max_tokens: 500
        });

        console.log("\n--- RESULTADO FINAL ---");
        console.log(synthesis.choices[0].message.content);
    } catch (err) {
        console.error("Error en el test:", err);
    }
}

runTest();
