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
| `/basket` | [`frontend/src/app/basket.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/basket.tsx) | `['top', 'left', 'right']` | **Food Basket & Pre-Orders Hub**: Dual-tab hub for Cart & Checkout (steppers, store grouping, dining option selector, special kitchen notes, bill breakdown with 5% Platform Fee, and Proceed to Payment CTA) and Active Passes (digital QR voucher pass, payment badges, 4-stage live kitchen status tracker, counter call/map actions, demo status simulation). |
| `/streak` | [`frontend/src/app/streak.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/streak.tsx) | `['top', 'left', 'right']` | **Duolingo-Inspired Streak & Trophy Hub**: Hero flame counter with countdown timer, 7-day habit consistency calendar, Sili Shield (streak freeze) indicator, Level & XP progress HUD, 5-tier streak trophies showcase (Bronze, Silver, Gold, Diamond, Centennial), mealtime reminder nudges (Lunch, Merienda, Night Crawl), and 1-tap check-in action. |
| `/notifications` | [`frontend/src/app/notifications.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/notifications.tsx) | `['top', 'left', 'right']` | **Notifications Hub**: Central notification center for pre-order pickup alerts, daily taste pulse streak reminders, trophy unlock celebrations, community likes & comments, and local flavor drops. Interactive category filters (All, Orders, Streaks, Trophies, Social, Specials), unread badges, mark-all-as-read, item dismissal, and deep link navigation. |
| `/friends` | [`frontend/src/app/friends.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/friends.tsx) | `['top', 'left', 'right']` | **Foodie Friends & Weekly Taste League Hub**: Dual-tab hub for Weekly Taste League (División de Oro, promotion/relegation zones, ranked foodies with XP/dishes, current user elevation) and Squad Streaks (active friend streaks, 1-tap "Tara Kain!" mealtime nudges, friend recent tasting dispatches, and Add Friend / Foodie Invite modal). |
| `/payment` | [`frontend/src/app/payment.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/payment.tsx) | `['top', 'left', 'right', 'bottom']` | **Payment & Checkout**: Supports Cash on Arrival (pay at store counter), GCash E-Wallet with mobile number validation, and Maya / BSP QR Ph Universal National QR scan with receipt references; customer pass contact details; itemized summary with 5% Platform Fee. |
| `/saved` | [`frontend/src/app/saved.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/saved.tsx) | `['top', 'left', 'right']` | **Saved Favorites (Preserved)**: Tabbed lists of bookmarked dishes and eateries with quick removal and clear-all actions; accessible via Profile screen Activity section. |
| `/search` | [`frontend/src/app/search.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/search.tsx) | `['top', 'left', 'right']` | **Search Screen**: Live filter by dish, ingredient, district, or open status; category tags; empty state suggestions. |
| `/profile` | [`frontend/src/app/profile.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/profile.tsx) | `['top', 'left', 'right']` | **Profile & Settings**: User preferences, spice tolerance setting, favorite district, security settings, business portal switch. |
| `/business` | [`frontend/src/app/business.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/business.tsx) | `['top', 'left', 'right']` | **Merchant Portal**: Dashboard for restaurant owners to update menu items, toggle open/closed status, manage pre-orders, create promotions, and broadcast store updates with the 5-tab bottom navigation (`orders`, `menu`, `posts`, `promote`, `store`). Redesigned Store Profile features Facebook-style profile cover & avatar with instant pen editing ([`EditPhotoModal.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/business/EditPhotoModal.tsx)), merchant earnings wallet & cashout flow ([`StoreWalletCard.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/business/StoreWalletCard.tsx), [`CashOutModal.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/business/CashOutModal.tsx)), live operating hours & hotline details, and interactive business photo gallery ([`StoreGallerySection.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/business/StoreGallerySection.tsx)). |
| `/business-register` | [`frontend/src/app/business-register.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/business-register.tsx) | `['top', 'bottom', 'left', 'right']` | **Business Registration & Onboarding Wizard**: 4-step wizard for food establishment owners to register their business (Basic details & category, cover/logo branding & atmosphere tags, first signature menu item, review & live launch to Supabase). |
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
| `BusinessContext` | [`frontend/src/context/BusinessContext.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/context/BusinessContext.tsx) | Dynamic restaurant owner profile, Supabase sync via `BusinessService`, user business ownership tracking (`hasBusiness`, `isLoadingBusiness`), demo preview mode switcher, menu management, live order queue, earnings wallet & cashout, open/closed toggle. |
| `BusinessService` | [`frontend/src/services/businessService.ts`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/services/businessService.ts) | Supabase data service for `businesses`, `business_products`, `business_promotions`, `business_wallets`, and `business_gallery` with offline AsyncStorage caching. |
| `NotificationContext` | [`frontend/src/context/NotificationContext.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/context/NotificationContext.tsx) | In-app notification state, dynamic unread badge count, mark as read, delete, and clear-all actions. |
| `FriendsContext` | [`frontend/src/context/FriendsContext.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/context/FriendsContext.tsx) | Foodie friends list, live weekly leaderboard calculation, "Tara Kain!" mealtime habit nudges, follow/unfollow, and handle search. |
| `FriendsData` | [`frontend/src/data/friendsData.ts`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/data/friendsData.ts) | FoodieProfile and LeagueDivision types with seed Naga City foodies and Gold Division config. |
| `SocialFeedContext` | [`frontend/src/context/SocialFeedContext.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/context/SocialFeedContext.tsx) | Community social feed state: posts, stories, likes, bookmarks, comments, filter category, post creation, interactive ad poll voting (`voteOnPoll`), and voucher claiming (`claimVoucher`). |
| `SocialFeedData` | [`frontend/src/data/socialFeedData.ts`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/data/socialFeedData.ts) | Typed models (`SocialPost`, `PostAuthor`, `SocialComment`, `NagaMomentStory`, `AdvertisementData`, `EngagementPoll`), initial posts with sample business engagement ad, and moments. |
| `DiceBear Avatars` | [`frontend/src/utils/dicebearAvatar.ts`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/utils/dicebearAvatar.ts) | Generates `@dicebear/core` + `@dicebear/styles/adventurer-neutral.json` with `with { type: 'json' }` avatars with random/seeded background colors, inlining `<use>` references for native compatibility. |
| Mock Data | [`frontend/src/data/mockData.ts`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/data/mockData.ts) | Canonical dishes (`FOOD_ITEMS`), eateries (`ESTABLISHMENTS`), categories. |
| Gamification Data | [`frontend/src/data/gamification.ts`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/data/gamification.ts) | Curated food trails (`FOOD_TRAILS`), badge definitions, insider tips. |

---

## 4. Component Quick Reference

| Directory | Key Components | Purpose |
| :--- | :--- | :--- |
| `components/feed/` | `FeedHeader`, `NagaMomentsBar`, `StoryViewerModal`, `FeedFilterStrip`, `SocialFeedCard`, `CommentsBottomSheet`, `CreatePostModal` | Full social media discovery feed with stories, double-tap like cards, dish tag overlays, comment threads, trip composer, and business advertisement & engagement post rendering with interactive craving polls and voucher redemption. |
| `components/trail/` | `TrailHeroBanner`, `TrailProgressBar`, `TrailSteppingBridge`, `TrailStopStation`, `TrailFinishCrest`, `TrailStopDetailsSheet` | Winding road journey map, gamified crawl stops, and milestone crest. |
| `components/codex/` | `CodexHeroHeader`, `CodexFilterBar`, `DishCodexCard`, `DishDossierModal` | Clean culinary encyclopedia cards, category filters, and deep lore bottom sheet. |
| `components/home/` | `MascotHero`, `NagaQuestCarousel`, `CravingDialWidget`, `FoodShowcaseBox` | Dynamic greetings, streak flame button, banner carousel, and interactive flavor dial. |
| `components/common/` | `NavBar`, `SearchInput`, `RecommendationModal`, `UserAvatar` | Floating bottom navigation pill: Home (`/`), Map (`/map`), Search elevated center button (`/search`), Feed (`/feed`), Basket (`/basket` with dynamic badge count), search inputs, modal sheets, and universal native Android/iOS `SvgXml` avatar renderer. |
| `components/map/` | `MapboxMapView`, `MapSpotCarousel`, `NagaMapCanvas` | Mapbox GL mobile/web interactive map with vector SVG category pins, glowing selection pulse, floating controls, and interactive horizontal food spot carousel. |
| `components/business/` | `BusinessNavBar`, `CreateBusinessPostModal`, `BusinessPostCard`, `AddProductModal`, `CreatePromotionModal`, `PromotionCard`, `BusinessOrderCard`, `EditPhotoModal`, `StoreWalletCard`, `CashOutModal`, `StoreGallerySection`, `StoreSubscriptionBanner`, `StoreSubscriptionModal`, `MerchantPaywallGate` | Merchant management suite with uniform 5-tab navigation bar, photo post composer with dish tagging, dedicated store post card, menu manager, multi-tier promotion wizard, Facebook-style cover/avatar photo editor, store earnings wallet card, instant cashout modal, business photo gallery, and complete merchant Pro subscription paywall & checkout suite (banner, paywall gates for locked tabs, GCash/Maya/QR Ph checkout modal). |
| `components/gamification/` | `PassportStampModal`, `SilitoMysteryBox` | Tasting journal stamps, celebratory unboxing animations. |

---

## 5. AI Action & Modification Log

*Every AI session must append its actions here:*

### [2026-11-05] - Hotfix: Safe Storage for BasketContext, Hermes Date Bounds & Subscription RLS
- **Issue Reported**:
  1. `WARN [BasketContext] Error loading cached basket items: [AsyncStorageError: Native module is null, cannot access legacy storage]`
  2. `WARN [BusinessService] Network/Supabase subscription error: [RangeError: Date value out of bounds]` when subscribing.
  3. `WARN [BusinessService] Supabase subscription upsert warning: new row violates row-level security policy for table "business_subscriptions"`
- **Root Causes**:
  - `BasketContext.tsx` imported `@react-native-async-storage/async-storage` directly; in Expo Go or unlinked clients, native storage threw `Native module is null`.
  - In `BusinessContext.tsx`, `expiryDate` was stored as a localized string (`Nov 5, 2026`). In Hermes on Android, `new Date("Nov 5, 2026")` produced an `Invalid Date`, and calling `.toISOString()` threw `RangeError: Date value out of bounds`.
  - When testing in Demo Mode (`cha-chas-kinalas`) or as unauthenticated user, attempting to upsert to Supabase `business_subscriptions` triggered an RLS violation because `auth.uid()` does not own the demo record.
- **Fixes Applied**:
  - Created [`frontend/src/utils/safeStorage.ts`](file:///c:/Dev/food/frontend/src/utils/safeStorage.ts) with web localStorage, try/catch native AsyncStorage, and resilient in-memory map fallback. Updated `BasketContext.tsx`, `supabase.ts`, and `businessService.ts` to use `safeStorage`, guaranteeing that Supabase Auth JWT sessions persist properly in Expo Go.
  - In `BusinessContext.tsx`, stored spec-compliant ISO timestamps (`expiryDate.toISOString()`, `today.toISOString()`).
  - In `businessService.ts`, implemented `toSafeISOString()` which safely extracts ISO strings from dates, ISO strings, or localized text without ever throwing `RangeError`.
  - In `businessService.ts`, added demo store detection (`isDemoStore`): demo/preview stores save directly to local storage cache and bypass remote Supabase sync, preventing RLS violations while maintaining persistent active Pro subscription states. For registered user businesses, checks `supabase.auth.getSession()` before syncing.
  - In `supabase_business_schema.sql`, added explicit `WITH CHECK` clause matching `USING` for the subscriptions RLS policy.
- **Verification**: `npx tsc --noEmit` exited code 0.

### [2026-11-05] - Brand Identity Renamed to "Masaen"
- **User Request**: "can u rename the file to this instead: Masaen"
- **Changes Applied**:
  - **App Configuration & Scheme**:
    - Renamed application in [`frontend/app.json`](file:///c:/Dev/food/frontend/app.json):
      - `"name": "Masaen"` (Bikol: *"Where to eat?"*)
      - `"slug": "masaen"`
      - `"scheme": "masaen"`
      - `"ios.bundleIdentifier": "com.masaen.app"`
      - `"android.package": "com.masaen.app"`
    - Updated package name in [`frontend/package.json`](file:///c:/Dev/food/frontend/package.json) to `"name": "masaen"`.
    - Updated initial notification greeting in [`frontend/src/context/NotificationContext.tsx`](file:///c:/Dev/food/frontend/src/context/NotificationContext.tsx) to `'Welcome to Masaen! 🌶️'`.
  - **Brand Assets & Project Documentation**:
    - Cloned high-resolution brand asset to [`frontend/assets/images/masaen-logo.png`](file:///c:/Dev/food/frontend/assets/images/masaen-logo.png) (while preserving `nagi-logo.png` for backward compatibility).
    - Generated comprehensive project brief [`MASAEN_APP_DOCUMENTATION.md`](file:///c:/Dev/food/MASAEN_APP_DOCUMENTATION.md) reflecting the **Masaen** identity.
  - **Native Android Rebuild**:
    - Re-ran `npx expo prebuild --platform android --no-install` to update Android manifest, package namespaces (`com.masaen.app`), and launcher label `<string name="app_name">Masaen</string>`.
    - Preserved [`frontend/android/local.properties`](file:///c:/Dev/food/frontend/android/local.properties) pointing to the local Android SDK.
- **Verification**: `npx tsc --noEmit` exited code 0.

### [2026-11-05] - Brand Logo Asset Upgrade (`newlogo/`)
- **User Request**: "@[frontend/newlogo] can u update the new logo to use this instead"
- **Changes Applied**:
  - **Asset Extraction & Replacement**:
    - Replaced master app icon [`frontend/assets/images/icon.png`](file:///c:/Dev/food/frontend/assets/images/icon.png) from `newlogo/ios/iTunesArtwork@2x.png` (1024×1024).
    - Replaced Android adaptive icon foreground [`frontend/assets/images/android-icon-foreground.png`](file:///c:/Dev/food/frontend/assets/images/android-icon-foreground.png) from `newlogo/android/mipmap-xxxhdpi/ic_launcher_foreground.png` (432×432).
    - Replaced splash screen centerpiece [`frontend/assets/images/splash-icon.png`](file:///c:/Dev/food/frontend/assets/images/splash-icon.png) from `newlogo/android/mipmap-xxxhdpi/ic_launcher_foreground.png` (432×432).
    - Replaced web browser favicon [`frontend/assets/images/favicon.png`](file:///c:/Dev/food/frontend/assets/images/favicon.png) from `newlogo/android/mipmap-mdpi/ic_launcher.png` (48×48).
    - Replaced in-app brand asset [`frontend/assets/images/nagi-logo.png`](file:///c:/Dev/food/frontend/assets/images/nagi-logo.png) from `newlogo/android/playstore-icon.png` (512×512).
  - **Color Palette Alignment**:
    - Updated adaptive icon background and splash screen background in [`frontend/app.json`](file:///c:/Dev/food/frontend/app.json) to `#b41414` (matching `newlogo/android/values/ic_launcher_background.xml`).
  - **Native Android Prebuild Synchronization**:
    - Executed `npx expo prebuild --platform android --no-install` to regenerate native Android resources (density-specific mipmaps, drawables, splashscreen vector/bitmap layers, and `@color/splashscreen_background` / `@color/iconBackground` in `colors.xml`).
    - Maintained [`frontend/android/local.properties`](file:///c:/Dev/food/frontend/android/local.properties) pointing to the local Android SDK.
- **Verification**: Clean TypeScript validation (`npx tsc --noEmit` exited code 0).

### [2026-11-05] - Business Subscription Persistence, Dynamic Public Page & Auth Keyboard Detection
- **User Request**:
  1. Business subscription isn't actually saved; it doesn't remember if a user subscribed or not.
  2. The view public page shows a hardcoded page not the actual user's page.
  3. The auth pages don't have proper keyboard detection knowing if the keyboard of the phone is overlapping the field, preventing the user from seeing what they are typing.
- **Root Causes & Solutions Applied**:
  - **Issue 1: Business Subscription Persistence**:
    - *Diagnosis*: `BusinessContext.tsx` only updated in-memory React state in `subscribeStore` and `cancelSubscription`. `businessService.ts` lacked a write method for `business_subscriptions` and did not cache subscription records to offline storage `safeBusinessStorage`.
    - *Fix*: Added `updateSubscription(businessId, subscription)` to `BusinessService` with Supabase upsert and local `@naga_biz_subscription_${businessId}` storage fallback. Refactored `subscribeStore` and `cancelSubscription` in `BusinessContext.tsx` to asynchronously persist active status, auto-renew, payment refs, and timestamps across both user accounts and demo mode. Updated `registerBusiness` to initialize subscription records upon launch.
  - **Issue 2: Dynamic Public Establishment Page (`/establishment/[id]`)**:
    - *Diagnosis*: `establishment/[id].tsx` performed a lookup strictly in `mockData.ts` (`ESTABLISHMENTS.find(e => e.id === id) || ESTABLISHMENTS[0]`). Custom business IDs failed matching and defaulted to Cha Cha's Kinalas.
    - *Fix*: Added `BusinessService.getBusinessById(businessId)` querying Supabase `businesses`, `business_products`, and `business_gallery` with local offline cache fallback. Implemented synchronous context detection via `useBusiness()` in `establishment/[id].tsx` so merchant views load instantly with zero delay, mapping `BusinessProfile` + `BusinessProduct[]` into the `Establishment` format with custom dish photos, tags, contact, and hours. Updated `handleAddDish` to add custom store dishes directly to `BasketContext`.
  - **Issue 3: Auth Pages Keyboard Detection & Responsive Layout**:
    - *Diagnosis*: In `/login`, `/signup`, and `/forgot-password`, `KeyboardAvoidingView` had `behavior={undefined}` on Android. `scrollContent` had `justifyContent: 'center'` with `flexGrow: 1`, which forced flex centering in reduced viewport height when the keyboard opened, hiding headers and trapping focused fields behind the virtual keyboard.
    - *Fix*: Created universal `useKeyboardState` hook (`frontend/src/hooks/useKeyboardState.ts`) listening to native `keyboardDidShow` / `keyboardDidHide` events. In all three auth pages, adapted `KeyboardAvoidingView` to `behavior={Platform.OS === 'ios' ? 'padding' : 'height'}` with vertical offset, set `keyboardShouldPersistTaps="handled"` on `<ScrollView>`, and dynamically transitioned `justifyContent: isKeyboardVisible ? 'flex-start' : 'center'` with generous bottom scroll padding (`paddingBottom: 60-70`), preventing any input occlusion.
- **Verification**: Clean TypeScript compilation (`npx tsc --noEmit` exited code 0).

### [2026-11-05] - Project Documentation & Business Model Export to Google Docs
- **User Request**: Create a Google Doc documenting and describing the app, its main features, and its business model.
- **Actions Executed**:
  - Authored comprehensive documentation in [`NAGI_APP_DOCUMENTATION.md`](file:///c:/Dev/food/NAGI_APP_DOCUMENTATION.md) detailing:
    - Executive summary and cultural problem statement (preserving Bicolano culinary heritage and supporting micro-merchants against delivery conglomerates).
    - 7 Core Feature Pillars: Flavor Codex, Curated Food Trails, Interactive Geospatial Map, Community Social Feed with Naga Moments & interactive ad polls, Gamification (Streaks, Sili Shield, Division de Oro Taste League), Smart Food Basket & Pre-Orders (GCash, Maya, BSP QR Ph), and Merchant Onboarding & Business Portal.
    - Multi-tiered Business Model: Nagi Pro Partner subscription (₱250/mo, ₱2,500/yr), hyper-local micro-promotions (₱49–₱650 tiers), transaction convenience fee, and B2G cultural tourism partnerships.
    - Technical stack and phased strategic expansion roadmap.
  - Initialized `gdocs` CLI integration, completed OAuth authorization, and generated the live Google Doc with auto-fitted tables: [Nagi — Product Overview, Feature Architecture & Business Model](https://docs.google.com/document/d/1qy76m6cBVCxkSr_fPy-UifyoBFXdXrvtwt-1XI2Ckuk/edit).

### [2026-11-05] - System In-Display Navigation Bar Safe Area Spacing
- **User Request**: "the app isnt build to have proper spacing and safe area as the bottom navbar of the app is coliding w/ my phones own in display navbar (back, menu, and home buttons)"
- **Root Cause**:
  - `NavBar` and `BusinessNavBar` had hardcoded `bottom: 18` on Android and did not consume `useSafeAreaInsets()`.
  - On Android devices with standard 3-button in-display navigation (back, home, recent apps, ~48dp tall), the bottom navbar was positioned directly over the phone's native buttons.
  - Tab screens (`home`, `explore`, `feed`, `basket`, `search`, `saved`, `profile`, `business`) had static bottom scroll padding that didn't adjust for dynamic bottom insets.
  - Subscreens (`streak`, `friends`, `notifications`) omitted `'bottom'` from `<SafeAreaView edges={...}>`.
- **Changes Applied**:
  - **Dynamic Inset Clamping in Navbars**:
    - In [`NavBar.tsx`](frontend/src/components/common/NavBar.tsx) and [`BusinessNavBar.tsx`](frontend/src/components/business/BusinessNavBar.tsx): integrated `useSafeAreaInsets()` to calculate `bottomOffset = Math.max(insets.bottom, Platform.OS === 'android' ? 14 : 10) + (Platform.OS === 'ios' ? 6 : 10)`. The navbar now floats comfortably 10-14dp above any 3-button navigation bar, gesture bar, or iOS home indicator.
  - **Interactive Map Alignment**:
    - In [`map.tsx`](frontend/src/app/map.tsx): dynamically chained `carouselBottomOffset = navBottomOffset + 62 + 8` and `recenterBottomOffset = carouselBottomOffset + 218`, keeping the spot carousel and recenter FAB floating above the elevated navbar.
  - **Scroll Content Breathing Room**:
    - Dynamically applied `paddingBottom: 110 + insets.bottom` across [`home.tsx`](frontend/src/app/home.tsx), [`explore.tsx`](frontend/src/app/explore.tsx), [`feed.tsx`](frontend/src/app/feed.tsx), [`basket.tsx`](frontend/src/app/basket.tsx), [`search.tsx`](frontend/src/app/search.tsx), [`saved.tsx`](frontend/src/app/saved.tsx), [`profile.tsx`](frontend/src/app/profile.tsx), and [`business.tsx`](frontend/src/app/business.tsx).
  - **Subscreen Full Safe Areas**:
    - Updated [`streak.tsx`](frontend/src/app/streak.tsx), [`friends.tsx`](frontend/src/app/friends.tsx), and [`notifications.tsx`](frontend/src/app/notifications.tsx) to `<SafeAreaView edges={['top', 'left', 'right', 'bottom']}>`.


### [2026-11-05] - Local Android APK Build Preparation
- **User Request**: "and then prepare the app so i can locally build the apk file"
- **Changes Applied**:
  - **Android Package Identifier**: Configured `"package": "com.nagi.app"` and `INTERNET` permissions inside [`frontend/app.json`](frontend/app.json).
  - **EAS Build Configuration**: Generated [`frontend/eas.json`](frontend/eas.json) with `preview` profile specifying `"buildType": "apk"` for local standalone APK generation.
  - **Native Prebuild & Gradle**:
    - Ran `npx expo prebuild --platform android` to generate the complete native [`frontend/android/`](frontend/android/) project.
    - Generated [`frontend/android/local.properties`](frontend/android/local.properties) pointing to the system Android SDK (`C:\Users\Admin\AppData\Local\Android\Sdk`).
    - Verified Gradle 9.4.1 wrapper and Java 17 execution.
  - **Convenience Scripts**: Added `build:apk:debug`, `build:apk:release`, and `build:eas:apk` scripts in [`frontend/package.json`](frontend/package.json).


### [2026-11-05] - Landing Page: Removed In-App Nagi Logo Badge (`/welcome`)
- **User Request**: "remove the nagi logo in the landing page"
- **Changes Applied**:
  - In [`frontend/src/app/welcome.tsx`](frontend/src/app/welcome.tsx), removed the `brandBadge` container, `brandLogo` image, and `brandTitle` text from the header area.
  - Restored original clean editorial typography layout and vertical spacing for the welcome screen.
  - Logo remains cleanly attached as the official OS app icon, Android adaptive launcher, splash screen, and browser favicon.


### [2026-11-05] - Brand Identity "Nagi" & App Icon Integration
- **User Request**: "go for Nagi, and while that @[c:\Dev\food\frontend\easyappicon-icons-1793863659855] attach this app logo in my app"
- **Changes Applied**:
  - **App Naming & Scheme**:
    - Renamed application in [`frontend/app.json`](frontend/app.json) to `"name": "Nagi"`, `"slug": "nagi"`, `"scheme": "nagi"`.
    - Updated package name in [`frontend/package.json`](frontend/package.json) to `"name": "nagi"`.
    - Updated initial notification greeting in [`frontend/src/context/NotificationContext.tsx`](frontend/src/context/NotificationContext.tsx) to `'Welcome to Nagi! 🌶️'`.
  - **App Icons Installed**:
    - Extracted and transferred generated icon package from [`easyappicon-icons-1793863659855`](frontend/easyappicon-icons-1793863659855) to [`frontend/assets/images/`](frontend/assets/images/):
      - `icon.png`: High-resolution 1024×1024 master app icon.
      - `android-icon-foreground.png`: 432×432 transparent adaptive icon foreground.
      - `splash-icon.png`: Centerpiece splash screen logo.
      - `favicon.png`: 48×48 web favicon.
      - `nagi-logo.png`: 512×512 in-app brand asset.
    - Configured Android adaptive icon with native background color `#be141e` (sili crimson).
    - Configured splash screen plugin with matching background color `#be141e` and width 120.
  - **In-App Welcome Screen Branding**:
    - In [`frontend/src/app/welcome.tsx`](frontend/src/app/welcome.tsx), integrated the official Nagi logo and brand badge at the top of the Welcome onboarding screen.


### [2026-11-05] - Promote Campaigns: Realistic Pricing and Local Naga Reach (`/business`)
- **User Request**: "and in the promote section can u also try to reduce the price and the expected reach to be more realistic"
- **Changes Applied**:
  - In [`CreatePromotionModal.tsx`](frontend/src/components/business/CreatePromotionModal.tsx), calibrated campaign tiers for local carinderias and food spots:
    - **1 Day Flash Rush**: Reduced price to **₱49** (from ₱99); adjusted reach to **~150–300 foodies** (from 1,500).
    - **3 Days Weekend Booster**: Reduced price to **₱120** (from ₱249); adjusted reach to **~400–750 foodies** (from 5,000).
    - **7 Days Weekly Spotlight**: Reduced price to **₱220** (from ₱499); adjusted reach to **~900–1,500 foodies** (from 14,000).
    - **14 Days Fortnight Sprint**: Reduced price to **₱390** (from ₱899); adjusted reach to **~1,800–2,800 foodies** (from 30,000).
    - **30 Days Monthly Anchor**: Reduced price to **₱650** (from ₱1,699); adjusted reach to **~3,500–5,000 foodies** (from 70,000).


### [2026-11-05] - Merchant Portal: Removed Hardcoded Today's Overview (`/business`)
- **User Request**: "can u also remove the hardcoded todays overview part"
- **Changes Applied**:
  - In [`business.tsx`](frontend/src/app/business.tsx), removed the hardcoded `TODAY'S OVERVIEW` section displaying mock gross sales (₱4,850), foodie views (3,890), and customer bookmarks (247).
  - Cleaned up unused `analytics` destructuring and `storeStatsGrid` styles.
  - Live revenue and payout figures continue to be properly presented by `StoreWalletCard` directly from the merchant's live wallet.


### [2026-11-05] - Partner Subscription: Adjusted Price to ₱250/mo (`/business`)
- **User Request**: "can u reduce the price of partner subscription to just be 250 pesos"
- **Changes Applied**:
  - In [`StoreSubscriptionModal.tsx`](frontend/src/components/business/StoreSubscriptionModal.tsx), reduced monthly partner subscription from ₱499 to **₱250 / month**, and annual plan from ₱4,999 to **₱2,500 / year** (Save ₱500, 2 months free).
  - In [`StoreSubscriptionBanner.tsx`](frontend/src/components/business/StoreSubscriptionBanner.tsx), updated price tag display to **₱250/mo**.
  - In [`MerchantPaywallGate.tsx`](frontend/src/components/business/MerchantPaywallGate.tsx), updated default CTA text to `Subscribe to Unlock (₱250/mo)`.
  - In [`business.tsx`](frontend/src/app/business.tsx), updated paywall button text for orders and promotions to `₱250/mo`.


### [2026-11-05] - Business Registration & Database Integration (`/profile`, `/business`, `/business-register`)
- **User Request**: In my profile page there is an option to go the business side, the issue its hard coded, there is actually no way to register a business, an onboarding, and etc. Remove the hard coded business side, directly fetch from the database (if no business side schema is there build it) and create the proper business registration and onboarding when trying to make their own business.
- **Architectural & Schema Upgrades Applied**:
  1. **PostgreSQL/Supabase Database Schema (`supabase_business_schema.sql`)**:
     - Built comprehensive database schema with 6 tables: `public.businesses`, `public.business_products`, `public.business_promotions`, `public.business_wallets`, `public.business_gallery`, and `public.business_subscriptions`.
     - Defined foreign keys linking `businesses.owner_id` to `food_profiles.id` with cascade deletion and Row Level Security (RLS) policies for public catalog view and authenticated owner management.
     - Appended schema definitions to `supabase_schema.sql` and `supabase_full_migration.sql`.
  2. **Database Data Service (`frontend/src/services/businessService.ts`)**:
     - Built data layer interfacing directly with Supabase for user store query, business creation, menu management, cashout records, promotions, and gallery updates.
     - Implemented transparent offline and pre-migration fallback via resilient `safeBusinessStorage` (in-memory map + web localStorage + try/catch AsyncStorage) ensuring `Native module is null` errors in Expo Go or unlinked clients never break business registration.
  3. **Reactive Global Business State (`frontend/src/context/BusinessContext.tsx`)**:
     - Removed static mock store as permanent default state.
     - Added dynamic store fetching bound to `useAuth()`: `hasBusiness`, `isLoadingBusiness`, `isDemoMode`, `enableDemoMode()`, and `registerBusiness()`.
  4. **Dynamic Profile Screen (`frontend/src/app/profile.tsx`)**:
     - Removed hardcoded Cha Cha's Kinalas Partner row.
     - Replaced with dynamic Business & Merchant Center:
       - Displays "Register Your Food Business" with "Start Business Onboarding" CTA and "Explore Partner Demo" button if user has no business.
       - Displays real registered business profile name, category tag, neighborhood, and "Manage Store & Menu ›" button once registered.
  5. **Business Registration & Onboarding Screen (`frontend/src/app/business-register.tsx`)**:
     - Built a 4-step interactive wizard:
       - Step 1: Establishment Basics & Category (Name, 7 culinary categories, tagline, 10 Naga districts, street address, hotline, hours, description).
       - Step 2: Branding & Atmosphere (Cover banner, logo avatar with camera/gallery picker and authentic Naga presets, and atmosphere/facility tags).
       - Step 3: First Signature Dish (Dish name, Bikol dialect name, category, price in ₱, prep time, description, photo).
       - Step 4: Review & Launch (Interactive storefront card preview, verification agreement, and live submission).
  6. **Merchant Portal Empty & Demo States (`frontend/src/app/business.tsx`)**:
     - Added empty state card for users without a registered business with 1-tap route to `/business-register` or demo preview mode.
     - Added yellow banner indicator when running in Demo Mode with link to register a real business.

### [2026-10-30] - Auth Flow: Route Successful Login and Onboarding to Home (`/home`)
- **User Request**: Login and the onboarding "Start Exploring Naga" action were returning to the landing page instead of the home dashboard.
- **Fix Applied**:
  - In [`frontend/src/app/login.tsx`](frontend/src/app/login.tsx), changed email/password and Google login success redirects to `/home`.
  - In [`frontend/src/app/onboarding.tsx`](frontend/src/app/onboarding.tsx), changed onboarding completion and skip redirects to `/home`.
  - Kept the onboarding back button pointed at `/` so users can intentionally return to the landing page.

### [2026-10-30] - App Entry: Landing Page First, Home Dashboard at `/home`
- **User Request**: Make the first page of the app the landing page instead of the home page.
- **Fix Applied**:
  - Updated [`frontend/src/app/index.tsx`](frontend/src/app/index.tsx) so the root `/` route renders the existing landing experience from `welcome.tsx`.
  - Moved the previous home dashboard implementation to [`frontend/src/app/home.tsx`](frontend/src/app/home.tsx).
  - Updated the floating navigation bar, business exit action, saved empty states, and web tab trigger to navigate to `/home`.

### [2026-10-30] - Business Portal: Updated Store Profile, Menu, and Promotion Images (`/business`)
- **User Request**: Replace outdated business store profile images and also update the promotion and store menu pages.
- **Fix Applied**:
  - In [`frontend/src/context/BusinessContext.tsx`](frontend/src/context/BusinessContext.tsx), added resolved local food image assets from `frontend/Food Images/`.
  - Updated the store profile cover/logo, default gallery, seeded menu products, and active promotion image to use matching local dish photos.
  - Kept the existing string-based profile/gallery contracts so photo picker uploads and existing renderers continue to work.

### [2026-11-05] - Food Basket & Orders: Dynamic Database Synchronization (`/basket`)
- **User Request**: Remove hardcoded food basket and ensure it actually fetches from the database and not hardcoded stuff.
- **Fix Applied**:
  - Created [`frontend/src/services/orderService.ts`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/services/orderService.ts) to interface directly with Supabase `public.user_orders` table (fetching user orders, inserting new orders upon checkout, updating statuses, and deleting canceled passes).
  - Cleaned up [`frontend/src/context/BasketContext.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/context/BasketContext.tsx):
    - Removed hardcoded `INITIAL_BASKET_ITEMS` (initial items now start empty `[]` and persist cleanly to `@naga_food_basket_items_v1` via AsyncStorage when users add dishes from menus/details).
    - Removed hardcoded `INITIAL_PRE_ORDERS`.
    - Added dynamic order loading via `OrderService.getUserOrders(user.id)` from Supabase `user_orders`.
    - `placePreOrder` now writes newly created pre-orders directly to `user_orders` in Supabase.
    - Status updates (`updateOrderStatus`, `advanceOrderStatusDemo`) and cancellations sync in real time with Supabase.
    - Added `isLoading` indicator handling and `refreshOrders` action to the context.
  - Updated [`frontend/src/app/basket.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/basket.tsx) to display an `ActivityIndicator` loading state when passes are being fetched from the database.

### [2026-10-30] - Food Basket: Updated Seeded Item Images (`/basket`)
- **User Request**: Replace outdated food basket images with the provided local food photos.
- **Fix Applied**:
  - In [`frontend/src/context/BasketContext.tsx`](frontend/src/context/BasketContext.tsx), added local image mappings for Kinalas, Sinanglay, Baduya, and toasted siopao.
  - Normalized initial cart items, seeded active passes, reset demo passes, and generated demo orders by `foodId` before they enter basket state.
  - Preserved custom/user-uploaded images and unknown food IDs as fallbacks.
  - The basket screen already uses `resolveFoodImage`, so local bundled assets render correctly in cart rows and order passes.

### [2026-10-30] - Social Feed: Diversified Seeded Posts (`/feed`)
- **User Request**: Reduce the feed so only the promoted post is about Kinalas.
- **Fix Applied**:
  - In [`frontend/src/data/socialFeedData.ts`](frontend/src/data/socialFeedData.ts), changed `post-1` to Baduya, `post-chacha-1` to Sinanglay, and `post-5` to Laing.
  - Updated each replacement post's local image, food ID, name, price, caption, insider tip, spice level, tags, and stale comment copy.
  - Preserved `ad-chacha-merienda` as the only seeded feed post with `foodId: 'kinalas'`; stories remain unchanged because they are separate from feed posts.

### [2026-10-30] - Social Feed: Replaced Seeded Social Photos with Local Food Images (`/feed`)
- **User Request**: Replace the social media page images with the provided food images.
- **Fix Applied**:
  - In [`frontend/src/data/socialFeedData.ts`](frontend/src/data/socialFeedData.ts), mapped all seeded feed posts and Naga Moments stories to the matching local assets in `frontend/Food Images/` (Kinalas, Bicol Express, Baduya, Sinanglay, toasted siopao, and Laing).
  - In [`frontend/src/components/feed/StoryViewerModal.tsx`](frontend/src/components/feed/StoryViewerModal.tsx), resolved story images through `resolveFoodImage` so bundled local assets render alongside remote URLs.
  - User-created post photos and profile avatars remain unchanged.

### [2026-10-29] - Milestone 1: Empirical Verification & Gap Analysis Challenge
- **Role**: Empirical Challenger M1_1
- **Actions Executed**:
  - Empirically verified all 9 defects identified in `AUDIT_GAP_ANALYSIS.md`.
  - Confirmed missing canonical establishment `pan-de-naga-heritage` causing trail truncation and route fallbacks.
  - Probed and confirmed 100% dish-to-visual mismatches for all 9 canonical dishes (foreign stock items: ramen, cold avocado salad, sourdough bread loaves, chocolate fudge cake; confirmed HTTP 404 for `crispy-pili` asset).
  - Traced and reproduced 9 occurrences of shorthand non-canonical IDs in `socialFeedData.ts` causing route fallbacks to Cha Cha's Kinalas.
  - Verified route parameter black hole in `frontend/src/app/map.tsx` where `selectedPlaceId` and `highlightId` are omitted from `useLocalSearchParams`.
  - Identified 3 minor precision errata in audit documentation (Pinangat actual spot count = 4; business.tsx map push line = 844–847; total unique Unsplash photo IDs = 19).
  - Static type checks confirmed clean (`npx tsc --noEmit` exited code 0).
  - Issued official verdict: **APPROVE**.

### [2026-10-27] - Social Media Feed: Instagram-Style Center Double-Tap Pop Heart Animation (`/feed`)
- **User Request**: "can u add this small thing, in the social media feed page, when i double tap the picture it should also show the heart animation in the center of the pick similar to instragram"
- **Fix Applied**:
  - In [`SocialFeedCard.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/feed/SocialFeedCard.tsx):
    - Added animated values `centerHeartScale` and `centerHeartOpacity` with native driver support.
    - Implemented `triggerCenterHeartAnimation`: Spring pops in to `1.25x` scale with bouncy friction, settles briefly at natural scale, and smoothly expands to `1.35x` while fading out.
    - Added an absolute center overlay (`Animated.View` with `pointerEvents="none"`) inside `mediaContainer` rendering a vibrant 96px `#FF3B30` red heart icon with soft drop shadow.
    - Connected to `handleDoubleTap` so double-tapping the media container instantly fires the center pop heart animation and likes the post.


### [2026-10-27] - Passport Stamping: Fixed Top Status Bar Cut-Off on Modal Darkened Backdrop
- **User Request**: "and also the darkend background when opening the stamp modal doesnt fully go way up so there are parts on top where the dark background is just cut off so having a light part on the background"
- **Root Cause Identified**:
  - React Native `<Modal>` on Android defaults to stopping beneath the system status bar unless `statusBarTranslucent={true}` is explicitly enabled, leaving the top 24–48px status bar unshaded and light.
  - In [`PassportStampModal.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/gamification/PassportStampModal.tsx), `styles.overlay` lacked `backgroundColor`, and the backdrop was trapped inside `KeyboardAvoidingView`.
- **Fix Applied**:
  - In [`PassportStampModal.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/gamification/PassportStampModal.tsx) and [`TrailStopDetailsSheet.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/trail/TrailStopDetailsSheet.tsx):
    - Added `statusBarTranslucent={true}` to `<Modal>` so the native window draws edge-to-edge behind the Android status bar and display cutouts.
    - Added `backgroundColor: 'rgba(0, 0, 0, 0.55)'` directly to `styles.overlay`.
    - Placed `styles.backdrop` with `position: 'absolute', top: 0, left: 0, right: 0, bottom: 0` directly under the root overlay view to guarantee a seamless, full-bleed darkened backdrop all the way to $y=0$.


### [2026-10-27] - Passport Stamping: Removed Forced Cropping on Photo Capture / Upload
- **User Request**: "remove the required to crop to take / upload a picture"
- **Fix Applied**:
  - In [`PassportStampModal.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/gamification/PassportStampModal.tsx):
    - Changed `allowsEditing` from `true` to `false` in both `launchCameraAsync` and `launchImageLibraryAsync`.
    - Removed `aspect: [4, 3]` constraint so photos are captured and uploaded directly at full fidelity without triggering an unwanted crop modal.


### [2026-10-27] - Trail Expedition & Passport Stamping: Replaced Bicolano Heat Level with Required Food Photo
- **User Request**: "in my trail page can u do this: 1. stamping something remove the bicolano heat level and instead require to take / upload a photo"
- **Issues Identified**:
  - The stamping workflow ([`PassportStampModal.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/gamification/PassportStampModal.tsx)) included a "Bicolano Heat Level" flame rating that didn't provide tangible authentication of the food trip.
  - The modal lacked live camera and photo capture support to verify dish visits.
- **Fixes Applied**:
  - In [`PassportStampModal.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/gamification/PassportStampModal.tsx):
    - Completely removed the "Bicolano Heat Level" chili rating and label section.
    - Integrated `expo-image-picker` with both `takePhoto` (camera capture with permissions handling) and `pickImage` (gallery selection).
    - Designed interactive photo card with dashed upload border, "REQUIRED" indicator badge, and dual "Take Photo" & "From Gallery" actions.
    - Implemented photo preview card with "✓ Tasting Authenticated" badge and tactile "Retake", "Gallery", and "Remove" controls.
    - Enforced strict photo requirement validation on submit: If no photo is selected, alerts user and prompts photo capture before stamping passport.
    - Wrapped the modal sheet in `<ScrollView showsVerticalScrollIndicator={false}>` with safe area & keyboard avoiding bounds.
  - In [`gamification.ts`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/data/gamification.ts) & [`QuestContext.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/context/QuestContext.tsx):
    - Made `spiceRating?: number` optional in `TastingEntry`.
    - Handled null-safe badge unlock logic for `sili-survivor` without regression.


### [2026-10-27] - Business Portal: Fixed "Choose from Gallery" Button Overflow in Create Post Modal
- **User Request**: "can u fix this simple ui fix as the choose from gallery text is too big for the button inside the create post modal for the business side"
- **Issues Identified**:
  - In [`CreateBusinessPostModal.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/business/CreateBusinessPostModal.tsx), the "Choose from Gallery" button text was styled with `fontSize: 15, fontWeight: '700'` and `paddingVertical: 13`.
  - The disproportionate font size combined with an 18px icon and 8px gap forced the 19-character string to overflow or wrap awkwardly on mobile viewports.
- **Fixes Applied**:
  - Reduced `uploadPrimaryBtnText` and `uploadSecondaryBtnText` to `fontSize: 13, fontWeight: '600', letterSpacing: -0.1`.
  - Scaled down button icons from `size={18}` to `size={16}` with a clean `gap: 6`.
  - Adjusted button flex ratios (`flex: 1.35` for Gallery vs `flex: 0.85` for Camera) and padding (`paddingVertical: 11, paddingHorizontal: 8, borderRadius: 12`).
  - Added `numberOfLines={1}`, `adjustsFontSizeToFit`, and `minimumFontScale={0.85}` to prevent text wrapping or button boundary breaks across all device sizes.


### [2026-10-27] - Community Feed: Sample Business Advertisement & Engagement Post (`/feed`)
- **User Request**: "in my feeds page, can u make a sample advertisement post, as to demonstrate what it would look like if a business decide to create an engagemet post /plan" & "okay i dont like thats its too long as the craving poll should be hidden in the comments"
- **Architectural & Design Upgrades Applied**:
  1. **Data Model Extensions (`socialFeedData.ts`)**:
     - Created `EngagementPollOption`, `EngagementPoll`, and `AdvertisementData` typed interfaces.
     - Added `isSponsored?: boolean` and `advertisement?: AdvertisementData` to `SocialPost`.
     - Seeded realistic sponsored post (`ad-chacha-merienda`) for partner eatery *Cha Cha’s Kinalas & Sinanglay* in `INITIAL_POSTS`, positioned prominently as post #2 on the feed.
  2. **Reactive Feed State (`SocialFeedContext.tsx`)**:
     - Implemented `voteOnPoll(postId, optionId)`: Dynamically tracks user pick, increments/decrements option vote counts, and computes community distribution percentages in real-time.
     - Implemented `claimVoucher(postId)`: Simulates 1-tap voucher redemption, updating `isClaimed = true` and incrementing claimed counters.
  3. **Streamlined Card Layout & Hidden-in-Comments Craving Poll**:
     - **Main Card Height Kept Compact (`SocialFeedCard.tsx`)**: Removed the tall craving poll container from the main feed card to prevent overwhelming card height and maintain fast, seamless feed scrolling.
     - **Sponsored Identity**: Distinctive terracotta accent border (`#FCD5CE`), `⚡ Promoted` badge with sparkles icon, and `Sponsored Ad` meta pill alongside district placement.
     - **Promotional CTA Ribbon**: Dedicated banner under the media with offer badge, headline (`⚡ Afternoon Merienda Rush: 20% OFF Kinalas Pass`), and 1-tap `Claim 20% Voucher` button with tactile toast notification.
     - **Comments Prompt**: Dynamic comment button pill (`Vote in Craving Poll in Comments (38) ›`) guiding users to the interactive poll.
     - **Pinned Store Poll in Comments Sheet (`CommentsBottomSheet.tsx`)**: The full interactive community poll (*"Which Kinalas ritual is your go-to afternoon merienda?"*) is pinned right at the top of the comments sheet with option pills, animated voting percentage progress bars, checkmark indicators, and voucher unlock callouts above the community discussion.
     - **Establishment Link**: Enhanced footer CTA (`Claim Pass & View Menu`) with direct route to `/establishment/cha-chas-kinalas`.

### [2026-10-26] - Merchant Portal Modal Visibility & Layout Fixes (`/business`)
- **User Request**: "and the cash out modal isnt visible on the modal its not fully visible all, same as the edit logo / edit cover modal too, same as the add photo"
- **Root Cause Identified**:
  - `modalBackdrop` was defined with `flex: 1` as a sibling in `modalOverlay: { flex: 1, justifyContent: 'flex-end' }`. On mobile and React Native Web, a flex sibling backdrop expands to consume all available height, pushing the bottom sheet downward and collapsing child `<ScrollView style={{ flex: 1 }}>` components.
  - `modalSheet` containers lacked an explicit `height: '88%'` / `height: '90%'` and only had `maxHeight`, preventing child `<ScrollView>` elements from calculating scrollable bounds.
  - In [`business.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/business.tsx), `modalBackdrop` also had `flex: 1` and `modalContent` had insufficient bottom padding.
  - Modals lacked prominent full-width action buttons at the bottom of the scrollable forms (e.g., Save Photo, Add Photo to Gallery, Save Profile Changes).
- **Architectural & Design Upgrades Applied**:
  1. **Absolute Backdrop Overlay**: Changed `modalBackdrop` to `{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }` in [`CashOutModal.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/business/CashOutModal.tsx), [`EditPhotoModal.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/business/EditPhotoModal.tsx), [`StoreGallerySection.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/business/StoreGallerySection.tsx), [`StoreSubscriptionModal.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/business/StoreSubscriptionModal.tsx), and [`business.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/business.tsx). This completely removes the backdrop from flex layout calculations, ensuring the modal sheet anchors at the bottom without vertical distortion or being pushed off-screen.
  2. **Definite Sheet Height & Scroll Bounds**: Added explicit `height: '88%'` (and `height: '90%'` for subscriptions) alongside `maxHeight: '92%'` so inner `<ScrollView style={{ flex: 1 }}>` properly computes scroll height and renders all form sections.
  3. **Scroll View Padding & Bottom Spacers**: Increased `modalContent` `paddingBottom` to `60` and appended a `<View style={{ height: 28 }} />` spacer below all bottom action buttons, guaranteeing 100% visibility above device home indicators and rounded corners.
  4. **Primary Ergonomic Bottom Buttons**:
     - In [`EditPhotoModal.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/business/EditPhotoModal.tsx): Added a full-width primary button (`Save Cover Banner` or `Save Profile Logo`) at the bottom of the scroll view with checkmark icon and iOS shadow.
     - In [`StoreGallerySection.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/business/StoreGallerySection.tsx): Added a full-width primary button (`Add Photo to Gallery`) with cloud upload icon at the bottom of the form.
     - In [`business.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/business.tsx): Added `Save Profile Changes` primary CTA at the bottom of the Business Info editor.
     - In [`CashOutModal.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/business/CashOutModal.tsx): Added bottom spacer below `Confirm Cashout of ₱...` button for comfortable thumb tapping.

### [2026-10-26] - Business Promote Tab: Fixed Launch Promo Button Overextension (`/business`)
- **User Request**: "in the prompt page of the business side the lunch promotion button is barely noticable due to it being overextending in the right side of the screen fix this improper spacing" & "you didnt fix it the launch promotion is still way past as the text as in the image this is trhe issue"
- **Root Cause Identified**:
  - In React Native on Android, child rows inside a vertical `<ScrollView>` do NOT bound their width to the screen viewport unless `width: '100%'` and `minWidth: 0` are explicitly applied to both containers and flex children.
  - The unconstrained subtitle text was causing Yoga to measure the title column at intrinsic width (~310px), expanding the row to 442px and shoving the red Launch Promo button 80px past the right screen boundary into the device bezel.
- **Architectural & Spacing Fixes Applied**:
  - In [`business.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/business.tsx):
    - Added `width: '100%'` to `mainScroll`, `scrollContent`, and `tabContainer`.
    - Added `width: '100%'`, `maxWidth: '100%'`, and `gap: 10` to `menuHeaderRow`.
    - Added `minWidth: 0`, `flexShrink: 1`, and `flex: 1` to `headerTitlesCol` so text wraps strictly within the remaining viewport width.
    - Shortened the subtitle to `"Broadcast deals to foodies across Naga City"` with `numberOfLines={2}` and `ellipsizeMode="tail"`.
    - Set `primaryActionBtn` with `flexShrink: 0`, `paddingHorizontal: 12`, `paddingVertical: 8`, and `fontSize: 12` bold label so the button aligns flush with the cards below with 16px padding on all mobile viewports.
  - In [`PromotionCard.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/business/PromotionCard.tsx), added `flexShrink: 1` to `badgeWrap` and `metaPill`, and `flexShrink: 0` to `headerRight` and `tierText` to prevent any horizontal overflow on narrow mobile viewports.

### [2026-10-26] - Store Menu: Removed Redundant Pen Icon (`/business`)
- **User Request**: "remove the pen icon, in the food tab"
- **Architectural & Design Upgrades Applied**:
  - In [`business.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/business.tsx), removed the redundant pencil icon from the food item action column.
  - Tapping anywhere on the food tab / card directly triggers the Edit Dish modal, maintaining a clean, uncrowded action column with only the in-stock switch, stock status text, and trash button.

### [2026-10-26] - Social Media Feed: Photo Upload & Camera Integration (`/feed`)
- **User Request**: "can u also apply the same picture picker in the social media page too"
- **Architectural & Design Upgrades Applied**:
  - In [`CreatePostModal.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/feed/CreatePostModal.tsx), removed all pre-defined stock photos (`INITIAL_GALLERY_PHOTOS`) and web-only `<input type="file" />`.
  - Integrated `expo-image-picker` with `pickImage` (device gallery) and `takePhoto` (camera capture with permissions verification).
  - Designed responsive empty state with "Choose from Gallery" (primary) and "Take Photo" (secondary bordered) buttons.
  - Implemented 1:1 Instagram-style media preview with "Change Photo", "Take Photo", and "Remove Photo" (trash action) controls.
  - Required photo selection before advancing to Step 2 (caption, tagging foodies, tagging eateries).

### [2026-10-26] - Store Menu: Full-Tab Click to Edit Dish (`/business`)
- **User Request**: "can u also make it that the edit modal also work in click on the tab of the food that i dont have to click the title of the food just to make it open"
- **Architectural & Design Upgrades Applied**:
  - In [`business.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/business.tsx), expanded the dish edit trigger across the entire food tab/card (`productMainPressable`).
  - Business owners can now tap anywhere on the food row (dish photo, name, Bikol title, signature badge, category, prep time, price, or empty padding) to immediately launch the Edit Dish modal.
  - Added subtle tactile press feedback (`productPressed` with `backgroundColor: 'rgba(0, 0, 0, 0.04)'`).
  - Added an explicit edit pencil icon (`pencil-outline`) in `itemActionsBottomRow` alongside the delete button for clear visual affordance.
  - Kept the "In Stock" switch completely isolated in `productActionsCol` so toggling availability never triggers the edit modal.

### [2026-10-26] - Business Menu Photo Upload & Food-Centric Category Overhaul (`/business`)
- **User Request**:
  1. "in the add menu modal add an option to upload picture of the food"
  2. "and remove the pre defined pictures for the food"
  3. "and make the category about the food not about the type like heritage or something"
  4. "apply the same fix to the edit modal"
- **Architectural & Design Upgrades Applied**:
  1. **Direct Photo Uploading & Camera Support**:
     - Installed and integrated `expo-image-picker: ~58.0.10`.
     - In [`AddProductModal.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/business/AddProductModal.tsx), completely purged the hardcoded `PHOTO_PRESETS` grid.
     - Added native photo picking with `launchImageLibraryAsync` and camera capture with `launchCameraAsync` (including permission checks with clear user alerts).
     - Built empty upload state with "Choose from Gallery" and "Take Photo" primary/secondary buttons.
     - Built preview state showing the uploaded photo with "Change Photo", "Take Photo", and "Remove Photo" (trash action) controls.
  2. **Food-Centric Category Model**:
     - Replaced heritage/culture taxonomy in [`mockData.ts`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/data/mockData.ts) (`MENU_FOOD_CATEGORIES`) with real food-based groupings:
       - `soups-noodles`: "Soups & Noodles" (Kinalas, mami, sinabawan)
       - `main-dishes`: "Main Dishes (Ulam)" (Bicol Express, laing, adobo)
       - `rice-meals`: "Rice Meals & Silog" (Tapsilog, carinderia rice plates)
       - `snacks-merienda`: "Snacks & Merienda" (Toasted siopao, kakanin, pancit)
       - `sides-extras`: "Sides & Add-ons" (Chicharon, egg, extra broth)
       - `desserts`: "Desserts & Sweets" (Pili delicacies, halo-halo)
       - `beverages`: "Beverages & Drinks" (Sago't gulaman, calamansi juice)
     - Updated category selection cards in [`AddProductModal.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/business/AddProductModal.tsx) with icons, clear labels, descriptions, and checkmark indicators.
  3. **Unified Add & Edit Modal Workflow**:
     - Both the Add Dish modal (`isAddProductOpen = true, editingProduct = null`) and the Edit Dish modal (`isAddProductOpen = true, editingProduct = product`) share `ProductForm` with `key={editingProduct?.id ?? 'new-product'}`.
     - When editing, existing dish images and food categories populate smoothly with instant preview, change photo, or retake options.

### [2026-10-26] - Business Portal Fixes: Mobile Blank Modal Resolution & Signature Badge Alignment (`/business`)
- **User Requests**:
  1. "in my kitchen order page can u make sample order where i can interact, update, and etc; remove simulated and rest demo order tabs; remove all tab"
  2. "the black circle of the receipt icon in the bottom navbar for the business isnt fully aligned with the icon"
  3. "in my store menu page in business apply this fixes: 1. the signature icon is not properly aligned as its overlapping way too much w/ the toggle option, 2. the add / edit modal doesnt work as it just open a blank modal"
  4. "i dont think your web view of the app is accurate as when viewed in mobile it doesnt show"
- **Issues Identified**:
  1. **Mobile Blank Modal Cause (Web vs Native Disparity)**:
     - On React Native Web, CSS flexbox and `Platform.select({ web: ... })` allowed modal containers to expand and display content.
     - On native mobile (iOS/Android), `Platform.select({ web: ... })` is stripped completely. `sheetContainer` had no explicit `height` and no native `width: '100%'`. Because its inner child was a `<ScrollView style={{ flex: 1 }}>`, React Native's Yoga C++ layout engine collapsed both width and height to 0, rendering an empty, invisible modal sheet with only the transparent dark backdrop visible.
     - Also, `...StyleSheet.absoluteFill` on the backdrop `Pressable` risked touch event conflicts on Android over non-positioned siblings.
  2. **Signature Badge Overlap with Toggle Option**:
     - Dish names were placed in a horizontal `flexDirection: 'row'` together with the signature badge on Line 1. Long dish titles pushed the badge directly into or over the in-stock toggle switch on mobile.
- **Architectural & Design Upgrades Applied**:
  1. **Universal Mobile Modal Sheet Layout**:
     - Updated [`AddProductModal.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/business/AddProductModal.tsx), [`CreatePromotionModal.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/business/CreatePromotionModal.tsx), and [`business.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/business.tsx) modal sheets with `width: '100%'`, `height: '88%'`, `maxHeight: '92%'`, `maxWidth: 600`, `alignSelf: 'center'`, `overflow: 'hidden'`, and native `elevation: 20`, `zIndex: 10`.
     - Changed the backdrop `Pressable` from `...StyleSheet.absoluteFill` to `flex: 1` so it sits above the bottom sheet in the layout flow, safely handling dismiss taps without blocking or intercepting touches on the modal sheet.
     - Added optional chaining to `editingProduct?.flavorProfile?.[0]` to prevent TypeError on undefined arrays.
  2. **Signature Badge Subrow Repositioning**:
     - Separated the dish item layout into Line 1 (full-width dish title with `flexShrink: 1` and `paddingRight: 14`) and Line 2 (`productSubRow` containing the `SIGNATURE` badge and Bikol dish name).
     - Dedicated `productActionsCol` with `justifyContent: 'center'`, `minWidth: 54`, and clean padding, guaranteeing 20px+ of buffer between content and the toggle switch.
  3. **Receipt Icon & Badge Alignment**:
     - Verified and aligned badge centering and icon sizing in the business bottom bar.

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

### [2026-10-26] - Store Menu: Full Card Click to Edit, Removed Pen Icon & Real Photo Picker
- **User Requests**:
  1. In store menu, add option to upload picture of the food and remove predefined pictures.
  2. Make categories food-centric (soups, mains, rice meals, snacks, sides, desserts, drinks).
  3. Make the edit modal open on clicking the food card/tab itself instead of only clicking the title.
  4. Remove the pen icon from the food tab.
- **Architectural & UI Upgrades Applied**:
  - In [`business.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/business.tsx), wrapped the entire dish card content in an outer `Pressable` trigger calling `openEditProduct(product)`.
  - Removed the redundant edit pencil icon button (`editPenButton`) from the food item card.
  - Kept the in-stock toggle switch isolated from the edit click trigger so toggling availability doesn't open the modal.

### [2026-10-26] - Community Feed: Unified Single-Screen Post Composer & Tagging Redesign (`CreatePostModal.tsx`)
- **User Requests**:
  1. "the choose from gallery text doesnt fit well inside the button as its to many for that little of a space"
  2. "you have removed the option to add caption, towards the post, and even tag food / place there"
- **Issues Identified**:
  - The previous 2-step Instagram flow hid caption, food tags, and eatery tags under an unannounced second step (`step === 'details'`) requiring the user to pick a photo and locate a small "Next" header button. This made it appear that captions and tagging were removed.
  - The gallery and camera buttons were split 50/50 horizontally in a single row, severely crowding the text "Choose from Gallery" on mobile screens.
- **Architectural & UI Upgrades Applied**:
  1. **Unified Single-Screen Composer**:
     - Eliminated multi-step progression entirely.
     - Placed author header, persistent multiline caption input, photo attachment controls, and tagging chips all on a single scrollable sheet.
  2. **Full-Width Action Buttons (Zero Text Cramping)**:
     - Stacked the gallery button (`Choose from Gallery`) and camera button (`Take Photo with Camera`) vertically in full width (`width: '100%'`) with comfortable horizontal padding, completely eliminating line breaks and text cramming.
  3. **Photo Attachment & Preview Controls**:
     - Tapping "Choose from Gallery" or "Take Photo with Camera" opens the native image picker with aspect ratio editing.
     - When an image is attached, renders a 16:9 / 4:3 high-definition preview card with quick action buttons: "Change", "Take Photo", and "Remove Photo" (trash action).
  4. **Dedicated Interactive Tagging Sections**:
     - **Tag Food / Dish**: Quick-tap chips from `FOOD_ITEMS` (Kinalas, Bicol Express, Toasted Siopao, Sinanglay, etc.) and an active tag pill with 1-tap clear.
     - **Tag Eatery / Spot**: Quick-tap chips from `ESTABLISHMENTS` (Cha-cha's, Geewan, Bob Marlin, Aling Cely's, etc.) and an active tag pill with 1-tap clear.
     - **Tag Foodies**: Quick-tap chips for community members (`@mariasantos`, `@paoloeats`, `@triciadee`).
  5. **Direct Submission**:
     - Primary "Share Post" button in the header and sticky bottom bar creates post with attached caption, image, food tag, eatery tag, foodie tags, and district metadata.
- **Verification**:
  - `npx tsc --noEmit` verified with 0 errors.

### [2026-10-26] - Full-Picture Image Picker & Dynamic Post Aspect Ratio (No Mandatory Cropping)
- **User Question & Request**:
  - "why is the picture picker add require cropping and not the full picture, and just dynamically adjust it on post if its horizontal / vertical to fit well on the app"
- **Issues Identified**:
  - `ImagePicker.launchImageLibraryAsync` and `launchCameraAsync` had `allowsEditing: true` and `aspect: [4, 3]`, which triggered the device's native cropping screen, forcing users to crop rectangular or vertical photos.
  - `SocialFeedCard.tsx` had a hardcoded `height: 300` on `mediaContainer` with `resizeMode: "cover"`, which cropped horizontal or portrait photos into an arbitrary box.
- **Architectural & UI Upgrades Applied**:
  1. **Disabled Mandatory Cropping**:
     - Removed `allowsEditing: true` and `aspect: [4, 3]` across both [`CreatePostModal.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/feed/CreatePostModal.tsx) and [`AddProductModal.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/business/AddProductModal.tsx).
     - Image pickers now return the full, uncropped photo as captured by the user.
  2. **Captured Natural Image Aspect Ratio**:
     - Captured `width` and `height` from `result.assets[0]` and computed `aspectRatio` (`width / height`).
     - Passed `aspectRatio` through `createPost` in [`SocialFeedContext.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/context/SocialFeedContext.tsx) and stored it on [`SocialPost`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/data/socialFeedData.ts).
  3. **Dynamic Responsive Feed Card Aspect Ratio (`SocialFeedCard.tsx`)**:
     - Replaced hardcoded `height: 300` on `mediaContainer` with dynamic `aspectRatio` clamped between `0.8` (4:5 portrait) and `1.91` (landscape).
     - If `aspectRatio` is absent (legacy posts), dynamically measures the image dimensions using `Image.getSize`.
     - Horizontal and vertical pictures now seamlessly display in full without cropping or distortion.
- **Verification**:
  - `npx tsc --noEmit` verified with 0 errors.

### [2026-10-26] - Post Composer Modal: Fixed 75% Width Image Shrinkage
- **User Issue**:
  - "now the issue is that when i upload the picture only cover 75% of the post in the modal but is okay when posted, fix this issue"
- **Root Cause**:
  - `styles.previewImage` had `maxHeight: 240` combined with `aspectRatio: 16 / 9` (and dynamic `aspectRatio`). In Yoga flexbox, applying `maxHeight` to an element with `aspectRatio` causes Yoga to shrink the element's width to `maxHeight * aspectRatio` whenever the natural height exceeds 240px. On square, portrait, or tall photos, this shrank the image width from 100% down to ~75% or 50%, leaving empty black space in the card.
- **Fix Applied**:
  - Removed `maxHeight: 240` from `previewImage`.
  - Added dedicated `previewImageWrapper` with `width: '100%'`, dynamic `aspectRatio` (clamped `0.8` to `1.91`), and `overflow: 'hidden'`.
  - Set `previewImage` to `width: '100%'`, `height: '100%'` with `resizeMode="cover"`, guaranteeing it always covers 100% of the modal card width edge-to-edge.
  - Added fallback `Image.getSize` to `pickImage` and `takePhoto` for reliable aspect ratio calculation across all devices and platforms.
- **Verification**:
  - `npx tsc --noEmit` verified with 0 errors.

### [2026-10-26] - Launch Promotion Overhaul: Image Attachment, Multi-Product Targeting & 2-Step Duration Pricing Checkout
- **User Request**:
  - "in the lunch promption can u do this: 1. ability to add image to the promotion, abilty to target multiple menu tiems 2. there should be an option to determin the cost / price of trhe promption like duration, of the promotion, and based on that the cost so like a 2nd page before publishing z u can take inspiration and use the same payment logic w/ the basket checkout payment page"
- **Architectural & UI Upgrades Applied**:
  1. **Business Promotion Data Model (`BusinessContext.tsx`)**:
     - Extended `PromotionCampaign` with `image?: string`, `featuredProductIds?: string[]`, `featuredProductNames?: string[]`, `durationDays?: number`, `cost?: number`, `paymentMode?: 'cash' | 'gcash' | 'maya' | 'store_balance'`, and `paymentRef?: string`.
  2. **2-Step Wizard & Image Attachment (`CreatePromotionModal.tsx`)**:
     - **Step 1 (Creative & Menu Targeting)**:
       - Integrated `expo-image-picker` with "Choose from Gallery" and "Take Photo with Camera" options and an interactive 16:9 banner preview with Change/Remove controls.
       - Multi-product targeting: Checkbox selection of products with food thumbnail, dish name, category, and price, plus a 1-tap "Select All Items" / "All Menu Items" toggle.
       - Live customer discovery preview with real-time banner display, offer badge, and targeted dishes pill.
     - **Step 2 (Duration, Budget & Payment Checkout)**:
       - Modeled after the basket checkout payment page (`payment.tsx`).
       - Duration presets with reach estimations:
         - 1 Day Flash Rush: ₱99 (~1,500 foodies reach)
         - 3 Days Weekend Booster: ₱249 (~5,000 foodies reach - Popular)
         - 7 Days Weekly Spotlight: ₱499 (~14,000 foodies reach - Best ROI)
         - 14 Days Fortnight Sprint: ₱899 (~30,000 foodies reach)
         - 30 Days Monthly Anchor: ₱1,699 (~70,000 foodies reach - Max Value)
       - Itemized price breakdown: Campaign run fee, multi-dish spotlight included (₱0), platform fee waived (₱0), and total due.
       - Payment mode options:
         - **GCash**: Instant e-wallet payment with mobile number verification.
         - **Maya / QR Ph**: National QR code generation with tap-to-enlarge full-screen QR modal.
         - **Store Payout Balance**: Direct deduction from upcoming carinderia payout balance.
       - Simulated instant gateway verification (600ms) generating reference numbers (e.g., `GCASH-XXXXX`, `QRPH-XXXXX`, `STORE-BAL-XXXXX`) and celebratory confirmation modal.
  3. **Promotion Card Display (`PromotionCard.tsx`)**:
     - Displays the uploaded promo image banner at the top of active/paused cards with an overlay badge.
     - Displays duration and cost badge (e.g. `₱249 · 3d (GCASH)`).
     - Displays targeted dishes pill listing multiple selected items or `All Menu Items`.
- **Verification**:
  - `npx tsc --noEmit` verified with 0 errors.

### [2026-10-26] - Launch Promotion Fixes: Blank Initial Photo State & Payment Pill Alignment
- **User Request**:
  - "in the modal apply this fix: 1. remove the pre built in default photo start w/ a blank photo 2. fix the spacing issue w/ the no cards needed pill in the decut from store balance as its overextending to the right"
- **Issues Identified**:
  1. `promoImage` was pre-initialized with a hardcoded mock image URL instead of starting empty (`null`).
  2. In the "Deduct from Store Balance" payment card, the label text ("Deduct from Store Balance") combined with the "NO CARDS NEEDED" badge on an unconstrained row exceeded the container width on narrow mobile viewports, pushing the badge past the right border.
- **Fixes Applied**:
  1. Initialized `promoImage` to `null` and added `useEffect` reset on modal open (`visible === true`) so the modal always starts cleanly with an empty photo state and displays the gallery/camera upload prompt.
  2. Shortened the label to `"Deduct from Balance"`, applied `minWidth: 0` to `methodDetails`, added `methodTitleRow` with `flexWrap: 'wrap'` and `gap: 6`, and added `flexShrink: 0` to `popularBadge` to guarantee the badge never clips or overextends horizontally.
- **Verification**:
  - `npx tsc --noEmit` verified with 0 errors.

### [2026-10-26] - Promotion Photo Picker: Removed Forced Image Cropping
- **User Request**:
  - "the issue came back again in the promotion picture taker as its automatically asking to crop the image not like add menu / post media picker fix this"
- **Root Cause**:
  - In [`CreatePromotionModal.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/business/CreatePromotionModal.tsx), `handlePickFromGallery` and `handleTakePhoto` had `allowsEditing: true` and `aspect: [16, 9]`. On Android and iOS devices, `allowsEditing: true` forces the OS crop/edit UI before the photo can be selected, unlike [`AddProductModal.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/business/AddProductModal.tsx) and [`CreatePostModal.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/feed/CreatePostModal.tsx) which use `allowsEditing: false`.
- **Fix Applied**:
  - Set `allowsEditing: false` and removed `aspect: [16, 9]` in both `handlePickFromGallery` and `handleTakePhoto`.
  - Bumped quality to `0.9` to match the exact behavior and snappy 1-tap photo attachment flow of Add Menu and the Post Media Picker.
- **Verification**:
  - `npx tsc --noEmit` verified with 0 errors.

### [2026-10-26] - Business Bottom Navbar Overhaul, Dedicated Store Posts Tab & Public Feed Pill Removal
- **User Requests**:
  1. "in my business bottom navbar, can u make it that there is no red tab, instead just a normal tab, as i want to create a social media tab for busienss where they can post and see their post only like a view page of their post"
  2. "remove the public feed pill in the store posts box"
- **Architectural & UI Upgrades Applied**:
  1. **Uniform 5-Tab Business Navbar (`BusinessNavBar.tsx`)**:
     - Updated `BusinessTab` definition to `'orders' | 'menu' | 'posts' | 'promote' | 'store'`.
     - Removed the elevated red circular center button and `onCenterPress` prop.
     - Styled all 5 tabs identically with balanced 42×42 circular dark pill button styling (`#1C1C1E` when active, transparent when inactive).
  2. **Social Feed Integration for Establishments (`SocialFeedContext.tsx`, `socialFeedData.ts`)**:
     - Added `deletePost: (postId: string) => void` to allow store owners to manage their broadcasts.
     - Extended `createPost` to support `postType?: 'regular' | 'review' | 'tip' | 'moment'`, custom author avatar, and author handle.
     - Seeded initial store post for `cha-chas-kinalas` (`post-chacha-1`) with customer comments and foodie likes.
  3. **Merchant Post Composer (`CreateBusinessPostModal.tsx`)**:
     - Fast image attachment via gallery or camera with `allowsEditing: false` preserving uncropped natural aspect ratio.
     - Category pills: `Fresh Batch`, `Daily Special`, `Dish Spotlight`, `Announcement`.
     - Multi-line caption with character counter and quick Naga hashtags (`#NagaStreetFood`, `#BicolFlavors`, `#KinalasKing`, `#SpicyBicol`).
     - Optional store dish tagging linking menu items with thumbnail and live price badge.
  4. **Dedicated Store Post Card (`BusinessPostCard.tsx`)**:
     - Displays merchant avatar, verified checkmark, relative timestamp, category badge, and natural aspect ratio photo.
     - Floating tagged dish badge (`Ionicons name="restaurant"` + price).
     - Caption with expandable Read more/Show less toggle.
     - Interactive like toggle with bounce animation, comments counter with bottom sheet opener, and post deletion action with confirmation.
  5. **Business Dashboard Integration & Clean Public Feed Pill Removal (`business.tsx`)**:
     - Scoped `businessPosts` to the active merchant establishment (`post.establishmentId`, `author.id`, or matching name).
     - Merchant social profile header card with 3-column stats strip: `Posts`, `Foodie Likes`, `Comments`.
     - Removed the "Public Feed" pill button from the store social profile card per user instruction.
- **Verification**:
  - `npx tsc --noEmit` verified with 0 errors.

### [2026-10-26] - Store Posts Follower Counter & Post Modal Button Typography Polish
- **User Requests**:
  1. "instead of comments counter, add a follower count"
  2. "in the new store post modal. the choose from gallery text is a bit too small inside the button"
- **Enhancements Applied**:
  1. **Store Follower Counter Metric & Reordering (`BusinessContext.tsx`, `business.tsx`)**:
     - Added `followersCount?: number` to `BusinessProfile` (defaulting to 1,420 followers for `cha-chas-kinalas` and 960 for other eateries).
     - In [`business.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/business.tsx), replaced the comments counter column in `bizSocialStatsRow` with a dedicated `Followers` counter (`formattedFollowers`, e.g., `1.4k`).
     - Reordered the 3-column merchant social metric strip to: **`Followers` -> `Foodie Likes` -> `Posts`**.
  2. **Post Modal Button Typography & Hit Target Polish (`CreateBusinessPostModal.tsx`)**:
     - Enlarged "Choose from Gallery" button text from `fontSize: 13` to `fontSize: 15` (`fontWeight: '700'`).
     - Increased button padding from `paddingVertical: 11` to `paddingVertical: 13`.
     - Rebalanced button flex (`flex: 1.25` for "Choose from Gallery", `flex: 0.85` for "Take Photo") so the longer gallery label has ample breathing room without clipping or wrapping.
     - Bumped icon size from 16 to 18 (`Ionicons name="images"`).
- **Verification**:
  - `npx tsc --noEmit` verified with 0 errors.

### [2026-10-26] - Redesign Store Profile Tab: Facebook-Style Profile Cover & Logo, Merchant Wallet & Cash Out, and Store Photo Gallery
- **User Requests**:
  1. "include a profile logo in that page, where the user can edit easily w/ a pen icon in that, similar to how it looks like from logo and banner, like in facebook"
  2. "add additional things like, a store wallet, and a way to cashout it"
  3. "details about their page"
  4. "remove the active restaurant part, instead a section to add pictures about their business, like gallery"
  5. "overall improve the looks of the page"
- **Architectural & UI Upgrades Applied**:
  1. **Facebook-Style Profile Header (`business.tsx`, `EditPhotoModal.tsx`)**:
     - 16:9 full-width cover banner with camera edit pill button (`#FFFFFF` with translucent black background).
     - Circular avatar logo overlapping cover (-44px margin) with 4px border and blue pencil edit badge.
     - Brand identity display: Store name, verified badge, culinary tagline, subtype & neighborhood, rating pill with review count, follower metric pill, and 2 quick action buttons ("Edit Details", "View Public Page").
     - `EditPhotoModal`: modal for updating either banner or logo with 5 curated Naga City photography presets or custom image URL with live preview.
  2. **Store Earnings Wallet & Cashout Flow (`BusinessContext.tsx`, `StoreWalletCard.tsx`, `CashOutModal.tsx`)**:
     - Extended `BusinessProfile` with `wallet: StoreWallet` (`availableBalance`, `todayEarnings`, `pendingBalance`, `lifetimePaid`, `payouts`).
     - `StoreWalletCard`: fintech card displaying balance, daily earnings badge, pending funds, lifetime payouts, and "Cash Out" CTA button with collapsible payout transaction history.
     - `CashOutModal`: modal with quick amount chips (₱1,000, ₱2,500, ₱5,000, Max), channel selector (GCash, Maya, Bank Transfer), account number input, service fee breakdown, and transaction processing.
  3. **Rich Store Details & Operations Inset (`business.tsx`)**:
     - Operating hours with live open/closed toggle switch.
     - Address & District with direct shortcut to `/map` with `selectedPlaceId`.
     - Order hotline with one-touch phone information.
     - About & Culinary Heritage story card.
     - Store atmosphere and vibe tags strip.
  4. **Store Photo Gallery Section (`StoreGallerySection.tsx`)**:
     - Removed the old "Switch Active Restaurant / Stall" switcher.
     - Added comprehensive photo gallery section with photo counter, category filter chips (`All`, `Food`, `Interior`, `Kitchen`, `Staff`), 2-column image grid, and fullscreen lightbox photo viewer with delete capability.
     - Integrated `AddPhotoModal` with 6 preset Naga food/store photos, custom URL and caption inputs.
     - Synchronized gallery and logo updates with global `ESTABLISHMENTS` so customer-facing `/establishment/[id]` updates instantly.
- **Verification**:
  - `npx tsc --noEmit` verified with 0 errors.

### [2026-10-26] - Store Wallet iOS Light Theme Polish, Sparkle Emoji Removal & Gallery 2-Column Grid Fix
- **User Requests**:
  1. "the store earning wallet feels so out of place, it feels so out of place from its color, and etc, and the exesive use of sparek emoji is a sign of vibe coding practice in the page"
  2. "the business gallery is not properly organize, as its 1 columns for all picture"
- **Issues Identified**:
  - The previous store wallet used a pitch-black `#1C1C1E` dark fintech card with neon green digits and amber lightning badges that clashed with the app's clean white/warm aesthetic.
  - Sparkle icons (`Ionicons name="sparkles"`) were rendered inside every tag chip under "Store Atmosphere & Vibe", creating an amateur "vibe coding" look.
  - The business gallery grid used `flexWrap: 'wrap'` with `width: '48.5%'` and `gap: 10`, which suffered from subpixel rounding on mobile/web viewports, forcing photos into a single collapsed column.
- **Architectural & UI Upgrades Applied**:
  1. **Cohesive iOS Light Theme Store Wallet (`StoreWalletCard.tsx`)**:
     - Swapped background from pitch-black `#1C1C1E` to clean Apple iOS card white (`#FFFFFF`) with subtle border (`#EFEFF4`) and soft elevation.
     - Styled available balance in crisp `#000000` typography with subtle uppercase labels (`#8E8E93`).
     - Removed neon green and amber lightning "Real-Time Payout" badge; replaced with a calm, professional `Settled Daily` badge.
     - Styled "Cash Out Funds" CTA in signature Naga brand red (`#D42F13` with white text) and "Payout Records" toggle in light gray (`#F2F2F7`).
     - Balanced 3-column metric strip (Today's Revenue, Pending Clearing, Lifetime Withdrawn) with clean dividers and high-legibility numbers.
  2. **Removed Sparkles & Vibe Coding Elements (`business.tsx`)**:
     - Renamed "Store Atmosphere & Vibe" section to "Store Features & Amenities".
     - Removed `<Ionicons name="sparkles" />` from every chip.
     - Re-styled chips into grounded, professional iOS feature tags (`#F2F2F7` background, 1px `#E5E5EA` border, `#3C3C43` font).
  3. **Guaranteed 2-Column Gallery Grid (`StoreGallerySection.tsx`)**:
     - Eliminated fragile `flexWrap` single-row percentage math.
     - Split filtered photos into two dedicated column streams (`col1Photos` for even indices, `col2Photos` for odd indices) inside two parallel `flex: 1` column wrappers (`columnsContainer` with `gap: 10`).
     - Structured each item as a structured photo card (`photoCard`) with dedicated image container (`photoImageContainer`), high-contrast category tag, and bottom metadata bar (`photoMetaBar`) showing caption and date.
- **Verification**:
  - `npx tsc --noEmit` verified with 0 errors.

### [2026-10-26] - Naga Merchant Pro Store Subscription System & Capability Paywall Gating
- **User Request**:
  - "and also in the store profile page this is very important, add a banner for the store subscription which the point is to unlock the full apps' cabaility, from verified banner, ability to accept orders, use the promote features, and store wallet, and overall promoted store / post algortihm and have proper payment process to unlock this, and a way that pages are disable / hidden while payment isnt made yet"
- **Architectural & Feature Implementations**:
  1. **Global Subscription State (`BusinessContext.tsx`)**:
     - Added `StoreSubscription` interface (`status: 'active' | 'inactive'`, `plan: 'monthly' | 'annual' | 'none'`, `expiryDate`, `autoRenew`, `paymentMethod`, `paymentRef`, `subscribedSince`).
     - Initialized `profile.subscription` as `{ status: 'inactive', plan: 'none', autoRenew: false }` to support immediate out-of-the-box paywall testability.
     - Implemented `subscribeStore(plan, method)` and `cancelSubscription()`, persisting plan and transaction metadata across establishment switches.
  2. **Store Subscription Banner (`StoreSubscriptionBanner.tsx`)**:
     - Positioned right above the Store Wallet Card in the Store Profile tab.
     - Unsubscribed: Displays "MERCHANT PRO UPGRADE" pill, ₱499/mo pricing, 5-point capability checklist (Official Blue Checkmark, Kitchen Order Queue, Store Wallet Settlements, Sponsored Promoted Deals, 3x Algorithm Discovery Boost), and direct upgrade CTA.
     - Subscribed: Displays "PRO PARTNER ACTIVE" badge, active tier, next renewal date, payment method, partner ID, and subscription management button.
  3. **Feature & Capability Paywall Gating (`MerchantPaywallGate.tsx` & `business.tsx`)**:
     - **Verified Checkmark**: Conditionally rendered in store header only when `profile.subscription?.status === 'active'`. When unverified, displays a subtle iOS shield pill prompting one-tap subscription checkout.
     - **Kitchen Orders Tab (`activeTab === 'orders'`)**: Replaced with `MerchantPaywallGate` explaining pre-order ticket benefits and instant conversion CTA when unpaid.
     - **Promote & Reach Tab (`activeTab === 'promote'`)**: Replaced with `MerchantPaywallGate` detailing top-of-feed spotlighting, 3x algorithm boost, and reach metrics when unpaid.
     - **Store Wallet Cash Out (`StoreWalletCard.tsx`)**: Gated behind `isSubscribed` check; displays "Unlock Pro to Cash Out" with lock icon when unpaid, routing merchants to the payment modal.
  4. **Complete Philippine Payment Gateway Checkout (`StoreSubscriptionModal.tsx`)**:
     - Step-by-step subscription flow with Plan Switcher (Monthly ₱499/mo vs Annual ₱4,999/yr, Save 20% + 2 Months Free).
     - Full itemized capability checklist with color-coded icons.
     - Multi-channel Philippine payment methods: GCash (official SVG), Maya / QR Ph (official SVG + tap-to-enlarge QR Ph modal with real QR generator), and Debit/Credit Card / Bank Transfer.
     - Simulated gateway processing with spinner and SSL encryption indicator.
     - Instant activation celebration modal displaying Partner ID, active checkmark, and direct "Return to Store Profile" CTA.
- **Verification**:
  - `npx tsc --noEmit` verified with 0 errors.

### [2026-10-26] - Business Modal Sheet Visibility & Default Store Profile Tab from Settings
- **User Requests**:
  1. "and the cash out modal isnt visible on the modal its not fully visible all, same as the edit logo / edit cover modal too, same as the add photo"
  2. "when i open form the user's settings to swtich to business portal make it default open the store profile page not orders"
- **Issues Identified**:
  - In `CashOutModal.tsx`, `EditPhotoModal.tsx`, `StoreGallerySection.tsx`, `StoreSubscriptionModal.tsx`, and `business.tsx`, modal sheets were cut off or not completely visible on screen. Placing a `flex: 1` backdrop Pressable next to the sheet in a `justifyContent: 'flex-end'` container pushed the sheet downwards off-screen and caused child `ScrollView` elements to collapse.
  - When opening `/business` from the user settings/profile page (`profile.tsx`), the screen defaulted to the Kitchen Orders tab (`'orders'`) instead of the merchant's Store Profile page (`'store'`).
- **Architectural & Design Upgrades Applied**:
  1. **Full Visibility & Anchoring for Bottom Sheets**:
     - Swapped sibling flex backdrops for absolute positioned overlays `{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }`, decoupling sheet positioning from the backdrop.
     - Provided explicit sheet heights (`height: '88%'` / `height: '90%'`) and generous bottom padding (`paddingBottom: 60`), ensuring action buttons and inputs remain 100% visible and accessible.
     - Added dedicated full-width bottom primary action buttons inside `EditPhotoModal` ("Save Cover Banner" / "Save Profile Logo"), `StoreGallerySection` ("Add Photo to Gallery"), and `business.tsx` ("Save Profile Changes").
  2. **Default to Store Profile on Switch from Settings (`profile.tsx` & `business.tsx`)**:
     - Updated settings route in [`profile.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/profile.tsx) from `/business` to `/business?tab=store`.
     - In [`business.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/business.tsx), imported `useLocalSearchParams<{ tab?: string }>()` and set initial `activeTab` to `'store'` by default.
     - Added dynamic `useEffect` synchronization so explicit tab deep links (`?tab=orders`, `?tab=menu`, `?tab=posts`, `?tab=promote`, `?tab=store`) switch tabs seamlessly upon arrival.
- **Verification**:
  - `npx tsc --noEmit` executed with 0 errors.

### [2026-10-26] - Store Subscription Banner Polish & Wallet Locked State Refinement
- **User Requests**:
  1. "in the banner of unlocking the app in the store profile remove the pill of unlock full app as its redundant"
  2. "remove the sparkle icon used in the subscrine now button"
  3. "shorten the text inside the unlock pro to cash out as its a bit too long for that, and when its not unlock make the number just be 0"
- **Architectural & Design Upgrades Applied**:
  1. **Redundant Pill Removal (`StoreSubscriptionBanner.tsx`)**:
     - Removed the secondary `"Unlock Full App"` pill badge next to `"PARTNER SUBSCRIPTION"` from the banner's header row.
  2. **Sparkle Icon Removal (`StoreSubscriptionBanner.tsx` & `StoreSubscriptionModal.tsx`)**:
     - Removed `sparkles-outline` icon from the `"Subscribe Now to Unlock Full App"` button in the banner.
     - Replaced `sparkles` with clean `pricetag` icon in the modal's annual plan savings note.
  3. **Concise Cash Out CTA & Zeroed Numbers When Locked (`StoreWalletCard.tsx`)**:
     - Shortened the locked cash out action button text from `"Unlock Pro to Cash Out"` to `"Unlock Cash Out"` (15 characters vs 22 characters), preventing mobile button wrapping.
     - When unverified/unpaid (`!isSubscribed`), dynamically set the displayed available balance to `₱0` and reset today's revenue, pending clearing, and lifetime withdrawn metrics to `0` (so unpaid merchants don't see active earnings before unlocking).
     - Gated recent payout records to display `"No payouts requested yet."` when not subscribed.
- **Verification**:
  - `npx tsc --noEmit` executed with 0 errors.

### [2026-10-26] - Welcome to Merchant Pro Modal Features Layout Adjustment
- **User Request**: "in the welcome to merchant pro modal, the featues its too much for the limited space in their row, so adjust it accordingly"
- **Issues Identified**:
  - In `StoreSubscriptionModal.tsx` on the post-checkout celebration screen (`isSuccess`), unlocked features were previously crammed on a single horizontal row (`UNLOCKED FEATURES` on the left, `Orders · Wallet · Promos · Boost` on the right). On mobile viewports, the text wrapped awkwardly or clipped against the label.
- **Architectural & Design Upgrades Applied**:
  - Replaced the cramped single-line row with a dedicated, spacious `unlockedBlock` inside `successCard`.
  - Structured the features as a multi-tag chip group (`unlockedChipsContainer`) displaying 4 discrete, clear badges with green checkmarks:
    - `Kitchen Orders`
    - `Store Wallet`
    - `Promotions`
    - `3x Feed Boost`
  - Wrapped the celebration view in a vertical `ScrollView` (`successScrollContent`) ensuring comfortable scrolling on smaller devices.
- **Verification**:
  - `npx tsc --noEmit` executed with 0 errors.

### [2026-10-26] - Compact Subscribed Banner Redesign & Cramped Pills Removal
- **User Request**: "when subscribe banner, remove the pills of 'annual plan (20%) off, and etc, as its doesnt sit well or fit inside the limited space and the subscribe banner doesnt need to be very long, just a simle small banner showing the subscription label and status is enough"
- **Issues Identified**:
  - In `StoreSubscriptionBanner.tsx`, when `isSubscribed` was active, the banner rendered a large multi-section card with cramped pills ("Annual Plan (20% Off)"), a long descriptive paragraph, and a 3-column footer that overwhelmed the store profile's top viewport.
- **Architectural & Design Upgrades Applied**:
  - Replaced the large card with a sleek, compact, single-tap banner (`subscribedCompactBanner`):
    - Left side: Blue shield checkmark icon box + `"Naga Merchant Pro"` label + `"ACTIVE"` status pill + concise subtitle `"All Pro Capabilities Unlocked"`.
    - Right side: Clean `"Manage"` link with chevron forward opening the subscription modal.
    - Removed cramped pills ("Annual Plan (20% Off)") and bulky paragraphs, cutting banner height by ~75%.
- **Verification**:
  - `npx tsc --noEmit` executed with 0 errors.

### [2026-10-26] - Official Brand SVG Assets for Wallet Cash Out & Payout Records
- **User Request**: "the cahsout of the wallet isnt the same as the other cashout page, as it doesnt use the same icon for the gcash, and maya"
- **Issues Identified**:
  - `CashOutModal.tsx` was using generic Ionicons (`phone-portrait-outline` for GCash, `wallet-outline` for Maya) instead of the official SVG brand assets used across the app (such as in `payment.tsx` and `StoreSubscriptionModal.tsx`).
  - `StoreWalletCard.tsx`'s collapsible payout history list was also using generic Ionicons for historical payout channels.
- **Architectural & Design Upgrades Applied**:
  - **Cash Out Channel Selector (`CashOutModal.tsx`)**:
    - Replaced the generic Ionicons with `<ExpoImage>` loading official SVG assets from `assets/icons/`:
      - GCash: `gcash.svg` (26×22, `#EBF4FF` background).
      - Maya: `maya.svg` (30×16, `#F0FDF4` background).
    - Preserved Bank Transfer (`business-outline`).
  - **Payout History Records (`StoreWalletCard.tsx`)**:
    - Upgraded `historyMethodIcon` to render `gcash.svg` (18×16) and `maya.svg` (20×11) inside their respective brand background badges, matching the rest of the application's checkout and payment flows.
- **Verification**:
  - `npx tsc --noEmit` executed with 0 errors.

### [2026-10-26] - Unified Native ImagePicker for Store Logo, Cover Banner & Business Gallery
- **User Request**: "and also why is the edit profile for both the logo and banner in store profile, doesnt have the same file picker as for the other like in the add menu, and etc, as remove the press and the add picture url there"
- **Issues Identified**:
  - `EditPhotoModal.tsx` and `StoreGallerySection.tsx` previously used static preset image lists and custom URL text inputs instead of the native photo library / camera picker used in `AddProductModal.tsx` ("add menu").
- **Architectural & Design Upgrades Applied**:
  - **Store Profile Logo & Cover Banner (`EditPhotoModal.tsx`)**:
    - Removed `PRESET_BANNERS`, `PRESET_LOGOS`, preset cards grid, and custom URL text inputs.
    - Integrated `* as ImagePicker from 'expo-image-picker'` with `launchImageLibraryAsync` and `launchCameraAsync`.
    - Implemented a unified upload card pattern:
      - If image is chosen: displays live preview (16:9 for cover banner, 1:1 circular badge for profile logo) with `"Choose from Gallery"`, `"Take Photo"`, and `"Remove Photo"` action buttons.
      - If no image: displays a styled dashed upload box with camera icon, title, subtitle, and primary `"Choose from Gallery"` + secondary `"Take Photo"` buttons.
  - **Business Gallery Add Photo (`StoreGallerySection.tsx`)**:
    - Removed `GALLERY_PRESETS` and URL input.
    - Added the same `pickImage` / `takePhoto` upload box & preview flow, maintaining consistency across every photo upload interface in the business portal.
- **Verification**:
  - `npx tsc --noEmit` executed with 0 errors.


---

## AI Changelog — 2026-10-30: Authentic Naga Culinary Data Overhaul

### Summary
Full audit, research, and implementation of authentic Naga City (Bicol) culinary data replacing all mismatched stock photos, ghost IDs, and incorrect geographic labels.

### Data Layer Changes

**`frontend/src/data/mockData.ts`** — FULLY REWRITTEN
- `FOOD_ITEMS`: 9 → 15 authentic Bicolano dishes. Added: `laing`, `kinunot`, `sinantol`, `tilmok`, `baduya`, `naga-night-skewers`
- All 15 dish images replaced with Unsplash photos accurately matching each dish
- `ESTABLISHMENTS`: 8 → 14 verified Naga venues. Added: `cha-kamot-kinalas`, `biggs-diner-centro`, `biggs-diner-magsaysay`, `red-platter`, `chef-doys-restaurant`, `3n-bakery-triangulo`, `pan-de-naga-heritage`
- Fixed Aling Cely's address (Barlin/Dimasalang St., Santa Cruz — not Bagumbayan Sur)
- `street-grill` category: 0 → 2 dishes (`baduya`, `naga-night-skewers`)

**`frontend/src/data/gamification.ts`** — UPDATED
- `FOOD_TRAILS`: 3 → 4 trails. Added `trail-penafrancia-pilgrimage`
- Updated existing trail establishment sequences with correct verified IDs
- Added 9 new `DISH_INSIDER_TIPS` for new and updated dishes
- `getTrailById()`: extended fuzzy aliases for new trail slugs
- `NAGA_DISTRICTS_DATA`: `spotsCount` reconciled with actual establishment counts

**`frontend/src/data/socialFeedData.ts`** — FIXED
- Normalized all 5 short establishment IDs → full IDs:
  - `'chacha-kinalas'` → `'cha-chas-kinalas'`
  - `'bob-marlin'` → `'bob-marlin-restaurant'`
  - `'bakers-plaza'` → `'bakers-plaza-naga'`
  - `'geewan'` → `'geewan-bicolano-eatery'`
  - `'aling-cely'` → `'aling-celys-kinalasan'`
- Fixed geographic inversions in post districts:
  - Post-1 (Cha Cha's): `'Bagumbayan Norte'` → `'Barlin St., Santa Cruz, Naga City'`
  - Post-4 (Baker's Plaza): `'Plaza Quezon, Centro'` → `'Panganiban Drive, Naga City'`

### Context Layer Changes

**`frontend/src/context/BasketContext.tsx`** — FIXED ghost food IDs
- `foodId: 'puto'` → `foodId: 'baduya'` (3 occurrences)
- `foodId: 'gravy'` → `foodId: 'kinalas'` (1 occurrence)

**`frontend/src/context/BusinessContext.tsx`** — FIXED
- `foodId: 'bakery-merienda'` → `foodId: 'toasted-siopao'` (line 320)
- Gallery image `photo-1552611052` (generic kitchen) → `photo-1583860788934` (kitchen prep scene)

**`frontend/src/context/QuestContext.tsx`** — FIXED
- `INITIAL_TASTINGS`: kinalas image replaced with accurate photo `1594998893017`

**`frontend/src/context/SocialFeedContext.tsx`** — No change (avatar fallback is appropriate)

### Component Changes

**`frontend/src/app/map.tsx`** — ENHANCED
- `useLocalSearchParams` now includes `selectedPlaceId?: string` and `highlightId?: string`
- Added `useEffect` to auto-select establishment when navigating from another screen
- Added `useEffect` import

**`frontend/src/components/home/NagaQuestCarousel.tsx`** — UPDATED
- Added `banner4` (remote URI) for 4th quest card
- Added 4th quest: `trail-penafrancia-pilgrimage` — "Peñafrancia Pilgrim Trail" (+200 XP)
- `DEFAULT_BANNER_IMAGES`: 3 → 4 items

**`frontend/src/components/business/AddProductModal.tsx`** — FIXED
- `DEFAULT_DISH_FALLBACK` replaced with accurate Bicolano dish photo

**`frontend/src/components/feed/CreatePostModal.tsx`** — FIXED
- `DEFAULT_POST_FALLBACK` replaced with accurate Bicolano dish photo

### Reference Documents
- `AUDIT_GAP_ANALYSIS.md` — 548-line audit document
- `NAGA_CULINARY_RESEARCH.md` — 1,209-line research document with GPS coordinates, trail distances, visual criteria

### Verification
- `npx tsc --noEmit` → **0 errors**
- `street-grill` category: 2 dishes ✓
- `pan-de-naga-heritage` present in mockData ✓
- No ghost `puto`/`gravy` IDs in BasketContext ✓
- No short establishment IDs in socialFeedData ✓

---

## 16. Supabase Backend & Database Migration (November 2026)

### Summary
Migrated client-side mock data and simulated local authentication state into a production-grade Supabase architecture.

### Schema & Seed Artifacts
- [`supabase_schema.sql`](file:///c:/Users/Admin/Desktop/Dev/food/supabase_schema.sql): Complete DDL with UUID extension, 11 PostgreSQL tables (`food_profiles`, `categories`, `food_items`, `establishments`, `food_trails`, `posts`, `post_likes`, `post_comments`, `user_saved`, `user_orders`, `user_tastings`), comprehensive RLS policies, and an automated profile creation trigger on `auth.users`.
- [`supabase_seed_data.sql`](file:///c:/Users/Admin/Desktop/Dev/food/supabase_seed_data.sql): Seed data generator migrating all 6 categories, 13 `FOOD_ITEMS`, 14 `ESTABLISHMENTS`, and 4 `FOOD_TRAILS`.
- [`supabase_full_migration.sql`](file:///c:/Users/Admin/Desktop/Dev/food/supabase_full_migration.sql): Combined schema and seed script ready for 1-click execution in Supabase SQL Editor.

### Client & Context Integrations
- [`frontend/src/lib/supabase.ts`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/lib/supabase.ts): Initialized Supabase client with `@react-native-async-storage/async-storage` session persistence and `react-native-url-polyfill`.
- [`frontend/src/services/catalogService.ts`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/services/catalogService.ts): Hybrid data service querying Supabase catalog tables with instant offline fallback.
- [`frontend/src/context/AuthContext.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/context/AuthContext.tsx): Real Supabase Auth (`signUp`, `signInWithPassword`, `signOut`, `onAuthStateChange`), profile sync to `public.food_profiles`.
- [`frontend/src/context/SavedContext.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/context/SavedContext.tsx): Per-user bookmark synchronization with `public.user_saved`.
- [`frontend/src/context/SocialFeedContext.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/context/SocialFeedContext.tsx): Remote post fetching, user-isolated post publishing, comments, and like persistence via `public.posts`, `public.post_likes`, and `public.post_comments`.
- [`frontend/src/context/QuestContext.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/context/QuestContext.tsx): Clean new user baseline (XP: 0, streak: 0, 0 unearned badges, empty initial tastings). Dynamically loads trails via `CatalogService.getFoodTrails()` and syncs user tastings from `public.user_tastings`.
- [`frontend/src/context/NotificationContext.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/context/NotificationContext.tsx): Removed mock order & streak alert history; provides welcoming onboarding tip for new accounts.
- [`frontend/src/components/home/FoodShowcaseBox.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/home/FoodShowcaseBox.tsx): Switched from static `FOOD_ITEMS` import to dynamic fetching via `CatalogService.getFoodItems()`; fixed counter badge to reference `foodItems.length`.
- [`frontend/src/components/home/NagaQuestCarousel.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/home/NagaQuestCarousel.tsx): Connected to live trails in `QuestContext`, calculating progress against real `tastingLog` (0 spots visited for new users).
- [`frontend/src/components/home/MascotHero.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/home/MascotHero.tsx): Replaced hardcoded 'Bryl' fallback with dynamic user name or 'Explorer'.

---

## 17. Food Images & Supabase Storage Architecture (November 2026)

### Summary
Diagnosed and resolved generic Unsplash placeholder images (`photo-1546069901-ba9599a7e63c`) displayed in the Home Screen's [`FoodShowcaseBox`](file:///c:/Dev/food/frontend/src/components/home/FoodShowcaseBox.tsx).

### Artifacts & Scripts Created
- [`supabase_update_food_images.sql`](file:///c:/Dev/food/supabase_update_food_images.sql): Creates the public `'food-images'` Supabase Storage bucket, configures RLS SELECT & INSERT policies, and updates all 15 `food_items` records to their direct Supabase Storage URLs.
- [`scripts/upload_food_images.js`](file:///c:/Dev/food/scripts/upload_food_images.js): Automated Node script using `@supabase/supabase-js` that successfully uploaded all 15 authentic dish assets from [`frontend/assets/images/dishes/`](file:///c:/Dev/food/frontend/assets/images/dishes) into the live Supabase `'food-images'` storage bucket (200 OK verified).
- [`frontend/src/services/catalogService.ts`](file:///c:/Dev/food/frontend/src/services/catalogService.ts): Added smart fallback in `getFoodItems()` and `getFoodById()` to detect placeholder stock URLs and gracefully serve authentic local bundled images.
- **Git Commit**: `6927f3c` pushed to `origin/main` (`https://github.com/temqest/Food.git`).

---

## 18. Platform Fee (5%) & Business Cashout Processing Fee (3%) (November 2026)

### Summary
- Replaced the 0-peso "Reservation Service Fee" across the checkout and payment flows with a dynamic **Platform Fee** calculated as 5% of the total order cost (subtotal) only when paying online (GCash / Maya); when choosing **Cash on Arrival**, no extra fee (0%) is charged and the fee line is omitted.
- Added a 3% **Payment Processing Fee** to the business merchant cashout flow ([`CashOutModal.tsx`](file:///c:/Dev/food/frontend/src/components/business/CashOutModal.tsx)), itemizing gross withdrawal, the 3% deduction, and net payout received.

### Key Updates
- **[`frontend/src/context/BasketContext.tsx`](file:///c:/Dev/food/frontend/src/context/BasketContext.tsx)**:
  - Updated `getBasketFee: (method?: 'cash' | 'gcash' | 'maya') => number`: returns 0 if `method === 'cash'`, else `Math.round(subtotal * 0.05 * 100) / 100`.
  - Updated `getBasketTotal: (method?: 'cash' | 'gcash' | 'maya') => number`: returns `subtotal + getBasketFee(method)`.
  - Updated `placePreOrder` to compute and record `fee` and `total` based on the active or selected payment method.
- **[`frontend/src/app/basket.tsx`](file:///c:/Dev/food/frontend/src/app/basket.tsx)**:
  - Added Payment Method selector card strip ("Cash on Arrival · No fee" vs "Pay Online · 5% fee").
  - Dynamically hides the Platform Fee line when Cash on Arrival is chosen; displays "Platform Fee [5%]" when Pay Online is selected.
  - Updated Payment Summary and "Proceed to Payment" CTA button.
- **[`frontend/src/app/payment.tsx`](file:///c:/Dev/food/frontend/src/app/payment.tsx)**:
  - Connected `paymentMode` to context `paymentMethod`.
  - Updated payment options with clear fee indicators (`NO EXTRA FEE` badge on Cash on Arrival, `+5% FEE` on GCash and Maya).
  - Conditionally renders the Platform Fee row only when online payment is selected; sets total to subtotal when Cash on Arrival is active.
- **[`frontend/src/components/business/CashOutModal.tsx`](file:///c:/Dev/food/frontend/src/components/business/CashOutModal.tsx)**:
  - Added 3% Payment Processing Fee calculation (`Math.round(parsedAmount * 0.03 * 100) / 100`).
  - Updated settlement summary to show Gross Withdrawal, 3% Payment Processing Fee, and Net Payout Received.
  - Updated confirmation CTA and alert notice with exact net and fee breakdown.
- **[`frontend/src/context/BusinessContext.tsx`](file:///c:/Dev/food/frontend/src/context/BusinessContext.tsx) & [`frontend/src/components/business/StoreWalletCard.tsx`](file:///c:/Dev/food/frontend/src/components/business/StoreWalletCard.tsx)**:
  - Added `fee` and `netAmount` to `PayoutRecord`.
  - Updated `cashOutWallet` to record `processingFee` and `finalNet`.
  - Updated `StoreWalletCard` payout history items to show net payout and 3% fee.
- **[`frontend/src/services/orderService.ts`](file:///c:/Dev/food/frontend/src/services/orderService.ts)**:
  - Added `fee?: number` to `DBUserOrder` interface and mapped `fee` when loading orders.

### Verification
- `npx tsc --noEmit` → **0 errors**.





