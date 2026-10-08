"use client";
import { LiveKitRoom, VideoConference, RoomAudioRenderer } from "@livekit/components-react";
import "@livekit/components-styles";
import ChatPanel from "./ChatPanel";
export default function MeetingRoom({ token, url, onLeave, meetingId, name, title, audio = true, video = true }) { return <div className="h-screen bg-slate-950"><LiveKitRoom token={token} serverUrl={url} connect audio={audio} video={video} onDisconnected={onLeave} data-lk-theme="default" className="h-full"><div className="pointer-events-none absolute left-4 top-4 z-10 rounded-xl bg-black/50 px-3 py-2 text-sm text-white">{title || "VideoMeet"}<span className="ml-2 text-slate-400">{meetingId}</span></div><VideoConference /><RoomAudioRenderer /></LiveKitRoom><ChatPanel meetingId={meetingId} name={name} /></div>; }
