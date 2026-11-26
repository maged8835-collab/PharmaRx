import { RotateCcw, User } from 'lucide-react';
import type { PatientInfo } from '../types/pharmacy';

export type DemoCaseType = 'lasix_3kg' | 'baraa' | 'mohamed' | 'fares_vanco';

interface PatientIntakeBarProps {
  patient: PatientInfo;
  formularyCount: number;
  onChange: (updated: PatientInfo) => void;
  onLoadDemoCase: (caseType: DemoCaseType) => void;
  onClearPatient: () => void;
}

export function PatientIntakeBar({
  patient,
  formularyCount,
  onChange,
  onLoadDemoCase,
  onClearPatient,
}: PatientIntakeBarProps) {
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
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 font-semibold"
            >
              يوسف (Lasix 3 kg = 1.5 mL)
            </button>
            <button
              onClick={() => onLoadDemoCase('baraa')}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 font-semibold"
            >
              براء (قسطرة - 21 kg)
            </button>
            <button
              onClick={() => onLoadDemoCase('mohamed')}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 font-semibold"
            >
              محمد علي (WARD - 36 kg)
            </button>
            <button
              onClick={() => onLoadDemoCase('fares_vanco')}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 font-semibold"
            >
              فارس (Vancomycin 36 kg = 144 mL)
            </button>
            <button
              onClick={onClearPatient}
              className="px-2.5 py-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold flex items-center gap-1"
              title="Clear current patient & regimen"
            >
              <RotateCcw className="w-3 h-3" />
              <span>New Patient</span>
            </button>
          </div>
        </div>

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
