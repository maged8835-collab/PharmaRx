import { describe, expect, it } from 'vitest';
import {
  calculateDrawUpVolume,
  calculateSyringePumpRate,
  checkRegimenCompatibility,
  getPatientClinicalAlerts,
} from './clinicalSafety';
import type { PatientInfo, RegimenItem } from '../types/pharmacy';

const makeRegimenItem = (drugId: string, tradeName: string, genericName: string): RegimenItem => ({
  regimenId: `r_${drugId}`,
  drugId,
  tradeName,
  genericName,
  doseMgPerKg: 10,
  maxSingleMg: 1000,
  finalConcMgMl: 10,
  doseUnit: 'mg',
  route: 'IV Infusion',
  diluent: '0.9% NS',
  prepInstructions: '',
  frequency: 'q8h',
  startTime: '12:00',
  stability: '24h RT',
  reference: 'Lexidrug',
});

describe('IV compatibility checker', () => {
  it('flags critical Ceftriaxone + Calcium Gluconate incompatibility', () => {
    const alerts = checkRegimenCompatibility([
      makeRegimenItem('rocephin', 'Rocephin', 'Ceftriaxone'),
      makeRegimenItem('ca_gluconate', 'Calcium Gluconate 10%', 'Calcium Gluconate'),
    ]);
    expect(alerts).toHaveLength(1);
    expect(alerts[0].severity).toBe('critical');
  });

  it('returns empty for compatible drugs', () => {
    const alerts = checkRegimenCompatibility([
      makeRegimenItem('meronem', 'Meronem', 'Meropenem'),
      makeRegimenItem('ketolac', 'Ketolac', 'Ketorolac'),
    ]);
    expect(alerts).toHaveLength(0);
  });
});

describe('Neonatal and Renal clinical guardrails', () => {
  it('flags Ceftriaxone in a 10-day-old neonate', () => {
    const neonate: PatientInfo = {
      fullName: 'Baby',
      mrn: '1',
      ward: 'NICU',
      weightKg: 3,
      ageValue: 10,
      ageUnit: 'days',
      baseDate: '2026-11-22',
      defaultStartTime: '12:00',
    };
    const alerts = getPatientClinicalAlerts(neonate, [
      makeRegimenItem('rocephin', 'Rocephin', 'Ceftriaxone'),
    ]);
    expect(alerts).toHaveLength(1);
    expect(alerts[0].severity).toBe('critical');
  });

  it('flags renally cleared drugs when renalImpairment is true', () => {
    const patient: PatientInfo = {
      fullName: 'Child',
      mrn: '2',
      ward: 'PICU',
      weightKg: 20,
      renalImpairment: true,
      baseDate: '2026-11-22',
      defaultStartTime: '12:00',
    };
    const alerts = getPatientClinicalAlerts(patient, [
      makeRegimenItem('vancocin', 'Vancocin', 'Vancomycin'),
    ]);
    expect(alerts).toHaveLength(1);
    expect(alerts[0].severity).toBe('warning');
  });
});

describe('Syringe pump mL/hr & Draw-Up helper', () => {
  it('calculates Norepinephrine 4 mg in 50 mL at 0.1 mcg/kg/min for 20 kg -> 1.5 mL/hr', () => {
    const res = calculateSyringePumpRate({
      weightKg: 20,
      drugAmountInSyringe: 4,
      drugAmountUnit: 'mg',
      syringeTotalMl: 50,
      desiredDoseRate: 0.1,
      rateUnit: 'mcg/kg/min',
    });
    expect(res.syringeConcPerMl).toBe(80);
    expect(res.rateMlPerHr).toBe(1.5);
    expect(res.syringeDurationHrs).toBe(33.3);
  });

  it('calculates stock draw-up volume and diluent to add', () => {
    const res = calculateDrawUpVolume(500, 50, 100);
    expect(res.drawDrugMl).toBe(10);
    expect(res.diluentToAddMl).toBe(90);
    expect(res.isStockInsufficient).toBe(false);
  });
});
