/**
 * Reverse geocoding using OpenStreetMap Nominatim (free, no API key).
 * Returns city, region, country, and country code from lat/lng.
 */
import logger from "./logger";

export interface GeocodedLocation {
  city: string;
  region: string | null;
  country: string;
  countryCode: string | null;
}

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org/reverse";

/**
 * Fire-and-forget: reverse geocode lat/lng and invoke onGeo if successful.
 * Non-critical — failures are logged but never propagated.
 */
export function triggerPassportStamp(
  latitude: number | null | undefined,
  longitude: number | null | undefined,
  onGeo: (geo: GeocodedLocation, lat: string, lon: string) => Promise<void>,
): void {
  if (latitude == null || longitude == null) return;
  reverseGeocode(latitude, longitude)
    .then(async (geo) => {
      if (geo) await onGeo(geo, String(latitude), String(longitude));
    })
    .catch((err) => {
      logger.error({ err }, "[passport] Failed to create stamp");
    });
}

/**
 * Reverse geocode lat/lng to city-level location.
 * Returns null if geocoding fails (non-critical — stamps just won't be created).
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<GeocodedLocation | null> {
  try {
    const url = `${NOMINATIM_BASE}?lat=${latitude}&lon=${longitude}&format=json&zoom=10&addressdetails=1`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "DeuceDiary/1.0 (https://deucediary.com)",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      logger.warn({ status: res.status }, "[geocode] Nominatim returned non-OK status");
      return null;
    }

    const data = await res.json();
    const addr = data.address;

    if (!addr) return null;

    const city =
      addr.city ||
      addr.town ||
      addr.village ||
      addr.municipality ||
      addr.hamlet ||
      addr.suburb ||
      null;

    const country = addr.country || null;

    if (!city || !country) return null;

    return {
      city,
      region: addr.state || addr.county || null,
      country,
      countryCode: addr.country_code?.toUpperCase() || null,
    };
  } catch (err) {
    logger.warn({ err: (err as Error).message }, "[geocode] Reverse geocoding failed");
    return null;
  }
}
