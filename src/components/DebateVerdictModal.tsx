import React from 'react';
import { X, Skull, Award, Copy, Check, Download, RotateCcw, AlertTriangle, ShieldX } from 'lucide-react';
import { DebateSession } from '../types';

interface DebateVerdictModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: DebateSession;
  onRestart: () => void;
}

export const DebateVerdictModal: React.FC<DebateVerdictModalProps> = ({
  isOpen,
  onClose,
  session,
  onRestart,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  // Compute stats
  let totalFallacies = 0;
  let lowestRigor = 100;
  let mostSevereBurn = '';

  session.messages.forEach((m) => {
    if (m.role === 'advocate') {
      if (m.fallacies) totalFallacies += m.fallacies.length;
      if (m.userRigorScore !== undefined && m.userRigorScore < lowestRigor) {
        lowestRigor = m.userRigorScore;
      }
      if (m.closingBurn && m.closingBurn.length > mostSevereBurn.length) {
        mostSevereBurn = m.closingBurn;
      }
    }
  });

  if (lowestRigor === 100) lowestRigor = 35; // Default if not computed

  const getVerdictTitle = () => {
    if (session.status === 'conceded') return 'PENGAKUAN KEKALAHAN MUTLAK';
    if (session.userHp <= 0) return 'NALAR TUMPAS DI SUDUT ARENA';
    return 'EVALUASI DIALEKTIKA PARSIAL';
  };

  const getTranscriptText = () => {
    const lines = [
      `================================================`,
      `FRANKY THE FRANK - DEVIL'S ADVOCATE CRUCIBLE`,
      `================================================`,
      `Tesis: "${session.topic}"`,
      `Mode: ${session.mode}`,
      `Round Bertahan: ${session.round}`,
      `Total Kesesatan Logika Teridentifikasi: ${totalFallacies}`,
      `Ketahanan Nalar Terendah: ${lowestRigor}/100`,
      `Status Akhir: ${session.status.toUpperCase()}`,
      `------------------------------------------------`,
      ``,
    ];

    session.messages.forEach((m, idx) => {
      if (m.role === 'user') {
        lines.push(`[ROUND ${m.round || 1} - LAWAN DEBAT]`);
        lines.push(m.content);
        lines.push(``);
      } else {
        lines.push(`[FRANKY THE FRANK - SUDUT SERANGAN: ${m.attackAngle || 'DEKONSTRUKSI'}]`);
        lines.push(m.content);
        if (m.fallacies && m.fallacies.length > 0) {
          lines.push(`Fallacies:`);
          m.fallacies.forEach((f) => {
            lines.push(`  - ${f.name}: "${f.userQuote}" -> ${f.explanation}`);
          });
        }
        if (m.rhetoricalTrap) {
          lines.push(`Jebakan Retoris: "${m.rhetoricalTrap}"`);
        }
        if (m.closingBurn) {
          lines.push(`Sindiran Penutup: "${m.closingBurn}"`);
        }
        lines.push(`------------------------------------------------`);
        lines.push(``);
      }
    });

    return lines.join('\n');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getTranscriptText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = getTranscriptText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Devils_Advocate_Transcript_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-stone-950 border border-stone-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden glow-border">
        {/* Header */}
        <div className="p-5 border-b border-rose-950/60 bg-gradient-to-r from-red-950/50 via-stone-900 to-stone-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-950 border border-rose-700/60 shadow-lg">
              <Skull className="w-6 h-6 text-rose-500 animate-pulse" />
            </div>
            <div>
              <h2 className="font-serif-cinzel font-black text-lg md:text-xl text-rose-200 tracking-wider">
                {getVerdictTitle()}
              </h2>
              <p className="text-xs text-stone-400 font-mono-code">
                Akta Kematian Premis • Dialectical Autopsy
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

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-850 text-center">
            <p className="text-xs font-mono-code uppercase text-stone-400">
              Tesis yang Gagal Anda Pertahankan
            </p>
            <h3 className="font-serif-cinzel font-bold text-base md:text-lg text-rose-300 mt-1 italic">
              "{session.topic}"
            </h3>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-stone-900/90 border border-stone-850 text-center">
              <div className="text-[10px] font-mono-code uppercase text-stone-400">
                Ronde Bertahan
              </div>
              <div className="text-2xl font-black font-serif-cinzel text-stone-100 mt-1">
                {session.round}
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">Pertukaran Argumen</div>
            </div>

            <div className="p-3 rounded-xl bg-stone-900/90 border border-rose-950/60 text-center">
              <div className="text-[10px] font-mono-code uppercase text-rose-400">
                Fallacy Tertangkap
              </div>
              <div className="text-2xl font-black font-mono-code text-rose-500 mt-1">
                {totalFallacies}
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">Cacat Nalar Formal</div>
            </div>

            <div className="p-3 rounded-xl bg-stone-900/90 border border-stone-850 text-center">
              <div className="text-[10px] font-mono-code uppercase text-amber-400">
                Skor Kekokohan
              </div>
              <div className="text-2xl font-black font-mono-code text-amber-400 mt-1">
                {lowestRigor}%
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">Kerapuhan Premis</div>
            </div>
          </div>

          {/* Devastating Burn Quote */}
          {mostSevereBurn && (
            <div className="p-4 rounded-xl bg-stone-900 border border-rose-900/40 text-xs md:text-sm">
              <div className="text-[10px] uppercase font-mono-code text-rose-400 mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Sindiran Paling Mematikan dari Advocate:
              </div>
              <p className="italic text-stone-200 pl-3 border-l-2 border-rose-600">
                "{mostSevereBurn}"
              </p>
            </div>
          )}

          <div className="p-3 rounded-xl bg-stone-900/40 border border-stone-850 text-xs text-stone-400 leading-relaxed">
            <p>
              <strong className="text-stone-300">Pelajaran Dialektika:</strong> Terlibat dalam perdebatan dengan Devil's Advocate bukan tentang "menang", melainkan membedah bias, asumsi tersembunyi, dan kesesatan berpikir yang sering kita anggap sebagai kebenaran mutlak.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-stone-850 bg-stone-900/60 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg border border-stone-800 bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin' : 'Salin Log'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg border border-stone-800 bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh TXT</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs transition-colors"
            >
              Tutup
            </button>

            <button
              onClick={onRestart}
              className="px-4 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-rose-950"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Tantang Tesis Baru</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
