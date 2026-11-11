import React from 'react';
import { History, AlertOctagon, Scale, Shield, CheckCircle, ChevronRight } from 'lucide-react';
import { Message } from '../types';

interface PremiseLedgerPanelProps {
  claimsLedger: string[];
  messages: Message[];
  totalFallacies: number;
  isOpen: boolean;
  onToggle: () => void;
}

export const PremiseLedgerPanel: React.FC<PremiseLedgerPanelProps> = ({
  claimsLedger,
  messages,
  totalFallacies,
  isOpen,
  onToggle,
}) => {
  // Find which rounds had inconsistencies detected
  const inconsistencyRounds: Record<number, string> = {};
  messages.forEach((m) => {
    if (m.role === 'advocate' && m.inconsistencyCheck?.detected && m.round) {
      inconsistencyRounds[m.round] = m.inconsistencyCheck.detail;
    }
  });

  return (
    <aside
      className={`fixed lg:static top-0 right-0 h-full z-20 bg-stone-950/95 border-l border-stone-850/80 transition-all duration-300 flex flex-col ${
        isOpen ? 'w-80 translate-x-0' : 'w-0 translate-x-full lg:w-14 lg:translate-x-0'
      }`}
    >
      {/* Toggle button on border */}
      <button
        onClick={onToggle}
        className="hidden lg:flex items-center justify-center h-12 w-full border-b border-stone-850 hover:bg-stone-900 text-stone-400 hover:text-stone-200 transition-colors"
        title={isOpen ? 'Kecilkan Buku Memori' : 'Buka Buku Memori Klaim'}
      >
        <History className="w-4 h-4 text-rose-500" />
      </button>

      {isOpen ? (
        <div className="flex-1 flex flex-col h-full overflow-hidden p-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-rose-500" />
              <h3 className="font-serif-cinzel font-bold text-xs uppercase tracking-wider text-stone-200">
                Buku Memori Klaim
              </h3>
            </div>
            <button
              onClick={onToggle}
              className="lg:hidden p-1 text-stone-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <p className="text-[11px] text-stone-400 mt-2 mb-3 leading-relaxed">
            Sistem mencatat seluruh pernyataan masa lalu Anda untuk menguji konsistensi dan menjebak kontradiksi internal.
          </p>

          {/* Stats quick overview */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="p-2.5 rounded-xl bg-stone-900/80 border border-stone-850 text-center">
              <div className="flex items-center justify-center gap-1 text-[10px] text-stone-400 uppercase font-mono-code">
                <Scale className="w-3 h-3 text-rose-500" />
                Fallacy
              </div>
              <div className="text-lg font-bold font-mono-code text-rose-400 mt-0.5">
                {totalFallacies}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-900/80 border border-stone-850 text-center">
              <div className="flex items-center justify-center gap-1 text-[10px] text-stone-400 uppercase font-mono-code">
                <Shield className="w-3 h-3 text-emerald-500" />
                Klaim Sah
              </div>
              <div className="text-lg font-bold font-mono-code text-stone-200 mt-0.5">
                {claimsLedger.length}
              </div>
            </div>
          </div>

          {/* Chronological Claims */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {claimsLedger.length === 0 ? (
              <div className="text-center py-8 text-stone-500 text-xs italic">
                Belum ada klaim yang dicatat. Masukkan chat atau argumen pertama Anda untuk ditantang oleh Franky the Frank.
              </div>
            ) : (
              claimsLedger.map((claim, idx) => {
                const roundNum = idx + 1;
                const hasInconsistency = !!inconsistencyRounds[roundNum];

                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl text-xs border transition-all ${
                      hasInconsistency
                        ? 'bg-red-950/40 border-red-800/80 text-red-200 shadow-sm'
                        : 'bg-stone-900/70 border-stone-800/70 text-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1 text-[10px] font-mono-code">
                      <span className="text-stone-400 font-semibold">
                        Round {roundNum}
                      </span>
                      {hasInconsistency ? (
                        <span className="text-red-400 flex items-center gap-1 font-bold">
                          <AlertOctagon className="w-3 h-3" />
                          Kontradiksi!
                        </span>
                      ) : (
                        <span className="text-stone-500 flex items-center gap-0.5">
                          <CheckCircle className="w-2.5 h-2.5 text-stone-500" />
                          Terekam
                        </span>
                      )}
                    </div>
                    <p className="italic text-[11px] leading-snug line-clamp-3">
                      "{claim}"
                    </p>
                    {hasInconsistency && (
                      <p className="mt-1 pt-1 border-t border-red-900/50 text-[10px] text-red-300">
                        {inconsistencyRounds[roundNum]}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-col items-center py-4 space-y-6 text-stone-500">
          <span className="text-[10px] font-mono-code [writing-mode:vertical-rl] tracking-widest uppercase">
            Memori Klaim ({claimsLedger.length})
          </span>
          {totalFallacies > 0 && (
            <div className="w-6 h-6 rounded-full bg-rose-950 border border-rose-800 flex items-center justify-center text-[10px] font-bold text-rose-400 font-mono-code">
              {totalFallacies}
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
