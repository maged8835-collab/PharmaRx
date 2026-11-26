import { AlertTriangle, Clock, FileSpreadsheet, Plus, Printer, Trash2 } from 'lucide-react';
import type { ComputedRegimenItem, FrequencyKey, PatientInfo } from '../types/pharmacy';
import { FREQUENCY_CONFIG } from '../utils/calculations';

interface PatientRegimenSheetProps {
  patient: PatientInfo;
  computedRegimen: ComputedRegimenItem[];
  stickersCount: number;
  onGoToAutoFill: () => void;
  onExportCsv: () => void;
  onGoToLabels: () => void;
  onUpdateItem: (regimenId: string, field: 'frequency' | 'startTime', value: string) => void;
  onRemoveItem: (regimenId: string) => void;
}

export function PatientRegimenSheet({
  patient,
  computedRegimen,
  stickersCount,
  onGoToAutoFill,
  onExportCsv,
  onGoToLabels,
  onUpdateItem,
  onRemoveItem,
}: PatientRegimenSheetProps) {
  return (
    <div className="space-y-5">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            <span>
              Patient Active Medication Sheet —{' '}
              <span className="text-teal-800">{patient.fullName || 'Unnamed Patient'}</span>
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            MRN: <strong className="font-mono">{patient.mrn || '—'}</strong> | Ward:{' '}
            <strong>{patient.ward || '—'}</strong> | Weight:{' '}
            <strong className="font-mono">{patient.weightKg} kg</strong> | Total 24h Stickers:{' '}
            <strong className="font-mono">{stickersCount}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onGoToAutoFill}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add More Drugs</span>
          </button>

          <button
            onClick={onExportCsv}
            disabled={computedRegimen.length === 0}
            className="px-4 py-2 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-2xs flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Patient Excel Sheet (.CSV)</span>
          </button>

          <button
            onClick={onGoToLabels}
            disabled={computedRegimen.length === 0}
            className="px-4 py-2 rounded-xl text-xs font-extrabold bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white shadow-2xs flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Thermal Labels ({stickersCount})</span>
          </button>
        </div>
      </div>

      {computedRegimen.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <p className="text-slate-500 font-semibold">
            No medications added to this patient&apos;s sheet yet.
          </p>
          <button
            onClick={onGoToAutoFill}
            className="px-4 py-2 bg-teal-700 text-white rounded-xl text-xs font-bold"
          >
            Go to All Drugs Auto-Fill Table
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {computedRegimen.map((item) => (
            <div
              key={item.regimenId}
              className={`bg-white rounded-2xl border shadow-2xs p-5 ${
                item.highAlert ? 'border-rose-300' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-black text-slate-900">{item.tradeName}</h3>
                    <span className="text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-0.5 rounded-full">
                      {item.genericName}
                    </span>
                    <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-mono">
                      {item.route} ({item.finalConcMgMl} {item.doseUnit}/mL)
                    </span>
                    {item.highAlert && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded-full">
                        <AlertTriangle className="w-3 h-3" />
                        HIGH-ALERT
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    <strong>Preparation:</strong> {item.prepInstructions}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-[11px] font-bold text-slate-500 uppercase">
                      Dose ({item.doseMgPerKg} {item.doseUnit}/kg)
                    </div>
                    <div className="text-lg font-extrabold text-slate-900 font-mono tabular-nums">
                      {item.finalDoseMg} {item.doseUnit}
                    </div>
                    {item.isCapped && (
                      <span className="inline-block text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                        Max Capped
                      </span>
                    )}
                  </div>

                  <div className="bg-teal-50 border-2 border-teal-600 px-3.5 py-1.5 rounded-xl text-center">
                    <div className="text-[10px] font-extrabold text-teal-800 uppercase">
                      Final Vol
                    </div>
                    <div className="text-xl font-black text-teal-900 font-mono tabular-nums">
                      {item.finalVolumeMl} ml
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.regimenId)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl"
                    title="Remove from patient sheet"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="pt-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-4 grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Frequency
                    </label>
                    <select
                      value={item.frequency}
                      onChange={(e) =>
                        onUpdateItem(item.regimenId, 'frequency', e.target.value as FrequencyKey)
                      }
                      className="w-full p-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg"
                    >
                      {Object.entries(FREQUENCY_CONFIG).map(([key, cfg]) => (
                        <option key={key} value={key}>
                          {cfg.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={item.startTime}
                      onChange={(e) => onUpdateItem(item.regimenId, 'startTime', e.target.value)}
                      className="w-full p-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="md:col-span-8">
                  <div className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    <span>
                      Auto-Generated 24h Administration Schedule ({item.scheduleSlots.length}{' '}
                      Stickers):
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.scheduleSlots.map((slot) => (
                      <div
                        key={slot.index}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold font-mono flex items-center gap-2 tabular-nums"
                      >
                        <span className="text-teal-300">#{slot.index}</span>
                        <span>{slot.timeStr}</span>
                        <span className="text-slate-400">|</span>
                        <span className="text-amber-300">{slot.dateStr}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
