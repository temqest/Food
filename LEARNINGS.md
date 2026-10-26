# Engineering & Design Learnings: Mobile Journey Maps & Food Apps

> 📍 **App Navigation & Architecture Atlas**: For the complete screen route table, component atlas, safe area configuration, and AI change history, see [`../APP_NAVIGATION_MAP.md`](file:///c:/Users/Admin/Desktop/Dev/food/APP_NAVIGATION_MAP.md).

This document records the design philosophy, UX guidelines, technical pitfalls, and strict **DO's and DON'Ts** established during the development of the Naga Food Trail experience.

---

## 1. Top Principles & Design Philosophy

### 1.1 Winding Road Geometry (Never Straight Steppers)
- **The Pitfall**: Attempting to "clean up" complex paths by replacing them with a straight vertical line or linear progress bar.
- **Why It Fails**: A food trail or crawl is an *expedition*. A straight vertical line makes the screen look like an administrative form wizard or a shipping tracker.
- **The Rule**: Crawl paths must curve gracefully like a winding country road or mountain trail.
- **Technical Pattern**:
  - Use cubic Bezier S-curves (`M startX, 0 C startX, H*0.55, endX, H*0.45, endX, H`).
  - Keep control points vertically aligned with endpoints so tangents at card boundaries are strictly vertical. This guarantees perpendicular, gap-free docking into card borders.
  - Alternate exit and entrance anchors across cards (`left` $\to$ `right`, `right` $\to$ `left`, and into `center` for the finish crest).

### 1.2 Food is the Hero (No Tiny Thumbnails)
- **The Pitfall**: Formatting food places as horizontal rows with 80px–100px thumbnails to save vertical space.
- **Why It Fails**: On a food app, users want to feast their eyes on the dish. Tiny thumbnails look sterile and unappetizing.
- **The Rule**: Always provide a prominent hero food banner (minimum 160px–180px height across full card width) displaying rich textures, broth, garnish, and appetizing lighting.
- **Artifacts on Food**: Layer travel ephemera directly over the hero photo (tilted price tape, distance badge, status stamps) rather than cluttering white margins.

### 1.3 Overextending Corner Milestone Badges
- **The Pitfall**: Placing flat rectangular text banners (`STOP 01 · VISITED`) inset inside the image.
- **Why It Fails**: Inset text blocks look corporate and generic.
- **The Rule**: Use a 36×36px circular milestone token (`1`, `2`, `3`) perched on the top corner, overextending slightly outside the card (`top: -12`, `left: -6` or `right: -6`).
- **Technical Gotcha**: Set `card: { overflow: 'visible' }` so the badge can extend outside the card, while placing `overflow: 'hidden'` with matching border radii on `heroBannerContainer` so the photo corners remain neatly clipped.

### 1.4 Direct Banner Docking (No Floating Pins)
- **The Pitfall**: Floating detached circular pins or milestone discs in the whitespace between cards.
- **Why It Fails**: Creates awkward 100px+ vertical dead space and horizontal coordinate disconnects on resizing.
- **The Rule**: Connect the path directly from the bottom edge of one card into the top edge of the next card, with subtle arrival/departure docking notches.

### 1.5 Real-Device Viewport Discipline (360px–375px)
- **The Pitfall**: Auditing only on wide simulator viewports (450px–500px).
- **Why It Fails**: Standard iPhones (SE/mini) and common Android devices are 360px–375px wide. Floating tags or long strings like `"CURRENT DESTINATION"` will overflow off-screen.
- **The Rule**: Always test at 375px width (or 360px). Keep status copy concise (`● ACTIVE`, `✓ STAMPED`), and use `flexShrink: 1` and `numberOfLines` on text elements.

---

## 2. Strict DO's and DON'Ts

### DO
- ✅ **DO extend hero headers full-bleed to $y=0$** with floating frosted-glass back controls on detail and trail screens.
- ✅ **DO curve crawl paths like a winding road** with dashed styling (`strokeDasharray="7, 5"`).
- ✅ **DO make food photography generous and prominent** (160px–180px full width).
- ✅ **DO overextend milestone badges on top corners** (`top: -12`, `left/right: -6`) for physical depth.
- ✅ **DO alternate visual elements** (Stop token on left $\to$ distance on right, then distance on left $\to$ Stop token on right).
- ✅ **DO connect the final road segment flush into the Finish Shrine** with zero gap.
- ✅ **DO use a warm, artisanal Bicolano color palette**:
  - Card paper: `#FFFDF7` (warm cream)
  - Vintage border: `#D8CBB5` (postal paper tan)
  - Primary accent: `#D42F13` (Sili red)
  - Secondary accent: `#FFC857` (warm masking tape yellow)
  - Verified green: `#1E3A2B` (forest green) & `#2E7D32`

### DON'T
- ❌ **DON'T make trail paths straight vertical lines** — it destroys the adventurous journey feeling.
- ❌ **DON'T squeeze food photos into 80px–100px thumbnails** in a side column.
- ❌ **DON'T float detached numbered discs above cards** — always dock directly into the card.
- ❌ **DON'T add unsolicited segmented toggles** ("Trail vs Map") when the user asked for a trail map.
- ❌ **DON'T use long status labels** that breach the screen on 360px–375px devices.
- ❌ **DON'T leave empty dead gaps** between the final road segment and the completion crest.
- ❌ **DON'T nest `<Pressable accessibilityRole="button">` inside another `<Pressable accessibilityRole="button">`** — it causes React Native Web DOM nesting warnings.

---

## 3. Checklist for Future Chats
When adding new trails or editing this screen:
1. [ ] Run `npx tsc --noEmit` in `frontend/` to ensure 0 TypeScript errors.
2. [ ] Run `npx eslint src/app/trail src/components/trail` to ensure 0 lint errors.
3. [ ] Audit in the browser at **width: 375, height: 812**.
4. [ ] Verify that the winding road connects seamlessly banner-to-banner.
5. [ ] Verify that stop circular badges alternate corners and overextend outside the top edge.
6. [ ] Verify that the hero food photos are appetizing, large, and unobstructed.

---

## 4. Naga Flavor Codex Principles & Anti-Clutter Rules

### 4.1 Single-Purpose Direction
- **The Goal**: The Codex is an authentic culinary field encyclopedia: browse iconic dishes, read their story, see where to eat them, and tap into deep lore.
- **Anti-Feature Creep**: Do NOT slap floating action buttons (like Craving Dials or Roulettes) in the header next to the Large Title.
- **Header Standard**: Clean iOS Large Title (`Flavor Codex`, 34px / 700) + concise subtitle + full-width 38px search field.

### 4.2 Anti-Box-in-a-Box Clutter
- **The Pitfall**: Layering 5+ nested boxes inside a single card (overextending stamp row + tilted price tape + lingo quote box + establishment strip + dual action buttons).
- **The Fix**: Keep the card calm and uncluttered:
  - 160px hero food photo with quiet price pill.
  - Clean title + Bikol native name + 2-line description.
  - Single quiet meta line (`Eatery · Spice level · Inspect ›`).
  - The whole card is a single tappable surface that opens the rich `DishDossierModal` for deep lore, local ordering quotes, and map directions.

### 4.3 Clean Single-Tier Filters
- Use a single horizontal category pill bar (`All · Soups & Broths · Gata & Sili · Pili Sweets · Merienda · Night Grills · Coolers`).
- Never stack multiple competing filter rows (no separate heat index bars or ingredient carousels above the content).

### 4.4 Checklist for Codex Updates
1. [ ] Run `npx tsc --noEmit` (0 errors).
2. [ ] Audit at **375px × 812px** mobile viewport in Playwright.
3. [ ] Verify no cards contain nested boxes or competing button rows.
4. [ ] Verify tapping any dish card smoothly opens the deep Dossier Sheet.

---

## 5. Social Feed Architecture & Entity Separation Rules

### 5.1 Strict Separation: Public Feed vs. Personal Utilities
- **The Pitfall**: Cramming personal gamification utilities (passport stamps, XP bars, level tiers, pre-order QR passes) into the public social stream.
- **The Rule**: The Social Feed (`/feed`) is exclusively for public community discovery: traveler stories, food reviews, photo logs, and business announcements. Personal utility screens (such as `/basket` Passport & Journal) must remain dedicated and isolated.

### 5.2 Social Card Hierarchy Standard (Instagram / Beli Model)
- **Header**: 38px circular avatar + Display Name + Verified/Foodie pill + Timestamp + Tappable Location Pin.
- **Media**: 4:3 high-resolution food photo with tappable dish chip overlay (`Kinalas · ₱85`) with direct routing.
- **Action Strip**: Like (with optimistic heart count & bounce), Comment (opens slide-up sheet), Bookmark, Share.
- **Caption & Insider Tip**: Clean expandable caption + highlighted Bicolano local tip / spice meter.
- **Creation Entry**: Always provide an unmissable "+ Share Trip" action with establishment and dish tagging.

---

## 6. Food Detail Page Design & Sensory Editorial Architecture (`/food/[id]`)

### 6.1 Full-Bleed Hero Standard
- Food info pages must treat photography as the visual thesis. Extend hero photography full-bleed to $y=0$ behind a translucent status bar with custom SVG gradient scrimming.
- Use circular floating frosted action buttons with `useSafeAreaInsets()` for top padding (`Math.max(insets.top, RNStatusBar.currentHeight || 24)`).

### 6.2 Sensory Hierarchy & "Eat Like a Local" Rituals
- Break down the culinary experience into immediate visual data:
  - **Sili Heat Meter**: Flame level indicators (1–5) reflecting genuine Bicolano spice levels.
  - **The Flavor Anatomy**: Taste note chips (Creamy Gata, Siling Labuyo, Umami Gravy, Citrus Calamansi) with matching icons.
  - **Nagueño Dining Ritual**: Dedicated warm card highlighting ordering lingo in local dialect and insider eating hacks from `DISH_INSIDER_TIPS`.
  - **Rich Establishment Discovery Cards**: Replace plain 48px list items with rich eatery cards displaying venue hero images, signature offering prices, distance from Naga center, and live open/closed status.

### 6.3 Sticky Action Bar Discipline
- Critical user actions ("Stamp Passport +60 XP", "Reserve Pass", "Open on Map") must be pinned in a floating bottom frosted container with safe area inset padding (`Math.max(insets.bottom, 16)`), always within comfortable thumb reach.

---

## 7. Mobile Input & Virtual Keyboard Usability
- **Never enable `autoFocus` on tab-level search screens**: Users landing on `/search` or browsing screens often intend to tap filters, browse categories, or view favorites. Setting `autoFocus={true}` forces the virtual keyboard open on navigation, causing viewport displacement and layout shift. Only use `autoFocus` when the user explicitly triggers an in-page search action or dedicated search modal.

---

## 8. Icon & Text Pill Layout Invariant (`flexDirection: 'row'`)
- React Native components default to `flexDirection: 'column'`. All `<Pressable>` or `<TouchableOpacity>` tags that pair an icon with descriptive text (such as action pills or filter buttons) must explicitly declare `flexDirection: 'row'` and `alignItems: 'center'`. Omitting this causes icons and labels to break across separate vertical rows.

---

## 9. Route Preservation Invariants
- When modifying navigation bars or bottom tabs, decouple UI visibility from file-system routing. Never delete or move route files in `src/app/` solely to remove them from a tab bar; keep the route active for deep links and modal navigation.

---

## 10. Store / Establishment Info Page Architecture (`/establishment/[id]`)

### 10.1 Dual-Image Hierarchy: Store Banner + Elevated Store Logo
- A store page must clearly distinguish between the **Store Cover Banner** (a wide 240px–260px horizontal scenic shot of the venue) and the **Store Brand Logo** (an 80×80px squircle emblem with a 3.5px white border and soft shadow, overlapping the banner with `marginTop: -42`).
- Never rely on a single full-bleed hero without an avatar/logo slot; users expect a distinct visual identity for the merchant brand alongside the cover photo.

### 10.2 Bounded Dish Thumbnail Sizing (Never Unbounded Percentage Heights)
- **The Pitfall**: Setting `height: '100%'` or `minHeight: ...` on an image container inside a flex row where the parent card height is variable.
- **Why It Fails**: In React Native and React Native Web, child images with `height: '100%'` inside cross-axis stretching flex rows can blow up vertically and stretch down the entire length of the page ("over-extending all the way down").
- **The Rule**: Always set explicit fixed dimensions on food thumbnails in menu rows (`dishThumbnailContainer`: `width: 84, height: 84, borderRadius: 12, overflow: 'hidden'`). Pair with `alignItems: 'center'` and `padding: 12` on the card wrapper to guarantee stable ~108px high rows.

### 10.3 Avoid Atmospheric Tag Clutter
- Avoid cluttering store profiles with generic administrative category pills (such as "Casual Dining", "Heritage Institution", "Air-Conditioned", etc.). Keep the header focused on brand, live open status, neighborhood, distance, and authentic dishes.

---

## 11. Color Divider System & Long Store Title Layout Safeguards

### 11.1 Color Dividers & Visual Hierarchy (Breaking Monotonous All-White Cards)
- Avoid rendering an entire screen as identical white boxes (`#FFFFFF` on `#F7F7FA`). Introduce clear visual pacing and hierarchy:
  - **Warm Color Dividers**: Insert dedicated divider bars (`colorDividerRow`: `#E6E0DA` warm stone lines with a 22×3px `#D42F13` terracotta accent badge) between major chapters of the page (Hero/Stats, Menu, Atmosphere, Store Details, Provenance).
  - **Distinct Card Color Tiers**:
    - **Menu Items**: Clean white cards with bordered `#FFF2EE` terracotta price pills (`#D42F13`), creating immediate price hierarchy.
    - **Store Details**: Color-coded functional icon boxes (Location: `#FEECE8` terracotta, Hours: `#FEF3E2` amber, Phone: `#EBF8EE` green).
    - **About / Provenance**: Warm ivory parchment background (`#FDFBF7` with `#EFE3D8` border) and an `AUTHENTIC LOCAL INSTITUTION` badge to separate history/culture from operational details.

### 11.2 Long Store Title & Subtitle Alignment Safeguards
- Merchant and restaurant names can be verbose (e.g., *"Aling Cely's Authentic Kinalas & Sinigang House"*).
- **Hero Title**: Always declare `numberOfLines={2}`, `ellipsizeMode="tail"`, and `flexShrink: 1` with a proportional line-height (e.g., `fontSize: 22`, `lineHeight: 28`) to prevent awkward font squashing or uncontrolled vertical layout shifts.
- **Header Rows with Subtitles**: When pairing a dynamic store name with a section subtitle (e.g., `About {establishment.name}` alongside `Provenance`), enclose the title in a container with `flex: 1`, declare `numberOfLines={1}`, and add `flexShrink: 0` to the subtitle so the title never pushes the subtitle off screen or causes irregular row wrapping.
- **Card Previews**: Set `numberOfLines={1}` and `ellipsizeMode="tail"` on all establishment names inside preview cards (`EstablishmentCard.tsx`) to guarantee consistent card heights.



