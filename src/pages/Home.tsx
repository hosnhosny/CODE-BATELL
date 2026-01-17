
import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,#3c2b82,#0f1024)] -z-10" />
      
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          CODE BATELL <br />
          <span className="text-[#8f5bff]">منصة عربية</span> لتعلم البرمجة بالتحديات
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          تعلم لغات البرمجة من خلال دروس قصيرة وتحديات تفاعلية، مع مساعد ذكي يقدم لك الشرح والتلميحات.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/register" className="px-8 py-4 bg-[#8f5bff] text-white rounded-full font-bold text-lg hover:bg-[#7a49e6] transition-all shadow-lg shadow-[#8f5bff]/20">
            ابدأ رحلتك الآن
          </Link>
          <Link to="/dashboard" className="px-8 py-4 border border-[#8f5bff] text-[#8f5bff] rounded-full font-bold text-lg hover:bg-[#8f5bff]/10 transition-all text-center">
            استكشف المسارات
          </Link>
        </div>
      </div>
      
      <div className="mt-20 flex justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" className="w-12 h-12" alt="C++" />
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" className="w-12 h-12" alt="Python" />
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" className="w-12 h-12" alt="JS" />
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" className="w-12 h-12" alt="React" />
      </div>
    </div>
  );
};

export default Home;
