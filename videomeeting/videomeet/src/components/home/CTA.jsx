"use client";

import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28">
      {/* Background Decorations */}
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-indigo-100/50 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-blue-600 px-6 py-14 text-center shadow-2xl shadow-blue-600/20 sm:px-10 lg:px-16 lg:py-16">
          {/* Small Label */}
          <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100">
            Get Started
          </span>

          {/* Heading */}
          <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
            Ready to start your next meeting?
          </h2>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
            Connect with your team, classmates, friends, and family through
            simple and reliable online meetings.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="rounded-xl bg-white px-7 py-3.5 font-semibold text-blue-600 transition duration-300 hover:-translate-y-0.5 hover:bg-gray-100"
            >
              Create Free Account →
            </Link>

            <Link
              href="/join"
              className="rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/20"
            >
              Join a Meetin
            </Link>
          </div>

          {/* Bottom Text */}
          <p className="mt-6 text-sm text-blue-100/80">
            Start your meeting in just a few clicks.
          </p>
        </div>
      </div>
    </section>
  );
}
