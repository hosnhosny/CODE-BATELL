
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrackType } from '../types';
import { audioService } from '../services/audio';

const mainTracks = [
  { type: TrackType.CPP, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg', progress: 35, color: '#00599C', active: true },
  { type: TrackType.PYTHON, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', progress: 10, color: '#3776AB', active: true },
  { type: TrackType.JAVASCRIPT, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', progress: 0, color: '#F7DF1E', active: true },
];

const allAvailableTracks = [
  { name: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg', status: 'نشط', level: 'متوسط', active: true },
  { name: 'C#', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg', status: 'قريباً', level: 'مبتدئ', active: false },
  { name: 'SQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', status: 'قريباً', level: 'مبتدئ', active: false },
  { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', status: 'نشط', level: 'مبتدئ', active: true },
  { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', status: 'نشط', level: 'مبتدئ', active: true },
  { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', status: 'قريباً', level: 'متقدم', active: false },
  { name: 'Swift', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg', status: 'قريباً', level: 'متوسط', active: false },
  { name: 'Go', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg', status: 'قريباً', level: 'متقدم', active: false },
  { name: 'Rust', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg', status: 'قريباً', level: 'متقدم', active: false },
  { name: 'PHP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg', status: 'قريباً', level: 'متوسط', active: false },
  { name: 'Kotlin', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg', status: 'قريباً', level: 'متوسط', active: false },
  { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', status: 'قريباً', level: 'متقدم', active: false },
];

const Dashboard: React.FC = () => {
  const username = localStorage.getItem('cb_username') || 'المبرمج';
  const [xp, setXp] = useState(Number(localStorage.getItem('cb_xp') || '0'));
  const [streak] = useState(Number(localStorage.getItem('cb_streak') || '7')); 
  const [isTracksModalOpen, setIsTracksModalOpen] = useState(false);
  const navigate = useNavigate();
  
  const [tasks, setTasks] = useState({
    lesson: true,
    bug: localStorage.getItem('cb_task_bug_done') === 'true',
    arena: localStorage.getItem('cb_task_arena_done') === 'true'
  });

  const level = Math.floor(xp / 500) + 1;
  const currentLevelXp = xp % 500;
  const progressToNextLevel = (currentLevelXp / 500) * 100;

  useEffect(() => {
    const updateData = () => {
      setXp(Number(localStorage.getItem('cb_xp') || '0'));
      setTasks({
        lesson: true,
        bug: localStorage.getItem('cb_task_bug_done') === 'true',
        arena: localStorage.getItem('cb_task_arena_done') === 'true'
      });
    };
    window.addEventListener('xpUpdate', updateData);
    window.addEventListener('storage', updateData);
    return () => {
      window.removeEventListener('xpUpdate', updateData);
      window.removeEventListener('storage', updateData);
    };
  }, []);

  const handleTaskClick = (path: string) => {
    audioService.playClick();
    navigate(path);
  };

  const openTracksModal = () => {
    audioService.playClick();
    setIsTracksModalOpen(true);
  };

  return (
    <div className="container mx-auto px-6 py-10 relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 bg-gradient-to-br from-[#1a1b3b] to-[#0f1024] p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden shadow-2xl group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#8f5bff]/10 blur-[100px] -z-10 group-hover:bg-[#8f5bff]/20 transition-all duration-700"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl border-2 border-[#8f5bff] p-1 shadow-[0_0_20px_rgba(143,91,255,0.3)] bg-[#0f1024]">
                  <img 
                    src={localStorage.getItem('cb_avatar') || `https://ui-avatars.com/api/?name=${username}&background=8f5bff&color=fff`} 
                    className="rounded-xl w-full h-full object-cover" 
                    alt="avatar" 
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-white">مرحباً، {username}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-[#8f5bff] bg-[#8f5bff]/10 px-2 py-0.5 rounded">رتبة: مبرمج الكود</span>
                    <div className="flex gap-1">
                      {[1, 2, 3].map(i => <i key={i} className="fas fa-star text-yellow-500 text-[8px]"></i>)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                  <div className="text-2xl font-black text-white">{xp}</div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">إجمالي XP</div>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center relative group/streak">
                  <div className="text-2xl font-black text-orange-500 flex items-center justify-center gap-2">
                    {streak} <i className="fas fa-fire animate-pulse"></i>
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">أيام متتالية</div>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                  <div className="text-2xl font-black text-blue-400">#42</div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">الترتيب العالمي</div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-64">
              <div className="bg-black/40 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
                 <div className="flex justify-between items-end mb-4">
                    <span className="text-[10px] text-gray-400 font-black uppercase">مستوى {level}</span>
                    <span className="text-xs font-black text-white">{Math.round(progressToNextLevel)}%</span>
                 </div>
                 <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden mb-4 shadow-inner p-0.5">
                    <div 
                      className="h-full bg-gradient-to-r from-[#8f5bff] to-[#bc9aff] rounded-full shadow-[0_0_15px_rgba(143,91,255,0.6)] transition-all duration-1000"
                      style={{ width: `${progressToNextLevel}%` }}
                    />
                 </div>
                 <Link to="/track/c++" className="block w-full py-3 bg-[#8f5bff] text-white text-center rounded-xl text-xs font-black hover:scale-105 transition-all shadow-lg shadow-[#8f5bff]/20">
                    متابعة القتال
                 </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#12132b] p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
          <h3 className="text-xl font-black mb-6 flex items-center gap-3">
            <i className="fas fa-crosshairs text-red-500"></i> مهام اليوم
          </h3>
          <div className="space-y-4">
            <button 
              onClick={() => handleTaskClick('/track/c++')}
              className="w-full flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 border-r-4 border-r-green-500 hover:bg-white/10 transition-all text-right group"
            >
               <i className="fas fa-check-circle text-green-500"></i>
               <span className="text-sm font-bold flex-1">حل تحدي C++ واحد</span>
               <span className="text-[10px] font-black text-green-500 uppercase">مكتمل</span>
            </button>

            <button 
              onClick={() => handleTaskClick('/arena/bug-hunter')}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-right group ${tasks.bug ? 'bg-white/5 border-white/5 border-r-4 border-r-green-500' : 'bg-[#8f5bff]/5 border-[#8f5bff]/20 border-r-4 border-r-[#8f5bff] hover:bg-[#8f5bff]/10'}`}
            >
               {tasks.bug ? (
                 <i className="fas fa-check-circle text-green-500"></i>
               ) : (
                 <div className="w-2 h-2 rounded-full bg-[#8f5bff] animate-ping"></div>
               )}
               <span className={`text-sm font-bold flex-1 ${tasks.bug ? 'opacity-60' : 'text-white'}`}>اصطياد خطأ منطقي</span>
               <div className="flex items-center gap-2">
                 <span className={`text-[10px] font-black ${tasks.bug ? 'text-gray-500' : 'text-[#8f5bff]'}`}>{tasks.bug ? 'تم الصيد' : '+200 XP'}</span>
                 {!tasks.bug && <i className="fas fa-arrow-left text-[10px] group-hover:-translate-x-1 transition-transform"></i>}
               </div>
            </button>

            <button 
              onClick={() => handleTaskClick('/arena')}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-right group ${tasks.arena ? 'bg-white/5 border-white/5 border-r-4 border-r-green-500' : 'bg-red-500/5 border-red-500/20 border-r-4 border-r-red-500 hover:bg-red-500/10'}`}
            >
               {tasks.arena ? (
                 <i className="fas fa-check-circle text-green-500"></i>
               ) : (
                 <i className="fas fa-swords text-red-500 text-xs animate-bounce"></i>
               )}
               <span className={`text-sm font-bold flex-1 ${tasks.arena ? 'opacity-60' : 'text-white'}`}>الفوز بمبارة</span>
               <div className="flex items-center gap-2">
                 <span className={`text-[10px] font-black ${tasks.arena ? 'text-gray-500' : 'text-red-500'}`}>{tasks.arena ? 'تم الفوز' : '+150 XP'}</span>
                 {!tasks.arena && <i className="fas fa-arrow-left text-[10px] group-hover:-translate-x-1 transition-transform"></i>}
               </div>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black flex items-center gap-3">
              <i className="fas fa-map-signs text-[#8f5bff]"></i> رحلتك البرمجية
            </h2>
            <button 
              onClick={openTracksModal}
              className="text-xs font-bold text-[#8f5bff] hover:underline bg-[#8f5bff]/5 px-3 py-1 rounded-full border border-[#8f5bff]/20 hover:bg-[#8f5bff]/10 transition-all"
            >
              عرض الكل
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mainTracks.map((track) => (
              <Link 
                key={track.type}
                to={track.type === TrackType.CPP ? "/track/c++" : "#"}
                className="group bg-[#12132b] p-6 rounded-[2rem] border border-white/5 hover:border-[#8f5bff]/40 hover:bg-[#1a1b3b] transition-all relative overflow-hidden"
              >
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-[#8f5bff]/10 transition-all"></div>
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-inner">
                    <img src={track.icon} className="w-8 h-8" alt={track.type} />
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-gray-500 font-black uppercase">التقدم</div>
                    <div className="text-lg font-black text-white">{track.type === TrackType.CPP ? Math.min(100, Math.floor((xp / 1000) * 100)) : 0}%</div>
                  </div>
                </div>
                <h3 className="text-lg font-black mb-4 relative z-10">{track.type} Mastery</h3>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative z-10">
                  <div 
                    className="h-full bg-gradient-to-r from-[#8f5bff] to-[#bc9aff] transition-all duration-1000" 
                    style={{ width: `${track.type === TrackType.CPP ? Math.min(100, (xp / 1000) * 100) : 0}%` }} 
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6">
           <h2 className="text-2xl font-black flex items-center gap-3">
             <i className="fas fa-bolt text-yellow-500"></i> عالم القتال
           </h2>
           <div className="bg-gradient-to-br from-[#8f5bff] to-[#3c2b82] p-6 rounded-[2rem] text-white shadow-xl shadow-[#8f5bff]/20 group cursor-pointer relative overflow-hidden" onClick={() => navigate('/arena')}>
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
             <div className="relative z-10">
               <h4 className="font-black text-xl mb-2">الساحة مفتوحة!</h4>
               <p className="text-xs text-white/80 leading-relaxed mb-4">هناك 15 مبرمجاً بانتظارك في الساحة حالياً. هل أنت مستعد للقتال؟</p>
               <Link to="/arena" className="inline-flex items-center gap-2 bg-white text-[#8f5bff] px-4 py-2 rounded-xl text-xs font-black group-hover:gap-4 transition-all">
                 دخول الساحة <i className="fas fa-arrow-left"></i>
               </Link>
             </div>
           </div>
           
           <div className="bg-[#12132b] p-6 rounded-[2rem] border border-white/5">
             <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">أحدث الأوسمة المكتسبة</h4>
             <div className="flex gap-2">
               {['🚀', '🛡️', '💎', '🔥'].map((emoji, i) => (
                 <div key={i} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/5 hover:bg-white/10 cursor-help" title="وسام الشرف">
                   {emoji}
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>

      {/* نافذة المسارات المنبثقة */}
      {isTracksModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6 animate-in fade-in duration-300">
          <div className="bg-[#12132b] border border-white/10 w-full max-w-5xl max-h-[90vh] rounded-[3rem] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(143,91,255,0.2)]">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-[#8f5bff]/10 to-transparent">
              <div>
                <h2 className="text-3xl font-black flex items-center gap-4 text-white">
                  <i className="fas fa-map text-[#8f5bff]"></i> كافة المسارات البرمجية
                </h2>
                <p className="text-gray-500 text-sm mt-1">اختر لغتك القتالية وابدأ بناء مستقبلك البرمجي.</p>
              </div>
              <button 
                onClick={() => setIsTracksModalOpen(false)}
                className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500/20 transition-all border border-white/5"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allAvailableTracks.map((track, i) => (
                  <button
                    key={i}
                    disabled={!track.active}
                    onClick={() => {
                      if(track.active) {
                        setIsTracksModalOpen(false);
                        navigate(`/track/${track.name.toLowerCase()}`);
                        audioService.playNav();
                      }
                    }}
                    className={`group relative p-6 rounded-[2.5rem] border transition-all text-right flex flex-col items-center text-center overflow-hidden ${
                      track.active 
                      ? 'bg-white/5 border-white/5 hover:border-[#8f5bff]/50 hover:bg-[#1a1b3b]' 
                      : 'bg-black/20 border-white/5 opacity-60 grayscale cursor-not-allowed'
                    }`}
                  >
                    {!track.active && (
                      <div className="absolute top-4 right-4 text-[8px] font-black uppercase bg-red-500/10 text-red-400 px-2 py-1 rounded-md border border-red-500/20">
                        قريباً
                      </div>
                    )}
                    {track.active && (
                       <div className="absolute top-4 right-4 text-[8px] font-black uppercase bg-green-500/10 text-green-400 px-2 py-1 rounded-md border border-green-500/20">
                         نشط
                       </div>
                    )}
                    
                    <div className="w-20 h-20 bg-[#0f1024] rounded-3xl flex items-center justify-center mb-6 border border-white/5 shadow-inner group-hover:scale-110 transition-transform duration-500">
                      <img src={track.icon} className="w-12 h-12" alt={track.name} />
                    </div>
                    
                    <h3 className="text-xl font-black text-white mb-2">{track.name}</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[10px] font-bold text-gray-500 bg-white/5 px-2 py-0.5 rounded uppercase tracking-widest">{track.level}</span>
                    </div>
                    
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-auto">
                       <div className={`h-full ${track.active ? 'bg-[#8f5bff] w-1/3' : 'bg-gray-800 w-0'}`}></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8 bg-[#0a0b1e] border-t border-white/5 flex justify-center items-center gap-6">
               <div className="flex items-center gap-3">
                 <div className="w-3 h-3 rounded-full bg-green-500"></div>
                 <span className="text-xs font-bold text-gray-400">مسارات نشطة</span>
               </div>
               <div className="flex items-center gap-3">
                 <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                 <span className="text-xs font-bold text-gray-400">قيد التطوير</span>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
