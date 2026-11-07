"use client";

import { LanguagesIcon, SparklesIcon } from "../meeting/icons";
import LanguageSelector from "./LanguageSelector";
import TranslationStatus from "./TranslationStatus";

export default function VoiceTranslationPanel({
  enabled,
  setEnabled,
  language,
  setLanguage,
  mode,
  setMode,
  status,
}) {
  return (
    <section className="fixed bottom-24 right-4 z-40 w-80 rounded-3xl border border-slate-800 bg-[#151D2E]/95 p-5 shadow-2xl backdrop-blur-2xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-[#38BDF8]">
            <LanguagesIcon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Live AI Translation</p>
            <div className="mt-0.5">
              <TranslationStatus status={status} />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setEnabled(!enabled)}
          aria-pressed={enabled}
          className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
            enabled
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : "bg-[#6366F1] text-white hover:bg-indigo-600 shadow-sm shadow-indigo-500/20"
          }`}
        >
          {enabled ? "Active" : "Turn On"}
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1.5 text-[11px] font-semibold text-slate-400">
          Spoken Speech
          <div className="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs text-slate-200">
            Auto Detect
          </div>
        </label>
        <LanguageSelector value={language} onChange={setLanguage} disabled={!enabled} />
      </div>

      <div className="mt-4 flex rounded-xl border border-slate-700 bg-slate-800/80 p-1">
        {["translated", "original"].map((option) => (
          <button
            key={option}
            onClick={() => setMode(option)}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold capitalize transition ${
              mode === option
                ? "bg-[#6366F1] text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {option} Audio
          </button>
        ))}
      </div>

      <div className="mt-3.5 flex items-start gap-1.5 text-[11px] leading-relaxed text-slate-400">
        <SparklesIcon className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
        <span>Synthesized audio is rendered in real-time from incoming speaker streams.</span>
      </div>
    </section>
  );
}
