"use client";

const securityFeatures = [
  {
    icon: "🔐",
    title: "Protected Meetings",
    description:
      "Use unique meeting IDs and controlled access to help keep your meetings private.",
  },
  {
    icon: "🛡️",
    title: "Secure Authentication",
    description:
      "User accounts can be protected with secure authentication and session management.",
  },
  {
    icon: "🔒",
    title: "Encrypted Connections",
    description:
      "Real-time communication can use secure browser and WebRTC connections.",
  },
  {
    icon: "👤",
    title: "Host Controls",
    description:
      "Hosts can control meeting access and manage participants during a session.",
  },
];

export default function Security() {
  return (
    <section
      id="security"
      className="relative overflow-hidden bg-gray-950 py-20 text-white sm:py-24 lg:py-28"
    >
      {/* Background Decorations */}
      <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-indigo-600/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400">
            Security
          </span>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Your meetings should feel private and secure.
          </h2>

          <p className="mt-5 text-base leading-7 text-gray-400 sm:text-lg">
            VideoMeet is designed with secure communication, account protection,
            and meeting access controls in mind.
          </p>
        </div>

        {/* Security Cards */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {securityFeatures.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-white/[0.08]"
            >
              {/* Icon */}
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-2xl transition duration-300 group-hover:scale-110">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="mt-6 text-lg font-bold text-white">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="mt-3 text-sm leading-7 text-gray-400">
                {feature.description}
              </p>

              {/* Accent */}
              <div className="mt-6 h-1 w-8 rounded-full bg-blue-500 transition-all duration-300 group-hover:w-14" />
            </div>
          ))}
        </div>

        {/* Bottom Highlight */}
        <div className="mt-12 rounded-2xl border border-blue-400/10 bg-blue-500/5 p-6 sm:p-8">
          <div className="flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
            <div>
              <h3 className="text-xl font-bold text-white">
                Built with modern web technologies
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
                Your future VideoMeet architecture can combine Next.js, Express,
                Socket.IO, LiveKit, and MongoDB to build a scalable meeting
                platform.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3">
              <span className="text-lg text-green-400">✓</span>

              <span className="text-sm font-semibold text-gray-200">
                Security First
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
