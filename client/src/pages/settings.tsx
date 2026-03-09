import { useLocation } from "wouter";
import { useTheme, type ThemeName } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { BackHeader } from "@/components/back-header";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GoldCrownBadge } from "@/components/gold-crown-badge";
import {
  Bell,
  Palette,
  Gift,
  ChevronRight,
  Crown,
  LogOut,
  Shield,
  FileText,
  Info,
} from "lucide-react";
import { useState } from "react";

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

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden mb-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-5 pt-4 pb-2">
        {title}
      </h3>
      <div className="divide-y divide-border">{children}</div>
    </div>
  );
}

function SettingsRow({
  icon,
  label,
  onClick,
  trailing,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  trailing?: React.ReactNode;
}) {
  const content = (
    <div className="flex items-center gap-3 px-5 py-3">
      <span className="text-muted-foreground shrink-0">{icon}</span>
      <span className="text-sm font-medium text-foreground flex-1 text-left">
        {label}
      </span>
      {trailing ?? <ChevronRight className="w-4 h-4 text-muted-foreground" />}
    </div>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="w-full transition-colors hover:bg-muted/50 active:bg-muted"
      >
        {content}
      </button>
    );
  }

  return content;
}

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [pushNotifications, setPushNotifications] = useState(true);

  const isPremium = user?.subscription === "premium";

  function handleThemeSelect(t: (typeof THEMES)[number]) {
    if (t.premium && !isPremium) {
      setLocation("/premium");
      return;
    }
    setTheme(t.id);
    toast({ title: "Theme updated" });
  }

  return (
    <div className="pt-6 pb-24">
      <BackHeader to="/profile" label="Profile" title="Settings" />

      {/* ── Account ─────────────────────────────────────────────── */}
      <SettingsSection title="Account">
        <SettingsRow
          icon={<Crown className="w-4 h-4" />}
          label={isPremium ? "Throne Room" : "Go Premium"}
          onClick={() => setLocation("/premium")}
          trailing={
            <div className="flex items-center gap-2">
              {isPremium ? (
                <GoldCrownBadge
                  subscription={user?.subscription}
                  subscriptionExpiresAt={user?.subscriptionExpiresAt}
                  size="sm"
                />
              ) : (
                <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                  Upgrade
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          }
        />
        <SettingsRow
          icon={<Gift className="w-4 h-4" />}
          label="Refer Friends"
          onClick={() => setLocation("/referral")}
          trailing={
            <div className="flex items-center gap-2">
              {(user?.referralCount ?? 0) > 0 && (
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {user?.referralCount} referred
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          }
        />
      </SettingsSection>

      {/* ── Preferences ─────────────────────────────────────────── */}
      <SettingsSection title="Preferences">
        <SettingsRow
          icon={<Bell className="w-4 h-4" />}
          label="Throne Alerts"
          trailing={
            <Switch
              id="push-notifications"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          }
        />
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <Palette className="w-4 h-4 text-muted-foreground" />
            <Label className="text-sm font-medium text-foreground">Theme</Label>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => handleThemeSelect(t)}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div
                  className={`w-11 h-11 rounded-full border-2 transition-all ${
                    theme === t.id
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background border-primary"
                      : "border-border hover:border-muted-foreground"
                  }`}
                  style={{ backgroundColor: t.color }}
                />
                <span className="text-[11px] font-medium text-foreground">
                  {t.name}
                </span>
                {t.premium && !isPremium && (
                  <span className="text-[10px] leading-none">👑</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </SettingsSection>

      {/* ── About & Legal ───────────────────────────────────────── */}
      <SettingsSection title="About">
        <SettingsRow
          icon={<Shield className="w-4 h-4" />}
          label="Privacy Policy"
          onClick={() => setLocation("/privacy")}
        />
        <SettingsRow
          icon={<FileText className="w-4 h-4" />}
          label="Terms of Service"
          onClick={() => setLocation("/terms")}
        />
        <SettingsRow
          icon={<Info className="w-4 h-4" />}
          label="Version"
          trailing={
            <span className="text-xs text-muted-foreground font-medium">
              1.0.0
            </span>
          }
        />
      </SettingsSection>

      {/* ── Logout ──────────────────────────────────────────────── */}
      <div className="mt-6">
        <Button
          onClick={() => (window.location.href = "/api/logout")}
          variant="destructive"
          className="w-full rounded-xl font-bold"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Leave the Throne Room
        </Button>
      </div>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <p className="text-center text-[11px] text-muted-foreground mt-6">
        Made with 💩 by Deuce Diary
      </p>
    </div>
  );
}
