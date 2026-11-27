import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { HeaderNav } from './components/HeaderNav';
import { LoginPage } from './components/LoginPage';
import { PatientIntakeBar } from './components/PatientIntakeBar';
import { PatientsBoard } from './components/PatientsBoard';
import type {
  ActiveTab,
  AutoFilledDrug,
  FormularyDrug,
  FrequencyKey,
  NewDrugFormState,
  PatientInfo,
  PharmacistSession,
  RegimenItem,
  SavedPatientRecord,
  StickerSize,
} from './types/pharmacy';
import {
  buildPatientRegimenCsv,
  buildShiftRegimenCsv,
  buildThermalStickers,
  computeAutoFilledDrug,
  computePatientRegimen,
  parseFormularyCsv,
  sanitizeWeightKg,
} from './utils/calculations';
import {
  acquirePatientLock,
  bulkUpsertMedicationsToSupabase,
  deleteSavedPatient,
  fetchMedicationsFromSupabase,
  fetchSharedPatients,
  getActiveSupabaseSession,
  logActivity,
  releasePatientLock,
  savePatientToCloud,
  signOutSupabase,
  updatePatientInCloud,
  upsertMedicationToSupabase,
} from './utils/cloudSync';
import { createEmptyPatient, normalizeFormularyDrug } from './utils/storage';

const AutoFillTable = lazy(() =>
  import('./components/AutoFillTable').then((m) => ({ default: m.AutoFillTable }))
);
const PatientRegimenSheet = lazy(() =>
  import('./components/PatientRegimenSheet').then((m) => ({
    default: m.PatientRegimenSheet,
  }))
);
const ThermalLabelsView = lazy(() =>
  import('./components/ThermalLabelsView').then((m) => ({
    default: m.ThermalLabelsView,
  }))
);
const PrepStandardsView = lazy(() =>
  import('./components/PrepStandardsView').then((m) => ({
    default: m.PrepStandardsView,
  }))
);
const QuickAddModal = lazy(() =>
  import('./components/QuickAddModal').then((m) => ({ default: m.QuickAddModal }))
);
const InfusionPumpModal = lazy(() =>
  import('./components/InfusionPumpModal').then((m) => ({
    default: m.InfusionPumpModal,
  }))
);
const AdminDashboard = lazy(() =>
  import('./components/AdminDashboard').then((m) => ({
    default: m.AdminDashboard,
  }))
);

const INITIAL_NEW_DRUG_FORM: NewDrugFormState = {
  tradeName: '',
  genericName: '',
  arabicName: '',
  category: 'Antimicrobials',
  diluent: '0.9% NS',
  prepInstructions: 'Dilute in 0.9% NS to target final concentration',
  finalConcMgMl: 10,
  doseUnit: 'mg',
  highAlert: false,
  route: 'IV Infusion',
  stability: '24h RT',
  reference: 'Lexidrug Pediatric',
  presetLabel: 'Standard Pediatric Dose',
  doseMgPerKg: 10,
  maxSingleMg: 1000,
  frequency: 'q8h',
};

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pediasurgrx_theme_v1') === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try {
      localStorage.setItem('pediasurgrx_theme_v1', isDark ? 'dark' : 'light');
    } catch {
      // Ignore storage error
    }
  }, [isDark]);

  const [session, setSession] = useState<PharmacistSession | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const [formulary, setFormulary] = useState<FormularyDrug[]>([]);
  const [isLoadingFormulary, setIsLoadingFormulary] = useState(false);
  const [formularyError, setFormularyError] = useState('');

  const [sharedPatients, setSharedPatients] = useState<SavedPatientRecord[]>([]);
  const [activePatientId, setActivePatientId] = useState<string | null>(null);
  const [isReadOnlyLock, setIsReadOnlyLock] = useState(false);
  const [lockedByName, setLockedByName] = useState('');
  const [isSavingCloud, setIsSavingCloud] = useState(false);

  const [patient, setPatient] = useState<PatientInfo>(() => createEmptyPatient());
  const [patientRegimen, setPatientRegimen] = useState<RegimenItem[]>([]);
  const autoSaveReadyRef = useRef(false);

  useEffect(() => {
    getActiveSupabaseSession().then((sbSession) => {
      setSession(sbSession);
      setIsCheckingSession(false);
    });
  }, []);

  const loadCloudData = useCallback(async () => {
    setIsLoadingFormulary(true);
    setFormularyError('');
    const [{ drugs, error }, patients] = await Promise.all([
      fetchMedicationsFromSupabase(),
      fetchSharedPatients(),
    ]);
    setIsLoadingFormulary(false);
    if (error) {
      setFormularyError(error);
    } else {
      setFormulary(drugs);
    }
    setSharedPatients(patients);
  }, []);

  useEffect(() => {
    if (!session?.userId) {
      setFormulary([]);
      setSharedPatients([]);
      setActivePatientId(null);
      return;
    }
    loadCloudData();
  }, [session?.userId, loadCloudData]);

  // 30-second heartbeat to keep lock alive while active pharmacist is editing
  useEffect(() => {
    if (!activePatientId || isReadOnlyLock || !session?.displayName) return;
    const interval = setInterval(() => {
      acquirePatientLock(activePatientId, session.displayName);
    }, 30000);
    return () => clearInterval(interval);
  }, [activePatientId, isReadOnlyLock, session?.displayName]);

  // Debounced auto-save for the pharmacist holding the lock
  useEffect(() => {
    if (!activePatientId || isReadOnlyLock || !autoSaveReadyRef.current) return;
    const timer = setTimeout(async () => {
      const { record } = await updatePatientInCloud(
        activePatientId,
        patient,
        patientRegimen
      );
      if (record) {
        setSharedPatients((prev) =>
          prev.map((p) => (p.id === record.id ? record : p))
        );
      }
    }, 900);
    return () => clearTimeout(timer);
  }, [activePatientId, isReadOnlyLock, patient, patientRegimen]);

  const [activeTab, setActiveTab] = useState<ActiveTab>('patients');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPresetsByDrug, setSelectedPresetsByDrug] = useState<Record<string, string>>({});
  const [inlineDoseOverrideByDrug, setInlineDoseOverrideByDrug] = useState<Record<string, string>>(
    {}
  );
  const [inlineConcOverrideByDrug, setInlineConcOverrideByDrug] = useState<Record<string, string>>(
    {}
  );
  const [selectedFreqOverrideByDrug, setSelectedFreqOverrideByDrug] = useState<
    Record<string, FrequencyKey>
  >({});
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  const [stickerSize, setStickerSize] = useState<StickerSize>('60x40');
  const [addedFeedbackId, setAddedFeedbackId] = useState<string | null>(null);
  const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState(false);
  const [isPumpModalOpen, setIsPumpModalOpen] = useState(false);
  const [configToast, setConfigToast] = useState('');
  const [newDrugForm, setNewDrugForm] = useState<NewDrugFormState>(INITIAL_NEW_DRUG_FORM);

  const showToast = (msg: string, ms = 3500) => {
    setConfigToast(msg);
    setTimeout(() => setConfigToast(''), ms);
  };

  const categories = useMemo(() => {
    const set = new Set(formulary.map((d) => d.category));
    return ['All', ...Array.from(set)];
  }, [formulary]);

  const regimenDrugIds = useMemo(
    () => new Set(patientRegimen.map((r) => r.drugId)),
    [patientRegimen]
  );

  const autoFilledDrugs = useMemo(() => {
    const w = sanitizeWeightKg(patient.weightKg);
    const q = searchQuery.toLowerCase().trim();

    return formulary
      .filter((drug) => {
        if (showSelectedOnly && !regimenDrugIds.has(drug.id)) return false;
        const matchesCategory = selectedCategory === 'All' || drug.category === selectedCategory;
        const matchesQuery =
          !q ||
          drug.genericName.toLowerCase().includes(q) ||
          (drug.arabicName && drug.arabicName.includes(q)) ||
          drug.category.toLowerCase().includes(q);
        return matchesCategory && matchesQuery;
      })
      .map((drug) =>
        computeAutoFilledDrug(
          drug,
          w,
          selectedPresetsByDrug[drug.id],
          inlineDoseOverrideByDrug[drug.id],
          inlineConcOverrideByDrug[drug.id],
          selectedFreqOverrideByDrug[drug.id]
        )
      );
  }, [
    formulary,
    patient.weightKg,
    searchQuery,
    selectedCategory,
    selectedPresetsByDrug,
    inlineDoseOverrideByDrug,
    inlineConcOverrideByDrug,
    selectedFreqOverrideByDrug,
    showSelectedOnly,
    regimenDrugIds,
  ]);

  const computedPatientRegimen = useMemo(
    () => computePatientRegimen(patientRegimen, formulary, patient),
    [patientRegimen, formulary, patient]
  );

  const allThermalStickers = useMemo(
    () => buildThermalStickers(computedPatientRegimen, patient, 'generic'),
    [computedPatientRegimen, patient]
  );

  const handleOpenPatient = async (rec: SavedPatientRecord) => {
    if (!session) return;
    if (activePatientId && activePatientId !== rec.id && !isReadOnlyLock) {
      await releasePatientLock(activePatientId);
    }

    const lockRes = await acquirePatientLock(rec.id, session.displayName);
    autoSaveReadyRef.current = false;

    setPatient({
      fullName: rec.patient_name,
      mrn: rec.mrn,
      ward: rec.ward,
      weightKg: rec.weight_kg,
      ageValue: rec.age_value || '',
      ageUnit: rec.age_unit || 'years',
      renalImpairment: Boolean(rec.renal_impairment),
      baseDate: rec.base_date,
      defaultStartTime: rec.default_start_time,
    });
    setPatientRegimen(Array.isArray(rec.regimen) ? rec.regimen : []);
    setActivePatientId(rec.id);

    if (lockRes.acquired) {
      setIsReadOnlyLock(false);
      setLockedByName('');
      setTimeout(() => {
        autoSaveReadyRef.current = true;
      }, 150);
    } else {
      setIsReadOnlyLock(true);
      setLockedByName(lockRes.lockedByName || 'صيدلي آخر');
    }

    setActiveTab('regimen');
    logActivity(
      session,
      'OPEN_PATIENT',
      `فتح ملف ${rec.patient_name} (${lockRes.acquired ? 'تعديل' : 'قراءة فقط'})`
    );
  };

  const handleBackToPatients = async () => {
    if (activePatientId && !isReadOnlyLock) {
      await updatePatientInCloud(activePatientId, patient, patientRegimen);
      await releasePatientLock(activePatientId);
    }
    autoSaveReadyRef.current = false;
    setActivePatientId(null);
    setIsReadOnlyLock(false);
    setLockedByName('');
    setActiveTab('patients');
    const latest = await fetchSharedPatients();
    setSharedPatients(latest);
  };

  const handleCreateNewPatient = async (newPat: PatientInfo) => {
    if (!session?.userId) return;
    const { record, error } = await savePatientToCloud(session.userId, newPat, []);
    if (error || !record) {
      showToast(`تعذر إنشاء ملف المريض: ${error}`);
      return;
    }
    setSharedPatients((prev) => [record, ...prev]);
    logActivity(
      session,
      'CREATE_PATIENT',
      `إنشاء ملف مريض جديد: ${record.patient_name} (${record.weight_kg} kg)`
    );
    await handleOpenPatient(record);
  };

  const handleForceUnlock = async (patientId: string) => {
    await releasePatientLock(patientId);
    const latest = await fetchSharedPatients();
    setSharedPatients(latest);
    showToast('تم فك القفل بنجاح.');
  };

  const handleAddDrugToPatientSheet = (calculatedDrug: AutoFilledDrug) => {
    if (isReadOnlyLock) return;
    const newEntry: RegimenItem = {
      regimenId: `${calculatedDrug.id}_${Date.now()}`,
      drugId: calculatedDrug.id,
      tradeName: calculatedDrug.genericName,
      genericName: calculatedDrug.genericName,
      doseMgPerKg: calculatedDrug.effectiveDosePerKg,
      maxSingleMg: calculatedDrug.activePreset.maxSingleMg,
      finalConcMgMl: calculatedDrug.effectiveFinalConc,
      doseUnit: calculatedDrug.doseUnit,
      highAlert: calculatedDrug.highAlert,
      customConcOverride:
        inlineConcOverrideByDrug[calculatedDrug.id] !== undefined
          ? calculatedDrug.effectiveFinalConc
          : undefined,
      route: calculatedDrug.route,
      diluent: calculatedDrug.diluent,
      prepInstructions: calculatedDrug.prepInstructions,
      frequency: calculatedDrug.activeFrequency,
      startTime: patient.defaultStartTime,
      stability: calculatedDrug.stability,
      reference: calculatedDrug.reference,
    };

    setPatientRegimen((prev) => [...prev, newEntry]);
    setAddedFeedbackId(calculatedDrug.id);
    setTimeout(() => setAddedFeedbackId(null), 1400);
  };

  const handleUpdateRegimenItem = (
    regimenId: string,
    field: 'frequency' | 'startTime',
    value: string
  ) => {
    if (isReadOnlyLock) return;
    setPatientRegimen((prev) =>
      prev.map((item) => (item.regimenId === regimenId ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveRegimenItem = (regimenId: string) => {
    if (isReadOnlyLock) return;
    setPatientRegimen((prev) => prev.filter((item) => item.regimenId !== regimenId));
  };

  const handleExportPatientExcel = () => {
    const csvContent = buildPatientRegimenCsv(computedPatientRegimen, patient);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeName = (patient.mrn || 'Patient').replace(/[^a-zA-Z0-9_-]/g, '_');
    link.setAttribute('download', `Pharmacy_IV_Sheet_${safeName}_${patient.weightKg}kg.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    logActivity(
      session,
      'EXPORT_CSV',
      `تصدير شيت المريض ${patient.fullName || 'Unnamed'} (${computedPatientRegimen.length} أدوية)`
    );
  };

  const handleExportShiftExcel = (patientsToExport: SavedPatientRecord[]) => {
    const csvContent = buildShiftRegimenCsv(patientsToExport, formulary);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const today = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `Shift_IV_Sheet_${today}_${patientsToExport.length}_Patients.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    logActivity(
      session,
      'EXPORT_SHIFT_CSV',
      `تصدير شيت الوردية (${patientsToExport.length} مرضى)`
    );
  };

  const handleSaveMasterDrugEdit = async (
    drugId: string,
    updates: {
      finalConcMgMl: number;
      diluent: string;
      prepInstructions: string;
      stability: string;
    }
  ) => {
    const existing = formulary.find((d) => d.id === drugId);
    if (!existing) return;
    const updatedDrug = { ...existing, ...updates };
    setFormulary((prev) => prev.map((d) => (d.id === drugId ? updatedDrug : d)));
    const { ok, error } = await upsertMedicationToSupabase(updatedDrug);
    if (ok) {
      logActivity(
        session,
        'UPDATE_MEDICATION',
        `تعديل التركيز القياسي لـ ${updatedDrug.genericName} إلى ${updatedDrug.finalConcMgMl} ${updatedDrug.doseUnit}/mL`
      );
      showToast('تم حفظ تعديل التركيز القياسي على Supabase وتحديث جميع الحسابات.');
    } else {
      showToast(`تعذر الحفظ على Supabase: ${error}`);
    }
  };

  const handleAddNewFormularyDrug = async (e: FormEvent) => {
    e.preventDefault();
    if (!newDrugForm.genericName.trim()) return;

    const unit = newDrugForm.doseUnit;
    const generic = newDrugForm.genericName.trim();
    const newItem: FormularyDrug = {
      id: `custom_${Date.now()}`,
      tradeName: newDrugForm.tradeName.trim() || generic,
      genericName: generic,
      arabicName: newDrugForm.arabicName.trim() || generic,
      category: newDrugForm.category,
      diluent: newDrugForm.diluent,
      prepInstructions: newDrugForm.prepInstructions,
      finalConcMgMl: Math.max(0.001, Number(newDrugForm.finalConcMgMl) || 1),
      doseUnit: unit,
      highAlert: newDrugForm.highAlert,
      route: newDrugForm.route,
      stability: newDrugForm.stability,
      reference: newDrugForm.reference,
      isCustom: true,
      presets: [
        {
          id: 'std',
          label: `${newDrugForm.presetLabel} (${newDrugForm.doseMgPerKg} ${unit}/kg)`,
          doseMgPerKg: Number(newDrugForm.doseMgPerKg) || 1,
          maxSingleMg: Number(newDrugForm.maxSingleMg) || 1000,
          frequency: newDrugForm.frequency,
        },
      ],
    };

    setFormulary((prev) => [newItem, ...prev]);
    setNewDrugForm({
      ...INITIAL_NEW_DRUG_FORM,
      category: newDrugForm.category,
    });
    setIsQuickAddModalOpen(false);
    const { ok, error } = await upsertMedicationToSupabase(newItem);
    if (ok) {
      logActivity(
        session,
        'ADD_MEDICATION',
        `إضافة دواء جديد: ${newItem.genericName} (${newItem.finalConcMgMl} ${newItem.doseUnit}/mL)`
      );
      showToast(`تم حفظ "${newItem.genericName}" في قاعدة بيانات Supabase.`);
    } else {
      showToast(`تعذر الحفظ على Supabase: ${error}`);
    }
  };

  const handleExportMasterJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(formulary, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `PediaSurgRx_Master_Formulary_${formulary.length}_Drugs.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleImportMasterFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const text = String(ev.target?.result || '');
      try {
        let toImport: FormularyDrug[] = [];
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].finalConcMgMl) {
            toImport = parsed.map(normalizeFormularyDrug);
          } else {
            showToast('صيغة ملف JSON غير صحيحة.');
            return;
          }
        } else {
          toImport = parseFormularyCsv(text);
        }

        if (toImport.length === 0) {
          showToast('لم يتم العثور على أدوية صالحة في الملف.');
          return;
        }

        const { ok, error } = await bulkUpsertMedicationsToSupabase(toImport);
        if (ok) {
          await loadCloudData();
          logActivity(session, 'BULK_IMPORT', `استيراد ${toImport.length} دواء إلى Supabase`);
          showToast(`تم استيراد ورفع ${toImport.length} دواء إلى Supabase بنجاح!`);
        } else {
          showToast(`تعذر الرفع إلى Supabase: ${error}`);
        }
      } catch {
        showToast('حدث خطأ أثناء قراءة الملف.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleLogout = async () => {
    if (activePatientId && !isReadOnlyLock) {
      await releasePatientLock(activePatientId);
    }
    await logActivity(session, 'LOGOUT', 'تسجيل خروج من المنصة');
    await signOutSupabase();
    setSession(null);
  };

  const handleSaveToCloud = async () => {
    if (!activePatientId || isReadOnlyLock) return;
    setIsSavingCloud(true);
    const { record, error } = await updatePatientInCloud(
      activePatientId,
      patient,
      patientRegimen
    );
    setIsSavingCloud(false);
    if (error || !record) {
      showToast(`تعذر الحفظ السحابي: ${error}`);
      return;
    }
    setSharedPatients((prev) =>
      prev.map((p) => (p.id === record.id ? record : p))
    );
    logActivity(
      session,
      'SAVE_PATIENT',
      `تحديث ملف المريض: ${record.patient_name} (${record.regimen.length} علاجات)`
    );
    showToast(`تم حفظ التعديلات في ملف "${record.patient_name}" بنجاح!`);
  };

  const handleDeleteSavedPatient = async (id: string) => {
    const ok = await deleteSavedPatient(id);
    if (ok) {
      setSharedPatients((prev) => prev.filter((p) => p.id !== id));
      logActivity(session, 'DELETE_PATIENT', `حذف ملف مريض (${id})`);
      showToast('تم حذف سجل المريض من السحابة.');
    }
  };

  const handleTabChange = async (nextTab: ActiveTab) => {
    if (nextTab === 'patients' && activePatientId) {
      await handleBackToPatients();
      return;
    }
    setActiveTab(nextTab);
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-teal-300 text-sm font-bold">
        جاري التحقق من الجلسة...
      </div>
    );
  }

  if (!session) {
    return <LoginPage onLoginSuccess={setSession} />;
  }

  const showPatientIntake =
    Boolean(activePatientId) &&
    (activeTab === 'regimen' || activeTab === 'autofill' || activeTab === 'labels');

  return (
    <div className="min-h-screen bg-[#F6F9FC] text-slate-900 font-sans pb-12">
      <HeaderNav
        formularyCount={formulary.length}
        autoFilledCount={autoFilledDrugs.length}
        regimenCount={computedPatientRegimen.length}
        stickersCount={allThermalStickers.length}
        activeTab={activeTab}
        hasActivePatient={Boolean(activePatientId)}
        isDark={isDark}
        session={session}
        onTabChange={handleTabChange}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        onLogout={handleLogout}
      />

      {configToast && (
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white px-4 py-2.5 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-md animate-fade-in-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{configToast}</span>
        </div>
      )}

      {showPatientIntake && (
        <PatientIntakeBar
          patient={patient}
          formularyCount={formulary.length}
          isReadOnly={isReadOnlyLock}
          lockedByName={lockedByName}
          isSavingCloud={isSavingCloud}
          onChange={setPatient}
          onBackToPatients={handleBackToPatients}
          onOpenPumpCalc={() => setIsPumpModalOpen(true)}
          onSaveToCloud={handleSaveToCloud}
        />
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {(formularyError || (!isLoadingFormulary && formulary.length === 0)) && (
          <div
            dir="rtl"
            className="mb-5 bg-amber-50 border border-amber-300 rounded-3xl p-5 flex flex-wrap items-center justify-between gap-4 text-amber-950 shadow-2xs"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <div className="font-extrabold text-sm">
                  قاعدة بيانات الأدوية على Supabase فارغة أو لم يتم تهيئتها بعد
                </div>
                <p>
                  {formularyError ? `خطأ: ${formularyError} — ` : ''}
                  قم بتشغيل ملفَي{' '}
                  <code className="font-mono bg-white px-1.5 py-0.5 rounded">
                    supabase/schema.sql
                  </code>{' '}
                  ثم{' '}
                  <code className="font-mono bg-white px-1.5 py-0.5 rounded">
                    supabase/seed_medications.sql
                  </code>{' '}
                  في Supabase SQL Editor.
                </p>
              </div>
            </div>
            <button
              onClick={loadCloudData}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>إعادة التحميل</span>
            </button>
          </div>
        )}

        <Suspense
          fallback={
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-sm font-bold text-slate-500 animate-pulse">
              جاري تحميل الواجهة...
            </div>
          }
        >
          <div key={activeTab} className="animate-fade-in-up">
            {activeTab === 'patients' && (
              <PatientsBoard
                patients={sharedPatients}
                currentUserId={session.userId}
                isAdmin={session.role === 'Admin'}
                isLoading={isLoadingFormulary}
                onRefresh={loadCloudData}
                onOpenPatient={handleOpenPatient}
                onCreatePatient={handleCreateNewPatient}
                onDeletePatient={handleDeleteSavedPatient}
                onForceUnlock={handleForceUnlock}
                onExportShiftCsv={handleExportShiftExcel}
              />
            )}

            {activeTab === 'autofill' && activePatientId && (
              <AutoFillTable
                formulary={formulary}
                autoFilledDrugs={autoFilledDrugs}
                categories={categories}
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
                showSelectedOnly={showSelectedOnly}
                regimenCount={patientRegimen.length}
                regimenDrugIds={regimenDrugIds}
                weightKg={patient.weightKg}
                addedFeedbackId={addedFeedbackId}
                isReadOnly={isReadOnlyLock}
                onSearchChange={setSearchQuery}
                onCategoryChange={setSelectedCategory}
                onToggleSelectedOnly={() => setShowSelectedOnly((prev) => !prev)}
                onOpenQuickAdd={() => setIsQuickAddModalOpen(true)}
                onOpenRegimenTab={() => setActiveTab('regimen')}
                onSelectPreset={(drug, newPresetId) => {
                  setSelectedPresetsByDrug((prev) => ({
                    ...prev,
                    [drug.id]: newPresetId,
                  }));
                  setInlineDoseOverrideByDrug((prev) => {
                    const copy = { ...prev };
                    delete copy[drug.id];
                    return copy;
                  });
                  const found = drug.presets.find((p) => p.id === newPresetId);
                  if (found) {
                    setSelectedFreqOverrideByDrug((prev) => ({
                      ...prev,
                      [drug.id]: found.frequency,
                    }));
                  }
                }}
                onInlineDoseChange={(drugId, val) =>
                  setInlineDoseOverrideByDrug((prev) => ({ ...prev, [drugId]: val }))
                }
                onInlineConcChange={(drugId, val) =>
                  setInlineConcOverrideByDrug((prev) => ({ ...prev, [drugId]: val }))
                }
                onFreqChange={(drugId, freq) =>
                  setSelectedFreqOverrideByDrug((prev) => ({ ...prev, [drugId]: freq }))
                }
                onAddDrug={handleAddDrugToPatientSheet}
              />
            )}

            {activeTab === 'regimen' && activePatientId && (
              <PatientRegimenSheet
                patient={patient}
                computedRegimen={computedPatientRegimen}
                stickersCount={allThermalStickers.length}
                isReadOnly={isReadOnlyLock}
                onGoToAutoFill={() => setActiveTab('autofill')}
                onExportCsv={handleExportPatientExcel}
                onGoToLabels={() => setActiveTab('labels')}
                onUpdateItem={handleUpdateRegimenItem}
                onRemoveItem={handleRemoveRegimenItem}
              />
            )}

            {activeTab === 'labels' && activePatientId && (
              <ThermalLabelsView
                stickers={allThermalStickers}
                stickerSize={stickerSize}
                onStickerSizeChange={setStickerSize}
                onGoToAutoFill={() => setActiveTab('autofill')}
              />
            )}

            {activeTab === 'config' && (
              <PrepStandardsView
                formulary={formulary}
                newDrugForm={newDrugForm}
                onNewDrugFormChange={setNewDrugForm}
                onAddNewDrug={handleAddNewFormularyDrug}
                onSaveDrugEdit={handleSaveMasterDrugEdit}
                onExportJson={handleExportMasterJson}
                onImportFile={handleImportMasterFile}
              />
            )}

            {activeTab === 'admin' && session.role === 'Admin' && (
              <AdminDashboard
                session={session}
                formularyCount={formulary.length}
                onLoadPatient={handleOpenPatient}
                onToast={showToast}
              />
            )}
          </div>
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <QuickAddModal
          isOpen={isQuickAddModalOpen}
          weightKg={patient.weightKg}
          newDrugForm={newDrugForm}
          onChange={setNewDrugForm}
          onClose={() => setIsQuickAddModalOpen(false)}
          onSubmit={handleAddNewFormularyDrug}
        />

        <InfusionPumpModal
          isOpen={isPumpModalOpen}
          weightKg={patient.weightKg}
          onClose={() => setIsPumpModalOpen(false)}
        />
      </Suspense>
    </div>
  );
}
