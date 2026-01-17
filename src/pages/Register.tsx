import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import HCaptcha from '@hcaptcha/react-hcaptcha'; // استيراد المكتبة
import { ARAB_COUNTRIES } from '../types';
import { supabase } from '../lib/supabase';
import { audioService } from '../services/audio';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null); // حالة لحفظ رمز الكابتشا
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const captchaRef = useRef<HCaptcha>(null);

  // استبدل هذا بمفتاح الموقع الخاص بك من hCaptcha
  // يفضل وضعه في ملف .env مثل: import.meta.env.VITE_HCAPTCHA_SITE_KEY
  const HCAPTCHA_SITE_KEY = "0566d5d0-e572-4864-8374-3140d496d0a6"; // هذا مفتاح تجريبي للاختبار فقط

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    audioService.playClick();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: window.location.origin + '/#/dashboard'
      }
    });
    if (error) setError("خطأ في الاتصال بالمزود: " + error.message);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    // 1. التحقق من الدولة
    if (!country) { setError("يرجى اختيار الدولة."); return; }
    
    // 2. التحقق من الكابتشا
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
          captchaToken: captchaToken // إرسال رمز التحقق للسيرفر
        }
      });

      if (authError) throw authError;

      // إذا تم التسجيل بنجاح
      if (authData.user) {
        // التحقق مما إذا كان هناك جلسة (يعني تم تسجيل الدخول مباشرة)
        // أو لا توجد جلسة (يعني بانتظار تأكيد البريد الإلكتروني)
        if (authData.session) {
          localStorage.setItem("cb_token", authData.session.access_token);
          localStorage.setItem("cb_username", name);
          audioService.playSuccess();
          navigate('/dashboard');
        } else {
          // هذه الحالة تعني أن Supabase ينتظر تأكيد البريد الإلكتروني
          audioService.playSuccess();
          setSuccessMsg("تم إرسال رابط التفعيل إلى بريدك الإلكتروني. يرجى التحقق من الصندوق الوارد (أو الرسائل غير المرغوب فيها) لتفعيل حسابك.");
          // تفريغ الحقول لمنع التكرار
          setName(''); setEmail(''); setPassword(''); setCountry('');
          captchaRef.current?.resetCaptcha(); // إعادة تعيين الكابتشا
        }
      }
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء التسجيل.");
      audioService.playError();
      captchaRef.current?.resetCaptcha(); // إعادة تعيين الكابتشا عند الخطأ
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
            
            {/* مكان الكابتشا */}
            <div className="flex justify-center py-2">
              <HCaptcha
                ref={captchaRef}
                sitekey={HCAPTCHA_SITE_KEY}
                onVerify={(token) => setCaptchaToken(token)}
                onExpire={() => setCaptchaToken(null)}
                theme="dark" // ليتناسب مع تصميم الموقع
              />
            </div>

            {error && <p className="text-red-500 text-xs text-center font-bold bg-red-500/10 p-2 rounded-lg animate-pulse">{error}</p>}
            
            <button type="submit" disabled={loading} className="w-full py-4 bg-[#8f5bff] text-white rounded-xl font-black text-lg hover:bg-[#7a49e6] transition-all disabled:opacity-50 shadow-lg shadow-[#8f5bff]/20">
              {loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
            </button>
          </form>
        )}

        {/* أزرار التسجيل الاجتماعي تظهر فقط إذا لم تنجح العملية بعد */}
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