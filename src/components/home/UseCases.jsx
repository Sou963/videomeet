"use client";

const useCases = [
  {
    icon: "💼",
    title: "Remote Teams",
    description:
      "Connect your team, discuss projects, and collaborate effectively from anywhere.",
  },
  {
    icon: "🎓",
    title: "Students",
    description:
      "Join online classes, group study sessions, and work together on projects.",
  },
  {
    icon: "👨‍🏫",
    title: "Teachers",
    description:
      "Create virtual classrooms and communicate with students from anywhere.",
  },
  {
    icon: "👨‍👩‍👧‍👦",
    title: "Friends & Family",
    description:
      "Stay connected with your loved ones through simple and reliable video calls.",
  },
];

export default function UseCases() {
  return (
    <section className="bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
            Use Cases
          </span>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Built for everyone
          </h2>

          <p className="mt-5 text-base leading-7 text-gray-600 sm:text-lg">
            Whether you're working, learning, teaching, or connecting with
            family and friends, VideoMeet helps you stay connected.
          </p>
        </div>

        {/* Use Case Cards */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((item) => (
            <div
              key={item.title}
              className="group rounded-2xl border border-gray-200 bg-white p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/40"
            >
              {/* Icon */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="mt-6 text-xl font-bold text-gray-900">
                {item.title}
              </h3>

              {/* Description */}
              <p className="mt-3 text-sm leading-7 text-gray-600">
                {item.description}
              </p>

              {/* Bottom Accent */}
              <div className="mx-auto mt-6 h-1 w-8 rounded-full bg-blue-600 transition-all duration-300 group-hover:w-14" />
            </div>
          ))}
        </div>

        {/* Bottom Highlight */}
        <div className="mt-14 rounded-2xl border border-blue-100 bg-blue-50 p-6 text-center sm:p-8">
          <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">
            One platform, many ways to connect.
          </h3>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
            VideoMeet is designed to make online communication simple, whether
            you're working with a team or talking with people you care about.
          </p>
        </div>
      </div>
    </section>
  );
}
