"use client";

import { useState } from "react";

export default function QuickJoin() {
  const [meetingId, setMeetingId] = useState("");

  const handleJoin = (e) => {
    e.preventDefault();

    if (!meetingId.trim()) {
      return;
    }

    console.log("Joining meeting:", meetingId);

    // Later:
    // router.push(`/meeting/${meetingId}`);
  };

  return (
    <section className="bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
            {/* Left Content */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Quick Join
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                Join a meeting instantly
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
                Enter your meeting ID or meeting link below to join a VideoMeet
                session.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleJoin}
              className="flex w-full flex-col gap-3 sm:flex-row md:w-auto"
            >
              <input
                type="text"
                value={meetingId}
                onChange={(e) => setMeetingId(e.target.value)}
                placeholder="Enter meeting ID"
                className="h-12 min-w-0 flex-1 rounded-xl border border-gray-300 px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:w-64"
              />

              <button
                type="submit"
                className="h-12 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
              >
                Join
              </button>
            </form>
          </div>

          {/* Bottom Info */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-gray-100 pt-5 text-xs text-gray-500 sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              No download required
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Join from your browser
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
