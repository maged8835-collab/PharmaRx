# التقرير التقني والسريري الشامل — منصة PediaSurgRx

> **الإصدار الحالي:** `2.0.0`  
> **الاسم التجاري للمنصة:** **PediaSurgRx** — Pediatric Clinical Pharmacy & IV Formulary  
> **المستودع (GitHub):** `https://github.com/maged8835-collab/PharmaRx`  
> **الاستضافة السحابية:** Vercel + Supabase (PostgreSQL, Auth, Row Level Security)

---

## 1. نظرة عامة على المنصة
**PediaSurgRx** هي منصة ويب متخصصة في **الصيدلة الإكلينيكية للأطفال والتحضير الوريدي (IV Admixture)**، مصممة لمساعدة الصيادلة الإكلينيكيين في:
- حساب الجرعات والأحجام النهائية (`mL`) لحظياً بناءً على وزن الطفل (`kg`) مع حماية الحد الأقصى للجرعة الواحدة (`maxSingleMg`).
- عرض جميع الأدوية بـ **المادة الفعالة فقط (Active Ingredient Only)** لتقليل أخطاء تشابه الأسماء التجارية (LASA).
- دعم وحدات القياس المختلفة (`mg`, `mcg`, `mEq`, `Units`, `MIU`, `g`, `mL`) بدقة في الحسابات والملصقات.
- فحص التوافق الوريدي (IV Y-Site Compatibility) وتنبيهات حديثي الولادة (NICU) والقصور الكلوي.
- حساب معدل المضخة الوريدية المستمرة (`mL/hr`) وحاسبة السحب من الفيال/الأمبول.
- توليد جدول جرعات 24 ساعة مع ترحيل التاريخ بعد منتصف الليل، وطباعة الملصقات الحرارية، وتصدير ملفات Excel (`.csv`).
- إدارة شاملة للمستخدمين وسجل النشاطات (`activity_logs`) عبر لوحة تحكم **Admin** محمية بسياسات قواعد البيانات.

---

## 2. البنية التقنية (Tech Stack)

| التقنية | الاستخدام في المنصة |
| :--- | :--- |
| **React 19** + **TypeScript** | بناء واجهات المستخدم مع فحص صارم للأنواع (`strict: true`) |
| **Vite 6** | أداة التطوير السريع وبناء نسخة الإنتاج وتقسيم الحزم (`manualChunks`) |
| **Tailwind CSS v4** | تنسيق الواجهة العصرية، الأنيميشن، وتنسيق الطباعة الحرارية `@media print` |
| **Supabase (`@supabase/supabase-js`)** | المصادقة (`Auth`)، قاعدة بيانات `PostgreSQL`، وحماية الصفوف (`RLS`) |
| **Lucide React** | مكتبة الأيقونات التفاعلية |
| **Vitest** | اختبارات الوحدات للمنطق الحسابي والسلامة السريرية |

---

## 3. هيكل الملفات والمجلدات

```text
d:\pharma\
├── index.html                          # نقطة الدخول + خطوط Plus Jakarta Sans و Cairo و JetBrains Mono
├── package.json                        # التبعيات وسكربتات dev / build / test
├── tsconfig.json                       # إعدادات TypeScript الصارمة
├── vite.config.ts                      # إعدادات Vite وتقسيم الحزم (react, supabase, icons)
├── .env.example                        # نموذج متغيرات البيئة المطلوبة لـ Supabase
├── supabase/
│   ├── schema.sql                      # تعريف الجداول، الدوال، الـ Triggers، وسياسات RLS
│   └── seed_medications.sql            # بذرة الـ 112 دواء لجدول public.medications
└── src/
    ├── main.tsx                        # تشغيل تطبيق React
    ├── index.css                       # Tailwind CSS + الأنيميشن المخصصة + ستايل الطباعة الحرارية
    ├── vite-env.d.ts                   # تعريفات Vite TypeScript
    ├── App.tsx                         # المنسق الرئيسي للتطبيق وإدارة الحالة والتحميل الكسول
    ├── lib/
    │   └── supabase.ts                 # تهيئة عميل Supabase من متغيرات البيئة VITE_*
    ├── types/
    │   └── pharmacy.ts                 # جميع واجهات TypeScript (الأدوية، المرضى، الملصقات، السجلات)
    ├── utils/
    │   ├── calculations.ts             # محرك حساب الجرعات، الجدولة، الملصقات، وتصدير/استيراد CSV
    │   ├── calculations.test.ts        # اختبارات محرك الحسابات (7 اختبارات)
    │   ├── clinicalSafety.ts           # التوافق الوريدي، NICU/Renal، المضخة mL/hr، السحب من الفيال
    │   ├── clinicalSafety.test.ts      # اختبارات السلامة السريرية والمضخة (6 اختبارات)
    │   ├── cloudSync.ts                # جميع عمليات Supabase (Auth, Medications, Patients, Admin, Logs)
    │   └── storage.ts                  # حفظ بيانات المريض النشط محلياً + تطبيع بيانات الأدوية
    └── components/
        ├── LoginPage.tsx               # شاشة تسجيل الدخول وإنشاء الحسابات السحابية
        ├── HeaderNav.tsx               # الشريط العلوي والتنقل بين التبويبات ومعلومات الصيدلي
        ├── PatientIntakeBar.tsx        # بطاقة بيانات المريض (الوزن، العمر، الكلى، الحفظ السحابي)
        ├── AutoFillTable.tsx           # الجدول الرئيسي للأدوية مع الحساب اللحظي والفلترة
        ├── PatientRegimenSheet.tsx     # شيت المريض النشط + التنبيهات السريرية + حاسبة السحب
        ├── ThermalLabelsView.tsx       # استوديو طباعة الملصقات الحرارية (50x30, 60x40, 70x40 mm)
        ├── PrepStandardsView.tsx       # إدارة وتعديل التركيزات القياسية واستيراد/تصدير CSV و JSON
        ├── QuickAddModal.tsx           # نافذة الإضافة السريعة لدواء مخصص جديد
        ├── InfusionPumpModal.tsx       # نافذة حاسبة المضخة الوريدية المستمرة (mL/hr)
        └── AdminDashboard.tsx          # لوحة تحكم المدير (Logs، إدارة الصيادلة، كل المرضى)
```

---

## 4. قاعدة البيانات والمصادقة والأمان (Supabase)

كل البيانات والمصادقة تعتمد كلياً على **Supabase** (بدون أي كلمات مرور أو قوائم أدوية مدمجة في كود الواجهة):

### الجداول الرئيسية في `supabase/schema.sql`
1. **`public.profiles`:**
   - الأعمدة: `id` (مرتبط بـ `auth.users`), `email`, `display_name`, `role` (`'admin' | 'pharmacist'`), `is_active`, `created_at`.
   - يتم إنشاء الصف تلقائياً عند تسجيل أي مستخدم جديد عبر Trigger باسم `on_auth_user_created` ينفذ الدالة `public.handle_new_user()` بصلاحية افتراضية `pharmacist`.
2. **`public.medications`:**
   - يحتوي على **112 دواء** (تُضاف عبر `supabase/seed_medications.sql`) موزعة على 7 أقسام سريرية، وتشمل: `id`, `trade_name`, `generic_name`, `arabic_name`, `category`, `diluent`, `prep_instructions`, `final_conc_mg_ml`, `dose_unit`, `high_alert`, `route`, `stability`, `reference`, `is_custom`, `presets` (`jsonb`).
3. **`public.patient_regimens`:**
   - يحفظ ملفات المرضى وروشتاتهم السحابية: `id`, `user_id`, `patient_name`, `mrn`, `ward`, `weight_kg`, `age_value`, `age_unit`, `renal_impairment`, `base_date`, `default_start_time`, `regimen` (`jsonb`), `updated_at`.
4. **`public.activity_logs`:**
   - يسجل العمليات الحساسة داخل المنصة: `id`, `user_id`, `user_email`, `user_name`, `action`, `details`, `created_at`.
   - الأحداث المسجلة تشمل: `LOGIN`, `SIGNUP`, `LOGOUT`, `ADD_MEDICATION`, `UPDATE_MEDICATION`, `BULK_IMPORT`, `SAVE_PATIENT`, `EXPORT_CSV`, `ADMIN_UPDATE_USER`.

### الحماية وصلاحيات الوصول (Row Level Security - RLS)
- دالة `public.is_admin()` (`security definer`) تتحقق من أن المستخدم الحالي يملك `role = 'admin'` و `is_active = true` في `public.profiles`.
- **حماية الترقية:**
  - سياسة `INSERT` على `profiles` تشترط `auth.uid() = id and role = 'pharmacist' and is_active = true`.
  - سياسة `UPDATE` على `profiles` محصورة بـ `public.is_admin()` فقط؛ لا يمكن لأي صيدلي ترقية نفسه إلى Admin.
- **حماية السجلات:**
  - أي مستخدم مسجل يمكنه إدراج سجل نشاط خاص به (`auth.uid() = user_id`)، لكن **القراءة (`SELECT`)** متاحة للـ `Admin` فقط.
- **حماية ملفات المرضى:**
  - الصيدلي يقرأ ويعدّل مرضاه فقط (`auth.uid() = user_id`)، بينما يرى الـ `Admin` كل ملفات المرضى عبر المستشفى.

---

## 5. المحرك الحسابي والسريري

### أ) محرك الجرعات والحجوم (`src/utils/calculations.ts`)
- **`computeDoseAndVolume`:**
  - يحسب الجرعة الخام: `الوزن (kg) × الجرعة/كجم`.
  - يتحقق من الحد الأقصى للجرعة الواحدة (`maxSingleMg`): إذا تجاوزت الجرعة الحد الأقصى يتم تقييدها وتفعيل علامة `isCapped` (`Max Capped`).
  - يحسب الحجم النهائي: `الجرعة النهائية ÷ التركيز النهائي القياسي` مع تقريب نظيف عبر `formatCleanNumber`.
- **تعدد وحدات القياس (`DoseUnit`):**
  - تدعم المنصة 7 وحدات قياس صريحة: `mg`, `mcg`, `mEq`, `Units`, `MIU`, `g`, `mL`.
  - توزيع الـ 112 دواء في البذرة: `91 mg`، `11 mcg`، `3 Units`، `3 g`، `2 mEq`، `1 MIU`، `1 mL`.
- **الجدولة الزمنية (`generate24HrSchedule`):**
  - تدعم التكرارات: `q4h`, `q6h`, `q8h`, `q12h`, `q24h`, `Stat`.
  - ترحّل التاريخ (`DD/MM`) تلقائياً عند تجاوز منتصف الليل وتخرج الأوقات بصيغة `12-hour AM/PM`.

### ب) محرك السلامة السريرية والمضخة (`src/utils/clinicalSafety.ts`)
1. **فحص التوافق الوريدي (`checkRegimenCompatibility`):**
   - يفحص أزواج الأدوية داخل شيت المريض وينبه على عدم التوافق الحرج والتحذيري:
     - `Ceftriaxone + Calcium Gluconate / CaCl2` (تحذير حرج من خطر الترسب القاتل).
     - `NaHCO3` مع الكالسيوم والكاتيكولامينات (`Epinephrine`, `Norepinephrine`, `Dopamine`, `Dobutamine`, `Midazolam`, `Amiodarone`).
     - عدم توافق `Y-site` لـ `Furosemide` و `Heparin` و `Phenytoin`.
2. **تنبيهات حديثي الولادة والقصور الكلوي (`getPatientClinicalAlerts`):**
   - **NICU (`Days ≤ 28`):** يظهر تنبيه حرج عند وصف `Ceftriaxone` أو `Ketorolac` لحديثي الولادة.
   - **القصور الكلوي (`renalImpairment`):** يظهر تنبيه تعديل الجرعة عند وجود أدوية تُطرح كلوياً (مثل `Vancomycin`, `Meropenem`, `Amikacin`, `Gentamicin`, `Colistin`, `Digoxin`, إلخ).
3. **حاسبة المضخة الوريدية المستمرة (`calculateSyringePumpRate`):**
   - تحسب **معدل المضخة (`mL/hr`)** و**تركيز السرنجة** و**مدة انتهاء السرنجة (`hrs`)** وحجم الـ 24 ساعة، مع دعم وحدات `mcg/kg/min`, `mcg/kg/hr`, `mg/kg/hr`, `Units/kg/hr`.
4. **حاسبة السحب من الفيال (`calculateDrawUpVolume`):**
   - تحسب كمية الدواء المسحوبة (`mL`) من الفيال المتاح + كمية المذيب المضافة للوصول للحجم النهائي، مع تنبيه إذا كان تركيز الفيال أقل من التركيز النهائي المطلوب.

---

## 6. الواجهات وتجربة الاستخدام (UI/UX)

- **تصميم SaaS طبي حديث:** خلفية هادئة `#F6F9FC`، بطاقات مستديرة (`rounded-3xl`)، خطوط `Plus Jakarta Sans` + `Cairo` + `JetBrains Mono`، مع حركات انتقال ناعمة (`animate-fade-in-up`, `animate-scale-in`) تحترم `prefers-reduced-motion`.
- **التبويبات الأربعة للصيدلي + تبويب الإدارة:**
  1. **Formulary (`AutoFillTable.tsx`):** بحث بالمادة الفعالة أو الاسم العربي، فلترة حسب القسم الطبي، تعديل فوري للجرعة/كجم والتركيز القياسي داخل الصف، وشارة **HIGH-ALERT** للأدوية عالية الخطورة.
  2. **Patient Sheet (`PatientRegimenSheet.tsx`):** عرض الأدوية المضافة، تنبيهات التوافق والـ NICU والكلى، حاسبة السحب من الفيال لكل دواء، جدول الجرعات، وتصدير ملف Excel (`.csv` بترميز UTF-8 BOM).
  3. **Labels (`ThermalLabelsView.tsx`):** معاينة وطباعة الملصقات الحرارية بالمادة الفعالة فقط (`Active Ingredient Only`) بمقاسات `50x30mm` و `60x40mm` و `70x40mm` مع علامة `HIGH-ALERT` على الملصق.
  4. **Standards (`PrepStandardsView.tsx`):** إضافة دواء مخصص، تعديل التركيزات القياسية، واستيراد/تصدير CSV و JSON مباشرة مع Supabase.
  5. **Admin (`AdminDashboard.tsx` - للـ Admin فقط):** بطاقات KPI، سجل النشاطات مع البحث والفلترة والتصدير CSV، إدارة الصيادلة (تغيير الصلاحية أو إيقاف/تفعيل الحساب)، واستعراض مرضى المستشفى.

---

## 7. الأداء والاختبارات (Performance & Testing)

- **تحسين الأداء (`vite.config.ts` & `App.tsx`):**
  - جميع التبويبات والنوافذ المنبثقة محملة بالتحميل الكسول (`React.lazy` + `Suspense`).
  - فصل حزم الـ Vendors (`react-vendor`, `supabase-vendor`, `icons-vendor`) لتقليل الحزمة الأساسية (`index.js` ≈ `47.12 kB` / `15.24 kB` gzip).
- **الاختبارات الآلية (`npm.cmd test`):**
  - 2 ملفات اختبار (`calculations.test.ts` بـ 7 اختبارات + `clinicalSafety.test.ts` بـ 6 اختبارات) بإجمالي **13 اختباراً ناجحاً**.
- **متطلبات التشغيل والنشر:**
  - تشغيل `supabase/schema.sql` ثم `supabase/seed_medications.sql` في Supabase SQL Editor.
  - ضبط `VITE_SUPABASE_URL` و `VITE_SUPABASE_ANON_KEY` في `.env.local` (محلياً) وفي إعدادات **Vercel Environment Variables** (للإنتاج).
