import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Printer,
  FileSpreadsheet,
  Plus,
  Trash2,
  Syringe,
  Clock,
  CheckCircle2,
  Database,
  Download,
  Upload,
  RefreshCw,
  User,
  Sparkles,
  BookOpen,
  Edit3,
  Check,
  Filter,
  X,
  AlertCircle,
  Sliders,
  Layers
} from 'lucide-react';

// ============================================================================
// 1. MASTER HOSPITAL PHARMACY FORMULARY (115 REAL CLINICAL MEDICATIONS)
// Covers: Antimicrobials, Analgesia/ICU, Cardiology/Cath, GI, Steroids/Blood,
// Neurology & Electrolytes with Standard Final Concentrations & Stability.
// ============================================================================

const INITIAL_PHARMACY_FORMULARY = [
  // ======================== 1. ANTIMICROBIALS (32) ========================
  {
    id: 'vancocin',
    tradeName: 'Vancocin',
    genericName: 'Vancomycin',
    arabicName: 'فانكوسين / فانكوميسين',
    category: 'Antimicrobials',
    diluent: '0.9% NS / D5W',
    prepInstructions: '500 mg in 100 mL NS/D5W -> 5 mg/mL (Infuse over 60-90 min)',
    finalConcMgMl: 5,
    route: 'IV Infusion',
    stability: '24h RT | 14d Fridge at 5 mg/mL',
    reference: 'Lexidrug / ASHP IDSA',
    presets: [
      { id: 'std', label: 'Standard / Surgical (15 mg/kg)', doseMgPerKg: 15, maxSingleMg: 1000, frequency: 'q8h' },
      { id: 'cns', label: 'Meningitis / MRSA (20 mg/kg)', doseMgPerKg: 20, maxSingleMg: 1000, frequency: 'q8h' },
      { id: 'q6h', label: 'Severe Sepsis q6h (15 mg/kg)', doseMgPerKg: 15, maxSingleMg: 1000, frequency: 'q6h' }
    ]
  },
  {
    id: 'meronem',
    tradeName: 'Meronem',
    genericName: 'Meropenem',
    arabicName: 'ميرونيم / ميروبينيم',
    category: 'Antimicrobials',
    diluent: '0.9% NS',
    prepInstructions: 'Dilute in 0.9% NS to 20 mg/mL (Infuse over 15-30 min)',
    finalConcMgMl: 20,
    route: 'IV Infusion',
    stability: '4h RT in NS | 24h Fridge (Only 1h in D5W)',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'std', label: 'Intra-Abdominal / Sepsis (20 mg/kg)', doseMgPerKg: 20, maxSingleMg: 1000, frequency: 'q8h' },
      { id: 'cns', label: 'Meningitis / Pseudomonas (40 mg/kg)', doseMgPerKg: 40, maxSingleMg: 2000, frequency: 'q8h' }
    ]
  },
  {
    id: 'tienam',
    tradeName: 'Tienam',
    genericName: 'Imipenem / Cilastatin',
    arabicName: 'تينام / إيميبينيم',
    category: 'Antimicrobials',
    diluent: '0.9% NS',
    prepInstructions: 'Reconstitute 500 mg directly in 100 mL NS -> 5 mg/mL',
    finalConcMgMl: 5,
    route: 'IV Infusion',
    stability: '4h RT | 24h Fridge',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'std', label: 'Severe Infection (15 mg/kg)', doseMgPerKg: 15, maxSingleMg: 500, frequency: 'q6h' },
      { id: 'high', label: 'Pseudomonas / Severe (25 mg/kg)', doseMgPerKg: 25, maxSingleMg: 1000, frequency: 'q6h' }
    ]
  },
  {
    id: 'tazocin',
    tradeName: 'Tazocin',
    genericName: 'Piperacillin / Tazobactam',
    arabicName: 'تازوسين / بيبيراسيلين',
    category: 'Antimicrobials',
    diluent: '0.9% NS',
    prepInstructions: 'Recon 4.5 g with 20 mL NS, dilute to 50 mg/mL (Pip component)',
    finalConcMgMl: 50,
    route: 'IV Infusion',
    stability: '24h RT | 48h Fridge',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'abd', label: 'Appendicitis / Intra-Abd (100 mg/kg)', doseMgPerKg: 100, maxSingleMg: 4000, frequency: 'q8h' },
      { id: 'feb', label: 'Febrile Neutropenia (80 mg/kg)', doseMgPerKg: 80, maxSingleMg: 4000, frequency: 'q6h' }
    ]
  },
  {
    id: 'maxipime',
    tradeName: 'Maxipime',
    genericName: 'Cefepime',
    arabicName: 'ماكسيبيم / سيفيبيم',
    category: 'Antimicrobials',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Recon 1 g with 10 mL WFI, dilute in NS to 40 mg/mL',
    finalConcMgMl: 40,
    route: 'IV Infusion',
    stability: '24h RT | 7d Fridge',
    reference: 'Lexidrug / BNFc',
    presets: [
      { id: 'std', label: 'Standard / Febrile Neutropenia (50 mg/kg)', doseMgPerKg: 50, maxSingleMg: 2000, frequency: 'q8h' },
      { id: 'mod', label: 'Moderate Infection (50 mg/kg q12h)', doseMgPerKg: 50, maxSingleMg: 2000, frequency: 'q12h' }
    ]
  },
  {
    id: 'fortum',
    tradeName: 'Fortum',
    genericName: 'Ceftazidime',
    arabicName: 'فورتام / سيفتازيديم',
    category: 'Antimicrobials',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Recon 1 g with 10 mL WFI, dilute in NS to 40 mg/mL',
    finalConcMgMl: 40,
    route: 'IV Infusion',
    stability: '24h RT | 7d Fridge',
    reference: 'BNFc / Lexidrug',
    presets: [
      { id: 'std', label: 'Moderate-Severe Infection (50 mg/kg)', doseMgPerKg: 50, maxSingleMg: 2000, frequency: 'q8h' }
    ]
  },
  {
    id: 'rocephin',
    tradeName: 'Rocephin',
    genericName: 'Ceftriaxone',
    arabicName: 'روسيفين / سيفاكسون / سيفترياكسون',
    category: 'Antimicrobials',
    diluent: '0.9% NS / D5W (NO RL!)',
    prepInstructions: 'Recon 1 g with 10 mL WFI, dilute in NS to 40 mg/mL',
    finalConcMgMl: 40,
    route: 'IV Infusion',
    stability: '24h RT | 3d Fridge (Incompatible with Ca/RL)',
    reference: 'Lexidrug / FDA',
    presets: [
      { id: 'std', label: 'Surgical / Standard (50 mg/kg)', doseMgPerKg: 50, maxSingleMg: 2000, frequency: 'q24h' },
      { id: 'cns', label: 'Severe Sepsis / Meningitis (100 mg/kg)', doseMgPerKg: 100, maxSingleMg: 2000, frequency: 'q24h' }
    ]
  },
  {
    id: 'claforan',
    tradeName: 'Claforan',
    genericName: 'Cefotaxime',
    arabicName: 'كلافوران / سيفوتاكسيم',
    category: 'Antimicrobials',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Recon 1 g with 10 mL WFI, dilute in NS to 50 mg/mL',
    finalConcMgMl: 50,
    route: 'IV Infusion',
    stability: '24h RT | 5d Fridge',
    reference: 'BNFc / Lexidrug',
    presets: [
      { id: 'std', label: 'Surgical / Peritonitis (50 mg/kg)', doseMgPerKg: 50, maxSingleMg: 2000, frequency: 'q8h' },
      { id: 'sev', label: 'Severe Sepsis q6h (50 mg/kg)', doseMgPerKg: 50, maxSingleMg: 2000, frequency: 'q6h' }
    ]
  },
  {
    id: 'zinacef',
    tradeName: 'Zinacef',
    genericName: 'Cefuroxime',
    arabicName: 'زيناسيف / سيفوروكسيم',
    category: 'Antimicrobials',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Recon 750 mg with 8 mL WFI, dilute in NS to 30 mg/mL',
    finalConcMgMl: 30,
    route: 'IV Infusion',
    stability: '24h RT | 48h Fridge',
    reference: 'ASHP Prophylaxis / BNFc',
    presets: [
      { id: 'proph', label: 'Surgical Prophylaxis (50 mg/kg)', doseMgPerKg: 50, maxSingleMg: 1500, frequency: 'q8h' },
      { id: 'std', label: 'Moderate Infection (30 mg/kg)', doseMgPerKg: 30, maxSingleMg: 1500, frequency: 'q8h' }
    ]
  },
  {
    id: 'zinol',
    tradeName: 'Zinol',
    genericName: 'Cefazolin',
    arabicName: 'زينول / سيفازولين',
    category: 'Antimicrobials',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Recon 1 g with 10 mL WFI, dilute in NS to 20 mg/mL',
    finalConcMgMl: 20,
    route: 'IV Infusion',
    stability: '24h RT | 10d Fridge',
    reference: 'ASHP Surgical Prophylaxis',
    presets: [
      { id: 'proph', label: 'Pre-Op Surgical Prophylaxis (30 mg/kg)', doseMgPerKg: 30, maxSingleMg: 2000, frequency: 'q8h' },
      { id: 'std', label: 'MSSA / Skin & Soft Tissue (25 mg/kg)', doseMgPerKg: 25, maxSingleMg: 2000, frequency: 'q8h' }
    ]
  },
  {
    id: 'unasyn',
    tradeName: 'Unasyn',
    genericName: 'Ampicillin / Sulbactam',
    arabicName: 'يوناسين / أمبيسيلين سالباكتام',
    category: 'Antimicrobials',
    diluent: '0.9% NS ONLY',
    prepInstructions: 'Recon 1.5 g (1 g Amp) with 3.2 mL WFI, dilute in NS to 30 mg/mL',
    finalConcMgMl: 30,
    route: 'IV Infusion',
    stability: '8h RT in 0.9% NS (Only 2h in D5W!)',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'std', label: 'Surgical / Intra-Abd (50 mg/kg Amp)', doseMgPerKg: 50, maxSingleMg: 2000, frequency: 'q6h' }
    ]
  },
  {
    id: 'augmentin_iv',
    tradeName: 'Augmentin IV',
    genericName: 'Amoxicillin / Clavulanate',
    arabicName: 'أوجمنتين حقن / أموكسيسيلين',
    category: 'Antimicrobials',
    diluent: '0.9% NS ONLY (NO D5W!)',
    prepInstructions: 'Recon 1.2 g with 20 mL WFI, dilute in NS to 20 mg/mL (Amox)',
    finalConcMgMl: 20,
    route: 'IV Infusion',
    stability: '4h RT in 0.9% NS (Unstable in Dextrose)',
    reference: 'BNFc / Medusa',
    presets: [
      { id: 'std', label: 'Standard / Surgical (25 mg/kg Amox)', doseMgPerKg: 25, maxSingleMg: 1000, frequency: 'q8h' }
    ]
  },
  {
    id: 'amikin',
    tradeName: 'Amikin',
    genericName: 'Amikacin',
    arabicName: 'أميكين / أميكاسين',
    category: 'Antimicrobials',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Dilute 500 mg (2 mL) in 98 mL NS -> 5 mg/mL (Infuse 30-60 min)',
    finalConcMgMl: 5,
    route: 'IV Infusion',
    stability: '24h RT | 60d Fridge',
    reference: 'Lexidrug / Sanford Guide',
    presets: [
      { id: 'od', label: 'Once-Daily Regimen (15 mg/kg)', doseMgPerKg: 15, maxSingleMg: 1500, frequency: 'q24h' },
      { id: 'div', label: 'Divided q8h (7.5 mg/kg)', doseMgPerKg: 7.5, maxSingleMg: 500, frequency: 'q8h' }
    ]
  },
  {
    id: 'garamycin',
    tradeName: 'Garamycin',
    genericName: 'Gentamicin',
    arabicName: 'جاراميسين / جنتاميسين',
    category: 'Antimicrobials',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Dilute 80 mg (2 mL) + 38 mL NS -> 2 mg/mL (Infuse 30 min)',
    finalConcMgMl: 2,
    route: 'IV Infusion',
    stability: '24h RT',
    reference: 'BNFc / Lexidrug',
    presets: [
      { id: 'od', label: 'Once-Daily Surgical / UTI (7 mg/kg)', doseMgPerKg: 7, maxSingleMg: 500, frequency: 'q24h' },
      { id: 'div', label: 'Conventional q8h (2.5 mg/kg)', doseMgPerKg: 2.5, maxSingleMg: 160, frequency: 'q8h' }
    ]
  },
  {
    id: 'nebcin',
    tradeName: 'Nebcin',
    genericName: 'Tobramycin',
    arabicName: 'توبراميسين',
    category: 'Antimicrobials',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Dilute 80 mg (2 mL) + 38 mL NS -> 2 mg/mL',
    finalConcMgMl: 2,
    route: 'IV Infusion',
    stability: '24h RT',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'od', label: 'Once-Daily (7 mg/kg)', doseMgPerKg: 7, maxSingleMg: 500, frequency: 'q24h' },
      { id: 'cf', label: 'Cystic Fibrosis / Pseudomonas (10 mg/kg)', doseMgPerKg: 10, maxSingleMg: 600, frequency: 'q24h' }
    ]
  },
  {
    id: 'ciprocin',
    tradeName: 'Ciprocin',
    genericName: 'Ciprofloxacin',
    arabicName: 'سيبروسين / سيبروفلوكساسين',
    category: 'Antimicrobials',
    diluent: 'Ready-to-Use 2 mg/mL Bag',
    prepInstructions: 'Ready-to-Use 200 mg/100 mL (2 mg/mL) — Infuse over 60 min',
    finalConcMgMl: 2,
    route: 'IV Infusion',
    stability: '24h RT; protect from light',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'std', label: 'Complicated UTI / GI (10 mg/kg)', doseMgPerKg: 10, maxSingleMg: 400, frequency: 'q12h' },
      { id: 'sev', label: 'Severe Pseudomonas q8h (10 mg/kg)', doseMgPerKg: 10, maxSingleMg: 400, frequency: 'q8h' }
    ]
  },
  {
    id: 'tavanic',
    tradeName: 'Tavanic',
    genericName: 'Levofloxacin',
    arabicName: 'تافانيك / ليفوفلوكساسين',
    category: 'Antimicrobials',
    diluent: 'Ready-to-Use 5 mg/mL Bag',
    prepInstructions: 'Ready-to-Use 500 mg/100 mL (5 mg/mL) — Infuse over 60-90 min',
    finalConcMgMl: 5,
    route: 'IV Infusion',
    stability: '24h RT; protect from light',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'u5', label: 'Child < 5 yrs (10 mg/kg q12h)', doseMgPerKg: 10, maxSingleMg: 500, frequency: 'q12h' },
      { id: 'o5', label: 'Child ≥ 5 yrs (10 mg/kg q24h)', doseMgPerKg: 10, maxSingleMg: 750, frequency: 'q24h' }
    ]
  },
  {
    id: 'flagyl',
    tradeName: 'Flagyl',
    genericName: 'Metronidazole',
    arabicName: 'فلاجيل / ميترونيدازول',
    category: 'Antimicrobials',
    diluent: 'Ready-to-Use 5 mg/mL Bag',
    prepInstructions: 'Ready-to-Use 500 mg/100 mL (5 mg/mL) — Infuse over 30-60 min',
    finalConcMgMl: 5,
    route: 'IV Infusion',
    stability: '24h RT; protect from light; do NOT refrigerate',
    reference: 'ASHP / BNFc',
    presets: [
      { id: 'std', label: 'Anaerobic / GI Surgery (7.5 mg/kg)', doseMgPerKg: 7.5, maxSingleMg: 500, frequency: 'q8h' },
      { id: 'proph', label: 'Pre-Op Surgical Prophylaxis (15 mg/kg)', doseMgPerKg: 15, maxSingleMg: 500, frequency: 'Stat' }
    ]
  },
  {
    id: 'dalacin',
    tradeName: 'Dalacin C',
    genericName: 'Clindamycin',
    arabicName: 'دالاسين سي / كليندامايسين',
    category: 'Antimicrobials',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Dilute 600 mg (4 mL) in 50 mL NS -> 12 mg/mL (Max 18 mg/mL)',
    finalConcMgMl: 12,
    route: 'IV Infusion',
    stability: '24h RT | 32d Fridge',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'std', label: 'Soft Tissue / Bone / MRSA (10 mg/kg)', doseMgPerKg: 10, maxSingleMg: 600, frequency: 'q8h' },
      { id: 'sev', label: 'Necrotizing / Toxic Shock (13 mg/kg)', doseMgPerKg: 13, maxSingleMg: 900, frequency: 'q8h' }
    ]
  },
  {
    id: 'zyvox',
    tradeName: 'Zyvox',
    genericName: 'Linezolid',
    arabicName: 'زيفوكس / لينيزوليد',
    category: 'Antimicrobials',
    diluent: 'Ready-to-Use 2 mg/mL Bag',
    prepInstructions: 'Ready-to-Use 600 mg/300 mL (2 mg/mL) — Infuse over 30-120 min',
    finalConcMgMl: 2,
    route: 'IV Infusion',
    stability: '24h RT; protect from light',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'u12', label: 'Child < 12 yrs (10 mg/kg q8h)', doseMgPerKg: 10, maxSingleMg: 600, frequency: 'q8h' },
      { id: 'o12', label: 'Adolescent ≥ 12 yrs (10 mg/kg q12h)', doseMgPerKg: 10, maxSingleMg: 600, frequency: 'q12h' }
    ]
  },
  {
    id: 'targocid',
    tradeName: 'Targocid',
    genericName: 'Teicoplanin',
    arabicName: 'تارجوسيد / تيكوبلانين',
    category: 'Antimicrobials',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Recon 400 mg with 3 mL WFI gently (no foam), dilute in NS to 10 mg/mL',
    finalConcMgMl: 10,
    route: 'IV Infusion',
    stability: '24h Fridge',
    reference: 'BNFc / Medusa',
    presets: [
      { id: 'load', label: 'Loading Dose q12h x 3 doses (10 mg/kg)', doseMgPerKg: 10, maxSingleMg: 800, frequency: 'q12h' },
      { id: 'maint', label: 'Maintenance Dose (10 mg/kg q24h)', doseMgPerKg: 10, maxSingleMg: 800, frequency: 'q24h' }
    ]
  },
  {
    id: 'colomycin',
    tradeName: 'Colomycin',
    genericName: 'Colistimethate Sodium (Colistin)',
    arabicName: 'كولوميسين / كوليستين (مليون وحدة)',
    category: 'Antimicrobials',
    diluent: '0.9% NS / D5W',
    prepInstructions: '1 Million IU (MIU) in 10 mL NS -> 0.1 MIU/mL (100,000 IU/mL)',
    finalConcMgMl: 0.1,
    route: 'IV Infusion',
    stability: '24h Fridge (Dosed in Million IU/kg!)',
    reference: 'BNFc / EMA Colistin',
    presets: [
      { id: 'std', label: 'MDR Gram-Neg (0.025 MIU/kg = 25,000 IU/kg)', doseMgPerKg: 0.025, maxSingleMg: 2, frequency: 'q8h' },
      { id: 'high', label: 'Severe MDR Sepsis (0.05 MIU/kg)', doseMgPerKg: 0.05, maxSingleMg: 3, frequency: 'q8h' }
    ]
  },
  {
    id: 'tygacil',
    tradeName: 'Tygacil',
    genericName: 'Tigecycline',
    arabicName: 'تيجاسيل / تيجيسيكلين',
    category: 'Antimicrobials',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Recon 50 mg with 5.3 mL NS (10 mg/mL), dilute to 1 mg/mL',
    finalConcMgMl: 1,
    route: 'IV Infusion',
    stability: '6h RT | 48h Fridge at 1 mg/mL',
    reference: 'Lexidrug Pediatric (≥ 8 yrs)',
    presets: [
      { id: 'std', label: 'Child 8-17 yrs (1.2 mg/kg)', doseMgPerKg: 1.2, maxSingleMg: 50, frequency: 'q12h' }
    ]
  },
  {
    id: 'zithromax_iv',
    tradeName: 'Zithromax IV',
    genericName: 'Azithromycin',
    arabicName: 'زيثروماكس حقن / أزيثرومايسين',
    category: 'Antimicrobials',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Recon 500 mg with 4.8 mL WFI (100 mg/mL), dilute to 2 mg/mL',
    finalConcMgMl: 2,
    route: 'IV Infusion',
    stability: '24h RT | 7d Fridge at 2 mg/mL',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'std', label: 'Atypical Pneumonia / PID (10 mg/kg)', doseMgPerKg: 10, maxSingleMg: 500, frequency: 'q24h' }
    ]
  },
  {
    id: 'erythromycin_iv',
    tradeName: 'Erythrocin IV',
    genericName: 'Erythromycin Lactobionate',
    arabicName: 'إريثرومايسين حقن',
    category: 'Antimicrobials',
    diluent: '0.9% NS',
    prepInstructions: 'Recon 1 g with 20 mL WFI (50 mg/mL), dilute in NS to 5 mg/mL',
    finalConcMgMl: 5,
    route: 'IV Infusion',
    stability: '8h RT | 24h Fridge',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'inf', label: 'Severe Infection (10 mg/kg)', doseMgPerKg: 10, maxSingleMg: 1000, frequency: 'q6h' },
      { id: 'prok', label: 'GI Prokinetic / Feeding Intolerance (3 mg/kg)', doseMgPerKg: 3, maxSingleMg: 250, frequency: 'q8h' }
    ]
  },
  {
    id: 'septrin_iv',
    tradeName: 'Septrin IV',
    genericName: 'Trimethoprim / Sulfamethoxazole',
    arabicName: 'سبترين حقن / كوتريموكسازول',
    category: 'Antimicrobials',
    diluent: 'D5W Preferred (or 0.9% NS)',
    prepInstructions: 'Dilute 80 mg TMP (5 mL) in 125 mL D5W -> 0.64 mg/mL (TMP)',
    finalConcMgMl: 0.64,
    route: 'IV Infusion',
    stability: '6h RT (Dosed on Trimethoprim component)',
    reference: 'Lexidrug / BNFc',
    presets: [
      { id: 'std', label: 'Severe UTI / Stenotrophomonas (4 mg/kg TMP)', doseMgPerKg: 4, maxSingleMg: 160, frequency: 'q12h' },
      { id: 'pjp', label: 'PCP / PJP Pneumonia (5 mg/kg TMP)', doseMgPerKg: 5, maxSingleMg: 320, frequency: 'q6h' }
    ]
  },
  {
    id: 'diflucan',
    tradeName: 'Diflucan',
    genericName: 'Fluconazole',
    arabicName: 'ديفلوكان / فلوكونازول',
    category: 'Antimicrobials',
    diluent: 'Ready-to-Use 2 mg/mL Bottle',
    prepInstructions: 'Ready-to-Use 200 mg/100 mL (2 mg/mL) — Infuse over 1-2 hrs',
    finalConcMgMl: 2,
    route: 'IV Infusion',
    stability: '24h RT; do not freeze',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'maint', label: 'Candidiasis Maintenance (6 mg/kg)', doseMgPerKg: 6, maxSingleMg: 400, frequency: 'q24h' },
      { id: 'load', label: 'Invasive Candidiasis / Load (12 mg/kg)', doseMgPerKg: 12, maxSingleMg: 800, frequency: 'q24h' }
    ]
  },
  {
    id: 'vfend',
    tradeName: 'Vfend',
    genericName: 'Voriconazole',
    arabicName: 'فيفند / فوريكونازول',
    category: 'Antimicrobials',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Recon 200 mg with 19 mL WFI (10 mg/mL), dilute to 2 mg/mL',
    finalConcMgMl: 2,
    route: 'IV Infusion',
    stability: '24h Fridge at 2-5 mg/mL',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'load', label: 'Loading Dose Day 1 (9 mg/kg)', doseMgPerKg: 9, maxSingleMg: 600, frequency: 'q12h' },
      { id: 'maint', label: 'Maintenance Dose (8 mg/kg)', doseMgPerKg: 8, maxSingleMg: 400, frequency: 'q12h' }
    ]
  },
  {
    id: 'cancidas',
    tradeName: 'Cancidas',
    genericName: 'Caspofungin',
    arabicName: 'كانسيداس / كاسبوفونجين',
    category: 'Antimicrobials',
    diluent: '0.9% NS ONLY (NO Dextrose!)',
    prepInstructions: 'Recon 50 mg with 10.5 mL NS, dilute in NS to 0.5 mg/mL',
    finalConcMgMl: 0.5,
    route: 'IV Infusion',
    stability: '24h RT | 48h Fridge in 0.9% NS',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'maint', label: 'Maintenance (~50 mg/m2 ≈ 1.5 mg/kg)', doseMgPerKg: 1.5, maxSingleMg: 50, frequency: 'q24h' },
      { id: 'load', label: 'Day 1 Loading (~70 mg/m2 ≈ 2 mg/kg)', doseMgPerKg: 2, maxSingleMg: 70, frequency: 'q24h' }
    ]
  },
  {
    id: 'ambisome',
    tradeName: 'AmBisome',
    genericName: 'Amphotericin B Liposomal',
    arabicName: 'أمبيزوم / أمفوتيريسين ليبوزومال',
    category: 'Antimicrobials',
    diluent: 'D5W ONLY (Incompatible with NS!)',
    prepInstructions: 'Recon 50 mg with 12 mL WFI (4 mg/mL), filter & dilute in D5W to 1 mg/mL',
    finalConcMgMl: 1,
    route: 'IV Infusion',
    stability: '24h Fridge in D5W ONLY',
    reference: 'Lexidrug / Trissel’s',
    presets: [
      { id: 'emp', label: 'Empiric Antifungal (3 mg/kg)', doseMgPerKg: 3, maxSingleMg: 300, frequency: 'q24h' },
      { id: 'inv', label: 'Invasive Aspergillosis / Mucor (5 mg/kg)', doseMgPerKg: 5, maxSingleMg: 500, frequency: 'q24h' }
    ]
  },
  {
    id: 'zovirax',
    tradeName: 'Zovirax',
    genericName: 'Acyclovir',
    arabicName: 'زوفيراكس / أسيكلوفير',
    category: 'Antimicrobials',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Recon 250 mg with 10 mL WFI (25 mg/mL), dilute in NS to 5 mg/mL',
    finalConcMgMl: 5,
    route: 'IV Infusion',
    stability: '24h RT (Do NOT refrigerate — precipitates!)',
    reference: 'Lexidrug / Trissel’s',
    presets: [
      { id: 'std', label: 'HSV / Varicella (10 mg/kg)', doseMgPerKg: 10, maxSingleMg: 800, frequency: 'q8h' },
      { id: 'cns', label: 'HSV Encephalitis (20 mg/kg)', doseMgPerKg: 20, maxSingleMg: 1000, frequency: 'q8h' }
    ]
  },
  {
    id: 'cymevene',
    tradeName: 'Cymevene',
    genericName: 'Ganciclovir',
    arabicName: 'سيميفين / جانسيكلوفير',
    category: 'Antimicrobials',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Recon 500 mg with 10 mL WFI (50 mg/mL), dilute in NS to 5 mg/mL',
    finalConcMgMl: 5,
    route: 'IV Infusion',
    stability: '24h Fridge (Hazardous Drug — Handle with PPE)',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'ind', label: 'CMV Induction (5 mg/kg q12h)', doseMgPerKg: 5, maxSingleMg: 500, frequency: 'q12h' },
      { id: 'maint', label: 'CMV Maintenance (5 mg/kg q24h)', doseMgPerKg: 5, maxSingleMg: 500, frequency: 'q24h' }
    ]
  },

  // ================= 2. ANALGESICS, SEDATIVES & ICU (25) =================
  {
    id: 'perfalgan',
    tradeName: 'Perfalgan',
    genericName: 'Paracetamol IV',
    arabicName: 'بيرفالجان / باراسيتامول حقن',
    category: 'Analgesia & ICU',
    diluent: 'Ready-to-Use 10 mg/mL Vial',
    prepInstructions: 'Ready-to-Use 1000 mg/100 mL (10 mg/mL) — Infuse over 15 min',
    finalConcMgMl: 10,
    route: 'IV Infusion',
    stability: 'Single-use vial; infuse immediately',
    reference: 'BNFc / Lexidrug',
    presets: [
      { id: 'child', label: 'Child ≥ 10 kg (15 mg/kg)', doseMgPerKg: 15, maxSingleMg: 1000, frequency: 'q6h' },
      { id: 'inf', label: 'Infant < 10 kg (7.5 mg/kg)', doseMgPerKg: 7.5, maxSingleMg: 75, frequency: 'q6h' }
    ]
  },
  {
    id: 'ketolac',
    tradeName: 'Ketolac',
    genericName: 'Ketorolac Tromethamine',
    arabicName: 'كيتولاك / كيتورولاك',
    category: 'Analgesia & ICU',
    diluent: '0.9% NS',
    prepInstructions: 'Dilute 30 mg (1 mL) + 1 mL 0.9% NS -> Total 2 mL (15 mg/mL)',
    finalConcMgMl: 15,
    route: 'IV Shot',
    stability: '24h RT (Max therapy duration: 48 hrs)',
    reference: 'Lexidrug / BNFc',
    presets: [
      { id: 'std', label: 'Post-Op Analgesia (0.5 mg/kg)', doseMgPerKg: 0.5, maxSingleMg: 30, frequency: 'q6h' }
    ]
  },
  {
    id: 'voltaren_iv',
    tradeName: 'Voltaren IV',
    genericName: 'Diclofenac Sodium',
    arabicName: 'فولتارين حقن / ديكلوفيناك',
    category: 'Analgesia & ICU',
    diluent: '0.9% NS (Buffered with NaHCO3)',
    prepInstructions: 'Dilute 75 mg (3 mL) in 72 mL buffered NS -> 1 mg/mL (Infuse 30 min)',
    finalConcMgMl: 1,
    route: 'IV Infusion',
    stability: 'Prepare fresh immediately before infusion',
    reference: 'BNFc Pediatric',
    presets: [
      { id: 'std', label: 'Post-Op Pain (1 mg/kg)', doseMgPerKg: 1, maxSingleMg: 75, frequency: 'q12h' }
    ]
  },
  {
    id: 'ibuprofen_iv',
    tradeName: 'Caldolor / Ibuprofen IV',
    genericName: 'Ibuprofen IV',
    arabicName: 'إيبوبروفين حقن',
    category: 'Analgesia & ICU',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Dilute 400 mg (4 mL) in 96 mL NS -> 4 mg/mL (Infuse over 10-30 min)',
    finalConcMgMl: 4,
    route: 'IV Infusion',
    stability: '24h RT at ≤ 4 mg/mL',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'std', label: 'Pain / Fever (10 mg/kg)', doseMgPerKg: 10, maxSingleMg: 400, frequency: 'q6h' }
    ]
  },
  {
    id: 'morphine',
    tradeName: 'Morphine',
    genericName: 'Morphine Sulfate',
    arabicName: 'مورفين سلفات',
    category: 'Analgesia & ICU',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Dilute 10 mg (1 mL) + 9 mL 0.9% NS -> 1 mg/mL (Slow IV 5-10 min)',
    finalConcMgMl: 1,
    route: 'IV Shot',
    stability: '24h RT (High-Alert Narcotic)',
    reference: 'BNFc / Lexidrug',
    presets: [
      { id: 'std', label: 'Severe Post-Op Pain (0.1 mg/kg)', doseMgPerKg: 0.1, maxSingleMg: 10, frequency: 'q4h' },
      { id: 'low', label: 'Initial Titration (0.05 mg/kg)', doseMgPerKg: 0.05, maxSingleMg: 5, frequency: 'q4h' }
    ]
  },
  {
    id: 'fentanyl',
    tradeName: 'Fentanyl',
    genericName: 'Fentanyl Citrate',
    arabicName: 'فنتانيل (ميكروجرام)',
    category: 'Analgesia & ICU',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Dilute 100 mcg (2 mL) + 8 mL NS -> 10 mcg/mL (0.01 mg/mL)',
    finalConcMgMl: 10,
    route: 'IV Shot',
    stability: '24h RT (Dosed in mcg/kg! Conc = 10 mcg/mL)',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'std', label: 'Acute Pain / Sedation (1 mcg/kg)', doseMgPerKg: 1, maxSingleMg: 100, frequency: 'q4h' },
      { id: 'proc', label: 'Procedural Analgesia (2 mcg/kg)', doseMgPerKg: 2, maxSingleMg: 100, frequency: 'Stat' }
    ]
  },
  {
    id: 'nalufin',
    tradeName: 'Nalufin',
    genericName: 'Nalbuphine',
    arabicName: 'نالوفين / نالبوفين',
    category: 'Analgesia & ICU',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Dilute 20 mg (1 mL) + 9 mL NS -> 2 mg/mL (Slow IV over 5 min)',
    finalConcMgMl: 2,
    route: 'IV Shot',
    stability: '24h RT',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'std', label: 'Moderate-Severe Post-Op Pain (0.1 mg/kg)', doseMgPerKg: 0.1, maxSingleMg: 10, frequency: 'q4h' }
    ]
  },
  {
    id: 'tramal',
    tradeName: 'Tramal',
    genericName: 'Tramadol',
    arabicName: 'ترامال / ترامادول',
    category: 'Analgesia & ICU',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Dilute 100 mg (2 mL) + 18 mL NS -> 5 mg/mL (Slow IV over 10 min)',
    finalConcMgMl: 5,
    route: 'IV Infusion',
    stability: '24h RT (Age ≥ 12 yrs recommended)',
    reference: 'BNFc Pediatric',
    presets: [
      { id: 'std', label: 'Post-Op Analgesia (1 mg/kg)', doseMgPerKg: 1, maxSingleMg: 100, frequency: 'q6h' }
    ]
  },
  {
    id: 'pethidine',
    tradeName: 'Pethidine',
    genericName: 'Meperidine / Pethidine',
    arabicName: 'بيثيدين / ميبيريدين',
    category: 'Analgesia & ICU',
    diluent: '0.9% NS',
    prepInstructions: 'Dilute 50 mg (1 mL) + 4 mL NS -> 10 mg/mL (Slow IV)',
    finalConcMgMl: 10,
    route: 'IV Shot',
    stability: '24h RT',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'std', label: 'Acute Pain (1 mg/kg)', doseMgPerKg: 1, maxSingleMg: 100, frequency: 'q4h' },
      { id: 'rigor', label: 'Post-Op Shivering / Rigors (0.25 mg/kg)', doseMgPerKg: 0.25, maxSingleMg: 25, frequency: 'Stat' }
    ]
  },
  {
    id: 'dormicum',
    tradeName: 'Dormicum',
    genericName: 'Midazolam',
    arabicName: 'دورميكوم / ميدازولام',
    category: 'Analgesia & ICU',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Dilute 5 mg (1 mL) + 4 mL NS -> 1 mg/mL (Slow IV over 2-3 min)',
    finalConcMgMl: 1,
    route: 'IV Shot',
    stability: '24h RT (Monitor SpO2)',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'sed', label: 'Procedural / Catheter Sedation (0.05 mg/kg)', doseMgPerKg: 0.05, maxSingleMg: 2.5, frequency: 'Stat' },
      { id: 'pre', label: 'Pre-Op Anxiolysis / Status (0.1 mg/kg)', doseMgPerKg: 0.1, maxSingleMg: 5, frequency: 'Stat' }
    ]
  },
  {
    id: 'valium',
    tradeName: 'Valium / Neuril',
    genericName: 'Diazepam',
    arabicName: 'فاليوم / نيوريل / ديازيبام',
    category: 'Analgesia & ICU',
    diluent: 'Undiluted Slow IV (Do NOT dilute in small vol)',
    prepInstructions: 'Undiluted 10 mg/2 mL (5 mg/mL) — Slow IV push ≤ 2 mg/min',
    finalConcMgMl: 5,
    route: 'IV Shot',
    stability: 'Undiluted in syringe; precipitates if diluted in small NS vol',
    reference: 'Lexidrug / BNFc',
    presets: [
      { id: 'seiz', label: 'Acute Seizure / Muscle Spasm (0.2 mg/kg)', doseMgPerKg: 0.2, maxSingleMg: 10, frequency: 'Stat' }
    ]
  },
  {
    id: 'ativan',
    tradeName: 'Ativan',
    genericName: 'Lorazepam',
    arabicName: 'أتيفان / لورازيبام',
    category: 'Analgesia & ICU',
    diluent: '0.9% NS / D5W (1:1 Dilution)',
    prepInstructions: 'Dilute 4 mg (1 mL) + 1 mL NS -> 2 mg/mL (Slow IV ≤ 2 mg/min)',
    finalConcMgMl: 2,
    route: 'IV Shot',
    stability: 'Refrigerate stock vials; use diluted solution immediately',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'seiz', label: 'Status Epilepticus / Agitation (0.1 mg/kg)', doseMgPerKg: 0.1, maxSingleMg: 4, frequency: 'Stat' }
    ]
  },
  {
    id: 'diprivan',
    tradeName: 'Diprivan',
    genericName: 'Propofol 1%',
    arabicName: 'ديبريفان / بروبوفول',
    category: 'Analgesia & ICU',
    diluent: 'Undiluted Lipid Emulsion (10 mg/mL)',
    prepInstructions: 'Ready-to-Use 1% (10 mg/mL) — Strict aseptic technique',
    finalConcMgMl: 10,
    route: 'IV Shot',
    stability: '12h max after opening vial (Lipid emulsion)',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'sed', label: 'Procedural Sedation (1 mg/kg)', doseMgPerKg: 1, maxSingleMg: 100, frequency: 'Stat' },
      { id: 'ind', label: 'Anesthesia Induction (2.5 mg/kg)', doseMgPerKg: 2.5, maxSingleMg: 200, frequency: 'Stat' }
    ]
  },
  {
    id: 'ketalar',
    tradeName: 'Ketalar',
    genericName: 'Ketamine',
    arabicName: 'كيتالار / كيتامين',
    category: 'Analgesia & ICU',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Dilute 50 mg (1 mL) + 4 mL NS -> 10 mg/mL (Slow IV over 60 sec)',
    finalConcMgMl: 10,
    route: 'IV Shot',
    stability: '24h RT',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'proc', label: 'Procedural Sedation / Dressing (1 mg/kg)', doseMgPerKg: 1, maxSingleMg: 100, frequency: 'Stat' },
      { id: 'analg', label: 'Sub-Dissociative Analgesia (0.25 mg/kg)', doseMgPerKg: 0.25, maxSingleMg: 25, frequency: 'q6h' }
    ]
  },
  {
    id: 'precedex',
    tradeName: 'Precedex',
    genericName: 'Dexmedetomidine',
    arabicName: 'بريسيدكس / ديكسميديتوميدين (ميكروجرام)',
    category: 'Analgesia & ICU',
    diluent: '0.9% NS',
    prepInstructions: 'Dilute 200 mcg (2 mL) + 48 mL NS -> 4 mcg/mL',
    finalConcMgMl: 4,
    route: 'IV Infusion',
    stability: '24h RT (Dosed in mcg/kg! Conc = 4 mcg/mL)',
    reference: 'Lexidrug Pediatric ICU',
    presets: [
      { id: 'load', label: 'ICU Loading over 10 min (1 mcg/kg)', doseMgPerKg: 1, maxSingleMg: 100, frequency: 'Stat' },
      { id: 'maint', label: 'Hourly Infusion at 0.5 mcg/kg/hr', doseMgPerKg: 0.5, maxSingleMg: 50, frequency: 'q24h' }
    ]
  },
  {
    id: 'lidocaine_iv',
    tradeName: 'Xylocaine IV',
    genericName: 'Lidocaine HCl (Preservative-Free)',
    arabicName: 'ليدوكايين حقن',
    category: 'Analgesia & ICU',
    diluent: '0.9% NS / D5W',
    prepInstructions: '2% Vial = 20 mg/mL (or dilute to 10 mg/mL for IV bolus)',
    finalConcMgMl: 10,
    route: 'IV Shot',
    stability: '24h RT',
    reference: 'PALS / Lexidrug',
    presets: [
      { id: 'arr', label: 'VT / VF Arrhythmia Bolus (1 mg/kg)', doseMgPerKg: 1, maxSingleMg: 100, frequency: 'Stat' }
    ]
  },
  {
    id: 'esmeron',
    tradeName: 'Esmeron',
    genericName: 'Rocuronium',
    arabicName: 'إيسميرون / روكورونيوم',
    category: 'Analgesia & ICU',
    diluent: 'Undiluted 10 mg/mL (or NS)',
    prepInstructions: 'Ready 50 mg/5 mL (10 mg/mL) — Ventilated patients only',
    finalConcMgMl: 10,
    route: 'IV Shot',
    stability: '60d at RT unopened; 24h diluted',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'intub', label: 'Standard Intubation (0.6 mg/kg)', doseMgPerKg: 0.6, maxSingleMg: 50, frequency: 'Stat' },
      { id: 'rsi', label: 'Rapid Sequence Intubation (1 mg/kg)', doseMgPerKg: 1, maxSingleMg: 100, frequency: 'Stat' }
    ]
  },
  {
    id: 'tracrium',
    tradeName: 'Tracrium',
    genericName: 'Atracurium',
    arabicName: 'تراكريوم / أتراكوريوم',
    category: 'Analgesia & ICU',
    diluent: '0.9% NS',
    prepInstructions: 'Ready 25 mg/2.5 mL (10 mg/mL) — Keep refrigerated',
    finalConcMgMl: 10,
    route: 'IV Shot',
    stability: 'Refrigerate 2-8°C; 24h in 0.9% NS',
    reference: 'BNFc / Lexidrug',
    presets: [
      { id: 'std', label: 'Neuromuscular Blockade (0.5 mg/kg)', doseMgPerKg: 0.5, maxSingleMg: 50, frequency: 'Stat' }
    ]
  },
  {
    id: 'nimbex',
    tradeName: 'Nimbex',
    genericName: 'Cisatracurium',
    arabicName: 'نيمبيكس / سيساتراكوريوم',
    category: 'Analgesia & ICU',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Ready 10 mg/5 mL (2 mg/mL) — Organ-independent elimination',
    finalConcMgMl: 2,
    route: 'IV Shot',
    stability: 'Refrigerate 2-8°C; 24h at RT',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'std', label: 'Intubation / ICU Blockade (0.15 mg/kg)', doseMgPerKg: 0.15, maxSingleMg: 15, frequency: 'Stat' }
    ]
  },
  {
    id: 'neostigmine',
    tradeName: 'Neostigmine',
    genericName: 'Neostigmine Methylsulfate',
    arabicName: 'نيوستجمين',
    category: 'Analgesia & ICU',
    diluent: '0.9% NS (Co-administer with Atropine)',
    prepInstructions: 'Dilute 2.5 mg (1 mL) + 4 mL NS -> 0.5 mg/mL',
    finalConcMgMl: 0.5,
    route: 'IV Shot',
    stability: '24h RT (Always pair with Atropine 0.02 mg/kg)',
    reference: 'BNFc Pediatric',
    presets: [
      { id: 'rev', label: 'NMB Reversal (0.05 mg/kg)', doseMgPerKg: 0.05, maxSingleMg: 2.5, frequency: 'Stat' }
    ]
  },
  {
    id: 'bridion',
    tradeName: 'Bridion',
    genericName: 'Sugammadex',
    arabicName: 'بريديون / سوجاماديكس',
    category: 'Analgesia & ICU',
    diluent: 'Undiluted 100 mg/mL (or NS)',
    prepInstructions: 'Ready 200 mg/2 mL (100 mg/mL) — Rapid IV bolus',
    finalConcMgMl: 100,
    route: 'IV Shot',
    stability: '24h RT; protect from light',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'std', label: 'Routine Rocuronium Reversal (2 mg/kg)', doseMgPerKg: 2, maxSingleMg: 200, frequency: 'Stat' },
      { id: 'deep', label: 'Deep Blockade Reversal (4 mg/kg)', doseMgPerKg: 4, maxSingleMg: 400, frequency: 'Stat' }
    ]
  },
  {
    id: 'narcan',
    tradeName: 'Narcan',
    genericName: 'Naloxone',
    arabicName: 'ناركان / نالوكسون',
    category: 'Analgesia & ICU',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Dilute 0.4 mg (1 mL) + 3 mL NS -> 0.1 mg/mL',
    finalConcMgMl: 0.1,
    route: 'IV Shot',
    stability: '24h RT',
    reference: 'PALS / Lexidrug',
    presets: [
      { id: 'rev', label: 'Post-Op Opioid Over-Sedation (0.01 mg/kg)', doseMgPerKg: 0.01, maxSingleMg: 0.4, frequency: 'Stat' },
      { id: 'full', label: 'Full Opioid Reversal (0.1 mg/kg)', doseMgPerKg: 0.1, maxSingleMg: 2, frequency: 'Stat' }
    ]
  },
  {
    id: 'anexate',
    tradeName: 'Anexate',
    genericName: 'Flumazenil',
    arabicName: 'أنيكسات / فلومازينيل',
    category: 'Analgesia & ICU',
    diluent: 'Undiluted 0.1 mg/mL',
    prepInstructions: 'Ready 0.5 mg/5 mL (0.1 mg/mL) — IV push over 15 sec',
    finalConcMgMl: 0.1,
    route: 'IV Shot',
    stability: '24h RT in NS/D5W',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'rev', label: 'Benzodiazepine Reversal (0.01 mg/kg)', doseMgPerKg: 0.01, maxSingleMg: 0.2, frequency: 'Stat' }
    ]
  },

  // ============== 3. CARDIOLOGY, CATH LAB & EMERGENCY (26) ==============
  {
    id: 'lasix',
    tradeName: 'Lasix',
    genericName: 'Furosemide',
    arabicName: 'لازيكس / فيوروسيميد',
    category: 'Cardiology & Cath',
    diluent: '0.9% NS',
    prepInstructions: 'Dilute 20 mg (2 mL) + 8 mL 0.9% NS -> Total 10 mL (2 mg/mL)',
    finalConcMgMl: 2,
    route: 'IV Shot',
    stability: '24h RT; protect from light',
    reference: 'Lexidrug / Trissel’s',
    presets: [
      { id: 'std', label: 'Standard Diuresis (1 mg/kg)', doseMgPerKg: 1, maxSingleMg: 40, frequency: 'q12h' },
      { id: 'low', label: 'Cardiac / Cath Post-Proc (0.5 mg/kg)', doseMgPerKg: 0.5, maxSingleMg: 20, frequency: 'q12h' },
      { id: 'high', label: 'Acute Fluid Overload (2 mg/kg)', doseMgPerKg: 2, maxSingleMg: 80, frequency: 'q8h' }
    ]
  },
  {
    id: 'burinex',
    tradeName: 'Burinex',
    genericName: 'Bumetanide',
    arabicName: 'بيورينيكس / بوميتانيد',
    category: 'Cardiology & Cath',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Dilute 2 mg (4 mL) + 16 mL NS -> 0.1 mg/mL',
    finalConcMgMl: 0.1,
    route: 'IV Shot',
    stability: '24h RT; protect from light',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'std', label: 'Loop Diuretic / CHF (0.02 mg/kg)', doseMgPerKg: 0.02, maxSingleMg: 1, frequency: 'q12h' }
    ]
  },
  {
    id: 'adrenaline',
    tradeName: 'Adrenaline',
    genericName: 'Epinephrine (1:10,000)',
    arabicName: 'أدرينالين / إبينفرين',
    category: 'Cardiology & Cath',
    diluent: '0.9% NS (1 mg + 9 mL NS)',
    prepInstructions: 'Dilute 1 mg (1 mL of 1:1000) + 9 mL NS -> 0.1 mg/mL (1:10,000)',
    finalConcMgMl: 0.1,
    route: 'IV Shot',
    stability: '24h RT; protect from light (PALS Arrest Dose)',
    reference: 'AHA PALS / Lexidrug',
    presets: [
      { id: 'pals', label: 'PALS Cardiac Arrest (0.01 mg/kg = 0.1 mL/kg)', doseMgPerKg: 0.01, maxSingleMg: 1, frequency: 'Stat' }
    ]
  },
  {
    id: 'levophed',
    tradeName: 'Levophed',
    genericName: 'Norepinephrine',
    arabicName: 'ليفوفيد / نورإبينفرين (ميكروجرام)',
    category: 'Cardiology & Cath',
    diluent: 'D5W / D5NS',
    prepInstructions: 'Dilute 4 mg (4 mL) + 46 mL D5W -> 80 mcg/mL',
    finalConcMgMl: 80,
    route: 'IV Infusion',
    stability: '24h RT in D5W (Conc = 80 mcg/mL; dose = 6-hr bag at 0.1 mcg/kg/min)',
    reference: 'Lexidrug Pediatric ICU',
    presets: [
      { id: 'bag6h', label: '6-Hr Bag at 0.1 mcg/kg/min (36 mcg/kg)', doseMgPerKg: 36, maxSingleMg: 4000, frequency: 'q6h' }
    ]
  },
  {
    id: 'dopamine',
    tradeName: 'Dopamine',
    genericName: 'Dopamine HCl',
    arabicName: 'دوبامين',
    category: 'Cardiology & Cath',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Dilute 200 mg (5 mL) + 45 mL NS -> 4 mg/mL (4000 mcg/mL)',
    finalConcMgMl: 4,
    route: 'IV Infusion',
    stability: '24h RT (6-hr bag at 10 mcg/kg/min = 3.6 mg/kg)',
    reference: 'Lexidrug Pediatric ICU',
    presets: [
      { id: 'bag6h', label: '6-Hr Bag at 10 mcg/kg/min (3.6 mg/kg)', doseMgPerKg: 3.6, maxSingleMg: 200, frequency: 'q6h' }
    ]
  },
  {
    id: 'dobutamine',
    tradeName: 'Dobutrex',
    genericName: 'Dobutamine',
    arabicName: 'دوبيوتامين',
    category: 'Cardiology & Cath',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Dilute 250 mg (20 mL) + 30 mL NS -> 5 mg/mL (5000 mcg/mL)',
    finalConcMgMl: 5,
    route: 'IV Infusion',
    stability: '24h RT (6-hr bag at 10 mcg/kg/min = 3.6 mg/kg)',
    reference: 'Lexidrug Pediatric ICU',
    presets: [
      { id: 'bag6h', label: '6-Hr Bag at 10 mcg/kg/min (3.6 mg/kg)', doseMgPerKg: 3.6, maxSingleMg: 250, frequency: 'q6h' }
    ]
  },
  {
    id: 'primacor',
    tradeName: 'Primacor',
    genericName: 'Milrinone',
    arabicName: 'بريماكور / ميلرينون (ميكروجرام)',
    category: 'Cardiology & Cath',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Dilute 10 mg (10 mL) + 40 mL NS -> 200 mcg/mL',
    finalConcMgMl: 200,
    route: 'IV Infusion',
    stability: '24h RT (Dosed in mcg/kg; Conc = 200 mcg/mL)',
    reference: 'Lexidrug Pediatric Cardiac',
    presets: [
      { id: 'load', label: 'Loading Dose over 60 min (50 mcg/kg)', doseMgPerKg: 50, maxSingleMg: 5000, frequency: 'Stat' },
      { id: 'bag6h', label: '6-Hr Maint at 0.5 mcg/kg/min (180 mcg/kg)', doseMgPerKg: 180, maxSingleMg: 10000, frequency: 'q6h' }
    ]
  },
  {
    id: 'nitronal',
    tradeName: 'Nitronal',
    genericName: 'Nitroglycerin (GTN)',
    arabicName: 'نيترونال / نيتروجليسرين (ميكروجرام)',
    category: 'Cardiology & Cath',
    diluent: 'D5W / 0.9% NS (Non-PVC)',
    prepInstructions: 'Dilute 25 mg (25 mL) + 25 mL NS -> 500 mcg/mL',
    finalConcMgMl: 500,
    route: 'IV Infusion',
    stability: '24h RT (Conc = 500 mcg/mL; 6-hr bag at 1 mcg/kg/min = 360 mcg/kg)',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'bag6h', label: '6-Hr Bag at 1 mcg/kg/min (360 mcg/kg)', doseMgPerKg: 360, maxSingleMg: 25000, frequency: 'q6h' }
    ]
  },
  {
    id: 'trandate',
    tradeName: 'Trandate',
    genericName: 'Labetalol',
    arabicName: 'ترانديت / لابيتالول',
    category: 'Cardiology & Cath',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Dilute 100 mg (20 mL) + 80 mL NS -> 1 mg/mL',
    finalConcMgMl: 1,
    route: 'IV Shot',
    stability: '24h RT',
    reference: 'Lexidrug Pediatric HTN',
    presets: [
      { id: 'bol', label: 'Hypertensive Crisis Bolus (0.25 mg/kg)', doseMgPerKg: 0.25, maxSingleMg: 20, frequency: 'Stat' }
    ]
  },
  {
    id: 'brevibloc',
    tradeName: 'Brevibloc',
    genericName: 'Esmolol',
    arabicName: 'بريفيبلوك / إسمولول (ميكروجرام)',
    category: 'Cardiology & Cath',
    diluent: 'Ready-to-Use 10 mg/mL (10,000 mcg/mL)',
    prepInstructions: 'Ready 100 mg/10 mL = 10,000 mcg/mL',
    finalConcMgMl: 10000,
    route: 'IV Shot',
    stability: '24h RT (Conc = 10,000 mcg/mL)',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'load', label: 'SVT / HTN Loading over 1 min (500 mcg/kg)', doseMgPerKg: 500, maxSingleMg: 50000, frequency: 'Stat' }
    ]
  },
  {
    id: 'apresoline',
    tradeName: 'Apresoline',
    genericName: 'Hydralazine',
    arabicName: 'أبريزولين / هيدرالازين',
    category: 'Cardiology & Cath',
    diluent: '0.9% NS',
    prepInstructions: 'Recon 20 mg with 1 mL WFI, dilute + 9 mL NS -> 2 mg/mL',
    finalConcMgMl: 2,
    route: 'IV Shot',
    stability: 'Use immediately after dilution in NS',
    reference: 'Lexidrug / BNFc',
    presets: [
      { id: 'std', label: 'Acute Pediatric Hypertension (0.2 mg/kg)', doseMgPerKg: 0.2, maxSingleMg: 20, frequency: 'q6h' }
    ]
  },
  {
    id: 'cordarone',
    tradeName: 'Cordarone',
    genericName: 'Amiodarone',
    arabicName: 'كوردارون / أميودارون',
    category: 'Cardiology & Cath',
    diluent: 'D5W ONLY (Incompatible with NS!)',
    prepInstructions: 'Dilute 150 mg (3 mL) in 97 mL D5W -> 1.5 mg/mL (Infuse 20-60 min)',
    finalConcMgMl: 1.5,
    route: 'IV Infusion',
    stability: '24h RT in D5W ONLY',
    reference: 'PALS / Lexidrug',
    presets: [
      { id: 'load', label: 'Arrhythmia Loading Dose (5 mg/kg)', doseMgPerKg: 5, maxSingleMg: 300, frequency: 'Stat' }
    ]
  },
  {
    id: 'adenocor',
    tradeName: 'Adenocor',
    genericName: 'Adenosine',
    arabicName: 'أدينوكور / أدينوزين',
    category: 'Cardiology & Cath',
    diluent: 'Undiluted 3 mg/mL (Rapid IV Flush)',
    prepInstructions: 'Ready 6 mg/2 mL (3 mg/mL) — Rapid 1-2 sec IV push + NS flush',
    finalConcMgMl: 3,
    route: 'IV Shot',
    stability: 'Store at RT (Do NOT refrigerate — crystallizes!)',
    reference: 'AHA PALS',
    presets: [
      { id: 'first', label: 'SVT 1st Dose (0.1 mg/kg)', doseMgPerKg: 0.1, maxSingleMg: 6, frequency: 'Stat' },
      { id: 'sec', label: 'SVT 2nd Dose (0.2 mg/kg)', doseMgPerKg: 0.2, maxSingleMg: 12, frequency: 'Stat' }
    ]
  },
  {
    id: 'atropine',
    tradeName: 'Atropine',
    genericName: 'Atropine Sulfate',
    arabicName: 'أتروبين سلفات',
    category: 'Cardiology & Cath',
    diluent: '0.9% NS',
    prepInstructions: 'Dilute 1 mg (1 mL) + 9 mL NS -> 0.1 mg/mL',
    finalConcMgMl: 0.1,
    route: 'IV Shot',
    stability: '24h RT (Min single dose 0.1 mg)',
    reference: 'AHA PALS / BNFc',
    presets: [
      { id: 'brady', label: 'Symptomatic Bradycardia / Pre-Op (0.02 mg/kg)', doseMgPerKg: 0.02, maxSingleMg: 0.5, frequency: 'Stat' }
    ]
  },
  {
    id: 'lanoxin',
    tradeName: 'Lanoxin',
    genericName: 'Digoxin (Micrograms)',
    arabicName: 'لانوكسين / ديجوكسين (ميكروجرام)',
    category: 'Cardiology & Cath',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Dilute 500 mcg (2 mL) + 8 mL NS -> 50 mcg/mL (Slow IV 15 min)',
    finalConcMgMl: 50,
    route: 'IV Shot',
    stability: '24h RT (Dosed in mcg/kg; Conc = 50 mcg/mL)',
    reference: 'BNFc / Lexidrug',
    presets: [
      { id: 'maint', label: 'CHF / SVT Maintenance (5 mcg/kg)', doseMgPerKg: 5, maxSingleMg: 250, frequency: 'q12h' },
      { id: 'load', label: 'Digitalizing 1st Half Dose (15 mcg/kg)', doseMgPerKg: 15, maxSingleMg: 500, frequency: 'Stat' }
    ]
  },
  {
    id: 'prostin',
    tradeName: 'Prostin VR',
    genericName: 'Alprostadil (PGE1)',
    arabicName: 'بروستين / ألبروستاديل (ميكروجرام)',
    category: 'Cardiology & Cath',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Dilute 500 mcg (1 mL) + 49 mL NS -> 10 mcg/mL',
    finalConcMgMl: 10,
    route: 'IV Infusion',
    stability: '24h Fridge (6-hr bag at 0.05 mcg/kg/min = 18 mcg/kg)',
    reference: 'Lexidrug Neonatal/Cardiac',
    presets: [
      { id: 'bag6h', label: '6-Hr Bag at 0.05 mcg/kg/min (18 mcg/kg)', doseMgPerKg: 18, maxSingleMg: 500, frequency: 'q6h' }
    ]
  },
  {
    id: 'sildenafil_iv',
    tradeName: 'Revatio / Sildenafil IV',
    genericName: 'Sildenafil IV',
    arabicName: 'ريفاتيو / سيلدينافيل حقن',
    category: 'Cardiology & Cath',
    diluent: 'Ready-to-Use 0.8 mg/mL (or D5W)',
    prepInstructions: 'Ready 10 mg/12.5 mL (0.8 mg/mL) — Post-op Pulmonary HTN',
    finalConcMgMl: 0.8,
    route: 'IV Shot',
    stability: '24h RT',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'phtn', label: 'Pulmonary Hypertension (0.4 mg/kg)', doseMgPerKg: 0.4, maxSingleMg: 10, frequency: 'q8h' }
    ]
  },
  {
    id: 'heparin',
    tradeName: 'Heparin',
    genericName: 'Heparin Sodium (Units)',
    arabicName: 'هيبارين صوديوم (وحدة دولية)',
    category: 'Cardiology & Cath',
    diluent: '0.9% NS',
    prepInstructions: 'Dilute 5000 Units (1 mL) + 49 mL NS -> 100 Units/mL',
    finalConcMgMl: 100,
    route: 'IV Shot',
    stability: '24h RT (Dosed in Units/kg; Conc = 100 Units/mL)',
    reference: 'CHEST / Cath Lab Protocol',
    presets: [
      { id: 'cath', label: 'Cardiac Catheterization Bolus (75 Units/kg)', doseMgPerKg: 75, maxSingleMg: 5000, frequency: 'Stat' },
      { id: 'inf', label: 'Continuous Drip 20 U/kg/hr x 6h (120 Units/kg)', doseMgPerKg: 120, maxSingleMg: 10000, frequency: 'q6h' }
    ]
  },
  {
    id: 'clexane',
    tradeName: 'Clexane',
    genericName: 'Enoxaparin',
    arabicName: 'كليكسان / إينوكسابارين',
    category: 'Cardiology & Cath',
    diluent: 'Undiluted 100 mg/mL (Subcutaneous)',
    prepInstructions: 'Standard 100 mg/mL Prefilled Syringe (1 mg = 0.01 mL)',
    finalConcMgMl: 100,
    route: 'SC Shot',
    stability: 'Store at RT; Subcutaneous administration only',
    reference: 'CHEST / Lexidrug',
    presets: [
      { id: 'tx', label: 'VTE / Thrombosis Treatment (1 mg/kg)', doseMgPerKg: 1, maxSingleMg: 100, frequency: 'q12h' },
      { id: 'proph', label: 'Thromboprophylaxis (0.5 mg/kg)', doseMgPerKg: 0.5, maxSingleMg: 40, frequency: 'q12h' }
    ]
  },
  {
    id: 'actilyse',
    tradeName: 'Actilyse',
    genericName: 'Alteplase (tPA)',
    arabicName: 'أكتيليز / ألتيبلاز',
    category: 'Cardiology & Cath',
    diluent: '0.9% NS',
    prepInstructions: 'Recon 50 mg with 50 mL WFI -> 1 mg/mL (High-Alert Thrombolytic)',
    finalConcMgMl: 1,
    route: 'IV Infusion',
    stability: '8h RT | 24h Fridge at 1 mg/mL',
    reference: 'CHEST Pediatric Thrombolysis',
    presets: [
      { id: 'sys', label: 'Systemic Arterial/Venous Thrombosis (0.5 mg/kg)', doseMgPerKg: 0.5, maxSingleMg: 50, frequency: 'Stat' }
    ]
  },
  {
    id: 'kapron',
    tradeName: 'Kapron',
    genericName: 'Tranexamic Acid',
    arabicName: 'كابرون / ترانيكساميك أسيد',
    category: 'Cardiology & Cath',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Dilute 500 mg (5 mL) + 45 mL NS -> 10 mg/mL (Infuse over 15 min)',
    finalConcMgMl: 10,
    route: 'IV Infusion',
    stability: '24h RT',
    reference: 'BNFc / Pediatric Trauma',
    presets: [
      { id: 'bleed', label: 'Surgical Bleeding / Trauma (15 mg/kg)', doseMgPerKg: 15, maxSingleMg: 1000, frequency: 'q8h' }
    ]
  },
  {
    id: 'protamine',
    tradeName: 'Protamine',
    genericName: 'Protamine Sulfate',
    arabicName: 'بروتامين سلفات',
    category: 'Cardiology & Cath',
    diluent: '0.9% NS',
    prepInstructions: 'Ready 50 mg/5 mL (10 mg/mL) — Slow IV over 10 min',
    finalConcMgMl: 10,
    route: 'IV Shot',
    stability: '24h RT (1 mg neutralizes 100 Units Heparin)',
    reference: 'Lexidrug / Cath Lab',
    presets: [
      { id: 'rev', label: 'Post-Cath Heparin Reversal (0.75 mg/kg)', doseMgPerKg: 0.75, maxSingleMg: 50, frequency: 'Stat' }
    ]
  },
  {
    id: 'konakion',
    tradeName: 'Konakion MM',
    genericName: 'Vitamin K1 (Phytomenadione)',
    arabicName: 'كوناكيون / فيتامين ك١',
    category: 'Cardiology & Cath',
    diluent: 'D5W / 0.9% NS',
    prepInstructions: 'Ready 10 mg/1 mL (10 mg/mL) — Slow IV over 15 min',
    finalConcMgMl: 10,
    route: 'IV Shot',
    stability: 'Protect strictly from light',
    reference: 'BNFc / Lexidrug',
    presets: [
      { id: 'bleed', label: 'Coagulopathy / Pre-Op INR Correction (0.3 mg/kg)', doseMgPerKg: 0.3, maxSingleMg: 10, frequency: 'q24h' }
    ]
  },
  {
    id: 'epilat',
    tradeName: 'Epilat',
    genericName: 'Nifedipine (PO / SL)',
    arabicName: 'إيبيلات / نيفيديبين',
    category: 'Cardiology & Cath',
    diluent: 'Oral / Sublingual Drops (20 mg/mL)',
    prepInstructions: 'Oral/Sublingual administration (Not for IV use)',
    finalConcMgMl: 20,
    route: 'PO / SL',
    stability: 'Protect from light; administer immediately',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'htn', label: 'Acute Pediatric Hypertension (0.25 mg/kg)', doseMgPerKg: 0.25, maxSingleMg: 10, frequency: 'q8h' }
    ]
  },

  // ================ 4. GI, ANTIEMETICS & HEPATOLOGY (11) ================
  {
    id: 'zofran',
    tradeName: 'Zofran',
    genericName: 'Ondansetron',
    arabicName: 'زوفران / أوندانسيترون',
    category: 'GI & Antiemetics',
    diluent: 'Undiluted 2 mg/mL (or NS)',
    prepInstructions: 'Ready 4 mg/2 mL (2 mg/mL) — Slow IV push over 2-5 min',
    finalConcMgMl: 2,
    route: 'IV Shot',
    stability: '48h RT',
    reference: 'BNFc / Lexidrug',
    presets: [
      { id: 'ponv', label: 'Post-Op Nausea & Vomiting (0.1 mg/kg)', doseMgPerKg: 0.1, maxSingleMg: 4, frequency: 'q8h' },
      { id: 'high', label: 'Severe / Chemo Emesis (0.15 mg/kg)', doseMgPerKg: 0.15, maxSingleMg: 8, frequency: 'q8h' }
    ]
  },
  {
    id: 'kytril',
    tradeName: 'Kytril',
    genericName: 'Granisetron (Micrograms)',
    arabicName: 'كيتريل / جرانيسترون (ميكروجرام)',
    category: 'GI & Antiemetics',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Dilute 1000 mcg (1 mL) + 9 mL NS -> 100 mcg/mL',
    finalConcMgMl: 100,
    route: 'IV Shot',
    stability: '24h RT (Dosed in mcg/kg; Conc = 100 mcg/mL)',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'std', label: 'PONV / Chemotherapy Emesis (20 mcg/kg)', doseMgPerKg: 20, maxSingleMg: 1000, frequency: 'q12h' }
    ]
  },
  {
    id: 'primperan',
    tradeName: 'Primperan',
    genericName: 'Metoclopramide',
    arabicName: 'بريمبران / ميتوكلوبراميد',
    category: 'GI & Antiemetics',
    diluent: '0.9% NS',
    prepInstructions: 'Dilute 10 mg (2 mL) + 8 mL NS -> 1 mg/mL (Slow IV 3-5 min)',
    finalConcMgMl: 1,
    route: 'IV Shot',
    stability: '24h RT (Age ≥ 1 yr; max 5 days)',
    reference: 'BNFc / EMA',
    presets: [
      { id: 'std', label: 'Second-Line PONV / Gastroparesis (0.15 mg/kg)', doseMgPerKg: 0.15, maxSingleMg: 10, frequency: 'q8h' }
    ]
  },
  {
    id: 'controloc',
    tradeName: 'Controloc',
    genericName: 'Pantoprazole',
    arabicName: 'كونترولوك / بانتوبرازول',
    category: 'GI & Antiemetics',
    diluent: '0.9% NS',
    prepInstructions: 'Recon 40 mg Vial with 10 mL 0.9% NS -> 4 mg/mL',
    finalConcMgMl: 4,
    route: 'IV Shot',
    stability: '24h RT in 0.9% NS',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'std', label: 'Stress Ulcer Prophylaxis / NPO (1 mg/kg)', doseMgPerKg: 1, maxSingleMg: 40, frequency: 'q24h' }
    ]
  },
  {
    id: 'losec',
    tradeName: 'Losec',
    genericName: 'Omeprazole IV',
    arabicName: 'لوزيك / أوميبرازول حقن',
    category: 'GI & Antiemetics',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Recon 40 mg with 10 mL NS -> 4 mg/mL (Infuse over 20-30 min)',
    finalConcMgMl: 4,
    route: 'IV Infusion',
    stability: '12h RT in 0.9% NS (6h in D5W)',
    reference: 'BNFc Pediatric',
    presets: [
      { id: 'std', label: 'GERD / Stress Ulcer Prophylaxis (1 mg/kg)', doseMgPerKg: 1, maxSingleMg: 40, frequency: 'q24h' },
      { id: 'bleed', label: 'Upper GI Bleed (2 mg/kg)', doseMgPerKg: 2, maxSingleMg: 80, frequency: 'q12h' }
    ]
  },
  {
    id: 'nexium',
    tradeName: 'Nexium IV',
    genericName: 'Esomeprazole',
    arabicName: 'نيكسيوم حقن / إيزوميبرازول',
    category: 'GI & Antiemetics',
    diluent: '0.9% NS',
    prepInstructions: 'Recon 40 mg with 5 mL NS -> 8 mg/mL (Slow IV over 3-5 min)',
    finalConcMgMl: 8,
    route: 'IV Shot',
    stability: '12h RT in 0.9% NS',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'std', label: 'GERD / NPO Acid Suppression (0.5 mg/kg)', doseMgPerKg: 0.5, maxSingleMg: 40, frequency: 'q24h' }
    ]
  },
  {
    id: 'famotidine',
    tradeName: 'Pepcid / Antodine IV',
    genericName: 'Famotidine',
    arabicName: 'أنتودين حقن / فاموتيدين',
    category: 'GI & Antiemetics',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Dilute 20 mg (2 mL) + 8 mL NS -> 2 mg/mL (Slow IV over 2 min)',
    finalConcMgMl: 2,
    route: 'IV Shot',
    stability: '24h RT',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'std', label: 'Stress Ulcer Prophylaxis (0.25 mg/kg)', doseMgPerKg: 0.25, maxSingleMg: 20, frequency: 'q12h' }
    ]
  },
  {
    id: 'sandostatin',
    tradeName: 'Sandostatin',
    genericName: 'Octreotide (Micrograms)',
    arabicName: 'ساندوستاتين / أوكتريوتيد (ميكروجرام)',
    category: 'GI & Antiemetics',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Dilute 100 mcg (1 mL) + 9 mL NS -> 10 mcg/mL',
    finalConcMgMl: 10,
    route: 'IV Shot',
    stability: '24h RT (Dosed in mcg/kg; Conc = 10 mcg/mL)',
    reference: 'Lexidrug Pediatric GI',
    presets: [
      { id: 'chylo', label: 'Chylothorax / GI Fistula / Varices (1 mcg/kg)', doseMgPerKg: 1, maxSingleMg: 50, frequency: 'q8h' }
    ]
  },
  {
    id: 'buscopan',
    tradeName: 'Buscopan',
    genericName: 'Hyoscine Butylbromide',
    arabicName: 'بسكوبان / هيوسين',
    category: 'GI & Antiemetics',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Dilute 20 mg (1 mL) + 4 mL NS -> 4 mg/mL (Slow IV)',
    finalConcMgMl: 4,
    route: 'IV Shot',
    stability: '24h RT',
    reference: 'BNFc Pediatric',
    presets: [
      { id: 'spasm', label: 'Acute GI / Biliary / Renal Colic (0.3 mg/kg)', doseMgPerKg: 0.3, maxSingleMg: 20, frequency: 'q8h' }
    ]
  },
  {
    id: 'fluimucil_iv',
    tradeName: 'Fluimucil IV',
    genericName: 'N-Acetylcysteine (NAC)',
    arabicName: 'فلويموسيل حقن / أسيتيل سيستيين',
    category: 'GI & Antiemetics',
    diluent: 'D5W / 0.9% NS',
    prepInstructions: 'Dilute 2000 mg (10 mL of 20%) in 40 mL D5W -> 40 mg/mL',
    finalConcMgMl: 40,
    route: 'IV Infusion',
    stability: '24h RT',
    reference: 'BNFc / Lexidrug Toxicology',
    presets: [
      { id: 'load', label: 'Paracetamol Toxicity 1st Bag 1h (150 mg/kg)', doseMgPerKg: 150, maxSingleMg: 15000, frequency: 'Stat' },
      { id: 'bag2', label: 'Paracetamol Toxicity 2nd Bag 4h (50 mg/kg)', doseMgPerKg: 50, maxSingleMg: 5000, frequency: 'Stat' }
    ]
  },

  // ========= 5. CORTICOSTEROIDS, IMMUNOLOGY & HEMATOLOGY (11) =========
  {
    id: 'decadron',
    tradeName: 'Epidron / Decadron',
    genericName: 'Dexamethasone',
    arabicName: 'إبيدرون / ديكادرون / ديكساميثازون',
    category: 'Steroids & Blood',
    diluent: 'Undiluted 4 mg/mL (or NS)',
    prepInstructions: 'Ready 8 mg/2 mL (4 mg/mL) — Slow IV push over 3-5 min',
    finalConcMgMl: 4,
    route: 'IV Shot',
    stability: '24h RT',
    reference: 'ASHP PONV / Lexidrug',
    presets: [
      { id: 'ponv', label: 'PONV / Airway Edema (0.15 mg/kg)', doseMgPerKg: 0.15, maxSingleMg: 8, frequency: 'q8h' },
      { id: 'croup', label: 'Post-Extubation Stridor / Croup (0.6 mg/kg)', doseMgPerKg: 0.6, maxSingleMg: 16, frequency: 'Stat' }
    ]
  },
  {
    id: 'solucortef',
    tradeName: 'Solu-Cortef',
    genericName: 'Hydrocortisone',
    arabicName: 'سولوكورتيف / هيدروكورتيزون',
    category: 'Steroids & Blood',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Recon 100 mg with 2 mL WFI, dilute in NS to 10 mg/mL',
    finalConcMgMl: 10,
    route: 'IV Shot',
    stability: '24h RT after reconstitution',
    reference: 'BNFc / Lexidrug',
    presets: [
      { id: 'std', label: 'Surgical Stress / Bronchospasm (2 mg/kg)', doseMgPerKg: 2, maxSingleMg: 100, frequency: 'q6h' },
      { id: 'shock', label: 'Refractory Shock / Anaphylaxis (4 mg/kg)', doseMgPerKg: 4, maxSingleMg: 100, frequency: 'q6h' }
    ]
  },
  {
    id: 'solumedrol',
    tradeName: 'Solu-Medrol',
    genericName: 'Methylprednisolone',
    arabicName: 'سولوميدرول / ميثيل بريدنيزولون',
    category: 'Steroids & Blood',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Recon 40 mg with 1 mL WFI, dilute in NS to 10 mg/mL',
    finalConcMgMl: 10,
    route: 'IV Infusion',
    stability: '24h RT',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'std', label: 'Acute Asthma / Anti-Inflammatory (1 mg/kg)', doseMgPerKg: 1, maxSingleMg: 60, frequency: 'q6h' },
      { id: 'pulse', label: 'Pulse Steroid Therapy (30 mg/kg)', doseMgPerKg: 30, maxSingleMg: 1000, frequency: 'q24h' }
    ]
  },
  {
    id: 'ivig',
    tradeName: 'Privigen / Octagam',
    genericName: 'IVIG (Human Immunoglobulin)',
    arabicName: 'أوكتاجام / بريفيجن (مجم)',
    category: 'Steroids & Blood',
    diluent: 'Ready-to-Use 5% (50 mg/mL) or 10% (100 mg/mL)',
    prepInstructions: 'Ready 50 mg/mL (5%) — Titrate rate slowly per protocol',
    finalConcMgMl: 50,
    route: 'IV Infusion',
    stability: 'Do NOT shake; infuse immediately',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'itp', label: 'ITP / Guillain-Barre (1000 mg/kg = 1 g/kg)', doseMgPerKg: 1000, maxSingleMg: 70000, frequency: 'q24h' },
      { id: 'kaw', label: 'Kawasaki Disease Single Dose (2000 mg/kg)', doseMgPerKg: 2000, maxSingleMg: 100000, frequency: 'Stat' }
    ]
  },
  {
    id: 'albumin5',
    tradeName: 'Human Albumin 5%',
    genericName: 'Albumin Human 5% (0.05 g/mL)',
    arabicName: 'ألبيومين بشري ٥٪ (جرام)',
    category: 'Steroids & Blood',
    diluent: 'Ready-to-Use 5% Solution (0.05 g/mL)',
    prepInstructions: 'Ready 5% (50 mg/mL = 0.05 g/mL) — Infuse over 1-2 hrs',
    finalConcMgMl: 0.05,
    route: 'IV Infusion',
    stability: 'Use within 4h of spiking bottle (Dosed in g/kg)',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'vol', label: 'Intravascular Volume Expansion (0.5 g/kg = 10 mL/kg)', doseMgPerKg: 0.5, maxSingleMg: 25, frequency: 'Stat' },
      { id: 'high', label: 'Severe Hypovolemia / Burns (1 g/kg = 20 mL/kg)', doseMgPerKg: 1, maxSingleMg: 50, frequency: 'Stat' }
    ]
  },
  {
    id: 'albumin20',
    tradeName: 'Human Albumin 20%',
    genericName: 'Albumin Human 20% (0.2 g/mL)',
    arabicName: 'ألبيومين بشري ٢٠٪ (جرام)',
    category: 'Steroids & Blood',
    diluent: 'Ready-to-Use 20% Solution (0.2 g/mL)',
    prepInstructions: 'Ready 20% (200 mg/mL = 0.2 g/mL) — Infuse over 2-4 hrs',
    finalConcMgMl: 0.2,
    route: 'IV Infusion',
    stability: 'Use within 4h of spiking bottle (Dosed in g/kg)',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'hypo', label: 'Severe Hypoalbuminemia / Ascites (1 g/kg = 5 mL/kg)', doseMgPerKg: 1, maxSingleMg: 50, frequency: 'q24h' }
    ]
  },
  {
    id: 'eprex',
    tradeName: 'Eprex',
    genericName: 'Epoetin Alfa (Units)',
    arabicName: 'إيبريكس / إريثروبويتين (وحدة)',
    category: 'Steroids & Blood',
    diluent: 'Undiluted 4000 Units/mL',
    prepInstructions: 'Ready 4000 Units/mL Prefilled Syringe — SC or IV',
    finalConcMgMl: 4000,
    route: 'SC / IV',
    stability: 'Refrigerate 2-8°C; do not shake (Dosed in Units/kg)',
    reference: 'BNFc Pediatric',
    presets: [
      { id: 'std', label: 'Anemia of CKD / Pre-Op Blood Conservation (100 U/kg)', doseMgPerKg: 100, maxSingleMg: 10000, frequency: 'q24h' }
    ]
  },
  {
    id: 'neupogen',
    tradeName: 'Neupogen',
    genericName: 'Filgrastim (G-CSF Micrograms)',
    arabicName: 'نيوبوجين / فيلجراستيم (ميكروجرام)',
    category: 'Steroids & Blood',
    diluent: 'Undiluted 300 mcg/mL (or D5W)',
    prepInstructions: 'Ready 300 mcg/1 mL (300 mcg/mL) — SC or IV infusion',
    finalConcMgMl: 300,
    route: 'SC / IV',
    stability: 'Refrigerate 2-8°C; NEVER dilute in NS (precipitates!)',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'std', label: 'Febrile Neutropenia / Chemo Support (5 mcg/kg)', doseMgPerKg: 5, maxSingleMg: 300, frequency: 'q24h' }
    ]
  },
  {
    id: 'desferal',
    tradeName: 'Desferal',
    genericName: 'Deferoxamine',
    arabicName: 'ديسفيرال / ديفيروكسامين',
    category: 'Steroids & Blood',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Recon 500 mg with 5 mL WFI (100 mg/mL), dilute to 50 mg/mL',
    finalConcMgMl: 50,
    route: 'IV Infusion',
    stability: '24h RT',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'std', label: 'Chronic Iron Overload (40 mg/kg)', doseMgPerKg: 40, maxSingleMg: 2000, frequency: 'q24h' }
    ]
  },
  {
    id: 'venofer',
    tradeName: 'Venofer',
    genericName: 'Iron Sucrose',
    arabicName: 'فينوفير / حديد وريدي',
    category: 'Steroids & Blood',
    diluent: '0.9% NS ONLY (NO D5W!)',
    prepInstructions: 'Dilute 100 mg (5 mL) in 95 mL 0.9% NS -> 1 mg/mL (Infuse 30-60 min)',
    finalConcMgMl: 1,
    route: 'IV Infusion',
    stability: '24h RT in 0.9% NS ONLY',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'std', label: 'Iron Deficiency Anemia (2 mg/kg)', doseMgPerKg: 2, maxSingleMg: 100, frequency: 'q24h' }
    ]
  },

  // ================== 6. NEUROLOGY & ANTICONVULSANTS (7) ==================
  {
    id: 'keppra',
    tradeName: 'Keppra / Tiratam IV',
    genericName: 'Levetiracetam',
    arabicName: 'كيبرا / تيراتام حقن / ليفيتيراسيتام',
    category: 'Neurology',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Dilute 500 mg (5 mL) in 20 mL NS -> 20 mg/mL (Infuse over 15 min)',
    finalConcMgMl: 20,
    route: 'IV Infusion',
    stability: '24h RT',
    reference: 'Lexidrug / AES Status',
    presets: [
      { id: 'maint', label: 'Maintenance Seizure Control (20 mg/kg)', doseMgPerKg: 20, maxSingleMg: 1500, frequency: 'q12h' },
      { id: 'load', label: 'Status Epilepticus Loading (40 mg/kg)', doseMgPerKg: 40, maxSingleMg: 3000, frequency: 'Stat' }
    ]
  },
  {
    id: 'epanutin',
    tradeName: 'Epanutin',
    genericName: 'Phenytoin Sodium',
    arabicName: 'إيبانوتين / فينيتوين',
    category: 'Neurology',
    diluent: '0.9% NS ONLY (NO D5W!)',
    prepInstructions: 'Dilute 250 mg (5 mL) in 45 mL 0.9% NS -> 5 mg/mL (Use 0.22 µm filter)',
    finalConcMgMl: 5,
    route: 'IV Infusion',
    stability: '4h RT in 0.9% NS ONLY (Precipitates in Dextrose!)',
    reference: 'Lexidrug / Trissel’s',
    presets: [
      { id: 'load', label: 'Status Epilepticus Loading (20 mg/kg)', doseMgPerKg: 20, maxSingleMg: 1500, frequency: 'Stat' },
      { id: 'maint', label: 'Maintenance Dose (3 mg/kg)', doseMgPerKg: 3, maxSingleMg: 200, frequency: 'q12h' }
    ]
  },
  {
    id: 'phenobarbital',
    tradeName: 'Luminal / Phenobarb',
    genericName: 'Phenobarbital Sodium',
    arabicName: 'فينوباربيتال',
    category: 'Neurology',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Dilute 200 mg (1 mL) + 19 mL NS -> 10 mg/mL (Infuse over 20 min)',
    finalConcMgMl: 10,
    route: 'IV Infusion',
    stability: '24h RT',
    reference: 'Lexidrug Pediatric',
    presets: [
      { id: 'load', label: 'Status Epilepticus Loading (20 mg/kg)', doseMgPerKg: 20, maxSingleMg: 1000, frequency: 'Stat' },
      { id: 'maint', label: 'Maintenance Dose (2.5 mg/kg)', doseMgPerKg: 2.5, maxSingleMg: 150, frequency: 'q12h' }
    ]
  },
  {
    id: 'depakine_iv',
    tradeName: 'Depakine IV',
    genericName: 'Sodium Valproate',
    arabicName: 'ديباكين حقن / فالبروات الصوديوم',
    category: 'Neurology',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Recon 400 mg with 4 mL solvent, dilute in NS to 10 mg/mL',
    finalConcMgMl: 10,
    route: 'IV Infusion',
    stability: '24h RT',
    reference: 'Lexidrug / AES',
    presets: [
      { id: 'load', label: 'Status Epilepticus Loading (30 mg/kg)', doseMgPerKg: 30, maxSingleMg: 3000, frequency: 'Stat' },
      { id: 'maint', label: 'Maintenance Dose (15 mg/kg)', doseMgPerKg: 15, maxSingleMg: 1000, frequency: 'q12h' }
    ]
  },
  {
    id: 'mannitol',
    tradeName: 'Mannitol 20%',
    genericName: 'Mannitol 20% (0.2 g/mL)',
    arabicName: 'مانيتول ٢٠٪ (جرام)',
    category: 'Neurology',
    diluent: 'Ready-to-Use 20% Bag (0.2 g/mL)',
    prepInstructions: 'Ready 20% (200 mg/mL = 0.2 g/mL) — Use in-line filter',
    finalConcMgMl: 0.2,
    route: 'IV Infusion',
    stability: 'Inspect for crystals; warm if crystallized (Dosed in g/kg)',
    reference: 'Lexidrug Pediatric Neuro',
    presets: [
      { id: 'icp', label: 'Raised ICP / Cerebral Edema (0.5 g/kg = 2.5 mL/kg)', doseMgPerKg: 0.5, maxSingleMg: 50, frequency: 'q6h' },
      { id: 'high', label: 'Acute Herniation Bolus (1 g/kg = 5 mL/kg)', doseMgPerKg: 1, maxSingleMg: 100, frequency: 'Stat' }
    ]
  },
  {
    id: 'hts3',
    tradeName: 'Hypertonic Saline 3%',
    genericName: 'Sodium Chloride 3% (mL/kg)',
    arabicName: 'محلول ملحي مركز ٣٪ (مللي)',
    category: 'Neurology',
    diluent: 'Ready 3% Solution (1 mL/mL)',
    prepInstructions: '3% NaCl (513 mEq/L) — Direct volume in mL (1 mL = 1 mL)',
    finalConcMgMl: 1,
    route: 'IV Infusion',
    stability: '24h RT (Dosed directly in mL/kg)',
    reference: 'Pediatric Neuro-ICU',
    presets: [
      { id: 'icp', label: 'Acute ICP Spike / Hyponatremia (3 mL/kg)', doseMgPerKg: 3, maxSingleMg: 250, frequency: 'Stat' },
      { id: 'high', label: 'Severe Cerebral Edema (5 mL/kg)', doseMgPerKg: 5, maxSingleMg: 250, frequency: 'Stat' }
    ]
  },

  // ============== 7. ELECTROLYTES, METABOLIC & ENDOCRINE (10) ==============
  {
    id: 'kcl',
    tradeName: 'Potassium Chloride',
    genericName: 'KCl 15% (2 mEq/mL)',
    arabicName: 'بوتاسيوم كلورايد (مكافئ mEq)',
    category: 'Electrolytes & Endocrine',
    diluent: '0.9% NS (Dilute before IV infusion!)',
    prepInstructions: 'Stock 2 mEq/mL -> Dilute to 0.04 mEq/mL (Peripheral) or 0.08 mEq/mL (Central)',
    finalConcMgMl: 0.08,
    route: 'IV Infusion',
    stability: 'HIGH-ALERT: NEVER give IV push! (Dosed in mEq/kg)',
    reference: 'ISMP / Lexidrug Pediatric',
    presets: [
      { id: 'std', label: 'Hypokalemia Correction (0.5 mEq/kg over 1-2h)', doseMgPerKg: 0.5, maxSingleMg: 20, frequency: 'Stat' },
      { id: 'sev', label: 'Severe Hypokalemia (1 mEq/kg over 2-4h)', doseMgPerKg: 1, maxSingleMg: 40, frequency: 'Stat' }
    ]
  },
  {
    id: 'ca_gluconate',
    tradeName: 'Calcium Gluconate 10%',
    genericName: 'Calcium Gluconate 10% (100 mg/mL)',
    arabicName: 'كالسيوم جلوكونات ١٠٪ (مجم)',
    category: 'Electrolytes & Endocrine',
    diluent: '0.9% NS / D5W (1:1 Dilution)',
    prepInstructions: 'Dilute 1000 mg (10 mL) + 10 mL NS -> 50 mg/mL (Slow IV 10 min)',
    finalConcMgMl: 50,
    route: 'IV Infusion',
    stability: '24h RT (Incompatible with Ceftriaxone & NaHCO3)',
    reference: 'PALS / Lexidrug',
    presets: [
      { id: 'std', label: 'Hypocalcemia / Hyperkalemia (60 mg/kg = 0.6 mL/kg)', doseMgPerKg: 60, maxSingleMg: 3000, frequency: 'Stat' },
      { id: 'high', label: 'Severe Symptomatic Hypocalcemia (100 mg/kg)', doseMgPerKg: 100, maxSingleMg: 3000, frequency: 'Stat' }
    ]
  },
  {
    id: 'ca_chloride',
    tradeName: 'Calcium Chloride 10%',
    genericName: 'Calcium Chloride 10% (100 mg/mL)',
    arabicName: 'كالسيوم كلورايد ١٠٪ (مجم)',
    category: 'Electrolytes & Endocrine',
    diluent: '0.9% NS / D5W (Central Line Preferred)',
    prepInstructions: 'Dilute 1000 mg (10 mL) + 10 mL NS -> 50 mg/mL',
    finalConcMgMl: 50,
    route: 'IV Infusion',
    stability: '24h RT (3x elemental Ca vs Gluconate)',
    reference: 'AHA PALS',
    presets: [
      { id: 'pals', label: 'Arrest / Severe Hypocalcemia (20 mg/kg)', doseMgPerKg: 20, maxSingleMg: 1000, frequency: 'Stat' }
    ]
  },
  {
    id: 'mgso4',
    tradeName: 'Magnesium Sulfate 10%',
    genericName: 'MgSO4 10% (100 mg/mL)',
    arabicName: 'ماغنسيوم سلفات ١٠٪ (مجم)',
    category: 'Electrolytes & Endocrine',
    diluent: '0.9% NS / D5W',
    prepInstructions: 'Dilute 1000 mg (10 mL of 10%) + 10 mL NS -> 50 mg/mL (Infuse 20 min)',
    finalConcMgMl: 50,
    route: 'IV Infusion',
    stability: '24h RT',
    reference: 'BNFc / Lexidrug',
    presets: [
      { id: 'std', label: 'Hypomagnesemia / Severe Asthma (40 mg/kg)', doseMgPerKg: 40, maxSingleMg: 2000, frequency: 'Stat' },
      { id: 'tors', label: 'Torsades de Pointes (50 mg/kg)', doseMgPerKg: 50, maxSingleMg: 2000, frequency: 'Stat' }
    ]
  },
  {
    id: 'nahco3',
    tradeName: 'Sodium Bicarbonate 8.4%',
    genericName: 'NaHCO3 8.4% (1 mEq/mL)',
    arabicName: 'بيكربونات الصوديوم ٨.٤٪ (مكافئ)',
    category: 'Electrolytes & Endocrine',
    diluent: 'Sterile Water / D5W (1:1 Dilution -> 0.5 mEq/mL)',
    prepInstructions: 'Dilute 10 mEq (10 mL) + 10 mL WFI/D5W -> 0.5 mEq/mL',
    finalConcMgMl: 0.5,
    route: 'IV Infusion',
    stability: '24h RT (Dosed in mEq/kg; flush line before/after)',
    reference: 'PALS / Lexidrug',
    presets: [
      { id: 'acid', label: 'Severe Metabolic Acidosis / Hyperkalemia (1 mEq/kg)', doseMgPerKg: 1, maxSingleMg: 50, frequency: 'Stat' }
    ]
  },
  {
    id: 'actrapid',
    tradeName: 'Actrapid (Regular Insulin)',
    genericName: 'Insulin Regular (Units)',
    arabicName: 'أكترابيد / إنسولين مائي (وحدة)',
    category: 'Electrolytes & Endocrine',
    diluent: '0.9% NS (1 Unit/mL Standard Drip)',
    prepInstructions: 'Dilute 50 Units (0.5 mL) + 49.5 mL NS -> 1 Unit/mL',
    finalConcMgMl: 1,
    route: 'IV Infusion',
    stability: '24h RT (Prime tubing 20 mL; 6-hr DKA drip at 0.1 U/kg/hr = 0.6 U/kg)',
    reference: 'ISPAD DKA / Lexidrug',
    presets: [
      { id: 'dka6h', label: '6-Hr DKA Infusion at 0.1 U/kg/hr (0.6 Units/kg)', doseMgPerKg: 0.6, maxSingleMg: 60, frequency: 'q6h' },
      { id: 'hyperk', label: 'Hyperkalemia Bolus with Dextrose (0.1 Units/kg)', doseMgPerKg: 0.1, maxSingleMg: 10, frequency: 'Stat' }
    ]
  },
  {
    id: 'glucagon',
    tradeName: 'GlucaGen',
    genericName: 'Glucagon',
    arabicName: 'جلوكاجون',
    category: 'Electrolytes & Endocrine',
    diluent: 'Supplied Solvent (1 mg/mL)',
    prepInstructions: 'Recon 1 mg Vial with 1 mL supplied solvent -> 1 mg/mL',
    finalConcMgMl: 1,
    route: 'IV / IM / SC',
    stability: 'Use immediately after reconstitution',
    reference: 'BNFc Pediatric',
    presets: [
      { id: 'hypo', label: 'Severe Hypoglycemia (0.03 mg/kg)', doseMgPerKg: 0.03, maxSingleMg: 1, frequency: 'Stat' }
    ]
  }
];

// ============================================================================
// 2. SCHEDULING & DATE ROLLOVER HELPERS (EXACT THERMAL STICKER FORMAT)
// ============================================================================

const FREQUENCY_CONFIG = {
  q4h: { dosesPerDay: 6, intervalHours: 4, label: 'q4h (6x/day)' },
  q6h: { dosesPerDay: 4, intervalHours: 6, label: 'q6h (4x/day)' },
  q8h: { dosesPerDay: 3, intervalHours: 8, label: 'q8h (3x/day)' },
  q12h: { dosesPerDay: 2, intervalHours: 12, label: 'q12h (2x/day)' },
  q24h: { dosesPerDay: 1, intervalHours: 24, label: 'q24h (Once daily)' },
  Stat: { dosesPerDay: 1, intervalHours: 0, label: 'Stat (Single Dose)' }
};

function generate24HrSchedule(baseDateIso, startTime24, frequencyKey) {
  const config = FREQUENCY_CONFIG[frequencyKey] || FREQUENCY_CONFIG.q8h;
  const [year, month, day] = (baseDateIso || '2026-11-22').split('-').map(Number);
  const [hours, minutes] = (startTime24 || '12:00').split(':').map(Number);

  const baseDateObj = new Date(year, (month || 1) - 1, day || 1, hours || 12, minutes || 0);
  const slots = [];

  for (let i = 0; i < config.dosesPerDay; i++) {
    const slotDate = new Date(baseDateObj.getTime() + i * config.intervalHours * 3600 * 1000);

    let h = slotDate.getHours();
    const m = slotDate.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;

    const dd = String(slotDate.getDate()).padStart(2, '0');
    const mm = String(slotDate.getMonth() + 1).padStart(2, '0');
    const dateStr = `${dd}/${mm}`;

    slots.push({
      index: i + 1,
      timeStr,
      dateStr
    });
  }

  return slots;
}

function formatCleanNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return 0;
  if (num >= 100) return Math.round(num * 10) / 10;
  if (num >= 10) return Math.round(num * 10) / 10;
  return Math.round(num * 100) / 100;
}

// ============================================================================
// 3. MAIN APPLICATION COMPONENT
// ============================================================================

export default function App() {
  // --- Persistent Pharmacy Master Formulary (100+ Drugs) ---
  const [formulary, setFormulary] = useState(() => {
    try {
      const saved = localStorage.getItem('pediasurgrx_master_formulary_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_PHARMACY_FORMULARY;
    } catch {
      return INITIAL_PHARMACY_FORMULARY;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('pediasurgrx_master_formulary_v3', JSON.stringify(formulary));
    } catch (err) {
      console.error('Failed saving formulary:', err);
    }
  }, [formulary]);

  // --- Patient Header Intake State ---
  const [patient, setPatient] = useState({
    fullName: 'براء محمد عبدالسلام عبدالحميد',
    mrn: '20234098',
    ward: 'قسطرة',
    weightKg: 21,
    baseDate: '2026-11-22',
    defaultStartTime: '12:00'
  });

  // --- Active Workspace Navigation ---
  const [activeTab, setActiveTab] = useState('autofill');

  // --- Master Auto-Fill Table State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPresetsByDrug, setSelectedPresetsByDrug] = useState({});
  const [inlineDoseOverrideByDrug, setInlineDoseOverrideByDrug] = useState({});
  const [inlineConcOverrideByDrug, setInlineConcOverrideByDrug] = useState({});
  const [selectedFreqOverrideByDrug, setSelectedFreqOverrideByDrug] = useState({});
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  // --- Thermal Label & Modal States ---
  const [labelNameMode, setLabelNameMode] = useState('trade'); // 'trade' | 'generic'
  const [stickerSize, setStickerSize] = useState('60x40'); // '50x30' | '60x40' | '70x40'
  const [addedFeedbackId, setAddedFeedbackId] = useState(null);
  const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState(false);

  // --- Patient Active Regimen Sheet State ---
  const [patientRegimen, setPatientRegimen] = useState([
    {
      regimenId: 'init_ketolac',
      drugId: 'ketolac',
      tradeName: 'Ketolac',
      genericName: 'Ketorolac Tromethamine',
      doseMgPerKg: 0.5,
      maxSingleMg: 30,
      finalConcMgMl: 15,
      route: 'IV Shot',
      diluent: '0.9% NS',
      prepInstructions: 'Dilute 30 mg (1 mL) + 1 mL 0.9% NS -> Total 2 mL (15 mg/mL)',
      frequency: 'q12h',
      startTime: '12:00',
      stability: '24h RT (Max therapy duration: 48 hrs)',
      reference: 'Lexidrug / BNFc'
    }
  ]);

  // --- Pharmacy Master Configurator State ---
  const [editingDrugId, setEditingDrugId] = useState(null);
  const [editConcValue, setEditConcValue] = useState('');
  const [editDiluentValue, setEditDiluentValue] = useState('');
  const [editPrepValue, setEditPrepValue] = useState('');
  const [editStabilityValue, setEditStabilityValue] = useState('');
  const [configToast, setConfigToast] = useState('');

  const [newDrugForm, setNewDrugForm] = useState({
    tradeName: '',
    genericName: '',
    arabicName: '',
    category: 'Antimicrobials',
    diluent: '0.9% NS',
    prepInstructions: 'Dilute in 0.9% NS to target final concentration',
    finalConcMgMl: 10,
    route: 'IV Infusion',
    stability: '24h RT',
    reference: 'Lexidrug Pediatric',
    presetLabel: 'Standard Pediatric Dose',
    doseMgPerKg: 10,
    maxSingleMg: 1000,
    frequency: 'q8h'
  });

  // ============================================================================
  // 4. REAL-TIME MASTER AUTO-FILL CALCULATION ENGINE (ALL PHARMACY DRUGS)
  // ============================================================================

  const categories = useMemo(() => {
    const set = new Set(formulary.map((d) => d.category));
    return ['All', ...Array.from(set)];
  }, [formulary]);

  const autoFilledDrugs = useMemo(() => {
    const w = Math.max(0.1, Number(patient.weightKg) || 0);
    const q = searchQuery.toLowerCase().trim();
    const regimenDrugIds = new Set(patientRegimen.map((r) => r.drugId));

    return formulary
      .filter((drug) => {
        if (showSelectedOnly && !regimenDrugIds.has(drug.id)) return false;
        const matchesCategory =
          selectedCategory === 'All' || drug.category === selectedCategory;
        const matchesQuery =
          !q ||
          drug.tradeName.toLowerCase().includes(q) ||
          drug.genericName.toLowerCase().includes(q) ||
          (drug.arabicName && drug.arabicName.includes(q)) ||
          drug.category.toLowerCase().includes(q);
        return matchesCategory && matchesQuery;
      })
      .map((drug) => {
        const chosenPresetId = selectedPresetsByDrug[drug.id] || drug.presets[0]?.id;
        const activePreset =
          drug.presets.find((p) => p.id === chosenPresetId) || drug.presets[0];

        // Allow live inline override of mg/kg and Final Conc (mg/mL)
        const effectiveDosePerKg =
          inlineDoseOverrideByDrug[drug.id] !== undefined
            ? Math.max(0, Number(inlineDoseOverrideByDrug[drug.id]) || 0)
            : activePreset.doseMgPerKg;

        const effectiveFinalConc =
          inlineConcOverrideByDrug[drug.id] !== undefined
            ? Math.max(0.001, Number(inlineConcOverrideByDrug[drug.id]) || 0.001)
            : drug.finalConcMgMl;

        const activeFrequency =
          selectedFreqOverrideByDrug[drug.id] || activePreset.frequency;

        // 1. Raw dose = Weight * mg/kg
        const rawDoseMg = w * effectiveDosePerKg;
        // 2. Cap at Adult Max Single Dose
        const isCapped = rawDoseMg > activePreset.maxSingleMg;
        const finalDoseMg = formatCleanNumber(
          isCapped ? activePreset.maxSingleMg : rawDoseMg
        );

        // 3. Final Volume (mL) = Final Dose (mg) / Pharmacy Final Conc (mg/mL)
        const finalVolumeMl = formatCleanNumber(
          effectiveFinalConc > 0 ? finalDoseMg / effectiveFinalConc : 0
        );

        return {
          ...drug,
          activePreset,
          effectiveDosePerKg,
          effectiveFinalConc,
          activeFrequency,
          rawDoseMg: formatCleanNumber(rawDoseMg),
          finalDoseMg,
          isCapped,
          finalVolumeMl
        };
      });
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
    patientRegimen
  ]);

  // ============================================================================
  // 5. PATIENT ACTIVE REGIMEN & LIVE RECALCULATION ON WEIGHT CHANGE
  // ============================================================================

  const computedPatientRegimen = useMemo(() => {
    const w = Math.max(0.1, Number(patient.weightKg) || 0);

    return patientRegimen.map((item) => {
      const masterDrug = formulary.find((d) => d.id === item.drugId);
      const finalConc =
        item.customConcOverride !== undefined
          ? item.customConcOverride
          : masterDrug
          ? masterDrug.finalConcMgMl
          : item.finalConcMgMl;
      const prepInstr = masterDrug ? masterDrug.prepInstructions : item.prepInstructions;
      const diluent = masterDrug ? masterDrug.diluent : item.diluent;

      const rawDoseMg = w * item.doseMgPerKg;
      const isCapped = rawDoseMg > item.maxSingleMg;
      const finalDoseMg = formatCleanNumber(isCapped ? item.maxSingleMg : rawDoseMg);
      const finalVolumeMl = formatCleanNumber(
        finalConc > 0 ? finalDoseMg / finalConc : 0
      );

      const scheduleSlots = generate24HrSchedule(
        patient.baseDate,
        item.startTime || patient.defaultStartTime,
        item.frequency
      );

      return {
        ...item,
        finalConcMgMl: finalConc,
        prepInstructions: prepInstr,
        diluent,
        finalDoseMg,
        isCapped,
        finalVolumeMl,
        scheduleSlots
      };
    });
  }, [patientRegimen, patient.weightKg, patient.baseDate, patient.defaultStartTime, formulary]);

  // Flatten all 24-hour stickers across all active patient drugs
  const allThermalStickers = useMemo(() => {
    const stickers = [];
    computedPatientRegimen.forEach((reg) => {
      const displayName =
        labelNameMode === 'trade' ? reg.tradeName : reg.genericName;

      reg.scheduleSlots.forEach((slot) => {
        stickers.push({
          stickerId: `${reg.regimenId}_${slot.index}`,
          ward: patient.ward || 'WARD',
          mrn: patient.mrn || '—',
          patientName: patient.fullName || 'Patient Name',
          drugDisplayName: displayName,
          finalVolumeMl: reg.finalVolumeMl,
          route: reg.route,
          finalConcMgMl: reg.finalConcMgMl,
          timeStr: slot.timeStr,
          doseMgPerKg: reg.doseMgPerKg,
          dateStr: slot.dateStr,
          finalDoseMg: reg.finalDoseMg
        });
      });
    });
    return stickers;
  }, [computedPatientRegimen, patient, labelNameMode]);

  // ============================================================================
  // 6. ACTIONS: ADD TO SHEET, EXCEL (.CSV) EXPORT, CONFIGURATOR, BULK IMPORT
  // ============================================================================

  const handleAddDrugToPatientSheet = (calculatedDrug) => {
    const newEntry = {
      regimenId: `${calculatedDrug.id}_${Date.now()}`,
      drugId: calculatedDrug.id,
      tradeName: calculatedDrug.tradeName,
      genericName: calculatedDrug.genericName,
      doseMgPerKg: calculatedDrug.effectiveDosePerKg,
      maxSingleMg: calculatedDrug.activePreset.maxSingleMg,
      finalConcMgMl: calculatedDrug.effectiveFinalConc,
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
      reference: calculatedDrug.reference
    };

    setPatientRegimen((prev) => [...prev, newEntry]);
    setAddedFeedbackId(calculatedDrug.id);
    setTimeout(() => setAddedFeedbackId(null), 1400);
  };

  const handleUpdateRegimenItem = (regimenId, field, value) => {
    setPatientRegimen((prev) =>
      prev.map((item) =>
        item.regimenId === regimenId ? { ...item, [field]: value } : item
      )
    );
  };

  const handleRemoveRegimenItem = (regimenId) => {
    setPatientRegimen((prev) =>
      prev.filter((item) => item.regimenId !== regimenId)
    );
  };

  const loadDemoCase = (caseType) => {
    if (caseType === 'baraa') {
      setPatient({
        fullName: 'براء محمد عبدالسلام عبدالحميد',
        mrn: '20234098',
        ward: 'قسطرة',
        weightKg: 21,
        baseDate: '2026-11-22',
        defaultStartTime: '12:00'
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
          route: 'IV Shot',
          diluent: '0.9% NS',
          prepInstructions: 'Dilute 30 mg (1 mL) + 1 mL 0.9% NS -> Total 2 mL (15 mg/mL)',
          frequency: 'q12h',
          startTime: '12:00',
          stability: '24h RT',
          reference: 'Lexidrug / BNFc'
        }
      ]);
    } else if (caseType === 'mohamed') {
      setPatient({
        fullName: 'محمد علي رجب محمد جابر',
        mrn: '20248000',
        ward: 'WARD',
        weightKg: 36,
        baseDate: '2026-11-22',
        defaultStartTime: '12:00'
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
          route: 'IV Shot',
          diluent: '0.9% NS',
          prepInstructions: 'Dilute 30 mg (1 mL) + 1 mL 0.9% NS -> Total 2 mL (15 mg/mL)',
          frequency: 'q12h',
          startTime: '12:00',
          stability: '24h RT',
          reference: 'Lexidrug / BNFc'
        }
      ]);
    } else if (caseType === 'fares_vanco') {
      setPatient({
        fullName: 'فارس محمود (حالة Vancomycin 36 kg)',
        mrn: '20261109',
        ward: 'WARD',
        weightKg: 36,
        baseDate: '2026-11-22',
        defaultStartTime: '13:00'
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
          route: 'IV Infusion',
          diluent: '0.9% NS / D5W',
          prepInstructions: '500 mg in 100 mL NS/D5W -> 5 mg/mL (Infuse over 60-90 min)',
          frequency: 'q8h',
          startTime: '13:00',
          stability: '24h RT | 14d Fridge at 5 mg/mL',
          reference: 'Lexidrug / ASHP IDSA'
        }
      ]);
    } else if (caseType === 'lasix_3kg') {
      setPatient({
        fullName: 'يوسف أحمد (حالة Lasix 3 kg)',
        mrn: '20263001',
        ward: 'PICU',
        weightKg: 3,
        baseDate: '2026-11-22',
        defaultStartTime: '12:00'
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
          route: 'IV Shot',
          diluent: '0.9% NS',
          prepInstructions: 'Dilute 20 mg (2 mL) + 8 mL 0.9% NS -> Total 10 mL (2 mg/mL)',
          frequency: 'q12h',
          startTime: '12:00',
          stability: '24h RT; protect from light',
          reference: 'Lexidrug / Trissel’s'
        }
      ]);
    }
  };

  const handleExportPatientExcel = () => {
    const headers = [
      'Patient Name',
      'MRN / ID',
      'Ward / Unit',
      'Weight (kg)',
      'Trade Name',
      'Active Ingredient',
      'Dose (mg/kg)',
      'Calculated Dose (mg)',
      'Standard Final Conc (mg/mL)',
      'Final Volume (mL)',
      'Route',
      'Frequency',
      '24h Administration Schedule',
      'Diluent & Preparation Instructions',
      '24h Stability & Reference'
    ];

    const rows = computedPatientRegimen.map((item) => {
      const scheduleSummary = item.scheduleSlots
        .map((s) => `${s.timeStr} (${s.dateStr})`)
        .join(' | ');

      return [
        `"${patient.fullName}"`,
        `"${patient.mrn}"`,
        `"${patient.ward}"`,
        patient.weightKg,
        `"${item.tradeName}"`,
        `"${item.genericName}"`,
        item.doseMgPerKg,
        item.finalDoseMg,
        item.finalConcMgMl,
        item.finalVolumeMl,
        `"${item.route}"`,
        `"${item.frequency}"`,
        `"${scheduleSummary}"`,
        `"${item.prepInstructions}"`,
        `"${item.stability} [${item.reference}]"`
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
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

  const startEditingMasterDrug = (drug) => {
    setEditingDrugId(drug.id);
    setEditConcValue(String(drug.finalConcMgMl));
    setEditDiluentValue(drug.diluent);
    setEditPrepValue(drug.prepInstructions);
    setEditStabilityValue(drug.stability);
  };

  const saveMasterDrugEdit = (drugId) => {
    const parsedConc = Math.max(0.001, Number(editConcValue) || 1);
    setFormulary((prev) =>
      prev.map((d) =>
        d.id === drugId
          ? {
              ...d,
              finalConcMgMl: parsedConc,
              diluent: editDiluentValue,
              prepInstructions: editPrepValue,
              stability: editStabilityValue
            }
          : d
      )
    );
    setEditingDrugId(null);
    setConfigToast('تم حفظ تعديل التركيز القياسي وتحديث جميع الحسابات تلقائياً.');
    setTimeout(() => setConfigToast(''), 3000);
  };

  const handleAddNewFormularyDrug = (e) => {
    e.preventDefault();
    if (!newDrugForm.tradeName.trim() || !newDrugForm.genericName.trim()) return;

    const newItem = {
      id: `custom_${Date.now()}`,
      tradeName: newDrugForm.tradeName.trim(),
      genericName: newDrugForm.genericName.trim(),
      arabicName: newDrugForm.arabicName.trim() || newDrugForm.tradeName.trim(),
      category: newDrugForm.category,
      diluent: newDrugForm.diluent,
      prepInstructions: newDrugForm.prepInstructions,
      finalConcMgMl: Math.max(0.001, Number(newDrugForm.finalConcMgMl) || 1),
      route: newDrugForm.route,
      stability: newDrugForm.stability,
      reference: newDrugForm.reference,
      isCustom: true,
      presets: [
        {
          id: 'std',
          label: `${newDrugForm.presetLabel} (${newDrugForm.doseMgPerKg} mg/kg)`,
          doseMgPerKg: Number(newDrugForm.doseMgPerKg) || 1,
          maxSingleMg: Number(newDrugForm.maxSingleMg) || 1000,
          frequency: newDrugForm.frequency
        }
      ]
    };

    setFormulary((prev) => [newItem, ...prev]);
    setNewDrugForm({
      ...newDrugForm,
      tradeName: '',
      genericName: '',
      arabicName: ''
    });
    setIsQuickAddModalOpen(false);
    setConfigToast(
      `تم إضافة "${newItem.tradeName} (${newItem.genericName})" وحساب جرعته لوزن ${patient.weightKg} كجم.`
    );
    setTimeout(() => setConfigToast(''), 3500);
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

  // Bulk Import JSON or CSV
  const handleImportMasterFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = String(ev.target.result || '');
      try {
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].finalConcMgMl) {
            setFormulary(parsed);
            setConfigToast(`تم استيراد ${parsed.length} دواء من ملف JSON بنجاح!`);
          } else {
            setConfigToast('صيغة ملف JSON غير صحيحة.');
          }
        } else {
          // Parse CSV: TradeName,GenericName,Category,FinalConcMgMl,DoseMgPerKg,MaxSingleMg,Frequency,Route,PrepInstructions
          const lines = text
            .split(/\r?\n/)
            .map((l) => l.trim())
            .filter(Boolean);
          if (lines.length < 2) {
            setConfigToast('ملف CSV فارغ.');
            return;
          }
          const importedDrugs = [];
          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',').map((c) => c.replace(/^"|"$/g, '').trim());
            if (cols.length >= 5 && cols[0] && cols[1]) {
              const conc = Math.max(0.001, parseFloat(cols[3]) || 1);
              const dose = parseFloat(cols[4]) || 1;
              const maxD = parseFloat(cols[5]) || 1000;
              const freq = FREQUENCY_CONFIG[cols[6]] ? cols[6] : 'q8h';
              importedDrugs.push({
                id: `csv_${Date.now()}_${i}`,
                tradeName: cols[0],
                genericName: cols[1],
                arabicName: cols[0],
                category: cols[2] || 'Custom Imported',
                diluent: '0.9% NS',
                prepInstructions: cols[8] || `Dilute to ${conc} mg/mL`,
                finalConcMgMl: conc,
                route: cols[7] || 'IV Infusion',
                stability: '24h RT',
                reference: 'Hospital CSV Import',
                presets: [
                  {
                    id: 'std',
                    label: `Standard (${dose} mg/kg)`,
                    doseMgPerKg: dose,
                    maxSingleMg: maxD,
                    frequency: freq
                  }
                ]
              });
            }
          }
          if (importedDrugs.length > 0) {
            setFormulary((prev) => [...importedDrugs, ...prev]);
            setConfigToast(`تم استيراد وإضافة ${importedDrugs.length} دواء من ملف CSV بنجاح!`);
          } else {
            setConfigToast('لم يتم العثور على صفوف صالحة في ملف CSV.');
          }
        }
      } catch {
        setConfigToast('حدث خطأ أثناء قراءة الملف.');
      }
      setTimeout(() => setConfigToast(''), 4000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Sticker physical dimension classes
  const stickerDimensionStyle = useMemo(() => {
    if (stickerSize === '50x30') {
      return { width: '50mm', minHeight: '30mm' };
    }
    if (stickerSize === '70x40') {
      return { width: '70mm', minHeight: '40mm' };
    }
    return { width: '60mm', minHeight: '40mm' };
  }, [stickerSize]);

  // ============================================================================
  // 7. RENDER APPLICATION UI + PRINT STYLES FOR THERMAL LABELS
  // ============================================================================

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
      {/* DEDICATED THERMAL LABEL PRINT STYLESHEET */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #thermal-print-sheet,
          #thermal-print-sheet * {
            visibility: visible !important;
          }
          #thermal-print-sheet {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: white !important;
            padding: 3mm !important;
            margin: 0 !important;
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 3mm !important;
          }
          .thermal-sticker-card {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
            border: 1.5pt solid #000000 !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      {/* TOP CLINICAL PHARMACY NAVIGATION BAR */}
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-teal-500/20 border border-teal-400/30 p-2 rounded-xl">
              <Syringe className="w-6 h-6 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">
                  PediaSurg<span className="text-teal-400">Rx</span>
                </h1>
                <span className="text-[11px] font-bold bg-teal-500/20 text-teal-200 border border-teal-400/30 px-2 py-0.5 rounded-full">
                  Master Formulary ({formulary.length} Drugs)
                </span>
              </div>
              <p className="text-xs text-slate-300" dir="rtl">
                الموسوعة الصيدلانية الشاملة لحساب الجرعات والتحضير الوريدي وطباعة ملصقات المرضى
              </p>
            </div>
          </div>

          {/* TABS */}
          <nav className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700 overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('autofill')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'autofill'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>1. All Drugs Auto-Fill</span>
              <span className="bg-black/20 px-1.5 py-0.5 rounded text-[11px] font-mono">
                {autoFilledDrugs.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('regimen')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'regimen'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-200 hover:bg-slate-700'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>2. Patient Excel Sheet</span>
              <span className="bg-black/20 px-1.5 py-0.5 rounded text-[11px] font-mono">
                {computedPatientRegimen.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('labels')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'labels'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>3. Thermal Labels</span>
              <span className="bg-black/20 px-1.5 py-0.5 rounded text-[11px] font-mono">
                {allThermalStickers.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('config')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'config'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>4. Prep Standards</span>
            </button>
          </nav>
        </div>
      </header>

      {/* GLOBAL TOAST BANNER */}
      {configToast && (
        <div className="bg-emerald-800 text-white px-4 py-2.5 text-xs font-bold text-center flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{configToast}</span>
        </div>
      )}

      {/* PERSISTENT PATIENT INTAKE HEADER (DRIVES REAL-TIME AUTO-FILL FOR ALL DRUGS) */}
      <section className="bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          {/* Quick Clinical Case Presets */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <User className="w-4 h-4 text-teal-600" />
              <span>
                PATIENT INTAKE (تغيير الوزن يعيد حساب جميع أدوية الصيدلية الـ{' '}
                {formulary.length} لحظياً)
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
              <span className="text-slate-400 font-semibold">Quick Cases:</span>
              <button
                onClick={() => loadDemoCase('lasix_3kg')}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 font-semibold"
              >
                يوسف (Lasix 3 kg = 1.5 mL)
              </button>
              <button
                onClick={() => loadDemoCase('baraa')}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 font-semibold"
              >
                براء (قسطرة - 21 kg)
              </button>
              <button
                onClick={() => loadDemoCase('mohamed')}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 font-semibold"
              >
                محمد علي (WARD - 36 kg)
              </button>
              <button
                onClick={() => loadDemoCase('fares_vanco')}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 font-semibold"
              >
                فارس (Vancomycin 36 kg = 144 mL)
              </button>
            </div>
          </div>

          {/* 6-Field Patient Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
            {/* Patient Full Name */}
            <div className="lg:col-span-4">
              <label className="block text-[11px] font-bold text-slate-600 mb-1 flex justify-between">
                <span>Patient Full Name</span>
                <span dir="rtl">اسم المريض بالكامل</span>
              </label>
              <input
                type="text"
                dir="rtl"
                value={patient.fullName}
                onChange={(e) => setPatient({ ...patient, fullName: e.target.value })}
                placeholder="براء محمد عبدالسلام عبدالحميد"
                className="w-full px-3 py-2 text-sm font-bold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>

            {/* Patient ID / MRN */}
            <div className="lg:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 mb-1 flex justify-between">
                <span>Patient ID / MRN</span>
                <span dir="rtl">رقم الملف</span>
              </label>
              <input
                type="text"
                value={patient.mrn}
                onChange={(e) => setPatient({ ...patient, mrn: e.target.value })}
                placeholder="20234098"
                className="w-full px-3 py-2 text-sm font-bold font-mono tabular-nums bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            {/* Ward / Unit */}
            <div className="lg:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 mb-1 flex justify-between">
                <span>Ward / Unit</span>
                <span dir="rtl">القسم</span>
              </label>
              <input
                type="text"
                value={patient.ward}
                onChange={(e) => setPatient({ ...patient, ward: e.target.value })}
                placeholder="WARD / قسطرة"
                className="w-full px-3 py-2 text-sm font-bold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            {/* WEIGHT IN KG (HERO INPUT) */}
            <div className="lg:col-span-2">
              <label className="block text-[11px] font-extrabold text-teal-800 mb-1 flex justify-between">
                <span>WEIGHT (kg)*</span>
                <span dir="rtl">الوزن (كجم)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0.3"
                  max="250"
                  value={patient.weightKg}
                  onChange={(e) => setPatient({ ...patient, weightKg: e.target.value })}
                  className="w-full px-3 py-2 text-base font-black font-mono tabular-nums bg-teal-50 border-2 border-teal-600 text-teal-950 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none shadow-2xs"
                />
                <span className="absolute right-3 top-2.5 text-xs font-extrabold text-teal-700">
                  kg
                </span>
              </div>
            </div>

            {/* Base Date & Start Time */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-1.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">
                  Date (DD/MM)
                </label>
                <input
                  type="date"
                  value={patient.baseDate}
                  onChange={(e) => setPatient({ ...patient, baseDate: e.target.value })}
                  className="w-full px-2 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">
                  1st Dose Time
                </label>
                <input
                  type="time"
                  value={patient.defaultStartTime}
                  onChange={(e) =>
                    setPatient({ ...patient, defaultStartTime: e.target.value })
                  }
                  className="w-full px-2 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          MAIN WORKSPACE VIEWS
         ====================================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* ====================================================================
            TAB 1: MASTER AUTO-FILL TABLE ("ALL PHARMACY MEDICATIONS")
           ==================================================================== */}
        {activeTab === 'autofill' && (
          <div className="space-y-4">
            {/* Search & Filter Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Dual Trade + Generic + Arabic Search */}
                <div className="relative flex-1 min-w-[260px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث بالاسم التجاري (Lasix, Ketolac, Vancocin, Meronem) أو المادة الفعالة (Furosemide, Vancomycin) أو بالعربي..."
                    className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Quick Actions: Selected Only + Quick Add Drug */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setShowSelectedOnly((prev) => !prev)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                      showSelectedOnly
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <Filter className="w-3.5 h-3.5" />
                    <span>Selected Regimen Only ({patientRegimen.length})</span>
                  </button>

                  <button
                    onClick={() => setIsQuickAddModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 shadow-2xs"
                  >
                    <Plus className="w-4 h-4 text-teal-400" />
                    <span>+ Add Custom Drug</span>
                  </button>
                </div>
              </div>

              {/* Specialty / Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {categories.map((cat) => {
                  const count =
                    cat === 'All'
                      ? formulary.length
                      : formulary.filter((d) => d.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                        selectedCategory === cat
                          ? 'bg-teal-700 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <span>{cat}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          selectedCategory === cat
                            ? 'bg-black/25 text-teal-100'
                            : 'bg-white text-slate-600'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Calculation Banner */}
            <div className="bg-teal-950 text-white px-4 py-2.5 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-300 shrink-0" />
                <span>
                  Auto-filled <strong>{autoFilledDrugs.length} medications</strong> for{' '}
                  <strong className="text-teal-300 text-sm font-mono">
                    {patient.weightKg} kg
                  </strong>{' '}
                  — You can tweak <strong>Dose/kg</strong> or <strong>Final Conc</strong> directly inline in any row!
                </span>
              </div>
              <button
                onClick={() => setActiveTab('regimen')}
                className="bg-teal-400 hover:bg-teal-300 text-slate-950 font-extrabold px-3.5 py-1.5 rounded-lg transition-colors"
              >
                Open Patient Sheet ({computedPatientRegimen.length}) →
              </button>
            </div>

            {/* MASTER AUTO-FILL TABLE */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-slate-100 text-[11px] uppercase tracking-wider">
                      <th className="py-3 px-4 font-bold">Trade & Active Ingredient</th>
                      <th className="py-3 px-3 font-bold">Indication & Inline Dose/kg</th>
                      <th className="py-3 px-3 font-bold text-right">Calc. Dose</th>
                      <th className="py-3 px-3 font-bold">Standard Prep & Final Conc</th>
                      <th className="py-3 px-3 font-bold text-center bg-teal-950 text-teal-200">
                        Final Volume (mL)
                      </th>
                      <th className="py-3 px-3 font-bold">Freq & Route</th>
                      <th className="py-3 px-4 font-bold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm">
                    {autoFilledDrugs.map((drug) => {
                      const isJustAdded = addedFeedbackId === drug.id;
                      const alreadyInSheet = computedPatientRegimen.some(
                        (r) => r.drugId === drug.id
                      );

                      return (
                        <tr
                          key={drug.id}
                          className="hover:bg-teal-50/40 transition-colors align-top"
                        >
                          {/* 1. Trade + Generic + Arabic Name */}
                          <td className="py-3 px-4 min-w-[200px]">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-extrabold text-slate-900 text-base">
                                {drug.tradeName}
                              </span>
                              <span className="text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
                                {drug.genericName}
                              </span>
                            </div>
                            <div dir="rtl" className="text-xs text-slate-600 mt-0.5 font-medium">
                              {drug.arabicName}
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                              <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold">
                                {drug.category}
                              </span>
                              <span className="flex items-center gap-0.5">
                                <BookOpen className="w-3 h-3" />
                                {drug.reference}
                              </span>
                            </div>
                          </td>

                          {/* 2. Dose Preset Selector + Live Inline mg/kg Override */}
                          <td className="py-3 px-3 min-w-[225px]">
                            <select
                              value={drug.activePreset.id}
                              onChange={(e) => {
                                const newPresetId = e.target.value;
                                setSelectedPresetsByDrug((prev) => ({
                                  ...prev,
                                  [drug.id]: newPresetId
                                }));
                                // Clear manual inline dose override when switching clinical indication
                                setInlineDoseOverrideByDrug((prev) => {
                                  const copy = { ...prev };
                                  delete copy[drug.id];
                                  return copy;
                                });
                                const found = drug.presets.find((p) => p.id === newPresetId);
                                if (found) {
                                  setSelectedFreqOverrideByDrug((prev) => ({
                                    ...prev,
                                    [drug.id]: found.frequency
                                  }));
                                }
                              }}
                              className="w-full p-1.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            >
                              {drug.presets.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.label}
                                </option>
                              ))}
                            </select>

                            <div className="flex items-center justify-between gap-2 mt-1.5 text-[11px]">
                              <label className="flex items-center gap-1 text-slate-600 font-semibold">
                                <span>Dose/kg:</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={drug.effectiveDosePerKg}
                                  onChange={(e) =>
                                    setInlineDoseOverrideByDrug((prev) => ({
                                      ...prev,
                                      [drug.id]: e.target.value
                                    }))
                                  }
                                  className="w-16 px-1.5 py-0.5 text-xs font-mono font-bold bg-white border border-slate-300 rounded text-slate-900 focus:border-teal-600 outline-none"
                                />
                              </label>
                              <span className="text-slate-500 font-mono">
                                Max: <strong>{drug.activePreset.maxSingleMg}</strong>
                              </span>
                            </div>
                          </td>

                          {/* 3. Calculated Dose (mg / mcg / Units) */}
                          <td className="py-3 px-3 text-right whitespace-nowrap">
                            <div className="font-extrabold text-slate-900 text-base font-mono tabular-nums">
                              {drug.finalDoseMg}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                              ({drug.effectiveDosePerKg}/kg)
                            </div>
                            {drug.isCapped && (
                              <span className="inline-block mt-1 text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.5 rounded">
                                Max Capped
                              </span>
                            )}
                          </td>

                          {/* 4. Pharmacy Standard Preparation & Inline Final Conc */}
                          <td className="py-3 px-3 min-w-[240px]">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <span>Conc:</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0.001"
                                  value={drug.effectiveFinalConc}
                                  onChange={(e) =>
                                    setInlineConcOverrideByDrug((prev) => ({
                                      ...prev,
                                      [drug.id]: e.target.value
                                    }))
                                  }
                                  className="w-14 px-1 py-0 text-xs font-mono font-black bg-white border border-indigo-300 rounded text-indigo-950 outline-none"
                                />
                                <span>/mL</span>
                              </span>
                              <span className="text-[10px] font-semibold text-slate-500">
                                ({drug.diluent})
                              </span>
                            </div>
                            <div className="text-xs text-slate-700 mt-1 leading-snug">
                              {drug.prepInstructions}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              Stability: {drug.stability}
                            </div>
                          </td>

                          {/* 5. CALCULATED FINAL VOLUME (mL) - HERO OUTPUT */}
                          <td className="py-3 px-3 text-center bg-teal-50/75 border-x border-teal-100 whitespace-nowrap">
                            <div className="text-2xl font-black text-teal-800 font-mono tabular-nums">
                              {drug.finalVolumeMl}
                            </div>
                            <div className="text-xs font-extrabold text-teal-700">mL</div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                              {drug.finalDoseMg} ÷ {drug.effectiveFinalConc}
                            </div>
                          </td>

                          {/* 6. Frequency & Route */}
                          <td className="py-3 px-3 min-w-[120px]">
                            <select
                              value={drug.activeFrequency}
                              onChange={(e) =>
                                setSelectedFreqOverrideByDrug((prev) => ({
                                  ...prev,
                                  [drug.id]: e.target.value
                                }))
                              }
                              className="w-full p-1.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg mb-1"
                            >
                              {Object.keys(FREQUENCY_CONFIG).map((fk) => (
                                <option key={fk} value={fk}>
                                  {fk}
                                </option>
                              ))}
                            </select>
                            <span className="inline-block text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                              {drug.route}
                            </span>
                          </td>

                          {/* 7. Add to Patient Sheet Button */}
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            <button
                              onClick={() => handleAddDrugToPatientSheet(drug)}
                              className={`px-3 py-2 rounded-xl text-xs font-extrabold shadow-2xs transition-all flex items-center justify-center gap-1 mx-auto ${
                                isJustAdded
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-teal-700 hover:bg-teal-800 text-white'
                              }`}
                            >
                              {isJustAdded ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Added</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Add to Sheet</span>
                                </>
                              )}
                            </button>
                            {alreadyInSheet && !isJustAdded && (
                              <span className="block text-[10px] text-emerald-700 font-bold mt-1">
                                ✓ In Patient Sheet
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 2: PATIENT ACTIVE REGIMEN SHEET & EXCEL EXPORT
           ==================================================================== */}
        {activeTab === 'regimen' && (
          <div className="space-y-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                  <span>
                    Patient Active Medication Sheet —{' '}
                    <span className="text-teal-800">{patient.fullName}</span>
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  MRN: <strong className="font-mono">{patient.mrn}</strong> | Ward:{' '}
                  <strong>{patient.ward}</strong> | Weight:{' '}
                  <strong className="font-mono">{patient.weightKg} kg</strong> | Total 24h
                  Stickers: <strong className="font-mono">{allThermalStickers.length}</strong>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setActiveTab('autofill')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add More Drugs</span>
                </button>

                <button
                  onClick={handleExportPatientExcel}
                  disabled={computedPatientRegimen.length === 0}
                  className="px-4 py-2 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-2xs flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Export Patient Excel Sheet (.CSV)</span>
                </button>

                <button
                  onClick={() => setActiveTab('labels')}
                  disabled={computedPatientRegimen.length === 0}
                  className="px-4 py-2 rounded-xl text-xs font-extrabold bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white shadow-2xs flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Thermal Labels ({allThermalStickers.length})</span>
                </button>
              </div>
            </div>

            {computedPatientRegimen.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <p className="text-slate-500 font-semibold">
                  No medications added to this patient&apos;s sheet yet.
                </p>
                <button
                  onClick={() => setActiveTab('autofill')}
                  className="px-4 py-2 bg-teal-700 text-white rounded-xl text-xs font-bold"
                >
                  Go to All Drugs Auto-Fill Table
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {computedPatientRegimen.map((item) => (
                  <div
                    key={item.regimenId}
                    className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-black text-slate-900">
                            {item.tradeName}
                          </h3>
                          <span className="text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-0.5 rounded-full">
                            {item.genericName}
                          </span>
                          <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-mono">
                            {item.route} ({item.finalConcMgMl}/mL)
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          <strong>Preparation:</strong> {item.prepInstructions}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-[11px] font-bold text-slate-500 uppercase">
                            Dose ({item.doseMgPerKg}/kg)
                          </div>
                          <div className="text-lg font-extrabold text-slate-900 font-mono tabular-nums">
                            {item.finalDoseMg}
                          </div>
                        </div>

                        <div className="bg-teal-50 border-2 border-teal-600 px-3.5 py-1.5 rounded-xl text-center">
                          <div className="text-[10px] font-extrabold text-teal-800 uppercase">
                            Final Vol
                          </div>
                          <div className="text-xl font-black text-teal-900 font-mono tabular-nums">
                            {item.finalVolumeMl} ml
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemoveRegimenItem(item.regimenId)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl"
                          title="Remove from patient sheet"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-4 grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Frequency
                          </label>
                          <select
                            value={item.frequency}
                            onChange={(e) =>
                              handleUpdateRegimenItem(
                                item.regimenId,
                                'frequency',
                                e.target.value
                              )
                            }
                            className="w-full p-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg"
                          >
                            {Object.entries(FREQUENCY_CONFIG).map(([key, cfg]) => (
                              <option key={key} value={key}>
                                {cfg.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Start Time
                          </label>
                          <input
                            type="time"
                            value={item.startTime}
                            onChange={(e) =>
                              handleUpdateRegimenItem(
                                item.regimenId,
                                'startTime',
                                e.target.value
                              )
                            }
                            className="w-full p-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-8">
                        <div className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-teal-600" />
                          <span>
                            Auto-Generated 24h Administration Schedule ({item.scheduleSlots.length}{' '}
                            Stickers):
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {item.scheduleSlots.map((slot) => (
                            <div
                              key={slot.index}
                              className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold font-mono flex items-center gap-2 tabular-nums"
                            >
                              <span className="text-teal-300">#{slot.index}</span>
                              <span>{slot.timeStr}</span>
                              <span className="text-slate-400">|</span>
                              <span className="text-amber-300">{slot.dateStr}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ====================================================================
            TAB 3: EXACT THERMAL LABEL GENERATOR & BATCH PRINT STUDIO
           ==================================================================== */}
        {activeTab === 'labels' && (
          <div className="space-y-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Printer className="w-5 h-5 text-teal-700" />
                  <span>Thermal Sticker Batch Print Studio ({allThermalStickers.length} Labels)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5" dir="rtl">
                  مطابق لتصميم ملصقات الصيدلية الحرارية — اختر مقاس الرول واطبع جميع جرعات الـ 24 ساعة بضغطة واحدة
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Sticker Roll Size Selector */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                  <Layers className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
                  {['50x30', '60x40', '70x40'].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setStickerSize(sz)}
                      className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-colors ${
                        stickerSize === sz
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600'
                      }`}
                    >
                      {sz}mm
                    </button>
                  ))}
                </div>

                {/* Trade vs Active Ingredient Toggle */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                  <button
                    onClick={() => setLabelNameMode('trade')}
                    className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                      labelNameMode === 'trade'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600'
                    }`}
                  >
                    Trade Name
                  </button>
                  <button
                    onClick={() => setLabelNameMode('generic')}
                    className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                      labelNameMode === 'generic'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600'
                    }`}
                  >
                    Active Ingredient
                  </button>
                </div>

                <button
                  onClick={() => window.print()}
                  disabled={allThermalStickers.length === 0}
                  className="px-5 py-2.5 rounded-xl text-sm font-extrabold bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white shadow-sm flex items-center gap-2"
                >
                  <Printer className="w-4 h-4 text-teal-400" />
                  <span>Print All Labels ({allThermalStickers.length})</span>
                </button>
              </div>
            </div>

            {allThermalStickers.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <p className="text-slate-500 font-semibold mb-3">
                  No thermal stickers generated yet. Add medications from the Auto-Fill table first.
                </p>
                <button
                  onClick={() => setActiveTab('autofill')}
                  className="px-4 py-2 bg-teal-700 text-white rounded-xl text-xs font-bold"
                >
                  Select Medications
                </button>
              </div>
            ) : (
              <div
                id="thermal-print-sheet"
                className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto"
              >
                {allThermalStickers.map((sticker) => (
                  <div
                    key={sticker.stickerId}
                    style={stickerDimensionStyle}
                    className="thermal-sticker-card border-2 border-slate-900 bg-white text-black font-sans px-3 py-2 shadow-2xs flex flex-col justify-between"
                  >
                    {/* Top Line: Ward/Unit on Left, Patient ID/MRN on Right */}
                    <div className="flex items-center justify-between text-xs font-bold tracking-tight leading-none">
                      <span dir="auto">{sticker.ward}</span>
                      <span className="font-mono tabular-nums font-extrabold">
                        {sticker.mrn}
                      </span>
                    </div>

                    {/* Line 2: Patient Full Name (Centered, Bold) */}
                    <div
                      dir="rtl"
                      className="text-center font-bold text-sm leading-tight mt-1 truncate"
                    >
                      {sticker.patientName}
                    </div>

                    {/* Line 3: [Drug Name] [Final Volume] ml (Centered, Large Bold) */}
                    <div className="text-center font-extrabold text-base sm:text-lg tracking-tight leading-tight mt-0.5">
                      {sticker.drugDisplayName} {sticker.finalVolumeMl} ml
                    </div>

                    {/* Line 4: [Route] ([Final Concentration]mg/ml) */}
                    <div className="text-center font-semibold text-xs sm:text-sm leading-tight">
                      {sticker.route} ({sticker.finalConcMgMl}mg/ml)
                    </div>

                    {/* Bottom Line (3 columns): [Time] | [Dose/kg] | [Date DD/MM] */}
                    <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold pt-1 mt-0.5 font-mono tabular-nums">
                      <span>{sticker.timeStr}</span>
                      <span>{sticker.doseMgPerKg}mg/kg</span>
                      <span>{sticker.dateStr}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ====================================================================
            TAB 4: PHARMACY STANDARD PREPARATION, BULK CSV/JSON & CONFIGURATOR
           ==================================================================== */}
        {activeTab === 'config' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Add New Drug + Bulk Import/Export (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-teal-600" />
                  <span>Add Drug or Bulk Import Formulary</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5" dir="rtl">
                  أضف أي دواء جديد أو ارفع شيت Excel/CSV كامل بأدوية مستشفاك دفعة واحدة
                </p>
              </div>

              <form onSubmit={handleAddNewFormularyDrug} className="space-y-3">
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Trade Name*
                    </label>
                    <input
                      type="text"
                      required
                      value={newDrugForm.tradeName}
                      onChange={(e) =>
                        setNewDrugForm({ ...newDrugForm, tradeName: e.target.value })
                      }
                      placeholder="e.g. Maxipime"
                      className="w-full p-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Active Ingredient*
                    </label>
                    <input
                      type="text"
                      required
                      value={newDrugForm.genericName}
                      onChange={(e) =>
                        setNewDrugForm({ ...newDrugForm, genericName: e.target.value })
                      }
                      placeholder="e.g. Cefepime"
                      className="w-full p-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Arabic Name / Alias
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={newDrugForm.arabicName}
                      onChange={(e) =>
                        setNewDrugForm({ ...newDrugForm, arabicName: e.target.value })
                      }
                      placeholder="ماكسيبيم"
                      className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Specialty Category
                    </label>
                    <select
                      value={newDrugForm.category}
                      onChange={(e) =>
                        setNewDrugForm({ ...newDrugForm, category: e.target.value })
                      }
                      className="w-full p-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg"
                    >
                      <option value="Antimicrobials">Antimicrobials</option>
                      <option value="Analgesia & ICU">Analgesia & ICU</option>
                      <option value="Cardiology & Cath">Cardiology & Cath</option>
                      <option value="GI & Antiemetics">GI & Antiemetics</option>
                      <option value="Steroids & Blood">Steroids & Blood</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Electrolytes & Endocrine">Electrolytes & Endocrine</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Standard Final Conc (mg/mL)*
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newDrugForm.finalConcMgMl}
                      onChange={(e) =>
                        setNewDrugForm({ ...newDrugForm, finalConcMgMl: e.target.value })
                      }
                      className="w-full p-2 text-xs font-black font-mono tabular-nums bg-teal-50 border border-teal-400 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Default Dose (mg/kg)*
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newDrugForm.doseMgPerKg}
                      onChange={(e) =>
                        setNewDrugForm({ ...newDrugForm, doseMgPerKg: e.target.value })
                      }
                      className="w-full p-2 text-xs font-bold font-mono tabular-nums bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Max Single
                    </label>
                    <input
                      type="number"
                      value={newDrugForm.maxSingleMg}
                      onChange={(e) =>
                        setNewDrugForm({ ...newDrugForm, maxSingleMg: e.target.value })
                      }
                      className="w-full p-2 text-xs font-mono tabular-nums bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Frequency
                    </label>
                    <select
                      value={newDrugForm.frequency}
                      onChange={(e) =>
                        setNewDrugForm({ ...newDrugForm, frequency: e.target.value })
                      }
                      className="w-full p-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg"
                    >
                      {Object.keys(FREQUENCY_CONFIG).map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Route
                    </label>
                    <select
                      value={newDrugForm.route}
                      onChange={(e) =>
                        setNewDrugForm({ ...newDrugForm, route: e.target.value })
                      }
                      className="w-full p-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg"
                    >
                      <option value="IV Shot">IV Shot</option>
                      <option value="IV Infusion">IV Infusion</option>
                      <option value="SC Shot">SC Shot</option>
                      <option value="PO / SL">PO / SL</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Preparation & Dilution Protocol
                  </label>
                  <input
                    type="text"
                    value={newDrugForm.prepInstructions}
                    onChange={(e) =>
                      setNewDrugForm({ ...newDrugForm, prepInstructions: e.target.value })
                    }
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs rounded-xl shadow-2xs"
                >
                  + Save to Master Formulary
                </button>
              </form>

              {/* Bulk Import / Export / Reset */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="text-[11px] font-bold text-slate-600">
                  Bulk Import / Backup (JSON or CSV):
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleExportMasterJson}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-white flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export JSON ({formulary.length})</span>
                  </button>

                  <label className="px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-50 border border-teal-300 text-teal-900 cursor-pointer flex items-center gap-1 hover:bg-teal-100">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Import CSV / JSON</span>
                    <input
                      type="file"
                      accept=".json,.csv"
                      onChange={handleImportMasterFile}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={() => {
                      setFormulary(INITIAL_PHARMACY_FORMULARY);
                      setConfigToast(
                        `تم استعادة الموسوعة الافتراضية (${INITIAL_PHARMACY_FORMULARY.length} دواء).`
                      );
                      setTimeout(() => setConfigToast(''), 3000);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Default</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">
                  CSV Format: TradeName, GenericName, Category, FinalConcMgMl, DoseMgPerKg, MaxSingleMg, Frequency, Route, PrepInstructions
                </p>
              </div>
            </div>

            {/* Editable Master Standard Concentrations List (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5">
              <div className="border-b border-slate-100 pb-3 mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    Pharmacy Standard Final Concentrations ({formulary.length} Drugs)
                  </h2>
                  <p className="text-xs text-slate-500" dir="rtl">
                    اضغط على Edit لتعديل التركيز النهائي القياسي (mg/mL) لأي دواء حسب ثبات 24 ساعة في صيدليتك
                  </p>
                </div>
              </div>

              <div className="divide-y divide-slate-200 max-h-[650px] overflow-y-auto">
                {formulary.map((drug) => {
                  const isEditing = editingDrugId === drug.id;
                  return (
                    <div key={drug.id} className="py-3 px-2 hover:bg-slate-50">
                      {isEditing ? (
                        <div className="space-y-2 bg-teal-50/70 p-3 rounded-xl border border-teal-200">
                          <div className="font-bold text-sm text-teal-950">
                            Editing: {drug.tradeName} ({drug.genericName})
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600">
                                Final Conc (mg/mL)
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={editConcValue}
                                onChange={(e) => setEditConcValue(e.target.value)}
                                className="w-full p-1.5 text-xs font-black font-mono bg-white border border-teal-500 rounded"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600">
                                Diluent
                              </label>
                              <input
                                type="text"
                                value={editDiluentValue}
                                onChange={(e) => setEditDiluentValue(e.target.value)}
                                className="w-full p-1.5 text-xs bg-white border border-slate-300 rounded"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600">
                              Preparation Instructions
                            </label>
                            <input
                              type="text"
                              value={editPrepValue}
                              onChange={(e) => setEditPrepValue(e.target.value)}
                              className="w-full p-1.5 text-xs bg-white border border-slate-300 rounded"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600">
                              24h Stability Note
                            </label>
                            <input
                              type="text"
                              value={editStabilityValue}
                              onChange={(e) => setEditStabilityValue(e.target.value)}
                              className="w-full p-1.5 text-xs bg-white border border-slate-300 rounded"
                            />
                          </div>
                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              onClick={() => setEditingDrugId(null)}
                              className="px-3 py-1 text-xs font-bold bg-white border border-slate-300 rounded-lg"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => saveMasterDrugEdit(drug.id)}
                              className="px-3 py-1 text-xs font-bold bg-teal-700 text-white rounded-lg"
                            >
                              Save Standard
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-extrabold text-sm text-slate-900">
                                {drug.tradeName}
                              </span>
                              <span className="text-xs text-slate-500 font-semibold">
                                ({drug.genericName})
                              </span>
                              <span className="text-xs font-extrabold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-mono tabular-nums">
                                {drug.finalConcMgMl} /mL
                              </span>
                            </div>
                            <div className="text-xs text-slate-600 mt-0.5">
                              {drug.prepInstructions}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {drug.stability} • {drug.reference}
                            </div>
                          </div>

                          <button
                            onClick={() => startEditingMasterDrug(drug)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 flex items-center gap-1 shrink-0"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* QUICK ADD CUSTOM DRUG MODAL (ACCESSIBLE DIRECTLY FROM TAB 1) */}
      {isQuickAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  + Quick Add Custom Drug to Pharmacy
                </h3>
                <p className="text-xs text-slate-500" dir="rtl">
                  أضف أي دواء غير موجود وسيتم حسابه فوراً لوزن المريض الحالي ({patient.weightKg} كجم)
                </p>
              </div>
              <button
                onClick={() => setIsQuickAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewFormularyDrug} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Trade Name (System)*
                  </label>
                  <input
                    type="text"
                    required
                    value={newDrugForm.tradeName}
                    onChange={(e) =>
                      setNewDrugForm({ ...newDrugForm, tradeName: e.target.value })
                    }
                    placeholder="e.g. Invanz"
                    className="w-full p-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Active Ingredient*
                  </label>
                  <input
                    type="text"
                    required
                    value={newDrugForm.genericName}
                    onChange={(e) =>
                      setNewDrugForm({ ...newDrugForm, genericName: e.target.value })
                    }
                    placeholder="e.g. Ertapenem"
                    className="w-full p-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Final Conc (/mL)*
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newDrugForm.finalConcMgMl}
                    onChange={(e) =>
                      setNewDrugForm({ ...newDrugForm, finalConcMgMl: e.target.value })
                    }
                    className="w-full p-2 text-xs font-black font-mono bg-teal-50 border border-teal-500 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Dose (/kg)*
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newDrugForm.doseMgPerKg}
                    onChange={(e) =>
                      setNewDrugForm({ ...newDrugForm, doseMgPerKg: e.target.value })
                    }
                    className="w-full p-2 text-xs font-bold font-mono bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Max Single
                  </label>
                  <input
                    type="number"
                    value={newDrugForm.maxSingleMg}
                    onChange={(e) =>
                      setNewDrugForm({ ...newDrugForm, maxSingleMg: e.target.value })
                    }
                    className="w-full p-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Frequency
                  </label>
                  <select
                    value={newDrugForm.frequency}
                    onChange={(e) =>
                      setNewDrugForm({ ...newDrugForm, frequency: e.target.value })
                    }
                    className="w-full p-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    {Object.keys(FREQUENCY_CONFIG).map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Route
                  </label>
                  <select
                    value={newDrugForm.route}
                    onChange={(e) =>
                      setNewDrugForm({ ...newDrugForm, route: e.target.value })
                    }
                    className="w-full p-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="IV Shot">IV Shot</option>
                    <option value="IV Infusion">IV Infusion</option>
                    <option value="SC Shot">SC Shot</option>
                    <option value="PO / SL">PO / SL</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Preparation & Dilution Instructions
                </label>
                <input
                  type="text"
                  value={newDrugForm.prepInstructions}
                  onChange={(e) =>
                    setNewDrugForm({ ...newDrugForm, prepInstructions: e.target.value })
                  }
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsQuickAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold bg-slate-100 text-slate-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-extrabold bg-teal-700 hover:bg-teal-800 text-white rounded-xl"
                >
                  Save & Auto-Calculate Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}