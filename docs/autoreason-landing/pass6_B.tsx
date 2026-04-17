```tsx
import { SignInButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: "🔥",
    label: "Streaks feature",
    title: "Daily Streaks",
    description:
      "Log every day to keep your streak alive. Miss a day and it resets — your squad gets notified.",
  },
  {
    icon: "👥",
    label: "Squads feature",
    title: "Squads",
    description:
      "Create a crew of up to 10. Cheer each other on, hold each other accountable.",
  },
  {
    icon: "🏆",
    label: "Leaderboards feature",
    title: "Leaderboards",
    description:
      "See who's the most consistent each week. Climb the ranks and claim the throne.",
  },
  {
    icon: "📊",
    label: "Stats feature",
    title: "Personal Stats",
    description:
      "Track how often you go, time-of-day patterns, and weekly trends. Spot what your gut's telling you.",
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
      {/* Fixes: reduced toilet size (text-5xl→6xl vs text-7xl→5.5rem) so headline
          dominates; motion-safe: prefix on bounce respects prefers-reduced-motion;
          aria-hidden on decorative emoji; headline replaces niche Strava reference
          with universal language; removed "No credit card" B2B boilerplate;
          sub-copy now names auth providers for platform clarity */}
      <section className="relative overflow-hidden pt-28 pb-16 sm:pt-40 sm:pb-24 px-4 sm:px-6">
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_rgba(34,197,94,0.10)_0%,_transparent_70%)]"
          aria-hidden="true"