import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { PremiumGate } from "@/components/premium-gate";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon in webpack/vite builds
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface PassportStamp {
  id: number;
  userId: string;
  city: string;
  region: string | null;
  country: string;
  countryCode: string | null;
  latitude: string;
  longitude: string;
  entryCount: number;
  firstVisitAt: string;
  lastVisitAt: string;
}

interface PassportStats {
  totalCities: number;
  totalCountries: number;
  totalStampedDeuces: number;
}

interface PassportData {
  stamps: PassportStamp[];
  stats: PassportStats;
}

// Country code → flag emoji
function countryFlag(code: string | null): string {
  if (!code || code.length !== 2) return "📍";
  const offset = 0x1f1e6;
  return String.fromCodePoint(
    code.charCodeAt(0) - 65 + offset,
    code.charCodeAt(1) - 65 + offset,
  );
}

function continentCount(stamps: PassportStamp[]): number {
  const continentMap: Record<string, string> = {
    US: "NA", CA: "NA", MX: "NA", GT: "NA", BZ: "NA", SV: "NA", HN: "NA", NI: "NA", CR: "NA", PA: "NA",
    BR: "SA", AR: "SA", CL: "SA", CO: "SA", PE: "SA", VE: "SA", EC: "SA", BO: "SA", PY: "SA", UY: "SA",
    GB: "EU", FR: "EU", DE: "EU", IT: "EU", ES: "EU", PT: "EU", NL: "EU", BE: "EU", CH: "EU", AT: "EU",
    SE: "EU", NO: "EU", DK: "EU", FI: "EU", IE: "EU", PL: "EU", CZ: "EU", RO: "EU", GR: "EU", HU: "EU",
    CN: "AS", JP: "AS", KR: "AS", IN: "AS", TH: "AS", VN: "AS", PH: "AS", ID: "AS", MY: "AS", SG: "AS",
    TW: "AS", HK: "AS", AE: "AS", SA: "AS", IL: "AS", TR: "AS", RU: "AS",
    AU: "OC", NZ: "OC", FJ: "OC",
    ZA: "AF", NG: "AF", EG: "AF", KE: "AF", GH: "AF", ET: "AF", TZ: "AF", MA: "AF",
    AQ: "AN",
  };
  const continents = new Set<string>();
  for (const s of stamps) {
    if (s.countryCode && continentMap[s.countryCode]) {
      continents.add(continentMap[s.countryCode]);
    } else {
      continents.add("OTHER");
    }
  }
  return continents.size;
}

export default function Passport() {
  const { user } = useAuth();
  const { toast } = useToast();
  const isPremium = user?.subscription === "premium";
  const { data, isLoading, error } = useQuery<PassportData>({
    queryKey: ["/api/passport"],
    queryFn: () => apiRequest<PassportData>("/api/passport"),
    enabled: isPremium,
  });

  const stamps = data?.stamps ?? [];
  const stats = data?.stats ?? { totalCities: 0, totalCountries: 0, totalStampedDeuces: 0 };

  // Map center: first stamp or world center
  const center: [number, number] = stamps.length > 0
    ? [Number(stamps[0].latitude), Number(stamps[0].longitude)]
    : [20, 0];

  const zoom = stamps.length > 0 ? 4 : 2;

  const shareUrl = user?.id
    ? `${window.location.origin}/api/passport/${user.id}`
    : "";

  const handleShare = async () => {
    const shareText = `I've dropped deuces in ${stats.totalCities} cities across ${stats.totalCountries} countries! Check out my Poop Passport on Deuce Diary.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "My Poop Passport", text: shareText, url: shareUrl });
      } catch { /* user cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        toast({ title: "Copied to clipboard!" });
      } catch {
        toast({ title: "Failed to copy", variant: "destructive" });
      }
    }
  };

  return (
    <div className="py-6 pb-24 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Poop Passport</h2>
          <p className="text-sm text-muted-foreground">Your global throne map</p>
        </div>
        <span className="text-4xl">🌍</span>
      </div>

      <PremiumGate featureName="Poop Passport">
        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-xl p-3 text-center border border-border">
            <p className="stat-number text-2xl text-primary">{stats.totalCities}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">Cities</p>
          </div>
          <div className="bg-card rounded-xl p-3 text-center border border-border">
            <p className="stat-number text-2xl text-primary">{stats.totalCountries}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">Countries</p>
          </div>
          <div className="bg-card rounded-xl p-3 text-center border border-border">
            <p className="stat-number text-2xl text-primary">
              {stamps.length > 0 ? continentCount(stamps) : 0}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">Continents</p>
          </div>
        </div>

        {/* Share Button */}
        {stamps.length > 0 && (
          <Button
            variant="outline"
            className="w-full rounded-xl"
            onClick={handleShare}
          >
            Share Passport
          </Button>
        )}

        {/* Map */}
        {isLoading ? (
          <div className="h-64 rounded-xl bg-muted animate-pulse flex items-center justify-center">
            <span className="text-muted-foreground">Loading map...</span>
          </div>
        ) : error ? (
          <div className="h-64 rounded-xl bg-muted flex items-center justify-center">
            <span className="text-destructive">Failed to load passport data</span>
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden border border-border h-[300px]">
            <MapContainer
              center={center}
              zoom={zoom}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {stamps.map((stamp) => (
                <Marker
                  key={stamp.id}
                  position={[Number(stamp.latitude), Number(stamp.longitude)]}
                >
                  <Popup>
                    <div className="text-center">
                      <p className="font-bold">
                        {countryFlag(stamp.countryCode)} {stamp.city}
                      </p>
                      <p className="text-xs text-gray-500">
                        {stamp.region ? `${stamp.region}, ` : ""}{stamp.country}
                      </p>
                      <p className="text-xs mt-1">
                        {stamp.entryCount} {stamp.entryCount === 1 ? "deuce" : "deuces"}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}

        {/* Stamp Grid */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Stamps Collected</h3>
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] text-primary font-medium">{stamps.length}</span>
          </div>
          {stamps.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <span className="text-4xl mb-3 block">📍</span>
              <p className="text-muted-foreground font-medium">No stamps yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Enable location sharing when logging a deuce to start collecting stamps!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {stamps.map((stamp) => (
                <div
                  key={stamp.id}
                  className="bg-card rounded-xl border border-border p-3 flex items-start gap-3"
                >
                  <span className="text-2xl">{countryFlag(stamp.countryCode)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-foreground text-sm truncate">{stamp.city}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {stamp.region ? `${stamp.region}, ` : ""}{stamp.country}
                    </p>
                    <p className="text-xs text-primary mt-1 font-medium">
                      {stamp.entryCount} {stamp.entryCount === 1 ? "visit" : "visits"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PremiumGate>
    </div>
  );
}
