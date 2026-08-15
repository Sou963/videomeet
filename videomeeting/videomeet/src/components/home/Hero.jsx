"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-32 pb-20 lg:pt-40 lg:pb-28">
      {/* Background Decorations */}
      <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-blue-100/60 blur-3xl" />
      <div className="absolute -right-32 top-40 h-96 w-96 rounded-full bg-indigo-100/50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* ================= LEFT SIDE ================= */}
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Simple & Secure Video Meetings
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Connect.
              <br />
              <span className="text-blue-600">Collaborate.</span>
              <br />
              Communicate.
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
              VideoMeet makes online meetings simple and reliable. Connect with
              your team, classmates, friends and family from anywhere.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="group rounded-xl bg-blue-600 px-6 py-3.5 text-center font-semibold text-white shadow-lg shadow-blue-600/20 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Start a Meeting
                <span className="ml-2 transition group-hover:ml-3">→</span>
              </Link>

              <Link
                href="/join"
                className="rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-center font-semibold text-gray-700 transition duration-300 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
              >
                Join a Meeting
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span className="text-lg text-blue-600">✓</span>
                Secure Meetings
              </div>

              <div className="flex items-center gap-2">
                <span className="text-lg text-blue-600">✓</span>
                HD Video & Audio
              </div>

              <div className="flex items-center gap-2">
                <span className="text-lg text-blue-600">✓</span>
                Easy to Use
              </div>
            </div>
          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="relative">
            {/* Main Meeting Preview */}
            <div className="mx-auto max-w-xl rounded-3xl border border-gray-200 bg-gray-950 p-3 shadow-2xl">
              {/* Meeting Header */}
              <div className="flex items-center justify-between px-3 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                    V
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      VideoMeet
                    </p>

                    <p className="text-xs text-gray-400">Team Meeting</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />

                  <span className="text-xs text-gray-400">Live</span>
                </div>
              </div>

              {/* Participants */}
              <div className="grid grid-cols-2 gap-3">
                {/* Participant 1 */}
                <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-gray-800">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                    S
                  </div>

                  <div className="absolute bottom-2 left-2 rounded-lg bg-black/60 px-2 py-1 text-xs text-white">
                    Sourav
                  </div>
                </div>

                {/* Participant 2 */}
                <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-gray-800">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-xl font-bold text-white">
                    R
                  </div>

                  <div className="absolute bottom-2 left-2 rounded-lg bg-black/60 px-2 py-1 text-xs text-white">
                    Rahim
                  </div>
                </div>

                {/* Participant 3 */}
                <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-gray-800">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-xl font-bold text-white">
                    K
                  </div>

                  <div className="absolute bottom-2 left-2 rounded-lg bg-black/60 px-2 py-1 text-xs text-white">
                    Karim
                  </div>
                </div>

                {/* Participant 4 */}
                <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-gray-800">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white">
                    H
                  </div>

                  <div className="absolute bottom-2 left-2 rounded-lg bg-black/60 px-2 py-1 text-xs text-white">
                    Hasan
                  </div>
                </div>
              </div>

              {/* Meeting Controls */}
              <div className="flex items-center justify-center gap-3 px-3 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-sm">
                  🎤
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-sm">
                  🎥
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-sm">
                  🖥️
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-sm">
                  📞
                </div>
              </div>
            </div>

            {/* Floating Status Card */}
            <div className="absolute -bottom-6 -left-4 hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-xl sm:block lg:-left-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <span className="h-3 w-3 rounded-full bg-green-500" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Meeting is live
                  </p>

                  <p className="text-xs text-gray-500">4 participants</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
