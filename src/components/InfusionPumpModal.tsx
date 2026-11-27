import { useMemo, useState } from 'react';
import { Activity, Clock, Droplets, Gauge, X } from 'lucide-react';
import { calculateSyringePumpRate, type PumpRateUnit } from '../utils/clinicalSafety';

interface InfusionPumpModalProps {
  isOpen: boolean;
  weightKg: number | string;
  onClose: () => void;
}

interface PumpPreset {
  id: string;
  name: string;
  amount: number;
  amountUnit: 'mg' | 'mcg' | 'Units';
  totalMl: number;
  defaultRate: number;
  rateUnit: PumpRateUnit;
  diluent: string;
}

const ICU_PUMP_PRESETS: PumpPreset[] = [
  {
    id: 'norepi',
    name: 'Norepinephrine',
    amount: 4,
    amountUnit: 'mg',
    totalMl: 50,
    defaultRate: 0.1,
    rateUnit: 'mcg/kg/min',
    diluent: 'D5W / D5NS',
  },
  {
    id: 'epi',
    name: 'Epinephrine',
    amount: 1,
    amountUnit: 'mg',
    totalMl: 50,
    defaultRate: 0.05,
    rateUnit: 'mcg/kg/min',
    diluent: 'D5W / NS',
  },
  {
    id: 'dopamine',
    name: 'Dopamine',
    amount: 200,
    amountUnit: 'mg',
    totalMl: 50,
    defaultRate: 10,
    rateUnit: 'mcg/kg/min',
    diluent: 'NS / D5W',
  },
  {
    id: 'dobutamine',
    name: 'Dobutamine',
    amount: 250,
    amountUnit: 'mg',
    totalMl: 50,
    defaultRate: 10,
    rateUnit: 'mcg/kg/min',
    diluent: 'NS / D5W',
  },
  {
    id: 'milrinone',
    name: 'Milrinone',
    amount: 10,
    amountUnit: 'mg',
    totalMl: 50,
    defaultRate: 0.5,
    rateUnit: 'mcg/kg/min',
    diluent: 'NS / D5W',
  },
  {
    id: 'fentanyl',
    name: 'Fentanyl',
    amount: 500,
    amountUnit: 'mcg',
    totalMl: 50,
    defaultRate: 1,
    rateUnit: 'mcg/kg/hr',
    diluent: 'NS / D5W',
  },
  {
    id: 'midazolam',
    name: 'Midazolam',
    amount: 50,
    amountUnit: 'mg',
    totalMl: 50,
    defaultRate: 60,
    rateUnit: 'mcg/kg/hr',
    diluent: 'NS / D5W',
  },
  {
    id: 'insulin',
    name: 'Regular Insulin',
    amount: 50,
    amountUnit: 'Units',
    totalMl: 50,
    defaultRate: 0.1,
    rateUnit: 'Units/kg/hr',
    diluent: '0.9% NS',
  },
];

export function InfusionPumpModal({
  isOpen,
  weightKg,
  onClose,
}: InfusionPumpModalProps) {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('norepi');
  const [drugAmount, setDrugAmount] = useState<number>(4);
  const [amountUnit, setAmountUnit] = useState<'mg' | 'mcg' | 'Units'>('mg');
  const [syringeTotalMl, setSyringeTotalMl] = useState<number>(50);
  const [desiredRate, setDesiredRate] = useState<number>(0.1);
  const [rateUnit, setRateUnit] = useState<PumpRateUnit>('mcg/kg/min');

  const activePreset = ICU_PUMP_PRESETS.find((p) => p.id === selectedPresetId);

  const applyPreset = (preset: PumpPreset) => {
    setSelectedPresetId(preset.id);
    setDrugAmount(preset.amount);
    setAmountUnit(preset.amountUnit);
    setSyringeTotalMl(preset.totalMl);
    setDesiredRate(preset.defaultRate);
    setRateUnit(preset.rateUnit);
  };

  const result = useMemo(
    () =>
      calculateSyringePumpRate({
        weightKg,
        drugAmountInSyringe: drugAmount,
        drugAmountUnit: amountUnit,
        syringeTotalMl,
        desiredDoseRate: desiredRate,
        rateUnit,
      }),
    [weightKg, drugAmount, amountUnit, syringeTotalMl, desiredRate, rateUnit]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-scale-in">
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-sky-500/20 border border-sky-400/30 p-2 rounded-xl">
              <Gauge className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <h3 className="text-base font-extrabold">
                Syringe Pump Calculator (mL/hr)
              </h3>
              <p className="text-[11px] text-slate-300" dir="rtl">
                حاسبة معدل المضخة الوريدية المستمرة لوزن المريض الحالي ({weightKg} كجم)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Quick ICU Presets */}
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase mb-2">
              Quick ICU / Cath Presets
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ICU_PUMP_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedPresetId === p.id
                      ? 'bg-sky-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Drug in Syringe
              </label>
              <div className="flex gap-1">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={drugAmount}
                  onChange={(e) => setDrugAmount(Number(e.target.value) || 0)}
                  className="w-full p-2 text-sm font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl"
                />
                <select
                  value={amountUnit}
                  onChange={(e) =>
                    setAmountUnit(e.target.value as 'mg' | 'mcg' | 'Units')
                  }
                  className="p-2 text-xs font-bold bg-slate-100 border border-slate-300 rounded-xl"
                >
                  <option value="mg">mg</option>
                  <option value="mcg">mcg</option>
                  <option value="Units">Units</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Total Syringe Vol (mL)
              </label>
              <input
                type="number"
                step="1"
                min="1"
                value={syringeTotalMl}
                onChange={(e) => setSyringeTotalMl(Number(e.target.value) || 50)}
                className="w-full p-2 text-sm font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[11px] font-bold text-sky-800 mb-1">
                Target Dose Rate
              </label>
              <div className="flex gap-1">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={desiredRate}
                  onChange={(e) => setDesiredRate(Number(e.target.value) || 0)}
                  className="w-full p-2 text-sm font-mono font-black bg-sky-50 border-2 border-sky-600 text-sky-950 rounded-xl"
                />
                <select
                  value={rateUnit}
                  onChange={(e) => setRateUnit(e.target.value as PumpRateUnit)}
                  className="p-2 text-xs font-bold bg-slate-100 border border-slate-300 rounded-xl"
                >
                  <option value="mcg/kg/min">mcg/kg/min</option>
                  <option value="mcg/kg/hr">mcg/kg/hr</option>
                  <option value="mg/kg/hr">mg/kg/hr</option>
                  <option value="Units/kg/hr">Units/kg/hr</option>
                </select>
              </div>
            </div>
          </div>

          {/* Hero Output */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-sky-600 to-sky-700 text-white rounded-2xl p-4 text-center shadow-md">
              <div className="text-[11px] font-bold uppercase tracking-wider text-sky-100 flex items-center justify-center gap-1">
                <Activity className="w-3.5 h-3.5" />
                <span>Pump Rate</span>
              </div>
              <div className="text-3xl font-black font-mono tabular-nums mt-1">
                {result.rateMlPerHr}
              </div>
              <div className="text-xs font-extrabold text-sky-100">mL / hr</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
              <div className="text-[11px] font-bold uppercase text-slate-500 flex items-center justify-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-indigo-600" />
                <span>Syringe Conc.</span>
              </div>
              <div className="text-xl font-black font-mono text-slate-900 tabular-nums mt-1">
                {result.syringeConcPerMl}
              </div>
              <div className="text-xs font-bold text-indigo-700">
                {result.concUnitLabel}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
              <div className="text-[11px] font-bold uppercase text-slate-500 flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Syringe Duration</span>
              </div>
              <div className="text-xl font-black font-mono text-slate-900 tabular-nums mt-1">
                {result.syringeDurationHrs} hrs
              </div>
              <div className="text-xs font-semibold text-slate-500 font-mono">
                {result.dailyVolumeMl} mL / 24h
              </div>
            </div>
          </div>

          {activePreset && (
            <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 flex items-center justify-between">
              <span>
                Recommended Diluent: <strong>{activePreset.diluent}</strong>
              </span>
              <span className="font-mono text-[11px] text-slate-500">
                Weight: {weightKg} kg
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
