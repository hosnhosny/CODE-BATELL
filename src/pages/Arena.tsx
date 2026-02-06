
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '../components/Editor';
import { evaluateChallenge, getAIResponse } from '../services/gemini';
import { audioService } from '../services/audio';

const Arena: React.FC = () => {
  const [gameState, setGameState] = useState<'lobby' | 'matching' | 'battle' | 'result'>('lobby');
  const [challenge, setChallenge] = useState<{ title: string; desc: string } | null>(null);
  const [playerCode, setPlayerCode] = useState('// ابدأ القتال هنا...\n');
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [timer, setTimer] = useState(60);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const navigate = useNavigate();

  const startMatching = () => {
    audioService.playClick();
    setGameState('matching');
    setTimeout(async () => {
      const prompt = "أعطني تحدي برمجي قصير جداً لـ C++ (سؤال واحد فقط) للمستوى المتوسط. أجب بصيغة: العنوان | الوصف";
      const aiChallenge = await getAIResponse(prompt);
      const parts = aiChallenge.split('|');
      const title = parts[0];
      const desc = parts[1];
      
      setChallenge({ 
        title: title?.trim() || "تحدي الخوارزميات", 
        desc: desc?.trim() || "قم بكتابة دالة لحساب المضروب (Factorial) باستخدام recursion." 
      });
      setGameState('battle');
      audioService.playSuccess();
    }, 3000);
  };

  useEffect(() => {
    let interval: any;
    if (gameState === 'battle' && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
        setOpponentProgress(prev => Math.min(95, prev + Math.random() * 5));
      }, 1000);
    } else if (timer === 0 && gameState === 'battle') {
      handleFinish();
    }
    return () => clearInterval(interval);
  }, [gameState, timer]);

  const handleFinish = async () => {
    audioService.playClick();
    setIsEvaluating(true);
    const result = await evaluateChallenge(playerCode, challenge?.desc || "");
    setIsEvaluating(false);
    setGameState('result');
    
    if (result.isCorrect) {
      audioService.playSuccess();
      
      // تحديث حالة المهمة اليومية
      localStorage.setItem('cb_task_arena_done', 'true');
      
      const currentXP = Number(localStorage.getItem('cb_xp') || '0');
      localStorage.setItem('cb_xp', (currentXP + 150).toString());
      window.dispatchEvent(new Event('xpUpdate'));
    } else {
      audioService.playError();
    }
  };

  if (gameState === 'lobby') {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <div className="w-32 h-32 bg-[#8f5bff]/20 rounded-full flex items-center justify-center mx-auto mb-10 border-4 border-[#8f5bff] shadow-[0_0_50px_rgba(143,91,255,0.4)] animate-pulse">
          <i className="fas fa-bolt text-5xl text-[#8f5bff]"></i>
        </div>
        <h1 className="text-5xl font-black mb-6 uppercase tracking-tighter">ساحة المباريات</h1>
        <p className="text-gray-400 max-w-xl mx-auto mb-12 text-lg">
          واجه مبرمجين آخرين في تحديات برمجية حية. الفائز يحصد الـ XP والمجد!
        </p>
        <button 
          onClick={startMatching}
          className="px-12 py-5 bg-[#8f5bff] text-white rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-2xl shadow-[#8f5bff]/40"
        >
          بحث عن مباراة سريعة
        </button>
      </div>
    );
  }

  if (gameState === 'matching') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="relative w-64 h-64 mb-10">
          <div className="absolute inset-0 border-4 border-[#8f5bff]/20 rounded-full"></div>
          <div className="absolute inset-0 border-t-4 border-[#8f5bff] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="fas fa-search text-3xl text-gray-500 animate-bounce"></i>
          </div>
        </div>
        <h2 className="text-2xl font-bold animate-pulse">جاري البحث عن مبرمج كفء...</h2>
        <p className="text-gray-500 mt-2">المتصلون الآن: 1,240 مبرمج</p>
      </div>
    );
  }

  if (gameState === 'battle') {
    return (
      <div className="h-[calc(100vh-64px)] flex flex-col bg-[#050616]">
        <div className="bg-[#0a0b1e] border-b border-white/5 p-4 flex items-center justify-between px-10">
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-start">
               <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">أنت</span>
               <div className="h-2 w-48 bg-gray-800 rounded-full mt-1 overflow-hidden">
                 <div className="h-full bg-green-500 transition-all" style={{ width: `${Math.min(100, playerCode.length / 2)}%` }}></div>
               </div>
             </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 px-6 py-2 rounded-2xl">
            <span className="text-red-500 font-black text-2xl font-mono">{timer}s</span>
          </div>

          <div className="flex items-center gap-4 text-left">
             <div className="flex flex-col items-end">
               <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">الخصم (مجهول)</span>
               <div className="h-2 w-48 bg-gray-800 rounded-full mt-1 overflow-hidden">
                 <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: `${opponentProgress}%` }}></div>
               </div>
             </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-1/4 bg-[#0a0b1e] p-8 border-l border-white/5 overflow-y-auto">
            <h3 className="text-[#8f5bff] font-black text-xl mb-4">{challenge?.title}</h3>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-gray-300 text-sm leading-relaxed mb-6">
              {challenge?.desc}
            </div>
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">تلميح AI:</div>
            <p className="text-xs text-gray-600 italic">"ركز على سرعة التنفيذ ونظافة الكود."</p>
          </div>

          <div className="flex-1">
            <Editor language="cpp" value={playerCode} onChange={setPlayerCode} />
          </div>
        </div>

        <div className="p-4 bg-[#0a0b1e] border-t border-white/5 flex justify-center">
          <button 
            onClick={handleFinish}
            disabled={isEvaluating}
            className="px-12 py-3 bg-[#8f5bff] text-white font-black rounded-xl hover:shadow-[0_0_20px_rgba(143,91,255,0.4)] disabled:opacity-50"
          >
            {isEvaluating ? 'جاري التحكيم...' : 'إرسال الحل والإنهاء'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-20 text-center animate-in fade-in zoom-in duration-500">
       <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-500 border border-yellow-500/50">
          <i className="fas fa-flag-checkered text-3xl"></i>
       </div>
       <h1 className="text-4xl font-black mb-4">انتهت المبارة!</h1>
       <p className="text-gray-400 mb-10 max-w-md mx-auto">لقد بذلت قصارى جهدك. تمت مراجعة الحل الخاص بك وتحديث نقاطك في لوحة المتصدرين.</p>
       <button 
        onClick={() => { audioService.playClick(); navigate('/dashboard'); }}
        className="px-12 py-4 bg-[#8f5bff] text-white rounded-2xl font-black shadow-xl shadow-[#8f5bff]/20 hover:scale-105 transition-all"
       >
        العودة للرئيسية
       </button>
    </div>
  );
};

export default Arena;
