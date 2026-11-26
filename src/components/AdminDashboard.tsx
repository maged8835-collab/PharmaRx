import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Download,
  FileSpreadsheet,
  Pill,
  RefreshCw,
  Search,
  Shield,
  UserCheck,
  UserX,
  Users,
} from 'lucide-react';
import type {
  ActivityLogRecord,
  PharmacistSession,
  SavedPatientRecord,
  UserProfileRecord,
} from '../types/pharmacy';
import { escapeCsvCell } from '../utils/calculations';
import {
  fetchActivityLogs,
  fetchAllPatientsAdmin,
  fetchAllProfiles,
  logActivity,
  updateUserProfile,
} from '../utils/cloudSync';

interface AdminDashboardProps {
  session: PharmacistSession;
  formularyCount: number;
  onLoadPatient: (record: SavedPatientRecord) => void;
  onToast: (msg: string) => void;
}

export function AdminDashboard({
  session,
  formularyCount,
  onLoadPatient,
  onToast,
}: AdminDashboardProps) {
  const [subTab, setSubTab] = useState<'logs' | 'users' | 'patients'>('logs');
  const [profiles, setProfiles] = useState<UserProfileRecord[]>([]);
  const [logs, setLogs] = useState<ActivityLogRecord[]>([]);
  const [allPatients, setAllPatients] = useState<SavedPatientRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [logSearch, setLogSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    const [p, l, pts] = await Promise.all([
      fetchAllProfiles(),
      fetchActivityLogs(200),
      fetchAllPatientsAdmin(100),
    ]);
    setProfiles(p);
    setLogs(l);
    setAllPatients(pts);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const actionTypes = useMemo(() => {
    const set = new Set(logs.map((l) => l.action));
    return ['ALL', ...Array.from(set)];
  }, [logs]);

  const filteredLogs = useMemo(() => {
    const q = logSearch.toLowerCase().trim();
    return logs.filter((l) => {
      if (actionFilter !== 'ALL' && l.action !== actionFilter) return false;
      if (!q) return true;
      return (
        l.user_email.toLowerCase().includes(q) ||
        l.user_name.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q)
      );
    });
  }, [logs, logSearch, actionFilter]);

  const handleToggleRole = async (user: UserProfileRecord) => {
    if (user.id === session.userId) {
      onToast('لا يمكنك تغيير صلاحيتك الخاصة.');
      return;
    }
    const nextRole = user.role === 'admin' ? 'pharmacist' : 'admin';
    const { ok, error } = await updateUserProfile(user.id, { role: nextRole });
    if (ok) {
      setProfiles((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: nextRole } : u))
      );
      await logActivity(
        session,
        'ADMIN_UPDATE_USER',
        `تغيير صلاحية ${user.email} إلى ${nextRole}`
      );
      onToast(`تم تغيير صلاحية ${user.display_name} إلى ${nextRole}.`);
    } else {
      onToast(`تعذر التعديل: ${error}`);
    }
  };

  const handleToggleActive = async (user: UserProfileRecord) => {
    if (user.id === session.userId) {
      onToast('لا يمكنك تعطيل حسابك الحالي.');
      return;
    }
    const nextActive = !user.is_active;
    const { ok, error } = await updateUserProfile(user.id, { is_active: nextActive });
    if (ok) {
      setProfiles((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, is_active: nextActive } : u))
      );
      await logActivity(
        session,
        'ADMIN_UPDATE_USER',
        `${nextActive ? 'تفعيل' : 'إيقاف'} حساب ${user.email}`
      );
      onToast(`تم ${nextActive ? 'تفعيل' : 'إيقاف'} حساب ${user.display_name}.`);
    } else {
      onToast(`تعذر التعديل: ${error}`);
    }
  };

  const handleExportLogsCsv = () => {
    const headers = ['Timestamp', 'User Name', 'Email', 'Action', 'Details'];
    const rows = filteredLogs.map((l) =>
      [
        escapeCsvCell(new Date(l.created_at).toLocaleString()),
        escapeCsvCell(l.user_name),
        escapeCsvCell(l.user_email),
        escapeCsvCell(l.action),
        escapeCsvCell(l.details),
      ].join(',')
    );
    const csv = '\uFEFF' + [headers.map(escapeCsvCell).join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PediaSurgRx_Activity_Logs_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-[0_2px_16px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Users</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-2">
            {profiles.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {profiles.filter((p) => p.is_active).length} active accounts
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-[0_2px_16px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Formulary</span>
            <Pill className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-2">
            {formularyCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Cloud medications</div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-[0_2px_16px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Saved Patients</span>
            <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-2">
            {allPatients.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Hospital-wide</div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-[0_2px_16px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Audit Logs</span>
            <Activity className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-2">
            {logs.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Recent events</div>
        </div>
      </div>

      {/* Sub-navigation & Refresh */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-[0_2px_16px_rgba(15,23,42,0.03)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setSubTab('logs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              subTab === 'logs'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-teal-600" />
            <span>سجل النشاطات (Logs)</span>
          </button>
          <button
            onClick={() => setSubTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              subTab === 'users'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            <span>إدارة الصيادلة ({profiles.length})</span>
          </button>
          <button
            onClick={() => setSubTab('patients')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              subTab === 'patients'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>كل المرضى ({allPatients.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {subTab === 'logs' && (
            <button
              onClick={handleExportLogsCsv}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Logs CSV</span>
            </button>
          )}
          <button
            onClick={refreshAll}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>تحديث</span>
          </button>
        </div>
      </div>

      {/* Sub-tab 1: Activity Logs */}
      {subTab === 'logs' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_2px_16px_rgba(15,23,42,0.03)] overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                placeholder="ابحث بالاسم، البريد، نوع العملية، أو التفاصيل..."
                className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500"
              />
            </div>

            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl outline-none"
            >
              {actionTypes.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto max-h-[550px]">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 sticky top-0">
                <tr>
                  <th className="py-3 px-4 font-bold">Time</th>
                  <th className="py-3 px-4 font-bold">Pharmacist</th>
                  <th className="py-3 px-4 font-bold">Action</th>
                  <th className="py-3 px-4 font-bold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{log.user_name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {log.user_email}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-teal-50 text-teal-800 border border-teal-200 font-mono">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700" dir="auto">
                      {log.details}
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-slate-400 font-semibold">
                      لا توجد سجلات مطابقة.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-tab 2: User Management */}
      {subTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_2px_16px_rgba(15,23,42,0.03)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Pharmacist</th>
                  <th className="py-3 px-4 font-bold">Role</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Joined</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {profiles.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{user.display_name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {user.email}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          user.role === 'admin'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <Shield className="w-3 h-3" />
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          user.is_active
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {user.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleRole(user)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 font-bold cursor-pointer"
                      >
                        {user.role === 'admin' ? 'Make Pharmacist' : 'Make Admin'}
                      </button>
                      <button
                        onClick={() => handleToggleActive(user)}
                        className={`px-2.5 py-1.5 rounded-lg font-bold inline-flex items-center gap-1 cursor-pointer ${
                          user.is_active
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {user.is_active ? (
                          <>
                            <UserX className="w-3.5 h-3.5" />
                            <span>إيقاف</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>تفعيل</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-tab 3: All Hospital Patients */}
      {subTab === 'patients' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_2px_16px_rgba(15,23,42,0.03)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Patient</th>
                  <th className="py-3 px-4 font-bold">MRN / Ward</th>
                  <th className="py-3 px-4 font-bold">Weight</th>
                  <th className="py-3 px-4 font-bold">Medications</th>
                  <th className="py-3 px-4 font-bold">Updated</th>
                  <th className="py-3 px-4 font-bold text-right">Load</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allPatients.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-bold text-slate-900" dir="rtl">
                      {rec.patient_name}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {rec.mrn || '—'} • {rec.ward || '—'}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-teal-700">
                      {rec.weight_kg} kg
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {rec.regimen?.length || 0} drugs
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {new Date(rec.updated_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onLoadPatient(rec)}
                        className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold cursor-pointer"
                      >
                        فتح الشيت
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
