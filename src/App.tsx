import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar.tsx';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Dashboard from './pages/Dashboard.tsx';
import LessonPage from './pages/Lesson.tsx';
import Store from './pages/Store.tsx';
import Leaderboard from './pages/Leaderboard.tsx';
import Arena from './pages/Arena.tsx';
import BugHunter from './pages/BugHunter.tsx';
import Community from './pages/GlobalChat.tsx';
import AIAssistant from './components/AIAssistant.tsx';
import { audioService } from './services/audio';

const RouteWatcher: React.FC = () => {
  const location = useLocation();
  useEffect(() => { audioService.playNav(); }, [location.pathname]);
  return null;
};

const App: React.FC = () => {
  const [user, setUser] = useState<string | null>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [currentCodeContext, setCurrentCodeContext] = useState<string | undefined>(undefined);

  useEffect(() => {
    const syncUserSession = async (session: any) => {
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          localStorage.setItem('cb_username', profile.username);
          localStorage.setItem('cb_xp', profile.xp.toString());
          localStorage.setItem('cb_country', profile.country);
          localStorage.setItem('cb_avatar', profile.avatar_url);
          setUser(profile.username);
        }

        // 🚀 إصلاح مشكلة الرابط بعد العودة من الإيميل
        // هذا الجزء سيكتشف رمز الدخول ويوجه المستخدم للوحة التحكم
        if (window.location.hash && (window.location.hash.includes('access_token') || window.location.hash.includes('type=recovery'))) {
           // نستخدم replace لتنظيف الرابط وتوجيه المستخدم
           window.history.replaceState(null, '', '/#/dashboard');
        }
      } else {
        setUser(null);
        localStorage.clear();
      }
    };

    // التحقق عند بدء التطبيق
    supabase.auth.getSession().then(({ data: { session } }) => {
      syncUserSession(session);
    });

    // الاستماع لتغييرات الحالة (مثل الضغط على رابط الإيميل)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      syncUserSession(session);
    });

    const handleCodeUpdate = (e: any) => { setCurrentCodeContext(e.detail); };
    window.addEventListener('codeUpdate', handleCodeUpdate);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('codeUpdate', handleCodeUpdate);
    };
  }, []);

  const handleLogout = async () => {
    audioService.playClick();
    await supabase.auth.signOut();
    setUser(null);
    localStorage.clear();
    window.location.href = '/#/';
  };

  return (
    <Router>
      <RouteWatcher />
      <div className="min-h-screen flex flex-col">
        <Navbar 
          user={user} 
          onLogout={handleLogout} 
          onOpenTracks={() => window.location.href = user ? '/#/dashboard' : '/#/login'} 
          onOpenAI={() => { audioService.playAIActivate(); setIsAIModalOpen(true); }} 
        />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/track/c++" element={user ? <LessonPage /> : <Navigate to="/login" />} />
            <Route path="/arena" element={user ? <Arena /> : <Navigate to="/login" />} />
            <Route path="/arena/bug-hunter" element={user ? <BugHunter /> : <Navigate to="/login" />} />
            <Route path="/community" element={user ? <Community /> : <Navigate to="/login" />} />
            <Route path="/store" element={user ? <Store /> : <Navigate to="/login" />} />
            <Route path="/leaderboard" element={user ? <Leaderboard /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <footer className="bg-[#050616] border-t border-white/5 py-10 text-center text-sm text-gray-500">
          <div className="container mx-auto">
            <p>© 2025 CODE BATELL – منصة عربية لتعلم البرمجة بالتحديات.</p>
          </div>
        </footer>

        <AIAssistant isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} codeContext={currentCodeContext} />
      </div>
    </Router>
  );
};

export default App;