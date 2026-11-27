import { useMemo, useState, type FormEvent } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  FileSpreadsheet,
  Lock,
  LockOpen,
  Pill,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import type { AgeUnit, PatientInfo, SavedPatientRecord } from '../types/pharmacy';

interface PatientsBoardProps {
  patients: SavedPatientRecord[];
  currentUserId?: string;
  isAdmin: boolean;
  isLoading: boolean;
  onRefresh: () => void;
  onOpenPatient: (record: SavedPatientRecord) => void;
  onCreatePatient: (patient: PatientInfo) => Promise<void>;
  onDeletePatient: (id: string) => void;
  onForceUnlock: (id: string) => void;
  onExportShiftCsv: (filteredPatients: SavedPatientRecord[]) => void;
}

function isActivelyLockedByOther(
  rec: SavedPatientRecord,
  currentUserId?: string
): boolean {
  if (!rec.locked_by_user_id || rec.locked_by_user_id === currentUserId) {
    return false;
  }
  if (!rec.locked_at) return false;
  const ageMs = Date.now() - new Date(rec.locked_at).getTime();
  return ageMs < 2 * 60 * 1000;
}

export function PatientsBoard({
  patients,
  currentUserId,
  isAdmin,
  isLoading,
  onRefresh,
  onOpenPatient,
  onCreatePatient,
  onDeletePatient,
  onForceUnlock,
  onExportShiftCsv,
}: PatientsBoardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWard, setSelectedWard] = useState('All');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [newForm, setNewForm] = useState<PatientInfo>({
    fullName: '',
    mrn: '',
    ward: '',
    weightKg: 10,
    ageValue: '',
    ageUnit: 'years',
    renalImpairment: false,
    baseDate: new Date().toISOString().slice(0, 10),
    defaultStartTime: '12:00',
  });

  const wards = useMemo(() => {
    const set = new Set(
      patients.map((p) => (p.ward || 'General').trim() || 'General')
    );
    return ['All', ...Array.from(set)];
  }, [patients]);

  const filteredPatients = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return patients.filter((p) => {
      const wardLabel = (p.ward || 'General').trim() || 'General';
      if (selectedWard !== 'All' && wardLabel !== selectedWard) return false;
      if (!q) return true;
      return (
        p.patient_name.toLowerCase().includes(q) ||
        p.mrn.toLowerCase().includes(q) ||
        wardLabel.toLowerCase().includes(q)
      );
    });
  }, [patients, searchQuery, selectedWard]);

  const handleCreateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newForm.fullName.trim()) return;
    setIsCreating(true);
    await onCreatePatient(newForm);
    setIsCreating(false);
    setIsNewModalOpen(false);
    setNewForm({
      fullName: '',
      mrn: '',
      ward: '',
      weightKg: 10,
      ageValue: '',
      ageUnit: 'years',
      renalImpairment: false,
      baseDate: new Date().toISOString().slice(0, 10),
      defaultStartTime: '12:00',
    });
  };

  return (
    <div className="space-y-5">
      {/* Top Toolbar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_2px_16px_rgba(15,23,42,0.03)] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-600/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                ملفات مرضى الوردية ({patients.length})
              </h2>
              <p className="text-xs text-slate-500" dir="rtl">
                اختر أي مريض للدخول على علاجاته أو إضافة أوامر جديدة — الملفات مشتركة مع قفل تلقائي لمنع التضارب
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="px-3.5 py-2.5 rounded-2xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>تحديث</span>
            </button>

            <button
              onClick={() => onExportShiftCsv(filteredPatients)}
              disabled={filteredPatients.length === 0}
              className="px-4 py-2.5 rounded-2xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-sm flex items-center gap-1.5 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>تصدير شيت الوردية ({filteredPatients.length})</span>
            </button>

            <button
              onClick={() => setIsNewModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl text-xs font-extrabold bg-slate-900 hover:bg-slate-800 text-white shadow-sm flex items-center gap-1.5 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-sky-400" />
              <span>+ مريض جديد</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              dir="rtl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم المريض، رقم الملف (MRN)، أو القسم..."
              className="w-full pl-10 pr-8 py-2.5 text-sm bg-slate-50/80 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {wards.map((ward) => (
              <button
                key={ward}
                onClick={() => setSelectedWard(ward)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedWard === ward
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {ward}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Patient Cards Grid */}
      {isLoading ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-sm font-bold text-slate-500 animate-pulse">
          جاري تحميل ملفات المرضى من Supabase...
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-3">
          <p className="text-slate-500 font-semibold text-sm" dir="rtl">
            لا توجد ملفات مرضى مطابقة حالياً. أضف أول مريض للوردية لبدء تجهيز العلاجات.
          </p>
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مريض جديد</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map((rec) => {
            const lockedByOther = isActivelyLockedByOther(rec, currentUserId);
            const medCount = rec.regimen?.length || 0;
            const isNeonate =
              rec.age_unit === 'days' &&
              Number(rec.age_value) > 0 &&
              Number(rec.age_value) <= 28;

            return (
              <div
                key={rec.id}
                className={`group bg-white rounded-3xl border p-5 shadow-[0_2px_16px_rgba(15,23,42,0.03)] transition-all duration-200 flex flex-col justify-between gap-4 ${
                  lockedByOther
                    ? 'border-amber-300/90 bg-amber-50/20'
                    : 'border-slate-200/80 hover:border-sky-400 hover:shadow-[0_8px_28px_rgba(13,148,136,0.08)] hover:-translate-y-0.5'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                      {rec.ward || 'General'}
                    </span>

                    {lockedByOther ? (
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300"
                        dir="rtl"
                      >
                        <Lock className="w-3 h-3" />
                        <span>يعمل عليه: {rec.locked_by_name || 'صيدلي آخر'}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>متاح</span>
                      </span>
                    )}
                  </div>

                  {/* Name & MRN */}
                  <div>
                    <h3
                      dir="rtl"
                      className="text-base font-extrabold text-slate-900 leading-snug truncate"
                    >
                      {rec.patient_name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 font-mono">
                      <span>MRN: {rec.mrn || '—'}</span>
                      <span>•</span>
                      <span className="font-extrabold text-sky-700">
                        {rec.weight_kg} kg
                      </span>
                    </div>
                  </div>

                  {/* Clinical Tags */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200/70">
                      <Pill className="w-3.5 h-3.5" />
                      <span>{medCount} علاجات</span>
                    </span>

                    {isNeonate && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-xl text-[11px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                        <AlertTriangle className="w-3 h-3" />
                        NICU
                      </span>
                    )}

                    {rec.renal_impairment && (
                      <span className="px-2 py-1 rounded-xl text-[11px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
                        Renal
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenPatient(rec)}
                    className={`flex-1 py-2.5 px-4 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      lockedByOther
                        ? 'bg-amber-100 hover:bg-amber-200 text-amber-950'
                        : 'bg-sky-600 hover:bg-sky-700 text-white shadow-xs'
                    }`}
                  >
                    <span>
                      {lockedByOther ? 'عرض فقط (Read-Only)' : 'فتح ملف المريض'}
                    </span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>

                  {isAdmin && lockedByOther && (
                    <button
                      onClick={() => onForceUnlock(rec.id)}
                      className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 cursor-pointer"
                      title="فك القفل (Admin)"
                    >
                      <LockOpen className="w-4 h-4" />
                    </button>
                  )}

                  {(isAdmin || rec.user_id === currentUserId) && !lockedByOther && (
                    <button
                      onClick={() => onDeletePatient(rec.id)}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200/70 cursor-pointer transition-colors"
                      title="حذف ملف المريض"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Patient Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  + إضافة ملف مريض جديد للوردية
                </h3>
                <p className="text-xs text-slate-500" dir="rtl">
                  سيتم فتح ملف المريض فوراً لتجهيز علاجاته
                </p>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1" dir="rtl">
                  اسم المريض بالكامل*
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  dir="rtl"
                  value={newForm.fullName}
                  onChange={(e) => setNewForm({ ...newForm, fullName: e.target.value })}
                  placeholder="مثال: براء محمد عبدالسلام"
                  className="w-full p-2.5 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    MRN / ID
                  </label>
                  <input
                    type="text"
                    value={newForm.mrn}
                    onChange={(e) => setNewForm({ ...newForm, mrn: e.target.value })}
                    placeholder="20234098"
                    className="w-full p-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Ward / القسم
                  </label>
                  <input
                    type="text"
                    value={newForm.ward}
                    onChange={(e) => setNewForm({ ...newForm, ward: e.target.value })}
                    placeholder="PICU / قسطرة"
                    className="w-full p-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-sky-700 mb-1">
                    Weight (kg)*
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.3"
                    required
                    value={newForm.weightKg}
                    onChange={(e) => setNewForm({ ...newForm, weightKg: e.target.value })}
                    className="w-full p-2 text-sm font-mono font-black bg-sky-50 border-2 border-sky-500 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs">
                  <span className="font-bold text-slate-500">Age:</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="—"
                    value={newForm.ageValue ?? ''}
                    onChange={(e) => setNewForm({ ...newForm, ageValue: e.target.value })}
                    className="w-12 bg-transparent font-mono font-bold outline-none"
                  />
                  <select
                    value={newForm.ageUnit || 'years'}
                    onChange={(e) =>
                      setNewForm({ ...newForm, ageUnit: e.target.value as AgeUnit })
                    }
                    className="bg-transparent font-bold outline-none"
                  >
                    <option value="days">Days</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(newForm.renalImpairment)}
                    onChange={(e) =>
                      setNewForm({ ...newForm, renalImpairment: e.target.checked })
                    }
                    className="rounded border-slate-300"
                  />
                  <span>قصور كلوي</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold bg-slate-100 text-slate-700 rounded-xl cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-5 py-2 text-xs font-extrabold bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white rounded-xl cursor-pointer"
                >
                  {isCreating ? 'جاري الإنشاء...' : 'إنشاء وفتح الملف'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
