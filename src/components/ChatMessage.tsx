import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Flame, 
  Volume2, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Quote, 
  Compass,
  AlertOctagon,
  Scale
} from 'lucide-react';
import { Message, Fallacy } from '../types';

interface ChatMessageProps {
  message: Message;
  onSelectFallacy: (fallacyName: string) => void;
  onSpeak: (text: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onSelectFallacy,
  onSpeak,
}) => {
  const [showDefenseHints, setShowDefenseHints] = useState(false);
  const isAdvocate = message.role === 'advocate';

  if (!isAdvocate) {
    return (
      <div className="flex justify-end my-4 px-2">
        <div className="max-w-2xl w-full flex flex-col items-end">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono-code text-stone-400">
              Round {message.round || 1} • Terdakwa / Lawan Debat
            </span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="bg-gradient-to-br from-stone-900 to-stone-850 border border-stone-800 text-stone-100 px-5 py-3.5 rounded-2xl rounded-tr-sm shadow-md text-sm md:text-base leading-relaxed">
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start my-6 px-2">
      <div className="max-w-3xl w-full flex flex-col">
        {/* Header Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2 px-1">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-600 shadow-[0_0_8px_#dc2626]" />
            <span className="font-serif-cinzel font-bold text-xs md:text-sm tracking-wider text-rose-300">
              FRANKY THE FRANK
            </span>
            {message.attackAngle && (
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-400 border border-rose-800/50 flex items-center gap-1">
                <Compass className="w-3 h-3" />
                {message.attackAngle}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {message.userRigorScore !== undefined && (
              <span 
                className={`text-[10px] font-mono-code px-2 py-0.5 rounded border ${
                  message.userRigorScore < 30
                    ? 'border-red-900 bg-red-950/50 text-red-300'
                    : message.userRigorScore < 60
                    ? 'border-amber-900 bg-amber-950/50 text-amber-300'
                    : 'border-emerald-900 bg-emerald-950/50 text-emerald-300'
                }`}
                title="Skor Kekokohan Logika Pengguna"
              >
                Rigor: {message.userRigorScore}/100
              </span>
            )}

            <button
              onClick={() => onSpeak(`${message.content}. ${message.rhetoricalTrap || ''}. ${message.closingBurn || ''}`)}
              className="p-1 rounded bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-rose-400 text-[11px] transition-colors flex items-center gap-1"
              title="Dengarkan Argumen Ini Dibacakan"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden sm:inline">Dengar</span>
            </button>
          </div>
        </div>

        {/* Advocate Main Crucible Card */}
        <div className="bg-stone-950 border border-rose-950/60 rounded-2xl rounded-tl-sm p-5 md:p-6 shadow-2xl relative overflow-hidden glow-border">
          {/* Subtle background crest / texture */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-rose-950/15 rounded-full blur-3xl pointer-events-none" />

          {/* Inconsistency Alert (Memory Injection Trigger) */}
          {message.inconsistencyCheck?.detected && (
            <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-red-950/80 via-stone-900 to-red-950/80 border border-red-600/60 text-red-200 text-xs flex items-start gap-2.5 shadow-inner">
              <AlertOctagon className="w-4 h-4 text-red-400 shrink-0 mt-0.5 animate-bounce" />
              <div>
                <p className="font-mono-code font-bold text-red-300 uppercase tracking-wider text-[11px]">
                  ⚠️ INKONSISTENSI & HIPOKRISI TERDETEKSI
                </p>
                <p className="mt-0.5 text-stone-300 leading-relaxed">
                  {message.inconsistencyCheck.detail}
                </p>
              </div>
            </div>
          )}

          {/* Core Rebuttal Text */}
          <div className="text-stone-200 text-sm md:text-base leading-relaxed font-sans space-y-3">
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>

          {/* Fallacy Hunter Section */}
          {message.fallacies && message.fallacies.length > 0 && (
            <div className="mt-5 pt-4 border-t border-stone-800/80">
              <div className="flex items-center gap-2 mb-2 text-xs font-mono-code uppercase tracking-wider text-rose-400">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                <span>Kesesatan Berpikir Teridentifikasi ({message.fallacies.length}):</span>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {message.fallacies.map((fal: Fallacy, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-stone-900/80 border border-rose-950/50 hover:border-rose-800/70 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-rose-300 flex items-center gap-1.5">
                        <Scale className="w-3 h-3 text-rose-500" />
                        {fal.name}
                      </span>
                      <button
                        onClick={() => onSelectFallacy(fal.name)}
                        className="text-[10px] text-stone-400 hover:text-rose-400 underline decoration-stone-600"
                      >
                        Pelajari di Codex →
                      </button>
                    </div>
                    {fal.userQuote && (
                      <div className="mt-1.5 pl-2 border-l-2 border-rose-800/50 text-stone-400 italic text-[11px]">
                        "{fal.userQuote}"
                      </div>
                    )}
                    <p className="mt-1.5 text-stone-300 leading-normal">
                      {fal.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rhetorical Snare (Trap) */}
          {message.rhetoricalTrap && (
            <div className="mt-5 p-3.5 rounded-xl bg-gradient-to-br from-stone-900 to-rose-950/30 border border-stone-800 relative">
              <div className="flex items-center gap-1.5 text-[11px] font-mono-code font-bold uppercase tracking-wider text-amber-400 mb-1">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Pertanyaan Jebakan Dialektika:</span>
              </div>
              <p className="text-stone-200 text-xs md:text-sm italic leading-relaxed pl-2 border-l border-amber-500/50">
                "{message.rhetoricalTrap}"
              </p>
            </div>
          )}

          {/* Closing Burn (Sindiran Tajam Penutup) */}
          {message.closingBurn && (
            <div className="mt-4 pt-3 flex items-start gap-2 text-rose-400/90 text-xs md:text-sm font-medium italic">
              <Quote className="w-4 h-4 text-rose-600 shrink-0 mt-0.5 rotate-180" />
              <p>{message.closingBurn}</p>
            </div>
          )}

          {/* Strategic Counter-Defense Hints Accordion */}
          {message.suggestedCounterDefense && message.suggestedCounterDefense.length > 0 && (
            <div className="mt-4 pt-3 border-t border-stone-900">
              <button
                onClick={() => setShowDefenseHints(!showDefenseHints)}
                className="w-full flex items-center justify-between text-[11px] text-stone-400 hover:text-stone-200 font-mono-code py-1 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Bongkar Taktik Debat: Bagaimana Menangkis Serangan Ini?
                </span>
                {showDefenseHints ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showDefenseHints && (
                <div className="mt-2.5 p-3 rounded-lg bg-stone-900/90 border border-emerald-950/60 text-xs space-y-2 text-stone-300">
                  <p className="text-[11px] text-emerald-400 font-medium">
                    Catatan Strategi Debat Formal:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 text-[11px] text-stone-300">
                    {message.suggestedCounterDefense.map((hint, i) => (
                      <li key={i} className="leading-relaxed">
                        {hint}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
