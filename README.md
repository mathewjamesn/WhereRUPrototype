# WhereRU Driver — React Native prototype (v2.0, bare React Native)

Clickable prototype of the driver app in plain React Native (no Expo), built from the Design
canvas plus the Phase 1.x decisions. All data is mock data: nothing talks to the server and no
Maps key is needed.

Stack: React Native 0.76.9 (New Architecture) · TypeScript · React Navigation 7 (native stack) ·
react-native-svg · react-native-safe-area-context. Same versions as the TOK Driver app, so screens
can be moved across with little change.

## Run on a phone or emulator

Needs Node 18+, JDK 17 and the Android SDK (Android Studio).

```bash
npm install
npm start            # Metro bundler, keep it running
npm run android      # in a second terminal, with a phone (USB debugging) or emulator attached
```

## Build an installable APK

- **Locally:** `npm run apk` → `android/app/build/outputs/apk/release/app-release.apk`
  (the JS bundle is embedded, no Metro needed). Signed with the debug key, which is fine for
  sideloading a prototype.
- **GitHub Actions:** push to `main` (or run the workflow by hand). Download the
  `WhereRUPrototype-apk` artifact from the run.

Package `com.gmt.whereru.prototype`, so it installs next to the real app.

## Using the prototype

- The launcher offers **Start as a new driver** (language → sign-in → onboarding) and
  **Start as an approved driver** (straight to Home).
- The small dark tab on the right edge of every screen opens the **Prototype** menu: jump to any
  screen, simulate *No internet / Location off / Back online*, or restart.
- Dashed grey buttons are prototype-only shortcuts (approve/reject documents, trigger a ride, etc.).
- OTP: any 5 digits (00000 = wrong code). Ride code: any 4 digits (0000 = wrong code).

## Screens

| Area | Screens |
|---|---|
| Sign up / sign in | Language, Login (state + mobile), OTP (5 digits), Your details, Documents (Photo → Licence no. + photos → Vehicle details → RC), Waiting for approval, Rejected with reviewer comments, Permissions gate |
| Home & account | Home offline / online / no internet / location off, Inbox, Account, Profile, My vehicle, Self check, Settings, Language |
| Ride flow | Incoming request (15 s countdown, destination always shown), Heading to pickup, Chat, Arrived + ride code, On trip (slide to end, offline note), Collect (Cash / UPI), Trip summary + rating |
| Stops | Request with 2 stops, On trip with stops |
| Cancellations | Driver cancels (reason required), Passenger cancelled, Ride taken by another driver |
| Money | Trips, Trip details, Earnings (weekly chart), Wallet (PhonePe pay-off) |

Earnings maths: ₹227 fare − ₹9.09 platform fee − ₹1.64 GST = **₹216.27**.

## Project layout

```
App.tsx         navigation container and the list of screens
src/nav.ts      router.push('/home') style helper over React Navigation
src/screens/    one file per screen
src/ui/         shared components: Screen, Button, Parts, Map, Ride, Trip, Chrome (tab bar, banners)
src/state/      proto.ts (prototype state), ride.ts (sample ride data)
src/theme.ts    design tokens, same values as the TOK Driver app
android/        standard React Native Android project (MainActivity patched for react-native-screens)
```

Malayalam can be selected but screens stay in English here; the TOK Driver build has the full
Malayalam strings. iOS folder is the stock template and has not been set up.
