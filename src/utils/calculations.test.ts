import { describe, expect, it } from 'vitest';
import {
  buildPatientRegimenCsv,
  buildThermalStickers,
  computeDoseAndVolume,
  generate24HrSchedule,
  parseFormularyCsv,
} from './calculations';
import type { ComputedRegimenItem, PatientInfo } from '../types/pharmacy';

describe('computeDoseAndVolume', () => {
  it('computes pediatric Lasix 3 kg -> 1.5 mL', () => {
    const res = computeDoseAndVolume(3, 1, 40, 2);
    expect(res.finalDose).toBe(3);
    expect(res.isCapped).toBe(false);
    expect(res.finalVolumeMl).toBe(1.5);
  });

  it('caps single dose at maxSingleDose (Vancomycin 36 kg @ 20 mg/kg -> 720 mg = 144 mL)', () => {
    const res = computeDoseAndVolume(36, 20, 1000, 5);
    expect(res.finalDose).toBe(720);
    expect(res.isCapped).toBe(false);
    expect(res.finalVolumeMl).toBe(144);
  });

  it('caps at adult max when weight * dose exceeds maxSingleDose', () => {
    const res = computeDoseAndVolume(80, 20, 1000, 5);
    expect(res.rawDose).toBe(1600);
    expect(res.finalDose).toBe(1000);
    expect(res.isCapped).toBe(true);
    expect(res.finalVolumeMl).toBe(200);
  });
});

describe('generate24HrSchedule', () => {
  it('rolls over midnight date accurately for q8h starting at 13:00', () => {
    const slots = generate24HrSchedule('2026-11-22', '13:00', 'q8h');
    expect(slots).toHaveLength(3);
    expect(slots[0]).toEqual({ index: 1, timeStr: '01:00 PM', dateStr: '22/11' });
    expect(slots[1]).toEqual({ index: 2, timeStr: '09:00 PM', dateStr: '22/11' });
    expect(slots[2]).toEqual({ index: 3, timeStr: '05:00 AM', dateStr: '23/11' });
  });

  it('generates 1 slot for Stat', () => {
    const slots = generate24HrSchedule('2026-11-22', '08:30', 'Stat');
    expect(slots).toHaveLength(1);
    expect(slots[0].timeStr).toBe('08:30 AM');
  });
});

describe('buildThermalStickers unit safety', () => {
  it('preserves mcg and mEq units instead of hardcoding mg', () => {
    const patient: PatientInfo = {
      fullName: 'Test Child',
      mrn: '1001',
      ward: 'PICU',
      weightKg: 10,
      baseDate: '2026-11-22',
      defaultStartTime: '12:00',
    };
    const regimen: ComputedRegimenItem[] = [
      {
        regimenId: 'r1',
        drugId: 'kcl',
        tradeName: 'Potassium Chloride',
        genericName: 'KCl 15%',
        doseMgPerKg: 0.5,
        maxSingleMg: 20,
        finalConcMgMl: 0.08,
        doseUnit: 'mEq',
        highAlert: true,
        route: 'IV Infusion',
        diluent: '0.9% NS',
        prepInstructions: 'Dilute to 0.08 mEq/mL',
        frequency: 'Stat',
        startTime: '12:00',
        stability: '24h RT',
        reference: 'ISMP',
        finalDoseMg: 5,
        isCapped: false,
        finalVolumeMl: 62.5,
        scheduleSlots: [{ index: 1, timeStr: '12:00 PM', dateStr: '22/11' }],
      },
    ];

    const stickers = buildThermalStickers(regimen, patient, 'trade');
    expect(stickers).toHaveLength(1);
    expect(stickers[0].doseUnit).toBe('mEq');
    expect(stickers[0].highAlert).toBe(true);
  });
});

describe('CSV export and import', () => {
  it('escapes quotes inside CSV cells and parses unit column', () => {
    const csv = [
      'TradeName,GenericName,Category,FinalConcMgMl,DoseMgPerKg,MaxSingleMg,Frequency,Route,PrepInstructions,Unit',
      '"Levophed","Norepinephrine","Cardiology & Cath",80,36,4000,q6h,IV Infusion,"Dilute 4 mg in 50 mL",mcg',
    ].join('\n');

    const parsed = parseFormularyCsv(csv);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].doseUnit).toBe('mcg');
    expect(parsed[0].finalConcMgMl).toBe(80);

    const exported = buildPatientRegimenCsv([], {
      fullName: 'Test "Quote"',
      mrn: '1',
      ward: 'PICU',
      weightKg: 10,
      baseDate: '2026-11-22',
      defaultStartTime: '12:00',
    });
    expect(exported.startsWith('\uFEFF')).toBe(true);
  });
});
