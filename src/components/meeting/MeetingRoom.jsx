"use client";

import { useRef, useState, useEffect } from "react";
import useWebRTC from "@/hooks/useWebRTC";
import ChatPanel from "./ChatPanel";
import ParticipantsPanel from "./ParticipantsPanel";

const REACTIONS = ["👍", "❤️", "😂", "👏", "🎉"];

export default function MeetingRoom({ meetingId, name, title, isHost, onLeave }) {
  const localVideoRef = useRef(null);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);

  const {
    localStream,
    remoteParticipants,
    connectionState,
    error,
    micEnabled,
    cameraEnabled,
    isScreenSharing,
    handRaised,
    raisedHands,
    reactions,
    announcement,
    toggleMic,
    toggleCamera,
    startScreenShare,
    stopScreenShare,
    toggleRaiseHand,
    sendReaction,
    sendAnnouncement,
    setError,
    socketRef,
  } = useWebRTC({ meetingId, name, onMeetingEnded: onLeave });

  // Attach local stream to video element
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Count total participants (self + remote)
  const totalParticipants = 1 + remoteParticipants.length;

  // Grid layout class based on participant count
  function getGridClass() {
    const total = totalParticipants;
    if (total <= 1) return "grid-cols-1";
    if (total === 2) return "grid-cols-1 lg:grid-cols-2";
    if (total <= 4) return "grid-cols-2";
    return "grid-cols-2 lg:grid-cols-3";
  }

  return (
    <div className="relative flex h-screen flex-col bg-slate-950 text-white">
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold">
            V
          </div>
          <div>
            <p className="text-sm font-semibold">{title || "VideoMeet"}</p>
            <p className="text-xs text-slate-400">{meetingId}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Connection indicator */}
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                connectionState === "connected"
                  ? "bg-emerald-400"
                  : connectionState === "error"
                  ? "bg-red-400"
                  : "bg-amber-400 animate-pulse"
              }`}
            />
            <span className="text-xs text-slate-400">
              {connectionState === "connected"
                ? "Connected"
                : connectionState === "error"
                ? "Error"
                : "Connecting…"}
            </span>
          </div>
          <span className="text-xs text-slate-500">
            {totalParticipants} participant{totalParticipants !== 1 ? "s" : ""}
          </span>
        </div>
      </header>

      {/* ── Announcement banner ─────────────────────────────────── */}
      {announcement && (
        <div className="mx-4 mt-2 rounded-xl bg-amber-500/20 border border-amber-500/40 px-4 py-2 text-sm text-amber-200 animate-fade-in">
          📢 <strong>{announcement.name}:</strong> {announcement.message}
        </div>
      )}

      {/* ── Reactions overlay ───────────────────────────────────── */}
      {reactions.length > 0 && (
        <div className="pointer-events-none absolute right-6 top-20 z-30 flex flex-col items-end gap-1">
          {reactions.map((r) => (
            <div
              key={r.id}
              className="animate-bounce rounded-full bg-black/60 px-3 py-1 text-lg backdrop-blur-sm"
            >
              {r.reaction}{" "}
              <span className="text-xs text-slate-300">{r.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Video grid ──────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto p-3">
        <div className={`grid ${getGridClass()} gap-3 h-full`}>
          {/* Local video */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`h-full w-full object-cover ${
                !cameraEnabled ? "hidden" : ""
              }`}
            />
            {!cameraEnabled && (
              <div className="flex h-full min-h-[200px] items-center justify-center bg-slate-800">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold">
                  {name?.[0]?.toUpperCase() || "Y"}
                </div>
              </div>
            )}
            <div className="absolute bottom-2 left-2 flex items-center gap-2">
              <span className="rounded-lg bg-black/60 px-2 py-1 text-xs backdrop-blur-sm">
                {name || "You"} (You)
              </span>
              {!micEnabled && (
                <span className="rounded-lg bg-red-500/80 px-2 py-1 text-xs">
                  🔇
                </span>
              )}
              {handRaised && (
                <span className="rounded-lg bg-amber-500/80 px-2 py-1 text-xs">
                  ✋
                </span>
              )}
              {isScreenSharing && (
                <span className="rounded-lg bg-emerald-500/80 px-2 py-1 text-xs">
                  🖥️ Sharing
                </span>
              )}
            </div>
          </div>

          {/* Remote participants */}
          {remoteParticipants.map((participant) => (
            <RemoteParticipantCard
              key={participant.peerId}
              participant={participant}
              handRaised={raisedHands[participant.peerId]}
            />
          ))}

          {/* Empty state */}
          {remoteParticipants.length === 0 && (
            <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-slate-600 bg-slate-900/50 text-center">
              <div>
                <p className="text-lg font-semibold text-slate-300">
                  Waiting for participants…
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Share the meeting ID to invite others
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Error bar ───────────────────────────────────────────── */}
      {error && (
        <div className="mx-4 mb-2 flex items-center justify-between rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="ml-3 text-red-300 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Control bar ─────────────────────────────────────────── */}
      <footer className="border-t border-slate-800 px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-center gap-2 flex-wrap">
          {/* Mic */}
          <button
            onClick={toggleMic}
            className={`flex h-12 w-12 items-center justify-center rounded-full text-lg transition ${
              micEnabled
                ? "bg-slate-700 hover:bg-slate-600"
                : "bg-red-600 hover:bg-red-500"
            }`}
            title={micEnabled ? "Mute microphone" : "Unmute microphone"}
          >
            {micEnabled ? "🎤" : "🔇"}
          </button>

          {/* Camera */}
          <button
            onClick={toggleCamera}
            className={`flex h-12 w-12 items-center justify-center rounded-full text-lg transition ${
              cameraEnabled
                ? "bg-slate-700 hover:bg-slate-600"
                : "bg-red-600 hover:bg-red-500"
            }`}
            title={cameraEnabled ? "Turn off camera" : "Turn on camera"}
          >
            {cameraEnabled ? "🎥" : "📷"}
          </button>

          {/* Screen share */}
          <button
            onClick={isScreenSharing ? stopScreenShare : startScreenShare}
            className={`flex h-12 w-12 items-center justify-center rounded-full text-lg transition ${
              isScreenSharing
                ? "bg-emerald-600 hover:bg-emerald-500"
                : "bg-slate-700 hover:bg-slate-600"
            }`}
            title={isScreenSharing ? "Stop sharing" : "Share screen"}
          >
            🖥️
          </button>

          {/* Raise hand */}
          <button
            onClick={toggleRaiseHand}
            className={`flex h-12 w-12 items-center justify-center rounded-full text-lg transition ${
              handRaised
                ? "bg-amber-500 hover:bg-amber-400"
                : "bg-slate-700 hover:bg-slate-600"
            }`}
            title={handRaised ? "Lower hand" : "Raise hand"}
          >
            ✋
          </button>

          {/* Reactions dropdown */}
          <div className="relative group">
            <button
              className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-700 text-lg transition hover:bg-slate-600"
              title="React"
            >
              😀
            </button>
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 hidden group-hover:flex gap-1 rounded-xl bg-slate-800 border border-slate-700 p-2 shadow-xl">
              {REACTIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => sendReaction(r)}
                  className="rounded-lg p-1.5 text-xl hover:bg-slate-700 transition"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Participants panel toggle */}
          <button
            onClick={() => {
              setShowParticipants((v) => !v);
              if (!showParticipants) setShowChat(false);
            }}
            className={`flex h-12 w-12 items-center justify-center rounded-full text-lg transition ${
              showParticipants
                ? "bg-blue-600 hover:bg-blue-500"
                : "bg-slate-700 hover:bg-slate-600"
            }`}
            title="Participants"
          >
            👥
          </button>

          {/* Chat toggle */}
          <button
            onClick={() => {
              setShowChat((v) => !v);
              if (!showChat) setShowParticipants(false);
            }}
            className={`flex h-12 w-12 items-center justify-center rounded-full text-lg transition ${
              showChat
                ? "bg-blue-600 hover:bg-blue-500"
                : "bg-slate-700 hover:bg-slate-600"
            }`}
            title="Chat"
          >
            💬
          </button>

          {/* Leave */}
          <button
            onClick={onLeave}
            className="flex h-12 items-center gap-2 rounded-full bg-red-600 px-5 text-sm font-semibold transition hover:bg-red-500"
          >
            <span>📞</span> Leave
          </button>
        </div>
      </footer>

      {/* ── Side panels ─────────────────────────────────────────── */}
      {showChat && (
        <ChatPanel
          meetingId={meetingId}
          name={name}
          socketRef={socketRef}
          onClose={() => setShowChat(false)}
        />
      )}

      {showParticipants && (
        <ParticipantsPanel
          localName={name}
          isHost={isHost}
          remoteParticipants={remoteParticipants}
          raisedHands={raisedHands}
          handRaised={handRaised}
          onAnnounce={sendAnnouncement}
          onClose={() => setShowParticipants(false)}
        />
      )}
    </div>
  );
}

// ── Remote participant video card ────────────────────────────────────
function RemoteParticipantCard({ participant, handRaised }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && participant.stream) {
      videoRef.current.srcObject = participant.stream;
    }
  }, [participant.stream]);

  const hasVideo = participant.video !== false && participant.stream;
  const hasAudio = participant.audio !== false;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
      {hasVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full min-h-[200px] items-center justify-center bg-slate-800">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600 text-3xl font-bold">
            {participant.name?.[0]?.toUpperCase() || "P"}
          </div>
          {/* Hidden audio element to ensure audio plays */}
          {participant.stream && (
            <audio
              autoPlay
              ref={(el) => {
                if (el) el.srcObject = participant.stream;
              }}
            />
          )}
        </div>
      )}

      <div className="absolute bottom-2 left-2 flex items-center gap-2">
        <span className="rounded-lg bg-black/60 px-2 py-1 text-xs backdrop-blur-sm">
          {participant.name || "Participant"}
        </span>
        {!hasAudio && (
          <span className="rounded-lg bg-red-500/80 px-2 py-1 text-xs">
            🔇
          </span>
        )}
        {handRaised && (
          <span className="rounded-lg bg-amber-500/80 px-2 py-1 text-xs">
            ✋
          </span>
        )}
      </div>

      {/* Connecting indicator */}
      {!participant.stream && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-500 border-t-blue-400" />
            <p className="mt-2 text-xs text-slate-400">Connecting…</p>
          </div>
        </div>
      )}
    </div>
  );
}
