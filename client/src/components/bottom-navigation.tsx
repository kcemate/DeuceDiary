import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef, useCallback, lazy, Suspense } from "react";

// Lazy-load the modal — only fetched when user first opens it
const LogDeuceModal = lazy(() =>
  import("@/components/log-deuce-modal").then((m) => ({ default: m.LogDeuceModal }))
);

const homeOutlinePath =
  "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" +
  "m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6";

const squadsPath =
  "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857" +
  "M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857" +
  "m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z";

const passportPath =
  "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945" +
  "M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064" +
  "M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z";

// Crossed swords (battle)
const battlePath =
  "M14.121 14.121L19 19m-7-7l7-7-7 7zM5 19l7-7m0 0L5 5l7 7z";

const profilePath =
  "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z";

// Separate filled/outline icon paths for clear active state distinction
const navItems = [
  {
    path: "/",
    label: "Home",
    exact: true,
    // Outline house
    outlinePath: homeOutlinePath,
    // Filled house (uses fill)
    filledPath: homeOutlinePath,
    useFill: true,
  },
  {
    path: "/groups",
    label: "Squads",
    exact: false,
    outlinePath: squadsPath,
    filledPath: squadsPath,
    useFill: true,
  },
  null, // FAB slot
  {
    path: "/battle",
    label: "Battle",
    exact: false,
    outlinePath: battlePath,
    filledPath: battlePath,
    useFill: false,
  },
  {
    path: "/passport",
    label: "Passport",
    exact: false,
    outlinePath: passportPath,
    filledPath: passportPath,
    useFill: true,
  },
  {
    path: "/profile",
    label: "Profile",
    exact: false,
    outlinePath: profilePath,
    filledPath: profilePath,
    useFill: true,
  },
];

function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const onScroll = useCallback(() => {
    if (ticking.current) return;
    ticking.current = true;
    requestAnimationFrame(() => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      // Only hide after scrolling down 10px+ to avoid jitter
      if (delta > 10 && currentY > 80) {
        setHidden(true);
      } else if (delta < -5) {
        setHidden(false);
      }
      lastScrollY.current = currentY;
      ticking.current = false;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  return hidden;
}

export function BottomNavigation() {
  const [location] = useLocation();
  const [showLogModal, setShowLogModal] = useState(false);
  const hidden = useHideOnScroll();

  const isActive = (path: string, exact: boolean) => {
    if (exact) return location === path;
    return location.startsWith(path);
  };

  return (
    <>
      <nav className={cn(
        "fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border" +
        " z-40 transition-transform duration-300 ease-out",
        hidden && "translate-y-full"
      )}>
        <div className="max-w-md mx-auto px-2">
          <div className="flex items-center justify-around py-2 pb-[env(safe-area-inset-bottom,8px)]">
            {navItems.map((item, i) => {
              if (!item) {
                // FAB: Log a Deuce
                return (
                  <button
                    key="fab"
                    onClick={() => setShowLogModal(true)}
                    className="relative -mt-7 flex flex-col items-center group"
                    aria-label="Log a Deuce"
                  >
                    <div
                      className={
                        "w-14 h-14 rounded-full bg-primary shadow-lg shadow-primary/30 flex items-center" +
                        " justify-center transition-transform duration-150 active:scale-90" +
                        " group-hover:shadow-xl group-hover:shadow-primary/40"
                      }
                    >
                      <span className="text-2xl leading-none">🚽</span>
                    </div>
                    <span className="text-[10px] font-bold text-primary mt-1 bottom-nav-item">Log</span>
                  </button>
                );
              }

              const active = isActive(item.path, item.exact);
              const handleClick = (e: React.MouseEvent) => {
                if (active) {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              };
              return (
                <Link key={item.path} href={item.path}>
                  <a
                    onClick={handleClick}
                    className={cn(
                    "nav-item flex flex-col items-center rounded-xl px-3 py-2 transition-all duration-200",
                    active
                      ? "text-primary bg-primary/10 scale-105"
                      : "text-muted-foreground active:scale-95"
                  )}>
                    <svg
                      className="w-6 h-6 mb-0.5 transition-all duration-200"
                      fill={active && item.useFill ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={active ? 2.5 : 1.75}
                        d={active ? item.filledPath : item.outlinePath}
                      />
                    </svg>
                    <span className={cn(
                      "text-[10px] font-bold bottom-nav-item transition-all duration-200",
                      active && "tracking-wide"
                    )}>
                      {item.label}
                    </span>
                  </a>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <Suspense fallback={null}>
        <LogDeuceModal open={showLogModal} onOpenChange={setShowLogModal} />
      </Suspense>
    </>
  );
}
