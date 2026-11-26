import type { FormularyDrug } from '../types/pharmacy';

export const INITIAL_PHARMACY_FORMULARY: FormularyDrug[] = [
  {
    "id": "vancocin",
    "tradeName": "Vancocin",
    "genericName": "Vancomycin",
    "arabicName": "فانكوسين / فانكوميسين",
    "category": "Antimicrobials",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "500 mg in 100 mL NS/D5W -> 5 mg/mL (Infuse over 60-90 min)",
    "finalConcMgMl": 5,
    "route": "IV Infusion",
    "stability": "24h RT | 14d Fridge at 5 mg/mL",
    "reference": "Lexidrug / ASHP IDSA",
    "presets": [
      {
        "id": "std",
        "label": "Standard / Surgical (15 mg/kg)",
        "doseMgPerKg": 15,
        "maxSingleMg": 1000,
        "frequency": "q8h"
      },
      {
        "id": "cns",
        "label": "Meningitis / MRSA (20 mg/kg)",
        "doseMgPerKg": 20,
        "maxSingleMg": 1000,
        "frequency": "q8h"
      },
      {
        "id": "q6h",
        "label": "Severe Sepsis q6h (15 mg/kg)",
        "doseMgPerKg": 15,
        "maxSingleMg": 1000,
        "frequency": "q6h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "meronem",
    "tradeName": "Meronem",
    "genericName": "Meropenem",
    "arabicName": "ميرونيم / ميروبينيم",
    "category": "Antimicrobials",
    "diluent": "0.9% NS",
    "prepInstructions": "Dilute in 0.9% NS to 20 mg/mL (Infuse over 15-30 min)",
    "finalConcMgMl": 20,
    "route": "IV Infusion",
    "stability": "4h RT in NS | 24h Fridge (Only 1h in D5W)",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "std",
        "label": "Intra-Abdominal / Sepsis (20 mg/kg)",
        "doseMgPerKg": 20,
        "maxSingleMg": 1000,
        "frequency": "q8h"
      },
      {
        "id": "cns",
        "label": "Meningitis / Pseudomonas (40 mg/kg)",
        "doseMgPerKg": 40,
        "maxSingleMg": 2000,
        "frequency": "q8h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "tienam",
    "tradeName": "Tienam",
    "genericName": "Imipenem / Cilastatin",
    "arabicName": "تينام / إيميبينيم",
    "category": "Antimicrobials",
    "diluent": "0.9% NS",
    "prepInstructions": "Reconstitute 500 mg directly in 100 mL NS -> 5 mg/mL",
    "finalConcMgMl": 5,
    "route": "IV Infusion",
    "stability": "4h RT | 24h Fridge",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "std",
        "label": "Severe Infection (15 mg/kg)",
        "doseMgPerKg": 15,
        "maxSingleMg": 500,
        "frequency": "q6h"
      },
      {
        "id": "high",
        "label": "Pseudomonas / Severe (25 mg/kg)",
        "doseMgPerKg": 25,
        "maxSingleMg": 1000,
        "frequency": "q6h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "tazocin",
    "tradeName": "Tazocin",
    "genericName": "Piperacillin / Tazobactam",
    "arabicName": "تازوسين / بيبيراسيلين",
    "category": "Antimicrobials",
    "diluent": "0.9% NS",
    "prepInstructions": "Recon 4.5 g with 20 mL NS, dilute to 50 mg/mL (Pip component)",
    "finalConcMgMl": 50,
    "route": "IV Infusion",
    "stability": "24h RT | 48h Fridge",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "abd",
        "label": "Appendicitis / Intra-Abd (100 mg/kg)",
        "doseMgPerKg": 100,
        "maxSingleMg": 4000,
        "frequency": "q8h"
      },
      {
        "id": "feb",
        "label": "Febrile Neutropenia (80 mg/kg)",
        "doseMgPerKg": 80,
        "maxSingleMg": 4000,
        "frequency": "q6h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "maxipime",
    "tradeName": "Maxipime",
    "genericName": "Cefepime",
    "arabicName": "ماكسيبيم / سيفيبيم",
    "category": "Antimicrobials",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Recon 1 g with 10 mL WFI, dilute in NS to 40 mg/mL",
    "finalConcMgMl": 40,
    "route": "IV Infusion",
    "stability": "24h RT | 7d Fridge",
    "reference": "Lexidrug / BNFc",
    "presets": [
      {
        "id": "std",
        "label": "Standard / Febrile Neutropenia (50 mg/kg)",
        "doseMgPerKg": 50,
        "maxSingleMg": 2000,
        "frequency": "q8h"
      },
      {
        "id": "mod",
        "label": "Moderate Infection (50 mg/kg q12h)",
        "doseMgPerKg": 50,
        "maxSingleMg": 2000,
        "frequency": "q12h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "fortum",
    "tradeName": "Fortum",
    "genericName": "Ceftazidime",
    "arabicName": "فورتام / سيفتازيديم",
    "category": "Antimicrobials",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Recon 1 g with 10 mL WFI, dilute in NS to 40 mg/mL",
    "finalConcMgMl": 40,
    "route": "IV Infusion",
    "stability": "24h RT | 7d Fridge",
    "reference": "BNFc / Lexidrug",
    "presets": [
      {
        "id": "std",
        "label": "Moderate-Severe Infection (50 mg/kg)",
        "doseMgPerKg": 50,
        "maxSingleMg": 2000,
        "frequency": "q8h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "rocephin",
    "tradeName": "Rocephin",
    "genericName": "Ceftriaxone",
    "arabicName": "روسيفين / سيفاكسون / سيفترياكسون",
    "category": "Antimicrobials",
    "diluent": "0.9% NS / D5W (NO RL!)",
    "prepInstructions": "Recon 1 g with 10 mL WFI, dilute in NS to 40 mg/mL",
    "finalConcMgMl": 40,
    "route": "IV Infusion",
    "stability": "24h RT | 3d Fridge (Incompatible with Ca/RL)",
    "reference": "Lexidrug / FDA",
    "presets": [
      {
        "id": "std",
        "label": "Surgical / Standard (50 mg/kg)",
        "doseMgPerKg": 50,
        "maxSingleMg": 2000,
        "frequency": "q24h"
      },
      {
        "id": "cns",
        "label": "Severe Sepsis / Meningitis (100 mg/kg)",
        "doseMgPerKg": 100,
        "maxSingleMg": 2000,
        "frequency": "q24h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "claforan",
    "tradeName": "Claforan",
    "genericName": "Cefotaxime",
    "arabicName": "كلافوران / سيفوتاكسيم",
    "category": "Antimicrobials",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Recon 1 g with 10 mL WFI, dilute in NS to 50 mg/mL",
    "finalConcMgMl": 50,
    "route": "IV Infusion",
    "stability": "24h RT | 5d Fridge",
    "reference": "BNFc / Lexidrug",
    "presets": [
      {
        "id": "std",
        "label": "Surgical / Peritonitis (50 mg/kg)",
        "doseMgPerKg": 50,
        "maxSingleMg": 2000,
        "frequency": "q8h"
      },
      {
        "id": "sev",
        "label": "Severe Sepsis q6h (50 mg/kg)",
        "doseMgPerKg": 50,
        "maxSingleMg": 2000,
        "frequency": "q6h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "zinacef",
    "tradeName": "Zinacef",
    "genericName": "Cefuroxime",
    "arabicName": "زيناسيف / سيفوروكسيم",
    "category": "Antimicrobials",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Recon 750 mg with 8 mL WFI, dilute in NS to 30 mg/mL",
    "finalConcMgMl": 30,
    "route": "IV Infusion",
    "stability": "24h RT | 48h Fridge",
    "reference": "ASHP Prophylaxis / BNFc",
    "presets": [
      {
        "id": "proph",
        "label": "Surgical Prophylaxis (50 mg/kg)",
        "doseMgPerKg": 50,
        "maxSingleMg": 1500,
        "frequency": "q8h"
      },
      {
        "id": "std",
        "label": "Moderate Infection (30 mg/kg)",
        "doseMgPerKg": 30,
        "maxSingleMg": 1500,
        "frequency": "q8h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "zinol",
    "tradeName": "Zinol",
    "genericName": "Cefazolin",
    "arabicName": "زينول / سيفازولين",
    "category": "Antimicrobials",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Recon 1 g with 10 mL WFI, dilute in NS to 20 mg/mL",
    "finalConcMgMl": 20,
    "route": "IV Infusion",
    "stability": "24h RT | 10d Fridge",
    "reference": "ASHP Surgical Prophylaxis",
    "presets": [
      {
        "id": "proph",
        "label": "Pre-Op Surgical Prophylaxis (30 mg/kg)",
        "doseMgPerKg": 30,
        "maxSingleMg": 2000,
        "frequency": "q8h"
      },
      {
        "id": "std",
        "label": "MSSA / Skin & Soft Tissue (25 mg/kg)",
        "doseMgPerKg": 25,
        "maxSingleMg": 2000,
        "frequency": "q8h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "unasyn",
    "tradeName": "Unasyn",
    "genericName": "Ampicillin / Sulbactam",
    "arabicName": "يوناسين / أمبيسيلين سالباكتام",
    "category": "Antimicrobials",
    "diluent": "0.9% NS ONLY",
    "prepInstructions": "Recon 1.5 g (1 g Amp) with 3.2 mL WFI, dilute in NS to 30 mg/mL",
    "finalConcMgMl": 30,
    "route": "IV Infusion",
    "stability": "8h RT in 0.9% NS (Only 2h in D5W!)",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "std",
        "label": "Surgical / Intra-Abd (50 mg/kg Amp)",
        "doseMgPerKg": 50,
        "maxSingleMg": 2000,
        "frequency": "q6h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "augmentin_iv",
    "tradeName": "Augmentin IV",
    "genericName": "Amoxicillin / Clavulanate",
    "arabicName": "أوجمنتين حقن / أموكسيسيلين",
    "category": "Antimicrobials",
    "diluent": "0.9% NS ONLY (NO D5W!)",
    "prepInstructions": "Recon 1.2 g with 20 mL WFI, dilute in NS to 20 mg/mL (Amox)",
    "finalConcMgMl": 20,
    "route": "IV Infusion",
    "stability": "4h RT in 0.9% NS (Unstable in Dextrose)",
    "reference": "BNFc / Medusa",
    "presets": [
      {
        "id": "std",
        "label": "Standard / Surgical (25 mg/kg Amox)",
        "doseMgPerKg": 25,
        "maxSingleMg": 1000,
        "frequency": "q8h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "amikin",
    "tradeName": "Amikin",
    "genericName": "Amikacin",
    "arabicName": "أميكين / أميكاسين",
    "category": "Antimicrobials",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Dilute 500 mg (2 mL) in 98 mL NS -> 5 mg/mL (Infuse 30-60 min)",
    "finalConcMgMl": 5,
    "route": "IV Infusion",
    "stability": "24h RT | 60d Fridge",
    "reference": "Lexidrug / Sanford Guide",
    "presets": [
      {
        "id": "od",
        "label": "Once-Daily Regimen (15 mg/kg)",
        "doseMgPerKg": 15,
        "maxSingleMg": 1500,
        "frequency": "q24h"
      },
      {
        "id": "div",
        "label": "Divided q8h (7.5 mg/kg)",
        "doseMgPerKg": 7.5,
        "maxSingleMg": 500,
        "frequency": "q8h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "garamycin",
    "tradeName": "Garamycin",
    "genericName": "Gentamicin",
    "arabicName": "جاراميسين / جنتاميسين",
    "category": "Antimicrobials",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Dilute 80 mg (2 mL) + 38 mL NS -> 2 mg/mL (Infuse 30 min)",
    "finalConcMgMl": 2,
    "route": "IV Infusion",
    "stability": "24h RT",
    "reference": "BNFc / Lexidrug",
    "presets": [
      {
        "id": "od",
        "label": "Once-Daily Surgical / UTI (7 mg/kg)",
        "doseMgPerKg": 7,
        "maxSingleMg": 500,
        "frequency": "q24h"
      },
      {
        "id": "div",
        "label": "Conventional q8h (2.5 mg/kg)",
        "doseMgPerKg": 2.5,
        "maxSingleMg": 160,
        "frequency": "q8h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "nebcin",
    "tradeName": "Nebcin",
    "genericName": "Tobramycin",
    "arabicName": "توبراميسين",
    "category": "Antimicrobials",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Dilute 80 mg (2 mL) + 38 mL NS -> 2 mg/mL",
    "finalConcMgMl": 2,
    "route": "IV Infusion",
    "stability": "24h RT",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "od",
        "label": "Once-Daily (7 mg/kg)",
        "doseMgPerKg": 7,
        "maxSingleMg": 500,
        "frequency": "q24h"
      },
      {
        "id": "cf",
        "label": "Cystic Fibrosis / Pseudomonas (10 mg/kg)",
        "doseMgPerKg": 10,
        "maxSingleMg": 600,
        "frequency": "q24h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "ciprocin",
    "tradeName": "Ciprocin",
    "genericName": "Ciprofloxacin",
    "arabicName": "سيبروسين / سيبروفلوكساسين",
    "category": "Antimicrobials",
    "diluent": "Ready-to-Use 2 mg/mL Bag",
    "prepInstructions": "Ready-to-Use 200 mg/100 mL (2 mg/mL) — Infuse over 60 min",
    "finalConcMgMl": 2,
    "route": "IV Infusion",
    "stability": "24h RT; protect from light",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "std",
        "label": "Complicated UTI / GI (10 mg/kg)",
        "doseMgPerKg": 10,
        "maxSingleMg": 400,
        "frequency": "q12h"
      },
      {
        "id": "sev",
        "label": "Severe Pseudomonas q8h (10 mg/kg)",
        "doseMgPerKg": 10,
        "maxSingleMg": 400,
        "frequency": "q8h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "tavanic",
    "tradeName": "Tavanic",
    "genericName": "Levofloxacin",
    "arabicName": "تافانيك / ليفوفلوكساسين",
    "category": "Antimicrobials",
    "diluent": "Ready-to-Use 5 mg/mL Bag",
    "prepInstructions": "Ready-to-Use 500 mg/100 mL (5 mg/mL) — Infuse over 60-90 min",
    "finalConcMgMl": 5,
    "route": "IV Infusion",
    "stability": "24h RT; protect from light",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "u5",
        "label": "Child < 5 yrs (10 mg/kg q12h)",
        "doseMgPerKg": 10,
        "maxSingleMg": 500,
        "frequency": "q12h"
      },
      {
        "id": "o5",
        "label": "Child ≥ 5 yrs (10 mg/kg q24h)",
        "doseMgPerKg": 10,
        "maxSingleMg": 750,
        "frequency": "q24h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "flagyl",
    "tradeName": "Flagyl",
    "genericName": "Metronidazole",
    "arabicName": "فلاجيل / ميترونيدازول",
    "category": "Antimicrobials",
    "diluent": "Ready-to-Use 5 mg/mL Bag",
    "prepInstructions": "Ready-to-Use 500 mg/100 mL (5 mg/mL) — Infuse over 30-60 min",
    "finalConcMgMl": 5,
    "route": "IV Infusion",
    "stability": "24h RT; protect from light; do NOT refrigerate",
    "reference": "ASHP / BNFc",
    "presets": [
      {
        "id": "std",
        "label": "Anaerobic / GI Surgery (7.5 mg/kg)",
        "doseMgPerKg": 7.5,
        "maxSingleMg": 500,
        "frequency": "q8h"
      },
      {
        "id": "proph",
        "label": "Pre-Op Surgical Prophylaxis (15 mg/kg)",
        "doseMgPerKg": 15,
        "maxSingleMg": 500,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "dalacin",
    "tradeName": "Dalacin C",
    "genericName": "Clindamycin",
    "arabicName": "دالاسين سي / كليندامايسين",
    "category": "Antimicrobials",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Dilute 600 mg (4 mL) in 50 mL NS -> 12 mg/mL (Max 18 mg/mL)",
    "finalConcMgMl": 12,
    "route": "IV Infusion",
    "stability": "24h RT | 32d Fridge",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "std",
        "label": "Soft Tissue / Bone / MRSA (10 mg/kg)",
        "doseMgPerKg": 10,
        "maxSingleMg": 600,
        "frequency": "q8h"
      },
      {
        "id": "sev",
        "label": "Necrotizing / Toxic Shock (13 mg/kg)",
        "doseMgPerKg": 13,
        "maxSingleMg": 900,
        "frequency": "q8h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "zyvox",
    "tradeName": "Zyvox",
    "genericName": "Linezolid",
    "arabicName": "زيفوكس / لينيزوليد",
    "category": "Antimicrobials",
    "diluent": "Ready-to-Use 2 mg/mL Bag",
    "prepInstructions": "Ready-to-Use 600 mg/300 mL (2 mg/mL) — Infuse over 30-120 min",
    "finalConcMgMl": 2,
    "route": "IV Infusion",
    "stability": "24h RT; protect from light",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "u12",
        "label": "Child < 12 yrs (10 mg/kg q8h)",
        "doseMgPerKg": 10,
        "maxSingleMg": 600,
        "frequency": "q8h"
      },
      {
        "id": "o12",
        "label": "Adolescent ≥ 12 yrs (10 mg/kg q12h)",
        "doseMgPerKg": 10,
        "maxSingleMg": 600,
        "frequency": "q12h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "targocid",
    "tradeName": "Targocid",
    "genericName": "Teicoplanin",
    "arabicName": "تارجوسيد / تيكوبلانين",
    "category": "Antimicrobials",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Recon 400 mg with 3 mL WFI gently (no foam), dilute in NS to 10 mg/mL",
    "finalConcMgMl": 10,
    "route": "IV Infusion",
    "stability": "24h Fridge",
    "reference": "BNFc / Medusa",
    "presets": [
      {
        "id": "load",
        "label": "Loading Dose q12h x 3 doses (10 mg/kg)",
        "doseMgPerKg": 10,
        "maxSingleMg": 800,
        "frequency": "q12h"
      },
      {
        "id": "maint",
        "label": "Maintenance Dose (10 mg/kg q24h)",
        "doseMgPerKg": 10,
        "maxSingleMg": 800,
        "frequency": "q24h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "colomycin",
    "tradeName": "Colomycin",
    "genericName": "Colistimethate Sodium (Colistin)",
    "arabicName": "كولوميسين / كوليستين (مليون وحدة)",
    "category": "Antimicrobials",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "1 Million IU (MIU) in 10 mL NS -> 0.1 MIU/mL (100,000 IU/mL)",
    "finalConcMgMl": 0.1,
    "route": "IV Infusion",
    "stability": "24h Fridge (Dosed in Million IU/kg!)",
    "reference": "BNFc / EMA Colistin",
    "presets": [
      {
        "id": "std",
        "label": "MDR Gram-Neg (0.025 MIU/kg = 25,000 IU/kg)",
        "doseMgPerKg": 0.025,
        "maxSingleMg": 2,
        "frequency": "q8h"
      },
      {
        "id": "high",
        "label": "Severe MDR Sepsis (0.05 MIU/kg)",
        "doseMgPerKg": 0.05,
        "maxSingleMg": 3,
        "frequency": "q8h"
      }
    ],
    "doseUnit": "MIU"
  },
  {
    "id": "tygacil",
    "tradeName": "Tygacil",
    "genericName": "Tigecycline",
    "arabicName": "تيجاسيل / تيجيسيكلين",
    "category": "Antimicrobials",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Recon 50 mg with 5.3 mL NS (10 mg/mL), dilute to 1 mg/mL",
    "finalConcMgMl": 1,
    "route": "IV Infusion",
    "stability": "6h RT | 48h Fridge at 1 mg/mL",
    "reference": "Lexidrug Pediatric (≥ 8 yrs)",
    "presets": [
      {
        "id": "std",
        "label": "Child 8-17 yrs (1.2 mg/kg)",
        "doseMgPerKg": 1.2,
        "maxSingleMg": 50,
        "frequency": "q12h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "zithromax_iv",
    "tradeName": "Zithromax IV",
    "genericName": "Azithromycin",
    "arabicName": "زيثروماكس حقن / أزيثرومايسين",
    "category": "Antimicrobials",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Recon 500 mg with 4.8 mL WFI (100 mg/mL), dilute to 2 mg/mL",
    "finalConcMgMl": 2,
    "route": "IV Infusion",
    "stability": "24h RT | 7d Fridge at 2 mg/mL",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "std",
        "label": "Atypical Pneumonia / PID (10 mg/kg)",
        "doseMgPerKg": 10,
        "maxSingleMg": 500,
        "frequency": "q24h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "erythromycin_iv",
    "tradeName": "Erythrocin IV",
    "genericName": "Erythromycin Lactobionate",
    "arabicName": "إريثرومايسين حقن",
    "category": "Antimicrobials",
    "diluent": "0.9% NS",
    "prepInstructions": "Recon 1 g with 20 mL WFI (50 mg/mL), dilute in NS to 5 mg/mL",
    "finalConcMgMl": 5,
    "route": "IV Infusion",
    "stability": "8h RT | 24h Fridge",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "inf",
        "label": "Severe Infection (10 mg/kg)",
        "doseMgPerKg": 10,
        "maxSingleMg": 1000,
        "frequency": "q6h"
      },
      {
        "id": "prok",
        "label": "GI Prokinetic / Feeding Intolerance (3 mg/kg)",
        "doseMgPerKg": 3,
        "maxSingleMg": 250,
        "frequency": "q8h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "septrin_iv",
    "tradeName": "Septrin IV",
    "genericName": "Trimethoprim / Sulfamethoxazole",
    "arabicName": "سبترين حقن / كوتريموكسازول",
    "category": "Antimicrobials",
    "diluent": "D5W Preferred (or 0.9% NS)",
    "prepInstructions": "Dilute 80 mg TMP (5 mL) in 125 mL D5W -> 0.64 mg/mL (TMP)",
    "finalConcMgMl": 0.64,
    "route": "IV Infusion",
    "stability": "6h RT (Dosed on Trimethoprim component)",
    "reference": "Lexidrug / BNFc",
    "presets": [
      {
        "id": "std",
        "label": "Severe UTI / Stenotrophomonas (4 mg/kg TMP)",
        "doseMgPerKg": 4,
        "maxSingleMg": 160,
        "frequency": "q12h"
      },
      {
        "id": "pjp",
        "label": "PCP / PJP Pneumonia (5 mg/kg TMP)",
        "doseMgPerKg": 5,
        "maxSingleMg": 320,
        "frequency": "q6h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "diflucan",
    "tradeName": "Diflucan",
    "genericName": "Fluconazole",
    "arabicName": "ديفلوكان / فلوكونازول",
    "category": "Antimicrobials",
    "diluent": "Ready-to-Use 2 mg/mL Bottle",
    "prepInstructions": "Ready-to-Use 200 mg/100 mL (2 mg/mL) — Infuse over 1-2 hrs",
    "finalConcMgMl": 2,
    "route": "IV Infusion",
    "stability": "24h RT; do not freeze",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "maint",
        "label": "Candidiasis Maintenance (6 mg/kg)",
        "doseMgPerKg": 6,
        "maxSingleMg": 400,
        "frequency": "q24h"
      },
      {
        "id": "load",
        "label": "Invasive Candidiasis / Load (12 mg/kg)",
        "doseMgPerKg": 12,
        "maxSingleMg": 800,
        "frequency": "q24h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "vfend",
    "tradeName": "Vfend",
    "genericName": "Voriconazole",
    "arabicName": "فيفند / فوريكونازول",
    "category": "Antimicrobials",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Recon 200 mg with 19 mL WFI (10 mg/mL), dilute to 2 mg/mL",
    "finalConcMgMl": 2,
    "route": "IV Infusion",
    "stability": "24h Fridge at 2-5 mg/mL",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "load",
        "label": "Loading Dose Day 1 (9 mg/kg)",
        "doseMgPerKg": 9,
        "maxSingleMg": 600,
        "frequency": "q12h"
      },
      {
        "id": "maint",
        "label": "Maintenance Dose (8 mg/kg)",
        "doseMgPerKg": 8,
        "maxSingleMg": 400,
        "frequency": "q12h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "cancidas",
    "tradeName": "Cancidas",
    "genericName": "Caspofungin",
    "arabicName": "كانسيداس / كاسبوفونجين",
    "category": "Antimicrobials",
    "diluent": "0.9% NS ONLY (NO Dextrose!)",
    "prepInstructions": "Recon 50 mg with 10.5 mL NS, dilute in NS to 0.5 mg/mL",
    "finalConcMgMl": 0.5,
    "route": "IV Infusion",
    "stability": "24h RT | 48h Fridge in 0.9% NS",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "maint",
        "label": "Maintenance (~50 mg/m2 ≈ 1.5 mg/kg)",
        "doseMgPerKg": 1.5,
        "maxSingleMg": 50,
        "frequency": "q24h"
      },
      {
        "id": "load",
        "label": "Day 1 Loading (~70 mg/m2 ≈ 2 mg/kg)",
        "doseMgPerKg": 2,
        "maxSingleMg": 70,
        "frequency": "q24h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "ambisome",
    "tradeName": "AmBisome",
    "genericName": "Amphotericin B Liposomal",
    "arabicName": "أمبيزوم / أمفوتيريسين ليبوزومال",
    "category": "Antimicrobials",
    "diluent": "D5W ONLY (Incompatible with NS!)",
    "prepInstructions": "Recon 50 mg with 12 mL WFI (4 mg/mL), filter & dilute in D5W to 1 mg/mL",
    "finalConcMgMl": 1,
    "route": "IV Infusion",
    "stability": "24h Fridge in D5W ONLY",
    "reference": "Lexidrug / Trissel’s",
    "presets": [
      {
        "id": "emp",
        "label": "Empiric Antifungal (3 mg/kg)",
        "doseMgPerKg": 3,
        "maxSingleMg": 300,
        "frequency": "q24h"
      },
      {
        "id": "inv",
        "label": "Invasive Aspergillosis / Mucor (5 mg/kg)",
        "doseMgPerKg": 5,
        "maxSingleMg": 500,
        "frequency": "q24h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "zovirax",
    "tradeName": "Zovirax",
    "genericName": "Acyclovir",
    "arabicName": "زوفيراكس / أسيكلوفير",
    "category": "Antimicrobials",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Recon 250 mg with 10 mL WFI (25 mg/mL), dilute in NS to 5 mg/mL",
    "finalConcMgMl": 5,
    "route": "IV Infusion",
    "stability": "24h RT (Do NOT refrigerate — precipitates!)",
    "reference": "Lexidrug / Trissel’s",
    "presets": [
      {
        "id": "std",
        "label": "HSV / Varicella (10 mg/kg)",
        "doseMgPerKg": 10,
        "maxSingleMg": 800,
        "frequency": "q8h"
      },
      {
        "id": "cns",
        "label": "HSV Encephalitis (20 mg/kg)",
        "doseMgPerKg": 20,
        "maxSingleMg": 1000,
        "frequency": "q8h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "cymevene",
    "tradeName": "Cymevene",
    "genericName": "Ganciclovir",
    "arabicName": "سيميفين / جانسيكلوفير",
    "category": "Antimicrobials",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Recon 500 mg with 10 mL WFI (50 mg/mL), dilute in NS to 5 mg/mL",
    "finalConcMgMl": 5,
    "route": "IV Infusion",
    "stability": "24h Fridge (Hazardous Drug — Handle with PPE)",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "ind",
        "label": "CMV Induction (5 mg/kg q12h)",
        "doseMgPerKg": 5,
        "maxSingleMg": 500,
        "frequency": "q12h"
      },
      {
        "id": "maint",
        "label": "CMV Maintenance (5 mg/kg q24h)",
        "doseMgPerKg": 5,
        "maxSingleMg": 500,
        "frequency": "q24h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "perfalgan",
    "tradeName": "Perfalgan",
    "genericName": "Paracetamol IV",
    "arabicName": "بيرفالجان / باراسيتامول حقن",
    "category": "Analgesia & ICU",
    "diluent": "Ready-to-Use 10 mg/mL Vial",
    "prepInstructions": "Ready-to-Use 1000 mg/100 mL (10 mg/mL) — Infuse over 15 min",
    "finalConcMgMl": 10,
    "route": "IV Infusion",
    "stability": "Single-use vial; infuse immediately",
    "reference": "BNFc / Lexidrug",
    "presets": [
      {
        "id": "child",
        "label": "Child ≥ 10 kg (15 mg/kg)",
        "doseMgPerKg": 15,
        "maxSingleMg": 1000,
        "frequency": "q6h"
      },
      {
        "id": "inf",
        "label": "Infant < 10 kg (7.5 mg/kg)",
        "doseMgPerKg": 7.5,
        "maxSingleMg": 75,
        "frequency": "q6h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "ketolac",
    "tradeName": "Ketolac",
    "genericName": "Ketorolac Tromethamine",
    "arabicName": "كيتولاك / كيتورولاك",
    "category": "Analgesia & ICU",
    "diluent": "0.9% NS",
    "prepInstructions": "Dilute 30 mg (1 mL) + 1 mL 0.9% NS -> Total 2 mL (15 mg/mL)",
    "finalConcMgMl": 15,
    "route": "IV Shot",
    "stability": "24h RT (Max therapy duration: 48 hrs)",
    "reference": "Lexidrug / BNFc",
    "presets": [
      {
        "id": "std",
        "label": "Post-Op Analgesia (0.5 mg/kg)",
        "doseMgPerKg": 0.5,
        "maxSingleMg": 30,
        "frequency": "q6h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "voltaren_iv",
    "tradeName": "Voltaren IV",
    "genericName": "Diclofenac Sodium",
    "arabicName": "فولتارين حقن / ديكلوفيناك",
    "category": "Analgesia & ICU",
    "diluent": "0.9% NS (Buffered with NaHCO3)",
    "prepInstructions": "Dilute 75 mg (3 mL) in 72 mL buffered NS -> 1 mg/mL (Infuse 30 min)",
    "finalConcMgMl": 1,
    "route": "IV Infusion",
    "stability": "Prepare fresh immediately before infusion",
    "reference": "BNFc Pediatric",
    "presets": [
      {
        "id": "std",
        "label": "Post-Op Pain (1 mg/kg)",
        "doseMgPerKg": 1,
        "maxSingleMg": 75,
        "frequency": "q12h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "ibuprofen_iv",
    "tradeName": "Caldolor / Ibuprofen IV",
    "genericName": "Ibuprofen IV",
    "arabicName": "إيبوبروفين حقن",
    "category": "Analgesia & ICU",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Dilute 400 mg (4 mL) in 96 mL NS -> 4 mg/mL (Infuse over 10-30 min)",
    "finalConcMgMl": 4,
    "route": "IV Infusion",
    "stability": "24h RT at ≤ 4 mg/mL",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "std",
        "label": "Pain / Fever (10 mg/kg)",
        "doseMgPerKg": 10,
        "maxSingleMg": 400,
        "frequency": "q6h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "morphine",
    "tradeName": "Morphine",
    "genericName": "Morphine Sulfate",
    "arabicName": "مورفين سلفات",
    "category": "Analgesia & ICU",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Dilute 10 mg (1 mL) + 9 mL 0.9% NS -> 1 mg/mL (Slow IV 5-10 min)",
    "finalConcMgMl": 1,
    "route": "IV Shot",
    "stability": "24h RT (High-Alert Narcotic)",
    "reference": "BNFc / Lexidrug",
    "presets": [
      {
        "id": "std",
        "label": "Severe Post-Op Pain (0.1 mg/kg)",
        "doseMgPerKg": 0.1,
        "maxSingleMg": 10,
        "frequency": "q4h"
      },
      {
        "id": "low",
        "label": "Initial Titration (0.05 mg/kg)",
        "doseMgPerKg": 0.05,
        "maxSingleMg": 5,
        "frequency": "q4h"
      }
    ],
    "doseUnit": "mg",
    "highAlert": true
  },
  {
    "id": "fentanyl",
    "tradeName": "Fentanyl",
    "genericName": "Fentanyl Citrate",
    "arabicName": "فنتانيل (ميكروجرام)",
    "category": "Analgesia & ICU",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Dilute 100 mcg (2 mL) + 8 mL NS -> 10 mcg/mL (0.01 mg/mL)",
    "finalConcMgMl": 10,
    "route": "IV Shot",
    "stability": "24h RT (Dosed in mcg/kg! Conc = 10 mcg/mL)",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "std",
        "label": "Acute Pain / Sedation (1 mcg/kg)",
        "doseMgPerKg": 1,
        "maxSingleMg": 100,
        "frequency": "q4h"
      },
      {
        "id": "proc",
        "label": "Procedural Analgesia (2 mcg/kg)",
        "doseMgPerKg": 2,
        "maxSingleMg": 100,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "mcg",
    "highAlert": true
  },
  {
    "id": "nalufin",
    "tradeName": "Nalufin",
    "genericName": "Nalbuphine",
    "arabicName": "نالوفين / نالبوفين",
    "category": "Analgesia & ICU",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Dilute 20 mg (1 mL) + 9 mL NS -> 2 mg/mL (Slow IV over 5 min)",
    "finalConcMgMl": 2,
    "route": "IV Shot",
    "stability": "24h RT",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "std",
        "label": "Moderate-Severe Post-Op Pain (0.1 mg/kg)",
        "doseMgPerKg": 0.1,
        "maxSingleMg": 10,
        "frequency": "q4h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "tramal",
    "tradeName": "Tramal",
    "genericName": "Tramadol",
    "arabicName": "ترامال / ترامادول",
    "category": "Analgesia & ICU",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Dilute 100 mg (2 mL) + 18 mL NS -> 5 mg/mL (Slow IV over 10 min)",
    "finalConcMgMl": 5,
    "route": "IV Infusion",
    "stability": "24h RT (Age ≥ 12 yrs recommended)",
    "reference": "BNFc Pediatric",
    "presets": [
      {
        "id": "std",
        "label": "Post-Op Analgesia (1 mg/kg)",
        "doseMgPerKg": 1,
        "maxSingleMg": 100,
        "frequency": "q6h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "pethidine",
    "tradeName": "Pethidine",
    "genericName": "Meperidine / Pethidine",
    "arabicName": "بيثيدين / ميبيريدين",
    "category": "Analgesia & ICU",
    "diluent": "0.9% NS",
    "prepInstructions": "Dilute 50 mg (1 mL) + 4 mL NS -> 10 mg/mL (Slow IV)",
    "finalConcMgMl": 10,
    "route": "IV Shot",
    "stability": "24h RT",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "std",
        "label": "Acute Pain (1 mg/kg)",
        "doseMgPerKg": 1,
        "maxSingleMg": 100,
        "frequency": "q4h"
      },
      {
        "id": "rigor",
        "label": "Post-Op Shivering / Rigors (0.25 mg/kg)",
        "doseMgPerKg": 0.25,
        "maxSingleMg": 25,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "dormicum",
    "tradeName": "Dormicum",
    "genericName": "Midazolam",
    "arabicName": "دورميكوم / ميدازولام",
    "category": "Analgesia & ICU",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Dilute 5 mg (1 mL) + 4 mL NS -> 1 mg/mL (Slow IV over 2-3 min)",
    "finalConcMgMl": 1,
    "route": "IV Shot",
    "stability": "24h RT (Monitor SpO2)",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "sed",
        "label": "Procedural / Catheter Sedation (0.05 mg/kg)",
        "doseMgPerKg": 0.05,
        "maxSingleMg": 2.5,
        "frequency": "Stat"
      },
      {
        "id": "pre",
        "label": "Pre-Op Anxiolysis / Status (0.1 mg/kg)",
        "doseMgPerKg": 0.1,
        "maxSingleMg": 5,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "mg",
    "highAlert": true
  },
  {
    "id": "valium",
    "tradeName": "Valium / Neuril",
    "genericName": "Diazepam",
    "arabicName": "فاليوم / نيوريل / ديازيبام",
    "category": "Analgesia & ICU",
    "diluent": "Undiluted Slow IV (Do NOT dilute in small vol)",
    "prepInstructions": "Undiluted 10 mg/2 mL (5 mg/mL) — Slow IV push ≤ 2 mg/min",
    "finalConcMgMl": 5,
    "route": "IV Shot",
    "stability": "Undiluted in syringe; precipitates if diluted in small NS vol",
    "reference": "Lexidrug / BNFc",
    "presets": [
      {
        "id": "seiz",
        "label": "Acute Seizure / Muscle Spasm (0.2 mg/kg)",
        "doseMgPerKg": 0.2,
        "maxSingleMg": 10,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "ativan",
    "tradeName": "Ativan",
    "genericName": "Lorazepam",
    "arabicName": "أتيفان / لورازيبام",
    "category": "Analgesia & ICU",
    "diluent": "0.9% NS / D5W (1:1 Dilution)",
    "prepInstructions": "Dilute 4 mg (1 mL) + 1 mL NS -> 2 mg/mL (Slow IV ≤ 2 mg/min)",
    "finalConcMgMl": 2,
    "route": "IV Shot",
    "stability": "Refrigerate stock vials; use diluted solution immediately",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "seiz",
        "label": "Status Epilepticus / Agitation (0.1 mg/kg)",
        "doseMgPerKg": 0.1,
        "maxSingleMg": 4,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "diprivan",
    "tradeName": "Diprivan",
    "genericName": "Propofol 1%",
    "arabicName": "ديبريفان / بروبوفول",
    "category": "Analgesia & ICU",
    "diluent": "Undiluted Lipid Emulsion (10 mg/mL)",
    "prepInstructions": "Ready-to-Use 1% (10 mg/mL) — Strict aseptic technique",
    "finalConcMgMl": 10,
    "route": "IV Shot",
    "stability": "12h max after opening vial (Lipid emulsion)",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "sed",
        "label": "Procedural Sedation (1 mg/kg)",
        "doseMgPerKg": 1,
        "maxSingleMg": 100,
        "frequency": "Stat"
      },
      {
        "id": "ind",
        "label": "Anesthesia Induction (2.5 mg/kg)",
        "doseMgPerKg": 2.5,
        "maxSingleMg": 200,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "ketalar",
    "tradeName": "Ketalar",
    "genericName": "Ketamine",
    "arabicName": "كيتالار / كيتامين",
    "category": "Analgesia & ICU",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Dilute 50 mg (1 mL) + 4 mL NS -> 10 mg/mL (Slow IV over 60 sec)",
    "finalConcMgMl": 10,
    "route": "IV Shot",
    "stability": "24h RT",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "proc",
        "label": "Procedural Sedation / Dressing (1 mg/kg)",
        "doseMgPerKg": 1,
        "maxSingleMg": 100,
        "frequency": "Stat"
      },
      {
        "id": "analg",
        "label": "Sub-Dissociative Analgesia (0.25 mg/kg)",
        "doseMgPerKg": 0.25,
        "maxSingleMg": 25,
        "frequency": "q6h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "precedex",
    "tradeName": "Precedex",
    "genericName": "Dexmedetomidine",
    "arabicName": "بريسيدكس / ديكسميديتوميدين (ميكروجرام)",
    "category": "Analgesia & ICU",
    "diluent": "0.9% NS",
    "prepInstructions": "Dilute 200 mcg (2 mL) + 48 mL NS -> 4 mcg/mL",
    "finalConcMgMl": 4,
    "route": "IV Infusion",
    "stability": "24h RT (Dosed in mcg/kg! Conc = 4 mcg/mL)",
    "reference": "Lexidrug Pediatric ICU",
    "presets": [
      {
        "id": "load",
        "label": "ICU Loading over 10 min (1 mcg/kg)",
        "doseMgPerKg": 1,
        "maxSingleMg": 100,
        "frequency": "Stat"
      },
      {
        "id": "maint",
        "label": "Hourly Infusion at 0.5 mcg/kg/hr",
        "doseMgPerKg": 0.5,
        "maxSingleMg": 50,
        "frequency": "q24h"
      }
    ],
    "doseUnit": "mcg",
    "highAlert": true
  },
  {
    "id": "lidocaine_iv",
    "tradeName": "Xylocaine IV",
    "genericName": "Lidocaine HCl (Preservative-Free)",
    "arabicName": "ليدوكايين حقن",
    "category": "Analgesia & ICU",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "2% Vial = 20 mg/mL (or dilute to 10 mg/mL for IV bolus)",
    "finalConcMgMl": 10,
    "route": "IV Shot",
    "stability": "24h RT",
    "reference": "PALS / Lexidrug",
    "presets": [
      {
        "id": "arr",
        "label": "VT / VF Arrhythmia Bolus (1 mg/kg)",
        "doseMgPerKg": 1,
        "maxSingleMg": 100,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "esmeron",
    "tradeName": "Esmeron",
    "genericName": "Rocuronium",
    "arabicName": "إيسميرون / روكورونيوم",
    "category": "Analgesia & ICU",
    "diluent": "Undiluted 10 mg/mL (or NS)",
    "prepInstructions": "Ready 50 mg/5 mL (10 mg/mL) — Ventilated patients only",
    "finalConcMgMl": 10,
    "route": "IV Shot",
    "stability": "60d at RT unopened; 24h diluted",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "intub",
        "label": "Standard Intubation (0.6 mg/kg)",
        "doseMgPerKg": 0.6,
        "maxSingleMg": 50,
        "frequency": "Stat"
      },
      {
        "id": "rsi",
        "label": "Rapid Sequence Intubation (1 mg/kg)",
        "doseMgPerKg": 1,
        "maxSingleMg": 100,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "mg",
    "highAlert": true
  },
  {
    "id": "tracrium",
    "tradeName": "Tracrium",
    "genericName": "Atracurium",
    "arabicName": "تراكريوم / أتراكوريوم",
    "category": "Analgesia & ICU",
    "diluent": "0.9% NS",
    "prepInstructions": "Ready 25 mg/2.5 mL (10 mg/mL) — Keep refrigerated",
    "finalConcMgMl": 10,
    "route": "IV Shot",
    "stability": "Refrigerate 2-8°C; 24h in 0.9% NS",
    "reference": "BNFc / Lexidrug",
    "presets": [
      {
        "id": "std",
        "label": "Neuromuscular Blockade (0.5 mg/kg)",
        "doseMgPerKg": 0.5,
        "maxSingleMg": 50,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "mg",
    "highAlert": true
  },
  {
    "id": "nimbex",
    "tradeName": "Nimbex",
    "genericName": "Cisatracurium",
    "arabicName": "نيمبيكس / سيساتراكوريوم",
    "category": "Analgesia & ICU",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Ready 10 mg/5 mL (2 mg/mL) — Organ-independent elimination",
    "finalConcMgMl": 2,
    "route": "IV Shot",
    "stability": "Refrigerate 2-8°C; 24h at RT",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "std",
        "label": "Intubation / ICU Blockade (0.15 mg/kg)",
        "doseMgPerKg": 0.15,
        "maxSingleMg": 15,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "mg",
    "highAlert": true
  },
  {
    "id": "neostigmine",
    "tradeName": "Neostigmine",
    "genericName": "Neostigmine Methylsulfate",
    "arabicName": "نيوستجمين",
    "category": "Analgesia & ICU",
    "diluent": "0.9% NS (Co-administer with Atropine)",
    "prepInstructions": "Dilute 2.5 mg (1 mL) + 4 mL NS -> 0.5 mg/mL",
    "finalConcMgMl": 0.5,
    "route": "IV Shot",
    "stability": "24h RT (Always pair with Atropine 0.02 mg/kg)",
    "reference": "BNFc Pediatric",
    "presets": [
      {
        "id": "rev",
        "label": "NMB Reversal (0.05 mg/kg)",
        "doseMgPerKg": 0.05,
        "maxSingleMg": 2.5,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "bridion",
    "tradeName": "Bridion",
    "genericName": "Sugammadex",
    "arabicName": "بريديون / سوجاماديكس",
    "category": "Analgesia & ICU",
    "diluent": "Undiluted 100 mg/mL (or NS)",
    "prepInstructions": "Ready 200 mg/2 mL (100 mg/mL) — Rapid IV bolus",
    "finalConcMgMl": 100,
    "route": "IV Shot",
    "stability": "24h RT; protect from light",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "std",
        "label": "Routine Rocuronium Reversal (2 mg/kg)",
        "doseMgPerKg": 2,
        "maxSingleMg": 200,
        "frequency": "Stat"
      },
      {
        "id": "deep",
        "label": "Deep Blockade Reversal (4 mg/kg)",
        "doseMgPerKg": 4,
        "maxSingleMg": 400,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "narcan",
    "tradeName": "Narcan",
    "genericName": "Naloxone",
    "arabicName": "ناركان / نالوكسون",
    "category": "Analgesia & ICU",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Dilute 0.4 mg (1 mL) + 3 mL NS -> 0.1 mg/mL",
    "finalConcMgMl": 0.1,
    "route": "IV Shot",
    "stability": "24h RT",
    "reference": "PALS / Lexidrug",
    "presets": [
      {
        "id": "rev",
        "label": "Post-Op Opioid Over-Sedation (0.01 mg/kg)",
        "doseMgPerKg": 0.01,
        "maxSingleMg": 0.4,
        "frequency": "Stat"
      },
      {
        "id": "full",
        "label": "Full Opioid Reversal (0.1 mg/kg)",
        "doseMgPerKg": 0.1,
        "maxSingleMg": 2,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "anexate",
    "tradeName": "Anexate",
    "genericName": "Flumazenil",
    "arabicName": "أنيكسات / فلومازينيل",
    "category": "Analgesia & ICU",
    "diluent": "Undiluted 0.1 mg/mL",
    "prepInstructions": "Ready 0.5 mg/5 mL (0.1 mg/mL) — IV push over 15 sec",
    "finalConcMgMl": 0.1,
    "route": "IV Shot",
    "stability": "24h RT in NS/D5W",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "rev",
        "label": "Benzodiazepine Reversal (0.01 mg/kg)",
        "doseMgPerKg": 0.01,
        "maxSingleMg": 0.2,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "lasix",
    "tradeName": "Lasix",
    "genericName": "Furosemide",
    "arabicName": "لازيكس / فيوروسيميد",
    "category": "Cardiology & Cath",
    "diluent": "0.9% NS",
    "prepInstructions": "Dilute 20 mg (2 mL) + 8 mL 0.9% NS -> Total 10 mL (2 mg/mL)",
    "finalConcMgMl": 2,
    "route": "IV Shot",
    "stability": "24h RT; protect from light",
    "reference": "Lexidrug / Trissel’s",
    "presets": [
      {
        "id": "std",
        "label": "Standard Diuresis (1 mg/kg)",
        "doseMgPerKg": 1,
        "maxSingleMg": 40,
        "frequency": "q12h"
      },
      {
        "id": "low",
        "label": "Cardiac / Cath Post-Proc (0.5 mg/kg)",
        "doseMgPerKg": 0.5,
        "maxSingleMg": 20,
        "frequency": "q12h"
      },
      {
        "id": "high",
        "label": "Acute Fluid Overload (2 mg/kg)",
        "doseMgPerKg": 2,
        "maxSingleMg": 80,
        "frequency": "q8h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "burinex",
    "tradeName": "Burinex",
    "genericName": "Bumetanide",
    "arabicName": "بيورينيكس / بوميتانيد",
    "category": "Cardiology & Cath",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Dilute 2 mg (4 mL) + 16 mL NS -> 0.1 mg/mL",
    "finalConcMgMl": 0.1,
    "route": "IV Shot",
    "stability": "24h RT; protect from light",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "std",
        "label": "Loop Diuretic / CHF (0.02 mg/kg)",
        "doseMgPerKg": 0.02,
        "maxSingleMg": 1,
        "frequency": "q12h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "adrenaline",
    "tradeName": "Adrenaline",
    "genericName": "Epinephrine (1:10,000)",
    "arabicName": "أدرينالين / إبينفرين",
    "category": "Cardiology & Cath",
    "diluent": "0.9% NS (1 mg + 9 mL NS)",
    "prepInstructions": "Dilute 1 mg (1 mL of 1:1000) + 9 mL NS -> 0.1 mg/mL (1:10,000)",
    "finalConcMgMl": 0.1,
    "route": "IV Shot",
    "stability": "24h RT; protect from light (PALS Arrest Dose)",
    "reference": "AHA PALS / Lexidrug",
    "presets": [
      {
        "id": "pals",
        "label": "PALS Cardiac Arrest (0.01 mg/kg = 0.1 mL/kg)",
        "doseMgPerKg": 0.01,
        "maxSingleMg": 1,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "mg",
    "highAlert": true
  },
  {
    "id": "levophed",
    "tradeName": "Levophed",
    "genericName": "Norepinephrine",
    "arabicName": "ليفوفيد / نورإبينفرين (ميكروجرام)",
    "category": "Cardiology & Cath",
    "diluent": "D5W / D5NS",
    "prepInstructions": "Dilute 4 mg (4 mL) + 46 mL D5W -> 80 mcg/mL",
    "finalConcMgMl": 80,
    "route": "IV Infusion",
    "stability": "24h RT in D5W (Conc = 80 mcg/mL; dose = 6-hr bag at 0.1 mcg/kg/min)",
    "reference": "Lexidrug Pediatric ICU",
    "presets": [
      {
        "id": "bag6h",
        "label": "6-Hr Bag at 0.1 mcg/kg/min (36 mcg/kg)",
        "doseMgPerKg": 36,
        "maxSingleMg": 4000,
        "frequency": "q6h"
      }
    ],
    "doseUnit": "mcg",
    "highAlert": true
  },
  {
    "id": "dopamine",
    "tradeName": "Dopamine",
    "genericName": "Dopamine HCl",
    "arabicName": "دوبامين",
    "category": "Cardiology & Cath",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Dilute 200 mg (5 mL) + 45 mL NS -> 4 mg/mL (4000 mcg/mL)",
    "finalConcMgMl": 4,
    "route": "IV Infusion",
    "stability": "24h RT (6-hr bag at 10 mcg/kg/min = 3.6 mg/kg)",
    "reference": "Lexidrug Pediatric ICU",
    "presets": [
      {
        "id": "bag6h",
        "label": "6-Hr Bag at 10 mcg/kg/min (3.6 mg/kg)",
        "doseMgPerKg": 3.6,
        "maxSingleMg": 200,
        "frequency": "q6h"
      }
    ],
    "doseUnit": "mg",
    "highAlert": true
  },
  {
    "id": "dobutamine",
    "tradeName": "Dobutrex",
    "genericName": "Dobutamine",
    "arabicName": "دوبيوتامين",
    "category": "Cardiology & Cath",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Dilute 250 mg (20 mL) + 30 mL NS -> 5 mg/mL (5000 mcg/mL)",
    "finalConcMgMl": 5,
    "route": "IV Infusion",
    "stability": "24h RT (6-hr bag at 10 mcg/kg/min = 3.6 mg/kg)",
    "reference": "Lexidrug Pediatric ICU",
    "presets": [
      {
        "id": "bag6h",
        "label": "6-Hr Bag at 10 mcg/kg/min (3.6 mg/kg)",
        "doseMgPerKg": 3.6,
        "maxSingleMg": 250,
        "frequency": "q6h"
      }
    ],
    "doseUnit": "mg",
    "highAlert": true
  },
  {
    "id": "primacor",
    "tradeName": "Primacor",
    "genericName": "Milrinone",
    "arabicName": "بريماكور / ميلرينون (ميكروجرام)",
    "category": "Cardiology & Cath",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Dilute 10 mg (10 mL) + 40 mL NS -> 200 mcg/mL",
    "finalConcMgMl": 200,
    "route": "IV Infusion",
    "stability": "24h RT (Dosed in mcg/kg; Conc = 200 mcg/mL)",
    "reference": "Lexidrug Pediatric Cardiac",
    "presets": [
      {
        "id": "load",
        "label": "Loading Dose over 60 min (50 mcg/kg)",
        "doseMgPerKg": 50,
        "maxSingleMg": 5000,
        "frequency": "Stat"
      },
      {
        "id": "bag6h",
        "label": "6-Hr Maint at 0.5 mcg/kg/min (180 mcg/kg)",
        "doseMgPerKg": 180,
        "maxSingleMg": 10000,
        "frequency": "q6h"
      }
    ],
    "doseUnit": "mcg"
  },
  {
    "id": "nitronal",
    "tradeName": "Nitronal",
    "genericName": "Nitroglycerin (GTN)",
    "arabicName": "نيترونال / نيتروجليسرين (ميكروجرام)",
    "category": "Cardiology & Cath",
    "diluent": "D5W / 0.9% NS (Non-PVC)",
    "prepInstructions": "Dilute 25 mg (25 mL) + 25 mL NS -> 500 mcg/mL",
    "finalConcMgMl": 500,
    "route": "IV Infusion",
    "stability": "24h RT (Conc = 500 mcg/mL; 6-hr bag at 1 mcg/kg/min = 360 mcg/kg)",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "bag6h",
        "label": "6-Hr Bag at 1 mcg/kg/min (360 mcg/kg)",
        "doseMgPerKg": 360,
        "maxSingleMg": 25000,
        "frequency": "q6h"
      }
    ],
    "doseUnit": "mcg"
  },
  {
    "id": "trandate",
    "tradeName": "Trandate",
    "genericName": "Labetalol",
    "arabicName": "ترانديت / لابيتالول",
    "category": "Cardiology & Cath",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Dilute 100 mg (20 mL) + 80 mL NS -> 1 mg/mL",
    "finalConcMgMl": 1,
    "route": "IV Shot",
    "stability": "24h RT",
    "reference": "Lexidrug Pediatric HTN",
    "presets": [
      {
        "id": "bol",
        "label": "Hypertensive Crisis Bolus (0.25 mg/kg)",
        "doseMgPerKg": 0.25,
        "maxSingleMg": 20,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "brevibloc",
    "tradeName": "Brevibloc",
    "genericName": "Esmolol",
    "arabicName": "بريفيبلوك / إسمولول (ميكروجرام)",
    "category": "Cardiology & Cath",
    "diluent": "Ready-to-Use 10 mg/mL (10,000 mcg/mL)",
    "prepInstructions": "Ready 100 mg/10 mL = 10,000 mcg/mL",
    "finalConcMgMl": 10000,
    "route": "IV Shot",
    "stability": "24h RT (Conc = 10,000 mcg/mL)",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "load",
        "label": "SVT / HTN Loading over 1 min (500 mcg/kg)",
        "doseMgPerKg": 500,
        "maxSingleMg": 50000,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "mcg"
  },
  {
    "id": "apresoline",
    "tradeName": "Apresoline",
    "genericName": "Hydralazine",
    "arabicName": "أبريزولين / هيدرالازين",
    "category": "Cardiology & Cath",
    "diluent": "0.9% NS",
    "prepInstructions": "Recon 20 mg with 1 mL WFI, dilute + 9 mL NS -> 2 mg/mL",
    "finalConcMgMl": 2,
    "route": "IV Shot",
    "stability": "Use immediately after dilution in NS",
    "reference": "Lexidrug / BNFc",
    "presets": [
      {
        "id": "std",
        "label": "Acute Pediatric Hypertension (0.2 mg/kg)",
        "doseMgPerKg": 0.2,
        "maxSingleMg": 20,
        "frequency": "q6h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "cordarone",
    "tradeName": "Cordarone",
    "genericName": "Amiodarone",
    "arabicName": "كوردارون / أميودارون",
    "category": "Cardiology & Cath",
    "diluent": "D5W ONLY (Incompatible with NS!)",
    "prepInstructions": "Dilute 150 mg (3 mL) in 97 mL D5W -> 1.5 mg/mL (Infuse 20-60 min)",
    "finalConcMgMl": 1.5,
    "route": "IV Infusion",
    "stability": "24h RT in D5W ONLY",
    "reference": "PALS / Lexidrug",
    "presets": [
      {
        "id": "load",
        "label": "Arrhythmia Loading Dose (5 mg/kg)",
        "doseMgPerKg": 5,
        "maxSingleMg": 300,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "mg",
    "highAlert": true
  },
  {
    "id": "adenocor",
    "tradeName": "Adenocor",
    "genericName": "Adenosine",
    "arabicName": "أدينوكور / أدينوزين",
    "category": "Cardiology & Cath",
    "diluent": "Undiluted 3 mg/mL (Rapid IV Flush)",
    "prepInstructions": "Ready 6 mg/2 mL (3 mg/mL) — Rapid 1-2 sec IV push + NS flush",
    "finalConcMgMl": 3,
    "route": "IV Shot",
    "stability": "Store at RT (Do NOT refrigerate — crystallizes!)",
    "reference": "AHA PALS",
    "presets": [
      {
        "id": "first",
        "label": "SVT 1st Dose (0.1 mg/kg)",
        "doseMgPerKg": 0.1,
        "maxSingleMg": 6,
        "frequency": "Stat"
      },
      {
        "id": "sec",
        "label": "SVT 2nd Dose (0.2 mg/kg)",
        "doseMgPerKg": 0.2,
        "maxSingleMg": 12,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "atropine",
    "tradeName": "Atropine",
    "genericName": "Atropine Sulfate",
    "arabicName": "أتروبين سلفات",
    "category": "Cardiology & Cath",
    "diluent": "0.9% NS",
    "prepInstructions": "Dilute 1 mg (1 mL) + 9 mL NS -> 0.1 mg/mL",
    "finalConcMgMl": 0.1,
    "route": "IV Shot",
    "stability": "24h RT (Min single dose 0.1 mg)",
    "reference": "AHA PALS / BNFc",
    "presets": [
      {
        "id": "brady",
        "label": "Symptomatic Bradycardia / Pre-Op (0.02 mg/kg)",
        "doseMgPerKg": 0.02,
        "maxSingleMg": 0.5,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "lanoxin",
    "tradeName": "Lanoxin",
    "genericName": "Digoxin (Micrograms)",
    "arabicName": "لانوكسين / ديجوكسين (ميكروجرام)",
    "category": "Cardiology & Cath",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Dilute 500 mcg (2 mL) + 8 mL NS -> 50 mcg/mL (Slow IV 15 min)",
    "finalConcMgMl": 50,
    "route": "IV Shot",
    "stability": "24h RT (Dosed in mcg/kg; Conc = 50 mcg/mL)",
    "reference": "BNFc / Lexidrug",
    "presets": [
      {
        "id": "maint",
        "label": "CHF / SVT Maintenance (5 mcg/kg)",
        "doseMgPerKg": 5,
        "maxSingleMg": 250,
        "frequency": "q12h"
      },
      {
        "id": "load",
        "label": "Digitalizing 1st Half Dose (15 mcg/kg)",
        "doseMgPerKg": 15,
        "maxSingleMg": 500,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "mcg"
  },
  {
    "id": "prostin",
    "tradeName": "Prostin VR",
    "genericName": "Alprostadil (PGE1)",
    "arabicName": "بروستين / ألبروستاديل (ميكروجرام)",
    "category": "Cardiology & Cath",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Dilute 500 mcg (1 mL) + 49 mL NS -> 10 mcg/mL",
    "finalConcMgMl": 10,
    "route": "IV Infusion",
    "stability": "24h Fridge (6-hr bag at 0.05 mcg/kg/min = 18 mcg/kg)",
    "reference": "Lexidrug Neonatal/Cardiac",
    "presets": [
      {
        "id": "bag6h",
        "label": "6-Hr Bag at 0.05 mcg/kg/min (18 mcg/kg)",
        "doseMgPerKg": 18,
        "maxSingleMg": 500,
        "frequency": "q6h"
      }
    ],
    "doseUnit": "mcg"
  },
  {
    "id": "sildenafil_iv",
    "tradeName": "Revatio / Sildenafil IV",
    "genericName": "Sildenafil IV",
    "arabicName": "ريفاتيو / سيلدينافيل حقن",
    "category": "Cardiology & Cath",
    "diluent": "Ready-to-Use 0.8 mg/mL (or D5W)",
    "prepInstructions": "Ready 10 mg/12.5 mL (0.8 mg/mL) — Post-op Pulmonary HTN",
    "finalConcMgMl": 0.8,
    "route": "IV Shot",
    "stability": "24h RT",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "phtn",
        "label": "Pulmonary Hypertension (0.4 mg/kg)",
        "doseMgPerKg": 0.4,
        "maxSingleMg": 10,
        "frequency": "q8h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "heparin",
    "tradeName": "Heparin",
    "genericName": "Heparin Sodium (Units)",
    "arabicName": "هيبارين صوديوم (وحدة دولية)",
    "category": "Cardiology & Cath",
    "diluent": "0.9% NS",
    "prepInstructions": "Dilute 5000 Units (1 mL) + 49 mL NS -> 100 Units/mL",
    "finalConcMgMl": 100,
    "route": "IV Shot",
    "stability": "24h RT (Dosed in Units/kg; Conc = 100 Units/mL)",
    "reference": "CHEST / Cath Lab Protocol",
    "presets": [
      {
        "id": "cath",
        "label": "Cardiac Catheterization Bolus (75 Units/kg)",
        "doseMgPerKg": 75,
        "maxSingleMg": 5000,
        "frequency": "Stat"
      },
      {
        "id": "inf",
        "label": "Continuous Drip 20 U/kg/hr x 6h (120 Units/kg)",
        "doseMgPerKg": 120,
        "maxSingleMg": 10000,
        "frequency": "q6h"
      }
    ],
    "doseUnit": "Units",
    "highAlert": true
  },
  {
    "id": "clexane",
    "tradeName": "Clexane",
    "genericName": "Enoxaparin",
    "arabicName": "كليكسان / إينوكسابارين",
    "category": "Cardiology & Cath",
    "diluent": "Undiluted 100 mg/mL (Subcutaneous)",
    "prepInstructions": "Standard 100 mg/mL Prefilled Syringe (1 mg = 0.01 mL)",
    "finalConcMgMl": 100,
    "route": "SC Shot",
    "stability": "Store at RT; Subcutaneous administration only",
    "reference": "CHEST / Lexidrug",
    "presets": [
      {
        "id": "tx",
        "label": "VTE / Thrombosis Treatment (1 mg/kg)",
        "doseMgPerKg": 1,
        "maxSingleMg": 100,
        "frequency": "q12h"
      },
      {
        "id": "proph",
        "label": "Thromboprophylaxis (0.5 mg/kg)",
        "doseMgPerKg": 0.5,
        "maxSingleMg": 40,
        "frequency": "q12h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "actilyse",
    "tradeName": "Actilyse",
    "genericName": "Alteplase (tPA)",
    "arabicName": "أكتيليز / ألتيبلاز",
    "category": "Cardiology & Cath",
    "diluent": "0.9% NS",
    "prepInstructions": "Recon 50 mg with 50 mL WFI -> 1 mg/mL (High-Alert Thrombolytic)",
    "finalConcMgMl": 1,
    "route": "IV Infusion",
    "stability": "8h RT | 24h Fridge at 1 mg/mL",
    "reference": "CHEST Pediatric Thrombolysis",
    "presets": [
      {
        "id": "sys",
        "label": "Systemic Arterial/Venous Thrombosis (0.5 mg/kg)",
        "doseMgPerKg": 0.5,
        "maxSingleMg": 50,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "kapron",
    "tradeName": "Kapron",
    "genericName": "Tranexamic Acid",
    "arabicName": "كابرون / ترانيكساميك أسيد",
    "category": "Cardiology & Cath",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Dilute 500 mg (5 mL) + 45 mL NS -> 10 mg/mL (Infuse over 15 min)",
    "finalConcMgMl": 10,
    "route": "IV Infusion",
    "stability": "24h RT",
    "reference": "BNFc / Pediatric Trauma",
    "presets": [
      {
        "id": "bleed",
        "label": "Surgical Bleeding / Trauma (15 mg/kg)",
        "doseMgPerKg": 15,
        "maxSingleMg": 1000,
        "frequency": "q8h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "protamine",
    "tradeName": "Protamine",
    "genericName": "Protamine Sulfate",
    "arabicName": "بروتامين سلفات",
    "category": "Cardiology & Cath",
    "diluent": "0.9% NS",
    "prepInstructions": "Ready 50 mg/5 mL (10 mg/mL) — Slow IV over 10 min",
    "finalConcMgMl": 10,
    "route": "IV Shot",
    "stability": "24h RT (1 mg neutralizes 100 Units Heparin)",
    "reference": "Lexidrug / Cath Lab",
    "presets": [
      {
        "id": "rev",
        "label": "Post-Cath Heparin Reversal (0.75 mg/kg)",
        "doseMgPerKg": 0.75,
        "maxSingleMg": 50,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "mg",
    "highAlert": true
  },
  {
    "id": "konakion",
    "tradeName": "Konakion MM",
    "genericName": "Vitamin K1 (Phytomenadione)",
    "arabicName": "كوناكيون / فيتامين ك١",
    "category": "Cardiology & Cath",
    "diluent": "D5W / 0.9% NS",
    "prepInstructions": "Ready 10 mg/1 mL (10 mg/mL) — Slow IV over 15 min",
    "finalConcMgMl": 10,
    "route": "IV Shot",
    "stability": "Protect strictly from light",
    "reference": "BNFc / Lexidrug",
    "presets": [
      {
        "id": "bleed",
        "label": "Coagulopathy / Pre-Op INR Correction (0.3 mg/kg)",
        "doseMgPerKg": 0.3,
        "maxSingleMg": 10,
        "frequency": "q24h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "epilat",
    "tradeName": "Epilat",
    "genericName": "Nifedipine (PO / SL)",
    "arabicName": "إيبيلات / نيفيديبين",
    "category": "Cardiology & Cath",
    "diluent": "Oral / Sublingual Drops (20 mg/mL)",
    "prepInstructions": "Oral/Sublingual administration (Not for IV use)",
    "finalConcMgMl": 20,
    "route": "PO / SL",
    "stability": "Protect from light; administer immediately",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "htn",
        "label": "Acute Pediatric Hypertension (0.25 mg/kg)",
        "doseMgPerKg": 0.25,
        "maxSingleMg": 10,
        "frequency": "q8h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "zofran",
    "tradeName": "Zofran",
    "genericName": "Ondansetron",
    "arabicName": "زوفران / أوندانسيترون",
    "category": "GI & Antiemetics",
    "diluent": "Undiluted 2 mg/mL (or NS)",
    "prepInstructions": "Ready 4 mg/2 mL (2 mg/mL) — Slow IV push over 2-5 min",
    "finalConcMgMl": 2,
    "route": "IV Shot",
    "stability": "48h RT",
    "reference": "BNFc / Lexidrug",
    "presets": [
      {
        "id": "ponv",
        "label": "Post-Op Nausea & Vomiting (0.1 mg/kg)",
        "doseMgPerKg": 0.1,
        "maxSingleMg": 4,
        "frequency": "q8h"
      },
      {
        "id": "high",
        "label": "Severe / Chemo Emesis (0.15 mg/kg)",
        "doseMgPerKg": 0.15,
        "maxSingleMg": 8,
        "frequency": "q8h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "kytril",
    "tradeName": "Kytril",
    "genericName": "Granisetron (Micrograms)",
    "arabicName": "كيتريل / جرانيسترون (ميكروجرام)",
    "category": "GI & Antiemetics",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Dilute 1000 mcg (1 mL) + 9 mL NS -> 100 mcg/mL",
    "finalConcMgMl": 100,
    "route": "IV Shot",
    "stability": "24h RT (Dosed in mcg/kg; Conc = 100 mcg/mL)",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "std",
        "label": "PONV / Chemotherapy Emesis (20 mcg/kg)",
        "doseMgPerKg": 20,
        "maxSingleMg": 1000,
        "frequency": "q12h"
      }
    ],
    "doseUnit": "mcg"
  },
  {
    "id": "primperan",
    "tradeName": "Primperan",
    "genericName": "Metoclopramide",
    "arabicName": "بريمبران / ميتوكلوبراميد",
    "category": "GI & Antiemetics",
    "diluent": "0.9% NS",
    "prepInstructions": "Dilute 10 mg (2 mL) + 8 mL NS -> 1 mg/mL (Slow IV 3-5 min)",
    "finalConcMgMl": 1,
    "route": "IV Shot",
    "stability": "24h RT (Age ≥ 1 yr; max 5 days)",
    "reference": "BNFc / EMA",
    "presets": [
      {
        "id": "std",
        "label": "Second-Line PONV / Gastroparesis (0.15 mg/kg)",
        "doseMgPerKg": 0.15,
        "maxSingleMg": 10,
        "frequency": "q8h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "controloc",
    "tradeName": "Controloc",
    "genericName": "Pantoprazole",
    "arabicName": "كونترولوك / بانتوبرازول",
    "category": "GI & Antiemetics",
    "diluent": "0.9% NS",
    "prepInstructions": "Recon 40 mg Vial with 10 mL 0.9% NS -> 4 mg/mL",
    "finalConcMgMl": 4,
    "route": "IV Shot",
    "stability": "24h RT in 0.9% NS",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "std",
        "label": "Stress Ulcer Prophylaxis / NPO (1 mg/kg)",
        "doseMgPerKg": 1,
        "maxSingleMg": 40,
        "frequency": "q24h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "losec",
    "tradeName": "Losec",
    "genericName": "Omeprazole IV",
    "arabicName": "لوزيك / أوميبرازول حقن",
    "category": "GI & Antiemetics",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Recon 40 mg with 10 mL NS -> 4 mg/mL (Infuse over 20-30 min)",
    "finalConcMgMl": 4,
    "route": "IV Infusion",
    "stability": "12h RT in 0.9% NS (6h in D5W)",
    "reference": "BNFc Pediatric",
    "presets": [
      {
        "id": "std",
        "label": "GERD / Stress Ulcer Prophylaxis (1 mg/kg)",
        "doseMgPerKg": 1,
        "maxSingleMg": 40,
        "frequency": "q24h"
      },
      {
        "id": "bleed",
        "label": "Upper GI Bleed (2 mg/kg)",
        "doseMgPerKg": 2,
        "maxSingleMg": 80,
        "frequency": "q12h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "nexium",
    "tradeName": "Nexium IV",
    "genericName": "Esomeprazole",
    "arabicName": "نيكسيوم حقن / إيزوميبرازول",
    "category": "GI & Antiemetics",
    "diluent": "0.9% NS",
    "prepInstructions": "Recon 40 mg with 5 mL NS -> 8 mg/mL (Slow IV over 3-5 min)",
    "finalConcMgMl": 8,
    "route": "IV Shot",
    "stability": "12h RT in 0.9% NS",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "std",
        "label": "GERD / NPO Acid Suppression (0.5 mg/kg)",
        "doseMgPerKg": 0.5,
        "maxSingleMg": 40,
        "frequency": "q24h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "famotidine",
    "tradeName": "Pepcid / Antodine IV",
    "genericName": "Famotidine",
    "arabicName": "أنتودين حقن / فاموتيدين",
    "category": "GI & Antiemetics",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Dilute 20 mg (2 mL) + 8 mL NS -> 2 mg/mL (Slow IV over 2 min)",
    "finalConcMgMl": 2,
    "route": "IV Shot",
    "stability": "24h RT",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "std",
        "label": "Stress Ulcer Prophylaxis (0.25 mg/kg)",
        "doseMgPerKg": 0.25,
        "maxSingleMg": 20,
        "frequency": "q12h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "sandostatin",
    "tradeName": "Sandostatin",
    "genericName": "Octreotide (Micrograms)",
    "arabicName": "ساندوستاتين / أوكتريوتيد (ميكروجرام)",
    "category": "GI & Antiemetics",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Dilute 100 mcg (1 mL) + 9 mL NS -> 10 mcg/mL",
    "finalConcMgMl": 10,
    "route": "IV Shot",
    "stability": "24h RT (Dosed in mcg/kg; Conc = 10 mcg/mL)",
    "reference": "Lexidrug Pediatric GI",
    "presets": [
      {
        "id": "chylo",
        "label": "Chylothorax / GI Fistula / Varices (1 mcg/kg)",
        "doseMgPerKg": 1,
        "maxSingleMg": 50,
        "frequency": "q8h"
      }
    ],
    "doseUnit": "mcg"
  },
  {
    "id": "buscopan",
    "tradeName": "Buscopan",
    "genericName": "Hyoscine Butylbromide",
    "arabicName": "بسكوبان / هيوسين",
    "category": "GI & Antiemetics",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Dilute 20 mg (1 mL) + 4 mL NS -> 4 mg/mL (Slow IV)",
    "finalConcMgMl": 4,
    "route": "IV Shot",
    "stability": "24h RT",
    "reference": "BNFc Pediatric",
    "presets": [
      {
        "id": "spasm",
        "label": "Acute GI / Biliary / Renal Colic (0.3 mg/kg)",
        "doseMgPerKg": 0.3,
        "maxSingleMg": 20,
        "frequency": "q8h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "fluimucil_iv",
    "tradeName": "Fluimucil IV",
    "genericName": "N-Acetylcysteine (NAC)",
    "arabicName": "فلويموسيل حقن / أسيتيل سيستيين",
    "category": "GI & Antiemetics",
    "diluent": "D5W / 0.9% NS",
    "prepInstructions": "Dilute 2000 mg (10 mL of 20%) in 40 mL D5W -> 40 mg/mL",
    "finalConcMgMl": 40,
    "route": "IV Infusion",
    "stability": "24h RT",
    "reference": "BNFc / Lexidrug Toxicology",
    "presets": [
      {
        "id": "load",
        "label": "Paracetamol Toxicity 1st Bag 1h (150 mg/kg)",
        "doseMgPerKg": 150,
        "maxSingleMg": 15000,
        "frequency": "Stat"
      },
      {
        "id": "bag2",
        "label": "Paracetamol Toxicity 2nd Bag 4h (50 mg/kg)",
        "doseMgPerKg": 50,
        "maxSingleMg": 5000,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "decadron",
    "tradeName": "Epidron / Decadron",
    "genericName": "Dexamethasone",
    "arabicName": "إبيدرون / ديكادرون / ديكساميثازون",
    "category": "Steroids & Blood",
    "diluent": "Undiluted 4 mg/mL (or NS)",
    "prepInstructions": "Ready 8 mg/2 mL (4 mg/mL) — Slow IV push over 3-5 min",
    "finalConcMgMl": 4,
    "route": "IV Shot",
    "stability": "24h RT",
    "reference": "ASHP PONV / Lexidrug",
    "presets": [
      {
        "id": "ponv",
        "label": "PONV / Airway Edema (0.15 mg/kg)",
        "doseMgPerKg": 0.15,
        "maxSingleMg": 8,
        "frequency": "q8h"
      },
      {
        "id": "croup",
        "label": "Post-Extubation Stridor / Croup (0.6 mg/kg)",
        "doseMgPerKg": 0.6,
        "maxSingleMg": 16,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "solucortef",
    "tradeName": "Solu-Cortef",
    "genericName": "Hydrocortisone",
    "arabicName": "سولوكورتيف / هيدروكورتيزون",
    "category": "Steroids & Blood",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Recon 100 mg with 2 mL WFI, dilute in NS to 10 mg/mL",
    "finalConcMgMl": 10,
    "route": "IV Shot",
    "stability": "24h RT after reconstitution",
    "reference": "BNFc / Lexidrug",
    "presets": [
      {
        "id": "std",
        "label": "Surgical Stress / Bronchospasm (2 mg/kg)",
        "doseMgPerKg": 2,
        "maxSingleMg": 100,
        "frequency": "q6h"
      },
      {
        "id": "shock",
        "label": "Refractory Shock / Anaphylaxis (4 mg/kg)",
        "doseMgPerKg": 4,
        "maxSingleMg": 100,
        "frequency": "q6h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "solumedrol",
    "tradeName": "Solu-Medrol",
    "genericName": "Methylprednisolone",
    "arabicName": "سولوميدرول / ميثيل بريدنيزولون",
    "category": "Steroids & Blood",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Recon 40 mg with 1 mL WFI, dilute in NS to 10 mg/mL",
    "finalConcMgMl": 10,
    "route": "IV Infusion",
    "stability": "24h RT",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "std",
        "label": "Acute Asthma / Anti-Inflammatory (1 mg/kg)",
        "doseMgPerKg": 1,
        "maxSingleMg": 60,
        "frequency": "q6h"
      },
      {
        "id": "pulse",
        "label": "Pulse Steroid Therapy (30 mg/kg)",
        "doseMgPerKg": 30,
        "maxSingleMg": 1000,
        "frequency": "q24h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "ivig",
    "tradeName": "Privigen / Octagam",
    "genericName": "IVIG (Human Immunoglobulin)",
    "arabicName": "أوكتاجام / بريفيجن (مجم)",
    "category": "Steroids & Blood",
    "diluent": "Ready-to-Use 5% (50 mg/mL) or 10% (100 mg/mL)",
    "prepInstructions": "Ready 50 mg/mL (5%) — Titrate rate slowly per protocol",
    "finalConcMgMl": 50,
    "route": "IV Infusion",
    "stability": "Do NOT shake; infuse immediately",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "itp",
        "label": "ITP / Guillain-Barre (1000 mg/kg = 1 g/kg)",
        "doseMgPerKg": 1000,
        "maxSingleMg": 70000,
        "frequency": "q24h"
      },
      {
        "id": "kaw",
        "label": "Kawasaki Disease Single Dose (2000 mg/kg)",
        "doseMgPerKg": 2000,
        "maxSingleMg": 100000,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "albumin5",
    "tradeName": "Human Albumin 5%",
    "genericName": "Albumin Human 5% (0.05 g/mL)",
    "arabicName": "ألبيومين بشري ٥٪ (جرام)",
    "category": "Steroids & Blood",
    "diluent": "Ready-to-Use 5% Solution (0.05 g/mL)",
    "prepInstructions": "Ready 5% (50 mg/mL = 0.05 g/mL) — Infuse over 1-2 hrs",
    "finalConcMgMl": 0.05,
    "route": "IV Infusion",
    "stability": "Use within 4h of spiking bottle (Dosed in g/kg)",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "vol",
        "label": "Intravascular Volume Expansion (0.5 g/kg = 10 mL/kg)",
        "doseMgPerKg": 0.5,
        "maxSingleMg": 25,
        "frequency": "Stat"
      },
      {
        "id": "high",
        "label": "Severe Hypovolemia / Burns (1 g/kg = 20 mL/kg)",
        "doseMgPerKg": 1,
        "maxSingleMg": 50,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "g"
  },
  {
    "id": "albumin20",
    "tradeName": "Human Albumin 20%",
    "genericName": "Albumin Human 20% (0.2 g/mL)",
    "arabicName": "ألبيومين بشري ٢٠٪ (جرام)",
    "category": "Steroids & Blood",
    "diluent": "Ready-to-Use 20% Solution (0.2 g/mL)",
    "prepInstructions": "Ready 20% (200 mg/mL = 0.2 g/mL) — Infuse over 2-4 hrs",
    "finalConcMgMl": 0.2,
    "route": "IV Infusion",
    "stability": "Use within 4h of spiking bottle (Dosed in g/kg)",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "hypo",
        "label": "Severe Hypoalbuminemia / Ascites (1 g/kg = 5 mL/kg)",
        "doseMgPerKg": 1,
        "maxSingleMg": 50,
        "frequency": "q24h"
      }
    ],
    "doseUnit": "g"
  },
  {
    "id": "eprex",
    "tradeName": "Eprex",
    "genericName": "Epoetin Alfa (Units)",
    "arabicName": "إيبريكس / إريثروبويتين (وحدة)",
    "category": "Steroids & Blood",
    "diluent": "Undiluted 4000 Units/mL",
    "prepInstructions": "Ready 4000 Units/mL Prefilled Syringe — SC or IV",
    "finalConcMgMl": 4000,
    "route": "SC / IV",
    "stability": "Refrigerate 2-8°C; do not shake (Dosed in Units/kg)",
    "reference": "BNFc Pediatric",
    "presets": [
      {
        "id": "std",
        "label": "Anemia of CKD / Pre-Op Blood Conservation (100 U/kg)",
        "doseMgPerKg": 100,
        "maxSingleMg": 10000,
        "frequency": "q24h"
      }
    ],
    "doseUnit": "Units"
  },
  {
    "id": "neupogen",
    "tradeName": "Neupogen",
    "genericName": "Filgrastim (G-CSF Micrograms)",
    "arabicName": "نيوبوجين / فيلجراستيم (ميكروجرام)",
    "category": "Steroids & Blood",
    "diluent": "Undiluted 300 mcg/mL (or D5W)",
    "prepInstructions": "Ready 300 mcg/1 mL (300 mcg/mL) — SC or IV infusion",
    "finalConcMgMl": 300,
    "route": "SC / IV",
    "stability": "Refrigerate 2-8°C; NEVER dilute in NS (precipitates!)",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "std",
        "label": "Febrile Neutropenia / Chemo Support (5 mcg/kg)",
        "doseMgPerKg": 5,
        "maxSingleMg": 300,
        "frequency": "q24h"
      }
    ],
    "doseUnit": "mcg"
  },
  {
    "id": "desferal",
    "tradeName": "Desferal",
    "genericName": "Deferoxamine",
    "arabicName": "ديسفيرال / ديفيروكسامين",
    "category": "Steroids & Blood",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Recon 500 mg with 5 mL WFI (100 mg/mL), dilute to 50 mg/mL",
    "finalConcMgMl": 50,
    "route": "IV Infusion",
    "stability": "24h RT",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "std",
        "label": "Chronic Iron Overload (40 mg/kg)",
        "doseMgPerKg": 40,
        "maxSingleMg": 2000,
        "frequency": "q24h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "venofer",
    "tradeName": "Venofer",
    "genericName": "Iron Sucrose",
    "arabicName": "فينوفير / حديد وريدي",
    "category": "Steroids & Blood",
    "diluent": "0.9% NS ONLY (NO D5W!)",
    "prepInstructions": "Dilute 100 mg (5 mL) in 95 mL 0.9% NS -> 1 mg/mL (Infuse 30-60 min)",
    "finalConcMgMl": 1,
    "route": "IV Infusion",
    "stability": "24h RT in 0.9% NS ONLY",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "std",
        "label": "Iron Deficiency Anemia (2 mg/kg)",
        "doseMgPerKg": 2,
        "maxSingleMg": 100,
        "frequency": "q24h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "keppra",
    "tradeName": "Keppra / Tiratam IV",
    "genericName": "Levetiracetam",
    "arabicName": "كيبرا / تيراتام حقن / ليفيتيراسيتام",
    "category": "Neurology",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Dilute 500 mg (5 mL) in 20 mL NS -> 20 mg/mL (Infuse over 15 min)",
    "finalConcMgMl": 20,
    "route": "IV Infusion",
    "stability": "24h RT",
    "reference": "Lexidrug / AES Status",
    "presets": [
      {
        "id": "maint",
        "label": "Maintenance Seizure Control (20 mg/kg)",
        "doseMgPerKg": 20,
        "maxSingleMg": 1500,
        "frequency": "q12h"
      },
      {
        "id": "load",
        "label": "Status Epilepticus Loading (40 mg/kg)",
        "doseMgPerKg": 40,
        "maxSingleMg": 3000,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "epanutin",
    "tradeName": "Epanutin",
    "genericName": "Phenytoin Sodium",
    "arabicName": "إيبانوتين / فينيتوين",
    "category": "Neurology",
    "diluent": "0.9% NS ONLY (NO D5W!)",
    "prepInstructions": "Dilute 250 mg (5 mL) in 45 mL 0.9% NS -> 5 mg/mL (Use 0.22 µm filter)",
    "finalConcMgMl": 5,
    "route": "IV Infusion",
    "stability": "4h RT in 0.9% NS ONLY (Precipitates in Dextrose!)",
    "reference": "Lexidrug / Trissel’s",
    "presets": [
      {
        "id": "load",
        "label": "Status Epilepticus Loading (20 mg/kg)",
        "doseMgPerKg": 20,
        "maxSingleMg": 1500,
        "frequency": "Stat"
      },
      {
        "id": "maint",
        "label": "Maintenance Dose (3 mg/kg)",
        "doseMgPerKg": 3,
        "maxSingleMg": 200,
        "frequency": "q12h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "phenobarbital",
    "tradeName": "Luminal / Phenobarb",
    "genericName": "Phenobarbital Sodium",
    "arabicName": "فينوباربيتال",
    "category": "Neurology",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Dilute 200 mg (1 mL) + 19 mL NS -> 10 mg/mL (Infuse over 20 min)",
    "finalConcMgMl": 10,
    "route": "IV Infusion",
    "stability": "24h RT",
    "reference": "Lexidrug Pediatric",
    "presets": [
      {
        "id": "load",
        "label": "Status Epilepticus Loading (20 mg/kg)",
        "doseMgPerKg": 20,
        "maxSingleMg": 1000,
        "frequency": "Stat"
      },
      {
        "id": "maint",
        "label": "Maintenance Dose (2.5 mg/kg)",
        "doseMgPerKg": 2.5,
        "maxSingleMg": 150,
        "frequency": "q12h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "depakine_iv",
    "tradeName": "Depakine IV",
    "genericName": "Sodium Valproate",
    "arabicName": "ديباكين حقن / فالبروات الصوديوم",
    "category": "Neurology",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Recon 400 mg with 4 mL solvent, dilute in NS to 10 mg/mL",
    "finalConcMgMl": 10,
    "route": "IV Infusion",
    "stability": "24h RT",
    "reference": "Lexidrug / AES",
    "presets": [
      {
        "id": "load",
        "label": "Status Epilepticus Loading (30 mg/kg)",
        "doseMgPerKg": 30,
        "maxSingleMg": 3000,
        "frequency": "Stat"
      },
      {
        "id": "maint",
        "label": "Maintenance Dose (15 mg/kg)",
        "doseMgPerKg": 15,
        "maxSingleMg": 1000,
        "frequency": "q12h"
      }
    ],
    "doseUnit": "mg"
  },
  {
    "id": "mannitol",
    "tradeName": "Mannitol 20%",
    "genericName": "Mannitol 20% (0.2 g/mL)",
    "arabicName": "مانيتول ٢٠٪ (جرام)",
    "category": "Neurology",
    "diluent": "Ready-to-Use 20% Bag (0.2 g/mL)",
    "prepInstructions": "Ready 20% (200 mg/mL = 0.2 g/mL) — Use in-line filter",
    "finalConcMgMl": 0.2,
    "route": "IV Infusion",
    "stability": "Inspect for crystals; warm if crystallized (Dosed in g/kg)",
    "reference": "Lexidrug Pediatric Neuro",
    "presets": [
      {
        "id": "icp",
        "label": "Raised ICP / Cerebral Edema (0.5 g/kg = 2.5 mL/kg)",
        "doseMgPerKg": 0.5,
        "maxSingleMg": 50,
        "frequency": "q6h"
      },
      {
        "id": "high",
        "label": "Acute Herniation Bolus (1 g/kg = 5 mL/kg)",
        "doseMgPerKg": 1,
        "maxSingleMg": 100,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "g"
  },
  {
    "id": "hts3",
    "tradeName": "Hypertonic Saline 3%",
    "genericName": "Sodium Chloride 3% (mL/kg)",
    "arabicName": "محلول ملحي مركز ٣٪ (مللي)",
    "category": "Neurology",
    "diluent": "Ready 3% Solution (1 mL/mL)",
    "prepInstructions": "3% NaCl (513 mEq/L) — Direct volume in mL (1 mL = 1 mL)",
    "finalConcMgMl": 1,
    "route": "IV Infusion",
    "stability": "24h RT (Dosed directly in mL/kg)",
    "reference": "Pediatric Neuro-ICU",
    "presets": [
      {
        "id": "icp",
        "label": "Acute ICP Spike / Hyponatremia (3 mL/kg)",
        "doseMgPerKg": 3,
        "maxSingleMg": 250,
        "frequency": "Stat"
      },
      {
        "id": "high",
        "label": "Severe Cerebral Edema (5 mL/kg)",
        "doseMgPerKg": 5,
        "maxSingleMg": 250,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "mL"
  },
  {
    "id": "kcl",
    "tradeName": "Potassium Chloride",
    "genericName": "KCl 15% (2 mEq/mL)",
    "arabicName": "بوتاسيوم كلورايد (مكافئ mEq)",
    "category": "Electrolytes & Endocrine",
    "diluent": "0.9% NS (Dilute before IV infusion!)",
    "prepInstructions": "Stock 2 mEq/mL -> Dilute to 0.04 mEq/mL (Peripheral) or 0.08 mEq/mL (Central)",
    "finalConcMgMl": 0.08,
    "route": "IV Infusion",
    "stability": "HIGH-ALERT: NEVER give IV push! (Dosed in mEq/kg)",
    "reference": "ISMP / Lexidrug Pediatric",
    "presets": [
      {
        "id": "std",
        "label": "Hypokalemia Correction (0.5 mEq/kg over 1-2h)",
        "doseMgPerKg": 0.5,
        "maxSingleMg": 20,
        "frequency": "Stat"
      },
      {
        "id": "sev",
        "label": "Severe Hypokalemia (1 mEq/kg over 2-4h)",
        "doseMgPerKg": 1,
        "maxSingleMg": 40,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "mEq",
    "highAlert": true
  },
  {
    "id": "ca_gluconate",
    "tradeName": "Calcium Gluconate 10%",
    "genericName": "Calcium Gluconate 10% (100 mg/mL)",
    "arabicName": "كالسيوم جلوكونات ١٠٪ (مجم)",
    "category": "Electrolytes & Endocrine",
    "diluent": "0.9% NS / D5W (1:1 Dilution)",
    "prepInstructions": "Dilute 1000 mg (10 mL) + 10 mL NS -> 50 mg/mL (Slow IV 10 min)",
    "finalConcMgMl": 50,
    "route": "IV Infusion",
    "stability": "24h RT (Incompatible with Ceftriaxone & NaHCO3)",
    "reference": "PALS / Lexidrug",
    "presets": [
      {
        "id": "std",
        "label": "Hypocalcemia / Hyperkalemia (60 mg/kg = 0.6 mL/kg)",
        "doseMgPerKg": 60,
        "maxSingleMg": 3000,
        "frequency": "Stat"
      },
      {
        "id": "high",
        "label": "Severe Symptomatic Hypocalcemia (100 mg/kg)",
        "doseMgPerKg": 100,
        "maxSingleMg": 3000,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "mg",
    "highAlert": true
  },
  {
    "id": "ca_chloride",
    "tradeName": "Calcium Chloride 10%",
    "genericName": "Calcium Chloride 10% (100 mg/mL)",
    "arabicName": "كالسيوم كلورايد ١٠٪ (مجم)",
    "category": "Electrolytes & Endocrine",
    "diluent": "0.9% NS / D5W (Central Line Preferred)",
    "prepInstructions": "Dilute 1000 mg (10 mL) + 10 mL NS -> 50 mg/mL",
    "finalConcMgMl": 50,
    "route": "IV Infusion",
    "stability": "24h RT (3x elemental Ca vs Gluconate)",
    "reference": "AHA PALS",
    "presets": [
      {
        "id": "pals",
        "label": "Arrest / Severe Hypocalcemia (20 mg/kg)",
        "doseMgPerKg": 20,
        "maxSingleMg": 1000,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "mg",
    "highAlert": true
  },
  {
    "id": "mgso4",
    "tradeName": "Magnesium Sulfate 10%",
    "genericName": "MgSO4 10% (100 mg/mL)",
    "arabicName": "ماغنسيوم سلفات ١٠٪ (مجم)",
    "category": "Electrolytes & Endocrine",
    "diluent": "0.9% NS / D5W",
    "prepInstructions": "Dilute 1000 mg (10 mL of 10%) + 10 mL NS -> 50 mg/mL (Infuse 20 min)",
    "finalConcMgMl": 50,
    "route": "IV Infusion",
    "stability": "24h RT",
    "reference": "BNFc / Lexidrug",
    "presets": [
      {
        "id": "std",
        "label": "Hypomagnesemia / Severe Asthma (40 mg/kg)",
        "doseMgPerKg": 40,
        "maxSingleMg": 2000,
        "frequency": "Stat"
      },
      {
        "id": "tors",
        "label": "Torsades de Pointes (50 mg/kg)",
        "doseMgPerKg": 50,
        "maxSingleMg": 2000,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "mg",
    "highAlert": true
  },
  {
    "id": "nahco3",
    "tradeName": "Sodium Bicarbonate 8.4%",
    "genericName": "NaHCO3 8.4% (1 mEq/mL)",
    "arabicName": "بيكربونات الصوديوم ٨.٤٪ (مكافئ)",
    "category": "Electrolytes & Endocrine",
    "diluent": "Sterile Water / D5W (1:1 Dilution -> 0.5 mEq/mL)",
    "prepInstructions": "Dilute 10 mEq (10 mL) + 10 mL WFI/D5W -> 0.5 mEq/mL",
    "finalConcMgMl": 0.5,
    "route": "IV Infusion",
    "stability": "24h RT (Dosed in mEq/kg; flush line before/after)",
    "reference": "PALS / Lexidrug",
    "presets": [
      {
        "id": "acid",
        "label": "Severe Metabolic Acidosis / Hyperkalemia (1 mEq/kg)",
        "doseMgPerKg": 1,
        "maxSingleMg": 50,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "mEq",
    "highAlert": true
  },
  {
    "id": "actrapid",
    "tradeName": "Actrapid (Regular Insulin)",
    "genericName": "Insulin Regular (Units)",
    "arabicName": "أكترابيد / إنسولين مائي (وحدة)",
    "category": "Electrolytes & Endocrine",
    "diluent": "0.9% NS (1 Unit/mL Standard Drip)",
    "prepInstructions": "Dilute 50 Units (0.5 mL) + 49.5 mL NS -> 1 Unit/mL",
    "finalConcMgMl": 1,
    "route": "IV Infusion",
    "stability": "24h RT (Prime tubing 20 mL; 6-hr DKA drip at 0.1 U/kg/hr = 0.6 U/kg)",
    "reference": "ISPAD DKA / Lexidrug",
    "presets": [
      {
        "id": "dka6h",
        "label": "6-Hr DKA Infusion at 0.1 U/kg/hr (0.6 Units/kg)",
        "doseMgPerKg": 0.6,
        "maxSingleMg": 60,
        "frequency": "q6h"
      },
      {
        "id": "hyperk",
        "label": "Hyperkalemia Bolus with Dextrose (0.1 Units/kg)",
        "doseMgPerKg": 0.1,
        "maxSingleMg": 10,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "Units"
  },
  {
    "id": "glucagon",
    "tradeName": "GlucaGen",
    "genericName": "Glucagon",
    "arabicName": "جلوكاجون",
    "category": "Electrolytes & Endocrine",
    "diluent": "Supplied Solvent (1 mg/mL)",
    "prepInstructions": "Recon 1 mg Vial with 1 mL supplied solvent -> 1 mg/mL",
    "finalConcMgMl": 1,
    "route": "IV / IM / SC",
    "stability": "Use immediately after reconstitution",
    "reference": "BNFc Pediatric",
    "presets": [
      {
        "id": "hypo",
        "label": "Severe Hypoglycemia (0.03 mg/kg)",
        "doseMgPerKg": 0.03,
        "maxSingleMg": 1,
        "frequency": "Stat"
      }
    ],
    "doseUnit": "mg"
  }
];
