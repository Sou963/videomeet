"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import MeetingRoom from "@/components/meeting/MeetingRoom";

export default function MeetingPage() {
  const { meetingId } = useParams();
  const router = useRouter();
  const previewRef = useRef(null);
  const streamRef = useRef(null);
  const cameraRef = useRef(true);
  const microphoneRef = useRef(true);

  const [meeting, setMeeting] = useState(null);
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState("");
  const [camera, setCamera] = useState(true);
  const [microphone, setMicrophone] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    Promise.all([api(`/meetings/${meetingId}`), api("/auth/me")])
      .then(([meetingResponse, userResponse]) => {
        setMeeting(meetingResponse.meeting);
        setUser(userResponse.user);
      })
      .catch((requestError) => setError(requestError.message));
  }, [meetingId]);

  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) return undefined;

    let active = true;
    const requestMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);

    requestMedia({ video: true, audio: true })
      .then((stream) => {
        if (!active) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        stream.getVideoTracks().forEach((track) => {
          track.enabled = cameraRef.current;
        });
        stream.getAudioTracks().forEach((track) => {
          track.enabled = microphoneRef.current;
        });

        if (previewRef.current) {
          previewRef.current.srcObject = stream;
        }
      })
      .catch((deviceError) => {
        if (!active) return;
        setError(
          deviceError.name === "NotAllowedError"
            ? "Allow camera and microphone access in your browser settings, then reload this page."
            : `Camera/microphone unavailable: ${deviceError.message}`
        );
      });

    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, []);

  useEffect(() => {
    streamRef.current?.getVideoTracks().forEach((track) => {
      track.enabled = camera;
    });
  }, [camera]);

  useEffect(() => {
    streamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = microphone;
    });
  }, [microphone]);

  async function join() {
    if (joining) return;
    setJoining(true);

    try {
      setError("");
      await api(`/meetings/${meetingId}/join`, {
        method: "POST",
        body: JSON.stringify({ password }),
      });

      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setIsJoined(true);
    } catch (joinError) {
      setError(joinError.message);
    } finally {
      setJoining(false);
    }
  }

  // Determine if current user is the host
  const isHost =
    user &&
    meeting &&
    (meeting.hostId === user.id ||
      meeting.hostId?._id === user.id ||
      (typeof meeting.hostId === "object" &&
        meeting.hostId?._id?.toString() === user.id?.toString()));

  if (isJoined) {
    return (
      <MeetingRoom
        meetingId={meetingId}
        name={user?.name}
        title={meeting?.title}
        isHost={isHost}
        onLeave={() => router.push("/dashboard")}
      />
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-white">
      <section className="w-full max-w-3xl rounded-3xl bg-slate-900 p-5 shadow-2xl sm:p-8">
        <p className="text-blue-400">VideoMeet waiting room</p>
        <h1 className="mt-2 text-2xl font-bold">{meeting?.title || "Loading meeting..."}</h1>
        <p className="mt-1 text-sm text-slate-400">Meeting ID: {meetingId}</p>

        <div className="mt-6 grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-800">
            <video ref={previewRef} autoPlay muted playsInline className={`h-full w-full object-cover ${camera ? "" : "hidden"}`} />
            {!camera && <div className="flex h-full items-center justify-center text-5xl">{user?.name?.[0] || "?"}</div>}
            <span className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-2 py-1 text-sm">{user?.name || "You"}</span>
          </div>

          <div>
            <p className="text-sm text-slate-300">Check your setup before joining.</p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const next = !microphone;
                  microphoneRef.current = next;
                  setMicrophone(next);
                }}
                className={`rounded-xl border px-4 py-3 transition ${
                  microphone
                    ? "border-slate-700 hover:bg-slate-800"
                    : "border-red-500/50 bg-red-500/10 text-red-300"
                }`}
              >
                {microphone ? "🎤 Mic on" : "🔇 Mic off"}
              </button>

              <button
                type="button"
                onClick={() => {
                  const next = !camera;
                  cameraRef.current = next;
                  setCamera(next);
                }}
                className={`rounded-xl border px-4 py-3 transition ${
                  camera
                    ? "border-slate-700 hover:bg-slate-800"
                    : "border-red-500/50 bg-red-500/10 text-red-300"
                }`}
              >
                {camera ? "🎥 Camera on" : "📷 Camera off"}
              </button>
            </div>

            {meeting?.hasPassword && (
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                placeholder="Meeting password"
                className="mt-4 h-11 w-full rounded-xl bg-slate-800 px-3 text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-blue-500"
              />
            )}

            {error && (
              <div className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
                <button
                  onClick={() => {
                    setError("");
                    // Re-request media if it was a permission error
                    if (!streamRef.current) {
                      navigator.mediaDevices
                        ?.getUserMedia({ video: true, audio: true })
                        .then((stream) => {
                          streamRef.current = stream;
                          if (previewRef.current) previewRef.current.srcObject = stream;
                          setCamera(true);
                          setMicrophone(true);
                        })
                        .catch(() => setError("Still unable to access camera/microphone."));
                    }
                  }}
                  className="ml-2 text-blue-400 underline"
                >
                  Retry
                </button>
              </div>
            )}

            <button
              type="button"
              disabled={!meeting || !user || joining}
              onClick={join}
              className="mt-5 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-500 disabled:opacity-50"
            >
              {joining ? "Joining…" : "Join now"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
