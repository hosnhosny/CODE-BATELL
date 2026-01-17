import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LessonPage from './pages/Lesson';
import Store from './pages/Store';
import Leaderboard from './pages/Leaderboard';
import Arena from './pages/Arena';
import BugHunter from './pages/BugHunter';
import Community from './pages/GlobalChat';
import AIAssistant from './components/AIAssistant';
import { audioService } from './services/audio';

// مكون إضافي لمعالجة التوجيه ومراقبة الصوت
const AuthHandler: React.FC<{ setUser: (name: string | null) => void }> = ({ setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // دالة لجلب بيانات المستخدم وحفظها
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
        } else {
          setUser(session.user.user_metadata.full_name || 'محارب');
        }
      } else {
        setUser(null);
        localStorage.clear();
      }
    };

    // الاستماع لتغييرات الحالة (هذا ما يعمل عند الضغط على رابط الإيميل)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await syncUserSession(session);
        
        // إصلاح مشكلة رابط الإيميل: التوجيه للوحة التحكم وتنظيف الرابط
        if (window.location.hash.includes('access_token') || 
            window.location.hash.includes('type=signup') || 
            window.location.hash.includes('type=recovery')) {
            navigate('/dashboard', { replace: true });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.clear();
        navigate('/');
      }
    });

    // التحقق الأولي عند تحميل التطبيق
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        syncUserSession(session);
        // إذا كان المستخدم مسجلاً بالفعل ويحاول دخول صفحة الدخول
        if (location.pathname === '/login' || location.pathname === '/register') {
          navigate('/dashboard', { replace: true });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location, setUser]);

  // تشغيل صوت عند تغيير الصفحة
  useEffect(() => { audioService.playNav(); }, [location.pathname]);

  return null;
};

const App: React.FC = () => {
  const [user, setUser] = useState<string | null>(localStorage.getItem('cb_username'));
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [currentCodeContext, setCurrentCodeContext] = useState<string | undefined>(undefined);

  useEffect(() => {
    const handleCodeUpdate = (e: any) => { setCurrentCodeContext(e.detail); };
    window.addEventListener('codeUpdate', handleCodeUpdate);
    return () => { window.removeEventListener('codeUpdate', handleCodeUpdate); };
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
      <AuthHandler setUser={setUser} />
      
      <div className="min-h-screen flex flex-col">
        <Navbar 
          user={user} 
          onLogout={handleLogout} 
          onOpenTracks={() => window.location.hash = user ? '/dashboard' : '/login'} 
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