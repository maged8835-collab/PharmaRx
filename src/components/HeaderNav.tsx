import {
  BookOpen,
  Cloud,
  Database,
  FileSpreadsheet,
  LogOut,
  Moon,
  Printer,
  Shield,
  Sparkles,
  Sun,
  Syringe,
  Users,
} from 'lucide-react';
import type { ActiveTab, PharmacistSession } from '../types/pharmacy';

interface HeaderNavProps {
  formularyCount: number;
  autoFilledCount: number;
  regimenCount: number;
  stickersCount: number;
  activeTab: ActiveTab;
  hasActivePatient: boolean;
  isDark: boolean;
  session: PharmacistSession;
  onTabChange: (tab: ActiveTab) => void;
  onToggleTheme: () => void;
  onLogout: () => void;
}

export function HeaderNav({
  formularyCount,
  autoFilledCount,
  regimenCount,
  stickersCount,
  activeTab,
  hasActivePatient,
  isDark,
  session,
  onTabChange,
  onToggleTheme,
  onLogout,
}: HeaderNavProps) {
  const tabs: Array<{
    id: ActiveTab;
    label: string;
    icon: typeof Sparkles;
    count?: number;
  }> = [
    { id: 'patients', label: 'Patients', icon: Users },
    ...(hasActivePatient
      ? [
          {
            id: 'regimen' as ActiveTab,
            label: 'Patient Sheet',
            icon: FileSpreadsheet,
            count: regimenCount,
          },
          {
            id: 'autofill' as ActiveTab,
            label: 'Add Meds',
            icon: Sparkles,
            count: autoFilledCount,
          },
          {
            id: 'labels' as ActiveTab,
            label: 'Labels',
            icon: Printer,
            count: stickersCount,
          },
        ]
      : []),
    { id: 'config', label: 'Standards', icon: Database },
    { id: 'references', label: 'References', icon: BookOpen },
    ...(session.role === 'Admin'
      ? [{ id: 'admin' as ActiveTab, label: 'Admin', icon: Shield }]
      : []),
  ];

  const initials = session.displayName
    .replace(/^د\.\s*/, '')
    .trim()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_1px_12px_rgba(15,23,42,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-600/20">
            <Syringe className="w-5 h-5" />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900">
                PediaSurg<span className="text-sky-600">Rx</span>
              </h1>
              <span className="hidden sm:inline-flex items-center text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200/80 px-2 py-0.5 rounded-full">
                {formularyCount} Meds
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-500 font-medium" dir="rtl">
              منصة الجرعات والتحضير الوريدي للأطفال
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/70 overflow-x-auto max-w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/80'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive ? 'text-sky-600' : 'text-slate-400'
                  }`}
                />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isActive
                        ? 'bg-sky-50 text-sky-700'
                        : 'bg-slate-200/70 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200/70 transition-colors cursor-pointer"
            title={isDark ? 'الوضع النهاري (Light Mode)' : 'الوضع الليلي (Night Mode)'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          <div className="hidden sm:flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 pl-1.5 pr-3 py-1 rounded-full">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 text-white text-[11px] font-extrabold flex items-center justify-center">
              {initials || 'Rx'}
            </div>
            <div className="leading-tight text-right">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1" dir="rtl">
                <span>{session.displayName}</span>
                {session.authSource === 'supabase' && (
                  <span title="Supabase Cloud" className="inline-flex">
                    <Cloud className="w-3 h-3 text-sky-600" />
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-transparent hover:border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="تسجيل الخروج"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">خروج</span>
          </button>
        </div>
      </div>
    </header>
  );
}
