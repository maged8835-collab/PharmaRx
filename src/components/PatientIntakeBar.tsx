import { useState } from 'react';
import { CloudUpload, FolderOpen, RotateCcw, Trash2, User } from 'lucide-react';
import type { PatientInfo, SavedPatientRecord } from '../types/pharmacy';

export type DemoCaseType = 'lasix_3kg' | 'baraa' | 'mohamed' | 'fares_vanco';

interface PatientIntakeBarProps {
  patient: PatientInfo;
  formularyCount: number;
  isCloudUser: boolean;
  savedPatients: SavedPatientRecord[];
  isSavingCloud: boolean;
  onChange: (updated: PatientInfo) => void;
  onLoadDemoCase: (caseType: DemoCaseType) => void;
  onClearPatient: () => void;
  onSaveToCloud: () => void;
  onLoadSavedPatient: (record: SavedPatientRecord) => void;
  onDeleteSavedPatient: (id: string) => void;
}

export function PatientIntakeBar({
  patient,
  formularyCount,
  isCloudUser,
  savedPatients,
  isSavingCloud,
  onChange,
  onLoadDemoCase,
  onClearPatient,
  onSaveToCloud,
  onLoadSavedPatient,
  onDeleteSavedPatient,
}: PatientIntakeBarProps) {
  const [showSavedList, setShowSavedList] = useState(false);

  return (
    <section className="bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <User className="w-4 h-4 text-teal-600" />
            <span>
              PATIENT INTAKE (تغيير الوزن يعيد حساب جميع أدوية الصيدلية الـ{' '}
              {formularyCount} لحظياً)
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
            <span className="text-slate-400 font-semibold">Quick Cases:</span>
            <button
              onClick={() => onLoadDemoCase('lasix_3kg')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 hover:border-teal-300 font-semibold transition-all duration-150 hover:-translate-y-0.5 cursor-pointer"
            >
              يوسف (Lasix 3 kg = 1.5 mL)
            </button>
            <button
              onClick={() => onLoadDemoCase('baraa')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 hover:border-teal-300 font-semibold transition-all duration-150 hover:-translate-y-0.5 cursor-pointer"
            >
              براء (قسطرة - 21 kg)
            </button>
            <button
              onClick={() => onLoadDemoCase('mohamed')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 hover:border-teal-300 font-semibold transition-all duration-150 hover:-translate-y-0.5 cursor-pointer"
            >
              محمد علي (WARD - 36 kg)
            </button>
            <button
              onClick={() => onLoadDemoCase('fares_vanco')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 hover:border-teal-300 font-semibold transition-all duration-150 hover:-translate-y-0.5 cursor-pointer"
            >
              فارس (Vancomycin 36 kg = 144 mL)
            </button>

            {isCloudUser && (
              <>
                <button
                  onClick={onSaveToCloud}
                  disabled={isSavingCloud}
                  className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-bold flex items-center gap-1 transition-all duration-150 hover:-translate-y-0.5 cursor-pointer"
                  title="Save patient & regimen to Supabase"
                >
                  <CloudUpload className="w-3.5 h-3.5" />
                  <span>{isSavingCloud ? 'Saving...' : 'حفظ سحابياً'}</span>
                </button>

                <button
                  onClick={() => setShowSavedList((prev) => !prev)}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 font-bold flex items-center gap-1 transition-all duration-150 cursor-pointer"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>المرضى المحفوظون ({savedPatients.length})</span>
                </button>
              </>
            )}

            <button
              onClick={onClearPatient}
              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold flex items-center gap-1 transition-all duration-150 hover:-translate-y-0.5 cursor-pointer"
              title="Clear current patient & regimen"
            >
              <RotateCcw className="w-3 h-3" />
              <span>New Patient</span>
            </button>
          </div>
        </div>

        {isCloudUser && showSavedList && (
          <div className="mb-3 p-3 rounded-xl bg-slate-50 border border-slate-200 animate-fade-in-up">
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
                    className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs shadow-2xs"
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
                      className="text-rose-500 hover:text-rose-700 p-0.5 cursor-pointer"
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
            <label className="block text-[11px] font-bold text-slate-600 mb-1 flex justify-between">
              <span>Patient Full Name</span>
              <span dir="rtl">اسم المريض بالكامل</span>
            </label>
            <input
              type="text"
              dir="rtl"
              value={patient.fullName}
              onChange={(e) => onChange({ ...patient, fullName: e.target.value })}
              placeholder="اسم المريض..."
              className="w-full px-3 py-2 text-sm font-bold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-[11px] font-bold text-slate-600 mb-1 flex justify-between">
              <span>Patient ID / MRN</span>
              <span dir="rtl">رقم الملف</span>
            </label>
            <input
              type="text"
              value={patient.mrn}
              onChange={(e) => onChange({ ...patient, mrn: e.target.value })}
              placeholder="20234098"
              className="w-full px-3 py-2 text-sm font-bold font-mono tabular-nums bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-[11px] font-bold text-slate-600 mb-1 flex justify-between">
              <span>Ward / Unit</span>
              <span dir="rtl">القسم</span>
            </label>
            <input
              type="text"
              value={patient.ward}
              onChange={(e) => onChange({ ...patient, ward: e.target.value })}
              placeholder="WARD / قسطرة"
              className="w-full px-3 py-2 text-sm font-bold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-[11px] font-extrabold text-teal-800 mb-1 flex justify-between">
              <span>WEIGHT (kg)*</span>
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
                className="w-full px-3 py-2 text-base font-black font-mono tabular-nums bg-teal-50 border-2 border-teal-600 text-teal-950 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none shadow-2xs"
              />
              <span className="absolute right-3 top-2.5 text-xs font-extrabold text-teal-700">
                kg
              </span>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-2 gap-1.5">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">
                Date (DD/MM)
              </label>
              <input
                type="date"
                value={patient.baseDate}
                onChange={(e) => onChange({ ...patient, baseDate: e.target.value })}
                className="w-full px-2 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">
                1st Dose Time
              </label>
              <input
                type="time"
                value={patient.defaultStartTime}
                onChange={(e) =>
                  onChange({ ...patient, defaultStartTime: e.target.value })
                }
                className="w-full px-2 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
