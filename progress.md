# Gamified Naga Food Discovery UI - Implementation Progress (`progress.md`)

**Lead Task Manager & Coder**: @distributor  
**Status**: IN PROGRESS

## Task Breakdown & Status

- [ ] **Task 1: Enrich Gamification Data & Lore (`src/data/gamification.ts`)**
  - Add `MysteryDrop` interfaces and curated pool of secret Naga food drops.
  - Add district metadata and insider culinary hacks.
  - Add quest definitions with explicit rewards and time contexts.

- [ ] **Task 2: Expand QuestContext State Engine (`src/context/QuestContext.tsx`)**
  - Implement mystery box open, reroll, and persistence state.
  - Implement `claimQuestReward` with XP reward, completed quest tracking, and badge unlock detection.
  - Implement `getDistrictProgress` calculator.

- [ ] **Task 3: Build Interactive Stilitio Mystery Box (`src/components/gamification/SilitoMysteryBox.tsx`)**
  - Create animated 3D-styled mystery chest with idle float and pulse.
  - Implement 400ms wobble shake animation.
  - Create celebration modal reveal overlay with rarity, +50 XP float tag, insider secret, and deep link navigation.
  - Implement clean collapsed card state for post-unboxing.

- [ ] **Task 4: Build Active Daily Quest Log (`src/components/gamification/ActiveQuestLogWidget.tsx`)**
  - Horizontal swipeable / responsive card layout for daily quests.
  - Interactive "Claim +XP" button with optimistic feedback.
  - District tags and time-context badges.

- [ ] **Task 5: Upgrade Silito Companion Mascot & Widgets**
  - Polish `SilitoCompanion.tsx` with dynamic moods, speech bubble, and quick action shortcuts.
  - Polish `DistrictProgressWidget.tsx` with live dynamic percentages from `QuestContext`.
  - Polish `NagaCompassWidget.tsx` with tactile mood filters and direct routing.

- [ ] **Task 6: Redesign Home Screen (`src/app/index.tsx`)**
  - Integrate Header with XP level ring, Silito Companion, Stilitio Mystery Box, Active Quests, District Progress, and Curated Authentic Eateries.
  - Ensure flawless visual pacing and mobile responsiveness.

- [ ] **Task 7: Polish Codex Screen (`src/app/explore.tsx`) & Map Screen (`src/app/map.tsx`)**
  - Wire Food Crawl Trails directly into Map view.
  - Add interactive Craving Compass to Codex.
  - Polish tasting check-in triggers on Map.

- [ ] **Task 8: Verification & QA (`@verifier`)**
  - Run `npx tsc --noEmit` and `npx expo lint`.
  - Review UI visual design, animations, and cross-platform compatibility.
