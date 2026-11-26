import type { DoseUnit, FormularyDrug, PatientInfo, RegimenItem } from '../types/pharmacy';

const PATIENT_STORAGE_KEY = 'pediasurgrx_active_patient_v2';
const REGIMEN_STORAGE_KEY = 'pediasurgrx_active_regimen_v2';

export function createEmptyPatient(): PatientInfo {
  return {
    fullName: '',
    mrn: '',
    ward: '',
    weightKg: 10,
    ageValue: '',
    ageUnit: 'years',
    renalImpairment: false,
    baseDate: new Date().toISOString().slice(0, 10),
    defaultStartTime: '12:00',
  };
}

export function normalizeFormularyDrug(
  raw: Partial<FormularyDrug> & { id: string; genericName: string }
): FormularyDrug {
  const unit: DoseUnit = raw.doseUnit || 'mg';
  return {
    id: raw.id,
    tradeName: raw.tradeName || raw.genericName,
    genericName: raw.genericName,
    arabicName: raw.arabicName || raw.genericName,
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
    presets:
      Array.isArray(raw.presets) && raw.presets.length > 0
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

export function loadPatient(): PatientInfo {
  const empty = createEmptyPatient();
  try {
    const saved = localStorage.getItem(PATIENT_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        return { ...empty, ...parsed };
      }
    }
  } catch {
    // Use empty
  }
  return empty;
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
    // Use empty
  }
  return [];
}

export function saveRegimen(regimen: RegimenItem[]): void {
  try {
    localStorage.setItem(REGIMEN_STORAGE_KEY, JSON.stringify(regimen));
  } catch (err) {
    console.error('Failed saving regimen:', err);
  }
}
