
import React from 'react';

interface Player {
  rank: number;
  name: string;
  xp: number;
  level: number;
  country: string;
  badges: string[];
  isCurrentUser?: boolean;
}

const Leaderboard: React.FC = () => {
  const currentUsername = localStorage.getItem('cb_username') || 'المبرمج';
  const currentUserXP = Number(localStorage.getItem('cb_xp') || '0');
  const currentUserCountry = localStorage.getItem('cb_country') || '🇪🇬 مصر';
  const currentUserLevel = Math.floor(currentUserXP / 500) + 1;

  // بيانات افتراضية تمثل التنوع العربي
  const players: Player[] = [
    { rank: 1, name: 'سارة_كود', xp: 4500, level: 10, country: '🇸🇦 السعودية', badges: ['🚀', '💎'] },
    { rank: 2, name: 'أحمد_بايثون', xp: 3850, level: 8, country: '🇩🇿 الجزائر', badges: ['🔥'] },
    { rank: 3, name: 'ليلى_مبرمجة', xp: 3200, level: 7, country: '🇲🇦 المغرب', badges: ['🌟'] },
    { rank: 4, name: 'عمر_تيك', xp: 2900, level: 6, country: '🇯🇴 الأردن', badges: ['🛡️'] },
    { rank: 5, name: currentUsername, xp: currentUserXP, level: currentUserLevel, country: currentUserCountry, badges: ['🌱'], isCurrentUser: true },
    { rank: 6, name: 'ياسين_جاڤا', xp: 1200, level: 3, country: '🇰🇼 الكويت', badges: [] },
    { rank: 7, name: 'مريم_ديف', xp: 950, level: 2, country: '🇦🇪 الإمارات', badges: [] },
  ].sort((a, b) => b.xp - a.xp).map((p, i) => ({ ...p, rank: i + 1 }));

  return (
    <div className="container mx-auto px-6 py-10 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black mb-4 flex justify-center items-center gap-4">
          <i className="fas fa-trophy text-yellow-500"></i> لوحة المتصدرين العرب
        </h1>
        <p className="text-gray-400">أقوى المبرمجين في الوطن العربي. هل ستتصدر دولتك القائمة؟</p>
      </div>

      <div className="max-w-5xl mx-auto bg-[#12132b] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="grid grid-cols-12 bg-[#1a1b3b] p-6 text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/5">
          <div className="col-span-1 text-center">الترتيب</div>
          <div className="col-span-4 px-4">المبرمج</div>
          <div className="col-span-3 text-center px-4">الدولة</div>
          <div className="col-span-1 text-center">المستوى</div>
          <div className="col-span-1 text-center">الأوسمة</div>
          <div className="col-span-2 text-center">نقاط XP</div>
        </div>

        <div className="divide-y divide-white/5">
          {players.map((player) => (
            <div 
              key={player.name}
              className={`grid grid-cols-12 p-6 items-center transition-all ${player.isCurrentUser ? 'bg-[#8f5bff]/10 border-r-4 border-[#8f5bff]' : 'hover:bg-white/5'}`}
            >
              <div className="col-span-1 text-center">
                {player.rank === 1 ? <span className="text-2xl drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">🥇</span> : 
                 player.rank === 2 ? <span className="text-2xl">🥈</span> :
                 player.rank === 3 ? <span className="text-2xl">🥉</span> : 
                 <span className="font-black text-gray-600">#{player.rank}</span>}
              </div>
              
              <div className="col-span-4 px-4 flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#34355a] to-[#0f1024] flex items-center justify-center border border-white/10 overflow-hidden shadow-inner">
                   <img src={`https://ui-avatars.com/api/?name=${player.name}&background=8f5bff&color=fff`} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-black text-white flex items-center gap-2">
                    {player.name}
                    {player.isCurrentUser && <span className="text-[8px] bg-[#8f5bff] px-1.5 py-0.5 rounded text-white font-black uppercase">أنت</span>}
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">محارب الكود</div>
                </div>
              </div>

              <div className="col-span-3 text-center px-4">
                 <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 shadow-sm">
                    <span className="text-lg">{player.country.split(' ')[0]}</span>
                    <span className="text-xs font-bold text-gray-300">{player.country.split(' ').slice(1).join(' ')}</span>
                 </div>
              </div>

              <div className="col-span-1 text-center">
                <span className="text-xs font-black text-white">
                  {player.level}
                </span>
              </div>

              <div className="col-span-1 text-center flex justify-center gap-1">
                {player.badges.length > 0 ? player.badges.map((b, i) => (
                  <span key={i} title="وسام مكتسب" className="cursor-help transform hover:scale-125 transition-transform">{b}</span>
                )) : <span className="text-gray-800">-</span>}
              </div>

              <div className="col-span-2 text-center">
                <span className="font-black text-[#8f5bff] text-lg">{player.xp.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 text-center">
        <div className="inline-flex items-center gap-3 bg-[#1a1b3b] px-8 py-4 rounded-3xl border border-[#8f5bff]/20 text-sm shadow-xl">
          <i className="fas fa-globe-americas text-[#8f5bff]"></i>
          <span className="text-gray-400 font-medium">تمثل هذه القائمة أفضل العقول البرمجية في منطقتنا. استمر في التحدي لرفع علم بلدك!</span>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
