import { AlertTriangle, BookOpen, Check, Filter, Plus, Search, Sparkles, X } from 'lucide-react';
import type { AutoFilledDrug, FormularyDrug, FrequencyKey } from '../types/pharmacy';
import { FREQUENCY_CONFIG } from '../utils/calculations';

interface AutoFillTableProps {
  formulary: FormularyDrug[];
  autoFilledDrugs: AutoFilledDrug[];
  categories: string[];
  selectedCategory: string;
  searchQuery: string;
  showSelectedOnly: boolean;
  regimenCount: number;
  regimenDrugIds: Set<string>;
  weightKg: number | string;
  addedFeedbackId: string | null;
  onSearchChange: (q: string) => void;
  onCategoryChange: (cat: string) => void;
  onToggleSelectedOnly: () => void;
  onOpenQuickAdd: () => void;
  onOpenRegimenTab: () => void;
  onSelectPreset: (drug: AutoFilledDrug, presetId: string) => void;
  onInlineDoseChange: (drugId: string, val: string) => void;
  onInlineConcChange: (drugId: string, val: string) => void;
  onFreqChange: (drugId: string, freq: FrequencyKey) => void;
  onAddDrug: (drug: AutoFilledDrug) => void;
}

export function AutoFillTable({
  formulary,
  autoFilledDrugs,
  categories,
  selectedCategory,
  searchQuery,
  showSelectedOnly,
  regimenCount,
  regimenDrugIds,
  weightKg,
  addedFeedbackId,
  onSearchChange,
  onCategoryChange,
  onToggleSelectedOnly,
  onOpenQuickAdd,
  onOpenRegimenTab,
  onSelectPreset,
  onInlineDoseChange,
  onInlineConcChange,
  onFreqChange,
  onAddDrug,
}: AutoFillTableProps) {
  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحث بالمادة الفعالة (Vancomycin, Meropenem, Furosemide, Ketorolac) أو بالعربي..."
              className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onToggleSelectedOnly}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                showSelectedOnly
                  ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Selected Regimen Only ({regimenCount})</span>
            </button>

            <button
              onClick={onOpenQuickAdd}
              className="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-4 h-4 text-teal-400" />
              <span>+ Add Custom Drug</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => {
            const count =
              cat === 'All'
                ? formulary.length
                : formulary.filter((d) => d.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? 'bg-teal-700 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    selectedCategory === cat
                      ? 'bg-black/25 text-teal-100'
                      : 'bg-white text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-teal-950 text-white px-4 py-2.5 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-300 shrink-0" />
          <span>
            Auto-filled <strong>{autoFilledDrugs.length} medications</strong> for{' '}
            <strong className="text-teal-300 text-sm font-mono">{weightKg} kg</strong> — You
            can tweak <strong>Dose/kg</strong> or <strong>Final Conc</strong> directly inline in
            any row!
          </span>
        </div>
        <button
          onClick={onOpenRegimenTab}
          className="bg-teal-400 hover:bg-teal-300 text-slate-950 font-extrabold px-3.5 py-1.5 rounded-lg transition-colors"
        >
          Open Patient Sheet ({regimenCount}) →
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-100 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 font-bold">Active Ingredient</th>
                <th className="py-3 px-3 font-bold">Indication &amp; Inline Dose/kg</th>
                <th className="py-3 px-3 font-bold text-right">Calc. Dose</th>
                <th className="py-3 px-3 font-bold">Standard Prep &amp; Final Conc</th>
                <th className="py-3 px-3 font-bold text-center bg-teal-950 text-teal-200">
                  Final Volume (mL)
                </th>
                <th className="py-3 px-3 font-bold">Freq &amp; Route</th>
                <th className="py-3 px-4 font-bold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {autoFilledDrugs.map((drug) => {
                const isJustAdded = addedFeedbackId === drug.id;
                const alreadyInSheet = regimenDrugIds.has(drug.id);

                return (
                  <tr
                    key={drug.id}
                    className={`hover:bg-teal-50/40 transition-colors align-top ${
                      drug.highAlert ? 'bg-rose-50/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4 min-w-[205px]">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-extrabold text-slate-900 text-base">
                          {drug.genericName}
                        </span>
                        {drug.highAlert && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300 px-1.5 py-0.5 rounded">
                            <AlertTriangle className="w-3 h-3" />
                            HIGH-ALERT
                          </span>
                        )}
                      </div>
                      <div dir="rtl" className="text-xs text-slate-600 mt-0.5 font-medium">
                        {drug.arabicName}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                        <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold">
                          {drug.category}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <BookOpen className="w-3 h-3" />
                          {drug.reference}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3 min-w-[225px]">
                      <select
                        value={drug.activePreset.id}
                        onChange={(e) => onSelectPreset(drug, e.target.value)}
                        className="w-full p-1.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                      >
                        {drug.presets.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.label}
                          </option>
                        ))}
                      </select>

                      <div className="flex items-center justify-between gap-2 mt-1.5 text-[11px]">
                        <label className="flex items-center gap-1 text-slate-600 font-semibold">
                          <span>{drug.doseUnit}/kg:</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={drug.effectiveDosePerKg}
                            onChange={(e) => onInlineDoseChange(drug.id, e.target.value)}
                            className="w-16 px-1.5 py-0.5 text-xs font-mono font-bold bg-white border border-slate-300 rounded text-slate-900 focus:border-teal-600 outline-none"
                          />
                        </label>
                        <span className="text-slate-500 font-mono">
                          Max: <strong>{drug.activePreset.maxSingleMg} {drug.doseUnit}</strong>
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="font-extrabold text-slate-900 text-base font-mono tabular-nums">
                        {drug.finalDoseMg}{' '}
                        <span className="text-xs font-bold text-slate-600">{drug.doseUnit}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                        ({drug.effectiveDosePerKg} {drug.doseUnit}/kg)
                      </div>
                      {drug.isCapped && (
                        <span className="inline-block mt-1 text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.5 rounded">
                          Max Capped
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 min-w-[240px]">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <span>Conc:</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0.001"
                            value={drug.effectiveFinalConc}
                            onChange={(e) => onInlineConcChange(drug.id, e.target.value)}
                            className="w-14 px-1 py-0 text-xs font-mono font-black bg-white border border-indigo-300 rounded text-indigo-950 outline-none"
                          />
                          <span>{drug.doseUnit}/mL</span>
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500">
                          ({drug.diluent})
                        </span>
                      </div>
                      <div className="text-xs text-slate-700 mt-1 leading-snug">
                        {drug.prepInstructions}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Stability: {drug.stability}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center bg-teal-50/75 border-x border-teal-100 whitespace-nowrap">
                      <div className="text-2xl font-black text-teal-800 font-mono tabular-nums">
                        {drug.finalVolumeMl}
                      </div>
                      <div className="text-xs font-extrabold text-teal-700">mL</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {drug.finalDoseMg} ÷ {drug.effectiveFinalConc}
                      </div>
                    </td>

                    <td className="py-3 px-3 min-w-[120px]">
                      <select
                        value={drug.activeFrequency}
                        onChange={(e) =>
                          onFreqChange(drug.id, e.target.value as FrequencyKey)
                        }
                        className="w-full p-1.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg mb-1"
                      >
                        {Object.keys(FREQUENCY_CONFIG).map((fk) => (
                          <option key={fk} value={fk}>
                            {fk}
                          </option>
                        ))}
                      </select>
                      <span className="inline-block text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {drug.route}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => onAddDrug(drug)}
                        className={`px-3 py-2 rounded-xl text-xs font-extrabold shadow-2xs transition-all flex items-center justify-center gap-1 mx-auto ${
                          isJustAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-teal-700 hover:bg-teal-800 text-white'
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add to Sheet</span>
                          </>
                        )}
                      </button>
                      {alreadyInSheet && !isJustAdded && (
                        <span className="block text-[10px] text-emerald-700 font-bold mt-1">
                          ✓ In Patient Sheet
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
