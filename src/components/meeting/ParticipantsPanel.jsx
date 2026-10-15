"use client";

import { useState } from "react";

/**
 * ParticipantsPanel — shows the list of meeting participants with their
 * status (mic, camera, raised hand) and provides host announcement
 * functionality.
 */
export default function ParticipantsPanel({
  localName,
  isHost,
  remoteParticipants,
  raisedHands,
  handRaised,
  onAnnounce,
  onClose,
}) {
  const [announcementText, setAnnouncementText] = useState("");

  function handleAnnounce(e) {
    e.preventDefault();
    const trimmed = announcementText.trim();
    if (!trimmed) return;
    onAnnounce(trimmed);
    setAnnouncementText("");
  }

  return (
    <aside className="fixed bottom-0 right-0 z-30 flex h-96 w-80 flex-col rounded-tl-2xl border-l border-t border-slate-700 bg-slate-900 shadow-2xl sm:bottom-4 sm:right-4 sm:rounded-2xl sm:border">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
        <span className="font-semibold text-white">
          👥 Participants ({1 + remoteParticipants.length})
        </span>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition"
        >
          ✕
        </button>
      </div>

      {/* Participant list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {/* Local user */}
        <div className="flex items-center justify-between rounded-xl bg-slate-800 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              {localName?.[0]?.toUpperCase() || "Y"}
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {localName || "You"}{" "}
                <span className="text-xs text-slate-400">(You)</span>
              </p>
              {isHost && (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                  Host
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs">
            {handRaised && <span title="Hand raised">✋</span>}
          </div>
        </div>

        {/* Remote participants */}
        {remoteParticipants.map((p) => (
          <div
            key={p.peerId}
            className="flex items-center justify-between rounded-xl bg-slate-800/60 px-3 py-2.5"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                {p.name?.[0]?.toUpperCase() || "P"}
              </div>
              <p className="text-sm text-white">{p.name || "Participant"}</p>
            </div>
            <div className="flex items-center gap-1 text-xs">
              {p.audio === false && <span title="Muted">🔇</span>}
              {p.video === false && <span title="Camera off">📷</span>}
              {raisedHands[p.peerId] && <span title="Hand raised">✋</span>}
              {p.stream ? (
                <span className="h-2 w-2 rounded-full bg-emerald-400" title="Connected" />
              ) : (
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" title="Connecting" />
              )}
            </div>
          </div>
        ))}

        {remoteParticipants.length === 0 && (
          <p className="text-center text-xs text-slate-500 mt-4">
            No other participants yet.
          </p>
        )}
      </div>

      {/* Host announcement */}
      {isHost && (
        <form
          onSubmit={handleAnnounce}
          className="flex gap-2 border-t border-slate-700 px-3 py-3"
        >
          <input
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            className="min-w-0 flex-1 rounded-lg bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-amber-500"
            placeholder="Host announcement…"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!announcementText.trim()}
            className="rounded-lg bg-amber-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-40"
          >
            📢
          </button>
        </form>
      )}
    </aside>
  );
}
