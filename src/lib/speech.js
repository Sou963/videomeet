/**
 * Meta SeamlessM4T v2 Speech-to-Speech Languages
 * Standard 3-letter ISO-639-3 codes:
 * - 'ben': Bengali (বাংলা)
 * - 'eng': English
 */
export const VOICE_LANGUAGES = [
  { name: "English", code: "eng", nativeName: "English" },
  { name: "Bengali", code: "ben", nativeName: "বাংলা" },
];

export function getVoiceLanguage(code) {
  if (!code) return VOICE_LANGUAGES[0];
  const normalized = String(code).toLowerCase().trim();
  if (normalized === "en" || normalized === "eng") {
    return VOICE_LANGUAGES[0];
  }
  if (normalized === "bn" || normalized === "ben") {
    return VOICE_LANGUAGES[1];
  }
  return VOICE_LANGUAGES.find((l) => l.code === normalized) || VOICE_LANGUAGES[0];
}
