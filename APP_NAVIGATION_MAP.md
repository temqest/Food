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
| `/map` | [`frontend/src/app/map.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/map.tsx) | `['top', 'left', 'right']` | **Interactive Map**: Mapbox GL integration ([`MapboxMapView.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/map/MapboxMapView.tsx)), eatery pins, active crawl route banner, floating navigation pill. |
| `/food/[id]` | [`frontend/src/app/food/[id].tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/food/%5Bid%5D.tsx) | Full-bleed with clamped `insets.top` & sticky bottom bar | **Food Detail & Lore Screen**: Full-bleed hero with SVG gradient scrim, floating glass navigation & bookmark pills, Sili heat meter (1–5 flames), Flavor Anatomy taste chips, Nagueño Dining Ritual card with dialect quote, Lore & Cultural Roots card, rich eatery discovery cards with direct map navigation, and sticky bottom action bar (Stamp Passport +60 XP, Dine-In Pass, Map shortcut). |
| `/establishment/[id]` | [`frontend/src/app/establishment/[id].tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/establishment/%5Bid%5D.tsx) | Full-bleed with clamped `insets.top` & sticky bottom bar | **Store / Establishment Info Screen**: Full-bleed hero with SVG gradient scrim, floating frosted glass controls (back, live open/closed pill, bookmark), venue stats strip (Budget, Hours, Distance), atmosphere & vibe pills, rich menu cards with food photos, signature badges & one-tap order, photo gallery preview, contact & phone linking, and sticky bottom action bar (Call, Passes, Locate on Map). |
| `/feed` | [`frontend/src/app/feed.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/feed.tsx) | `['top', 'left', 'right']` | **Naga Community Social Feed**: Street food trips, eatery dispatches, live Naga Moments stories ([`NagaMomentsBar.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/feed/NagaMomentsBar.tsx)), filterable post cards ([`SocialFeedCard.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/feed/SocialFeedCard.tsx)), post composer ([`CreatePostModal.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/feed/CreatePostModal.tsx)), comments sheet ([`CommentsBottomSheet.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/feed/CommentsBottomSheet.tsx)). |
| `/basket` | [`frontend/src/app/basket.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/basket.tsx) | `['top', 'left', 'right']` | **Passport & Journal (Preserved)**: Tasting stamps collection, level ranks, badge gallery, active pre-orders tab with pickup QR pass modal. |
| `/saved` | [`frontend/src/app/saved.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/saved.tsx) | `['top', 'left', 'right']` | **Saved Favorites**: Tabbed lists of bookmarked dishes and eateries with quick removal and clear-all actions. |
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
| `components/common/` | `NavBar`, `SearchInput`, `RecommendationModal`, `UserAvatar` | Floating bottom navigation pill: Home (`/`), Map (`/map`), Search elevated center button (`/search`), Feed (`/feed`), Saved (`/saved`), search inputs, modal sheets, and universal native Android/iOS `SvgXml` avatar renderer. |
| `components/map/` | `MapboxMapView` | Mapbox GL mobile/web interactive map with custom marker callouts. |
| `components/gamification/` | `PassportStampModal`, `SilitoMysteryBox` | Tasting journal stamps, celebratory unboxing animations. |

---

## 5. AI Action & Modification Log

*Every AI session must append its actions here:*

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

### [2026-10-26] - Safe Area Inset & Battery Overlap Fix
- **Issue**: User reported content overlapping the top of their phone (battery percentage, clock, and camera notch).
- **Root Cause**:
  1. [`_layout.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/_layout.tsx) lacked `<SafeAreaProvider>`.
  2. All 15 screen files imported core React Native's deprecated `SafeAreaView`, which renders as a 0-padding `View` on Android.
  3. [`TrailHeroBanner.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/components/trail/TrailHeroBanner.tsx) had a 16px fallback which was smaller than device status bars.
- **Fix Applied**:
  1. Wrapped root in `<SafeAreaProvider>` in [`_layout.tsx`](file:///c:/Users/Admin/Desktop/Dev/food/frontend/src/app/_layout.tsx).
  2. Switched all screens to `SafeAreaView` from `react-native-safe-area-context` with `edges={['top', 'left', 'right']}` (or full edges for auth screens).
  3. Clamped `TrailHeroBanner` to `Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 20)`.
- **Learning**: Always import `SafeAreaView` from `react-native-safe-area-context` and configure `edges` based on whether a floating bottom `NavBar` is present.
