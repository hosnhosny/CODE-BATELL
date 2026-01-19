// --- START OF FILE src/pages/About.tsx ---

import React, { useEffect } from 'react';
import { audioService } from '../services/audio';

const About: React.FC = () => {
  
  useEffect(() => {
    audioService.playNav();
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] relative overflow-hidden flex flex-col items-center py-12 px-4">
      {/* خلفية جمالية */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,#3c2b82_0%,#0f1024_100%)] -z-10" />
      
      <div className="container mx-auto max-w-4xl">
        
        {/* العنوان الرئيسي */}
        <div className="text-center mb-12 animate-in slide-in-from-top duration-500">
          <div className="w-20 h-20 bg-[#8f5bff]/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#8f5bff]/50 shadow-[0_0_30px_rgba(143,91,255,0.3)]">
            <i className="fas fa-scroll text-3xl text-[#8f5bff]"></i>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            عن <span className="text-[#8f5bff]">CODE BATELL</span>
          </h1>
          <p className="text-gray-400 text-lg">الرؤية، الرسالة، والمؤسس</p>
        </div>

        {/* بطاقة المحتوى الرئيسية */}
        <div className="bg-[#12132b]/80 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-12 animate-in fade-in zoom-in duration-500 delay-100">
          
          {/* تعريف المنصة */}
          <section className="text-right border-b border-white/5 pb-8">
            <h2 className="text-2xl font-black text-[#8f5bff] mb-4 flex items-center gap-3">
              <i className="fas fa-info-circle"></i> تعريف المنصة
            </h2>
            <p className="text-gray-300 leading-relaxed text-lg">
              منصة CODE BATELL هي بيئة تعليمية تفاعلية عربية تهدف لدمج متعة الألعاب (Gamification) مع جدية تعلم البرمجة. نسعى لكسر حاجز الملل التقليدي في التعليم وتحويل كتابة الكود إلى مغامرة وتحديات يومية، مما يساعد الطلاب والمبتدئين على إتقان لغات البرمجة مثل C++ وغيرها بأسلوب تنافسي وممتع.
            </p>
          </section>

          {/* كلمة المؤسس */}
          <section className="text-right border-b border-white/5 pb-8">
            <h2 className="text-2xl font-black text-[#8f5bff] mb-4 flex items-center gap-3">
              <i className="fas fa-user-tie"></i> كلمة المصمم والمؤسس
            </h2>
            <div className="bg-[#0a0b1e] p-6 rounded-2xl border-r-4 border-[#8f5bff]">
              <p className="text-gray-300 leading-relaxed italic">
                "الحمد لله الذي علم بالقلم، علم الإنسان ما لم يعلم. في عصر يتسارع فيه التطور التقني، كان لزاماً علينا أن نبتكر وسائل تعليمية تواكب طموح شبابنا العربي. لم أصمم هذه المنصة لتكون مجرد موقع للدراسة، بل لتكون ساحة ينطلق منها المبدعون. هدفي هو أن يجد كل طالب شغفه هنا، وأن نثبت للعالم أن العقول العربية قادرة على الإبداع والابتكار في مجال البرمجيات."
              </p>
            </div>
          </section>

          {/* رسالة للمبرمجين */}
          <section className="text-right border-b border-white/5 pb-8">
            <h2 className="text-2xl font-black text-green-400 mb-4 flex items-center gap-3">
              <i className="fas fa-heart"></i> رسالة إلى أبطال الكود
            </h2>
            <p className="text-gray-300 leading-relaxed text-lg">
              إلى كل سطر كود تكتبه، وإلى كل خطأ (Bug) تحاول إصلاحه لساعات... تذكر أنك تبني المستقبل. البرمجة ليست مجرد وظيفة، بل هي لغة التفكير الحديثة. لا تستسلم أمام الصعوبات، فكل محترف كان يوماً ما مبتدئاً لم يستسلم. أنتم أمل المستقبل، وبكم تنهض الأمم. استمروا في التعلم، استمروا في القتال!
            </p>
          </section>

          {/* الرؤية المستقبلية */}
          <section className="text-right">
            <h2 className="text-2xl font-black text-yellow-500 mb-4 flex items-center gap-3">
              <i className="fas fa-eye"></i> الرؤية المستقبلية
            </h2>
            <p className="text-gray-300 leading-relaxed text-lg">
              نطمح لأن تكون CODE BATELL المرجع الأول لتعليم البرمجة في الوطن العربي، من خلال توسيع المسارات لتشمل الذكاء الاصطناعي، وتطوير التطبيقات، والأمن السيبراني. رؤيتنا هي بناء مجتمع تقني متكامل يربط بين المتعلمين وسوق العمل، وتخريج جيل من المبرمجين القادرين على قيادة التحول الرقمي.
            </p>
          </section>

        </div>

        {/* الفوتر - التذييل الرسمي */}
        <div className="mt-12 text-center space-y-4 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#8f5bff] to-transparent mx-auto rounded-full"></div>
          
          <h3 className="text-2xl font-black text-white">حسني مهلهل</h3>
          
          <div className="flex flex-col items-center gap-1 text-gray-400 text-sm font-bold uppercase tracking-widest">
            <span>كلية العلوم / جامعة المرقب</span>
            <span className="text-[#8f5bff]">Elmergib University</span>
          </div>

          <a href="mailto:info@elmergib.edu.ly" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-[#8f5bff] text-gray-300 hover:text-white rounded-full transition-all duration-300 mt-4 border border-white/10">
            <i className="fas fa-envelope"></i>
            <span>info@elmergib.edu.ly</span>
          </a>
        </div>

      </div>
    </div>
  );
};

export default About;