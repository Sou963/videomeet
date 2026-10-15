"use client";

const features = [
  {
    icon: "🎥",
    title: "HD Video",
    description:
      "Enjoy clear and smooth video meetings with a reliable meeting experience.",
  },
  {
    icon: "🎤",
    title: "Clear Audio",
    description:
      "Communicate clearly with high-quality audio for your meetings and calls.",
  },
  {
    icon: "🖥️",
    title: "Screen Sharing",
    description:
      "Share your screen, presentations, documents, or browser with participants.",
  },
  {
    icon: "💬",
    title: "Live Chat",
    description:
      "Send messages to everyone during your meeting with real-time chat.",
  },
  {
    icon: "👥",
    title: "Multiple Participants",
    description:
      "Bring your team, classmates, friends, or family together in one meeting.",
  },
  {
    icon: "🔒",
    title: "Private Meetings",
    description:
      "Create meeting rooms with controlled access for your conversations.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
            Features
          </span>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Everything you need for better meetings
          </h2>

          <p className="mt-5 text-base leading-7 text-gray-600 sm:text-lg">
            VideoMeet gives you the essential tools to communicate, collaborate,
            and stay connected from anywhere.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/40"
            >
              {/* Icon */}
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl transition duration-300 group-hover:scale-110 group-hover:bg-blue-100">
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="mt-6 text-xl font-bold text-gray-900">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-600 sm:text-base">
                {feature.description}
              </p>

              {/* Small indicator */}
              <div className="mt-6 h-1 w-8 rounded-full bg-blue-600 transition-all duration-300 group-hover:w-14" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
