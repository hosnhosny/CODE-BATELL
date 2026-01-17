import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { audioService } from '../services/audio';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    audioService.playClick();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: { redirectTo: window.location.origin + '/#/dashboard' }
    });
    if (error) setError("خطأ في الاتصال بالمزود: " + error.message);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    audioService.playClick();
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      if (data.user) {
        audioService.playSuccess();
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError("البريد أو كلمة المرور غير صحيحة.");
      audioService.playError();
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top,#3c2b82,#0f1024)]">
      <div className="bg-[#12132b] border border-white/10 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl relative">
        <h1 className="text-3xl font-black mb-2 text-right">تسجيل الدخول</h1>
        <p className="text-gray-400 mb-8 text-right text-sm">أهلاً بعودتك أيها المحارب!</p>
        
        <form onSubmit={handleLogin} className="space-y-5 text-right">
          <div>
            <label className="block text-xs font-black mb-1.5 text-gray-500 uppercase tracking-widest">البريد الإلكتروني</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#0f1024] border border-[#34355a] p-3 rounded-xl outline-none text-left" dir="ltr" />
          </div>
          <div>
            <label className="block text-xs font-black mb-1.5 text-gray-500 uppercase tracking-widest">كلمة المرور</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#0f1024] border border-[#34355a] p-3 rounded-xl outline-none text-left" dir="ltr" />
          </div>
          {error && <p className="text-red-500 text-xs text-center font-bold">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-4 bg-[#8f5bff] text-white rounded-xl font-black text-lg shadow-lg hover:bg-[#7a49e6] transition-all disabled:opacity-50">
            {loading ? 'جاري الدخول...' : 'دخول'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-white/5 w-full"></div>
            <span className="bg-[#12132b] px-4 text-[10px] text-gray-500 font-black uppercase absolute">أو الدخول عبر</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleSocialLogin('google')} className="flex items-center justify-center gap-3 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
              <i className="fab fa-google text-red-500"></i> <span className="text-xs font-bold">Google</span>
            </button>
            <button onClick={() => handleSocialLogin('github')} className="flex items-center justify-center gap-3 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
              <i className="fab fa-github text-white"></i> <span className="text-xs font-bold">GitHub</span>
            </button>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-400">
          ليس لديك حساب؟ <Link to="/register" className="text-[#8f5bff] font-bold hover:underline">أنشئ حساباً جديداً</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;