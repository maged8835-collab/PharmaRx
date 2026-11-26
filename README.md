# PediaSurgRx — Pediatric Clinical Pharmacy & IV Formulary

A specialized pediatric clinical pharmacy web application for real-time weight-based IV dosing, standard preparation protocols, 24-hour administration scheduling, Excel/CSV export, and thermal label batch printing.

> **Clinical Disclaimer:** This tool is intended as a clinical decision-support and preparation aid for qualified pharmacists and healthcare professionals. Always verify doses, dilutions, compatibilities, and patient-specific factors (renal/hepatic function, neonatal age, fluid status) against your institution's approved protocols before administration.

## Key Features

- **112+ Pediatric Formulary Medications:** Organized across 7 clinical categories (Antimicrobials, Analgesia & ICU, Cardiology & Cath, GI & Antiemetics, Steroids & Blood, Neurology, Electrolytes & Endocrine) with Trade, Generic, and Arabic names.
- **Real-Time Weight-Based Auto-Fill:** Adjusting patient weight (`kg`) recalculates all doses and final volumes (`mL`) instantly with automatic adult max-dose capping (`maxSingleMg` / `Max Capped` indicator).
- **Unit-Safe Dosing & High-Alert Labeling:** Explicit support for `mg`, `mcg`, `mEq`, `Units`, `MIU`, `g`, and `mL` across calculations, sheets, and thermal labels, plus `HIGH-ALERT` badges on critical medications.
- **24-Hour Schedule & Thermal Sticker Studio:** Generates administration schedules with automatic midnight date rollover and batch-printable thermal labels (`50x30mm`, `60x40mm`, `70x40mm`).
- **Customizable Formulary & Backup:** Edit standard concentrations inline, add custom drugs, import/export JSON or CSV formularies, and export patient medication sheets to Excel-compatible `.csv` (UTF-8 BOM).
- **Offline-Ready Local Persistence:** Formulary standards, active patient intake, and active regimen persist locally in `localStorage`.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 6** + **Tailwind CSS v4**
- **Lucide React** icons
- **Vitest** for unit testing

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)

### Installation & Development

```bash
npm install
npm run dev
```

### Testing & Production Build

```bash
npm test
npm run build
```

## Project Structure

```text
src/
  components/       # Modular UI views (AutoFillTable, PatientRegimenSheet, ThermalLabelsView, etc.)
  data/             # Master pediatric formulary (112 medications)
  types/            # TypeScript interfaces for drugs, patients, regimens, and stickers
  utils/            # Calculation engine, 24h scheduler, CSV/JSON helpers, localStorage persistence
```
