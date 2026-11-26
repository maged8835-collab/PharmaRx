import type { FormEvent } from 'react';
import { X } from 'lucide-react';
import type { DoseUnit, FrequencyKey, NewDrugFormState } from '../types/pharmacy';
import { FREQUENCY_CONFIG, VALID_DOSE_UNITS } from '../utils/calculations';

interface QuickAddModalProps {
  isOpen: boolean;
  weightKg: number | string;
  newDrugForm: NewDrugFormState;
  onChange: (form: NewDrugFormState) => void;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
}

export function QuickAddModal({
  isOpen,
  weightKg,
  newDrugForm,
  onChange,
  onClose,
  onSubmit,
}: QuickAddModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-5 space-y-4 animate-scale-in">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              + Quick Add Custom Drug to Pharmacy
            </h3>
            <p className="text-xs text-slate-500" dir="rtl">
              أضف أي دواء غير موجود وسيتم حسابه فوراً لوزن المريض الحالي ({weightKg} كجم)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Trade Name (System)*
              </label>
              <input
                type="text"
                required
                value={newDrugForm.tradeName}
                onChange={(e) => onChange({ ...newDrugForm, tradeName: e.target.value })}
                placeholder="e.g. Invanz"
                className="w-full p-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Active Ingredient*
              </label>
              <input
                type="text"
                required
                value={newDrugForm.genericName}
                onChange={(e) => onChange({ ...newDrugForm, genericName: e.target.value })}
                placeholder="e.g. Ertapenem"
                className="w-full p-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Unit*
              </label>
              <select
                value={newDrugForm.doseUnit}
                onChange={(e) =>
                  onChange({ ...newDrugForm, doseUnit: e.target.value as DoseUnit })
                }
                className="w-full p-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg"
              >
                {VALID_DOSE_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Conc ({newDrugForm.doseUnit}/mL)*
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={newDrugForm.finalConcMgMl}
                onChange={(e) => onChange({ ...newDrugForm, finalConcMgMl: e.target.value })}
                className="w-full p-2 text-xs font-black font-mono bg-teal-50 border border-teal-500 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Dose ({newDrugForm.doseUnit}/kg)*
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={newDrugForm.doseMgPerKg}
                onChange={(e) => onChange({ ...newDrugForm, doseMgPerKg: e.target.value })}
                className="w-full p-2 text-xs font-bold font-mono bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Max ({newDrugForm.doseUnit})
              </label>
              <input
                type="number"
                value={newDrugForm.maxSingleMg}
                onChange={(e) => onChange({ ...newDrugForm, maxSingleMg: e.target.value })}
                className="w-full p-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Frequency
              </label>
              <select
                value={newDrugForm.frequency}
                onChange={(e) =>
                  onChange({ ...newDrugForm, frequency: e.target.value as FrequencyKey })
                }
                className="w-full p-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg"
              >
                {Object.keys(FREQUENCY_CONFIG).map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Route
              </label>
              <select
                value={newDrugForm.route}
                onChange={(e) => onChange({ ...newDrugForm, route: e.target.value })}
                className="w-full p-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="IV Shot">IV Shot</option>
                <option value="IV Infusion">IV Infusion</option>
                <option value="SC Shot">SC Shot</option>
                <option value="PO / SL">PO / SL</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Preparation &amp; Dilution Instructions
            </label>
            <input
              type="text"
              value={newDrugForm.prepInstructions}
              onChange={(e) => onChange({ ...newDrugForm, prepInstructions: e.target.value })}
              className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold bg-slate-100 text-slate-700 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-extrabold bg-teal-700 hover:bg-teal-800 text-white rounded-xl"
            >
              Save &amp; Auto-Calculate Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
