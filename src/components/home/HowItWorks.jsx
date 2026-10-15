"use client";

const steps = [
  {
    number: "01",
    title: "Create a Meeting",
    description:
      "Create a meeting in seconds and get a unique meeting link to share with others.",
  },
  {
    number: "02",
    title: "Share the Link",
    description:
      "Send your meeting link or meeting ID to your team, classmates, friends, or family.",
  },
  {
    number: "03",
    title: "Start Meeting",
    description:
      "Join from your browser, turn on your camera and microphone, and start talking.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-gray-50 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
            How It Works
          </span>

          <h2 className="mt-5 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Start your meeting in three simple steps
          </h2>

          <p className="mt-5 text-base leading-7 text-gray-600 sm:text-lg">
            No complicated setup. Create, share, and start your meeting in just
            a few clicks.
          </p>
        </div>

        <div className="relative mt-16 grid gap-8 md:grid-cols-3">
          {/* Connecting line */}
          <div className="absolute left-[22%] right-[22%] top-10 hidden h-px bg-blue-200 md:block" />

          {steps.map((step) => (
            <div key={step.number} className="relative text-center">
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-xl font-bold text-white shadow-lg shadow-blue-600/20">
                {step.number}
              </div>

              <h3 className="mt-7 text-xl font-bold text-gray-900">
                {step.title}
              </h3>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-gray-600 sm:text-base">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
