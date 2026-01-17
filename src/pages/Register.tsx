import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { ARAB_COUNTRIES } from '../types';
import { supabase } from '../lib/supabase';
import { audioService } from '../services/audio';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const captchaRef = useRef<HCaptcha>(null);

  // مفتاح الموقع (Site Key)
  // يفضل وضعه في المتغيرات البيئية في Cloudflare باسم VITE_HCAPTCHA_SITE_KEY
  // أو يمكنك وضعه هنا مباشرة كنص إذا واجهت صعوبة
  const HCAPTCHA_SITE_KEY = import.meta.env.VITE_HCAPTCHA_SITE_KEY || "ضع_مفتاح_الموقع_هنا_اذا_لم_يعمل_المتغير";

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    audioService.playClick();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: 'https://code-batell.pages.dev/#/dashboard'
      }
    });
    if (error) setError("خطأ في الاتصال بالمزود: " + error.message);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!country) { setError("يرجى اختيار الدولة."); return; }
    
    // التحقق من الكابتشا
    if (!captchaToken) { 
      setError("يرجى إثبات أنك لست روبوت (حل الكابتشا)."); 
      return; 
    }

    setLoading(true);
    audioService.playClick();

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { 
          data: { full_name: name, country: country },
          captchaToken: captchaToken,
          // 👇 هذا هو السطر الأهم لحل مشكلة التوجيه
          emailRedirectTo: 'https://code-batell.pages.dev/#/dashboard'
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        if (authData.session) {
          // تم الدخول مباشرة (لا يتطلب تأكيد)
          localStorage.setItem("cb_token", authData.session.access_token);
          localStorage.setItem("cb_username", name);
          audioService.playSuccess();
          navigate('/dashboard');
        } else {
          // يتطلب تأكيد البريد
          audioService.playSuccess();
          setSuccessMsg("تم إرسال رابط التفعيل إلى بريدك الإلكتروني. يرجى التحقق منه للدخول.");
          setName(''); setEmail(''); setPassword(''); setCountry('');
          captchaRef.current?.resetCaptcha();
          setCaptchaToken(null);
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "حدث خطأ أثناء التسجيل.");
      audioService.playError();
      captchaRef.current?.resetCaptcha();
      setCaptchaToken(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top,#3c2b82,#0f1024)]">
      <div className="bg-[#12132b] border border-white/10 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl relative">
        <h1 className="text-3xl font-black mb-2 text-right">إنشاء محارب جديد</h1>
        <p className="text-gray-400 mb-8 text-right">انضم إلى أكبر تجمع للمبرمجين العرب.</p>
        
        {successMsg ? (
          <div className="bg-green-500/10 border border-green-500/50 p-6 rounded-2xl text-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl shadow-lg">
              <i className="fas fa-envelope-open-text"></i>
            </div>
            <h3 className="text-green-400 font-bold text-lg mb-2">تحقق من بريدك!</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{successMsg}</p>
            <div className="mt-6">
              <Link to="/login" className="text-[#8f5bff] font-bold hover:underline">الذهاب لصفحة الدخول</Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4 text-right">
            <div>
              <label className="block text-xs font-black mb-1.5 text-gray-500 uppercase tracking-widest">الاسم الكامل</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#0f1024] border border-[#34355a] p-3 rounded-xl outline-none text-white" />
            </div>
            <div>
              <label className="block text-xs font-black mb-1.5 text-gray-500 uppercase tracking-widest">الدولة</label>
              <select required value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-[#0f1024] border border-[#34355a] p-3 rounded-xl outline-none text-white">
                <option value="" disabled>اختر دولتك</option>
                {ARAB_COUNTRIES.map((c) => <option key={c.code} value={`${c.flag} ${c.name}`}>{c.flag} {c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black mb-1.5 text-gray-500 uppercase tracking-widest">البريد الإلكتروني</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#0f1024] border border-[#34355a] p-3 rounded-xl outline-none text-left" dir="ltr" />
            </div>
            <div>
              <label className="block text-xs font-black mb-1.5 text-gray-500 uppercase tracking-widest">كلمة المرور</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#0f1024] border border-[#34355a] p-3 rounded-xl outline-none text-left" dir="ltr" />
            </div>
            
            {/* الكابتشا */}
            <div className="flex justify-center py-4">
              <HCaptcha
                ref={captchaRef}
                sitekey={HCAPTCHA_SITE_KEY}
                onVerify={(token) => setCaptchaToken(token)}
                onExpire={() => setCaptchaToken(null)}
                theme="dark"
              />
            </div>

            {error && <p className="text-red-500 text-xs text-center font-bold bg-red-500/10 p-2 rounded-lg animate-pulse">{error}</p>}
            
            <button type="submit" disabled={loading} className="w-full py-4 bg-[#8f5bff] text-white rounded-xl font-black text-lg hover:bg-[#7a49e6] transition-all disabled:opacity-50 shadow-lg shadow-[#8f5bff]/20">
              {loading ? 'جاري التحقق وإنشاء الحساب...' : 'إنشاء الحساب'}
            </button>
          </form>
        )}

        {!successMsg && (
          <div className="mt-6">
            <div className="relative flex items-center justify-center mb-6">
              <div className="border-t border-white/5 w-full"></div>
              <span className="bg-[#12132b] px-4 text-[10px] text-gray-500 font-black uppercase absolute">أو التسجيل عبر</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleSocialLogin('google')} className="flex items-center justify-center gap-3 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                <i className="fab fa-google text-red-500"></i> <span className="text-xs font-bold">Google</span>
              </button>
              <button onClick={() => handleSocialLogin('github')} className="flex items-center justify-center gap-3 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                <i className="fab fa-github text-white"></i> <span className="text-xs font-bold">GitHub</span>
              </button>
            </div>
            <div className="mt-8 text-center text-sm text-gray-400">
              لديك حساب بالفعل؟ <Link to="/login" className="text-[#8f5bff] font-bold hover:underline">تسجيل الدخول</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;