"use client";

const LABELS = { idle: "Off", connecting: "Connecting", listening: "Listening", translating: "Translating", error: "Error" };

export default function TranslationStatus({ status }) {
  const color = status === "error" ? "bg-red-400" : status === "listening" || status === "translating" ? "bg-emerald-400" : "bg-amber-400";
  return <span className="inline-flex items-center gap-2 text-xs text-slate-400"><i className={`h-2 w-2 rounded-full ${color}`} />{LABELS[status] || LABELS.idle}</span>;
}
