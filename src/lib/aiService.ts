// src/lib/aiService.ts

const API_CONFIG = {
  gemini: {
    key: import.meta.env.VITE_GEMINI_API_KEY,
    url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
  },
  groq: {
    key: import.meta.env.VITE_GROQ_API_KEY,
    url: "https://api.groq.com/openai/v1/chat/completions"
  },
  mistral: {
    key: import.meta.env.VITE_MISTRAL_API_KEY,
    url: "https://api.mistral.ai/v1/chat/completions"
  }
};

async function tryGemini(prompt: string) {
  if (!API_CONFIG.gemini.key) throw new Error("Missing Gemini Key");
  const resp = await fetch(`${API_CONFIG.gemini.url}?key=${API_CONFIG.gemini.key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });
  const data = await resp.json();
  return data.candidates[0].content.parts[0].text;
}

async function tryGroq(prompt: string) {
  if (!API_CONFIG.groq.key) throw new Error("Missing Groq Key");
  const resp = await fetch(API_CONFIG.groq.url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_CONFIG.groq.key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await resp.json();
  return data.choices[0].message.content;
}

// تصدير الدالة الرئيسية (تأكد من وجود كلمة export هنا)
export const unifiedAIRequest = async (prompt: string): Promise<string> => {
  const methods = [
    { name: "Gemini", fn: tryGemini },
    { name: "Groq", fn: tryGroq }
  ];

  let lastError = "";
  for (const method of methods) {
    try {
      return await method.fn(prompt);
    } catch (err: any) {
      lastError = err.message;
      continue;
    }
  }
  return `Error: ${lastError}`;
};