---
name: ios-native-mobile-ui
description: Redesign or build mobile web UI so it feels like a sleek, native iOS app (Apple HIG-grounded) instead of a generic AI-generated landing page. Use this whenever the user says a mobile design looks "AI", "generic", "bad", "cluttered", "has too many pills", wants it to "feel like an iOS app", "native", "sleek", "premium", or asks to fix/redesign/polish a mobile screen, tab bar, header, search bar, card list, or food/restaurant/discovery app. Use it even if they don't say "iOS" — any time a mobile web app screen is being designed, reviewed, or critiqued, apply this first.
---

# iOS-Native Mobile UI

Goal: a mobile web app that a person would mistake for a well-made iPhone app. That comes from three things, in order of importance:

1. **Content is the hero, chrome recedes.** Photos, names, and prices carry the screen. Buttons, badges, and labels are quiet.
2. **Restraint.** iOS looks expensive because it uses very few things: one typeface, one accent color, hairlines instead of borders and shadows, and lots of empty space.
3. **Familiar structure.** Large title, search field, grouped lists, bottom tab bar, bottom sheets. People already know how these work, so they feel "native" before any styling.

An app is not a landing page. Never open a screen with a marketing headline, a tagline, or a promo banner. Open with the thing the person came to do.

---

## 1. Audit first (do this before writing code)

List what is wrong on the current screen using the tells below. Be specific and name the elements. Then fix them in the order listed in section 9.

### The "AI-generated" tells on mobile

| Tell | Why it reads as generic | iOS-native replacement |
|---|---|---|
| Marketing hero headline (3–4 lines, bold, with a subhead paragraph) | Landing-page pattern; eats 30–40% of the first screen | A 34px large title ("Discover") and nothing else |
| Eyebrow pill with sparkle icon ("✦ Culinary Guide") | Sparkles are the loudest AI marker; the pill labels nothing | Delete it |
| Filled pill for location in the header | Decoration that looks tappable but isn't clearly a control | Plain tint-colored text button with a small chevron: `Naga City ⌄` |
| App logo tile + tagline in the header | Branding inside the app chrome; iOS headers show the screen title | Large title. Brand lives on the launch screen and app icon |
| ALL-CAPS tracked labels ("POPULAR SEARCHES:", "SPATIAL DISCOVERY") | Template chrome | Sentence case, or use a real section header (see 4) |
| Chips with a search icon inside each one | Icon repeats on every chip and says nothing | Show suggestions as a list under the search field, only when it is focused |
| Separate round filter button next to the search field | Two competing pills | One search field; filter icon as a plain icon button, opens a sheet |
| Dark promo card pushing the Map | The Map is already a tab; this duplicates navigation and uses system jargon ("Spatial discovery") | Remove. If a map preview is useful, use a real static map thumbnail inside a section |
| Badge count on a tab for saved items | iOS badges mean "needs your attention" (unread, pending) | No badge on Saved |
| Cream background + terracotta accent + heavy rounded cards | The most common AI palette right now | Cool neutral grouped background (#F2F2F7) + white surfaces + one accent |
| No food photography on a food app | The screen sells nothing | Dish photos are the first thing below the search field |

**Rule of thumb:** at most one pill-shaped, filled element per screen, and only if it is a primary action or a real filter/toggle. If a chip doesn't filter or toggle something, it isn't a chip. Delete it.

---

## 2. Design tokens

Use these as the single source of truth. Do not invent extra colors, radii, or font sizes.

```css
:root {
  /* Type */
  --font: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display",
          "Inter", system-ui, "Segoe UI", Roboto, sans-serif;

  /* Color (light) */
  --bg: #F2F2F7;                      /* grouped background */
  --surface: #FFFFFF;                 /* cards, list groups */
  --label: #000000;
  --label-2: rgba(60, 60, 67, 0.60);  /* secondary text */
  --label-3: rgba(60, 60, 67, 0.30);  /* placeholders, disabled */
  --separator: rgba(60, 60, 67, 0.29);
  --fill: rgba(118, 118, 128, 0.12);  /* search field, subtle fills */
  --inactive: #8E8E93;                /* inactive tab icons */
  --tint: #D42F13;                    /* single accent: sili red, 5:1 on white */

  /* Shape */
  --r-card: 16px;
  --r-thumb: 12px;
  --r-field: 10px;
  --r-sheet: 24px;

  /* Space (4pt grid) */
  --margin: 16px;                     /* screen edge */
  --gap-section: 28px;

  /* Motion */
  --ease: cubic-bezier(0.32, 0.72, 0, 1);  /* iOS-like spring-ish ease-out */
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #000000;
    --surface: #1C1C1E;
    --label: #FFFFFF;
    --label-2: rgba(235, 235, 245, 0.60);
    --label-3: rgba(235, 235, 245, 0.30);
    --separator: rgba(84, 84, 88, 0.60);
    --fill: rgba(118, 118, 128, 0.24);
    --inactive: #8E8E93;
    --tint: #FF5A3C;
  }
}
```

**Accent color.** One tint only. The default above (chili red) is grounded in Bicol cooking, but the user may swap it. Any replacement must hit 4.5:1 contrast against white for text use. Everything interactive (links, active tab, search cursor, "See All") uses the tint. Nothing decorative does.

**Font.** Use the system font. On iPhones it renders as SF Pro, which is the single biggest factor in "feels like iOS". Load Inter as the fallback for Android and desktop. Do not use a geometric display font (Plus Jakarta, Manrope, Poppins, etc.) for headings; it is a large part of the generic look. Do not hand-tune letter-spacing on the system font; only tighten by about -0.01em on the Inter fallback for text 22px and up.

**Type scale (Apple text styles).** Use only these:

| Style | Size / line | Weight | Use |
|---|---|---|---|
| Large Title | 34 / 41 | 700 | Screen title at top of a tab |
| Title 2 | 22 / 28 | 700 | Section headers |
| Headline | 17 / 22 | 600 | Card and row titles |
| Body | 17 / 22 | 400 | Paragraph text |
| Subhead | 15 / 20 | 400 | Secondary line under a title |
| Footnote | 13 / 18 | 400 | Meta (distance, hours) |
| Caption | 12 / 16 | 400 | Rare; tab labels use 10px / 500 |

Weights: 400, 600, 700 only. Avoid 800/900 "black" headlines.

**Depth.** Almost no shadows. Separation comes from white surface on grey background and from 0.5px separators. The only elements that get a shadow or blur are things that float: tab bar, nav bar when scrolled, sheets, and popovers.

**Materials (translucent bars).**

```css
.bar {
  background: rgba(249, 249, 249, 0.82);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  backdrop-filter: saturate(180%) blur(20px);
  border-top: 0.5px solid var(--separator);
}
@supports not (backdrop-filter: blur(1px)) {
  .bar { background: var(--surface); }   /* low-end Android fallback */
}
```

---

## 3. Page shell (what makes it stop feeling like a website)

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#F2F2F7">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
```

```css
html { -webkit-text-size-adjust: 100%; }
body {
  margin: 0; background: var(--bg); color: var(--label);
  font: 400 17px/22px var(--font);
  -webkit-font-smoothing: antialiased;
  overscroll-behavior-y: none;
}
* { -webkit-tap-highlight-color: transparent; }
button, a { touch-action: manipulation; }
.screen { min-height: 100dvh; padding-bottom: calc(49px + env(safe-area-inset-bottom)); }
.tabbar { padding-bottom: env(safe-area-inset-bottom); height: calc(49px + env(safe-area-inset-bottom)); }
```

- Inputs must be 16px or larger or iOS Safari zooms on focus.
- Every tappable element is at least 44 × 44px, including icon buttons. Use padding to reach it.
- Pressed state for rows and buttons: background flashes to `var(--fill)` (rows) or opacity 0.6 (text buttons). Not scale-bounce animations on every card.
- No hover-only behavior.

---

## 4. Components

### Large title header
- Screen title only ("Discover"), 34px bold, left-aligned, 16px margin. Above it, optionally, the location as a 15px tint text button with a chevron.
- No logo tile, no tagline.
- On scroll past the title, the bar collapses to a centered 17px / 600 inline title on a translucent bar with a hairline. Implement with an IntersectionObserver on the large title element.

### Search field
- 36px tall, radius 10, fill `var(--fill)`, no border, magnifier in `--label-2` at 16px, placeholder "Search dishes or places" in `--label-2`.
- Sits directly under the large title. Full width minus margins.
- On focus: field animates to fill the top with a "Cancel" tint text button to the right, and suggestions/recents appear as a plain list below (this replaces "Popular searches" chips).
- Filters: a plain 44px icon button (no container) to the right of the title row or inside the field's right edge. When filters are active, show a 6px tint dot on the icon. It opens a bottom sheet.

### Section header
Title 2 (22 / 700) on the left, "See All" in tint 15px on the right. No eyebrow above, no divider line.

### Photo card (horizontal carousel)
- Image on top: aspect 4:5 or 1:1, radius 14, `object-fit: cover`, width about 150–160px so the next card peeks in (this signals scrollability).
- Below the image, not overlaid: Headline title, Footnote meta in `--label-2` ("8 places").
- No card border, no shadow, no surface background behind the text. The photo is the card.
- `scroll-snap-type: x mandatory; scroll-padding-left: 16px`, hide scrollbar.

### List row (restaurants)
Inset grouped list: one white surface group with radius 16, rows separated by 0.5px separators that start at the text (inset past the thumbnail), not edge to edge.

```
[ 64px thumb r12 ]  Name                       (Headline)
                    Kinalas · ₱₱ · 350 m        (Subhead, label-2)
                    Open until 9 PM             (Footnote, green only if open now)   ›
```

- Row min height 72px. Trailing chevron, or a bookmark icon button for Save.
- Green/red status text always comes with words ("Open", "Closed"), never color alone.

### Tab bar
- 4 items: Discover, Categories, Map, Saved. Icons 25px, outline when inactive in `--inactive`, filled when active in `--tint`. Labels 10px / 500.
- No pill or blob behind the active item. No badges unless something needs attention.
- Translucent `.bar` material, hairline top border, safe-area padding.
- Use one consistent icon family (SF Symbols-style: Lucide, Phosphor "regular/fill", or Ionicons outline/filled). Stroke 1.75–2px. Do not mix families.

### Bottom sheet (filters, place details preview)
Top radius 24, grabber 36 × 5px radius 3 in `--label-3`, 8px from top, dimmed backdrop rgba(0,0,0,0.3), slides up with `var(--ease)` at 380ms, drag to dismiss. Filters inside use grouped rows with switches and a segmented control, not a wall of chips.

### Buttons
- Primary: full width, 50px, radius 14, tint fill, white 17 / 600 text. One per screen at most.
- Secondary: tint text, no fill.
- Do not stack more than two buttons.

---

## 5. Content and copy

Copy is part of the design. Write for someone hungry and walking around Naga.

- Sentence case. No all-caps labels. No trailing arrows on links. No middle-dot strings as decoration (middle dots are fine for real meta like `Kinalas · ₱₱ · 350 m`).
- Name things by what the person wants: "Bicol classics", "Near you", "Open now", "Saved". Not "Spatial discovery", "Culinary strips", "Curated".
- Delete subheads that explain the app to people already inside it. If a screen needs a paragraph to explain itself, redesign the screen.
- Never invent ratings, review counts, "verified" badges, or "trending" labels that the data does not support. Show only fields that exist.
- Empty states say what to do: "Nothing saved yet. Tap the bookmark on any place to keep it here."

---

## 6. Food-app specifics

The app's core promise is: pick a dish, then see who serves it. Build the hierarchy around that.

1. Dish first. Home is dish photography (Kinalas, Sinanglay, pili treats, toasted siopao, Bicol Express, laing). Tapping a dish opens the list of places serving it, sorted by distance, with open-now shown.
2. Photos are mandatory. Use real photos (own, partner restaurants, or properly licensed). While loading, show a solid dominant-color block, not a spinner and not an emoji. Set explicit width/height so layout doesn't jump.
3. Price shown as ₱ / ₱₱ / ₱₱₱, distance in meters or km, and open/closed. These three drive the decision; put them on every row.
4. Location is a control (text button), because people in Naga may be near Magsaysay Ave, Centro, or Barlin, and need to change it.
5. Offline-friendly: keep the DOM light, avoid heavy blur on many elements (only the two bars), lazy-load images below the fold. Many users are on mid-range Android over patchy data.

---

## 7. Target wireframe: Discover

```
 Naga City ⌄                        (15px tint text button)
 Discover                           (Large Title 34/700)
 [ magnifier  Search dishes or places        ]  [filter icon]
 
 Bicol classics                          See All
 [ photo ] [ photo ] [ photo ] [ pho...
 Kinalas    Sinanglay  Pinangat   Laing
 8 places   5 places   6 places   ...

 Near you                                See All
 +--------------------------------------------+
 | [thumb]  Place name                      > |
 |          Kinalas · ₱₱ · 350 m              |
 |          ------------------------------- |
 | [thumb]  Place name                      > |
 |          Sinanglay · ₱ · 700 m             |
 +--------------------------------------------+

 ( Discover )  Categories   Map   Saved       (tab bar)
```

Everything above the tab bar should fit at least one full photo row without scrolling on 390 × 844.

---

## 8. Motion

- Motion answers a tap; it doesn't decorate. Sheet slides, page pushes, row press highlight, heart/bookmark toggle.
- Durations 250–400ms with `var(--ease)`. Nothing loops. No scroll-triggered fade-ups on every section.
- Respect `prefers-reduced-motion: reduce` by replacing slides with simple fades.
- Page transitions between tabs: none or an instant cross-fade. iOS tabs do not slide.

---

## 9. Process

Work one screen at a time. Start with **Discover**, because it sets the pattern for all others.

1. **Audit.** List every tell from section 1 present on the screen.
2. **Plan.** Write the token block (section 2) into the project's global CSS. Confirm the accent color with the user if it isn't already chosen.
3. **Rebuild the shell.** Viewport, safe areas, tab bar, large title, search field (sections 3 and 4).
4. **Rebuild content.** Sections, photo cards, list rows.
5. **Sweep.** Delete every element that is not required for the task on this screen. Ask of each one: what would the person lose if this were gone? If nothing, remove it.
6. **Verify.** Render and screenshot at 390 × 844 (iPhone) and 360 × 800 (common Android), light and dark. Fix overflow, contrast, and tap-target problems. Compare against the checklist below.
7. Only then move to the next screen, reusing the same components.

## 10. Pre-ship checklist

- [ ] One typeface (system font), weights 400 / 600 / 700 only, sizes from the scale
- [ ] One accent color, used only for interactive elements
- [ ] No eyebrow pills, sparkle icons, all-caps labels, or decorative chips
- [ ] No marketing hero or tagline paragraph on an app screen
- [ ] Large title + search field + real content visible without scrolling
- [ ] Photos lead the screen; no invented ratings or badges
- [ ] Separators are 0.5px; shadows only on floating elements
- [ ] Tab bar: translucent, 49px + safe area, filled active icon, no badges for non-urgent counts
- [ ] Every tap target 44 × 44px or larger; inputs 16px or larger
- [ ] Contrast at least 4.5:1 for text, in light and dark
- [ ] Works with safe areas and without horizontal scroll (except carousels)
- [ ] Reduced motion respected

## 11. References to study (and what to take from each)

Take the structure and restraint, not the branding. Open these on a phone and study how they lay out a screen:

- **Apple Maps, Apple Music, App Store**: large titles, section headers with "See All", grouped lists, translucent bars.
- **Airbnb**: photo-first cards, generous whitespace, one accent color, bottom tab bar.
- **Resy and Beli**: restaurant discovery with tight typography and little chrome.
- **Things 3**: how much can be communicated with type and spacing alone.

If the user has a specific reference app (they mentioned one called Tarsi), ask for screenshots and extract its tokens: font, type scale, radii, accent, spacing, and how it handles the header and tab bar. Do not guess.

---

## Kickoff prompt (for AI builders without skill support)

Paste this into Claude Code, Gemini CLI, or any AI coding tool, along with a screenshot of the current screen:

> Redesign this mobile screen so it feels like a native iOS app, following Apple's Human Interface Guidelines. Do not restyle the existing design; rebuild the structure.
>
> Rules: Use the system font (`-apple-system`, Inter as fallback) with Apple's text styles (Large Title 34/700, Title 2 22/700, Headline 17/600, Body 17, Subhead 15, Footnote 13). Use one accent color (#D42F13) for interactive elements only. Background #F2F2F7, white grouped surfaces, 0.5px separators, no shadows except on floating bars and sheets. Screen title as a large title, then an iOS-style search field (36px, radius 10, grey fill, no border), then content. Remove: the marketing headline and subhead, the eyebrow pill with the sparkle icon, the logo tile in the header, the all-caps labels, the chips with search icons, the dark promo card, and the badge on the Saved tab. Location becomes a plain tint text button with a chevron. Filters become a plain icon button that opens a bottom sheet. Home shows photo-led dish cards in a horizontal carousel ("Bicol classics"), then an inset grouped list of nearby places with thumbnail, name, dish, price (₱), distance, and open status. Bottom tab bar: translucent, 49px plus safe area, outline icons inactive and filled tint icons active, no pill behind the active tab.
>
> Handle safe areas (`viewport-fit=cover`, `env(safe-area-inset-*)`), 44px tap targets, 16px inputs, dark mode, and reduced motion. Build Discover first. Screenshot at 390×844 and 360×800 and fix anything that overflows or feels crowded before showing me.
