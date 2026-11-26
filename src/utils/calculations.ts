import type {
  AutoFilledDrug,
  ComputedRegimenItem,
  DoseUnit,
  FormularyDrug,
  FrequencyKey,
  LabelNameMode,
  PatientInfo,
  RegimenItem,
  ScheduleSlot,
  ThermalSticker,
} from '../types/pharmacy';

export const FREQUENCY_CONFIG: Record<
  FrequencyKey,
  { dosesPerDay: number; intervalHours: number; label: string }
> = {
  q4h: { dosesPerDay: 6, intervalHours: 4, label: 'q4h (6x/day)' },
  q6h: { dosesPerDay: 4, intervalHours: 6, label: 'q6h (4x/day)' },
  q8h: { dosesPerDay: 3, intervalHours: 8, label: 'q8h (3x/day)' },
  q12h: { dosesPerDay: 2, intervalHours: 12, label: 'q12h (2x/day)' },
  q24h: { dosesPerDay: 1, intervalHours: 24, label: 'q24h (Once daily)' },
  Stat: { dosesPerDay: 1, intervalHours: 0, label: 'Stat (Single Dose)' },
};

export const VALID_DOSE_UNITS: DoseUnit[] = [
  'mg',
  'mcg',
  'mEq',
  'Units',
  'MIU',
  'g',
  'mL',
];

export function formatCleanNumber(num: number): number {
  if (num === null || num === undefined || Number.isNaN(num)) return 0;
  if (num >= 10) return Math.round(num * 10) / 10;
  return Math.round(num * 100) / 100;
}

export function sanitizeWeightKg(weight: number | string): number {
  const parsed = Number(weight);
  if (!Number.isFinite(parsed) || parsed <= 0) return 0.1;
  return Math.max(0.1, parsed);
}

export function generate24HrSchedule(
  baseDateIso: string,
  startTime24: string,
  frequencyKey: FrequencyKey
): ScheduleSlot[] {
  const config = FREQUENCY_CONFIG[frequencyKey] || FREQUENCY_CONFIG.q8h;
  const [year, month, day] = (baseDateIso || '2026-11-22').split('-').map(Number);
  const [hours, minutes] = (startTime24 || '12:00').split(':').map(Number);

  const safeYear = Number.isFinite(year) && year > 1900 ? year : 2026;
  const safeMonth = Number.isFinite(month) && month >= 1 && month <= 12 ? month : 1;
  const safeDay = Number.isFinite(day) && day >= 1 && day <= 31 ? day : 1;
  const safeHours = Number.isFinite(hours) && hours >= 0 && hours <= 23 ? hours : 12;
  const safeMinutes =
    Number.isFinite(minutes) && minutes >= 0 && minutes <= 59 ? minutes : 0;

  const baseDateObj = new Date(
    safeYear,
    safeMonth - 1,
    safeDay,
    safeHours,
    safeMinutes
  );
  const slots: ScheduleSlot[] = [];

  for (let i = 0; i < config.dosesPerDay; i++) {
    const slotDate = new Date(
      baseDateObj.getTime() + i * config.intervalHours * 3600 * 1000
    );

    let h = slotDate.getHours();
    const m = slotDate.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;

    const dd = String(slotDate.getDate()).padStart(2, '0');
    const mm = String(slotDate.getMonth() + 1).padStart(2, '0');
    const dateStr = `${dd}/${mm}`;

    slots.push({
      index: i + 1,
      timeStr,
      dateStr,
    });
  }

  return slots;
}

export function computeDoseAndVolume(
  weightKg: number,
  dosePerKg: number,
  maxSingleDose: number,
  finalConcPerMl: number
): {
  rawDose: number;
  finalDose: number;
  isCapped: boolean;
  finalVolumeMl: number;
} {
  const w = sanitizeWeightKg(weightKg);
  const safeDosePerKg = Math.max(0, Number(dosePerKg) || 0);
  const safeMax = Math.max(0, Number(maxSingleDose) || 0);
  const safeConc = Math.max(0.001, Number(finalConcPerMl) || 0.001);

  const rawDose = w * safeDosePerKg;
  const isCapped = safeMax > 0 && rawDose > safeMax;
  const finalDose = formatCleanNumber(isCapped ? safeMax : rawDose);
  const finalVolumeMl = formatCleanNumber(finalDose / safeConc);

  return {
    rawDose: formatCleanNumber(rawDose),
    finalDose,
    isCapped,
    finalVolumeMl,
  };
}

export function computeAutoFilledDrug(
  drug: FormularyDrug,
  weightKg: number,
  chosenPresetId?: string,
  inlineDoseOverride?: string,
  inlineConcOverride?: string,
  freqOverride?: FrequencyKey
): AutoFilledDrug {
  const activePreset =
    drug.presets.find((p) => p.id === chosenPresetId) || drug.presets[0];

  const effectiveDosePerKg =
    inlineDoseOverride !== undefined
      ? Math.max(0, Number(inlineDoseOverride) || 0)
      : activePreset.doseMgPerKg;

  const effectiveFinalConc =
    inlineConcOverride !== undefined
      ? Math.max(0.001, Number(inlineConcOverride) || 0.001)
      : drug.finalConcMgMl;

  const activeFrequency = freqOverride || activePreset.frequency;

  const { rawDose, finalDose, isCapped, finalVolumeMl } = computeDoseAndVolume(
    weightKg,
    effectiveDosePerKg,
    activePreset.maxSingleMg,
    effectiveFinalConc
  );

  return {
    ...drug,
    activePreset,
    effectiveDosePerKg,
    effectiveFinalConc,
    activeFrequency,
    rawDoseMg: rawDose,
    finalDoseMg: finalDose,
    isCapped,
    finalVolumeMl,
  };
}

export function computePatientRegimen(
  regimen: RegimenItem[],
  formulary: FormularyDrug[],
  patient: PatientInfo
): ComputedRegimenItem[] {
  const w = sanitizeWeightKg(patient.weightKg);

  return regimen.map((item) => {
    const masterDrug = formulary.find((d) => d.id === item.drugId);
    const finalConc =
      item.customConcOverride !== undefined
        ? item.customConcOverride
        : masterDrug
          ? masterDrug.finalConcMgMl
          : item.finalConcMgMl;
    const prepInstr = masterDrug ? masterDrug.prepInstructions : item.prepInstructions;
    const diluent = masterDrug ? masterDrug.diluent : item.diluent;
    const doseUnit = masterDrug ? masterDrug.doseUnit : item.doseUnit || 'mg';
    const highAlert = masterDrug ? masterDrug.highAlert : item.highAlert;

    const { finalDose, isCapped, finalVolumeMl } = computeDoseAndVolume(
      w,
      item.doseMgPerKg,
      item.maxSingleMg,
      finalConc
    );

    const scheduleSlots = generate24HrSchedule(
      patient.baseDate,
      item.startTime || patient.defaultStartTime,
      item.frequency
    );

    return {
      ...item,
      finalConcMgMl: finalConc,
      prepInstructions: prepInstr,
      diluent,
      doseUnit,
      highAlert,
      finalDoseMg: finalDose,
      isCapped,
      finalVolumeMl,
      scheduleSlots,
    };
  });
}

export function buildThermalStickers(
  computedRegimen: ComputedRegimenItem[],
  patient: PatientInfo,
  _labelNameMode: LabelNameMode = 'generic'
): ThermalSticker[] {
  const stickers: ThermalSticker[] = [];
  computedRegimen.forEach((reg) => {
    const displayName = reg.genericName;

    reg.scheduleSlots.forEach((slot) => {
      stickers.push({
        stickerId: `${reg.regimenId}_${slot.index}`,
        ward: patient.ward || 'WARD',
        mrn: patient.mrn || '—',
        patientName: patient.fullName || 'Patient Name',
        drugDisplayName: displayName,
        finalVolumeMl: reg.finalVolumeMl,
        route: reg.route,
        finalConcMgMl: reg.finalConcMgMl,
        doseUnit: reg.doseUnit || 'mg',
        timeStr: slot.timeStr,
        doseMgPerKg: reg.doseMgPerKg,
        dateStr: slot.dateStr,
        finalDoseMg: reg.finalDoseMg,
        highAlert: reg.highAlert,
      });
    });
  });
  return stickers;
}

export function escapeCsvCell(value: string | number | undefined): string {
  const str = String(value ?? '');
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

export function buildPatientRegimenCsv(
  computedRegimen: ComputedRegimenItem[],
  patient: PatientInfo
): string {
  const headers = [
    'Patient Name',
    'MRN / ID',
    'Ward / Unit',
    'Weight (kg)',
    'Active Ingredient',
    'Unit',
    'Dose (/kg)',
    'Calculated Dose',
    'Standard Final Conc (/mL)',
    'Final Volume (mL)',
    'Route',
    'Frequency',
    '24h Administration Schedule',
    'Diluent & Preparation Instructions',
    '24h Stability & Reference',
  ];

  const rows = computedRegimen.map((item) => {
    const scheduleSummary = item.scheduleSlots
      .map((s) => `${s.timeStr} (${s.dateStr})`)
      .join(' | ');

    return [
      escapeCsvCell(patient.fullName),
      escapeCsvCell(patient.mrn),
      escapeCsvCell(patient.ward),
      patient.weightKg,
      escapeCsvCell(item.genericName),
      escapeCsvCell(item.doseUnit),
      item.doseMgPerKg,
      item.finalDoseMg,
      item.finalConcMgMl,
      item.finalVolumeMl,
      escapeCsvCell(item.route),
      escapeCsvCell(item.frequency),
      escapeCsvCell(scheduleSummary),
      escapeCsvCell(item.prepInstructions),
      escapeCsvCell(`${item.stability} [${item.reference}]`),
    ].join(',');
  });

  return '\uFEFF' + [headers.map(escapeCsvCell).join(','), ...rows].join('\n');
}

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

export function parseFormularyCsv(csvText: string): FormularyDrug[] {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const importedDrugs: FormularyDrug[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    if (cols.length >= 5 && cols[0] && cols[1]) {
      const conc = Math.max(0.001, parseFloat(cols[3]) || 1);
      const dose = parseFloat(cols[4]) || 1;
      const maxD = parseFloat(cols[5]) || 1000;
      const freqKey = (
        cols[6] && cols[6] in FREQUENCY_CONFIG ? cols[6] : 'q8h'
      ) as FrequencyKey;
      const rawUnit = cols[9] as DoseUnit | undefined;
      const doseUnit: DoseUnit =
        rawUnit && VALID_DOSE_UNITS.includes(rawUnit) ? rawUnit : 'mg';

      importedDrugs.push({
        id: `csv_${Date.now()}_${i}`,
        tradeName: cols[0],
        genericName: cols[1],
        arabicName: cols[0],
        category: cols[2] || 'Custom Imported',
        diluent: '0.9% NS',
        prepInstructions: cols[8] || `Dilute to ${conc} ${doseUnit}/mL`,
        finalConcMgMl: conc,
        doseUnit,
        route: cols[7] || 'IV Infusion',
        stability: '24h RT',
        reference: 'Hospital CSV Import',
        isCustom: true,
        presets: [
          {
            id: 'std',
            label: `Standard (${dose} ${doseUnit}/kg)`,
            doseMgPerKg: dose,
            maxSingleMg: maxD,
            frequency: freqKey,
          },
        ],
      });
    }
  }
  return importedDrugs;
}
