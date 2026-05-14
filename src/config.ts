export const EXPERT_GROUPS: Record<string, string[]> = {
  reasoning: [
    "meta/llama-3.3-70b-instruct",
    "qwen/qwen3.5-397b-a17b",
    "nvidia/cosmos-reason2-8b"
  ],
  coding: [
    "qwen/qwen3-coder-480b-a35b-instruct",
    "mistralai/codestral-22b-instruct-v0.1",
    "meta/llama-4-maverick-17b-128e-instruct"
  ],
  ui_ux: [
    "google/gemma-4-31b-it",
    "meta/llama-3.2-90b-vision-instruct",
    "mistralai/mistral-large-3-675b-instruct-2512"
  ],
  vision: [
    "microsoft/phi-4-multimodal-instruct",
    "meta/llama-3.2-90b-vision-instruct",
    "google/deplot"
  ],
  creative: [
    "writer/palmyra-creative-122b",
    "google/gemma-4-31b-it",
    "mistralai/mistral-large-3-675b-instruct-2512"
  ],
  security: [
    "meta/llama-guard-4-12b",
    "nvidia/llama-3.1-nemoguard-8b-content-safety",
    "nvidia/gliner-pii"
  ],
  data: [
    "nvidia/llama-3.2-nv-embedqa-1b-v2",
    "ibm/granite-3.0-8b-instruct",
    "meta/llama-3.3-70b-instruct"
  ],
  ops: [
    "meta/llama-3.3-70b-instruct",
    "mistralai/mistral-large-3-675b-instruct-2512",
    "nvidia/llama-3.3-nemotron-super-49b-v1.5"
  ]
};

export const DEFAULT_SYNTHESIZER = "meta/llama-3.3-70b-instruct";
export const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1';
