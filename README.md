# 🌶️ Naga Food Discovery (Taste the Heart of Bicol)

An iOS Human Interface Guidelines (HIG)-grounded mobile culinary exploration app dedicated to discovering authentic Bicolano dishes and local food establishments across **Naga City, Camarines Sur**.

---

## 🌟 Key Features

- **🍲 Heritage Dish Discovery**: Explore iconic dishes such as Kinalas, Sinantol, Bicol Express, Laing, and Toasted Siopao with historical and cultural context.
- **🧭 Craving Dial & Surprise Me**: Quick dynamic filters based on craving profiles (Savory, Spicy, Soupy, Merienda) and an interactive randomizer spinner.
- **🗺️ Interactive Naga Food Map**: Discover authentic food stops across Centro, Peñafrancia, Magsaysay, Bagumbayan, and Dayangdang.
- **🏆 Gamified Culinary Quests**: Complete tasting quests, earn explorer XP, and level up from *Foodie Bagito* to *Bicolano Gourmet Master*.
- **❤️ Saved Favorites**: Bookmark must-visit carinderias, bakeries, and heritage food stations with offline-ready local state.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Expo](https://expo.dev) / React Native
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation)
- **Language**: TypeScript (Strict typing)
- **Styling**: Vanilla React Native StyleSheet + iOS HIG Tokens (`#D42F13` Sili Red accent)
- **Design System**: Native mobile iOS aesthetic with support for Light and Dark modes.

---

## 📂 Project Structure

```text
frontend/
├── src/
│   ├── app/                # Expo Router screens and tab navigators
│   │   ├── _layout.tsx     # Root stack and providers
│   │   ├── index.tsx       # Home screen with Craving Dial & Quests
│   │   ├── explore.tsx     # Filterable food catalog
│   │   ├── map.tsx         # Naga City map coordinates and eatery pins
│   │   ├── saved.tsx       # Saved dishes and bookmarks
│   │   └── profile.tsx     # User explorer stats, ranks, and achievements
│   ├── components/         # Modular, memoized UI components
│   ├── constants/          # Theme tokens, spacing, typography, and Naga geo constants
│   ├── context/            # React state providers (SavedContext)
│   ├── data/               # Mock dataset, types, and gamification presets
│   ├── hooks/              # Custom React hooks (theming, saved queries)
│   └── types/              # Ambient declarations and shared contracts
└── assets/                 # App icons, splash screens, and food media
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Development Server

```bash
npx expo start
```

Press `a` for Android Emulator, `i` for iOS Simulator, or `w` for Web.

### 3. Quality & Verification Commands

```bash
npx tsc --noEmit     # Type check
npx expo lint        # Code formatting and linting
npx expo-doctor      # Dependency and environment diagnosis
```

---

## 📜 Cultural Dedication

Created with passion for the rich culinary heritage of Naga City, Bicol — honoring the cooks, vendors, and carinderias preserving traditional flavors.
