import React from 'react';
import { 
  Flame, 
  ShieldAlert, 
  BookOpen, 
  Download, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Swords,
  Skull
} from 'lucide-react';
import { DebateMode } from '../types';

interface HeaderProps {
  topic: string;
  round: number;
  mode: DebateMode;
  userHp: number;
  advocateHp: number;
  speechEnabled: boolean;
  onToggleSpeech: () => void;
  onOpenTopicModal: () => void;
  onOpenCodexModal: () => void;
  onExportTranscript: () => void;
  onChangeMode: (mode: DebateMode) => void;
  onSurrender: () => void;
}

const MODE_LABELS: Record<DebateMode, { title: string; subtitle: string; icon: string }> = {
  pure_inquisitor: {
    title: 'Advocatus Diaboli Murni',
    subtitle: 'Dingin & Logika Mutlak',
    icon: '⚖️',
  },
  cynical_academic: {
    title: 'Akademisi Oxford Sinis',
    subtitle: 'Epistemologi & Retorika Berat',
    icon: '🏛️',
  },
  malevolent_socratic: {
    title: 'Sokrates Jahat',
    subtitle: 'Rangkaian Jebakan Retoris',
    icon: '🐍',
  },
  machiavellian: {
    title: 'Realis Machiavellian',
    subtitle: 'Penghancur Idealisme Naïf',
    icon: '👑',
  },
};

export const Header: React.FC<HeaderProps> = ({
  topic,
  round,
  mode,
  userHp,
  advocateHp,
  speechEnabled,
  onToggleSpeech,
  onOpenTopicModal,
  onOpenCodexModal,
  onExportTranscript,
  onChangeMode,
  onSurrender,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-rose-950/40 bg-stone-950/90 backdrop-blur-md px-4 py-3 text-stone-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-rose-950 via-stone-900 to-black border border-rose-600/40 shadow-inner">
              <Skull className="w-5 h-5 text-rose-500 animate-pulse-subtle" />
              <Flame className="w-3.5 h-3.5 text-amber-500 absolute -top-1 -right-1" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif-cinzel font-black tracking-wider text-base md:text-lg text-rose-100 flex items-center gap-1.5">
                  FRANKY THE FRANK
                </h1>
                <span className="text-[10px] font-mono-code font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-rose-950/60 text-rose-400 border border-rose-800/40">
                  DEVIL'S ADVOCATE
                </span>
              </div>
              <p className="text-[11px] text-stone-400 line-clamp-1 max-w-xs md:max-w-md">
                {topic ? (
                  <>Fokus: <span className="text-stone-200 italic font-medium">"{topic}"</span></>
                ) : (
                  <span className="text-stone-400 italic">Menunggu Anda memulai argumen pertama...</span>
                )}
              </p>
            </div>
          </div>

          {/* Quick mobile controls */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={onToggleSpeech}
              title={speechEnabled ? 'Matikan Suara Sinis' : 'Aktifkan Suara Sinis'}
              className="p-1.5 rounded-lg border border-stone-800 bg-stone-900 text-stone-300 hover:text-rose-400"
            >
              {speechEnabled ? <Volume2 className="w-4 h-4 text-rose-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onOpenCodexModal}
              title="Katalog Kesesatan Logika"
              className="p-1.5 rounded-lg border border-stone-800 bg-stone-900 text-stone-300 hover:text-rose-400"
            >
              <BookOpen className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Vitality Gauges (Dialectical Health) */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-center bg-stone-900/60 px-3 py-1.5 rounded-xl border border-stone-800/80">
          {/* User HP */}
          <div className="flex flex-col min-w-[110px]">
            <div className="flex justify-between items-center text-[10px] uppercase font-mono-code mb-0.5">
              <span className="text-stone-400">Nalar Anda</span>
              <span className={userHp > 40 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {userHp}%
              </span>
            </div>
            <div className="w-full h-2 bg-stone-950 rounded-full overflow-hidden border border-stone-800">
              <div 
                className={`h-full transition-all duration-700 ${
                  userHp > 50 ? 'bg-gradient-to-r from-emerald-600 to-teal-500' : 'bg-gradient-to-r from-rose-700 to-red-500'
                }`}
                style={{ width: `${Math.max(0, userHp)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-rose-500/80 font-serif-cinzel font-bold">
            <Swords className="w-3.5 h-3.5 text-stone-500" />
            <span className="text-[11px] text-stone-400">R{round}</span>
          </div>

          {/* Advocate HP */}
          <div className="flex flex-col min-w-[110px]">
            <div className="flex justify-between items-center text-[10px] uppercase font-mono-code mb-0.5">
              <span className="text-rose-400">Franky</span>
              <span className="text-rose-400 font-bold">{advocateHp}%</span>
            </div>
            <div className="w-full h-2 bg-stone-950 rounded-full overflow-hidden border border-rose-950">
              <div 
                className="h-full bg-gradient-to-r from-rose-900 via-rose-600 to-red-500 transition-all duration-700"
                style={{ width: `${advocateHp}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-2">
          {/* Mode Selector */}
          <div className="relative group">
            <select
              value={mode}
              onChange={(e) => onChangeMode(e.target.value as DebateMode)}
              className="appearance-none bg-stone-900/90 text-stone-200 text-xs pl-3 pr-7 py-1.5 rounded-lg border border-stone-800 focus:outline-none focus:border-rose-600 hover:border-stone-700 cursor-pointer font-medium"
            >
              {Object.entries(MODE_LABELS).map(([key, val]) => (
                <option key={key} value={key} className="bg-stone-950 text-stone-200">
                  {val.icon} {val.title}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-stone-400">
              ▼
            </div>
          </div>

          {/* Speech Audio Toggle */}
          <button
            onClick={onToggleSpeech}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
              speechEnabled
                ? 'border-rose-600/60 bg-rose-950/40 text-rose-300'
                : 'border-stone-800 bg-stone-900 text-stone-400 hover:text-stone-200'
            }`}
            title={speechEnabled ? 'Suara Sinis Franky Aktif' : 'Aktifkan Suara Sinis Franky'}
          >
            {speechEnabled ? <Volume2 className="w-4 h-4 text-rose-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="text-[11px] hidden lg:inline">{speechEnabled ? 'Suara ON' : 'Suara OFF'}</span>
          </button>

          {/* Codex Button */}
          <button
            onClick={onOpenCodexModal}
            className="px-2.5 py-1.5 rounded-lg border border-stone-800 bg-stone-900 hover:bg-stone-850 hover:border-stone-700 text-stone-300 text-xs flex items-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[11px] font-medium">Fallacy Codex</span>
          </button>

          {/* Export Transcript */}
          <button
            onClick={onExportTranscript}
            title="Unduh Rekam Jejak Debat"
            className="p-1.5 rounded-lg border border-stone-800 bg-stone-900 hover:bg-stone-850 hover:border-stone-700 text-stone-300 transition-colors"
          >
            <Download className="w-4 h-4 text-stone-400" />
          </button>

          {/* Surrender / Concede */}
          <button
            onClick={onSurrender}
            title="Angkat Bendera Putih (Menyerah)"
            className="px-2.5 py-1.5 rounded-lg border border-rose-900/50 bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 text-xs flex items-center gap-1 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-[11px] font-medium">Menyerah</span>
          </button>

          {/* Reset / New Debate */}
          <button
            onClick={onOpenTopicModal}
            className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-rose-800 to-rose-700 hover:from-rose-700 hover:to-rose-600 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[11px]">Mulai Ulang</span>
          </button>
        </div>
      </div>
    </header>
  );
};
