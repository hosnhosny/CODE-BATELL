
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { audioService } from '../services/audio';

interface NavbarProps {
  user: string | null;
  onLogout: () => void;
  onOpenTracks: () => void;
  onOpenAI: () => void;
}

const PRESET_AVATARS = [
  { id: 'bot1', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Felix' },
  { id: 'bot2', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Aneka' },
  { id: 'av1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha' },
  { id: 'av2', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Caleb' },
  { id: 'av3', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jude' },
  { id: 'px1', url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Bate' },
  { id: 'px2', url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Code' },
  { id: 'bot3', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Battle' },
];

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onOpenTracks, onOpenAI }) => {
  const [xp, setXp] = useState(Number(localStorage.getItem('cb_xp') || '0'));
  const [isMusicPlaying, setIsMusicPlaying] = useState(audioService.getMusicState());
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('cb_theme') || 'dark');
  const [volume, setVolume] = useState(audioService.getVolume());
  const location = useLocation();
  
  const [savedAvatar, setSavedAvatar] = useState(localStorage.getItem('cb_avatar') || PRESET_AVATARS[0].url);
  const [tempName, setTempName] = useState(user || '');
  const [tempAvatar, setTempAvatar] = useState(savedAvatar);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isProfileOpen) {
      setTempName(user || '');
      setTempAvatar(localStorage.getItem('cb_avatar') || PRESET_AVATARS[0].url);
    }
  }, [isProfileOpen, user]);

  useEffect(() => {
    const updateData = () => {
      setXp(Number(localStorage.getItem('cb_xp') || '0'));
      setSavedAvatar(localStorage.getItem('cb_avatar') || PRESET_AVATARS[0].url);
    };
    window.addEventListener('xpUpdate', updateData);
    window.addEventListener('storage', updateData);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.documentElement.className = theme === 'light' ? 'light-mode' : '';
    
    return () => {
      window.removeEventListener('xpUpdate', updateData);
      window.removeEventListener('storage', updateData);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [theme]);

  const handleToggleMusic = () => {
    audioService.playClick();
    setIsMusicPlaying(audioService.toggleBackgroundMusic());
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('cb_theme', newTheme);
    audioService.playClick();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    audioService.setVolume(val);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      localStorage.setItem('cb_username', tempName);
      localStorage.setItem('cb_avatar', tempAvatar);
      setSavedAvatar(tempAvatar);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('xpUpdate'));
      setIsProfileOpen(false);
      audioService.playSuccess();
    }
  };

  return (
    <header className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#0a0b1e]/80 border-white/5'} backdrop-blur-md border-b sticky top-0 z-[100] transition-colors duration-300`}>
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className={`text-2xl font-black tracking-tighter flex items-center gap-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`} onClick={() => audioService.playNav()}>
            <div className="w-8 h-8 bg-[#8f5bff] rounded-lg flex items-center justify-center text-white shadow-[0_0_15px_rgba(143,91,255,0.5)]">
              <i className="fas fa-bolt text-sm"></i>
            </div>
            <span>CODE <span className="text-[#8f5bff]">BATELL</span></span>
          </Link>
          
          <nav className={`hidden md:flex items-center gap-6 text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
            <Link to="/" className={`transition-colors hover:text-[#8f5bff] ${location.pathname === '/' ? 'text-[#8f5bff]' : ''}`}>الرئيسية</Link>
            <button onClick={() => { audioService.playClick(); onOpenTracks(); }} className="hover:text-[#8f5bff] transition-colors">المسارات</button>
            <Link to="/community" className={`hover:text-[#8f5bff] transition-colors flex items-center gap-1.5 ${location.pathname === '/community' ? 'text-[#8f5bff]' : ''}`} onClick={() => audioService.playNav()}>
              <i className="fas fa-users text-xs"></i> المجتمع
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </Link>
            <Link to="/arena" className={`hover:text-red-500 transition-colors flex items-center gap-1.5 ${location.pathname === '/arena' ? 'text-red-500' : ''}`} onClick={() => audioService.playNav()}>
              <i className="fas fa-swords text-xs"></i> الساحة
            </Link>
            <button onClick={() => { audioService.playAIActivate(); onOpenAI(); }} className="hover:text-[#8f5bff] transition-colors flex items-center gap-1.5">
               <i className="fas fa-robot text-xs text-[#8f5bff]"></i> المساعد
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleToggleMusic}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all relative overflow-hidden ${isMusicPlaying ? 'bg-[#8f5bff]/20 text-[#8f5bff] border border-[#8f5bff]/50 shadow-[0_0_15px_rgba(143,91,255,0.3)]' : 'bg-white/5 text-gray-500 border border-white/5 hover:bg-white/10'}`}
          >
            <i className={`fas ${isMusicPlaying ? 'fa-volume-high' : 'fa-volume-mute'} text-sm z-10`}></i>
          </button>

          {user && (
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => { setIsUserMenuOpen(!isUserMenuOpen); audioService.playClick(); }}
                className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-white/5 transition-all group"
              >
                <div className="hidden sm:flex flex-col items-end">
                  <span className={`text-xs font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{user}</span>
                  <span className="text-[10px] text-[#8f5bff]">{xp} XP</span>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-[#8f5bff] p-0.5 overflow-hidden shadow-[0_0_10px_rgba(143,91,255,0.3)] bg-[#1a1b3b]">
                  <img 
                    src={savedAvatar} 
                    className="w-full h-full rounded-full object-cover" 
                    alt="user avatar" 
                  />
                </div>
              </button>

              {isUserMenuOpen && (
                <div className={`absolute left-0 mt-3 w-60 rounded-2xl border shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${theme === 'light' ? 'bg-white border-gray-100 text-gray-800' : 'bg-[#12132b] border-white/10 text-white'}`}>
                  <div className="p-5 border-b border-white/5 bg-gradient-to-br from-[#8f5bff]/10 to-transparent">
                    <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-1">المحارب الحالي</p>
                    <p className="font-bold truncate text-lg">{user}</p>
                  </div>
                  <div className="p-2">
                    <button 
                      onClick={() => { setIsProfileOpen(true); setIsUserMenuOpen(false); audioService.playNav(); }}
                      className="w-full text-right px-4 py-3 rounded-xl hover:bg-[#8f5bff]/10 hover:text-[#8f5bff] transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <i className="fas fa-user-edit text-sm opacity-50 group-hover:opacity-100"></i>
                        <span>الملف الشخصي</span>
                      </div>
                    </button>
                    <button 
                      onClick={() => { setIsSettingsOpen(true); setIsUserMenuOpen(false); audioService.playNav(); }}
                      className="w-full text-right px-4 py-3 rounded-xl hover:bg-[#8f5bff]/10 hover:text-[#8f5bff] transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <i className="fas fa-cog text-sm opacity-50 group-hover:opacity-100"></i>
                        <span>الإعدادات</span>
                      </div>
                    </button>
                    <div className="h-px bg-white/5 my-2"></div>
                    <button 
                      onClick={() => { onLogout(); setIsUserMenuOpen(false); }}
                      className="w-full text-right px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <i className="fas fa-power-off text-sm"></i>
                        <span>خروج</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {!user && (
            <div className="flex items-center gap-4">
              <Link to="/login" className={`text-sm font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`} onClick={() => audioService.playClick()}>دخول</Link>
              <Link to="/register" className="px-5 py-2 bg-[#8f5bff] text-white rounded-full text-sm font-bold shadow-lg shadow-[#8f5bff]/20" onClick={() => audioService.playClick()}>ابدأ</Link>
            </div>
          )}
        </div>
      </div>

      {isProfileOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <form 
            onSubmit={handleSaveProfile}
            className={`w-full max-w-xl rounded-[2.5rem] p-8 border ${theme === 'light' ? 'bg-white border-gray-200 text-gray-800' : 'bg-[#12132b] border-white/10 text-white'} shadow-2xl relative overflow-hidden`}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black flex items-center gap-3">
                <div className="w-10 h-10 bg-[#8f5bff] rounded-xl flex items-center justify-center text-white shadow-lg">
                  <i className="fas fa-user-circle"></i>
                </div>
                تخصيص المحارب
              </h2>
              <button type="button" onClick={() => setIsProfileOpen(false)} className="text-gray-500 hover:text-red-400"><i className="fas fa-times text-xl"></i></button>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-[10px] uppercase font-black text-gray-500 mb-3 tracking-widest">الاسم القتالي الجديد</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="اكتب اسمك هنا..."
                    required
                    className={`w-full p-5 rounded-2xl border outline-none focus:border-[#8f5bff] transition-all font-bold text-lg ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-[#0f1024] border-white/5'}`}
                  />
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8f5bff]">
                    <i className="fas fa-pen-nib"></i>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black text-gray-500 mb-4 tracking-widest">اختر صورتك الرمزية (Avatar)</label>
                <div className="grid grid-cols-4 gap-4 p-4 rounded-3xl bg-black/20 border border-white/5">
                  {PRESET_AVATARS.map((avatar) => (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => { setTempAvatar(avatar.url); audioService.playClick(); }}
                      className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all group ${tempAvatar === avatar.url ? 'border-[#8f5bff] shadow-[0_0_20px_rgba(143,91,255,0.4)] scale-105' : 'border-transparent hover:border-white/20'}`}
                    >
                      <img src={avatar.url} className="w-full h-full object-cover bg-[#1a1b3b]" alt="Preset Avatar" />
                      {tempAvatar === avatar.url && (
                        <div className="absolute inset-0 bg-[#8f5bff]/20 flex items-center justify-center">
                          <i className="fas fa-check-circle text-white text-xl"></i>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="submit" 
                  className="flex-1 py-5 bg-[#8f5bff] text-white rounded-2xl font-black text-lg shadow-xl shadow-[#8f5bff]/30 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  حفظ الهوية الجديدة
                </button>
                <button 
                  type="button"
                  onClick={() => setIsProfileOpen(false)}
                  className={`flex-1 py-5 rounded-2xl font-black text-lg transition-all ${theme === 'light' ? 'bg-gray-100 text-gray-500' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                >
                  إلغاء
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* نافذة الإعدادات */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className={`w-full max-w-md rounded-[2.5rem] p-8 border ${theme === 'light' ? 'bg-white border-gray-200 text-gray-800' : 'bg-[#12132b] border-white/10 text-white'} shadow-2xl`}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black flex items-center gap-3">
                 <i className="fas fa-cog text-[#8f5bff]"></i> الإعدادات
              </h2>
              <button onClick={() => setIsSettingsOpen(false)} className="text-gray-500 hover:text-red-400"><i className="fas fa-times text-xl"></i></button>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest">المظهر العام</p>
                <div className={`flex items-center justify-between p-4 rounded-2xl border ${theme === 'light' ? 'bg-gray-50 border-gray-100' : 'bg-white/5 border-white/5'}`}>
                  <div className="flex items-center gap-3">
                    <i className={`fas ${theme === 'light' ? 'fa-sun text-yellow-500' : 'fa-moon text-[#8f5bff]'}`}></i>
                    <span className="font-bold">{theme === 'light' ? 'الوضع المضيء' : 'الوضع الليلي'}</span>
                  </div>
                  <button 
                    onClick={toggleTheme}
                    className={`w-14 h-7 rounded-full relative transition-all duration-300 ${theme === 'light' ? 'bg-gray-300' : 'bg-[#8f5bff]'}`}
                  >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${theme === 'light' ? 'right-1' : 'right-8'}`}></div>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest">الموسيقى والصوت</p>
                <div className={`p-6 rounded-2xl border ${theme === 'light' ? 'bg-gray-50 border-gray-100' : 'bg-white/5 border-white/5'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm font-bold opacity-70">مستوى الصوت</span>
                    <span className="text-xs font-black text-[#8f5bff]">{Math.round(volume * 100)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="1" step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full accent-[#8f5bff] cursor-pointer h-1.5 bg-white/10 rounded-full appearance-none"
                  />
                  <div className="flex items-center justify-between mt-8">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#8f5bff]/10 flex items-center justify-center text-[#8f5bff]">
                        <i className="fas fa-music text-xs"></i>
                      </div>
                      <span className="text-xs font-bold truncate max-w-[120px]">{audioService.getCurrentTrackName()}</span>
                    </div>
                    <button 
                      onClick={() => { audioService.nextTrack(); audioService.playClick(); }}
                      className="px-4 py-2 bg-[#8f5bff] text-white text-[10px] font-black rounded-lg hover:scale-105 active:scale-95 transition-all"
                    >
                      تغيير الأغنية
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="w-full mt-10 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-sm hover:bg-[#8f5bff] hover:text-white transition-all"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
