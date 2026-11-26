export type DoseUnit = 'mg' | 'mcg' | 'mEq' | 'Units' | 'MIU' | 'g' | 'mL';

export type FrequencyKey = 'q4h' | 'q6h' | 'q8h' | 'q12h' | 'q24h' | 'Stat';

export type StickerSize = '50x30' | '60x40' | '70x40';

export type LabelNameMode = 'trade' | 'generic';

export type ActiveTab = 'autofill' | 'regimen' | 'labels' | 'config';

export type PharmacistRole = 'Clinical Pharmacist' | 'Senior Pharmacist' | 'Admin';

export interface PharmacistSession {
  username: string;
  displayName: string;
  role: PharmacistRole;
  loggedInAt: string;
  userId?: string;
  authSource?: 'local' | 'supabase';
}

export interface SavedPatientRecord {
  id: string;
  patient_name: string;
  mrn: string;
  ward: string;
  weight_kg: number;
  base_date: string;
  default_start_time: string;
  regimen: RegimenItem[];
  updated_at: string;
}

export interface DrugPreset {
  id: string;
  label: string;
  doseMgPerKg: number;
  maxSingleMg: number;
  frequency: FrequencyKey;
}

export interface FormularyDrug {
  id: string;
  tradeName: string;
  genericName: string;
  arabicName: string;
  category: string;
  diluent: string;
  prepInstructions: string;
  finalConcMgMl: number;
  doseUnit: DoseUnit;
  highAlert?: boolean;
  route: string;
  stability: string;
  reference: string;
  isCustom?: boolean;
  presets: DrugPreset[];
}

export interface PatientInfo {
  fullName: string;
  mrn: string;
  ward: string;
  weightKg: number | string;
  baseDate: string;
  defaultStartTime: string;
}

export interface RegimenItem {
  regimenId: string;
  drugId: string;
  tradeName: string;
  genericName: string;
  doseMgPerKg: number;
  maxSingleMg: number;
  finalConcMgMl: number;
  doseUnit: DoseUnit;
  highAlert?: boolean;
  customConcOverride?: number;
  route: string;
  diluent: string;
  prepInstructions: string;
  frequency: FrequencyKey;
  startTime: string;
  stability: string;
  reference: string;
}

export interface ScheduleSlot {
  index: number;
  timeStr: string;
  dateStr: string;
}

export interface AutoFilledDrug extends FormularyDrug {
  activePreset: DrugPreset;
  effectiveDosePerKg: number;
  effectiveFinalConc: number;
  activeFrequency: FrequencyKey;
  rawDoseMg: number;
  finalDoseMg: number;
  isCapped: boolean;
  finalVolumeMl: number;
}

export interface ComputedRegimenItem extends RegimenItem {
  finalDoseMg: number;
  isCapped: boolean;
  finalVolumeMl: number;
  scheduleSlots: ScheduleSlot[];
}

export interface ThermalSticker {
  stickerId: string;
  ward: string;
  mrn: string;
  patientName: string;
  drugDisplayName: string;
  finalVolumeMl: number;
  route: string;
  finalConcMgMl: number;
  doseUnit: DoseUnit;
  timeStr: string;
  doseMgPerKg: number;
  dateStr: string;
  finalDoseMg: number;
  highAlert?: boolean;
}

export interface NewDrugFormState {
  tradeName: string;
  genericName: string;
  arabicName: string;
  category: string;
  diluent: string;
  prepInstructions: string;
  finalConcMgMl: number | string;
  doseUnit: DoseUnit;
  highAlert: boolean;
  route: string;
  stability: string;
  reference: string;
  presetLabel: string;
  doseMgPerKg: number | string;
  maxSingleMg: number | string;
  frequency: FrequencyKey;
}
