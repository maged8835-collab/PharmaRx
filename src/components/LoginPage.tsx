import { useState, type FormEvent } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Cloud,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Syringe,
  UserPlus,
} from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';
import type { PharmacistSession } from '../types/pharmacy';
import { signInWithSupabaseEmail, signUpWithSupabaseEmail } from '../utils/cloudSync';

interface LoginPageProps {
  onLoginSuccess: (session: PharmacistSession) => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMsg('');

    if (!isSupabaseConfigured) {
      setError('لم يتم ضبط إعدادات Supabase (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).');
      return;
    }

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) return;

    setIsLoading(true);
    if (mode === 'signup') {
      const res = await signUpWithSupabaseEmail(cleanEmail, password, displayName);
      setIsLoading(false);

      if (res.error) {
        setError(res.error);
        return;
      }
      if (res.needsEmailConfirm) {
        setInfoMsg(
          'تم إنشاء الحساب! افحص بريدك الإلكتروني لتأكيد الحساب ثم قم بتسجيل الدخول.'
        );
        setMode('signin');
        return;
      }
      if (res.session) {
        onLoginSuccess(res.session);
      }
      return;
    }

    const res = await signInWithSupabaseEmail(cleanEmail, password);
    setIsLoading(false);

    if (res.error || !res.session) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      return;
    }
    onLoginSuccess(res.session);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-teal-500/20 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl animate-float-slow-reverse" />

      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-black/50 border border-slate-200/80 overflow-hidden animate-scale-in">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white px-6 py-7 text-center space-y-2 border-b border-slate-800">
          <div className="inline-flex items-center justify-center bg-teal-500/20 border border-teal-400/30 p-3.5 rounded-2xl mb-1 shadow-lg shadow-teal-500/10">
            <Syringe className="w-7 h-7 text-teal-300" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            PediaSurg<span className="text-teal-400">Rx</span>
          </h1>
          <p className="text-xs text-slate-300" dir="rtl">
            بوابة الصيدلي الإكلينيكي — تسجيل الدخول السحابي عبر Supabase
          </p>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-teal-500/15 text-teal-200 border border-teal-400/25 px-2.5 py-0.5 rounded-full">
            <Cloud className="w-3.5 h-3.5" />
            <span>Supabase Cloud Auth</span>
          </div>
        </div>

        <div className="grid grid-cols-2 bg-slate-100 p-1.5 m-4 mb-0 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError('');
              setInfoMsg('');
            }}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError('');
              setInfoMsg('');
            }}
            className={`py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
              mode === 'signup'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>حساب جديد</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div
              dir="rtl"
              className="bg-rose-50 border border-rose-200 text-rose-800 px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {infoMsg && (
            <div
              dir="rtl"
              className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{infoMsg}</span>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex justify-between">
                <span>Pharmacist Name</span>
                <span dir="rtl">اسم الصيدلي</span>
              </label>
              <input
                type="text"
                required
                dir="rtl"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="د. ..."
                className="w-full px-3.5 py-2.5 text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex justify-between">
              <span>Email</span>
              <span dir="rtl">البريد الإلكتروني</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                autoFocus
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pharmacist@hospital.com"
                className="w-full pl-10 pr-3.5 py-2.5 text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex justify-between">
              <span>Password</span>
              <span dir="rtl">كلمة المرور</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full pl-10 pr-10 py-2.5 text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-60 text-white font-extrabold text-sm rounded-xl shadow-md shadow-teal-600/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              {isLoading
                ? 'جاري التحقق...'
                : mode === 'signup'
                  ? 'إنشاء حساب سحابي | Create Account'
                  : 'دخول إلى المنصة | Sign In'}
            </span>
          </button>
        </form>
      </div>

      <p className="relative z-10 mt-5 text-[11px] text-slate-400 text-center">
        PediaSurgRx Clinical Pharmacy System • Powered by Supabase
      </p>
    </div>
  );
}
