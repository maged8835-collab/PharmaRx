import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Download, Edit3, Plus, RefreshCw, Upload } from 'lucide-react';
import type { DoseUnit, FormularyDrug, FrequencyKey, NewDrugFormState } from '../types/pharmacy';
import { FREQUENCY_CONFIG, VALID_DOSE_UNITS } from '../utils/calculations';

interface PrepStandardsViewProps {
  formulary: FormularyDrug[];
  newDrugForm: NewDrugFormState;
  onNewDrugFormChange: (form: NewDrugFormState) => void;
  onAddNewDrug: (e: FormEvent) => void;
  onSaveDrugEdit: (
    drugId: string,
    updates: {
      finalConcMgMl: number;
      diluent: string;
      prepInstructions: string;
      stability: string;
    }
  ) => void;
  onExportJson: () => void;
  onImportFile: (e: ChangeEvent<HTMLInputElement>) => void;
  onResetDefault: () => void;
}

export function PrepStandardsView({
  formulary,
  newDrugForm,
  onNewDrugFormChange,
  onAddNewDrug,
  onSaveDrugEdit,
  onExportJson,
  onImportFile,
  onResetDefault,
}: PrepStandardsViewProps) {
  const [editingDrugId, setEditingDrugId] = useState<string | null>(null);
  const [editConcValue, setEditConcValue] = useState('');
  const [editDiluentValue, setEditDiluentValue] = useState('');
  const [editPrepValue, setEditPrepValue] = useState('');
  const [editStabilityValue, setEditStabilityValue] = useState('');

  const startEditing = (drug: FormularyDrug) => {
    setEditingDrugId(drug.id);
    setEditConcValue(String(drug.finalConcMgMl));
    setEditDiluentValue(drug.diluent);
    setEditPrepValue(drug.prepInstructions);
    setEditStabilityValue(drug.stability);
  };

  const handleSaveEdit = (drugId: string) => {
    const parsedConc = Math.max(0.001, Number(editConcValue) || 1);
    onSaveDrugEdit(drugId, {
      finalConcMgMl: parsedConc,
      diluent: editDiluentValue,
      prepInstructions: editPrepValue,
      stability: editStabilityValue,
    });
    setEditingDrugId(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 shadow-[0_2px_16px_rgba(15,23,42,0.03)] p-5 sm:p-6 space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Plus className="w-5 h-5 text-teal-600" />
            <span>Add Drug or Bulk Import Formulary</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5" dir="rtl">
            أضف أي دواء جديد أو ارفع شيت Excel/CSV كامل بأدوية مستشفاك دفعة واحدة
          </p>
        </div>

        <form onSubmit={onAddNewDrug} className="space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Trade Name*
              </label>
              <input
                type="text"
                required
                value={newDrugForm.tradeName}
                onChange={(e) =>
                  onNewDrugFormChange({ ...newDrugForm, tradeName: e.target.value })
                }
                placeholder="e.g. Maxipime"
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
                onChange={(e) =>
                  onNewDrugFormChange({ ...newDrugForm, genericName: e.target.value })
                }
                placeholder="e.g. Cefepime"
                className="w-full p-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Arabic Name / Alias
              </label>
              <input
                type="text"
                dir="rtl"
                value={newDrugForm.arabicName}
                onChange={(e) =>
                  onNewDrugFormChange({ ...newDrugForm, arabicName: e.target.value })
                }
                placeholder="ماكسيبيم"
                className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Specialty Category
              </label>
              <select
                value={newDrugForm.category}
                onChange={(e) =>
                  onNewDrugFormChange({ ...newDrugForm, category: e.target.value })
                }
                className="w-full p-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="Antimicrobials">Antimicrobials</option>
                <option value="Analgesia & ICU">Analgesia &amp; ICU</option>
                <option value="Cardiology & Cath">Cardiology &amp; Cath</option>
                <option value="GI & Antiemetics">GI &amp; Antiemetics</option>
                <option value="Steroids & Blood">Steroids &amp; Blood</option>
                <option value="Neurology">Neurology</option>
                <option value="Electrolytes & Endocrine">Electrolytes &amp; Endocrine</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Unit*
              </label>
              <select
                value={newDrugForm.doseUnit}
                onChange={(e) =>
                  onNewDrugFormChange({ ...newDrugForm, doseUnit: e.target.value as DoseUnit })
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
                Final Conc ({newDrugForm.doseUnit}/mL)*
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={newDrugForm.finalConcMgMl}
                onChange={(e) =>
                  onNewDrugFormChange({ ...newDrugForm, finalConcMgMl: e.target.value })
                }
                className="w-full p-2 text-xs font-black font-mono tabular-nums bg-teal-50 border border-teal-400 rounded-lg"
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
                onChange={(e) =>
                  onNewDrugFormChange({ ...newDrugForm, doseMgPerKg: e.target.value })
                }
                className="w-full p-2 text-xs font-bold font-mono tabular-nums bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Max Single ({newDrugForm.doseUnit})
              </label>
              <input
                type="number"
                value={newDrugForm.maxSingleMg}
                onChange={(e) =>
                  onNewDrugFormChange({ ...newDrugForm, maxSingleMg: e.target.value })
                }
                className="w-full p-2 text-xs font-mono tabular-nums bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Frequency
              </label>
              <select
                value={newDrugForm.frequency}
                onChange={(e) =>
                  onNewDrugFormChange({
                    ...newDrugForm,
                    frequency: e.target.value as FrequencyKey,
                  })
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
                onChange={(e) =>
                  onNewDrugFormChange({ ...newDrugForm, route: e.target.value })
                }
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
              Preparation &amp; Dilution Protocol
            </label>
            <input
              type="text"
              value={newDrugForm.prepInstructions}
              onChange={(e) =>
                onNewDrugFormChange({ ...newDrugForm, prepInstructions: e.target.value })
              }
              className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-rose-800 cursor-pointer">
            <input
              type="checkbox"
              checked={newDrugForm.highAlert}
              onChange={(e) =>
                onNewDrugFormChange({ ...newDrugForm, highAlert: e.target.checked })
              }
              className="rounded border-rose-400"
            />
            <span>Mark as HIGH-ALERT Medication</span>
          </label>

          <button
            type="submit"
            className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs rounded-xl shadow-2xs"
          >
            + Save to Master Formulary
          </button>
        </form>

        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="text-[11px] font-bold text-slate-600">
            Bulk Import / Backup (JSON or CSV):
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onExportJson}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-white flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON ({formulary.length})</span>
            </button>

            <label className="px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-50 border border-teal-300 text-teal-900 cursor-pointer flex items-center gap-1 hover:bg-teal-100">
              <Upload className="w-3.5 h-3.5" />
              <span>Import CSV / JSON</span>
              <input
                type="file"
                accept=".json,.csv"
                onChange={onImportFile}
                className="hidden"
              />
            </label>

            <button
              onClick={onResetDefault}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-400">
            CSV Columns: TradeName, GenericName, Category, FinalConc, DosePerKg, MaxSingle,
            Frequency, Route, PrepInstructions, Unit
          </p>
        </div>
      </div>

      <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-[0_2px_16px_rgba(15,23,42,0.03)] p-5 sm:p-6">
        <div className="border-b border-slate-100 pb-3 mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Pharmacy Standard Final Concentrations ({formulary.length} Drugs)
            </h2>
            <p className="text-xs text-slate-500" dir="rtl">
              اضغط على Edit لتعديل التركيز النهائي القياسي لأي دواء حسب ثبات 24 ساعة في صيدليتك
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-200 max-h-[650px] overflow-y-auto">
          {formulary.map((drug) => {
            const isEditing = editingDrugId === drug.id;
            return (
              <div key={drug.id} className="py-3 px-2 hover:bg-slate-50">
                {isEditing ? (
                  <div className="space-y-2 bg-teal-50/70 p-3 rounded-xl border border-teal-200">
                    <div className="font-bold text-sm text-teal-950">
                      Editing: {drug.genericName}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600">
                          Final Conc ({drug.doseUnit}/mL)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={editConcValue}
                          onChange={(e) => setEditConcValue(e.target.value)}
                          className="w-full p-1.5 text-xs font-black font-mono bg-white border border-teal-500 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600">
                          Diluent
                        </label>
                        <input
                          type="text"
                          value={editDiluentValue}
                          onChange={(e) => setEditDiluentValue(e.target.value)}
                          className="w-full p-1.5 text-xs bg-white border border-slate-300 rounded"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600">
                        Preparation Instructions
                      </label>
                      <input
                        type="text"
                        value={editPrepValue}
                        onChange={(e) => setEditPrepValue(e.target.value)}
                        className="w-full p-1.5 text-xs bg-white border border-slate-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600">
                        24h Stability Note
                      </label>
                      <input
                        type="text"
                        value={editStabilityValue}
                        onChange={(e) => setEditStabilityValue(e.target.value)}
                        className="w-full p-1.5 text-xs bg-white border border-slate-300 rounded"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => setEditingDrugId(null)}
                        className="px-3 py-1 text-xs font-bold bg-white border border-slate-300 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(drug.id)}
                        className="px-3 py-1 text-xs font-bold bg-teal-700 text-white rounded-lg"
                      >
                        Save Standard
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm text-slate-900">
                          {drug.genericName}
                        </span>
                        <span className="text-xs font-extrabold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-mono tabular-nums">
                          {drug.finalConcMgMl} {drug.doseUnit}/mL
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        {drug.prepInstructions}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {drug.stability} • {drug.reference}
                      </div>
                    </div>

                    <button
                      onClick={() => startEditing(drug)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 flex items-center gap-1 shrink-0"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
