# Implementation Plan (Streamlined & Content-First) - Discovering Naga Food Places

## 1. Problem Statement & User Correction
The previous iteration stacked multiple separate gamification widgets on the Home screen:
- Companion banner box
- Standalone mystery loot crate
- Daily quests widget
- Category pills
- Hero card
- District conquest widget
- Eatery list

**Result**: A noisy, bloated "widget dashboard" where food places were buried.
**User Directive**: The app exists to **discover and learn authentic food places in Naga City**. Gamification should support and enrich food discovery, not dominate the screen as a stack of competing boxes.

---

## 2. Redesign Principles: Content-First Discovery

1. **Food Places are the Hero**:
   - The Home screen must immediately show authentic Naga carinderias, bakeries, and heritage spots.
   - Real photos, dish signatures, neighborhoods, and open hours lead the viewport.
2. **Eliminate Standalone Box Clutter**:
   - Remove the standalone companion speech box.
   - Remove the standalone mystery loot crate from the home feed.
   - Move detailed quest logs and district conquest to the **Passport (`basket.tsx`)** and **Explore Codex (`explore.tsx`)** tabs where they naturally belong.
3. **In-Content Gamification**:
   - Integrate the "Surprise Me / Silito Flavor Roll" directly into the search bar as a quiet, tactile discovery tool (dice button).
   - Display tasting XP rewards (`+60 XP`), spice meters, and heritage badges directly on the establishment and food cards.
4. **Clean iOS-Native Pacing**:
   - Quiet top header: `Naga City · Centro` + subtle level chip.
   - Single unified search field with quick flavor dice.
   - Quiet category filter pills.
   - Featured Heritage Spotlight dish.
   - Inset grouped list of authentic Naga eateries with clear photos and signature dishes.

---

## 3. Screen Breakdown

### Home Screen (`src/app/index.tsx`)
1. **Header**: Minimal native header with location switcher (`Naga City · Centro`) and subtle level indicator (`Lvl 3`).
2. **Search & Quick Flavor Roll**:
   - Clean search field with inline action: a dice button that triggers the Silito Craving Roll / Mystery Drop modal without eating screen space.
3. **Filter Pills**: Quiet horizontal scroll of cuisine moods (Soups, Gata & Sili, Merienda, Night Grills).
4. **Heritage Dish Spotlight**:
   - High-quality photography, Bikol name, flavor tags, and price.
5. **Authentic Naga Eateries**:
   - Beautiful native grouped table of real spots (Cha-Cha's, Pan De Naga, Bob Marlin, Aling Cely's, Geewan).
   - Clean metadata: neighborhood, distance, open status, signature dish, and inline tasting XP.

### Explore Codex (`src/app/explore.tsx`)
- The cultural repository: Guided food crawl trails (Barlin Kinalas, Fiery Gata, 4 PM Merienda), Craving Compass, and culinary chapters.

### Passport Tab (`src/app/basket.tsx`)
- The dedicated home for gamified progression: Explorer Rank ladder, Tasting Stamp Journal, Collectible Badges, and Active Quests.

---

## 4. Execution Steps
1. Refactor `src/app/index.tsx` to remove the widget gauntlet and put authentic food places first.
2. Wire the lucky mystery roll into the search bar / header as a lightweight tool.
3. Ensure Passport screen (`basket.tsx`) houses active quests and rank progression cleanly.
4. Verify with `tsc`, `lint`, and Playwright screenshots.
