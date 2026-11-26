import type {
  ClinicalGuardrailAlert,
  CompatibilityAlert,
  PatientInfo,
  RegimenItem,
} from '../types/pharmacy';
import { formatCleanNumber, sanitizeWeightKg } from './calculations';

interface IncompatibilityRule {
  id: string;
  groupA: string[];
  groupB: string[];
  severity: 'critical' | 'warning';
  message: string;
}

const IV_INCOMPATIBILITY_RULES: IncompatibilityRule[] = [
  {
    id: 'ceftriaxone_calcium',
    groupA: ['rocephin'],
    groupB: ['ca_gluconate', 'ca_chloride'],
    severity: 'critical',
    message:
      'خطر ترسب قاتل (Calcium-Ceftriaxone Precipitate)! يمنع خلطهما أو حقنهما في نفس اللاين — استخدم لاين منفصل تماماً.',
  },
  {
    id: 'nahco3_catecholamines_ca',
    groupA: ['nahco3'],
    groupB: [
      'ca_gluconate',
      'ca_chloride',
      'adrenaline',
      'levophed',
      'dopamine',
      'dobutamine',
      'dormicum',
      'amiodarone',
      'cordarone',
    ],
    severity: 'critical',
    message:
      'بيكربونات الصوديوم (NaHCO3) غير متوافق كيميائياً: يسبب ترسب الكالسيوم أو إبطال مفعول الكاتيكولامينات. افصل اللاين واغسله جيداً.',
  },
  {
    id: 'lasix_y_site',
    groupA: ['lasix'],
    groupB: ['dormicum', 'gentamicin', 'vancocin', 'dopamine', 'dobutamine', 'milrinone'],
    severity: 'warning',
    message:
      'عدم توافق وريدي (Y-site Incompatibility) مع Furosemide — اغسل الكانيولا بـ 0.9% NS قبل وبعد الحقن.',
  },
  {
    id: 'heparin_y_site',
    groupA: ['heparin'],
    groupB: ['vancocin', 'gentamicin', 'amikacin', 'dormicum', 'ciprofloxacin'],
    severity: 'warning',
    message:
      'احتمال تعكر أو ترسب عند الالتقاء مع Heparin في نفس الوصلة (Y-site) — يفضل فصل اللاين أو الغسل بـ NS.',
  },
  {
    id: 'phenytoin_y_site',
    groupA: ['phenytoin', 'epanutin'],
    groupB: ['kcl', 'heparin', 'insulin', 'dobutamine', 'dormicum'],
    severity: 'warning',
    message:
      'الفينيتوين حساس جداً للـ pH ويترسب بسهولة — يجب إعطاؤه في لاين مخصص بـ 0.9% NS فقط مع فلتر.',
  },
];

export function checkRegimenCompatibility(
  regimen: RegimenItem[]
): CompatibilityAlert[] {
  const alerts: CompatibilityAlert[] = [];
  const seenPairs = new Set<string>();

  for (let i = 0; i < regimen.length; i++) {
    for (let j = i + 1; j < regimen.length; j++) {
      const a = regimen[i];
      const b = regimen[j];
      const idA = a.drugId.toLowerCase();
      const idB = b.drugId.toLowerCase();
      if (idA === idB) continue;

      for (const rule of IV_INCOMPATIBILITY_RULES) {
        const matchAB =
          rule.groupA.some((g) => idA.includes(g)) &&
          rule.groupB.some((g) => idB.includes(g));
        const matchBA =
          rule.groupA.some((g) => idB.includes(g)) &&
          rule.groupB.some((g) => idA.includes(g));

        if (matchAB || matchBA) {
          const pairKey = [rule.id, [idA, idB].sort().join('_')].join(':');
          if (!seenPairs.has(pairKey)) {
            seenPairs.add(pairKey);
            alerts.push({
              id: pairKey,
              severity: rule.severity,
              drugA: a.tradeName,
              drugB: b.tradeName,
              message: rule.message,
            });
          }
        }
      }
    }
  }

  return alerts;
}

const RENALLY_CLEARED_IDS = new Set([
  'vancocin',
  'meronem',
  'tienam',
  'tazocin',
  'maxipime',
  'fortum',
  'amikacin',
  'gentamicin',
  'colistin',
  'zovirax',
  'acyclovir',
  'ketolac',
  'kcl',
  'mgso4',
  'digoxin',
  'lanoxin',
]);

export function isRenallyClearedDrug(drugId: string): boolean {
  const lower = drugId.toLowerCase();
  return Array.from(RENALLY_CLEARED_IDS).some((id) => lower.includes(id));
}

export function isNeonatePatient(patient: PatientInfo): boolean {
  const ageVal = Number(patient.ageValue);
  if (!Number.isFinite(ageVal) || ageVal <= 0) return false;
  return patient.ageUnit === 'days' && ageVal <= 28;
}

export function getPatientClinicalAlerts(
  patient: PatientInfo,
  regimen: RegimenItem[]
): ClinicalGuardrailAlert[] {
  const alerts: ClinicalGuardrailAlert[] = [];
  const neonate = isNeonatePatient(patient);

  if (neonate) {
    for (const item of regimen) {
      const id = item.drugId.toLowerCase();
      if (id.includes('rocephin')) {
        alerts.push({
          id: `nicu_ceftriaxone_${item.regimenId}`,
          severity: 'critical',
          drugName: item.tradeName,
          title: 'تنبيه حديثي الولادة (NICU Contraindication)',
          message:
            'يُمنع استخدام Ceftriaxone في حديثي الولادة (≤ 28 يوم) لخطر اليرقان النووي والترسب مع الكالسيوم — البديل الموصى به: Cefotaxime.',
        });
      }
      if (id.includes('ketolac')) {
        alerts.push({
          id: `nicu_ketolac_${item.regimenId}`,
          severity: 'critical',
          drugName: item.tradeName,
          title: 'تنبيه حديثي الولادة (NICU)',
          message:
            'Ketorolac غير معتمد في حديثي الولادة والأطفال أقل من سنتين لخطر النزيف والقصور الكلوي.',
        });
      }
    }
  }

  if (patient.renalImpairment) {
    for (const item of regimen) {
      if (isRenallyClearedDrug(item.drugId)) {
        alerts.push({
          id: `renal_${item.regimenId}`,
          severity: 'warning',
          drugName: item.tradeName,
          title: 'تعديل جرعة القصور الكلوي (Renal Adjustment)',
          message: `${item.tradeName} (${item.genericName}) يُطرح كلوياً — يجب مراجعة تمديد الفترة الزمنية أو تقليل الجرعة حسب CrCl / eGFR.`,
        });
      }
    }
  }

  return alerts;
}

export type PumpRateUnit = 'mcg/kg/min' | 'mcg/kg/hr' | 'mg/kg/hr' | 'Units/kg/hr';

export interface PumpCalculationResult {
  syringeConcPerMl: number;
  concUnitLabel: string;
  rateMlPerHr: number;
  dosePerHour: number;
  dailyVolumeMl: number;
  syringeDurationHrs: number;
}

export function calculateSyringePumpRate(params: {
  weightKg: number | string;
  drugAmountInSyringe: number;
  drugAmountUnit: 'mg' | 'mcg' | 'Units';
  syringeTotalMl: number;
  desiredDoseRate: number;
  rateUnit: PumpRateUnit;
}): PumpCalculationResult {
  const w = sanitizeWeightKg(params.weightKg);
  const totalVol = Math.max(0.1, Number(params.syringeTotalMl) || 50);
  const amount = Math.max(0, Number(params.drugAmountInSyringe) || 0);
  const rate = Math.max(0, Number(params.desiredDoseRate) || 0);

  // Convert syringe amount into base unit matching rateUnit (mcg, mg, or Units)
  let amountInRateBase = amount;
  let concUnitLabel = `${params.drugAmountUnit}/mL`;

  if (params.rateUnit === 'mcg/kg/min' || params.rateUnit === 'mcg/kg/hr') {
    if (params.drugAmountUnit === 'mg') {
      amountInRateBase = amount * 1000;
    }
    concUnitLabel = 'mcg/mL';
  } else if (params.rateUnit === 'mg/kg/hr') {
    if (params.drugAmountUnit === 'mcg') {
      amountInRateBase = amount / 1000;
    }
    concUnitLabel = 'mg/mL';
  } else {
    concUnitLabel = 'Units/mL';
  }

  const syringeConcPerMl = amountInRateBase / totalVol;

  let dosePerHour = 0;
  if (params.rateUnit === 'mcg/kg/min') {
    dosePerHour = rate * w * 60;
  } else {
    dosePerHour = rate * w;
  }

  const rateMlPerHr = syringeConcPerMl > 0 ? dosePerHour / syringeConcPerMl : 0;
  const dailyVolumeMl = rateMlPerHr * 24;
  const syringeDurationHrs = rateMlPerHr > 0 ? totalVol / rateMlPerHr : 0;

  return {
    syringeConcPerMl: formatCleanNumber(syringeConcPerMl),
    concUnitLabel,
    rateMlPerHr: formatCleanNumber(rateMlPerHr),
    dosePerHour: formatCleanNumber(dosePerHour),
    dailyVolumeMl: formatCleanNumber(dailyVolumeMl),
    syringeDurationHrs: formatCleanNumber(syringeDurationHrs),
  };
}

export function calculateDrawUpVolume(
  orderedDose: number,
  stockConcPerMl: number,
  targetFinalVolumeMl: number
): {
  drawDrugMl: number;
  diluentToAddMl: number;
  isStockInsufficient: boolean;
} {
  const safeStock = Math.max(0.001, Number(stockConcPerMl) || 1);
  const drawDrugMl = orderedDose / safeStock;
  const diluentToAddMl = Math.max(0, targetFinalVolumeMl - drawDrugMl);
  return {
    drawDrugMl: formatCleanNumber(drawDrugMl),
    diluentToAddMl: formatCleanNumber(diluentToAddMl),
    isStockInsufficient: drawDrugMl > targetFinalVolumeMl && targetFinalVolumeMl > 0,
  };
}
