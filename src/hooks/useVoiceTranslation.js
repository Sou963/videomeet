"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { createTranslationSession } from "@/services/speechService";

export default function useVoiceTranslation({
  meetingId,
  participants,
  enabled,
  language,
  mode,
}) {
  const sessionsRef = useRef(new Map());
  const [statuses, setStatuses] = useState({});
  const [audioItems, setAudioItems] = useState({});
  const [error, setError] = useState("");
  const [isServiceOnline, setIsServiceOnline] = useState(true);
  const enabledRef = useRef(enabled && mode === "translated");

  useEffect(() => {
    enabledRef.current = enabled && mode === "translated";
  }, [enabled, mode]);

  const setStatus = useCallback((id, status) => {
    setStatuses((current) => ({ ...current, [id]: status }));
  }, []);

  const stop = useCallback(
    async (id) => {
      const session = sessionsRef.current.get(id);
      sessionsRef.current.delete(id);
      if (session) await session.close().catch(() => {});
      setStatus(id, "idle");
    },
    [setStatus]
  );

  // Check health of Meta SeamlessM4T v2 translation service
  useEffect(() => {
    if (!enabled) return;
    let isCancelled = false;

    async function checkService() {
      try {
        const res = await api("/translation/status", { method: "GET" }).catch(() => null);
        if (!isCancelled && res) {
          setIsServiceOnline(res.online ?? true);
        }
      } catch {
        if (!isCancelled) setIsServiceOnline(false);
      }
    }

    checkService();
    return () => {
      isCancelled = true;
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || mode !== "translated") {
      for (const id of sessionsRef.current.keys()) stop(id);
      return;
    }

    let cancelled = false;

    async function sync() {
      // Find all remote participants who have live audio tracks
      const desired = new Map(
        participants
          .filter((p) => p.stream?.getAudioTracks().some((track) => track.readyState === "live"))
          .map((p) => [p.peerId, p])
      );

      // Stop sessions for participants who left or if language changed
      for (const [id, session] of sessionsRef.current) {
        if (!desired.has(id) || session.language !== language) {
          await stop(id);
        }
      }

      // Start translation sessions for new participants
      for (const [id, participant] of desired) {
        if (sessionsRef.current.has(id)) continue;
        setStatus(id, "connecting");

        try {
          if (cancelled || !enabledRef.current) continue;

          const stream = new MediaStream(participant.stream.getAudioTracks());
          const session = await createTranslationSession({
            stream,
            language,
            meetingId,
            onAudio: (blob) => {
              setAudioItems((items) => ({
                ...items,
                [id]: { blob, key: (items[id]?.key || 0) + 1 },
              }));
            },
            onStatus: (status) => {
              setStatus(id, status);
              if (status === "translating") setError("");
            },
            onError: (message) => {
              setStatus(id, "error");
              setError(message);
            },
          });

          if (cancelled) {
            await session.close();
          } else {
            sessionsRef.current.set(id, { ...session, language });
          }
        } catch (err) {
          setStatus(id, "error");
          setError(err.message || "Could not connect to SeamlessM4T AI translation service.");
        }
      }
    }

    sync();
    return () => {
      cancelled = true;
    };
  }, [enabled, language, meetingId, mode, participants, setStatus, stop]);

  useEffect(
    () => () => {
      for (const session of sessionsRef.current.values()) {
        session.close().catch(() => {});
      }
      sessionsRef.current.clear();
    },
    []
  );

  return {
    statuses,
    audioItems,
    error,
    isServiceOnline,
    clearError: () => setError(""),
  };
}
