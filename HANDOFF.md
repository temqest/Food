# Developer Handoff: Naga Food Trail & Expedition Experience

## 1. Overview & Current State
The **Naga Food Trail** screen (`/trail/[id]`, e.g., `/trail/trail-kinalas`) has been redesigned into an authentic, artisanal Bicolano food expedition. It replaces generic lists, detached pins, and sterile steppers with a tangible travel postcard aesthetic, prominent hero food banners, and a curving winding road path.

All code has been verified on strict **375px mobile viewports** (iPhone / standard Android) with zero horizontal overflow, tight vertical spacing, and 0 TypeScript / ESLint errors.

---

## 2. Key Components & Architecture

### `src/app/trail/[id].tsx`
- **Purpose**: Main expedition screen coordinator.
- **Key Responsibilities**:
  - Full-bleed hero container with transparent status bar.
  - Computes stop completion statuses and establishes the active objective.
  - Alternates winding road anchors:
    - Stop 1: Exits `left` (`0.28W`).
    - Stop 2: Enters `right` (`0.72W`), exits `right`.
    - Stop 3: Enters `left` (`0.28W`), exits `left`.
    - Finish Shrine: Enters `center` (`0.50W`).
  - Coordinates the interactive `PassportStampModal` for tasting check-ins and the `TrailStopDetailsSheet`.

### `src/components/trail/TrailSteppingBridge.tsx`
- **Purpose**: Curving dashed winding road (`- - - - -`) connecting food destinations.
- **Props**: `fromSide` ('left' | 'right' | 'center'), `toSide`, `status` ('completed' | 'active' | 'upcoming'), `height` (default 50px).
- **Key Implementation Details**:
  - Exports `getTrailAnchorX(side, screenWidth)`:
    - `'left'`: `Math.round(screenWidth * 0.28)`
    - `'right'`: `Math.round(screenWidth * 0.72)`
    - `'center'`: `Math.round(screenWidth * 0.50)`
  - Uses cubic Bezier S-curves (`M startX 0 C startX H*0.55, endX H*0.45, endX H`) with strictly vertical perpendicular tangents so the road docks straight into the top/bottom borders of cards.
  - Dashed styling: `strokeDasharray="7, 5"`, `strokeWidth=3`, `strokeLinecap="round"`.
  - Terracotta sili red (`#D42F13`) for completed/active, warm vintage neutral (`rgba(135, 125, 115, 0.45)`) for upcoming.

### `src/components/trail/TrailStopStation.tsx`
- **Purpose**: Artisanal food destination postcard card.
- **Key Features**:
  - **165px Full-Width Hero Food Photo**: Large, mouthwatering food presentation showing rich ingredients, broth, and textures.
  - **Overextending Corner Circular Badge**: 36×36px badge indicating stop number (`1`, `2`, `3`), perched on the top-left or top-right corner (`top: -12`, `left/right: -6`), extending outside the card boundary.
  - **Opposite-Corner Distance Badge**: Footsteps icon + distance (`180m`, `440m`) on a frosted pill.
  - **Tilted Price Tape**: Masking-tape style badge (`₱85`, `₱90`) at bottom-left of photo.
  - **Status Stamp**: `LOGGED` (green) or `🔥 MUST TRY` (red) at bottom-right of photo.
  - **Road Docking Ports**: Subtle notches at `enterX` and `exitX` on top and bottom borders where the winding road connects.
  - **Postcard Body**: Venue name, neighborhood, signature dish with cutlery badge, live operating hours dot, and Nagueño insider secret tip callout box.
  - **Action Row**: `Directions` and `Log & Stamp` buttons on active stop.

### `src/components/trail/TrailFinishCrest.tsx`
- **Purpose**: Grand finale finisher shrine with golden wax seal medallion and XP bonus.
- **Key Detail**: Set `marginTop: -1` and added a top arrival docking port on the `TRAIL FINISH SHRINE` ribbon pill so the final road segment connects flush with zero gap.

### `src/components/trail/TrailheadHeader.tsx`
- **Purpose**: Full-bleed hero banner ($y=0$).
- **Key Features**: Floats frosted-glass circular back button and "Food Quest" pill over the hero artwork.

### `src/components/trail/TrailProgressBar.tsx`
- **Purpose**: Tactile Expedition Passport HUD.
- **Key Features**: Off-white parchment texture (`#FFFDF7`), vintage red cancellation postmark, discrete waypoint progress bar, and "Next Objective" spotlight card.

---

## 3. Git Status Before Push
- Modified files:
  - `src/app/_layout.tsx`
  - `src/components/gamification/FoodTrailCard.tsx`
  - `src/components/home/NagaQuestCarousel.tsx`
  - `src/data/gamification.ts`
- Untracked files:
  - `src/app/trail/`
  - `src/components/trail/`
  - `HANDOFF.md`
  - `LEARNINGS.md`

All code compiles with `npx tsc --noEmit` (0 errors) and passes `npx eslint` (0 errors).
