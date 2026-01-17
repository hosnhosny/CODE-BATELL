
// Refactored to strictly follow @google/genai guidelines.
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * وظيفة لتحسين الكود (Code Optimization)
 */
export const optimizeMyCode = async (code: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `قم بتحليل كود C++ التالي وتقديم اقتراحات لتحسين الأداء (Performance) ونظافة الكود (Clean Code). اجعل الرد باللغة العربية ومقسماً إلى نقاط واضحة:\n\`\`\`cpp\n${code}\n\`\`\``,
      config: {
        systemInstruction: "أنت خبير في هندسة البرمجيات وكتابة الكود النظيف. أسلوبك تقني دقيق وناصح.",
        temperature: 0.3,
      }
    });
    return response.text || "لم أتمكن من إيجاد تحسينات فورية، كودك يبدو رائعاً!";
  } catch (error) {
    console.error("[AI Optimizer] Error:", error);
    return "عذراً، المحلل الذكي مشغول حالياً.";
  }
};

/**
 * وظيفة لاكتشاف الأخطاء وتحديد أسطرها لعرضها في المحرر
 */
export const getCodeMarkers = async (code: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `قم بتحليل كود C++ التالي واستخراج الأخطاء البرمجية (إن وجدت). 
أريد النتيجة بصيغة JSON تحتوي على قائمة بالأسطر التي تحتوي على أخطاء مع وصف الخطأ.
الكود:
\`\`\`cpp
${code}
\`\`\``,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            errors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  line: { type: Type.INTEGER, description: "رقم السطر الذي يحتوي على الخطأ" },
                  message: { type: Type.STRING, description: "وصف الخطأ بالعربية" }
                },
                required: ["line", "message"]
              }
            }
          },
          required: ["errors"]
        }
      }
    });
    const data = JSON.parse(response.text || '{"errors": []}');
    return data.errors;
  } catch (error) {
    console.error("[AI Markers] Error:", error);
    return [];
  }
};

/**
 * ردود المساعد الذكي في نافذة المحادثة
 */
export const getAIResponse = async (question: string, contextCode?: string) => {
  try {
    const prompt = contextCode 
      ? `أنا أدرس C++ وهذا هو الكود الخاص بي:\n\`\`\`cpp\n${contextCode}\n\`\`\`\n\nالسؤال: ${question}`
      : question;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: "أنت خبير برمجة ومدرس في منصة CODE BATELL. أسلوبك محفز ودقيق. تجيب دائماً بالعربية.",
        temperature: 0.7,
      }
    });
    return response.text || "عذراً، لم أستطع معالجة طلبك.";
  } catch (error) {
    console.error("[AI System] Error:", error);
    return "عذراً، المحرك الذكي غير متوفر حالياً.";
  }
};

/**
 * توليد تحديات صيد الأخطاء
 */
export const generateBrokenCode = async () => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: "قم بتوليد كود C++ قصير يحتوي على خطأ منطقي خفي. أجب بصيغة JSON تحتوي على الحقول: code (الكود المكسور)، bugDescription (وصف الخطأ)، hint (تلميح للمستخدم).",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            code: { type: Type.STRING },
            bugDescription: { type: Type.STRING },
            hint: { type: Type.STRING }
          },
          required: ["code", "bugDescription", "hint"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("[AI System] Error:", error);
    return null;
  }
};

/**
 * محاكاة المترجم
 */
export const simulateCodeExecution = async (code: string, stdin: string = "") => {
  try {
    const prompt = `قم بدور C++ Compiler. أعطني مخرجات الشاشة فقط للكود التالي.\nالمدخلات: ${stdin}\nالكود:\n\`\`\`cpp\n${code}\n\`\`\``;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { temperature: 0.1 }
    });
    return response.text?.trim() || "لا توجد مخرجات.";
  } catch (error) {
    console.error("[AI System] Error:", error);
    return "فشل محرك المحاكاة الذكي.";
  }
};

/**
 * تقييم التحديات
 */
export const evaluateChallenge = async (code: string, challengeDescription: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `هل هذا الكود يحل التحدي التالي بشكل صحيح؟\nالتحدي: ${challengeDescription}\nالكود:\n\`\`\`cpp\n${code}\n\`\`\``,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isCorrect: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING },
            score: { type: Type.INTEGER }
          },
          required: ["isCorrect", "feedback", "score"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("[AI System] Error:", error);
    return { isCorrect: false, feedback: "فشل نظام التقييم التلقائي.", score: 0 };
  }
};

export const explainMyCode = async (code: string) => {
  return getAIResponse("اشرح لي هذا الكود بأسلوب تعليمي؟", code);
};
