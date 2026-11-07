"use client";

import { useState } from "react";
import { VOICE_LANGUAGES } from "@/lib/speech";
import { LanguagesIcon, VolumeIcon, AlertCircleIcon, SparklesIcon } from "./icons";

export default function TranslationPanel({
  enabled,
  setEnabled,
  language,
  setLanguage,
  mode,
  setMode,
  status,
  error,
  volume = 1,
  onChangeVolume,
}) {
  const [localVolume, setLocalVolume] = useState(volume);

  const statusLabels = {
    idle: { label: "Disabled", color: "bg-slate-500" },
    connecting: { label: "Connecting AI…", color: "bg-amber-400 animate-pulse" },
    listening: { label: "Listening for Speech", color: "bg-emerald-400" },
    translating: { label: "Generating Translated Voice…", color: "bg-cyan-400 animate-pulse" },
    error: { label: "Translation Error", color: "bg-red-400" },
  };

  const currentStatus = statusLabels[status] || statusLabels.idle;

  function handleVolumeChange(e) {
    const val = parseFloat(e.target.value);
    setLocalVolume(val);
    if (onChangeVolume) onChangeVolume(val);
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-5 text-xs text-slate-300">
      {/* ── Header Card ──────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-800/80 bg-[#1A2437] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#38BDF8]/10 text-[#38BDF8]">
              <LanguagesIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">SeamlessM4T Voice Translation</h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`h-2 w-2 rounded-full ${currentStatus.color}`} />
                <span className="text-[11px] text-slate-400">{currentStatus.label}</span>
              </div>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            onClick={() => setEnabled(!enabled)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              enabled
                ? "bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E]"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {enabled ? "Enabled" : "Turn On"}
          </button>
        </div>
      </div>

      {/* ── Error Notification ───────────────────────────────────── */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-red-500/30 bg-red-950/40 p-3 text-red-200 text-xs">
          <AlertCircleIcon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-300">Translation Notice</p>
            <p className="text-[11px] mt-0.5 text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* ── Spoken Language (Source) ─────────────────────────────── */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Source Language
        </label>
        <div className="rounded-xl border border-slate-800 bg-[#151D2E] px-3.5 py-2.5 text-xs text-slate-300 flex items-center justify-between">
          <span>Auto-detect spoken voice</span>
          <span className="text-[10px] text-[#38BDF8] font-mono">Bengali ↔ English</span>
        </div>
      </div>

      {/* ── Target Language ──────────────────────────────────────── */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Preferred Listening Language
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          disabled={!enabled}
          className="w-full rounded-xl border border-slate-700/80 bg-[#151D2E] px-3.5 py-2.5 text-xs text-white outline-none transition focus:border-[#38BDF8] disabled:opacity-50"
        >
          {VOICE_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code} className="bg-[#151D2E] text-white">
              {lang.name} ({lang.nativeName})
            </option>
          ))}
        </select>
        <p className="text-[10px] text-slate-500 mt-1">
          Select the language you want to hear when other participants speak.
        </p>
      </div>

      {/* ── Audio Output Mode ────────────────────────────────────── */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Audio Channel
        </label>
        <div className="flex rounded-xl border border-slate-800 bg-[#101624] p-1">
          <button
            onClick={() => setMode("translated")}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
              mode === "translated"
                ? "bg-[#6366F1] text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Translated Voice
          </button>
          <button
            onClick={() => setMode("original")}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
              mode === "original"
                ? "bg-[#6366F1] text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Original Audio
          </button>
        </div>
      </div>

      {/* ── Volume Slider ────────────────────────────────────────── */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5 font-semibold uppercase tracking-wider text-slate-400">
            <VolumeIcon className="w-3.5 h-3.5" />
            <span>Output Volume</span>
          </span>
          <span className="font-mono text-slate-400">{Math.round(localVolume * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={localVolume}
          onChange={handleVolumeChange}
          className="w-full accent-[#38BDF8] h-1.5 bg-slate-800 rounded-lg cursor-pointer"
        />
      </div>

      {/* ── Info Notice ─────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-800/80 bg-[#151D2E]/50 p-3.5 text-[11px] leading-relaxed text-slate-400">
        <div className="flex items-start gap-2">
          <SparklesIcon className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
          <p>
            Powered by <strong>Meta SeamlessM4T v2</strong>. Spoken audio is translated directly to voice speech without displaying text or subtitles.
          </p>
        </div>
      </div>
    </div>
  );
}
