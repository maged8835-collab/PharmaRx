import { useMemo } from 'react';
import { BookOpen, CheckCircle2, ExternalLink, FileCheck2, ShieldAlert } from 'lucide-react';
import type { FormularyDrug } from '../types/pharmacy';

interface ReferencesViewProps {
  formulary: FormularyDrug[];
}

interface ClinicalReferenceItem {
  id: string;
  title: string;
  edition: string;
  scope: string;
  arabicSummary: string;
  url?: string;
  badge: string;
}

const CORE_REFERENCES: ClinicalReferenceItem[] = [
  {
    id: 'lexidrug',
    title: 'Lexidrug (Lexicomp) Pediatric & Neonatal Dosage Handbook',
    edition: 'Pediatric & Neonatal Reference',
    scope: 'Weight-based dosing (mg/kg, mcg/kg), adult max single-dose caps, standard IV dilutions & stability',
    arabicSummary: 'المرجع الأساسي لجرعات الأطفال وحديثي الولادة والحد الأقصى للجرعة الواحدة والتخفيف الوريدي.',
    url: 'https://www.wolterskluwer.com/en/solutions/lexicomp',
    badge: 'Dosing & Dilution',
  },
  {
    id: 'bnfc',
    title: 'BNF for Children (BNFc)',
    edition: 'British National Formulary for Children',
    scope: 'Pediatric antimicrobials, analgesia, GI, neurology dosing intervals & age-band precautions',
    arabicSummary: 'مرجع معتمد لجرعات المضادات الحيوية والمسكنات وأدوية الأعصاب والجهاز الهضمي للأطفال.',
    url: 'https://bnfc.nice.org.uk/',
    badge: 'Pediatric Formulary',
  },
  {
    id: 'trissels',
    title: 'ASHP Injectable Drug Information (Trissel’s)',
    edition: 'IV Compatibility & Stability Reference',
    scope: 'Y-site physical compatibility, diluent selection (NS vs D5W), 24-hour room/fridge stability',
    arabicSummary: 'المرجع القياسي لفحص التوافق الوريدي (Y-Site Compatibility) واختيار المذيب وثبات التحضير.',
    url: 'https://www.ashp.org/',
    badge: 'IV Compatibility',
  },
  {
    id: 'ismp',
    title: 'ISMP List of High-Alert Medications in Pediatric & Acute Care',
    edition: 'Institute for Safe Medication Practices',
    scope: 'High-Alert identification (KCl, Insulin, Heparin, Vasopressors, Opioids) & Active-Ingredient LASA safety',
    arabicSummary: 'معايير تمييز الأدوية عالية الخطورة (HIGH-ALERT) ومنع أخطاء تشابه الأسماء باستخدام المادة الفعالة فقط.',
    url: 'https://www.ismp.org/',
    badge: 'Medication Safety',
  },
  {
    id: 'pals',
    title: 'AHA Pediatric Advanced Life Support (PALS)',
    edition: 'American Heart Association Guidelines',
    scope: 'Pediatric cardiac arrest, emergency bolus dosing (Epinephrine, Amiodarone, CaCl2, Adenosine, NaHCO3)',
    arabicSummary: 'بروتوكولات الطوارئ والإنعاش القلبي الرئوي للأطفال.',
    url: 'https://cpr.heart.org/',
    badge: 'Emergency / PICU',
  },
  {
    id: 'neofax',
    title: 'Schwartz Bedside eGFR & Neonatal NICU Guardrails',
    edition: 'Clinical Renal & Neonatal Formulas',
    scope: 'NICU ≤28 days contraindications (Ceftriaxone, Ketorolac) & renal clearance drug flags',
    arabicSummary: 'ضوابط حديثي الولادة (≤ 28 يوم) وتنبيهات الأدوية التي تُطرح كلوياً وتحتاج تعديل الجرعة.',
    badge: 'NICU & Renal',
  },
  {
    id: 'rxnorm',
    title: 'U.S. National Library of Medicine (NLM) — RxNorm API',
    edition: 'NIH / Lister Hill National Center',
    scope: 'Standardized global Active Ingredient terminology (RxCUI) used in medication lookup & import',
    arabicSummary: 'موسوعة المصطلحات الدوائية القياسية العالمية (RxNorm / RxCUI) لجلب الأسماء العلمية المعتمدة للأدوية.',
    url: 'https://lhncbc.nlm.nih.gov/RxNav/APIs/index.html',
    badge: 'Global Terminology API',
  },
];

export function ReferencesView({ formulary }: ReferencesViewProps) {
  const referenceStats = useMemo(() => {
    const counts = new Map<string, number>();
    for (const d of formulary) {
      const ref = (d.reference || 'Unspecified').trim();
      counts.set(ref, (counts.get(ref) || 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [formulary]);

  return (
    <div className="space-y-5">
      {/* Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_2px_16px_rgba(15,23,42,0.03)] p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-600/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Clinical References &amp; Evidence Base
            </h2>
            <p className="text-xs text-slate-500" dir="rtl">
              المراجع العلمية والطبية المعتمدة التي بُنيت عليها حسابات المنصة وبروتوكولات التحضير الوريدي
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200">
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>{formulary.length} Active Formulary Records</span>
        </span>
      </div>

      {/* Clinical Disclaimer */}
      <div
        dir="rtl"
        className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex items-start gap-3 text-amber-950 shadow-2xs"
      >
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1 leading-relaxed">
          <div className="font-extrabold text-sm">
            إخلاء المسؤولية الإكلينيكية (Clinical Disclaimer)
          </div>
          <p>
            هذه المنصة أداة مساعدة للصيادلة الإكلينيكيين لتسريع الحسابات الوريدية وتقليل الأخطاء اليدوية، ولا تغني عن التقييم الإكلينيكي أو مراجعة بروتوكول المستشفى المعتمد، خاصة في حالات حديثي الولادة (NICU)، القصور الكلوي أو الكبدي، والتسريب الوريدي المركزي مقابل الطرفي.
          </p>
          <p className="text-[11px] text-amber-800/90 pt-1" dir="ltr">
            This product uses publicly available data from the U.S. National Library of Medicine (NLM), National Institutes of Health, Department of Health and Human Services; NLM is not responsible for the product and does not endorse or recommend this or any other product.
          </p>
        </div>
      </div>

      {/* Core References Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CORE_REFERENCES.map((ref) => (
          <div
            key={ref.id}
            className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-[0_2px_16px_rgba(15,23,42,0.03)] space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                  {ref.badge}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  {ref.edition}
                </span>
              </div>

              <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                {ref.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                {ref.scope}
              </p>

              <p className="text-xs text-slate-700 font-medium bg-slate-50 rounded-xl px-3 py-2 border border-slate-100" dir="rtl">
                {ref.arabicSummary}
              </p>
            </div>

            {ref.url && (
              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-900"
                >
                  <span>Official Source</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Live Formulary Citation Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_2px_16px_rgba(15,23,42,0.03)] p-5 sm:p-6 space-y-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">
            توزيع المراجع داخل قاعدة الأدوية الحالية (Supabase)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5" dir="rtl">
            إحصائية حية للمراجع المسجلة في حقل Reference لكل دواء في جدول medications
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {referenceStats.map(([refName, count]) => (
            <div
              key={refName}
              className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2 text-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
              <span className="font-bold text-slate-800">{refName}</span>
              <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-mono font-extrabold text-[11px]">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
