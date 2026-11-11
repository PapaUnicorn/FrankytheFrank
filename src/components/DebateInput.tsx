import React, { useState, useRef, useEffect } from 'react';
import { Send, CornerDownLeft, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';

interface DebateInputProps {
  round: number;
  isLoading: boolean;
  disabled: boolean;
  onSubmit: (argument: string) => void;
  onSurrender: () => void;
}

const STARTERS = [
  'Secara empiris, bukti menunjukkan bahwa...',
  'Premis Anda keliru karena mengabaikan...',
  'Dari sudut pandang epistemologi...',
  'Bantahan Anda melakukan dekonstruksi berlebihan...',
  'Perbedaan mendasarnya terletak pada...',
];

export const DebateInput: React.FC<DebateInputProps> = ({
  round,
  isLoading,
  disabled,
  onSubmit,
  onSurrender,
}) => {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content.trim() || isLoading || disabled) return;
    onSubmit(content.trim());
    setContent('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const insertStarter = (starter: string) => {
    setContent((prev) => (prev ? `${prev} ${starter}` : starter));
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="border-t border-rose-950/40 bg-stone-950/95 backdrop-blur-lg p-3 md:p-4">
      <div className="max-w-4xl mx-auto space-y-2.5">
        {/* Quick starter chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[10px] font-mono-code text-stone-500 uppercase shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Amunisi:
          </span>
          {STARTERS.map((s, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading || disabled}
              onClick={() => insertStarter(s)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 hover:border-stone-700 whitespace-nowrap transition-colors"
            >
              {s.slice(0, 30)}...
            </button>
          ))}
        </div>

        {/* Input box */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative rounded-2xl bg-stone-900 border border-stone-800 focus-within:border-rose-600/80 focus-within:ring-1 focus-within:ring-rose-600/50 shadow-xl transition-all">
            <textarea
              ref={textareaRef}
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading || disabled}
              placeholder={
                isLoading
                  ? 'Franky the Frank sedang menyusun dekonstruksi yang meremukkan argumen Anda...'
                  : disabled
                  ? 'Sesi perdebatan telah selesai. Silakan mulai ulang atau buka rekam jejak.'
                  : round === 1
                  ? 'Tuliskan opini, fakta, atau argumen Anda di sini... Franky the Frank siap membantahnya! (Enter untuk kirim)'
                  : `Round ${round}: Tuliskan pembelaan atau serangan balik Anda kepada Franky... (Enter untuk kirim)`
              }
              className="w-full bg-transparent px-4 py-3 text-stone-100 placeholder:text-stone-500 text-sm md:text-base resize-none focus:outline-none disabled:opacity-50"
            />

            {/* Bottom bar inside textarea */}
            <div className="flex items-center justify-between px-3 py-2 border-t border-stone-855 bg-stone-950/40 rounded-b-2xl">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono-code text-stone-500">
                  {content.length} karakter
                </span>
                <span className="hidden sm:inline text-stone-600">•</span>
                <span className="hidden sm:inline text-[11px] text-stone-500">
                  Shift+Enter untuk baris baru
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onSurrender}
                  disabled={isLoading || disabled}
                  className="px-2.5 py-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 text-xs flex items-center gap-1 transition-colors border border-transparent hover:border-rose-900/40"
                  title="Mengakui kekalahan intelektual pada sesi ini"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">Akui Kalah</span>
                </button>

                <button
                  type="submit"
                  disabled={!content.trim() || isLoading || disabled}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-700 via-rose-600 to-red-600 hover:from-rose-600 hover:to-red-500 text-white font-medium text-xs md:text-sm flex items-center gap-1.5 shadow-md shadow-rose-950/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Mendekonstruksi...</span>
                    </>
                  ) : (
                    <>
                      <span>{round === 1 ? 'Tantang Franky' : 'Bantah Franky'}</span>
                      <CornerDownLeft className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
