import { useState, type FormEvent } from 'react';
import { AlertCircle, Eye, EyeOff, Lock, ShieldCheck, Syringe, User } from 'lucide-react';
import type { PharmacistSession } from '../types/pharmacy';
import { authenticateUser } from '../utils/auth';

interface LoginPageProps {
  onLoginSuccess: (session: PharmacistSession, remember: boolean) => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const session = authenticateUser(username, password);
    if (!session) {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة. تأكد وحاول مرة أخرى.');
      return;
    }
    onLoginSuccess(session, rememberMe);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 flex flex-col justify-center items-center p-4">
      {/* Ambient animated gradient orbs */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-teal-500/20 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl animate-float-slow-reverse" />

      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-black/50 border border-slate-200/80 overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white px-6 py-7 text-center space-y-2 border-b border-slate-800">
          <div className="inline-flex items-center justify-center bg-teal-500/20 border border-teal-400/30 p-3.5 rounded-2xl mb-1 shadow-lg shadow-teal-500/10">
            <Syringe className="w-7 h-7 text-teal-300" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            PediaSurg<span className="text-teal-400">Rx</span>
          </h1>
          <p className="text-xs text-slate-300" dir="rtl">
            بوابة الصيدلي الإكلينيكي — تسجيل الدخول لمنصة الجرعات والتحضير الوريدي
          </p>
        </div>

        {/* Form */}
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

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex justify-between">
              <span>Username</span>
              <span dir="rtl">اسم المستخدم</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                autoFocus
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="w-full pl-10 pr-3.5 py-2.5 text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex justify-between">
              <span>Password / PIN</span>
              <span dir="rtl">كلمة المرور / الرقم السري</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
                className="w-full pl-10 pr-10 py-2.5 text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span dir="rtl">تذكر الجلسة على هذا الجهاز</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold text-sm rounded-xl shadow-md shadow-teal-600/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>دخول إلى المنصة | Sign In</span>
          </button>
        </form>
      </div>

      <p className="relative z-10 mt-5 text-[11px] text-slate-400 text-center">
        PediaSurgRx Clinical Pharmacy System • Local Access Protection
      </p>
    </div>
  );
}
