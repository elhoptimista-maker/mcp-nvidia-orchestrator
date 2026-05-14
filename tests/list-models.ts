import OpenAI from "openai";
import "dotenv/config";

const nvidiaApiKey = process.env.NVIDIA_API_KEY;

const openai = new OpenAI({
  apiKey: nvidiaApiKey,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

async function listModels() {
  try {
    const models = await openai.models.list();
    console.log(JSON.stringify(models.data.map(m => m.id), null, 2));
  } catch (error) {
    console.error("Error al listar modelos:", error);
  }
}

listModels();
