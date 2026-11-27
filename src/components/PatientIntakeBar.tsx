import { AlertTriangle, ArrowRight, CloudUpload, Gauge, Lock, User } from 'lucide-react';
import type { AgeUnit, PatientInfo } from '../types/pharmacy';
import { isNeonatePatient } from '../utils/clinicalSafety';

interface PatientIntakeBarProps {
  patient: PatientInfo;
  formularyCount: number;
  isReadOnly: boolean;
  lockedByName: string;
  isSavingCloud: boolean;
  onChange: (updated: PatientInfo) => void;
  onBackToPatients: () => void;
  onOpenPumpCalc: () => void;
  onSaveToCloud: () => void;
}

export function PatientIntakeBar({
  patient,
  formularyCount,
  isReadOnly,
  lockedByName,
  isSavingCloud,
  onChange,
  onBackToPatients,
  onOpenPumpCalc,
  onSaveToCloud,
}: PatientIntakeBarProps) {
  const neonate = isNeonatePatient(patient);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 space-y-3">
      {isReadOnly && (
        <div
          dir="rtl"
          className="bg-amber-50 border border-amber-300 text-amber-950 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs animate-fade-in-up"
        >
          <div className="flex items-center gap-2.5 text-xs font-bold">
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              هذا الملف قيد العمل حالياً بواسطة: <strong>{lockedByName || 'صيدلي آخر'}</strong> — وضع{' '}
              <strong>القراءة فقط (Read-Only)</strong> لمنع تضارب الأوامر والعلاجات.
            </span>
          </div>
          <button
            onClick={onBackToPatients}
            className="px-3 py-1.5 rounded-xl bg-amber-200/80 hover:bg-amber-300 text-amber-950 text-xs font-extrabold cursor-pointer"
          >
            العودة لقائمة المرضى
          </button>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_2px_16px_rgba(15,23,42,0.04)] p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBackToPatients}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>كل المرضى</span>
            </button>

            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                Active Patient Workspace
              </h2>
              <p className="text-[11px] text-slate-400 font-medium" dir="rtl">
                حساب لحظي لـ {formularyCount} دواء عند تعديل الوزن
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onOpenPumpCalc}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <Gauge className="w-3.5 h-3.5 text-teal-400" />
              <span>Pump mL/hr</span>
            </button>

            {!isReadOnly && (
              <button
                onClick={onSaveToCloud}
                disabled={isSavingCloud}
                className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-teal-600/20 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <CloudUpload className="w-3.5 h-3.5" />
                <span>{isSavingCloud ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
          <div className="lg:col-span-4">
            <label className="block text-[11px] font-bold text-slate-500 mb-1 flex justify-between">
              <span>Patient Name</span>
              <span dir="rtl">اسم المريض</span>
            </label>
            <input
              type="text"
              dir="rtl"
              disabled={isReadOnly}
              value={patient.fullName}
              onChange={(e) => onChange({ ...patient, fullName: e.target.value })}
              placeholder="اسم المريض..."
              className="w-full px-3.5 py-2.5 text-sm font-bold bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 outline-none transition-all disabled:opacity-60"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-[11px] font-bold text-slate-500 mb-1 flex justify-between">
              <span>MRN / ID</span>
              <span dir="rtl">رقم الملف</span>
            </label>
            <input
              type="text"
              disabled={isReadOnly}
              value={patient.mrn}
              onChange={(e) => onChange({ ...patient, mrn: e.target.value })}
              placeholder="20234098"
              className="w-full px-3 py-2.5 text-sm font-bold font-mono tabular-nums bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 outline-none transition-all disabled:opacity-60"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-[11px] font-bold text-slate-500 mb-1 flex justify-between">
              <span>Ward</span>
              <span dir="rtl">القسم</span>
            </label>
            <input
              type="text"
              disabled={isReadOnly}
              value={patient.ward}
              onChange={(e) => onChange({ ...patient, ward: e.target.value })}
              placeholder="PICU / قسطرة"
              className="w-full px-3 py-2.5 text-sm font-bold bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 outline-none transition-all disabled:opacity-60"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-[11px] font-extrabold text-teal-700 mb-1 flex justify-between">
              <span>WEIGHT*</span>
              <span dir="rtl">الوزن (كجم)</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0.3"
                max="250"
                disabled={isReadOnly}
                value={patient.weightKg}
                onChange={(e) => onChange({ ...patient, weightKg: e.target.value })}
                className="w-full px-3.5 py-2 text-lg font-black font-mono tabular-nums bg-gradient-to-r from-teal-50 to-emerald-50 border-2 border-teal-500/80 text-teal-950 rounded-xl focus:ring-4 focus:ring-teal-500/15 focus:border-teal-600 outline-none transition-all disabled:opacity-60"
              />
              <span className="absolute right-3 top-2.5 text-xs font-extrabold text-teal-700">
                kg
              </span>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-2 gap-1.5">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">
                Date
              </label>
              <input
                type="date"
                disabled={isReadOnly}
                value={patient.baseDate}
                onChange={(e) => onChange({ ...patient, baseDate: e.target.value })}
                className="w-full px-2 py-2.5 text-xs font-bold bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 outline-none disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">
                1st Dose
              </label>
              <input
                type="time"
                disabled={isReadOnly}
                value={patient.defaultStartTime}
                onChange={(e) =>
                  onChange({ ...patient, defaultStartTime: e.target.value })
                }
                className="w-full px-2 py-2.5 text-xs font-bold bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 outline-none disabled:opacity-60"
              />
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-xl">
            <span className="font-bold text-slate-500">Age:</span>
            <input
              type="number"
              min="0"
              step="1"
              placeholder="—"
              disabled={isReadOnly}
              value={patient.ageValue ?? ''}
              onChange={(e) => onChange({ ...patient, ageValue: e.target.value })}
              className="w-12 bg-transparent font-mono font-bold text-slate-800 outline-none text-center disabled:opacity-60"
            />
            <select
              disabled={isReadOnly}
              value={patient.ageUnit || 'years'}
              onChange={(e) =>
                onChange({ ...patient, ageUnit: e.target.value as AgeUnit })
              }
              className="bg-transparent font-bold text-slate-700 outline-none cursor-pointer disabled:opacity-60"
            >
              <option value="days">Days</option>
              <option value="months">Months</option>
              <option value="years">Years</option>
            </select>
          </div>

          {neonate && (
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-full">
              <AlertTriangle className="w-3 h-3" />
              NICU Neonate (≤28d)
            </span>
          )}

          <label
            className={`flex items-center gap-2 font-bold px-3 py-1 rounded-xl border transition-colors ${
              isReadOnly ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
            } ${
              patient.renalImpairment
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <input
              type="checkbox"
              disabled={isReadOnly}
              checked={Boolean(patient.renalImpairment)}
              onChange={(e) =>
                onChange({ ...patient, renalImpairment: e.target.checked })
              }
              className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
            />
            <span>Renal Impairment (قصور كلوي)</span>
          </label>
        </div>
      </div>
    </section>
  );
}
