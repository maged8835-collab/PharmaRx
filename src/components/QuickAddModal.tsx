import { useState, type FormEvent } from 'react';
import { Globe, Loader2, Search, X } from 'lucide-react';
import type { DoseUnit, FrequencyKey, NewDrugFormState } from '../types/pharmacy';
import { FREQUENCY_CONFIG, VALID_DOSE_UNITS } from '../utils/calculations';
import { searchRxNormIngredients, type RxNormIngredientMatch } from '../utils/rxnorm';

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
  const [rxQuery, setRxQuery] = useState('');
  const [rxResults, setRxResults] = useState<RxNormIngredientMatch[]>([]);
  const [isSearchingRx, setIsSearchingRx] = useState(false);

  if (!isOpen) return null;

  const handleRxSearch = async () => {
    if (rxQuery.trim().length < 2) return;
    setIsSearchingRx(true);
    const matches = await searchRxNormIngredients(rxQuery);
    setRxResults(matches);
    setIsSearchingRx(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              + Add Medication to Formulary (Supabase)
            </h3>
            <p className="text-xs text-slate-500" dir="rtl">
              ابحث في RxNorm أو أضف المادة الفعالة وسيتم حسابها لوزن ({weightKg} كجم)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* RxNorm Lookup */}
        <div className="bg-sky-50/70 border border-sky-200/80 rounded-2xl p-3 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-sky-900">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-sky-600" />
              <span>RxNorm Global Lookup (NIH NLM)</span>
            </span>
            <span dir="rtl">جلب الاسم العلمي المعياري</span>
          </div>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={rxQuery}
              onChange={(e) => setRxQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleRxSearch();
                }
              }}
              placeholder="Search global drug (e.g. Ertapenem, Tigecycline)..."
              className="flex-1 px-3 py-1.5 text-xs bg-white border border-sky-200 rounded-xl outline-none focus:border-sky-500"
            />
            <button
              type="button"
              onClick={handleRxSearch}
              disabled={isSearchingRx}
              className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              {isSearchingRx ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Search className="w-3.5 h-3.5" />
              )}
              <span>بحث</span>
            </button>
          </div>

          {rxResults.length > 0 && (
            <div className="max-h-32 overflow-y-auto divide-y divide-sky-100 bg-white rounded-xl border border-sky-200/70">
              {rxResults.map((m) => (
                <button
                  key={`${m.rxcui}_${m.name}`}
                  type="button"
                  onClick={() => {
                    onChange({
                      ...newDrugForm,
                      genericName: m.name,
                      tradeName: m.name,
                      reference: `RxNorm #${m.rxcui} (NIH NLM)`,
                    });
                    setRxResults([]);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-sky-50 flex items-center justify-between gap-2 cursor-pointer"
                >
                  <span className="font-bold text-slate-800 truncate">{m.name}</span>
                  <span className="text-[10px] font-mono text-sky-700 shrink-0">
                    RxCUI: {m.rxcui}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Active Ingredient*
              </label>
              <input
                type="text"
                required
                value={newDrugForm.genericName}
                onChange={(e) =>
                  onChange({
                    ...newDrugForm,
                    genericName: e.target.value,
                    tradeName: e.target.value,
                  })
                }
                placeholder="e.g. Ertapenem"
                className="w-full p-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Arabic Name
              </label>
              <input
                type="text"
                dir="rtl"
                value={newDrugForm.arabicName}
                onChange={(e) => onChange({ ...newDrugForm, arabicName: e.target.value })}
                placeholder="إيرتابينيم"
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
                className="w-full p-2 text-xs font-black font-mono bg-sky-50 border border-sky-500 rounded-lg"
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
              className="px-4 py-2 text-xs font-bold bg-slate-100 text-slate-700 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-extrabold bg-sky-600 hover:bg-sky-700 text-white rounded-xl cursor-pointer"
            >
              Save to Supabase
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
