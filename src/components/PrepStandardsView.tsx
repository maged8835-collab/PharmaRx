import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { Download, Edit3, Globe, Loader2, Plus, Search, Upload } from 'lucide-react';
import type { DoseUnit, FormularyDrug, FrequencyKey, NewDrugFormState } from '../types/pharmacy';
import { FREQUENCY_CONFIG, VALID_DOSE_UNITS } from '../utils/calculations';
import { searchRxNormIngredients, type RxNormIngredientMatch } from '../utils/rxnorm';

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
}

export function PrepStandardsView({
  formulary,
  newDrugForm,
  onNewDrugFormChange,
  onAddNewDrug,
  onSaveDrugEdit,
  onExportJson,
  onImportFile,
}: PrepStandardsViewProps) {
  const [editingDrugId, setEditingDrugId] = useState<string | null>(null);
  const [editConcValue, setEditConcValue] = useState('');
  const [editDiluentValue, setEditDiluentValue] = useState('');
  const [editPrepValue, setEditPrepValue] = useState('');
  const [editStabilityValue, setEditStabilityValue] = useState('');

  const [rxQuery, setRxQuery] = useState('');
  const [rxResults, setRxResults] = useState<RxNormIngredientMatch[]>([]);
  const [isSearchingRx, setIsSearchingRx] = useState(false);

  const [listSearch, setListSearch] = useState('');

  const existingMatches = useMemo(() => {
    const q = rxQuery.trim().toLowerCase();
    if (q.length < 2) return [];
    return formulary
      .filter((d) => d.genericName.toLowerCase().includes(q))
      .slice(0, 4);
  }, [rxQuery, formulary]);

  const filteredFormulary = useMemo(() => {
    const q = listSearch.trim().toLowerCase();
    if (!q) return formulary;
    return formulary.filter(
      (d) =>
        d.genericName.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
    );
  }, [formulary, listSearch]);

  const handleRxSearch = async () => {
    if (rxQuery.trim().length < 2) return;
    setIsSearchingRx(true);
    const matches = await searchRxNormIngredients(rxQuery);
    setRxResults(matches);
    setIsSearchingRx(false);
  };

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
            <Plus className="w-5 h-5 text-sky-600" />
            <span>Add Active Ingredient or Bulk Import</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5" dir="rtl">
            ابحث في الأدوية الحالية أو RxNorm ثم أضف المادة الفعالة أو ارفع شيت Excel/CSV كامل
          </p>
        </div>

        {/* Search Existing + RxNorm API */}
        <div className="bg-sky-50/70 border border-sky-200/80 rounded-2xl p-3 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-sky-900">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-sky-600" />
              <span>Search Active Ingredient (Existing + RxNorm)</span>
            </span>
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
              placeholder="Search Active Ingredient (e.g. Ertapenem)..."
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
              <span>RxNorm</span>
            </button>
          </div>

          {existingMatches.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-2 space-y-1">
              <div className="text-[10px] font-extrabold text-amber-800" dir="rtl">
                موجود بالفعل في القاعدة (اضغط للتعديل):
              </div>
              {existingMatches.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => startEditing(d)}
                  className="w-full text-left text-xs font-bold text-amber-950 hover:underline flex items-center justify-between cursor-pointer"
                >
                  <span>{d.genericName}</span>
                  <span className="font-mono text-[10px]">
                    {d.finalConcMgMl} {d.doseUnit}/mL
                  </span>
                </button>
              ))}
            </div>
          )}

          {rxResults.length > 0 && (
            <div className="max-h-32 overflow-y-auto divide-y divide-sky-100 bg-white rounded-xl border border-sky-200/70">
              {rxResults.map((m) => (
                <button
                  key={`${m.rxcui}_${m.name}`}
                  type="button"
                  onClick={() => {
                    onNewDrugFormChange({
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

        <form onSubmit={onAddNewDrug} className="space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Active Ingredient*
              </label>
              <input
                type="text"
                required
                value={newDrugForm.genericName}
                onChange={(e) =>
                  onNewDrugFormChange({
                    ...newDrugForm,
                    genericName: e.target.value,
                    tradeName: e.target.value,
                  })
                }
                placeholder="e.g. Cefepime"
                className="w-full p-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg"
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
                className="w-full p-2 text-xs font-black font-mono tabular-nums bg-sky-50 border border-sky-400 rounded-lg"
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
            className="w-full py-2.5 bg-sky-700 hover:bg-sky-800 text-white font-extrabold text-xs rounded-xl shadow-2xs cursor-pointer"
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
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-white flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON ({formulary.length})</span>
            </button>

            <label className="px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-50 border border-sky-300 text-sky-900 cursor-pointer flex items-center gap-1 hover:bg-sky-100">
              <Upload className="w-3.5 h-3.5" />
              <span>Import CSV / JSON</span>
              <input
                type="file"
                accept=".json,.csv"
                onChange={onImportFile}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-[10px] text-slate-400">
            CSV Columns: TradeName, GenericName, Category, FinalConc, DosePerKg, MaxSingle,
            Frequency, Route, PrepInstructions, Unit
          </p>
        </div>
      </div>

      <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-[0_2px_16px_rgba(15,23,42,0.03)] p-5 sm:p-6">
        <div className="border-b border-slate-100 pb-3 mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Pharmacy Standard Final Concentrations ({filteredFormulary.length} Drugs)
            </h2>
            <p className="text-xs text-slate-500" dir="rtl">
              اضغط على Edit لتعديل التركيز النهائي القياسي لأي مادة فعالة
            </p>
          </div>

          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={listSearch}
              onChange={(e) => setListSearch(e.target.value)}
              placeholder="Filter standards..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-200 max-h-[650px] overflow-y-auto">
          {filteredFormulary.map((drug) => {
            const isEditing = editingDrugId === drug.id;
            return (
              <div key={drug.id} className="py-3 px-2 hover:bg-slate-50">
                {isEditing ? (
                  <div className="space-y-2 bg-sky-50/70 p-3 rounded-xl border border-sky-200">
                    <div className="font-bold text-sm text-sky-950">
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
                          className="w-full p-1.5 text-xs font-black font-mono bg-white border border-sky-500 rounded"
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
                        className="px-3 py-1 text-xs font-bold bg-white border border-slate-300 rounded-lg cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(drug.id)}
                        className="px-3 py-1 text-xs font-bold bg-sky-700 text-white rounded-lg cursor-pointer"
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
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-800 border border-slate-200 flex items-center gap-1 shrink-0 cursor-pointer"
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
