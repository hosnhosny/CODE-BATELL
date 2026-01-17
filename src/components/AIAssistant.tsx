import React, { useState, useEffect } from 'react';
import { getAIResponse } from '../services/gemini';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  codeContext?: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose, codeContext }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAnswer(codeContext ? "أنا أرى الكود الخاص بك في المحرر حالياً. كيف يمكنني مساعدتك فيه؟" : "أهلاً بك! أنا مساعد CODE BATELL الذكي. اسألني أي شيء عن البرمجة.");
    }
  }, [isOpen, codeContext]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!question.trim()) return;
    setIsLoading(true);
    setAnswer('🧠 جاري التحليل...');
    const response = await getAIResponse(question, codeContext);
    setAnswer(response);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-[#12132b] border-2 border-[#8f5bff]/30 rounded-[2rem] w-full max-w-xl p-8 relative shadow-[0_0_50px_rgba(143,91,255,0.2)]">
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 text-gray-500 hover:text-white transition-colors"
        >
          <i className="fas fa-times text-xl"></i>
        </button>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-[#8f5bff] rounded-2xl flex items-center justify-center text-white shadow-lg">
            <i className="fas fa-robot text-xl"></i>
          </div>
          <div>
            <h2 className="text-xl font-black">المساعد الذكي</h2>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">مدعوم بتقنيات Gemini</p>
          </div>
        </div>

        {codeContext && (
          <div className="mb-4 p-3 bg-white/5 border border-white/5 rounded-xl text-[10px] text-[#8f5bff] font-bold flex items-center gap-2">
            <i className="fas fa-code"></i> سياق الكود مفعل (سأقوم بتحليل ما كتبت في المحرر)
          </div>
        )}

        <div className="bg-[#0f1024] border border-white/5 rounded-2xl p-6 h-64 overflow-y-auto mb-6 scrollbar-hide text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
          {answer}
        </div>

        <div className="relative">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="مثال: اشرح لي معنى cin في الكود الخاص بي؟"
            className="w-full bg-[#0f1024] border border-[#34355a] rounded-2xl p-4 pr-4 pl-14 text-white focus:border-[#8f5bff] outline-none resize-none h-20 transition-all text-sm"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !question.trim()}
            className={`absolute left-3 bottom-3 w-10 h-10 rounded-xl bg-[#8f5bff] text-white flex items-center justify-center transition-all ${isLoading || !question.trim() ? 'opacity-50 grayscale' : 'hover:scale-105 active:scale-95 shadow-lg shadow-[#8f5bff]/30'}`}
          >
            {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
