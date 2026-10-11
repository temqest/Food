# Implementation Plan (Revised & Approved) - Gamified Naga City Food Discovery Experience

## 1. Executive Summary & Vision
Transform the Naga City food discovery app into an engaging, gamified exploration journey celebrating Bicolano food heritage. The app turns routine food lookup into a cultural expedition powered by **Silito** (the fiery chili mascot), the **Interactive Stilitio Mystery Box**, **Active Food Quests**, **District Conquest Progression**, and an **Authentic Naga Food Codex**.

---

## 2. Architecture & Tech Lead Review Resolutions

Following the audit from `@griller` in `plan_review.md`, the plan incorporates:

### A. Cross-Platform Animation Performance
- All animations use React Native's `Animated` API with `useNativeDriver: Platform.OS !== 'web'`.
- Animations exclusively animate GPU-accelerated properties: `transform` (`scale`, `translateY`, `rotate`) and `opacity`.
- Zero layout thrashing or layout re-renders during unboxing and wobbles.

### B. Visual Pacing & Reduced Cognitive Load (Home Screen)
- **Top Header**: Minimalist iOS-style district switcher (`Naga City · Centro`), level badge (`Lvl 3 · Broth Seeker`), and profile avatar.
- **Interactive Silito Hero Banner**: Silito acts as the conversational guide introducing today's flavor and teasing the Mystery Box.
- **The Stilitio Mystery Tasting Box (`SilitoMysteryBox.tsx`)**:
  - Compact tactile card with vibrant gradients, gold-and-cayenne border, and floating crate icon.
  - Tapping opens the interactive unboxing sequence (wobble -> flash -> dish reveal modal).
  - Once opened today, displays an elegant *"Tasting Discovered Today: +50 XP"* chip with a re-roll button so it doesn't push down content.
- **Active Quests Strip (`ActiveQuestLogWidget.tsx`)**:
  - Horizontal scroll of crisp quest cards with progress bar and one-tap *"Claim +40 XP"* action.
- **District Conquest Tracker (`DistrictProgressWidget.tsx`)**:
  - Visual district cards with percentage bars for Bagumbayan, Centro, Magsaysay, and Peñafrancia.
- **Authentic Eatery Feed**:
  - Inset grouped table cards with dish tags and direct crawl route triggers.

---

## 3. Explicit State & Data Contract (`QuestContext.tsx`)

```typescript
export interface MysteryDrop {
  id: string;
  foodId: string;
  foodName: string;
  bikolName?: string;
  establishmentId: string;
  establishmentName: string;
  neighborhood: string;
  image: string;
  rarity: 'Common Gem' | 'Secret Local Hack' | 'Legendary Heritage';
  xpReward: number;
  insiderSecret: string;
}

export interface QuestContextType {
  xp: number;
  currentRank: ExplorerRank;
  nextRank: ExplorerRank | null;
  rankProgressPercent: number;
  unlockedBadgeIds: string[];
  unlockedBadges: BadgeItem[];
  completedQuestIds: string[];
  tastingLog: TastingEntry[];
  trails: FoodTrail[];
  
  // Mystery Box State
  isMysteryBoxOpenedToday: boolean;
  mysteryDrop: MysteryDrop | null;
  openMysteryBox: () => MysteryDrop;
  rerollMysteryBox: () => MysteryDrop;
  
  // Quests & XP
  claimQuestReward: (questId: string) => { xpAwarded: number; newBadgeAwarded?: BadgeItem };
  addXp: (amount: number) => void;
  logTasting: (entry: Omit<TastingEntry, 'id' | 'date'>) => { newBadgeAwarded?: BadgeItem };
  isFoodLogged: (foodId: string) => boolean;
  isBadgeUnlocked: (badgeId: string) => boolean;
  
  // District Progress
  getDistrictProgress: (districtName: string) => { total: number; visited: number; percent: number };
}
```

---

## 4. Component Structure & Specifications

### 1. `SilitoMysteryBox.tsx` (Interactive Stilitio Mystery Box)
- **Props**: None (connects to `useQuest`).
- **States**:
  - `IDLE`: Radiant pulsing chest with floating animation, flame particles, and *"Tap to Unbox"* prompt.
  - `WOBBLING`: 400ms rapid alternating rotation (`-10deg` to `10deg`), spring scale.
  - `REVEALED_MODAL`: Full celebration overlay showing unboxed dish, dish image, rarity pill, secret insider hack, +50 XP badge with confetti effect, and actions: *"Taste Dish Lore"* and *"Find on Map"*.
  - `OPENED_CARD`: Clean collapsed card showing today's discovered dish, timer/re-roll button.

### 2. `ActiveQuestLogWidget.tsx` (Daily Quest Log)
- **Features**:
  - Displays daily quests filtered by current time/district context.
  - Shows completion state: Incomplete vs. Ready to Claim vs. Claimed.
  - One-tap claim button with optimistic XP increment and celebratory toast/badge check.

### 3. `DistrictProgressWidget.tsx` (Enhanced District Conquest)
- Displays 4 key Naga districts:
  - *Bagumbayan / Barlin*: Broth & Kinalas Heartland.
  - *Centro & Plaza Quezon*: Heritage Bakeries & Night Grills.
  - *Magsaysay Ave*: Modern Strip & Fiery Feasts.
  - *Peñafrancia Riverside*: Pilgrimage Delicacies & River Lore.
- Each with calculated completion percentages based on `tastingLog`.

### 4. `SilitoCompanion.tsx` (Enhanced Companion)
- Expressive SVG chili character with mood states (Morning sabaw, afternoon siopao, spicy night out).
- Dynamic Bikol greetings (*"Marhay na aldaw!"*, *"Kalas na!"*).
- Action buttons linked to Mystery Box and Compass.

### 5. `NagaCompassWidget.tsx` (Naga Craving Compass)
- Interactive mood roulette with 4 quick filters: *Surprise Me*, *Sabaw Comfort*, *Fiery Gata*, *Merienda*.
- Spins and lands on an authentic food item with an insider hack.

---

## 5. Screen Overhauls

1. **`src/app/index.tsx` (Home Screen)**:
   - Integrates Silito Companion, Stilitio Mystery Box, Daily Quests, District Conquest, and Eateries.
2. **`src/app/explore.tsx` (Codex Screen)**:
   - Features Food Crawl Trails (Barlin Kinalas, Fiery Gata, 4 PM Merienda) with direct map launch links, Naga Craving Compass, and Dish Codex.
3. **`src/app/map.tsx` (Map Screen)**:
   - Highlights crawl routes, district boundaries, and quick tasting check-ins.
4. **`src/app/basket.tsx` (Passport Screen)**:
   - Polished tasting journal stamps, collectible badge rack, and rank roadmap.

---

## 6. Execution Roadmap for @distributor
- **Task 1**: Update `src/data/gamification.ts` with mystery drops, district data, and secrets.
- **Task 2**: Update `src/context/QuestContext.tsx` with mystery box methods, quest claiming, and district calculations.
- **Task 3**: Create `src/components/gamification/SilitoMysteryBox.tsx` with cross-platform animations and unbox modal.
- **Task 4**: Create `src/components/gamification/ActiveQuestLogWidget.tsx` with claimable quests.
- **Task 5**: Polish `SilitoCompanion.tsx`, `DistrictProgressWidget.tsx`, and `NagaCompassWidget.tsx`.
- **Task 6**: Overhaul `src/app/index.tsx` and integrate all gamification modules.
- **Task 7**: Polish `src/app/explore.tsx`, `src/app/map.tsx`, and `src/app/basket.tsx`.
- **Task 8**: Maintain `progress.md` and hand off to `@verifier`.
