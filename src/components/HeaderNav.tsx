import { Database, FileSpreadsheet, LogOut, Printer, Sparkles, Syringe, UserCheck } from 'lucide-react';
import type { ActiveTab, PharmacistSession } from '../types/pharmacy';

interface HeaderNavProps {
  formularyCount: number;
  autoFilledCount: number;
  regimenCount: number;
  stickersCount: number;
  activeTab: ActiveTab;
  session: PharmacistSession;
  onTabChange: (tab: ActiveTab) => void;
  onLogout: () => void;
}

export function HeaderNav({
  formularyCount,
  autoFilledCount,
  regimenCount,
  stickersCount,
  activeTab,
  session,
  onTabChange,
  onLogout,
}: HeaderNavProps) {
  const tabs: Array<{
    id: ActiveTab;
    label: string;
    icon: typeof Sparkles;
    count?: number;
  }> = [
    { id: 'autofill', label: '1. All Drugs Auto-Fill', icon: Sparkles, count: autoFilledCount },
    { id: 'regimen', label: '2. Patient Excel Sheet', icon: FileSpreadsheet, count: regimenCount },
    { id: 'labels', label: '3. Thermal Labels', icon: Printer, count: stickersCount },
    { id: 'config', label: '4. Prep Standards', icon: Database },
  ];

  return (
    <header className="bg-slate-900 text-white shadow-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-teal-500/20 border border-teal-400/30 p-2 rounded-xl">
            <Syringe className="w-6 h-6 text-teal-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">
                PediaSurg<span className="text-teal-400">Rx</span>
              </h1>
              <span className="text-[11px] font-bold bg-teal-500/20 text-teal-200 border border-teal-400/30 px-2 py-0.5 rounded-full">
                Master Formulary ({formularyCount} Drugs)
              </span>
            </div>
            <p className="text-xs text-slate-300" dir="rtl">
              الموسوعة الصيدلانية الشاملة لحساب الجرعات والتحضير الوريدي وطباعة ملصقات المرضى
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700 overflow-x-auto max-w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-teal-500 text-slate-950 shadow-sm'
                    : 'text-slate-200 hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="bg-black/20 px-1.5 py-0.5 rounded text-[11px] font-mono">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-xl">
          <UserCheck className="w-4 h-4 text-teal-400 shrink-0" />
          <div className="text-right leading-tight">
            <div className="text-xs font-bold text-white" dir="rtl">
              {session.displayName}
            </div>
            <div className="text-[10px] text-slate-400">{session.role}</div>
          </div>
          <button
            onClick={onLogout}
            className="ml-1.5 px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-400/30 text-xs font-bold flex items-center gap-1 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>خروج</span>
          </button>
        </div>
      </div>
    </header>
  );
}
