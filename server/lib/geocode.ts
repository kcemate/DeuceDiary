/**
 * Reverse geocoding using OpenStreetMap Nominatim (free, no API key).
 * Returns city, region, country, and country code from lat/lng.
 */

export interface GeocodedLocation {
  city: string;
  region: string | null;
  country: string;
  countryCode: string | null;
}

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org/reverse";

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
      console.warn(`[geocode] Nominatim returned ${res.status}`);
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
    console.warn("[geocode] Reverse geocoding failed:", (err as Error).message);
    return null;
  }
}
