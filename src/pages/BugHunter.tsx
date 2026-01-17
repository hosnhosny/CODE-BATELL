
import React, { useState, useEffect } from 'react';
import Editor from '../components/Editor';
import Celebration from '../components/Celebration';
import { generateBrokenCode, evaluateChallenge } from '../services/gemini';
import { audioService } from '../services/audio';

const BugHunter: React.FC = () => {
  const [bugData, setBugData] = useState<{ code: string; hint: string; bugDescription: string } | null>(null);
  const [currentCode, setCurrentCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<{ isCorrect: boolean; feedback: string } | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const fetchNewBug = async () => {
    audioService.playClick();
    setIsLoading(true);
    setResult(null);
    setShowCelebration(false);
    const data = await generateBrokenCode();
    if (data) {
      setBugData(data);
      setCurrentCode(data.code);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchNewBug();
  }, []);

  const handleVerify = async () => {
    audioService.playClick();
    setIsVerifying(true);
    const evalResult = await evaluateChallenge(currentCode, `أصلح الخطأ في هذا الكود: ${bugData?.bugDescription}`);
    setResult(evalResult);
    
    if (evalResult.isCorrect) {
      audioService.playSuccess();
      setShowCelebration(true);
      
      // تحديث حالة المهمة اليومية
      localStorage.setItem('cb_task_bug_done', 'true');
      
      const xp = Number(localStorage.getItem('cb_xp') || '0');
      localStorage.setItem('cb_xp', (xp + 200).toString());
      window.dispatchEvent(new Event('xpUpdate'));
    } else {
      audioService.playError();
    }
    setIsVerifying(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#050616] text-white flex flex-col relative">
      <Celebration active={showCelebration} />
      
      <div className="bg-[#0a0b1e] p-6 border-b border-white/5 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-green-500 border border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
            <i className="fas fa-bug-slash text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight">صيد الأخطاء الذكي</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase">ابحث عن الخطأ المنطقي وقم بإصلاحه</p>
          </div>
        </div>
        <button 
          onClick={fetchNewBug}
          disabled={isLoading}
          className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all disabled:opacity-50"
        >
          {isLoading ? 'جاري التحميل...' : 'تحدي جديد'}
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/4 p-8 border-l border-white/5 bg-[#0a0b1e] overflow-y-auto">
          <div className="mb-8">
            <h3 className="text-green-500 font-bold mb-2 flex items-center gap-2">
              <i className="fas fa-lightbulb"></i> تلميح الـ AI:
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed italic">
              "{bugData?.hint || 'انتظر بينما نحلل النظام...'}"
            </p>
          </div>

          {result && (
            <div className={`p-5 rounded-2xl border-2 mb-8 animate-in zoom-in duration-300 ${result.isCorrect ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <h4 className={`font-black mb-2 ${result.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                {result.isCorrect ? 'تم الإصلاح بنجاح!' : 'لا يزال هناك عطل!'}
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed">{result.feedback}</p>
              {result.isCorrect && <div className="mt-4 text-xl font-black text-green-500 animate-bounce">+200 XP</div>}
            </div>
          )}

          <div className="mt-auto pt-8 border-t border-white/5 text-[10px] text-gray-600 uppercase font-bold tracking-widest leading-loose">
            نظام المراقبة: نشط <br />
            تشفير البيانات: 256-bit <br />
            معدل النجاح: 88%
          </div>
        </div>

        <div className="flex-1 relative">
          <Editor language="cpp" value={currentCode} onChange={setCurrentCode} />
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-20">
             <button 
                onClick={handleVerify}
                disabled={isVerifying || !bugData || showCelebration}
                className="px-12 py-4 bg-green-600 text-white font-black rounded-2xl shadow-[0_0_30px_rgba(22,163,74,0.4)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
             >
                {isVerifying ? 'جاري الفحص...' : 'تثبيت الإصلاح'}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BugHunter;
