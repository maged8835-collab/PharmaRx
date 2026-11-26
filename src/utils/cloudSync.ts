import { supabase } from '../lib/supabase';
import type {
  ActivityLogRecord,
  DoseUnit,
  DrugPreset,
  FormularyDrug,
  PatientInfo,
  PharmacistSession,
  RegimenItem,
  SavedPatientRecord,
  UserProfileRecord,
} from '../types/pharmacy';
import { normalizeFormularyDrug } from './storage';

interface MedicationRow {
  id: string;
  trade_name: string;
  generic_name: string;
  arabic_name: string;
  category: string;
  diluent: string;
  prep_instructions: string;
  final_conc_mg_ml: number;
  dose_unit: DoseUnit;
  high_alert: boolean;
  route: string;
  stability: string;
  reference: string;
  is_custom: boolean;
  presets: DrugPreset[];
}

function rowToFormularyDrug(row: MedicationRow): FormularyDrug {
  return normalizeFormularyDrug({
    id: row.id,
    tradeName: row.trade_name,
    genericName: row.generic_name,
    arabicName: row.arabic_name,
    category: row.category,
    diluent: row.diluent,
    prepInstructions: row.prep_instructions,
    finalConcMgMl: Number(row.final_conc_mg_ml),
    doseUnit: row.dose_unit,
    highAlert: row.high_alert,
    route: row.route,
    stability: row.stability,
    reference: row.reference,
    isCustom: row.is_custom,
    presets: row.presets,
  });
}

function formularyDrugToRow(d: FormularyDrug): MedicationRow {
  return {
    id: d.id,
    trade_name: d.tradeName || d.genericName,
    generic_name: d.genericName,
    arabic_name: d.arabicName || d.genericName,
    category: d.category,
    diluent: d.diluent,
    prep_instructions: d.prepInstructions,
    final_conc_mg_ml: Number(d.finalConcMgMl) || 1,
    dose_unit: d.doseUnit || 'mg',
    high_alert: Boolean(d.highAlert),
    route: d.route,
    stability: d.stability,
    reference: d.reference,
    is_custom: Boolean(d.isCustom),
    presets: d.presets || [],
  };
}

async function resolveProfileForUser(
  userId: string,
  email: string,
  fallbackName: string
): Promise<{
  displayName: string;
  role: 'Admin' | 'Clinical Pharmacist';
  isActive: boolean;
}> {
  if (!supabase) {
    return { displayName: fallbackName, role: 'Clinical Pharmacist', isActive: true };
  }
  const { data } = await supabase
    .from('profiles')
    .select('display_name, role, is_active')
    .eq('id', userId)
    .maybeSingle();

  if (!data) {
    // Ensure profile exists if trigger hadn't run
    await supabase.from('profiles').upsert(
      {
        id: userId,
        email,
        display_name: fallbackName,
        role: 'pharmacist',
        is_active: true,
      },
      { onConflict: 'id' }
    );
    return { displayName: fallbackName, role: 'Clinical Pharmacist', isActive: true };
  }

  return {
    displayName: data.display_name || fallbackName,
    role: data.role === 'admin' ? 'Admin' : 'Clinical Pharmacist',
    isActive: data.is_active !== false,
  };
}

export async function signInWithSupabaseEmail(
  email: string,
  password: string
): Promise<{ session: PharmacistSession | null; error: string | null }> {
  if (!supabase) {
    return { session: null, error: 'Supabase غير مهيأ في هذه البيئة.' };
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error || !data.user) {
    return {
      session: null,
      error: error?.message || 'فشل تسجيل الدخول عبر Supabase.',
    };
  }

  const fallbackName =
    (data.user.user_metadata?.display_name as string | undefined) ||
    data.user.email?.split('@')[0] ||
    'Pharmacist';

  const profile = await resolveProfileForUser(
    data.user.id,
    data.user.email || email.trim(),
    fallbackName
  );

  if (!profile.isActive) {
    await supabase.auth.signOut();
    return {
      session: null,
      error: 'تم إيقاف هذا الحساب من قِبل مدير المنصة (Admin).',
    };
  }

  const session: PharmacistSession = {
    username: data.user.email || email.trim(),
    displayName: profile.displayName,
    role: profile.role,
    loggedInAt: new Date().toISOString(),
    userId: data.user.id,
    authSource: 'supabase',
  };

  await logActivity(session, 'LOGIN', 'تسجيل دخول إلى المنصة');
  return { session, error: null };
}

export async function signUpWithSupabaseEmail(
  email: string,
  password: string,
  displayName: string
): Promise<{
  session: PharmacistSession | null;
  needsEmailConfirm: boolean;
  error: string | null;
}> {
  if (!supabase) {
    return {
      session: null,
      needsEmailConfirm: false,
      error: 'Supabase غير مهيأ في هذه البيئة.',
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        display_name: displayName.trim() || email.split('@')[0],
      },
    },
  });

  if (error) {
    return { session: null, needsEmailConfirm: false, error: error.message };
  }

  if (!data.session || !data.user) {
    return { session: null, needsEmailConfirm: true, error: null };
  }

  const profile = await resolveProfileForUser(
    data.user.id,
    data.user.email || email.trim(),
    displayName.trim() || data.user.email?.split('@')[0] || 'Pharmacist'
  );

  const session: PharmacistSession = {
    username: data.user.email || email.trim(),
    displayName: profile.displayName,
    role: profile.role,
    loggedInAt: new Date().toISOString(),
    userId: data.user.id,
    authSource: 'supabase',
  };

  await logActivity(session, 'SIGNUP', 'إنشاء حساب صيدلي جديد');
  return { session, needsEmailConfirm: false, error: null };
}

export async function getActiveSupabaseSession(): Promise<PharmacistSession | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  if (!user) return null;

  const fallbackName =
    (user.user_metadata?.display_name as string | undefined) ||
    user.email?.split('@')[0] ||
    'Pharmacist';

  const profile = await resolveProfileForUser(
    user.id,
    user.email || '',
    fallbackName
  );

  if (!profile.isActive) {
    await supabase.auth.signOut();
    return null;
  }

  return {
    username: user.email || user.id,
    displayName: profile.displayName,
    role: profile.role,
    loggedInAt: new Date().toISOString(),
    userId: user.id,
    authSource: 'supabase',
  };
}

export async function signOutSupabase(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function logActivity(
  session: PharmacistSession | null,
  action: string,
  details: string
): Promise<void> {
  if (!supabase || !session?.userId) return;
  try {
    await supabase.from('activity_logs').insert({
      user_id: session.userId,
      user_email: session.username,
      user_name: session.displayName,
      action,
      details,
    });
  } catch {
    // Non-blocking audit log
  }
}

export async function fetchMedicationsFromSupabase(): Promise<{
  drugs: FormularyDrug[];
  error: string | null;
}> {
  if (!supabase) {
    return { drugs: [], error: 'Supabase غير متصل.' };
  }
  const { data, error } = await supabase
    .from('medications')
    .select('*')
    .order('category', { ascending: true })
    .order('generic_name', { ascending: true });

  if (error) {
    return { drugs: [], error: error.message };
  }

  return {
    drugs: Array.isArray(data) ? (data as MedicationRow[]).map(rowToFormularyDrug) : [],
    error: null,
  };
}

export async function upsertMedicationToSupabase(
  drug: FormularyDrug
): Promise<{ ok: boolean; error: string | null }> {
  if (!supabase) return { ok: false, error: 'Supabase غير متصل.' };
  const { error } = await supabase
    .from('medications')
    .upsert({ ...formularyDrugToRow(drug), updated_at: new Date().toISOString() }, { onConflict: 'id' });
  return { ok: !error, error: error?.message || null };
}

export async function bulkUpsertMedicationsToSupabase(
  drugs: FormularyDrug[]
): Promise<{ ok: boolean; error: string | null }> {
  if (!supabase) return { ok: false, error: 'Supabase غير متصل.' };
  const rows = drugs.map((d) => ({
    ...formularyDrugToRow(d),
    updated_at: new Date().toISOString(),
  }));
  const { error } = await supabase
    .from('medications')
    .upsert(rows, { onConflict: 'id' });
  return { ok: !error, error: error?.message || null };
}

export async function fetchSavedPatients(
  userId: string
): Promise<SavedPatientRecord[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('patient_regimens')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(50);

  if (error || !Array.isArray(data)) return [];
  return data as SavedPatientRecord[];
}

export async function savePatientToCloud(
  userId: string,
  patient: PatientInfo,
  regimen: RegimenItem[]
): Promise<{ record: SavedPatientRecord | null; error: string | null }> {
  if (!supabase) {
    return { record: null, error: 'Supabase غير متصل.' };
  }
  const { data, error } = await supabase
    .from('patient_regimens')
    .insert({
      user_id: userId,
      patient_name: patient.fullName || 'Unnamed Patient',
      mrn: patient.mrn || '',
      ward: patient.ward || '',
      weight_kg: Number(patient.weightKg) || 10,
      age_value: String(patient.ageValue ?? ''),
      age_unit: patient.ageUnit || 'years',
      renal_impairment: Boolean(patient.renalImpairment),
      base_date: patient.baseDate,
      default_start_time: patient.defaultStartTime,
      regimen,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return { record: null, error: error.message };
  }
  return { record: data as SavedPatientRecord, error: null };
}

export async function deleteSavedPatient(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('patient_regimens').delete().eq('id', id);
  return !error;
}

// ============================================================================
// ADMIN MANAGEMENT & AUDIT LOG APIs
// ============================================================================

export async function fetchAllProfiles(): Promise<UserProfileRecord[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !Array.isArray(data)) return [];
  return data as UserProfileRecord[];
}

export async function updateUserProfile(
  userId: string,
  updates: { role?: 'admin' | 'pharmacist'; is_active?: boolean }
): Promise<{ ok: boolean; error: string | null }> {
  if (!supabase) return { ok: false, error: 'Supabase غير متصل.' };
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  return { ok: !error, error: error?.message || null };
}

export async function fetchActivityLogs(limit = 150): Promise<ActivityLogRecord[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error || !Array.isArray(data)) return [];
  return data as ActivityLogRecord[];
}

export async function fetchAllPatientsAdmin(limit = 100): Promise<SavedPatientRecord[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('patient_regimens')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(limit);
  if (error || !Array.isArray(data)) return [];
  return data as SavedPatientRecord[];
}
