# App Navigation & Architecture Atlas

> **CRITICAL RULE FOR ALL AI ASSISTANTS**:
> 1. **Read this file FIRST** at the start of any conversation before searching or grepping the codebase. It contains the exact sitemap, component breakdown, context flow, and spacing rules.
> 2. **Update this file ALWAYS** whenever you navigate, investigate, fix, update, create, or delete any component, screen, context, or style. Maintain this single source of truth for all future sessions.

---

## 1. Quick Route & Screen Directory

All app screens use **Expo Router** and are located in [`frontend/src/app/`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app).

| Route URL | File Path | Safe Area / Edges | Description & Key Components |
| :--- | :--- | :--- | :--- |
| `/` or `/index` | [`frontend/src/app/index.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/index.tsx) | `['top', 'left', 'right']` | **Home Screen**: Mascot hero, streak button, Naga Quest infinite carousel ([`NagaQuestCarousel.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/home/NagaQuestCarousel.tsx)), Craving Dial ([`CravingDialWidget.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/home/CravingDialWidget.tsx)), Food showcase box, floating [`NavBar`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/common/NavBar.tsx). |
| `/explore` | [`frontend/src/app/explore.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/explore.tsx) | `['top', 'left', 'right']` | **Flavor Codex**: Bicolano culinary encyclopedia, search bar ([`CodexHeroHeader.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/codex/CodexHeroHeader.tsx)), category filter strip, dish cards ([`DishCodexCard.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/codex/DishCodexCard.tsx)), deep lore sheet ([`DishDossierModal.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/codex/DishDossierModal.tsx)). |
| `/trail/[id]` | [`frontend/src/app/trail/[id].tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/trail/%5Bid%5D.tsx) | Full-bleed with clamped `insets.top` | **Expedition Food Trail**: Full-bleed hero ([`TrailHeroBanner.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/trail/TrailHeroBanner.tsx)), progress HUD ([`TrailProgressBar.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/trail/TrailProgressBar.tsx)), winding Bezier S-curve road ([`TrailSteppingBridge.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/trail/TrailSteppingBridge.tsx)), food stops ([`TrailStopStation.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/trail/TrailStopStation.tsx)), finish crest ([`TrailFinishCrest.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/trail/TrailFinishCrest.tsx)). |
| `/map` | [`frontend/src/app/map.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/map.tsx) | `['top', 'left', 'right']` | **Interactive Map**: Viewport-anchored Mapbox GL map ([`MapboxMapView.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/map/MapboxMapView.tsx)), bespoke vector SVG category pins (noodles, pot, bread, dining, gifts, stalls), floating location badge with live spot counter, quick `Open Now` toggle, horizontal category filter pills, interactive horizontal spot carousel ([`MapSpotCarousel.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/map/MapSpotCarousel.tsx)) with signature dishes, prices, menu routes, and directions. |
| `/food/[id]` | [`frontend/src/app/food/[id].tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/food/%5Bid%5D.tsx) | Full-bleed with clamped `insets.top` & sticky bottom bar | **Food Detail & Lore Screen**: Full-bleed hero with SVG gradient scrim, floating glass navigation & bookmark pills, Sili heat meter (1–5 flames), Flavor Anatomy taste chips, Nagueño Dining Ritual card with dialect quote, Lore & Cultural Roots card, rich eatery discovery cards with direct map navigation, and sticky bottom action bar (Stamp Passport +60 XP, Dine-In Pass, Map shortcut). |
| `/establishment/[id]` | [`frontend/src/app/establishment/[id].tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/establishment/%5Bid%5D.tsx) | Full-bleed with clamped `insets.top` & sticky bottom bar | **Store / Establishment Info Screen**: Full-bleed hero with SVG gradient scrim, floating frosted glass controls (back, live open/closed pill, bookmark), venue stats strip (Budget, Hours, Distance), atmosphere & vibe pills, rich menu cards with food photos, signature badges & one-tap order, photo gallery preview, contact & phone linking, and sticky bottom action bar (Call, Passes, Locate on Map). |
| `/feed` | [`frontend/src/app/feed.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/feed.tsx) | `['top', 'left', 'right']` | **Naga Community Social Feed**: Street food trips, eatery dispatches, live Naga Moments stories ([`NagaMomentsBar.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/feed/NagaMomentsBar.tsx)), filterable post cards ([`SocialFeedCard.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/feed/SocialFeedCard.tsx)), post composer ([`CreatePostModal.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/feed/CreatePostModal.tsx)), comments sheet ([`CommentsBottomSheet.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/feed/CommentsBottomSheet.tsx)). |
| `/basket` | [`frontend/src/app/basket.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/basket.tsx) | `['top', 'left', 'right']` | **Food Basket & Pre-Orders Hub**: Dual-tab hub for Cart & Checkout (steppers, store grouping, dining option selector, special kitchen notes, bill breakdown, and Proceed to Payment CTA) and Active Passes (digital QR voucher pass, payment badges, 4-stage live kitchen status tracker, counter call/map actions, demo status simulation). |
| `/streak` | [`frontend/src/app/streak.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/streak.tsx) | `['top', 'left', 'right']` | **Duolingo-Inspired Streak & Trophy Hub**: Hero flame counter with countdown timer, 7-day habit consistency calendar, Sili Shield (streak freeze) indicator, Level & XP progress HUD, 5-tier streak trophies showcase (Bronze, Silver, Gold, Diamond, Centennial), mealtime reminder nudges (Lunch, Merienda, Night Crawl), and 1-tap check-in action. |
| `/notifications` | [`frontend/src/app/notifications.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/notifications.tsx) | `['top', 'left', 'right']` | **Notifications Hub**: Central notification center for pre-order pickup alerts, daily taste pulse streak reminders, trophy unlock celebrations, community likes & comments, and local flavor drops. Interactive category filters (All, Orders, Streaks, Trophies, Social, Specials), unread badges, mark-all-as-read, item dismissal, and deep link navigation. |
| `/friends` | [`frontend/src/app/friends.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/friends.tsx) | `['top', 'left', 'right']` | **Foodie Friends & Weekly Taste League Hub**: Dual-tab hub for Weekly Taste League (División de Oro, promotion/relegation zones, ranked foodies with XP/dishes, current user elevation) and Squad Streaks (active friend streaks, 1-tap "Tara Kain!" mealtime nudges, friend recent tasting dispatches, and Add Friend / Foodie Invite modal). |
| `/payment` | [`frontend/src/app/payment.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/payment.tsx) | `['top', 'left', 'right', 'bottom']` | **Payment & Checkout**: Supports Cash on Arrival (pay at store counter), GCash E-Wallet with mobile number validation, and Maya / BSP QR Ph Universal National QR scan with receipt references; customer pass contact details; itemized summary. |
| `/saved` | [`frontend/src/app/saved.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/saved.tsx) | `['top', 'left', 'right']` | **Saved Favorites (Preserved)**: Tabbed lists of bookmarked dishes and eateries with quick removal and clear-all actions; accessible via Profile screen Activity section. |
| `/search` | [`frontend/src/app/search.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/search.tsx) | `['top', 'left', 'right']` | **Search Screen**: Live filter by dish, ingredient, district, or open status; category tags; empty state suggestions. |
| `/profile` | [`frontend/src/app/profile.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/profile.tsx) | `['top', 'left', 'right']` | **Profile & Settings**: User preferences, spice tolerance setting, favorite district, security settings, business portal switch. |
| `/business` | [`frontend/src/app/business.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/business.tsx) | `['top', 'left', 'right']` | **Merchant Portal**: Dashboard for restaurant owners to update menu items, toggle open/closed status, manage pre-orders, and create promotions. |
| `/welcome` | [`frontend/src/app/welcome.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/welcome.tsx) | `['top', 'bottom', 'left', 'right']` | **Splash / Onboarding Entry**: High-impact editorial headline, 3-row moving pill marquee, "Get Started" and "Sign In" buttons. |
| `/login` | [`frontend/src/app/login.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/login.tsx) | `['top', 'bottom', 'left', 'right']` | **Login Screen**: Email/password form, quick demo sign-in shortcuts, password recovery link. |
| `/signup` | [`frontend/src/app/signup.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/signup.tsx) | `['top', 'bottom', 'left', 'right']` | **Registration**: New user account registration form with instant login transition. |
| `/onboarding` | [`frontend/src/app/onboarding.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/onboarding.tsx) | `['top', 'bottom', 'left', 'right']` | **Onboarding Wizard**: 3-step preference setup (spice tolerance, target district, avatar), saves to [`AuthContext`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/context/AuthContext.tsx). |
| `/forgot-password` | [`frontend/src/app/forgot-password.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/forgot-password.tsx) | `['top', 'bottom', 'left', 'right']` | **Password Reset**: Multi-step verification code flow with simulated SMS/email reset. |

---

## 2. Core Layout & Spacing Rules

### Safe Area Architecture (CRITICAL)
- **Root Provider**: [`frontend/src/app/_layout.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/_layout.tsx) **MUST** wrap the entire component tree in `<SafeAreaProvider>` from `react-native-safe-area-context`.
- **Never Import from `'react-native'`**: React Native's built-in `SafeAreaView` does not support Android and causes elements to overlap the top status bar / battery percentage / camera cutout.
  - ✅ **DO**: `import { SafeAreaView } from 'react-native-safe-area-context';`
  - ❌ **NEVER**: `import { SafeAreaView } from 'react-native';`
- **Edges Strategy**:
  - **Tab Screens with Floating `NavBar`** (`/`, `/explore`, `/map`, `/saved`, `/basket`, `/profile`, `/search`, `/business`):
    - Use `<SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>`
    - Prevents double-padding at the bottom where the floating [`NavBar`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/common/NavBar.tsx) or sticky CTA already manages its elevation.
  - **Auth & Onboarding Screens** (`/welcome`, `/login`, `/signup`, `/onboarding`, `/forgot-password`):
    - Use `<SafeAreaView style={styles.screen} edges={['top', 'bottom', 'left', 'right']}>`
    - Keeps bottom action buttons comfortably above the home indicator / navigation bar.
  - **Full-Bleed Hero Screens** (`/trail/[id]`, `/food/[id]`, `/establishment/[id]`):
    - Extends hero artwork all the way to $y=0$ behind the translucent status bar.
    - Floating action rows (back buttons, category pills, glass controls) must pad down dynamically using:
      ```tsx
      const insets = useSafeAreaInsets();
      const topInset = Math.max(
        insets.top,
        Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 20
      );
      ```

---

## 3. Global State & Data Flow Directory

| Context / Store | File Path | Responsibilities |
| :--- | :--- | :--- |
| `AuthContext` | [`frontend/src/context/AuthContext.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/context/AuthContext.tsx) | Current user session, demo accounts, avatar, spice level, district preferences. |
| `SavedContext` | [`frontend/src/context/SavedContext.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/context/SavedContext.tsx) | Bookmarked dishes & eateries, toggle saved status, clear-all helpers. |
| `QuestContext` | [`frontend/src/context/QuestContext.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/context/QuestContext.tsx) | Tasting log, gamification XP, level calculation, passport stamp collection. |
| `BasketContext` | [`frontend/src/context/BasketContext.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/context/BasketContext.tsx) | Pre-orders, quantity management, scheduled pickup time, active vouchers. |
| `BusinessContext` | [`frontend/src/context/BusinessContext.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/context/BusinessContext.tsx) | Restaurant owner menu management, live order queue, open/closed toggle. |
| `NotificationContext` | [`frontend/src/context/NotificationContext.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/context/NotificationContext.tsx) | In-app notification state, dynamic unread badge count, mark as read, delete, and clear-all actions. |
| `FriendsContext` | [`frontend/src/context/FriendsContext.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/context/FriendsContext.tsx) | Foodie friends list, live weekly leaderboard calculation, "Tara Kain!" mealtime habit nudges, follow/unfollow, and handle search. |
| `FriendsData` | [`frontend/src/data/friendsData.ts`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/data/friendsData.ts) | FoodieProfile and LeagueDivision types with seed Naga City foodies and Gold Division config. |
| `SocialFeedContext` | [`frontend/src/context/SocialFeedContext.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/context/SocialFeedContext.tsx) | Community social feed state: posts, stories, likes, bookmarks, comments, filter category, post creation. |
| `SocialFeedData` | [`frontend/src/data/socialFeedData.ts`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/data/socialFeedData.ts) | Typed models (`SocialPost`, `PostAuthor`, `SocialComment`, `NagaMomentStory`) and rich initial Naga food crawl posts & moments. |
| `DiceBear Avatars` | [`frontend/src/utils/dicebearAvatar.ts`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/utils/dicebearAvatar.ts) | Generates `@dicebear/core` + `@dicebear/styles/adventurer-neutral.json` with `with { type: 'json' }` avatars with random/seeded background colors, inlining `<use>` references for native compatibility. |
| Mock Data | [`frontend/src/data/mockData.ts`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/data/mockData.ts) | Canonical dishes (`FOOD_ITEMS`), eateries (`ESTABLISHMENTS`), categories. |
| Gamification Data | [`frontend/src/data/gamification.ts`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/data/gamification.ts) | Curated food trails (`FOOD_TRAILS`), badge definitions, insider tips. |

---

## 4. Component Quick Reference

| Directory | Key Components | Purpose |
| :--- | :--- | :--- |
| `components/feed/` | `FeedHeader`, `NagaMomentsBar`, `StoryViewerModal`, `FeedFilterStrip`, `SocialFeedCard`, `CommentsBottomSheet`, `CreatePostModal` | Full social media discovery feed with stories, double-tap like cards, dish tag overlays, comment threads, and trip composer. |
| `components/trail/` | `TrailHeroBanner`, `TrailProgressBar`, `TrailSteppingBridge`, `TrailStopStation`, `TrailFinishCrest`, `TrailStopDetailsSheet` | Winding road journey map, gamified crawl stops, and milestone crest. |
| `components/codex/` | `CodexHeroHeader`, `CodexFilterBar`, `DishCodexCard`, `DishDossierModal` | Clean culinary encyclopedia cards, category filters, and deep lore bottom sheet. |
| `components/home/` | `MascotHero`, `NagaQuestCarousel`, `CravingDialWidget`, `FoodShowcaseBox` | Dynamic greetings, streak flame button, banner carousel, and interactive flavor dial. |
| `components/common/` | `NavBar`, `SearchInput`, `RecommendationModal`, `UserAvatar` | Floating bottom navigation pill: Home (`/`), Map (`/map`), Search elevated center button (`/search`), Feed (`/feed`), Basket (`/basket` with dynamic badge count), search inputs, modal sheets, and universal native Android/iOS `SvgXml` avatar renderer. |
| `components/map/` | `MapboxMapView`, `MapSpotCarousel`, `NagaMapCanvas` | Mapbox GL mobile/web interactive map with vector SVG category pins, glowing selection pulse, floating controls, and interactive horizontal food spot carousel. |
| `components/gamification/` | `PassportStampModal`, `SilitoMysteryBox` | Tasting journal stamps, celebratory unboxing animations. |

---

## 5. AI Action & Modification Log

*Every AI session must append its actions here:*

### [2026-10-26] - Naga Interactive Map Overhaul: Vector SVG Pins, Expanded Filters & High-Utility Spot Carousel (`/map`)
- **User Request**: "can u improve the map page, w/ its design and functionaltiy as right now the map has poor icons, choices, the bottom part its not that very usseful so redesign and improve the map page to have better ui/ux, design, functionality w/out overwhelming the page /learn /plan"
- **Issues Identified**:
  1. Map markers used low-resolution platform emojis (`🥟`, `🍜`, `🎁`, etc.) inside generic circular bubbles.
  2. Category choices were limited to 3 types with emoji labels and lacked crucial categories (`carinderia`, `pasalubong-center`, `street-stall`) and an `Open Now` filter.
  3. Bottom sheet was a static single-spot card that completely hid dishes, signature offerings, prices, and direct navigation actions.
  4. Outer `ScrollView` wrapper caused severe gesture conflicts when users attempted to pan or zoom the map.
- **Architectural & Design Upgrades Applied**:
  1. **Bespoke Vector SVG Map Pins**:
     - Upgraded [`MapboxMapView.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/map/MapboxMapView.tsx) to render crisp vector SVG icon paths customized by category:
       - `kinalas-station`: Terracotta Crimson `#D42F13` with steaming noodle bowl SVG.
       - `carinderia`: Forest Amber `#2E7D32` with cooking pot SVG.
       - `bakery`: Golden Wheat `#D97706` with bakery bread SVG.
       - `restaurant`: Warm Ember `#C05621` with dining fork & knife SVG.
       - `pasalubong-center`: Royal Violet `#7C3AED` with gift ribbon SVG.
       - `street-stall`: Coastal Teal `#0284C7` with market awning SVG.
     - Elevated teardrop pointer pin with 2.5px white border, soft drop shadow, animated glowing pulse ring on selection, and clean label chips.
  2. **High-Utility Horizontal Spot Carousel**:
     - Built [`MapSpotCarousel.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/map/MapSpotCarousel.tsx) floating above the floating `NavBar`.
     - Displays 76×76px food/venue thumbnail with live `Open` / `Closed` badge dot.
     - Venue name, distance in km/m, and neighborhood.
     - Prominent signature dish highlight pill with price (e.g., `🍜 Kinalas Special (with Egg) · ₱85`) with terracotta background `#FFF2EE`.
     - Direct actions: Primary `View Menu & Order` routing to `/establishment/[id]`, 1-tap `Directions` launching native maps, and bookmark toggle synced with `SavedContext`.
     - Bi-directional sync: Tapping a pin scrolls the carousel to the card; swiping the carousel flies the map camera to that venue.
  3. **Expanded Filters & Gesture Harmony (`/map.tsx`)**:
     - Converted `/map` into a viewport-anchored interactive layout, removing the outer `ScrollView` so map panning and zooming are 100% fluid.
     - Floating frosted top bar with Naga City location badge, live spots count, and instant `🟢 Open Now` toggle.
     - Horizontal category filter pills (`All Spots`, `Kinalas`, `Carinderia`, `Heritage Dining`, `Bakeries`, `Pasalubong`, `Street Stalls`).
     - Empty state with 1-tap "Reset Filters" action when no places match active filters.
  4. **Recenter Control Refinement & High Elevation**:
     - Positioned the recenter FAB cleanly and comfortably above the restaurant cards at `bottom: Platform.OS === 'ios' ? 312 : 304` (~60px of clear breathing space above the card carousel).
     - Streamlined the recenter button into a permanent, sleek 44×44 circular FAB (`Ionicons` `locate`, size 20) with 1-tap smooth camera reset to downtown Naga City (`flyTo` duration 500ms).
     - Removed dynamic panned-away distance calculation, banner pills, and unneeded event churn to maximize UI simplicity and responsiveness.
  5. **Map Performance & 60fps Optimization**:
     - Memoized `SpotCard` in [`MapSpotCarousel.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/map/MapSpotCarousel.tsx) with `React.memo` and tuned `FlatList` windowing (`initialNumToRender={3}`, `maxToRenderPerBatch={3}`, `windowSize={5}`) to eliminate VirtualizedList lag warnings.
     - Removed GPU-heavy `backdrop-filter: blur(8px)` on Mapbox marker DOM labels, switching to GPU-optimized solid translucent badges (`rgba(18, 18, 18, 0.94)`) with `will-change: transform; contain: layout style;`.
     - Restored native 60fps inertial panning (`map.dragPan.enable()`) and stabilized message bridge callbacks with refs.


### [2026-10-26] - Foodie Friends & Weekly Taste League Hub (`/friends`) & Topbar Integration
- **User Request**: "in my home page topbar, there is this icon of two people, right now it just direct to the map as a placeholder. what is a good page for me to add there?" -> Chose Option 1 (Foodie Friends & Leaderboard Hub) + executed /plan.
- **Architectural & Design Upgrades Applied**:
  1. **Home Topbar Route Overhaul**:
     - In [`MascotHero.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/home/MascotHero.tsx), replaced placeholder `/map` navigation on `people-outline` with `/friends` and updated accessibility label to `"Foodie friends and league leaderboard"`.
  2. **Data & State Management**:
     - Created [`friendsData.ts`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/data/friendsData.ts) with typed models (`FoodieProfile`, `LeagueDivision`, `RecentTastingSnippet`) and seeded realistic Naga City foodies (Maria Santos, Paolo Reyes, Tricia Dee, Carlo Mendoza, etc.) with DiceBear avatars.
     - Created [`FriendsContext.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/context/FriendsContext.tsx) merging user's live XP, streak count, and level from [`QuestContext`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/context/QuestContext.tsx) into a dynamically ranked leaderboard.
     - Integrated `nudgeFriend(id)` action with optimistic UI update and toast alerts.
     - Registered `<FriendsProvider>` in [`_layout.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/_layout.tsx) with `<Stack.Screen name="friends" />`.
  3. **High-Utility & Clean Screen (`/friends.tsx`)**:
     - Strict safe area compliance (`SafeAreaView` with `edges={['top', 'left', 'right']}`).
     - Segmented control pills: `🏆 Weekly League` and `👥 Friends & Squad`.
     - **Tab 1 (Weekly League)**: Gold Division banner (`División de Oro`), countdown reset pill (`Resets in 2d 14h`), and 3 spacious dedicated zone cards (`Top 3 Advance`, `Ranks 4-6 Safe Zone`, `Bottom 2 Relegate`) replacing crammed horizontal inline text with generous padding, tinted status badges, and vertical hierarchy; user standing callout (`#X Your Standing`), and ranked cards with podium badges (#1 Trophy, #2 Medal, #3 Ribbon), DiceBear avatars, rank titles, and elevated `YOU` badge.
     - **Tab 2 (Friends & Streaks)**: Group summary strip, habit cards displaying active streak flames, recent dish tasting dispatches with establishment/time/XP, and 1-tap `Tara Kain! 🔥` / `Nudged 👍` habit buttons.
     - **Add Friend Modal**: Search by handle (`@handle`), copy personal foodie link, and 1-tap follow/add.
     - Compact feedback toasts for nudges and friend additions.

### [2026-10-26] - Basket Checkout Streamlining (Removed Estimated Pickup Time)
- **User Request**: "can u in the basket page remove the estimated pickup time part in that page"
- **Architectural & Design Upgrades Applied**:
  - Removed the `Estimated Pickup Time` header and slot pill chips (`PICKUP_TIME_SLOTS`) from [`basket.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/basket.tsx).
  - Streamlined the checkout stack so the Dining Option selector (`Dine-In Pass` vs `Takeout Box`) transitions directly into Kitchen Instructions and Payment Summary.
  - Purged unused styles (`slotPillRow`, `slotPill`, `slotPillActive`, `slotPillText`, `slotPillTextActive`) and destructuring.

### [2026-10-26] - Dedicated Notifications Hub (`/notifications`) & Home Topbar Integration
- **User Request**: "in home page create a notification page and connect it w/ the notif in my home page topbar" & "remove the sparkle icon usage and emoji"
- **Architectural & Design Upgrades Applied**:
  1. **Notification State Management**:
     - Created [`NotificationContext.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/context/NotificationContext.tsx) to manage in-app notifications, unread counts, mark-as-read, delete, and clear-all actions.
     - Seeded initial realistic Naga food app notifications across 5 categories (Orders, Streaks, Trophies, Social, Specials) with clean typography, no emojis, and professional icon mapping (`pricetag` for Specials).
     - Wrapped `<NotificationProvider>` in [`_layout.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/_layout.tsx).
  2. **Home Topbar Integration**:
     - In [`MascotHero.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/home/MascotHero.tsx), re-routed the notification bell button from `/search` to `/notifications`.
     - Added dynamic red unread counter badge (`unreadCount`) directly on the bell icon with `9+` overflow cap and accessible label.
  3. **Dedicated Notifications Screen (`/notifications`)**:
     - Built [`notifications.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/notifications.tsx) following safe area standards (`SafeAreaView` with `edges={['top', 'left', 'right']}`).
     - Header includes back button, dynamic new notifications count badge, and 1-tap "Read All" checkmark action.
     - Horizontal category filter bar (`All`, `Orders`, `Streaks`, `Trophies`, `Social`, `Specials`) with dynamic badge counts.
     - Tactile notification cards with colored category icons, unread indicator dots, blue left-border accents, relative timestamps, and one-tap deep links (`/basket`, `/streak`, `/feed`, `/food/toasted-siopao`).
     - Empty state with friendly illustration and shortcut to Explore Codex when all notifications are cleared.

### [2026-10-26] - Duolingo-Inspired Streak, Level & Trophy Hub (`/streak`) - Compact Redesign & Polish
- **User Request**:
  1. Fix the `5d active` banner on this week consistency overextending to the right.
  2. The page tries to do too much and is way too long; streamline and focus on core habit value ("remember the rule don't add everything").
- **Architectural & Design Upgrades Applied**:
  1. **Fixed Active Banner Overextension**:
     - Removed fixed `maxWidth: 240` from `sectionSubtitle` / title row.
     - Added `flex: 1` and `marginRight: 8` to `calendarTitleCol` and `flexShrink: 0` to `calendarFlameBadge` so the active badge stays strictly bounded within the card padding on all phone viewports.
  2. **Streamlined, Single-Viewport Layout**:
     - **Unified Hero + Habit Calendar + 1-Tap CTA**: Merged the separate hero card, calendar card, and action card into ONE cohesive, compact Duolingo card. The check-in action sits directly under the 7-day bubbles.
     - **Compact Level HUD**: Replaced bulky paragraphs with a single-row level badge, XP progress bar, and next rank milestone.
     - **Horizontal Trophies Scroll Strip**: Transformed the tall 2-column grid into a horizontal swipe strip of 115px cards, cutting ~200px of vertical height.
     - **Single-Row Reminder Chips**: Replaced 4 large vertical cards with a sleek, 1-row segmented chip strip (`☀️ Lunch`, `☕ Merienda`, `🌙 Dinner`, `🔕 Off`).
     - **Removed Redundant Missions**: Purged duplicate quest cards to keep the screen distraction-free and habit-focused.

### [2026-10-26] - High-Utility Food Basket & Pre-Orders Hub + Bottom Nav Integration
- **User Request**: "currently my saved favorites should i keep it or rpelace it w/ something more useful like basket? /plan"
- **Architectural & Design Upgrades Applied**:
  1. **Bottom Navigation Re-alignment**:
     - Swapped the 5th tab in [`NavBar.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/common/NavBar.tsx) from `saved` to `basket` with dynamic item count badge (`badgeCount = basketCount`), giving users persistent 1-tap thumb access to their cart.
     - Preserved [`saved.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/saved.tsx) and added a dedicated "Activity & Collections" section in [`profile.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/profile.tsx) for 1-tap access to bookmarked dishes and eateries.
  2. **High-Utility Basket Screen (`/basket`)**:
     - **Dual-Tab Segmented Architecture**: Cart (`basketCount`) and Active Passes (`activePreOrders.length`).
     - **Tab 1 (Cart & Checkout)**:
       - Partner carinderia header with address and direct store menu link.
       - Strictly bounded dish cards with 68×68px rounded photography, dish title, price, and custom cooking note chips (`“Extra spicy, broth on side”`) with an interactive note edit modal.
       - Haptic quantity steppers (`[-]` `[ QTY ]` `[+]`) with auto-delete trash can icon on $1$.
       - Dining option selector: **Dine-In Pass** (reserve table & skip counter wait) vs **Takeout Box** (packed hot for pickup).
       - Pickup schedule chips (`ASAP 15–20m`, `30m`, `45m`, `1h`).
       - Custom kitchen instructions input box for carinderia cooks.
       - Itemized bill breakdown with free reservation fee promo and counter payment notice (Cash, GCash, Maya).
       - High-contrast sticky CTA: `Confirm Pre-Order (₱XXX)`.
     - **Tab 2 (Active Passes & Live Order Tracker)**:
       - Real-time digital pass ticket cards with perforated tear notches and QR voucher mockup for counter scanning.
       - 4-Stage visual kitchen tracker (`Received` -> `Cooking` -> `Ready` -> `Served`) with real-time ETA banners.
       - Interactive demo advance simulator (`advanceOrderStatusDemo`) to test kitchen status transitions live.
       - Counter call (`tel:` linking), directions (`/map`), and order cancellation triggers.
  3. **BasketContext Enhancements**:
     - Added `diningOption: 'dine_in' | 'takeout'` and `setDiningOption`.
     - Added `updateItemNote(id, note)` for per-dish customization.
     - Added `advanceOrderStatusDemo(orderId)` for status lifecycle simulation.

### [2026-10-26] - Store Info Page Polish: Banner & Logo Slot, Bounded Dish Cards, Removed Tags
- **User Request**:
  1. the food picture and dishes offer here parts, are over extending like all the way down so improper sizing
  2. food store should have a place for their banner and also their logo
  3. remove the tagsd of the resturant like casual dining, and etc
- **Fixes Applied**:
  1. **Fixed Dish Card & Food Thumbnail Sizing**:
     - Replaced unbounded flex stretch (`height: '100%'`) with explicit fixed dimensions (`dishThumbnailContainer`: `width: 84, height: 84, borderRadius: 12, overflow: 'hidden'`).
     - Added `alignItems: 'center'` and `padding: 12` to `dishCard` so dish cards are strictly bounded (~108px total height) with proportional typography and zero downward over-extension.
  2. **Dedicated Store Banner & Logo**:
     - Added wide store cover banner (`bannerWrapper`: 250px height) at the top.
     - Added prominent store logo badge (`storeLogo`: 80×80px with 3.5px white border, soft elevation, and `marginTop: -42` overlapping the banner) with a green verified checkmark.
     - Added `logo?: string` to [`types.ts`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/data/types.ts) and populated curated logos across all mock venues in [`mockData.ts`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/data/mockData.ts).
  3. **Removed Restaurant Tags**:
     - Completely removed all venue atmosphere tags (`atmosphereTags`, `categoryPill`, casual dining, etc.).
     - Replaced with clean title block, neighborhood distance, and an inline live Open/Closed pill badge.

### [2026-10-26] - Store / Establishment Info Page Redesign (`/establishment/[id]`)
- **User Request**: "apply the same learning and fix to the store info page too".
- **Architectural & Aesthetic Upgrades Applied**:
  1. **Full-Bleed Venue Hero Banner**: Edge-to-edge photography with SVG LinearGradient scrimming, floating frosted glass controls (`glassIconButton` for back and bookmark, `glassStatusBadge` for live open/closed status), and safe area clamped status bar inset.
  2. **Venue Stats Strip**: Quick-glance metrics row showing price budget level (`₱ Budget`), operating hours (`Opens Daily`), and distance from Centro Naga.
  3. **Atmosphere & Vibe Badges**: Displays curated tags (`establishment.atmosphereTags`) such as `Casual Dining`, `Bicolano Classics`, `Heritage Recipe`, and `Air-Conditioned`.
  4. **Rich Menu Cards with Food Photos**: Paired dishes offered with corresponding high-resolution photography from `FOOD_ITEMS`, signature offering badges (`★ SIGNATURE`), serving notes, price tags, and interactive one-tap "Order / Added" basket buttons.
  5. **Horizontal Photo Gallery Preview**: Horizontal scroll strip rendering venue and atmosphere preview photography (`establishment.galleryImages`).
  6. **Store Details & Direct Calling**: Address with copy feedback, daily operating hours, and tap-to-call direct phone linking (`Linking.openURL('tel:...')`).
  7. **Pinned Frosted Bottom Action Bar**: Floating thumb-reach bar with quick phone dialer, active pre-order passes counter, and primary "Locate on Naga Map" CTA routing to `/map?selectedPlaceId=...`.

### [2026-10-26] - Food Detail Page Redesign (`/food/[id]`)
- **User Request**: Redesign the food info page to look better and modern instead of plain and boring, researching what makes a great food info page before redesigning.
- **Architectural & Aesthetic Upgrades Applied**:
  1. **Full-Bleed Hero Banner**: Upgraded from a small 220px boxed image into a 380px edge-to-edge photography experience with dark SVG gradient scrimming, floating glass controls (`glassIconButton`), and translucent status bar.
  2. **Sensory Quick-Glance Bar**: Visualized Sili heat meter with 5 flame tokens (Mild, Authentic Kick, Fiery Labuyo), typical price indicator, and serving spots count.
  3. **Nagueño Dining Ritual Card**: High-warmth editorial card highlighting insider eating techniques, Bikol dialect ordering lingo in a dedicated quote box, and historical origin trivia.
  4. **The Flavor Anatomy Strip**: Interactive taste chips pairing sensory icons (leaf for gata, flame for sili, drop for calamansi) with highlighted primary notes.
  5. **Rich Establishment Cards**: Replaced basic 48px settings rows with rich eatery discovery cards featuring venue photography, signature dish price, neighborhood badge, distance, live open/closed status, and direct one-tap map shortcut.
  6. **Frosted Sticky Bottom Action Bar**: Pinned thumb-reach bar with "Stamp Passport (+60 XP)", "Pass" reserve shortcut, and map viewer.

### [2026-10-26] - Search Disabled AutoFocus & Added Favorites Tab
- **User Request**:
  1. Remove pre-defined auto-search trigger so opening Search doesn't immediately pop up the keyboard.
  2. Add a new tab for Favorites so users can easily see/search places and foods they liked.
- **Changes Applied**:
  - [`search.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/search.tsx):
    - Set `autoFocus={false}` on `SearchInput` to prevent unwanted automatic keyboard popup on navigation.
    - Integrated [`SavedContext`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/context/SavedContext.tsx) to query liked dishes (`savedFoods`) and places (`savedEstablishments`).
    - Added a third "Favorites" tab to the segmented control with dynamic counters and search query filtering.
    - Added stacked "Favorite Dishes" and "Favorite Places" lists with dedicated empty states.

### [2026-10-26] - Search Screen Header & Surprise Pill Polish
- **User Request**:
  1. Remove the back button on top its not needed.
  2. The try something new its a bit too tall, as the icon and the text is on two rows, make it shorter and more compact, w/out losing meaning.
- **Changes Applied**:
  - [`search.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/search.tsx):
    - Removed redundant `topBar` back arrow button since Search is now a primary bottom navigation tab.
    - Fixed vertical stacking bug in filter pills by adding `flexDirection: 'row'` and `alignItems: 'center'` to `categoryFilter`.
    - Shortened surprise recommendation pill to a single compact row: `🎲 Try New` with `paddingHorizontal: 12`, matching standard pill height without losing meaning.

### [2026-10-26] - NavBar Reconfiguration (Map to Tab 2, Search to Center, Codex Unlinked)
- **User Request**: 
  1. Replace current Codex place with the Map.
  2. Map's center place becomes a Search icon for the Search screen.
  3. Don't delete Codex, just unlink it.
- **Changes Applied**:
  - [`NavBar.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/common/NavBar.tsx):
    - Position 2: Replaced `explore` (Flavor Codex) with `map` (`label: 'Map'`, `route: '/map'`, `activeIcon: 'map'`, `inactiveIcon: 'map-outline'`).
    - Position 3 (Center elevated button): Replaced `map` with `search` (`label: 'Search'`, `route: '/search'`, `activeIcon: 'search'`, `inactiveIcon: 'search-outline'`, `isCenter: true`).
    - Unlinked Flavor Codex (`/explore`) from the navbar while leaving all codex screens, cards, modals, and lore sheets untouched.
  - [`search.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/search.tsx): Passed `currentTab="search"` to `<NavBar />`.


### [2026-10-26] - DiceBear Adventurer Neutral Avatars & Native Android SvgXml
- **User Request**: "use this isntead: import { Style, Avatar } from '@dicebear/core'; import definition from '@dicebear/styles/adventurer-neutral.json' with { type: 'json' }; const style = new Style(definition); const avatar = new Avatar(style, { ...options }); const svg = avatar.toString();"
- **Issues Fixed**:
  1. **Switched Style Definition**: Migrated [`dicebearAvatar.ts`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/utils/dicebearAvatar.ts) to `@dicebear/styles/adventurer-neutral.json` with Stage-3 JSON import attributes (`with { type: 'json' }`), verified 100% clean TypeScript build with `tsc --noEmit`.
  2. **Android Blank/White Avatar Fix**:
     - React Native core `<Image>` uses Fresco on Android, which does not render SVG data URIs (`data:image/svg+xml;...`).
     - Created [`UserAvatar.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/common/UserAvatar.tsx) which uses `<SvgXml xml={svgXml} width={width} height={height} />` from `react-native-svg` (compiling directly to native Android Canvas/Path operations).
     - Implemented `cleanDiceBearSvg()` in [`dicebearAvatar.ts`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/utils/dicebearAvatar.ts) to inline all `<use>` tags from `<defs>` into flat `<g transform="...">` groups, eliminating Android `<use>` parsing bugs.
  3. **Universal Usage**:
     - Updated [`SocialFeedCard.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/feed/SocialFeedCard.tsx), [`NagaMomentsBar.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/feed/NagaMomentsBar.tsx), [`CommentsBottomSheet.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/feed/CommentsBottomSheet.tsx), [`StoryViewerModal.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/feed/StoryViewerModal.tsx), and [`profile.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/profile.tsx) to use `<UserAvatar />`. All avatars now display crisply on Android, iOS, and Web.

### [2026-10-26] - DiceBear Lorelei Neutral Avatars for People
- **User Request**: "replace the icons for people to this: npm install @dicebear/core @dicebear/styles --save, then create this avatar using Style and Avatar from @dicebear/core and definition from @dicebear/styles/lorelei-neutral.json with random background color"
- **Implementation**:
  1. **Dependencies**: Installed `@dicebear/core` and `@dicebear/styles`.
  2. **Avatar Generator Utility** ([`dicebearAvatar.ts`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/utils/dicebearAvatar.ts)):
     - Instantiates `new Style(loreleiNeutralDefinition)` with `new Avatar(style, { seed, backgroundColor: [chosenBg] })`.
     - Supports both `getDiceBearAvatar(seed, bgColor)` returning optimized SVG data URIs (`avatar.toDataUri()`) and `getDiceBearAvatarSvg(seed, bgColor)` returning raw SVG strings (`avatar.toString()`).
     - Includes a curated palette of vibrant, pastel background colors (`b6e3f4`, `c0aede`, `d1d4f9`, `ffd5dc`, `ffdfbf`, `d5e8d4`, `ffe6cc`, `e1d5e7`) deterministically or randomly mapped to each user seed.
  3. **Wired Across App**:
     - [`socialFeedData.ts`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/data/socialFeedData.ts): All human story and post authors (`Bikolano Nomad`, `Maria Santos`, `Paolo Reyes`, etc.) and comment authors (`Ramon Velasco`, `Tricia Dee`, `Mark Alcantara`, `Gemma Cruz`, `Carlo Mendoza`) now display personalized Lorelei Neutral avatars.
     - [`AuthContext.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/context/AuthContext.tsx): `DEFAULT_USER` and new signups automatically generate and use Lorelei Neutral avatars.
     - [`SocialFeedContext.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/context/SocialFeedContext.tsx): Post creation and comment creation default to DiceBear avatars.
     - [`NagaMomentsBar.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/feed/NagaMomentsBar.tsx) & [`profile.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/profile.tsx): Stories bar and profile avatar presets display colorful DiceBear avatars.

### [2026-10-26] - Pure Red Plus Icon & Instagram 2-Step Photo-First Flow
- **User Feedback**:
  1. "just make it a read plus icon, no need for a circle outside the plus"
  2. "how instragram does it its that u upload the picture first, either open the camera and have the ability to add things like a caption, tag perosn or places, and etc that it"
- **Fixes Applied**:
  1. **Pure Red Plus Icon**: In [`FeedHeader.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/feed/FeedHeader.tsx), replaced the circular container and circle-outline with a clean, borderless red plus icon (`<Ionicons name="add" size={32} color={IOSTokens.colors.tint} />`).
  2. **Instagram 2-Step Photo-First Post Flow**: Overhauled [`CreatePostModal.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/feed/CreatePostModal.tsx):
     - **Step 1 (Media First)**:
       - 1:1 Large square image crop preview.
       - "Upload / Camera" trigger supporting web camera/file upload.
       - Clean photo gallery grid for instant photo selection.
       - Top navigation has "Cancel" and "Next".
     - **Step 2 (Details & Share)**:
       - Square thumbnail of selected photo paired with multiline "Write a caption..." input.
       - "Tag people" row (`@bicolcrawlers`, `@mariasantos`, etc.).
       - "Add location" row (`Cha Cha's Kinalas`, `Bob Marlin`, `Geewan`, etc.).
       - Top navigation has back arrow and "Share".

### [2026-10-26] - Social Community Feed Implementation & Layout Polish
- **Feature**: Replaced the Naga Food Passport tab on the floating bottom navigation bar with a full-featured Social Media Community Discovery Feed ([`feed.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/feed.tsx)) while completely preserving the Passport screen ([`basket.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/basket.tsx)).
- **User Refinements & Fixes Applied**:
  1. **Removed Top LIVE Pill**: Cleaned up the header in [`FeedHeader.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/feed/FeedHeader.tsx) to eliminate visual overlap with the "+ Share Trip" action button.
  2. **Removed Insider Tip Box**: Completely removed the yellow tip container to streamline the card.
  3. **Removed Redundant Badges**: Removed the "Verified Eatery" text pill—only a single crisp green checkmark (`checkmark-circle`) appears next to verified authors.
  4. **Removed Spice Overlay Pill**: Removed the `🌱 Mild` / `🌶️ Moderate` / `🔥 Fiery` pill overlay on the food media.
  5. **Anti-Shift Layout Stabilization**: Configured strict `flexShrink: 1`, `minWidth: 0`, and `numberOfLines={1}` with `ellipsizeMode="tail"` on author names, establishment locations, and dish tags. Added web `wordBreak: 'break-word'` to captions and `alignSelf: 'flex-start'` on overlays to prevent text jumps across card boxes.

### [2026-10-26] - Store Info Page Architecture & Color Divider Hierarchy
- **User Requests**:
  1. Fix food picture and dishes offered parts over-extending all the way down (improper sizing).
  2. Provide dedicated place for store banner and store logo.
  3. Remove restaurant tags (casual dining, etc.).
  4. Fix app rendering and spacing if store name is long (adjust or limit so it doesn't trigger improper spacing).
  5. Add proper color divider not just 1 color white to introduce hierarchy and spacing.
- **Fixes Applied**:
  1. **Dual-Image Store Identity**: Added 250px cover banner (`bannerWrapper`) and overlapping squircle store logo (`storeLogo`: 80×80px, `marginTop: -42`) with verified checkmark badge.
  2. **Bounded Dish Thumbnail Sizing**: Removed unbounded percentage heights. Set fixed `84x84px` thumbnail bounds (`dishThumbnailContainer`) with `alignItems: 'center'` on card rows. Also bounded `eateryImage` in [`food/[id].tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/food/%5Bid%5D.tsx) (86×86px).
  3. **Atmosphere Tags Cleanup**: Stripped out administrative category tags, keeping store header clean with neighborhood, distance, and live open status badge.
  4. **Long Store Name Layout Safeguards**:
     - Configured `numberOfLines={2}`, `ellipsizeMode="tail"`, `flexShrink: 1`, and balanced line height (28px on 22px serif font) on `storeTitle` in [`establishment/[id].tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/establishment/%5Bid%5D.tsx).
     - In section header rows (e.g. `About {establishment.name}`), wrapped the title in `flex: 1` with `numberOfLines={1}` and `flexShrink: 0` on `sectionSubtitle` to prevent pushing subtitles off-screen.
     - Added `numberOfLines={1}` and `ellipsizeMode="tail"` to `cardName` in [`EstablishmentCard.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/establishment/EstablishmentCard.tsx).
  5. **Warm Color Divider & Hierarchy System**:
     - Replaced stark white background with warm linen `#F8F6F3`.
     - Inserted `colorDividerRow` between major sections (`#E6E0DA` warm stone lines with 22×3px `#D42F13` terracotta accent).
     - Styled dish price tags with `#FFF2EE` terracotta pill badges (`#D42F13`).
     - Added color-coded functional icon boxes in Store Details (Location: `#FEECE8`, Hours: `#FEF3E2`, Phone: `#EBF8EE`).
     - Formatted About section: removed `Provenance` subtitle, removed sparkles and `AUTHENTIC LOCAL INSTITUTION` pill, and formatted About box in clean white (`#FFFFFF`) with subtle warm border (`#EAE4DE`).
  6. **Food Info Page Action Button Polish**:
     - In [`food/[id].tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/food/%5Bid%5D.tsx), simplified logged CTA state from `Tasted (+60 XP Logged)` to `Tasted`.

### [2026-10-26] - Food Basket Overhaul & Multi-Option Philippine Payment Flow
- **User Requests**:
  1. Fix bottom text overlap: `View in Profile` and `Culinary Passport & Badges` text were overlapping on narrow viewports.
  2. Set default action when basket is empty to the Search page (`/search`) instead of Flavor Codex (`/explore`).
  3. Create a dedicated payment page supporting Cash on Arrival (pay at counter when arriving), GCash (mobile e-wallet), and Maya / BSP QR Ph universal QR code payments.
- **Architectural Changes & Fixes Applied**:
  1. **Bottom Text Overlap Resolution**:
     - In [`frontend/src/app/basket.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/basket.tsx), restructured `passportShortcutCard` with `gap: 10`, `paddingVertical: 12`, and `paddingHorizontal: 14`.
     - Gave `passportShortcutLeft` strict `flex: 1` and `minWidth: 0`.
     - Wrapped title and description in `passportShortcutTextCol` with `flex: 1`, `minWidth: 0`, and `numberOfLines={1}` with `ellipsizeMode="tail"`.
     - Locked `passportShortcutBtn` to `flexShrink: 0` with padded terracotta button pill (`#FFF5F4`).
  2. **Empty Basket Default Navigation**:
     - Swapped primary empty state CTA from Flavor Codex (`/explore`) to Search Dishes & Spots ([`/search`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/search.tsx)) with `Ionicons name="search"`. Kept Flavor Codex as secondary exploratory button.
  3. **Dedicated Payment & Checkout Flow**:
     - Built [`frontend/src/app/payment.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/payment.tsx) with three Philippine payment methods:
       - **Cash on Arrival**: Direct payment at the store counter upon arrival.
       - **GCash E-Wallet**: Instant mobile number checkout with input validation and instant confirmation.
       - **Maya / QR Ph**: National standard QR code merchant card compatible with Maya, BPI, BDO, UnionBank, etc.
     - Linked Cart checkout CTA in `basket.tsx` to `Proceed to Payment (₱{total})` navigating to `/payment`.
     - Added customer name and contact phone inputs.
     - Added celebration modal on `/payment` with order reference and direct transition to `/basket` in the Passes tab.
     - In `/basket`, rendered verified payment badges on digital pass tickets (`PAID · GCASH`, `PAID · MAYA / QR PH`, or `CASH ON ARRIVAL · ₱{total}`) with official transaction references.
  4. **State & Context Updates**:
     - Upgraded [`BasketContext.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/context/BasketContext.tsx) with `paymentMethod`, `paymentStatus`, and `paymentRefNumber`.
     - Verified with `npx tsc --noEmit` (0 errors).

### [2026-10-26] - Real QR Code Generator, GCash Demo Mode, & Dining Option Card Stabilization
- **User Request**:
  1. Install a real QR generator for dining passes and payment.
  2. For GCash demo payment, remove the phone number entry requirement.
  3. When QR payment is pressed, show an interactive QR code modal with tap-to-enlarge.
  4. Fix dining option cards growing taller when switching between Dine-In and Takeout Box due to checkmark layout shift.
- **Root Cause of Dining Option Height Jump**:
  - The checkmark icon was conditionally mounted inside the selected card only.
  - Mounting it squeezed the title/subtitle text container (`optionTextCol`) by 28px.
  - On "Dine-In Pass", the longer subtitle ("Table meal, skip counter wait") was forced onto two lines, causing the card height to jump from 58px to 72px.
- **Fix Applied**:
  1. **Real QR Generator (`react-native-qrcode-svg`)**:
     - Installed `react-native-qrcode-svg` leveraging existing `react-native-svg`.
     - In [`payment.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/payment.tsx): replaced static placeholder with live scannable `QRCode` (standard EMVCo / QR Ph payload) and interactive modal (`showPaymentQrModal`) with 190×190 high-contrast QR display.
     - In [`basket.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/basket.tsx): replaced static pass icon with live `QRCode` (`PINOYPASS:{id}:{orderNumber}:{establishmentName}:{total}`) and tap-to-enlarge modal (`enlargedQrPass`) for vendor counter scanning.
  2. **GCash Demo Mode**:
     - Removed `gcashPhone` state and phone number validation block.
     - Replaced the text input with a verified "Instant Demo Account Ready" badge (`0917 ••• ••••`), streamlining 1-tap checkout.
  3. **Dining Option Card Stabilization**:
     - Both cards now permanently allocate an 18×18px indicator (`styles.optionIndicator`), switching between active red fill (`styles.optionIndicatorActive`) with a white checkmark and inactive border (`styles.optionIndicatorInactive`).
     - Added `minHeight: 64`, `paddingVertical: 10`, `paddingHorizontal: 12`, `gap: 8`, and `alignItems: 'stretch'`.
     - Added `numberOfLines={1}` on `optionTitle` and `optionSub`, guaranteeing zero layout shift or height popping.
  4. **Verification**:
     - `npx tsc --noEmit` verified with 0 errors.

### [2026-10-26] - Official Brand SVG Logos (GCash, Maya, QR Ph) & Clean Selection
- **User Request**:
  1. Use the newly added `gcash.svg` inside `frontend/assets/icons/` for GCash.
  2. Use the `maya.svg` and `qr-ph.svg` inside `frontend/assets/icons/` for Maya / QR Ph.
  3. Remove the demo account box when selecting GCash.
- **Changes Applied**:
  - Registered `*.svg` in [`frontend/src/types/declarations.d.ts`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/types/declarations.d.ts).
  - Integrated `Image as ExpoImage` from `expo-image` into [`payment.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/payment.tsx).
  - Replaced generic icons in GCash with the official `gcash.svg` brand logo.
  - Replaced generic icons in Maya / QR Ph with official `maya.svg` and `qr-ph.svg` logos in both the selection card, the QR Ph preview section, and the enlarged QR Ph modal header.
  - Completely removed the bulky demo account box and subfields under GCash for a sleek, instantaneous 1-tap checkout.
  - Removed redundant "Accepts Maya, GCash..." subfield notice below QR Ph in [`payment.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/payment.tsx).
  - Verified with `npx tsc --noEmit` (0 errors).

- **2026-10-26 (Empty Basket State Button Redesign & Overflow Fix)**:
  - Addressed issue where the action buttons in the empty basket state ([`basket.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/basket.tsx)) overflowed the card box on mobile viewports.
  - Replaced `"Flavor Codex"` (`/explore`) with `"View Map"` (`/map`) using `map-outline` icon.
  - Shortened `"Search Dishes & Spots"` to `"Search Dishes"` (`/search`) to avoid excessive horizontal width.
  - Removed artificial stretching (`width: '100%'`, `flex: 1`) that bloated padding and caused "View Map" to overextend past the right edge.
  - Switched `emptyActionsRow` to centered natural wrapping (`flexDirection: 'row'`, `alignItems: 'center'`, `justifyContent: 'center'`, `gap: 10`, `flexWrap: 'wrap'`).
  - Styled both buttons with crisp, compact padding (`paddingVertical: 10, paddingHorizontal: 14`) and added `overflow: 'hidden'` to `emptyCard`.
  - Verified with `npx tsc --noEmit` (0 errors).

### [2026-10-26] - Notifications Hub, Basket Cleanup & Community Feed Polish
- **User Requests**:
  1. Connected Home topbar notification bell to new notification page with dynamic unread badge count.
  2. Created `/notifications` screen & [`NotificationContext.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/context/NotificationContext.tsx) with interactive category filters, mark-all-read, and item dismissal.
  3. In `/basket`: Removed estimated pickup time section, headers, and time slots.
  4. In `/notifications`: Removed all sparkle icons and emojis per user aesthetic preference.
  5. In `/feed` (Naga Community):
     - Removed the white container box and hairline border behind Naga Moments story avatar circles in [`NagaMomentsBar.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/feed/NagaMomentsBar.tsx), allowing circles to float cleanly on page background.
     - Removed `sparkles-outline` icon from the "All Stories" filter tab in [`FeedFilterStrip.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/feed/FeedFilterStrip.tsx), replacing it with `layers-outline` (the exact icon used in `/notifications` for "All").
- **Verification**:
  - `npx tsc --noEmit` verified with 0 errors.

### [2026-10-26] - Trail Pages & Home Carousel Polish & Spot Count Sync
- **User Requests**:
  1. Fix home page food spots count mismatch (home showed 3/5 while inside trail showed 1/3; ensure inside and outside stay 100% in sync).
  2. In trail page, remove the emoji beside the text `Order: ...` inside the next objective box.
  3. Remove the Nagueño secret box inside the food boxes in that page.
  4. Remove the "Taste verified in your Naga Tasting Log" box in the food boxes in that page.
- **Architectural & UI Upgrades Applied**:
  1. **Dynamic Spot Count Synchronization**:
     - In [`NagaQuestCarousel.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/home/NagaQuestCarousel.tsx), integrated `useQuest().tastingLog`, `getTrailById()`, and `ESTABLISHMENTS` to compute `dynamicQuests` live.
     - Resolved `completed` stops matching user's active tasting log against each trail's establishments, and `total` matching the real number of stops in the trail.
     - Updated fallback `QUEST_DATA` defaults to `{ current: 1, total: 3 }` matching active Naga trail data.
     - Inside and outside now always reflect the exact same live counts (e.g., 1/3).
  2. **Removed Emoji beside `Order:`**:
     - In [`TrailProgressBar.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/trail/TrailProgressBar.tsx), removed `🍜 ` prefix before `Order: <Text style={styles.dishBold}>{activeFoodName}</Text>`.
  3. **Removed Nagueño Secret Box from Trail Food Cards**:
     - In [`TrailStopStation.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/trail/TrailStopStation.tsx), removed `insiderHackBox` rendering, purged unused `DISH_INSIDER_TIPS` lore lookup, and cleaned up unused styles.
  4. **Removed Taste Verified Box from Trail Food Cards**:
     - In [`TrailStopStation.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/trail/TrailStopStation.tsx), removed `completedVerifyRow` ("Taste verified in your Naga Tasting Log") and its styles.
     - Adjusted `dishAndHoursRow` `marginBottom: 0` for clean, balanced spacing inside card details.
- **Verification**:
  - Verified with `npx tsc --noEmit` (0 errors).

### [2026-10-26] - Kitchen Orders Sample Order Flow & Business NavBar Icon Alignment
- **User Requests**:
  1. In kitchen order page, create interactive sample orders with full merchant controls (update status, interact, etc.).
  2. Remove simulated and reset demo order buttons, keeping sample orders present by default.
  3. Remove the `All` tab filter from kitchen orders, keeping 4 clean stages (`New`, `Kitchen`, `Ready`, `Done`).
  4. Fix alignment of the black circular indicator with the receipt icon in the business bottom navbar.
- **Architectural & UI Upgrades Applied**:
  1. **Interactive Sample Kitchen Orders**:
     - Populated [`BasketContext.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/context/BasketContext.tsx) `INITIAL_PRE_ORDERS` with 4 realistic Cha Cha's Kinalas merchant tickets (`#NG-9104` in `received`, `#NG-9088` in `preparing`, `#NG-9071` in `ready`, `#NG-9055` in `completed`) with customer contacts, dining modes (`dine_in`, `takeout`), and payment statuses.
     - Upgraded [`BusinessOrderCard.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/business/BusinessOrderCard.tsx) with interactive status flow buttons (`Start Preparing`, `Mark Ready for Pickup`, `Complete & Hand Over`, `Decline`, `Reopen`).
  2. **Removed Simulation Controls & All Filter Tab**:
     - Cleaned up [`business.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/business.tsx): removed simulation/reset bar, removed `All` filter tab, and defaulted active view to `received` (`New`).
  3. **Business NavBar Orders Icon Alignment**:
     - In [`BusinessNavBar.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/business/BusinessNavBar.tsx), optically centered the `receipt` font glyph within the 42x42 container via `transform: [{ translateY: -1.5 }, { translateX: -0.5 }]`.
     - Shifted the order count badge to `top: -2, right: -2` with dynamic border coloring (`borderColor: isFocused ? '#1C1C1E' : '#FFFFFF'`), preventing the badge border from cutting into the black circular background and ensuring the black circle stays an unbroken, perfectly aligned circle.
- **Verification**:
  - `npx tsc --noEmit` verified with 0 errors.
  - Visual rendering verified in Chrome DevTools viewport.




