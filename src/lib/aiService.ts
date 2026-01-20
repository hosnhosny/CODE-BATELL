// src/lib/aiService.ts

import { GoogleGenerativeAI } from "@google/generative-ai";

// الإعدادات
const KEYS = {
  gemini: import.meta.env.VITE_GEMINI_API_KEY,
  groq: import.meta.env.VITE_GROQ_API_KEY,
  mistral: import.meta.env.VITE_MISTRAL_API_KEY,
};

// 1. وظيفة Gemini
async function callGemini(prompt: string) {
  if (!KEYS.gemini) throw new Error("GEMINI_KEY_MISSING");
  const genAI = new GoogleGenerativeAI(KEYS.gemini);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // أسرع وأحدث
  const result = await model.generateContent(prompt);
  return result.response.text();
}

// 2. وظيفة Groq (بديل سريع جداً)
async function callGroq(prompt: string) {
  if (!KEYS.groq) throw new Error("GROQ_KEY_MISSING");
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${KEYS.groq}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
    }),
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.choices[0].message.content;
}

// 3. وظيفة Mistral
async function callMistral(prompt: string) {
  if (!KEYS.mistral) throw new Error("MISTRAL_KEY_MISSING");
  const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${KEYS.mistral}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
      model: "mistral-tiny",
    }),
  });
  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * المحرك الرئيسي للتبديل (Orchestrator)
 */
export const askAI = async (prompt: string): Promise<string> => {
  // ترتيب المحاولة: Gemini -> Groq -> Mistral
  const providers = [
    { name: 'Gemini', fn: callGemini },
    { name: 'Groq', fn: callGroq },
    { name: 'Mistral', fn: callMistral }
  ];

  let lastError = null;

  for (const provider of providers) {
    try {
      console.log(`[AI] Attempting with ${provider.name}...`);
      const response = await provider.fn(prompt);
      if (response) return response;
    } catch (error: any) {
      console.error(`[AI] ${provider.name} failed:`, error.message);
      lastError = error;
      // استمر للمزود التالي
      continue;
    }
  }

  return `⚠️ نعتذر، جميع خدمات الذكاء الاصطناعي مشغولة حالياً. الخطأ الأخير: ${lastError?.message}`;
};