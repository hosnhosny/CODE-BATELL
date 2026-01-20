// src/services/gemini.ts
import { askAI } from '../lib/aiService';

export const getAIResponse = async (question: string, contextCode?: string) => {
  const prompt = contextCode 
    ? `أنا أدرس C++ وهذا هو الكود الخاص بي:\n\`\`\`cpp\n${contextCode}\n\`\`\`\n\nالسؤال: ${question}`
    : question;
  return await askAI(prompt);
};

export const simulateCodeExecution = async (code: string, stdin: string = "") => {
  const prompt = `قم بدور C++ Compiler. أعطني مخرجات الشاشة فقط للكود التالي.
المدخلات: ${stdin}
الكود:
\`\`\`cpp
${code}
\`\`\`
المخرجات المتوقعة فقط (بدون شرح):`;
  return await askAI(prompt);
};

export const generateBrokenCode = async () => {
  const prompt = `قم بتوليد كود C++ قصير يحتوي على خطأ منطقي خفي. أجب بصيغة JSON حصراً كالتالي:
  {"code": "...", "bugDescription": "...", "hint": "..."}`;
  
  const response = await askAI(prompt);
  try {
    // استخراج JSON من النص (لأن بعض النماذج قد تضيف نصوصاً قبل أو بعد)
    const jsonStr = response.match(/\{[\s\S]*\}/)?.[0] || response;
    return JSON.parse(jsonStr);
  } catch (e) {
    return { code: "// خطأ في التوليد", bugDescription: "فشل التحليل", hint: "حاول مجدداً" };
  }
};

export const evaluateChallenge = async (code: string, challengeDescription: string) => {
    const prompt = `هل هذا الكود يحل التحدي التالي؟ "${challengeDescription}"
    الكود: \n${code}\n
    أجب بـ "CORRECT:نعم" أو "WRONG:لا" مع شرح السبب.`;
    const response = await askAI(prompt);
    const isCorrect = response.includes("CORRECT") || response.includes("نعم");
    return { isCorrect, feedback: response, score: isCorrect ? 100 : 0 };
};