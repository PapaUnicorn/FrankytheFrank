import React, { useState } from 'react';
import { X, Flame, Sparkles, Swords, Compass, Check, AlertCircle } from 'lucide-react';
import { PRESET_TOPICS, PresetTopic } from '../data/topics';
import { DebateMode } from '../types';

interface TopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartDebate: (topic: string, initialClaim: string, mode: DebateMode, language: 'id' | 'en') => void;
  currentMode: DebateMode;
  currentLanguage: 'id' | 'en';
}

const MODES: Array<{ id: DebateMode; name: string; desc: string; icon: string }> = [
  {
    id: 'pure_inquisitor',
    name: 'Advocatus Diaboli Murni',
    desc: 'Sangat dingin, analitis, tanpa ampun membongkar celah premis terkecil.',
    icon: '⚖️',
  },
  {
    id: 'cynical_academic',
    name: 'Akademisi Oxford Sinis',
    desc: 'Jargon filosofis tingkat tinggi, dekonstruksi epistemologi angkuh.',
    icon: '🏛️',
  },
  {
    id: 'malevolent_socratic',
    name: 'Sokrates Jahat',
    desc: 'Menghujani pertanyaan jebakan yang memaksa lawan mengakui kebodohannya.',
    icon: '🐍',
  },
  {
    id: 'machiavellian',
    name: 'Realis Machiavellian',
    desc: 'Menghancurkan idealisme naïf, moralitas kosong, dan utopia dengan realitas brutal.',
    icon: '👑',
  },
];

export const TopicModal: React.FC<TopicModalProps> = ({
  isOpen,
  onClose,
  onStartDebate,
  currentMode,
  currentLanguage,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<PresetTopic | null>(PRESET_TOPICS[0]);
  const [customThesis, setCustomThesis] = useState('');
  const [customClaim, setCustomClaim] = useState('');
  const [mode, setMode] = useState<DebateMode>(currentMode);
  const [language, setLanguage] = useState<'id' | 'en'>(currentLanguage);
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');

  if (!isOpen) return null;

  const handleStart = () => {
    if (activeTab === 'presets' && selectedTopic) {
      onStartDebate(selectedTopic.title, selectedTopic.claim, mode, language);
    } else if (activeTab === 'custom' && customThesis.trim()) {
      onStartDebate(
        customThesis.trim(),
        customClaim.trim() || customThesis.trim(),
        mode,
        language
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-stone-950 border border-stone-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden glow-border">
        {/* Header */}
        <div className="p-5 border-b border-stone-800/80 flex items-center justify-between bg-stone-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-950 border border-rose-800/50">
              <Swords className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h2 className="font-serif-cinzel font-bold text-base md:text-lg text-rose-100 flex items-center gap-2">
                PANGGUNG PERDEBATAN DIALEKTIKA
              </h2>
              <p className="text-xs text-stone-400">
                Pilih tesis atau ajukan klaim absolut Anda untuk diuji ketahanannya
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

        {/* Mode & Language Selector Bar */}
        <div className="p-4 border-b border-stone-850 bg-stone-900/40 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-mono-code uppercase tracking-wider text-stone-400 mb-1.5">
              Gaya Kepribadian Devil's Advocate
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id)}
                  className={`p-2 rounded-xl text-left border text-xs transition-all flex flex-col justify-between ${
                    mode === m.id
                      ? 'bg-rose-950/80 border-rose-600/80 text-rose-100 shadow-sm'
                      : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="font-semibold flex items-center gap-1.5 text-stone-200 text-[11px]">
                    <span>{m.icon}</span>
                    <span className="truncate">{m.name}</span>
                  </div>
                  <p className="text-[10px] text-stone-400 line-clamp-1 mt-1">
                    {m.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono-code uppercase tracking-wider text-stone-400 mb-1.5">
              Bahasa Perdebatan
            </label>
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setLanguage('id')}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                  language === 'id'
                    ? 'bg-rose-950 border-rose-600 text-rose-200'
                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                🇮🇩 Bahasa Indonesia (Tajam & Formal)
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                  language === 'en'
                    ? 'bg-rose-950 border-rose-600 text-rose-200'
                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                🇬🇧 English (Oxford Rhetoric)
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-900/60 border border-stone-850 flex items-start gap-2 text-[11px] text-stone-400">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>
                <strong>Aturan Emas:</strong> Apapun klaim Anda (meskipun fakta konsensus ilmiah), sang Devil's Advocate dilarang keras untuk setuju.
              </span>
            </div>
          </div>
        </div>

        {/* Tab switcher: Presets vs Custom */}
        <div className="flex border-b border-stone-800 bg-stone-950 px-4 pt-2">
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'presets'
                ? 'border-rose-500 text-rose-400 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Tantangan Kurasi Terpilih
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'custom'
                ? 'border-rose-500 text-rose-400 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-300'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-rose-400" />
            Tulis Tesis Bebas Anda Sendiri
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {activeTab === 'presets' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {PRESET_TOPICS.map((topic) => {
                const isSelected = selectedTopic?.id === topic.id;
                return (
                  <div
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-rose-950/40 border-rose-500 shadow-md ring-1 ring-rose-500/30'
                        : 'bg-stone-900/60 border-stone-850 hover:border-stone-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono-code uppercase px-2 py-0.5 rounded bg-stone-800 text-stone-400">
                          {topic.category}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-rose-400" />}
                      </div>
                      <h4 className="text-xs md:text-sm font-bold text-stone-100 mt-1">
                        {topic.title}
                      </h4>
                      <p className="text-[11px] text-stone-300 italic mt-1 line-clamp-2">
                        "{topic.claim}"
                      </p>
                    </div>
                    <p className="text-[10px] text-stone-400 mt-2 pt-2 border-t border-stone-800/60">
                      Target Uji: {topic.targetVictimAngle}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3 max-w-xl mx-auto py-2">
              <div>
                <label className="block text-xs font-mono-code uppercase text-stone-300 mb-1">
                  Topik / Judul Tesis
                </label>
                <input
                  type="text"
                  value={customThesis}
                  onChange={(e) => setCustomThesis(e.target.value)}
                  placeholder="Misal: 'Kucing lebih unggul daripada anjing', 'Demokrasi gagal'..."
                  className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-rose-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-code uppercase text-stone-300 mb-1">
                  Pernyataan Argumen Awal Anda (Klaim)
                </label>
                <textarea
                  rows={4}
                  value={customClaim}
                  onChange={(e) => setCustomClaim(e.target.value)}
                  placeholder="Tuliskan argumen pembuka Anda secara lengkap. Berikan alasan atau data yang menurut Anda tidak terbantahkan..."
                  className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-rose-600 resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-850 bg-stone-900/60 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition-colors"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleStart}
            disabled={activeTab === 'custom' && !customThesis.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-700 via-rose-600 to-red-600 hover:from-rose-600 hover:to-red-500 text-white font-medium text-xs md:text-sm flex items-center gap-2 shadow-lg shadow-rose-950/60 disabled:opacity-40 transition-all"
          >
            <Flame className="w-4 h-4 text-amber-300" />
            <span>Mulai Uji Ketahanan Nalar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
