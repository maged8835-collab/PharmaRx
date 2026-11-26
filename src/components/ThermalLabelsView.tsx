import { useMemo } from 'react';
import { Layers, Printer } from 'lucide-react';
import type { LabelNameMode, StickerSize, ThermalSticker } from '../types/pharmacy';

interface ThermalLabelsViewProps {
  stickers: ThermalSticker[];
  stickerSize: StickerSize;
  labelNameMode: LabelNameMode;
  onStickerSizeChange: (sz: StickerSize) => void;
  onLabelNameModeChange: (mode: LabelNameMode) => void;
  onGoToAutoFill: () => void;
}

export function ThermalLabelsView({
  stickers,
  stickerSize,
  labelNameMode,
  onStickerSizeChange,
  onLabelNameModeChange,
  onGoToAutoFill,
}: ThermalLabelsViewProps) {
  const stickerDimensionStyle = useMemo(() => {
    if (stickerSize === '50x30') return { width: '50mm', minHeight: '30mm' };
    if (stickerSize === '70x40') return { width: '70mm', minHeight: '40mm' };
    return { width: '60mm', minHeight: '40mm' };
  }, [stickerSize]);

  return (
    <div className="space-y-5">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Printer className="w-5 h-5 text-teal-700" />
            <span>Thermal Sticker Batch Print Studio ({stickers.length} Labels)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5" dir="rtl">
            مطابق لتصميم ملصقات الصيدلية الحرارية — اختر مقاس الرول واطبع جميع جرعات الـ 24 ساعة بضغطة واحدة
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <Layers className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
            {(['50x30', '60x40', '70x40'] as StickerSize[]).map((sz) => (
              <button
                key={sz}
                onClick={() => onStickerSizeChange(sz)}
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

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => onLabelNameModeChange('trade')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                labelNameMode === 'trade'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600'
              }`}
            >
              Trade Name
            </button>
            <button
              onClick={() => onLabelNameModeChange('generic')}
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
            disabled={stickers.length === 0}
            className="px-5 py-2.5 rounded-xl text-sm font-extrabold bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white shadow-sm flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-teal-400" />
            <span>Print All Labels ({stickers.length})</span>
          </button>
        </div>
      </div>

      {stickers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500 font-semibold mb-3">
            No thermal stickers generated yet. Add medications from the Auto-Fill table first.
          </p>
          <button
            onClick={onGoToAutoFill}
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
          {stickers.map((sticker) => (
            <div
              key={sticker.stickerId}
              style={stickerDimensionStyle}
              className="thermal-sticker-card border-2 border-slate-900 bg-white text-black font-sans px-3 py-2 shadow-2xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-xs font-bold tracking-tight leading-none">
                <span dir="auto">{sticker.ward}</span>
                <span className="font-mono tabular-nums font-extrabold">
                  {sticker.mrn}
                </span>
              </div>

              <div
                dir="rtl"
                className="text-center font-bold text-sm leading-tight mt-1 truncate"
              >
                {sticker.patientName}
              </div>

              <div className="text-center font-extrabold text-base sm:text-lg tracking-tight leading-tight mt-0.5">
                {sticker.highAlert && (
                  <span className="inline-block border border-black px-1 text-[10px] mr-1 align-middle">
                    HIGH-ALERT
                  </span>
                )}
                {sticker.drugDisplayName} {sticker.finalVolumeMl} ml
              </div>

              <div className="text-center font-semibold text-xs sm:text-sm leading-tight">
                {sticker.route} ({sticker.finalConcMgMl} {sticker.doseUnit}/ml)
              </div>

              <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold pt-1 mt-0.5 font-mono tabular-nums">
                <span>{sticker.timeStr}</span>
                <span>
                  {sticker.doseMgPerKg} {sticker.doseUnit}/kg
                </span>
                <span>{sticker.dateStr}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
