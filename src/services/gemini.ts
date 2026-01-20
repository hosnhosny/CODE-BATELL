// src/services/gemini.ts
import { unifiedAIRequest } from '../lib/aiService';

// 1. وظيفة الرد العام
export const getAIResponse = async (question: string, contextCode?: string) => {
  const prompt = contextCode 
    ? `أنا أدرس C++ وهذا هو الكود الخاص بي:\n\`\`\`cpp\n${contextCode}\n\`\`\`\n\nالسؤال: ${question}`
    : question;
  return await unifiedAIRequest(prompt);
};

// 2. وظيفة محاكاة تنفيذ الكود
export const simulateCodeExecution = async (code: string, stdin: string = "") => {
  const prompt = `قم بدور C++ Compiler. أعطني مخرجات الشاشة فقط للكود التالي.
المدخلات: ${stdin}
الكود:
\`\`\`cpp
${code}
\`\`\`
المخرجات المتوقعة فقط (بدون شرح):`;
  return await unifiedAIRequest(prompt);
};

// 3. وظيفة توليد كود مكسور (Bug Hunter)
export const generateBrokenCode = async () => {
  const prompt = `قم بتوليد كود C++ قصير يحتوي على خطأ منطقي خفي. أجب بصيغة JSON فقط:
  {"code": "...", "bugDescription": "...", "hint": "..."}`;
  
  const response = await unifiedAIRequest(prompt);
  try {
    const jsonStr = response.match(/\{[\s\S]*\}/)?.[0] || response;
    return JSON.parse(jsonStr);
  } catch (e) {
    return { code: "// حدث خطأ، حاول مجدداً", bugDescription: "فشل التوليد", hint: "تحقق من المفاتيح" };
  }
};

// 4. وظيفة تقييم التحديات
export const evaluateChallenge = async (code: string, challengeDescription: string) => {
  const prompt = `قيم هذا الكود بناءً على التحدي: "${challengeDescription}"
  الكود: \n${code}\n
  أجب بـ "CORRECT:نعم" إذا كان الحل صحيحاً تماماً.`;
  const response = await unifiedAIRequest(prompt);
  const isCorrect = response.includes("CORRECT") || response.includes("نعم");
  return { isCorrect, feedback: response, score: isCorrect ? 100 : 0 };
};

// 5. وظيفة تحسين الكود
export const optimizeMyCode = async (code: string) => {
  return await unifiedAIRequest(`حسن أداء كود C++ التالي:\n${code}`);
};

// 6. وظيفة شرح الكود
export const explainMyCode = async (code: string) => {
  return await unifiedAIRequest(`اشرح لي ماذا يفعل كود C++ التالي:\n${code}`);
};

// 7. الوظيفة التي سببت المشكلة (getCodeMarkers) - تم إضافتها الآن ✅
export const getCodeMarkers = async (code: string): Promise<Array<{line: number, message: string}>> => {
  try {
    const prompt = `ابحث عن أخطاء برمجية في كود C++ التالي واعطني النتيجة بصيغة JSON فقط:
    {"errors": [{"line": رقم السطر, "message": "الوصف بالعربية"}]}
    الكود:
    ${code}`;
    
    const response = await unifiedAIRequest(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.errors || [];
    }
    return [];
  } catch (error) {
    console.error("Markers failure:", error);
    return [];
  }
};