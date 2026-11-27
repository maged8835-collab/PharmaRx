export type DoseUnit = 'mg' | 'mcg' | 'mEq' | 'Units' | 'MIU' | 'g' | 'mL';

export type FrequencyKey = 'q4h' | 'q6h' | 'q8h' | 'q12h' | 'q24h' | 'Stat';

export type StickerSize = '50x30' | '60x40' | '70x40';

export type LabelNameMode = 'trade' | 'generic';

export type ActiveTab = 'patients' | 'autofill' | 'regimen' | 'labels' | 'config' | 'admin';

export type PharmacistRole = 'Clinical Pharmacist' | 'Senior Pharmacist' | 'Admin';

export interface PharmacistSession {
  username: string;
  displayName: string;
  role: PharmacistRole;
  loggedInAt: string;
  userId?: string;
  authSource?: 'local' | 'supabase';
}

export interface UserProfileRecord {
  id: string;
  email: string;
  display_name: string;
  role: 'admin' | 'pharmacist';
  is_active: boolean;
  created_at: string;
}

export interface ActivityLogRecord {
  id: string;
  user_id: string | null;
  user_email: string;
  user_name: string;
  action: string;
  details: string;
  created_at: string;
}

export interface SavedPatientRecord {
  id: string;
  user_id?: string;
  patient_name: string;
  mrn: string;
  ward: string;
  weight_kg: number;
  age_value?: string;
  age_unit?: AgeUnit;
  renal_impairment?: boolean;
  base_date: string;
  default_start_time: string;
  regimen: RegimenItem[];
  locked_by_user_id?: string | null;
  locked_by_name?: string | null;
  locked_at?: string | null;
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

export type AgeUnit = 'days' | 'months' | 'years';

export interface PatientInfo {
  fullName: string;
  mrn: string;
  ward: string;
  weightKg: number | string;
  ageValue?: number | string;
  ageUnit?: AgeUnit;
  renalImpairment?: boolean;
  baseDate: string;
  defaultStartTime: string;
}

export interface CompatibilityAlert {
  id: string;
  severity: 'critical' | 'warning';
  drugA: string;
  drugB: string;
  message: string;
}

export interface ClinicalGuardrailAlert {
  id: string;
  severity: 'critical' | 'warning';
  drugName: string;
  title: string;
  message: string;
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
