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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const isPremium = user?.subscription === "premium";

  async function handleDeleteAccount() {
    if (deleteConfirmText !== "DELETE") return;
    setIsDeleting(true);
    try {
      await apiRequest("/api/user/account", { method: "DELETE" });
      window.location.href = "/";
    } catch {
      toast({ title: "Failed to delete account", variant: "destructive" });
      setIsDeleting(false);
    }
  }

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

      {/* ── Danger Zone ─────────────────────────────────────────── */}
      <div className="bg-card border border-destructive/30 rounded-2xl overflow-hidden mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-destructive px-5 pt-4 pb-2">
          Danger Zone
        </h3>
        <div className="divide-y divide-border">
          <button
            onClick={() => setDeleteDialogOpen(true)}
            className="w-full transition-colors hover:bg-destructive/5 active:bg-destructive/10"
          >
            <div className="flex items-center gap-3 px-5 py-3">
              <Trash2 className="w-4 h-4 text-destructive shrink-0" />
              <div className="flex-1 text-left">
                <span className="text-sm font-medium text-destructive">
                  Delete Account
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Permanently remove your data
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* ── Logout ──────────────────────────────────────────────── */}
      <div className="mt-4">
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

      {/* ── Delete Account Dialog ─────────────────────────────── */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl mx-4">
          <AlertDialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <AlertDialogTitle>Delete your account?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="space-y-2">
              <span className="block">
                This will permanently delete your account and all associated
                data, including your deuce history, badges, and squad
                memberships.
              </span>
              <span className="block font-semibold text-foreground">
                This action cannot be undone.
              </span>
              <span className="block mt-3">
                Type <span className="font-mono font-bold text-destructive">DELETE</span> to
                confirm:
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <input
            type="text"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder="Type DELETE"
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-destructive"
            autoComplete="off"
          />
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteConfirmText("");
                setDeleteDialogOpen(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText !== "DELETE" || isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
