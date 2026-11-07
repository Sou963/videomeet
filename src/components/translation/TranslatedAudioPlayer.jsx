"use client";

import { useEffect, useRef } from "react";

export default function TranslatedAudioPlayer({ audio, volume = 1 }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!audio || !ref.current) return;
    const url = URL.createObjectURL(audio);
    ref.current.src = url;
    ref.current.volume = volume;
    ref.current.play().catch(() => {});
    return () => URL.revokeObjectURL(url);
  }, [audio, volume]);
  return <audio ref={ref} autoPlay playsInline className="hidden" />;
}
