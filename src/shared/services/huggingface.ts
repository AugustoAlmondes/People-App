import { HFMessage } from '@/src/features/chat/types';

const HF_URL = 'https://router.huggingface.co/v1/chat/completions';
const MODEL = 'meta-llama/Llama-3.1-8B-Instruct:sambanova';

function getToken(): string {
  const token = process.env.EXPO_PUBLIC_HUGGING_FACE_TOKEN;
  if (!token) throw new Error('[HuggingFace] Token não configurado em .env (EXPO_PUBLIC_HUGGING_FACE_TOKEN)');
  return token;
}

export async function sendAiMessage(messages: HFMessage[]): Promise<string> {

  const response = await fetch(HF_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ model: MODEL, messages }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`[HuggingFace] HTTP ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (typeof content !== 'string' || !content.trim()) {
    throw new Error('[HuggingFace] Resposta inesperada da API.');
  }

  return content.trim();
}
