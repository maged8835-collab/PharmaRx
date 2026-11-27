import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  Filter,
  Plus,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
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
  isReadOnly?: boolean;
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
  isReadOnly = false,
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
      {/* Search & Filter Card */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-[0_2px_16px_rgba(15,23,42,0.03)] space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحث بالمادة الفعالة (Vancomycin, Meropenem, Furosemide, Ketorolac) أو بالعربي..."
              className="w-full pl-10 pr-9 py-2.5 text-sm bg-slate-50/80 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onToggleSelectedOnly}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                showSelectedOnly
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Selected ({regimenCount})</span>
            </button>

            <button
              onClick={onOpenQuickAdd}
              className="px-4 py-2.5 rounded-2xl text-xs font-extrabold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-teal-400" />
              <span>Add Custom Drug</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => {
            const count =
              cat === 'All'
                ? formulary.length
                : formulary.filter((d) => d.category === cat).length;
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  active
                    ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/20'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    active ? 'bg-white/20 text-white' : 'bg-white text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subtle Summary Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-2 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
          <span>
            Showing <strong className="text-slate-800">{autoFilledDrugs.length}</strong>{' '}
            medications auto-calculated for{' '}
            <strong className="text-teal-700 font-mono">{weightKg} kg</strong>
          </span>
        </div>
        <button
          onClick={onOpenRegimenTab}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200/80 px-3.5 py-1.5 rounded-full transition-colors cursor-pointer"
        >
          <span>Open Patient Sheet ({regimenCount})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Modern Data Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_2px_20px_rgba(15,23,42,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-5 font-extrabold">Active Ingredient</th>
                <th className="py-3.5 px-3 font-extrabold">Indication &amp; Dose/kg</th>
                <th className="py-3.5 px-3 font-extrabold text-right">Calc. Dose</th>
                <th className="py-3.5 px-3 font-extrabold">Prep &amp; Final Conc</th>
                <th className="py-3.5 px-3 font-extrabold text-center">Final Volume</th>
                <th className="py-3.5 px-3 font-extrabold">Freq &amp; Route</th>
                <th className="py-3.5 px-5 font-extrabold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {autoFilledDrugs.map((drug) => {
                const isJustAdded = addedFeedbackId === drug.id;
                const alreadyInSheet = regimenDrugIds.has(drug.id);

                return (
                  <tr
                    key={drug.id}
                    className={`hover:bg-teal-50/35 transition-colors align-top ${
                      drug.highAlert ? 'bg-rose-50/20' : ''
                    }`}
                  >
                    <td className="py-4 px-5 min-w-[205px]">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-extrabold text-slate-900 text-[15px]">
                          {drug.genericName}
                        </span>
                        {drug.highAlert && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold bg-rose-100 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3" />
                            HIGH-ALERT
                          </span>
                        )}
                      </div>
                      <div dir="rtl" className="text-xs text-slate-500 mt-0.5 font-medium">
                        {drug.arabicName}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                          {drug.category}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <BookOpen className="w-3 h-3" />
                          {drug.reference}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-3 min-w-[225px]">
                      <select
                        value={drug.activePreset.id}
                        onChange={(e) => onSelectPreset(drug, e.target.value)}
                        className="w-full p-2 text-xs font-bold bg-slate-50/80 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                      >
                        {drug.presets.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.label}
                          </option>
                        ))}
                      </select>

                      <div className="flex items-center justify-between gap-2 mt-2 text-[11px]">
                        <label className="flex items-center gap-1 text-slate-600 font-semibold">
                          <span>{drug.doseUnit}/kg:</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={drug.effectiveDosePerKg}
                            onChange={(e) => onInlineDoseChange(drug.id, e.target.value)}
                            className="w-16 px-2 py-0.5 text-xs font-mono font-bold bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-teal-500 outline-none"
                          />
                        </label>
                        <span className="text-slate-400 font-mono">
                          Max: <strong className="text-slate-600">{drug.activePreset.maxSingleMg} {drug.doseUnit}</strong>
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-3 text-right whitespace-nowrap">
                      <div className="font-extrabold text-slate-900 text-base font-mono tabular-nums">
                        {drug.finalDoseMg}{' '}
                        <span className="text-xs font-bold text-slate-500">{drug.doseUnit}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono tabular-nums">
                        {drug.effectiveDosePerKg} {drug.doseUnit}/kg
                      </div>
                      {drug.isCapped && (
                        <span className="inline-block mt-1 text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                          Max Capped
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-3 min-w-[240px]">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-bold text-indigo-800 bg-indigo-50/80 border border-indigo-200/80 px-2 py-0.5 rounded-lg flex items-center gap-1">
                          <span>Conc:</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0.001"
                            value={drug.effectiveFinalConc}
                            onChange={(e) => onInlineConcChange(drug.id, e.target.value)}
                            className="w-14 px-1 py-0 text-xs font-mono font-black bg-white border border-indigo-200 rounded text-indigo-950 outline-none"
                          />
                          <span>{drug.doseUnit}/mL</span>
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {drug.diluent}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1.5 leading-snug">
                        {drug.prepInstructions}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Stability: {drug.stability}
                      </div>
                    </td>

                    <td className="py-4 px-3 text-center whitespace-nowrap">
                      <div className="inline-flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200/80 rounded-2xl px-3.5 py-2 min-w-[82px]">
                        <div className="text-xl font-black text-teal-800 font-mono tabular-nums leading-none">
                          {drug.finalVolumeMl}
                        </div>
                        <div className="text-[10px] font-extrabold text-teal-600 mt-0.5">
                          mL
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-1">
                        {drug.finalDoseMg} ÷ {drug.effectiveFinalConc}
                      </div>
                    </td>

                    <td className="py-4 px-3 min-w-[120px]">
                      <select
                        value={drug.activeFrequency}
                        onChange={(e) =>
                          onFreqChange(drug.id, e.target.value as FrequencyKey)
                        }
                        className="w-full p-2 text-xs font-bold bg-slate-50/80 border border-slate-200 rounded-xl mb-1.5 outline-none"
                      >
                        {Object.keys(FREQUENCY_CONFIG).map((fk) => (
                          <option key={fk} value={fk}>
                            {fk}
                          </option>
                        ))}
                      </select>
                      <span className="inline-block text-[11px] font-semibold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">
                        {drug.route}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-center whitespace-nowrap">
                      <button
                        onClick={() => onAddDrug(drug)}
                        disabled={isReadOnly}
                        className={`px-3.5 py-2 rounded-xl text-xs font-extrabold shadow-xs transition-all flex items-center justify-center gap-1 mx-auto ${
                          isReadOnly
                            ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                            : isJustAdded
                              ? 'bg-emerald-600 text-white scale-105 cursor-pointer'
                              : 'bg-teal-600 hover:bg-teal-700 text-white hover:-translate-y-0.5 cursor-pointer'
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
                            <span>{isReadOnly ? 'Locked' : 'Add'}</span>
                          </>
                        )}
                      </button>
                      {alreadyInSheet && !isJustAdded && (
                        <span className="block text-[10px] text-emerald-600 font-bold mt-1.5">
                          ✓ In Sheet
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
