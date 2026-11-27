import { useMemo, useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  Beaker,
  Clock,
  FileSpreadsheet,
  Plus,
  Printer,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import type { ComputedRegimenItem, FrequencyKey, PatientInfo } from '../types/pharmacy';
import { FREQUENCY_CONFIG } from '../utils/calculations';
import {
  calculateDrawUpVolume,
  checkRegimenCompatibility,
  getPatientClinicalAlerts,
} from '../utils/clinicalSafety';

interface PatientRegimenSheetProps {
  patient: PatientInfo;
  computedRegimen: ComputedRegimenItem[];
  stickersCount: number;
  isReadOnly?: boolean;
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
  isReadOnly = false,
  onGoToAutoFill,
  onExportCsv,
  onGoToLabels,
  onUpdateItem,
  onRemoveItem,
}: PatientRegimenSheetProps) {
  const [openDrawHelperId, setOpenDrawHelperId] = useState<string | null>(null);
  const [stockConcByRegimen, setStockConcByRegimen] = useState<Record<string, string>>({});

  const compatibilityAlerts = useMemo(
    () => checkRegimenCompatibility(computedRegimen),
    [computedRegimen]
  );

  const clinicalGuardrails = useMemo(
    () => getPatientClinicalAlerts(patient, computedRegimen),
    [patient, computedRegimen]
  );

  return (
    <div className="space-y-5">
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_16px_rgba(15,23,42,0.03)] flex flex-wrap items-center justify-between gap-4">
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
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add More Drugs</span>
          </button>

          <button
            onClick={onExportCsv}
            disabled={computedRegimen.length === 0}
            className="px-4 py-2 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Patient Excel Sheet (.CSV)</span>
          </button>

          <button
            onClick={onGoToLabels}
            disabled={computedRegimen.length === 0}
            className="px-4 py-2 rounded-xl text-xs font-extrabold bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Thermal Labels ({stickersCount})</span>
          </button>
        </div>
      </div>

      {/* IV Y-Site Compatibility & Clinical Guardrails */}
      {(compatibilityAlerts.length > 0 || clinicalGuardrails.length > 0) && (
        <div className="space-y-2.5 animate-fade-in-up">
          {compatibilityAlerts.map((alert) => (
            <div
              key={alert.id}
              dir="rtl"
              className={`rounded-2xl border p-4 flex items-start gap-3 shadow-2xs ${
                alert.severity === 'critical'
                  ? 'bg-rose-50 border-rose-300 text-rose-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}
            >
              <AlertOctagon
                className={`w-5 h-5 shrink-0 mt-0.5 ${
                  alert.severity === 'critical' ? 'text-rose-600' : 'text-amber-600'
                }`}
              />
              <div className="text-xs space-y-1">
                <div className="font-extrabold flex items-center gap-2 flex-wrap">
                  <span>
                    {alert.severity === 'critical'
                      ? 'تحذير حرج — عدم توافق وريدي:'
                      : 'تنبيه توافق وريدي (Y-Site):'}
                  </span>
                  <span className="bg-white/80 px-2 py-0.5 rounded border border-current/20 font-mono">
                    {alert.drugA} + {alert.drugB}
                  </span>
                </div>
                <p className="font-semibold leading-relaxed">{alert.message}</p>
              </div>
            </div>
          ))}

          {clinicalGuardrails.map((guard) => (
            <div
              key={guard.id}
              dir="rtl"
              className={`rounded-2xl border p-4 flex items-start gap-3 shadow-2xs ${
                guard.severity === 'critical'
                  ? 'bg-rose-50 border-rose-300 text-rose-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}
            >
              <ShieldAlert
                className={`w-5 h-5 shrink-0 mt-0.5 ${
                  guard.severity === 'critical' ? 'text-rose-600' : 'text-amber-600'
                }`}
              />
              <div className="text-xs space-y-1">
                <div className="font-extrabold">
                  {guard.title} — {guard.drugName}
                </div>
                <p className="font-semibold leading-relaxed">{guard.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {computedRegimen.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <p className="text-slate-500 font-semibold">
            No medications added to this patient&apos;s sheet yet.
          </p>
          <button
            onClick={onGoToAutoFill}
            className="px-4 py-2 bg-teal-700 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Go to All Drugs Auto-Fill Table
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {computedRegimen.map((item) => {
            const isDrawHelperOpen = openDrawHelperId === item.regimenId;
            const stockConc = Number(stockConcByRegimen[item.regimenId] ?? item.finalConcMgMl);
            const drawCalc = calculateDrawUpVolume(
              item.finalDoseMg,
              stockConc,
              item.finalVolumeMl
            );

            return (
              <div
                key={item.regimenId}
                className={`bg-white rounded-3xl border shadow-[0_2px_16px_rgba(15,23,42,0.03)] p-5 sm:p-6 transition-all hover:shadow-[0_4px_20px_rgba(15,23,42,0.06)] ${
                  item.highAlert ? 'border-rose-300/80' : 'border-slate-200/80'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-black text-slate-900">{item.genericName}</h3>
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

                  <div className="flex items-center gap-3">
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
                      type="button"
                      onClick={() =>
                        setOpenDrawHelperId(isDrawHelperOpen ? null : item.regimenId)
                      }
                      className={`px-2.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1 cursor-pointer transition-colors ${
                        isDrawHelperOpen
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100'
                      }`}
                      title="Stock Vial Draw-Up & Dilution Helper"
                    >
                      <Beaker className="w-3.5 h-3.5" />
                      <span>السحب</span>
                    </button>

                    {!isReadOnly && (
                      <button
                        onClick={() => onRemoveItem(item.regimenId)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer"
                        title="Remove from patient sheet"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {isDrawHelperOpen && (
                  <div className="mt-3 p-3.5 rounded-xl bg-indigo-50/80 border border-indigo-200 flex flex-wrap items-center justify-between gap-3 animate-fade-in-up">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-indigo-950" dir="rtl">
                        تركيز الفيال/الأمبول المتاح ({item.doseUnit}/mL):
                      </span>
                      <input
                        type="number"
                        step="0.1"
                        min="0.01"
                        value={stockConcByRegimen[item.regimenId] ?? item.finalConcMgMl}
                        onChange={(e) =>
                          setStockConcByRegimen((prev) => ({
                            ...prev,
                            [item.regimenId]: e.target.value,
                          }))
                        }
                        className="w-20 px-2 py-1 text-xs font-mono font-black bg-white border border-indigo-400 rounded-lg text-indigo-950"
                      />
                    </div>
                    <div className="text-xs font-bold text-indigo-950 flex flex-wrap items-center gap-2" dir="rtl">
                      <span>
                        اسحب من الدواء:{' '}
                        <strong className="font-mono text-sm text-teal-800">
                          {drawCalc.drawDrugMl} mL
                        </strong>
                      </span>
                      <span>+</span>
                      <span>
                        أضف مذيب ({item.diluent}):{' '}
                        <strong className="font-mono text-sm text-indigo-800">
                          {drawCalc.diluentToAddMl} mL
                        </strong>
                      </span>
                      <span>=</span>
                      <span>
                        الإجمالي:{' '}
                        <strong className="font-mono text-sm">{item.finalVolumeMl} mL</strong>
                      </span>
                      {drawCalc.isStockInsufficient && (
                        <span className="text-[11px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                          تركيز الفيال أقل من التركيز النهائي!
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-4 grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Frequency
                      </label>
                      <select
                        disabled={isReadOnly}
                        value={item.frequency}
                        onChange={(e) =>
                          onUpdateItem(item.regimenId, 'frequency', e.target.value as FrequencyKey)
                        }
                        className="w-full p-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg disabled:opacity-60"
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
                        disabled={isReadOnly}
                        value={item.startTime}
                        onChange={(e) => onUpdateItem(item.regimenId, 'startTime', e.target.value)}
                        className="w-full p-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg disabled:opacity-60"
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
            );
          })}
        </div>
      )}
    </div>
  );
}
