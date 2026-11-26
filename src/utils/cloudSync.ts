import { supabase } from '../lib/supabase';
import type {
  FormularyDrug,
  PatientInfo,
  PharmacistSession,
  RegimenItem,
  SavedPatientRecord,
} from '../types/pharmacy';
import { normalizeFormularyDrug } from './storage';

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

  const displayName =
    (data.user.user_metadata?.display_name as string | undefined) ||
    data.user.email?.split('@')[0] ||
    'Pharmacist';

  return {
    session: {
      username: data.user.email || email.trim(),
      displayName,
      role: 'Clinical Pharmacist',
      loggedInAt: new Date().toISOString(),
      userId: data.user.id,
      authSource: 'supabase',
    },
    error: null,
  };
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

  return {
    session: {
      username: data.user.email || email.trim(),
      displayName: displayName.trim() || data.user.email?.split('@')[0] || 'Pharmacist',
      role: 'Clinical Pharmacist',
      loggedInAt: new Date().toISOString(),
      userId: data.user.id,
      authSource: 'supabase',
    },
    needsEmailConfirm: false,
    error: null,
  };
}

export async function getActiveSupabaseSession(): Promise<PharmacistSession | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  if (!user) return null;

  const displayName =
    (user.user_metadata?.display_name as string | undefined) ||
    user.email?.split('@')[0] ||
    'Pharmacist';

  return {
    username: user.email || user.id,
    displayName,
    role: 'Clinical Pharmacist',
    loggedInAt: new Date().toISOString(),
    userId: user.id,
    authSource: 'supabase',
  };
}

export async function signOutSupabase(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function fetchCloudFormulary(
  userId: string
): Promise<FormularyDrug[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('pharmacy_formulary_state')
    .select('formulary')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data || !Array.isArray(data.formulary) || data.formulary.length === 0) {
    return null;
  }
  return data.formulary.map(normalizeFormularyDrug);
}

export async function saveCloudFormulary(
  userId: string,
  formulary: FormularyDrug[]
): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('pharmacy_formulary_state').upsert(
    {
      user_id: userId,
      formulary,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );
  return !error;
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
