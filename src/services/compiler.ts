// src/services/compiler.ts
import { simulateCodeExecution } from './gemini';

const RAPID_API_KEY = '734b3b4339msh8a673109e81cdabp1ee505jsn3feda9fce834';
const RAPID_API_HOST = 'cpp-17-code-compiler.p.rapidapi.com';

export async function compileCode(code: string, stdin: string = "") {
  try {
    const response = await fetch(`https://${RAPID_API_HOST}/compile/`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-rapidapi-key': RAPID_API_KEY,
        'x-rapidapi-host': RAPID_API_HOST
      },
      body: JSON.stringify({ code, stdin })
    });

    const data = await response.json();
    if (response.ok && data.output) return data.output;
    
    // إذا فشل الـ API الخارجي، نستخدم الذكاء الاصطناعي (الذي سيجرب المفاتيح الثلاثة)
    return await simulateCodeExecution(code, stdin);
  } catch (error) {
    return await simulateCodeExecution(code, stdin);
  }
}