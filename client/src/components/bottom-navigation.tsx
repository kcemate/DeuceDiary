import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export function BottomNavigation() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border">
      <div className="max-w-md mx-auto px-2">
        <div className="flex items-center justify-around py-3 pb-[env(safe-area-inset-bottom,8px)]">
          <Link href="/">
            <a className={cn(
              "nav-item flex flex-col items-center transition-colors rounded-xl px-3 py-2",
              isActive("/") ? "text-primary bg-primary/10" : "text-muted-foreground"
            )}>
              <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive("/") ? 2.5 : 2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-[10px] font-bold bottom-nav-item">Home</span>
            </a>
          </Link>

          <Link href="/groups">
            <a className={cn(
              "nav-item flex flex-col items-center transition-colors rounded-xl px-3 py-2",
              isActive("/groups") ? "text-primary bg-primary/10" : "text-muted-foreground"
            )}>
              <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive("/groups") ? 2.5 : 2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-[10px] font-bold bottom-nav-item">Squads</span>
            </a>
          </Link>

          <Link href="/bingo">
            <a className={cn(
              "nav-item flex flex-col items-center transition-colors rounded-xl px-3 py-2",
              isActive("/bingo") ? "text-primary bg-primary/10" : "text-muted-foreground"
            )}>
              <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive("/bingo") ? 2.5 : 2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
              <span className="text-[10px] font-bold bottom-nav-item">Bingo</span>
            </a>
          </Link>

          <Link href="/passport">
            <a className={cn(
              "nav-item flex flex-col items-center transition-colors rounded-xl px-3 py-2",
              isActive("/passport") ? "text-primary bg-primary/10" : "text-muted-foreground"
            )}>
              <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive("/passport") ? 2.5 : 2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-[10px] font-bold bottom-nav-item">Passport</span>
            </a>
          </Link>

          <Link href="/profile">
            <a className={cn(
              "nav-item flex flex-col items-center transition-colors rounded-xl px-3 py-2",
              isActive("/profile") ? "text-primary bg-primary/10" : "text-muted-foreground"
            )}>
              <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive("/profile") ? 2.5 : 2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-[10px] font-bold bottom-nav-item">Profile</span>
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
}
