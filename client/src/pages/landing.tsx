import { SignInButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: "🔥",
    label: "fire",
    title: "Streaks",
    description:
      "Log daily to keep the flame alive. Miss a day and it resets — your squad gets notified.",
  },
  {
    icon: "👥",
    label: "people",
    title: "Squads",
    description:
      "Form a crew. Cheer each other on, hold each other accountable. Talk crap — literally.",
  },
  {
    icon: "🏆",
    label: "trophy",
    title: "Leaderboards",
    description:
      "Climb the ranks each week. Who's the most consistent? The throne awaits.",
  },
  {
    icon: "📊",
    label: "chart",
    title: "Stats",
    description:
      "Track frequency, time-of-day patterns, and weekly trends. Know what your gut's telling you.",
  },
];

const steps = [
  {
    num: "1",
    title: "Log it",
    description: "Tap. Rate. Done in ten seconds.",
  },
  {
    num: "2",
    title: "Stack streaks",
    description: "Daily consistency earns streaks and bragging rights.",
  },
  {
    num: "3",
    title: "Compete",
    description: "Rise through leaderboards. Rally your squad. Rule the throne.",
  },
];

const testimonials = [
  {
    quote:
      "I've never been this regular in my life. My squad holds me accountable — miss a day and they notice.",
    name: "Alex M.",
    detail: "47-day streak · Portland, OR",
  },
  {
    quote:
      "The leaderboard turned my bathroom breaks into a competitive sport. My roommate and I are locked in a weekly battle.",
    name: "Jordan K.",
    detail: "Top 10 weekly · Austin, TX",
  },
  {
    quote:
      "Finally, an app that gets it. I actually look forward to logging now. Simple, fun, weirdly motivating.",
    name: "Sam R.",
    detail: "93-day streak · Chicago, IL",
  },
];

const faqs = [
  {
    question: "Is this a joke?",
    answer:
      "It's funny, but it works. Streak-based habit tracking is proven — we just applied it to something everyone does. Your gut health matters, and consistency is the #1 indicator.",
  },
  {
    question: "Can other people see my logs?",
    answer:
      "No. Your individual logs are private by default. Your squad only sees your streak status (active or broken), and the leaderboard only shows ranking — never details.",
  },
  {
    question: "Is this a medical app?",
    answer:
      "No. Deuce Diary is for awareness and fun, not diagnosis. If you notice changes that concern you, talk to a doctor — not an app.",
  },
  {
    question: "What does it cost?",
    answer:
      "Free. Full stop. Log, streak, squad, and compete — all free. No premium tier, no paywalls.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. We use bank-grade encryption and never sell your data. Your bathroom habits are your business — literally.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white antialiased selection:bg-green-500/30">
      {/* ── Nav ── */}
      <nav
        className="fixed top-0 inset-x-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a
            href="#"
            className="flex items-center gap-2 group"
            aria-label="Deuce Diary home"
          >
            <span
              className="text-xl transition-transform group-hover:scale-110"
              aria-hidden="true"
            >
              🚽
            </span>
            <span className="font-bold text-lg tracking-tight">
              Deuce Diary
            </span>
          </a>
          <SignInButton mode="modal">
            <Button
              size="sm"
              className="bg-green-500 hover:bg-green-400 text-black font-semibold rounded-full px-5 cursor-pointer"
            >
              Sign up free
            </Button>
          </SignInButton>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-28 pb-16 sm:pt-40 sm:pb-24 px-4 sm:px-6">
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_rgba(34,197,94,0.10)_0%,_transparent_70%)]"
          aria-hidden="true"
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <div
            className="text-6xl sm:text-7xl leading-none mb-6 select-none motion-safe:animate-bounce"
            style={{ animationDuration: "3s" }}
            aria-hidden="true"
          >
            🚽
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.08] mb-5">
            The Strava of
            <br className="hidden sm:block" /> Poop Tracking
          </h1>
          <p className="text-lg sm:text-xl text-neutral-400 max-w-xl mx-auto mb-8 leading-relaxed">
            Streaks. Squads. Leaderboards.
            <br />
            <span className="text-neutral-300">
              Because your best ideas happen on the throne.
            </span>
          </p>
          <SignInButton mode="modal">
            <Button
              size="lg"
              className="bg-green-500 hover:bg-green-400 text-black font-bold text-lg rounded-full px-8 h-14 shadow-lg shadow-green-500/20 cursor-pointer"
            >
              Start your streak — it's free
            </Button>
          </SignInButton>
          <p className="text-sm text-neutral-500 mt-3">
            Google, Apple, or email — sign up in seconds.
          </p>
        </div>
      </section>

      {/* ── Social proof bar ── */}
      <section className="pb-16 sm:pb-20 px-4 sm:px-6" aria-label="Social proof">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.04] text-sm text-neutral-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            Join thousands of consistent throne thinkers
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="pb-20 sm:pb-28 px-4 sm:px-6" aria-label="Features">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 tracking-tight">
            Everything you need to own the throne
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 hover:border-green-500/30 hover:bg-white/[0.04] transition-colors"
              >
                <span
                  className="text-3xl mb-4 block transition-transform group-hover:scale-110"
                  role="img"
                  aria-label={f.label}
                >
                  {f.icon}
                </span>
                <h3 className="text-lg font-semibold mb-1.5">{f.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mid-page CTA ── */}
      <section className="pb-20 sm:pb-28 px-4 sm:px-6">
        <div className="max-w-xl mx-auto text-center">
          <SignInButton mode="modal">
            <Button
              size="lg"
              className="bg-green-500 hover:bg-green-400 text-black font-bold text-base rounded-full px-8 h-12 shadow-lg shadow-green-500/20 cursor-pointer"
            >
              Get started free
            </Button>
          </SignInButton>
          <p className="text-sm text-neutral-500 mt-2.5">
            Google, Apple, or email — pick your speed.
          </p>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="pb-20 sm:pb-28 px-4 sm:px-6" aria-label="How it works">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 tracking-tight">
            Three steps to greatness
          </h2>
          <ol className="space-y-8">
            {steps.map((s) => (
              <li key={s.num} className="flex gap-5 items-start">
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 font-bold text-sm"
                  aria-hidden="true"
                >
                  {s.num}
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-0.5">{s.title}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="pb-20 sm:pb-28 px-4 sm:px-6" aria-label="Testimonials">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 tracking-tight">
            Don't take our word for it
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-green-500/20 transition-colors"
              >
                <p className="text-neutral-300 text-sm leading-relaxed mb-4">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-200">
                      {t.name}
                    </p>
                    <p className="text-xs text-green-400">{t.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="pb-20 sm:pb-28 px-4 sm:px-6" aria-label="Frequently asked questions">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 tracking-tight">
            Questions? We got you.
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="border-b border-white/5 pb-6">
                <h3 className="font-semibold text-neutral-200 mb-2">
                  {faq.question}
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative pb-24 sm:pb-32 px-4 sm:px-6 overflow-hidden">
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,_rgba(34,197,94,0.08)_0%,_transparent_70%)]"
          aria-hidden="true"
        />
        <div className="relative max-w-xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Ready to get on the board?
          </h2>
          <p className="text-neutral-400 mb-8 leading-relaxed">
            Your streak starts today. Don't let day one pass you by.
          </p>
          <SignInButton mode="modal">
            <Button
              size="lg"
              className="bg-green-500 hover:bg-green-400 text-black font-bold text-lg rounded-full px-8 h-14 shadow-lg shadow-green-500/20 cursor-pointer"
            >
              Sign up free
            </Button>
          </SignInButton>
          <p className="text-sm text-neutral-500 mt-3">
            Join with Google, Apple, or email.
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="border-t border-white/5 py-8 px-4 sm:px-6"
        role="contentinfo"
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
          <div className="flex items-center gap-2">
            <span role="img" aria-label="toilet">
              🚽
            </span>
            <span className="font-medium text-neutral-400">Deuce Diary</span>
          </div>
          <p>Because your best ideas happen on the throne.</p>
        </div>
      </footer>
    </div>
  );
}