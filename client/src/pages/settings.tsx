import { useLocation } from "wouter";
import { useTheme, type ThemeName } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const THEMES: {
  id: ThemeName;
  name: string;
  color: string;
  premium: boolean;
}[] = [
  { id: "default", name: "Default", color: "#141414", premium: false },
  { id: "cream", name: "Cream", color: "#F5F0E8", premium: true },
  { id: "dark", name: "Dark", color: "#141C29", premium: false },
  { id: "midnight", name: "Midnight", color: "#170E1A", premium: true },
];

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const isPremium = (user as any)?.subscription === "premium";

  function handleSelect(t: (typeof THEMES)[number]) {
    if (t.premium && !isPremium) {
      setLocation("/premium");
      return;
    }
    setTheme(t.id);
    toast({ title: "Theme updated" });
  }

  return (
    <div className="pt-6 pb-24">
      {/* Back to profile */}
      <button
        onClick={() => setLocation("/profile")}
        className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground mb-6 hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Profile
      </button>

      <h2 className="text-2xl font-extrabold text-foreground mb-6">Theme</h2>

      <div className="grid grid-cols-4 gap-4">
        {THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => handleSelect(t)}
            className="flex flex-col items-center gap-2 group"
          >
            <div
              className={`w-14 h-14 rounded-full border-2 transition-all ${
                theme === t.id
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background border-primary"
                  : "border-border hover:border-muted-foreground"
              }`}
              style={{ backgroundColor: t.color }}
            />
            <span className="text-xs font-medium text-foreground">
              {t.name}
            </span>
            {t.premium && !isPremium && (
              <span className="text-xs">👑</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
