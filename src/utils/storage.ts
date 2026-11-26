import type { DoseUnit, FormularyDrug, PatientInfo, RegimenItem } from '../types/pharmacy';

const FORMULARY_STORAGE_KEY = 'pediasurgrx_master_formulary_v4';
const PATIENT_STORAGE_KEY = 'pediasurgrx_active_patient_v1';
const REGIMEN_STORAGE_KEY = 'pediasurgrx_active_regimen_v1';

export const DEFAULT_PATIENT: PatientInfo = {
  fullName: 'براء محمد عبدالسلام عبدالحميد',
  mrn: '20234098',
  ward: 'قسطرة',
  weightKg: 21,
  baseDate: '2026-11-22',
  defaultStartTime: '12:00',
};

export const DEFAULT_REGIMEN: RegimenItem[] = [
  {
    regimenId: 'init_ketolac',
    drugId: 'ketolac',
    tradeName: 'Ketolac',
    genericName: 'Ketorolac Tromethamine',
    doseMgPerKg: 0.5,
    maxSingleMg: 30,
    finalConcMgMl: 15,
    doseUnit: 'mg',
    route: 'IV Shot',
    diluent: '0.9% NS',
    prepInstructions:
      'Dilute 30 mg (1 mL) + 1 mL 0.9% NS -> Total 2 mL (15 mg/mL)',
    frequency: 'q12h',
    startTime: '12:00',
    stability: '24h RT (Max therapy duration: 48 hrs)',
    reference: 'Lexidrug / BNFc',
  },
];

export function normalizeFormularyDrug(
  raw: Partial<FormularyDrug> & { id: string; tradeName: string; genericName: string }
): FormularyDrug {
  const unit: DoseUnit = raw.doseUnit || 'mg';
  return {
    id: raw.id,
    tradeName: raw.tradeName,
    genericName: raw.genericName,
    arabicName: raw.arabicName || raw.tradeName,
    category: raw.category || 'Custom',
    diluent: raw.diluent || '0.9% NS',
    prepInstructions: raw.prepInstructions || '',
    finalConcMgMl: Number(raw.finalConcMgMl) || 1,
    doseUnit: unit,
    highAlert: Boolean(raw.highAlert),
    route: raw.route || 'IV Infusion',
    stability: raw.stability || '24h RT',
    reference: raw.reference || 'Lexidrug Pediatric',
    isCustom: raw.isCustom,
    presets: Array.isArray(raw.presets) && raw.presets.length > 0
      ? raw.presets
      : [
          {
            id: 'std',
            label: `Standard (1 ${unit}/kg)`,
            doseMgPerKg: 1,
            maxSingleMg: 1000,
            frequency: 'q8h',
          },
        ],
  };
}

export function loadFormulary(fallback: FormularyDrug[]): FormularyDrug[] {
  try {
    const saved = localStorage.getItem(FORMULARY_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizeFormularyDrug);
      }
    }
  } catch {
    // Fallback to built-in master formulary
  }
  return fallback;
}

export function saveFormulary(formulary: FormularyDrug[]): void {
  try {
    localStorage.setItem(FORMULARY_STORAGE_KEY, JSON.stringify(formulary));
  } catch (err) {
    console.error('Failed saving formulary:', err);
  }
}

export function loadPatient(): PatientInfo {
  try {
    const saved = localStorage.getItem(PATIENT_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        return { ...DEFAULT_PATIENT, ...parsed };
      }
    }
  } catch {
    // Use default
  }
  return DEFAULT_PATIENT;
}

export function savePatient(patient: PatientInfo): void {
  try {
    localStorage.setItem(PATIENT_STORAGE_KEY, JSON.stringify(patient));
  } catch (err) {
    console.error('Failed saving patient:', err);
  }
}

export function loadRegimen(): RegimenItem[] {
  try {
    const saved = localStorage.getItem(REGIMEN_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.map((r) => ({ ...r, doseUnit: r.doseUnit || 'mg' }));
      }
    }
  } catch {
    // Use default
  }
  return DEFAULT_REGIMEN;
}

export function saveRegimen(regimen: RegimenItem[]): void {
  try {
    localStorage.setItem(REGIMEN_STORAGE_KEY, JSON.stringify(regimen));
  } catch (err) {
    console.error('Failed saving regimen:', err);
  }
}
