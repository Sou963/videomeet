"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
                V
              </div>

              <span className="text-2xl font-bold tracking-tight">
                Video<span className="text-blue-400">Meet</span>
              </span>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-gray-400 sm:text-base">
              Simple and reliable video meetings for teams, students, teachers,
              friends, and families. Connect, collaborate, and communicate from
              anywhere.
            </p>

            {/* Social */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm font-semibold text-gray-300 transition hover:border-blue-400/30 hover:bg-blue-600 hover:text-white"
                aria-label="Facebook"
              >
                f
              </a>

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm font-semibold text-gray-300 transition hover:border-blue-400/30 hover:bg-blue-600 hover:text-white"
                aria-label="GitHub"
              >
                G
              </a>

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm font-semibold text-gray-300 transition hover:border-blue-400/30 hover:bg-blue-600 hover:text-white"
                aria-label="LinkedIn"
              >
                in
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-200">
              Product
            </h3>

            <div className="mt-5 flex flex-col gap-3">
              <Link
                href="#features"
                className="text-sm text-gray-400 transition hover:text-white"
              >
                Features
              </Link>

              <Link
                href="#how-it-works"
                className="text-sm text-gray-400 transition hover:text-white"
              >
                How It Works
              </Link>

              <Link
                href="#security"
                className="text-sm text-gray-400 transition hover:text-white"
              >
                Security
              </Link>

              <Link
                href="/join"
                className="text-sm text-gray-400 transition hover:text-white"
              >
                Join Meeting
              </Link>

              <Link
                href="/dashboard"
                className="text-sm text-gray-400 transition hover:text-white"
              >
                Dashboard
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-200">
              Company
            </h3>

            <div className="mt-5 flex flex-col gap-3">
              <Link
                href="/about"
                className="text-sm text-gray-400 transition hover:text-white"
              >
                About
              </Link>

              <Link
                href="/contact"
                className="text-sm text-gray-400 transition hover:text-white"
              >
                Contact
              </Link>

              <Link
                href="/privacy"
                className="text-sm text-gray-400 transition hover:text-white"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="text-sm text-gray-400 transition hover:text-white"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            © 2026 VideoMeet. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-5 text-sm">
            <Link
              href="/privacy"
              className="text-gray-500 transition hover:text-white"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="text-gray-500 transition hover:text-white"
            >
              Terms
            </Link>

            <Link
              href="/contact"
              className="text-gray-500 transition hover:text-white"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
