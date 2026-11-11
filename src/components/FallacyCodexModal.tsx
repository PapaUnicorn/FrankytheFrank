import React, { useState } from 'react';
import { X, Search, BookOpen, AlertTriangle, ShieldCheck, Scale, Sparkles } from 'lucide-react';
import { FALLACY_CATALOG } from '../data/fallacies';
import { FallacyGuide } from '../types';

interface FallacyCodexModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFallacyName?: string | null;
}

export const FallacyCodexModal: React.FC<FallacyCodexModalProps> = ({
  isOpen,
  onClose,
  selectedFallacyName,
}) => {
  const [search, setSearch] = useState(selectedFallacyName || '');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  if (!isOpen) return null;

  const filtered = FALLACY_CATALOG.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      (f.latinName && f.latinName.toLowerCase().includes(search.toLowerCase())) ||
      f.definition.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity = selectedSeverity === 'all' || f.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-stone-950 border border-stone-800 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden glow-border">
        {/* Header */}
        <div className="p-5 border-b border-stone-800/80 flex items-center justify-between bg-stone-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-950 border border-rose-800/50">
              <BookOpen className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h2 className="font-serif-cinzel font-bold text-base md:text-lg text-rose-100 flex items-center gap-2">
                FALLACY CODEX
              </h2>
              <p className="text-xs text-stone-400">
                Kompilasi Kesesatan Nalar yang Kerap Digunakan untuk Menghancurkan Argumen
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-stone-850 bg-stone-900/30 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama fallacy, istilah Latin, atau penjelasan..."
              className="w-full pl-9 pr-3 py-2 bg-stone-900 border border-stone-800 rounded-xl text-stone-100 text-xs placeholder:text-stone-500 focus:outline-none focus:border-rose-600"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {['all', 'Tinggi', 'Kritis', 'Mematikan'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-3 py-1.5 rounded-xl border transition-colors ${
                  selectedSeverity === sev
                    ? 'bg-rose-950 text-rose-300 border-rose-700/60 font-semibold'
                    : 'bg-stone-900 text-stone-400 border-stone-800 hover:border-stone-700'
                }`}
              >
                {sev === 'all' ? 'Semua Bahaya' : `Bahaya: ${sev}`}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog List */}
        <div className="p-4 overflow-y-auto space-y-3.5 divide-y divide-stone-900 flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-stone-500 text-sm">
              Tidak ada kesesatan berpikir yang cocok dengan pencarian "{search}".
            </div>
          ) : (
            filtered.map((item: FallacyGuide) => (
              <div key={item.id} className="pt-3.5 first:pt-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm md:text-base font-bold text-stone-100 flex items-center gap-2">
                      <Scale className="w-4 h-4 text-rose-500" />
                      {item.name}
                    </h3>
                    {item.latinName && (
                      <p className="text-[11px] font-mono-code text-stone-400 italic">
                        {item.latinName}
                      </p>
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-mono-code px-2 py-0.5 rounded border uppercase ${
                      item.severity === 'Mematikan'
                        ? 'border-red-800 bg-red-950/70 text-red-300'
                        : item.severity === 'Kritis'
                        ? 'border-amber-800 bg-amber-950/70 text-amber-300'
                        : 'border-yellow-800 bg-yellow-950/70 text-yellow-300'
                    }`}
                  >
                    {item.severity}
                  </span>
                </div>

                <p className="mt-2 text-xs md:text-sm text-stone-300 leading-relaxed">
                  {item.definition}
                </p>

                {/* Example Quote */}
                <div className="mt-2.5 p-2.5 rounded-lg bg-stone-900/80 border border-stone-850 text-xs">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono-code text-rose-400 mb-1">
                    <AlertTriangle className="w-3 h-3 text-rose-500" />
                    Contoh Kasus:
                  </div>
                  <p className="text-stone-300 italic pl-2 border-l-2 border-rose-800/40">
                    {item.example}
                  </p>
                </div>

                {/* How to refute */}
                <div className="mt-2 text-xs flex items-start gap-1.5 text-stone-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-emerald-400 font-medium">Cara Menangkis: </strong>
                    {item.howToRefute}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-850 bg-stone-900/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors"
          >
            Tutup Codex
          </button>
        </div>
      </div>
    </div>
  );
};
