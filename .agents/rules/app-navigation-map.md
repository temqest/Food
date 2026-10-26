# Project Navigation & Continuous AI Map Maintenance Protocol

## 1. Zero-Latency Startup: Read the Map First
At the start of **EVERY** new chat or task, before doing wide searches, running ripgrep, or guessing file locations:
- Read [`APP_NAVIGATION_MAP.md`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/APP_NAVIGATION_MAP.md).
- Use its route table, component directory, context references, and spacing rules as your primary atlas.

## 2. Continuous Map Maintenance (MANDATORY)
Whenever you move, navigate, learn, fix, delete, update, or create anything in this repository:
- You **MUST** update [`APP_NAVIGATION_MAP.md`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/APP_NAVIGATION_MAP.md) before concluding your turn.
- Ensure the route table reflects any added, moved, or changed screens.
- Ensure the component table reflects newly created or refactored components.
- Append a concise entry to the **AI Action & Modification Log** detailing:
  - What was fixed, added, or changed.
  - The root cause and solution.
  - Any architectural or styling gotchas learned for future agents.

## 3. Strict Spacing & Safe Area Policy
- Never import `SafeAreaView` from `'react-native'`. Core React Native's `SafeAreaView` fails on Android and breaks modern edge-to-edge screens.
- Always use `SafeAreaView` from `'react-native-safe-area-context'`.
- Verify `<SafeAreaProvider>` remains at the root in [`src/app/_layout.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/_layout.tsx).
- On tab screens with the floating bottom `NavBar`, specify `edges={['top', 'left', 'right']}` to avoid double-padding the bottom.
- On full-bleed hero screens (like [`TrailHeroBanner.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/trail/TrailHeroBanner.tsx)), clamp dynamic insets against `StatusBar.currentHeight` on Android.
