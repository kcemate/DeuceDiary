# Poop Passport — Iteration Log

## Iteration 1: Schema Changes
- Added `latitude` (numeric, nullable) and `longitude` (numeric, nullable) to `deuceEntries`
- Created `passport_stamps` table: userId, city, region, country, countryCode, latitude, longitude, entryCount, firstVisitAt, lastVisitAt
- Unique constraint on (userId, city, country) to prevent duplicate stamps
- Added Drizzle ORM relations and TypeScript types
- All 440 existing tests pass

## Iteration 2: Migration
- Created `migrations/0004_add_passport_columns_and_stamps.sql`
- Adds columns, creates table, indexes, and foreign key

## Iteration 3: Backend — Deuce Logging with Geocoding
- Added `reverseGeocode()` utility in `server/lib/geocode.ts` using Nominatim (free, no API key)
- Updated `createDeuceSchema` in both `helpers.ts` and `routes.ts` to accept optional `latitude`/`longitude`
- Modified deuce POST handlers in both `routes/deuces.ts` and `routes.ts` to:
  - Pass lat/lng to `createDeuceEntry()`
  - Fire-and-forget async reverse geocode + `upsertPassportStamp()`
- Added storage methods: `upsertPassportStamp`, `getPassportStamps`, `getPassportStats`, `deletePassportStamps`
- All 440 tests pass

## Iteration 4: Backend — Passport Endpoints
- Created `server/routes/passport.ts` with router pattern matching bingo.ts
- `GET /api/passport` — authenticated + premium-gated, returns stamps + stats
- `GET /api/passport/:userId` — public share view with user info
- `DELETE /api/passport` — privacy: delete all location data
- Registered router in `routes.ts`
- All 440 tests pass

## Iteration 5: Frontend — Passport Page
- Installed `leaflet`, `react-leaflet@4`, `@types/leaflet` (v4 for React 18 compat)
- Created `client/src/pages/passport.tsx` with:
  - Interactive Leaflet/OpenStreetMap map with city pins
  - Stats bar (cities, countries, continents)
  - Stamp grid with country flag emojis
  - Empty state messaging
  - PremiumGate wrapper
- Added route in `App.tsx`

## Iteration 6: Navigation + Location Sharing
- Added Passport tab to `BottomNavigation` with globe icon
- Added location sharing toggle to `LogDeuceModal`:
  - Opt-in "Share Location" button
  - Requests browser geolocation on toggle
  - Graceful denial handling
  - Sends lat/lng with deuce creation when enabled
- All 440 tests pass

## Iteration 7: Share Card
- Added share button to passport page
- Uses Web Share API with clipboard fallback
- Generates shareable text with city/country counts

## Iteration 8: Tests
- (Pending from background agent)
