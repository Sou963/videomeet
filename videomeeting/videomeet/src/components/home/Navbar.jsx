"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-gray-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 transition duration-300 group-hover:scale-105 group-hover:bg-blue-700">
            <span className="text-lg font-bold">V</span>
          </div>

          <span className="text-xl font-bold tracking-tight text-gray-900">
            Video<span className="text-blue-600">Meet</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          <Link
            href="#features"
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-blue-50 hover:text-blue-600"
          >
            Features
          </Link>

          <Link
            href="#how-it-works"
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-blue-50 hover:text-blue-600"
          >
            How It Works
          </Link>

          <Link
            href="#security"
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-blue-50 hover:text-blue-600"
          >
            Security
          </Link>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            Get Started →
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-xl border border-gray-200 px-3 py-2 text-xl text-gray-700 transition hover:bg-gray-100 md:hidden"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-5">
            <div className="flex flex-col gap-1">
              <Link
                href="#features"
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              >
                Features
              </Link>

              <Link
                href="how-it-works"
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              >
                How It Works
              </Link>

              <Link
                href="#security"
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              >
                Security
              </Link>

              <div className="my-3 border-t border-gray-200" />

              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-4 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                Login
              </Link>

              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="mt-1 rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
              >
                Get Started →
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
