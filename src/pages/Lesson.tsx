// --- START OF FILE src/pages/Lesson.tsx ---

import React, { useState, useEffect } from 'react';
import Editor, { type EditorMarker } from '../components/Editor';
import Celebration from '../components/Celebration';
import { compileCode } from '../services/compiler';
import { explainMyCode, evaluateChallenge, optimizeMyCode, getCodeMarkers } from '../services/gemini';
import { audioService } from '../services/audio';

// --- بيانات الدروس (يمكنك استبدال الروابط لاحقاً) ---
const COURSE_LESSONS = [
  { id: 1, title: '1. كورس كامل (c++)', url: 'https://www.youtube.com/embed/35qTqtpQMxg?si=HJX5ivgK7RIFYO61' },
  { id: 2, title: '2. المتغيرات وأنواع البيانات (Variables)', url: 'https://www.youtube.com/embed/prElSg7z83k?si=mTuwBSXu8walmmPO' },
  { id: 3, title: '3. جمل الإدخال والإخراج (cin/cout)', url: 'https://www.youtube.com/embed/1gAsjP84QPk?si=aoYrhW6-WcfvlQXv' },
  { id: 4, title: '4. الجمل الشرطية (If Statements)', url: 'https://www.youtube.com/embed/vauFEYr5-WU?si=r2l-nxthiATSfAoq' },
  { id: 5, title: '5. الحلقات التكرارية (Loops)', url: 'https://www.youtube.com/embed/Go-7yFm6gv8?si=9e1in9Thiq8lqALX' },
  { id: 6, title: '6. الدوال (Functions)', url: 'https://www.youtube.com/embed/dQZZg8okYKg?si=ERTS34roip47ZOMQ' },
  { id: 7, title: '7. المؤشرات(pointer)', url: 'https://www.youtube.com/embed/v-eV72gnUv0?si=HxNkJNkKpUpb7RoD' },
  { id: 8, title: '8. المصفوفات(Array)', url: 'https://www.youtube.com/embed/-Xfx53vVvR0?si=NvVpbWxl-P5MtDrc' },
  { id: 9, title: '9. (do while , while)', url: 'https://www.youtube.com/embed/-l9_NhUYmBc?si=dujDIIkSaSgng_hX' },
  { id: 10, title: '10. البرمجة الكائنية (OOP)', url: 'https://www.youtube.com/embed/aJG-KnmfFxM?si=9ctHUV9lGm0Sv5zT' },
];

const INITIAL_CODE = `#include <iostream>
using namespace std;

int main() {
    string name;
    cout << "ما هو اسمك مبرمجنا؟ " << endl;
    cin >> name;
    cout << "مرحباً بك في عالم البرمجة، " << name << "!" << endl;
    
    return 0;
}`;

const CHALLENGE_DESC = "قم بتعديل الكود لاستقبال اسم المستخدم ثم طباعة رسالة ترحيبية تحتوي على الاسم.";

const LessonPage: React.FC = () => {
  const [code, setCode] = useState(INITIAL_CODE);
  const [stdin, setStdin] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const [activeSideTab, setActiveSideTab] = useState<'content' | 'ai'>('content');
  const [feedback, setFeedback] = useState<{ isCorrect?: boolean; message?: string; score?: number } | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [userXP, setUserXP] = useState(Number(localStorage.getItem('cb_xp') || '0'));
  const [editorMarkers, setEditorMarkers] = useState<EditorMarker[]>([]);
  
  // --- حالة النافذة المنبثقة للفيديوهات ---
  const [isVideoListOpen, setIsVideoListOpen] = useState(false);
  
  const activeTheme = 'golden-batell';

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('codeUpdate', { detail: code }));
    if (editorMarkers.length > 0) setEditorMarkers([]);
  }, [code]);

  const handleRun = async () => {
    audioService.playClick();
    setIsLoading(true);
    setOutput('🚀 جاري تشغيل المحرك الذكي...');
    const markers = await getCodeMarkers(code);
    setEditorMarkers(markers);
    const result = await compileCode(code, stdin);
    setOutput(result);
    setIsLoading(false);
  };

  const handleVerify = async () => {
    audioService.playClick();
    setIsVerifying(true);
    setActiveSideTab('ai');
    setAiExplanation('🤖 جاري تقييم منطق الكود الخاص بك...');
    const markers = await getCodeMarkers(code);
    setEditorMarkers(markers);
    const evaluation = await evaluateChallenge(code, CHALLENGE_DESC);
    setFeedback({ 
      isCorrect: evaluation.isCorrect, 
      message: evaluation.feedback,
      score: evaluation.score 
    });
    setAiExplanation(evaluation.feedback);
    if (evaluation.isCorrect) {
      audioService.playSuccess();
      const earnedXP = evaluation.score || 100;
      const newXP = userXP + earnedXP;
      localStorage.setItem('cb_xp', newXP.toString());
      setUserXP(newXP);
      setShowReward(true);
      window.dispatchEvent(new Event('xpUpdate'));
    } else {
      audioService.playError();
    }
    setIsVerifying(false);
  };

  const handleExplain = async () => {
    audioService.playAIActivate();
    setActiveSideTab('ai');
    setAiExplanation('📝 جاري شرح الكود بطريقة مبسطة...');
    const explanation = await explainMyCode(code);
    setAiExplanation(explanation);
  };

  const handleOptimize = async () => {
    audioService.playAIActivate();
    setActiveSideTab('ai');
    setAiExplanation('⚡ جاري تحليل الكود لجعله أكثر احترافية...');
    const optimization = await optimizeMyCode(code);
    setAiExplanation(optimization);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[#0a0b1e] relative">
      <Celebration active={showReward} />
      
      {/* --- نافذة عرض الفيديوهات المنبثقة --- */}
      {isVideoListOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6 animate-in fade-in duration-300">
          <div className="bg-[#12132b] border border-white/10 w-full max-w-6xl max-h-[90vh] rounded-[2.5rem] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(143,91,255,0.2)]">
            
            {/* رأس النافذة */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-[#8f5bff]/10 to-transparent">
              <div>
                <h2 className="text-3xl font-black flex items-center gap-4 text-white">
                  <i className="fas fa-play-circle text-[#8f5bff]"></i> c++ مكتبة دروس المسار
                </h2>
                <p className="text-gray-500 text-sm mt-1">شاهد الدروس السابقة أو انتقل للدرس التالي.</p>
              </div>
              <button 
                onClick={() => { setIsVideoListOpen(false); audioService.playClick(); }}
                className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500/20 transition-all border border-white/5"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            {/* شبكة الفيديوهات */}
            <div className="flex-1 overflow-y-auto p-8 scrollbar-hide bg-[#0a0b1e]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {COURSE_LESSONS.map((lesson) => (
                  <div key={lesson.id} className="bg-[#1a1b3b] p-4 rounded-3xl border border-white/5 hover:border-[#8f5bff]/40 group transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-[#8f5bff] flex items-center justify-center text-white font-black text-sm shadow-lg">
                        {lesson.id}
                      </div>
                      <h3 className="text-sm font-bold text-white truncate">{lesson.title}</h3>
                    </div>
                    
                    <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/5 bg-black">
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src={lesson.url} 
                        title={lesson.title} 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen 
                        className="opacity-80 group-hover:opacity-100 transition-opacity"
                      ></iframe>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* تذييل النافذة */}
            <div className="p-6 bg-[#12132b] border-t border-white/5 text-center">
              <p className="text-gray-500 text-xs">يتم إضافة دروس جديدة أسبوعياً. استمر في التقدم!</p>
            </div>
          </div>
        </div>
      )}

      {/* --- شاشة الجائزة --- */}
      {showReward && (
        <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#1a1b3b] border-2 border-yellow-500 p-10 rounded-[2.5rem] text-center shadow-[0_0_80px_rgba(234,179,8,0.4)] transform animate-in zoom-in duration-500">
            <div className="text-8xl mb-6 animate-bounce">🏆</div>
            <h2 className="text-4xl font-black text-white mb-2">أسطوري!</h2>
            <p className="text-gray-400 mb-8 text-xl">لقد أثبتّ مهارتك في هذا التحدي.</p>
            <div className="text-5xl font-black text-yellow-500 mb-8">+{feedback?.score || 100} XP</div>
            <button 
              onClick={() => setShowReward(false)} 
              className="px-12 py-4 bg-yellow-500 text-black font-black rounded-2xl hover:bg-yellow-400 transition-all hover:scale-105 active:scale-95"
            >
              استمر في المعركة
            </button>
          </div>
        </div>
      )}

      {/* --- القائمة الجانبية اليمنى --- */}
      <div className="w-1/3 border-l border-white/5 flex flex-col bg-[#0f1024] shadow-2xl z-10">
        <div className="flex bg-[#050616] p-1">
          <button 
            onClick={() => { audioService.playNav(); setActiveSideTab('content'); }}
            className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${activeSideTab === 'content' ? 'bg-[#8f5bff] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <i className="fas fa-book-open ml-2"></i> الدرس
          </button>
          <button 
            onClick={() => { audioService.playNav(); setActiveSideTab('ai'); }}
            className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${activeSideTab === 'ai' ? 'bg-[#8f5bff] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <i className="fas fa-robot ml-2"></i> المساعد الذكي
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
          {activeSideTab === 'content' ? (
            <div className="animate-in slide-in-from-right duration-300">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-black text-white">تحدي المدخلات</h2>
                 <div className="text-right">
                    <div className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">رصيد الخبرة</div>
                    <div className="text-xl font-black text-[#8f5bff]">{userXP} XP</div>
                 </div>
              </div>
              
              {/* زر فتح قائمة الفيديوهات */}
              <button 
                onClick={() => { setIsVideoListOpen(true); audioService.playNav(); }}
                className="w-full mb-8 py-4 bg-[#1a1b3b] border border-[#8f5bff]/30 hover:bg-[#8f5bff]/10 rounded-2xl flex items-center justify-between px-6 transition-all group shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#8f5bff] rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <i className="fas fa-list-ul"></i>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">قائمة الدروس</div>
                    <div className="text-[10px] text-gray-400">استعرض {COURSE_LESSONS.length} فيديو تعليمي</div>
                  </div>
                </div>
                <i className="fas fa-chevron-left text-gray-500 group-hover:-translate-x-1 transition-transform"></i>
              </button>

              <p className="text-gray-400 leading-relaxed mb-8 text-lg">
                اليوم سنتعلم كيف نجعل برامجنا تفاعلية! سنستخدم <code>cin</code> لاستقبال البيانات من لوحة المفاتيح.
              </p>
              
              <div className="bg-gradient-to-br from-[#8f5bff]/20 to-[#3c2b82]/10 p-6 rounded-3xl border border-[#8f5bff]/30 mb-8 shadow-inner">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-black shadow-lg">
                    <i className="fas fa-sword"></i>
                  </div>
                  <h4 className="text-white font-black text-lg">مهمة المعركة:</h4>
                </div>
                <p className="text-gray-200 leading-relaxed">{CHALLENGE_DESC}</p>
              </div>

              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                <iframe width="100%" height="200" src="https://www.youtube.com/embed/35qTqtpQMxg?si=HJX5ivgK7RIFYO61" title="Tutorial" frameBorder="0" allowFullScreen className="group-hover:scale-105 transition-transform duration-700"></iframe>
              </div>
            </div>
          ) : (
            // --- محتوى المساعد الذكي ---
            <div className="space-y-6 animate-in slide-in-from-left duration-300">
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-[#8f5bff] flex items-center justify-center text-white shadow-[0_0_15px_rgba(143,91,255,0.4)]">
                  <i className="fas fa-brain"></i>
                </div>
                <div>
                  <h3 className="font-black text-white">تحليل CODE BATELL AI</h3>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">مساعدك الشخصي</p>
                </div>
              </div>

              {feedback && (
                <div className={`p-5 rounded-2xl border-2 ${feedback.isCorrect ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                   <div className="flex items-center gap-3 mb-2">
                      <i className={`fas ${feedback.isCorrect ? 'fa-check-circle text-green-500' : 'fa-times-circle text-red-500'} text-xl`}></i>
                      <span className="font-black text-white">{feedback.isCorrect ? 'تمت المهمة بنجاح!' : 'هناك ثغرة في الكود'}</span>
                   </div>
                   <p className="text-sm text-gray-400 leading-relaxed">{feedback.message}</p>
                </div>
              )}

              <div className="bg-[#050616] p-6 rounded-3xl border border-white/5 text-gray-300 text-sm leading-relaxed whitespace-pre-wrap min-h-[200px] shadow-inner font-medium">
                {aiExplanation || "اكتب الكود الخاص بك ثم اضغط 'تحقق من الحل' للحصول على تقييم ذكي أو 'اشرح الكود' للفهم العميق."}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- المحرر والكونسول --- */}
      <div className="flex-1 flex flex-col">
        <div className="h-16 bg-[#050616] border-b border-white/5 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <i className="fas fa-file-code text-[#8f5bff]"></i>
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">main.cpp</span>
            </div>
            <div className="flex gap-2 mr-4">
              <button 
                onClick={handleExplain} 
                className="text-[10px] font-black uppercase tracking-widest text-[#8f5bff] bg-[#8f5bff]/10 px-3 py-1.5 rounded-lg border border-[#8f5bff]/20 hover:bg-[#8f5bff]/20 transition-all"
              >
                اشرح لي
              </button>
              <button 
                onClick={handleOptimize} 
                className="text-[10px] font-black uppercase tracking-widest text-yellow-500 bg-yellow-500/10 px-3 py-1.5 rounded-lg border border-yellow-500/20 hover:bg-yellow-500/20 transition-all"
              >
                تحسين (Optimize)
              </button>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleRun} 
              disabled={isLoading} 
              className={`px-8 py-2.5 bg-white/5 border border-white/10 text-white text-xs font-black rounded-xl hover:bg-white/10 transition-all ${isLoading ? 'opacity-50' : 'hover:scale-105'}`}
            >
              {isLoading ? 'جاري التشغيل...' : 'تشغيل الكود'}
            </button>
            <button 
              onClick={handleVerify} 
              disabled={isVerifying} 
              className={`px-10 py-2.5 bg-[#8f5bff] text-white text-xs font-black rounded-xl shadow-[0_0_20px_rgba(143,91,255,0.4)] transition-all ${isVerifying ? 'opacity-50' : 'hover:scale-105 active:scale-95'}`}
            >
              تحقق من الحل
            </button>
          </div>
        </div>

        <div className="flex-1 relative">
          <Editor 
            language="cpp" 
            value={code} 
            onChange={setCode} 
            themeName={activeTheme} 
            markers={editorMarkers} 
          />
        </div>

        <div className="h-72 bg-[#050616] border-t-2 border-white/10 flex">
          <div className="w-1/3 border-l border-white/5 flex flex-col">
            <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
              <i className="fas fa-keyboard text-gray-500 text-xs"></i>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">المدخلات (Inputs)</span>
            </div>
            <textarea
              value={stdin}
              onChange={(e) => { audioService.playClick(); setStdin(e.target.value); }}
              placeholder="اكتب البيانات المدخلة هنا..."
              className="flex-1 bg-transparent p-6 text-sm font-mono text-gray-400 outline-none resize-none placeholder:text-gray-800"
            />
          </div>
          
          <div className="flex-1 flex flex-col">
            <div className="px-5 py-3 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <i className="fas fa-terminal text-[#8f5bff] text-xs"></i>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Output Console</span>
              </div>
              <button onClick={() => { audioService.playClick(); setOutput(''); }} className="text-gray-700 hover:text-white text-[10px] font-bold transition-colors">مسح</button>
            </div>
            <div className="flex-1 p-6 font-mono text-sm text-blue-400 overflow-y-auto whitespace-pre-wrap bg-[#050616] shadow-inner">
              {output || <span className="text-gray-800 italic select-none">بانتظار تنفيذ الكود...</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;