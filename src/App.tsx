import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { AutoFillTable } from './components/AutoFillTable';
import { HeaderNav } from './components/HeaderNav';
import { LoginPage } from './components/LoginPage';
import { PatientIntakeBar, type DemoCaseType } from './components/PatientIntakeBar';
import { PatientRegimenSheet } from './components/PatientRegimenSheet';
import { PrepStandardsView } from './components/PrepStandardsView';
import { QuickAddModal } from './components/QuickAddModal';
import { ThermalLabelsView } from './components/ThermalLabelsView';
import { INITIAL_PHARMACY_FORMULARY } from './data/formulary';
import type {
  ActiveTab,
  AutoFilledDrug,
  FormularyDrug,
  FrequencyKey,
  LabelNameMode,
  NewDrugFormState,
  PatientInfo,
  PharmacistSession,
  RegimenItem,
  StickerSize,
} from './types/pharmacy';
import { clearSession, loadSession, saveSession } from './utils/auth';
import {
  buildPatientRegimenCsv,
  buildThermalStickers,
  computeAutoFilledDrug,
  computePatientRegimen,
  parseFormularyCsv,
  sanitizeWeightKg,
} from './utils/calculations';
import {
  loadFormulary,
  loadPatient,
  loadRegimen,
  normalizeFormularyDrug,
  saveFormulary,
  savePatient,
  saveRegimen,
} from './utils/storage';

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
  const [session, setSession] = useState<PharmacistSession | null>(() => loadSession());
  const [formulary, setFormulary] = useState<FormularyDrug[]>(() =>
    loadFormulary(INITIAL_PHARMACY_FORMULARY)
  );
  const [patient, setPatient] = useState<PatientInfo>(() => loadPatient());
  const [patientRegimen, setPatientRegimen] = useState<RegimenItem[]>(() => loadRegimen());

  useEffect(() => {
    saveFormulary(formulary);
  }, [formulary]);

  useEffect(() => {
    savePatient(patient);
  }, [patient]);

  useEffect(() => {
    saveRegimen(patientRegimen);
  }, [patientRegimen]);

  const [activeTab, setActiveTab] = useState<ActiveTab>('autofill');
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

  const [labelNameMode, setLabelNameMode] = useState<LabelNameMode>('trade');
  const [stickerSize, setStickerSize] = useState<StickerSize>('60x40');
  const [addedFeedbackId, setAddedFeedbackId] = useState<string | null>(null);
  const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState(false);
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
          drug.tradeName.toLowerCase().includes(q) ||
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
    () => buildThermalStickers(computedPatientRegimen, patient, labelNameMode),
    [computedPatientRegimen, patient, labelNameMode]
  );

  const handleAddDrugToPatientSheet = (calculatedDrug: AutoFilledDrug) => {
    const newEntry: RegimenItem = {
      regimenId: `${calculatedDrug.id}_${Date.now()}`,
      drugId: calculatedDrug.id,
      tradeName: calculatedDrug.tradeName,
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
    setPatientRegimen((prev) =>
      prev.map((item) => (item.regimenId === regimenId ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveRegimenItem = (regimenId: string) => {
    setPatientRegimen((prev) => prev.filter((item) => item.regimenId !== regimenId));
  };

  const handleClearPatient = () => {
    const todayIso = new Date().toISOString().slice(0, 10);
    setPatient({
      fullName: '',
      mrn: '',
      ward: '',
      weightKg: 10,
      baseDate: todayIso,
      defaultStartTime: '12:00',
    });
    setPatientRegimen([]);
  };

  const loadDemoCase = (caseType: DemoCaseType) => {
    if (caseType === 'baraa') {
      setPatient({
        fullName: 'براء محمد عبدالسلام عبدالحميد',
        mrn: '20234098',
        ward: 'قسطرة',
        weightKg: 21,
        baseDate: '2026-11-22',
        defaultStartTime: '12:00',
      });
      setPatientRegimen([
        {
          regimenId: 'demo_ketolac_1',
          drugId: 'ketolac',
          tradeName: 'Ketolac',
          genericName: 'Ketorolac Tromethamine',
          doseMgPerKg: 0.5,
          maxSingleMg: 30,
          finalConcMgMl: 15,
          doseUnit: 'mg',
          route: 'IV Shot',
          diluent: '0.9% NS',
          prepInstructions: 'Dilute 30 mg (1 mL) + 1 mL 0.9% NS -> Total 2 mL (15 mg/mL)',
          frequency: 'q12h',
          startTime: '12:00',
          stability: '24h RT',
          reference: 'Lexidrug / BNFc',
        },
      ]);
    } else if (caseType === 'mohamed') {
      setPatient({
        fullName: 'محمد علي رجب محمد جابر',
        mrn: '20248000',
        ward: 'WARD',
        weightKg: 36,
        baseDate: '2026-11-22',
        defaultStartTime: '12:00',
      });
      setPatientRegimen([
        {
          regimenId: 'demo_ketolac_2',
          drugId: 'ketolac',
          tradeName: 'Ketolac',
          genericName: 'Ketorolac Tromethamine',
          doseMgPerKg: 0.5,
          maxSingleMg: 30,
          finalConcMgMl: 15,
          doseUnit: 'mg',
          route: 'IV Shot',
          diluent: '0.9% NS',
          prepInstructions: 'Dilute 30 mg (1 mL) + 1 mL 0.9% NS -> Total 2 mL (15 mg/mL)',
          frequency: 'q12h',
          startTime: '12:00',
          stability: '24h RT',
          reference: 'Lexidrug / BNFc',
        },
      ]);
    } else if (caseType === 'fares_vanco') {
      setPatient({
        fullName: 'فارس محمود (حالة Vancomycin 36 kg)',
        mrn: '20261109',
        ward: 'WARD',
        weightKg: 36,
        baseDate: '2026-11-22',
        defaultStartTime: '13:00',
      });
      setPatientRegimen([
        {
          regimenId: 'demo_vanco_1',
          drugId: 'vancocin',
          tradeName: 'Vancocin',
          genericName: 'Vancomycin',
          doseMgPerKg: 20,
          maxSingleMg: 1000,
          finalConcMgMl: 5,
          doseUnit: 'mg',
          route: 'IV Infusion',
          diluent: '0.9% NS / D5W',
          prepInstructions: '500 mg in 100 mL NS/D5W -> 5 mg/mL (Infuse over 60-90 min)',
          frequency: 'q8h',
          startTime: '13:00',
          stability: '24h RT | 14d Fridge at 5 mg/mL',
          reference: 'Lexidrug / ASHP IDSA',
        },
      ]);
    } else if (caseType === 'lasix_3kg') {
      setPatient({
        fullName: 'يوسف أحمد (حالة Lasix 3 kg)',
        mrn: '20263001',
        ward: 'PICU',
        weightKg: 3,
        baseDate: '2026-11-22',
        defaultStartTime: '12:00',
      });
      setPatientRegimen([
        {
          regimenId: 'demo_lasix_3kg',
          drugId: 'lasix',
          tradeName: 'Lasix',
          genericName: 'Furosemide',
          doseMgPerKg: 1,
          maxSingleMg: 40,
          finalConcMgMl: 2,
          doseUnit: 'mg',
          route: 'IV Shot',
          diluent: '0.9% NS',
          prepInstructions: 'Dilute 20 mg (2 mL) + 8 mL 0.9% NS -> Total 10 mL (2 mg/mL)',
          frequency: 'q12h',
          startTime: '12:00',
          stability: '24h RT; protect from light',
          reference: 'Lexidrug / Trissel’s',
        },
      ]);
    }
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
  };

  const handleSaveMasterDrugEdit = (
    drugId: string,
    updates: {
      finalConcMgMl: number;
      diluent: string;
      prepInstructions: string;
      stability: string;
    }
  ) => {
    setFormulary((prev) =>
      prev.map((d) => (d.id === drugId ? { ...d, ...updates } : d))
    );
    showToast('تم حفظ تعديل التركيز القياسي وتحديث جميع الحسابات تلقائياً.');
  };

  const handleAddNewFormularyDrug = (e: FormEvent) => {
    e.preventDefault();
    if (!newDrugForm.tradeName.trim() || !newDrugForm.genericName.trim()) return;

    const unit = newDrugForm.doseUnit;
    const newItem: FormularyDrug = {
      id: `custom_${Date.now()}`,
      tradeName: newDrugForm.tradeName.trim(),
      genericName: newDrugForm.genericName.trim(),
      arabicName: newDrugForm.arabicName.trim() || newDrugForm.tradeName.trim(),
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
    showToast(
      `تم إضافة "${newItem.tradeName} (${newItem.genericName})" وحساب جرعته لوزن ${patient.weightKg} كجم.`
    );
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
    reader.onload = (ev) => {
      const text = String(ev.target?.result || '');
      try {
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].finalConcMgMl) {
            setFormulary(parsed.map(normalizeFormularyDrug));
            showToast(`تم استيراد ${parsed.length} دواء من ملف JSON بنجاح!`);
          } else {
            showToast('صيغة ملف JSON غير صحيحة.');
          }
        } else {
          const importedDrugs = parseFormularyCsv(text);
          if (importedDrugs.length > 0) {
            setFormulary((prev) => [...importedDrugs, ...prev]);
            showToast(`تم استيراد وإضافة ${importedDrugs.length} دواء من ملف CSV بنجاح!`);
          } else {
            showToast('لم يتم العثور على صفوف صالحة في ملف CSV.');
          }
        }
      } catch {
        showToast('حدث خطأ أثناء قراءة الملف.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleLoginSuccess = (newSession: PharmacistSession, remember: boolean) => {
    saveSession(newSession, remember);
    setSession(newSession);
  };

  const handleLogout = () => {
    clearSession();
    setSession(null);
  };

  if (!session) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
      <HeaderNav
        formularyCount={formulary.length}
        autoFilledCount={autoFilledDrugs.length}
        regimenCount={computedPatientRegimen.length}
        stickersCount={allThermalStickers.length}
        activeTab={activeTab}
        session={session}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />

      {configToast && (
        <div className="bg-emerald-800 text-white px-4 py-2.5 text-xs font-bold text-center flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{configToast}</span>
        </div>
      )}

      <PatientIntakeBar
        patient={patient}
        formularyCount={formulary.length}
        onChange={setPatient}
        onLoadDemoCase={loadDemoCase}
        onClearPatient={handleClearPatient}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'autofill' && (
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
            onSearchChange={setSearchQuery}
            onCategoryChange={setSelectedCategory}
            onToggleSelectedOnly={() => setShowSelectedOnly((prev) => !prev)}
            onOpenQuickAdd={() => setIsQuickAddModalOpen(true)}
            onOpenRegimenTab={() => setActiveTab('regimen')}
            onSelectPreset={(drug, newPresetId) => {
              setSelectedPresetsByDrug((prev) => ({ ...prev, [drug.id]: newPresetId }));
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

        {activeTab === 'regimen' && (
          <PatientRegimenSheet
            patient={patient}
            computedRegimen={computedPatientRegimen}
            stickersCount={allThermalStickers.length}
            onGoToAutoFill={() => setActiveTab('autofill')}
            onExportCsv={handleExportPatientExcel}
            onGoToLabels={() => setActiveTab('labels')}
            onUpdateItem={handleUpdateRegimenItem}
            onRemoveItem={handleRemoveRegimenItem}
          />
        )}

        {activeTab === 'labels' && (
          <ThermalLabelsView
            stickers={allThermalStickers}
            stickerSize={stickerSize}
            labelNameMode={labelNameMode}
            onStickerSizeChange={setStickerSize}
            onLabelNameModeChange={setLabelNameMode}
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
            onResetDefault={() => {
              setFormulary(INITIAL_PHARMACY_FORMULARY);
              showToast(
                `تم استعادة الموسوعة الافتراضية (${INITIAL_PHARMACY_FORMULARY.length} دواء).`
              );
            }}
          />
        )}
      </main>

      <QuickAddModal
        isOpen={isQuickAddModalOpen}
        weightKg={patient.weightKg}
        newDrugForm={newDrugForm}
        onChange={setNewDrugForm}
        onClose={() => setIsQuickAddModalOpen(false)}
        onSubmit={handleAddNewFormularyDrug}
      />
    </div>
  );
}
