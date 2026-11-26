import { useState } from 'react';
import {
  AlertTriangle,
  CloudUpload,
  FolderOpen,
  Gauge,
  RotateCcw,
  Trash2,
  User,
} from 'lucide-react';
import type { AgeUnit, PatientInfo, SavedPatientRecord } from '../types/pharmacy';
import { isNeonatePatient } from '../utils/clinicalSafety';

interface PatientIntakeBarProps {
  patient: PatientInfo;
  formularyCount: number;
  savedPatients: SavedPatientRecord[];
  isSavingCloud: boolean;
  onChange: (updated: PatientInfo) => void;
  onClearPatient: () => void;
  onOpenPumpCalc: () => void;
  onSaveToCloud: () => void;
  onLoadSavedPatient: (record: SavedPatientRecord) => void;
  onDeleteSavedPatient: (id: string) => void;
}

export function PatientIntakeBar({
  patient,
  formularyCount,
  savedPatients,
  isSavingCloud,
  onChange,
  onClearPatient,
  onOpenPumpCalc,
  onSaveToCloud,
  onLoadSavedPatient,
  onDeleteSavedPatient,
}: PatientIntakeBarProps) {
  const [showSavedList, setShowSavedList] = useState(false);
  const neonate = isNeonatePatient(patient);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-5">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_2px_16px_rgba(15,23,42,0.04)] p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                Patient Profile
              </h2>
              <p className="text-[11px] text-slate-400 font-medium" dir="rtl">
                حساب لحظي لـ {formularyCount} دواء من Supabase عند تعديل الوزن
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

            <button
              onClick={onSaveToCloud}
              disabled={isSavingCloud}
              className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-teal-600/20 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <CloudUpload className="w-3.5 h-3.5" />
              <span>{isSavingCloud ? 'Saving...' : 'حفظ سحابياً'}</span>
            </button>

            <button
              onClick={() => setShowSavedList((p) => !p)}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>المحفوظون ({savedPatients.length})</span>
            </button>

            <button
              onClick={onClearPatient}
              className="px-3 py-1.5 rounded-xl bg-rose-50/80 hover:bg-rose-100 text-rose-600 border border-rose-200/70 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
          </div>
        </div>

        {showSavedList && (
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 animate-fade-in-up">
            <div className="text-xs font-bold text-slate-700 mb-2" dir="rtl">
              سجل المرضى المحفوظ على Supabase:
            </div>
            {savedPatients.length === 0 ? (
              <p className="text-xs text-slate-500" dir="rtl">
                لا يوجد مرضى محفوظين بعد. اضغط &quot;حفظ سحابياً&quot; لحفظ الحالة الحالية.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {savedPatients.map((rec) => (
                  <div
                    key={rec.id}
                    className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs shadow-2xs"
                  >
                    <button
                      onClick={() => {
                        onLoadSavedPatient(rec);
                        setShowSavedList(false);
                      }}
                      className="font-bold text-teal-800 hover:underline text-right cursor-pointer"
                    >
                      {rec.patient_name} ({rec.weight_kg} kg • {rec.regimen?.length || 0} drugs)
                    </button>
                    <button
                      onClick={() => onDeleteSavedPatient(rec.id)}
                      className="text-rose-400 hover:text-rose-600 p-0.5 cursor-pointer"
                      title="Delete saved patient"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
          <div className="lg:col-span-4">
            <label className="block text-[11px] font-bold text-slate-500 mb-1 flex justify-between">
              <span>Patient Name</span>
              <span dir="rtl">اسم المريض</span>
            </label>
            <input
              type="text"
              dir="rtl"
              value={patient.fullName}
              onChange={(e) => onChange({ ...patient, fullName: e.target.value })}
              placeholder="اسم المريض..."
              className="w-full px-3.5 py-2.5 text-sm font-bold bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 outline-none transition-all"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-[11px] font-bold text-slate-500 mb-1 flex justify-between">
              <span>MRN / ID</span>
              <span dir="rtl">رقم الملف</span>
            </label>
            <input
              type="text"
              value={patient.mrn}
              onChange={(e) => onChange({ ...patient, mrn: e.target.value })}
              placeholder="20234098"
              className="w-full px-3 py-2.5 text-sm font-bold font-mono tabular-nums bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 outline-none transition-all"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-[11px] font-bold text-slate-500 mb-1 flex justify-between">
              <span>Ward</span>
              <span dir="rtl">القسم</span>
            </label>
            <input
              type="text"
              value={patient.ward}
              onChange={(e) => onChange({ ...patient, ward: e.target.value })}
              placeholder="PICU / قسطرة"
              className="w-full px-3 py-2.5 text-sm font-bold bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 outline-none transition-all"
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
                value={patient.weightKg}
                onChange={(e) => onChange({ ...patient, weightKg: e.target.value })}
                className="w-full px-3.5 py-2 text-lg font-black font-mono tabular-nums bg-gradient-to-r from-teal-50 to-emerald-50 border-2 border-teal-500/80 text-teal-950 rounded-xl focus:ring-4 focus:ring-teal-500/15 focus:border-teal-600 outline-none transition-all"
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
                value={patient.baseDate}
                onChange={(e) => onChange({ ...patient, baseDate: e.target.value })}
                className="w-full px-2 py-2.5 text-xs font-bold bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">
                1st Dose
              </label>
              <input
                type="time"
                value={patient.defaultStartTime}
                onChange={(e) =>
                  onChange({ ...patient, defaultStartTime: e.target.value })
                }
                className="w-full px-2 py-2.5 text-xs font-bold bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 outline-none"
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
              value={patient.ageValue ?? ''}
              onChange={(e) => onChange({ ...patient, ageValue: e.target.value })}
              className="w-12 bg-transparent font-mono font-bold text-slate-800 outline-none text-center"
            />
            <select
              value={patient.ageUnit || 'years'}
              onChange={(e) =>
                onChange({ ...patient, ageUnit: e.target.value as AgeUnit })
              }
              className="bg-transparent font-bold text-slate-700 outline-none cursor-pointer"
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
            className={`flex items-center gap-2 font-bold px-3 py-1 rounded-xl border cursor-pointer transition-colors ${
              patient.renalImpairment
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <input
              type="checkbox"
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
