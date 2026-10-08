"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinPage() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  function submit(event) {
    event.preventDefault();
    const id = value.trim().replace(/^.*\//, "");
    if (!id) return setError("Meeting ID বা link দিন।");
    router.push(`/meeting/${encodeURIComponent(id)}`);
  }
  return <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4"><form onSubmit={submit} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl"><p className="font-bold text-blue-600">VideoMeet</p><h1 className="mt-3 text-3xl font-bold text-slate-900">Join a meeting</h1><p className="mt-2 text-slate-500">Meeting ID অথবা meeting link দিন।</p><input autoFocus value={value} onChange={(e) => { setValue(e.target.value); setError(""); }} placeholder="abc-123-def" className="mt-6 h-12 w-full rounded-xl border px-4 outline-none focus:border-blue-500" />{error && <p className="mt-2 text-sm text-red-600">{error}</p>}<button className="mt-5 h-12 w-full rounded-xl bg-blue-600 font-semibold text-white hover:bg-blue-700">Continue</button><a href="/" className="mt-4 block text-center text-sm text-slate-500">Back home</a></form></main>;
}
