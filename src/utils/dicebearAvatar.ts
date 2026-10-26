import { Style, Avatar } from '@dicebear/core';
import definition from '@dicebear/styles/adventurer-neutral.json' with { type: 'json' };

// Curated palette of soft, vibrant background hex colors for DiceBear avatars
export const AVATAR_BG_COLORS = [
  'b6e3f4', // soft sky blue
  'c0aede', // lavender
  'd1d4f9', // periwinkle
  'ffd5dc', // rose blush
  'ffdfbf', // warm peach
  'd5e8d4', // mint green
  'ffe6cc', // cream apricot
  'e1d5e7', // thistle purple
];

// Cache to prevent regenerating identical avatars repeatedly
const avatarCache = new Map<string, string>();
const svgStringCache = new Map<string, string>();
const style = new Style(definition as any);

/**
 * Inlines <use> references and strips non-rendering metadata/defs.
 * This ensures 100% bug-free rendering across Android (react-native-svg), iOS, and Web.
 */
export function cleanDiceBearSvg(svg: string): string {
  const defMap = new Map<string, string>();
  const defMatch = svg.match(/<defs>([\s\S]*?)<\/defs>/);
  if (defMatch) {
    const defContent = defMatch[1];
    const regex = /<g id="([^"]+)">([\s\S]*?)<\/g>/g;
    let m: RegExpExecArray | null;
    while ((m = regex.exec(defContent)) !== null) {
      defMap.set(m[1], m[2]);
    }
  }

  // Replace <use transform="..." href="#id"/> with <g transform="...">inner</g>
  let inlined = svg.replace(/<use transform="([^"]+)" href="#([^"]+)"\s*\/>/g, (match, trans, id) => {
    const inner = defMap.get(id);
    if (inner) {
      return `<g transform="${trans}">${inner}</g>`;
    }
    return match;
  });

  // Strip <metadata>...</metadata>
  inlined = inlined.replace(/<metadata[\s\S]*?<\/metadata>/g, '');
  // Strip <defs>...</defs>
  inlined = inlined.replace(/<defs[\s\S]*?<\/defs>/g, '');
  // Strip clip-path attributes
  inlined = inlined.replace(/\s*clip-path="[^"]*"/g, '');

  return inlined;
}

/**
 * Helper to determine consistent background color from seed
 */
function getBgColor(seed: string, bgColor?: string): string {
  if (bgColor) return bgColor;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const colorIndex = Math.abs(hash) % AVATAR_BG_COLORS.length;
  return AVATAR_BG_COLORS[colorIndex];
}

/**
 * Generates the clean raw SVG string for Adventurer Neutral:
 * const avatar = new Avatar(style, { seed, backgroundColor: [color] });
 * const svg = avatar.toString();
 */
export function getDiceBearAvatarSvg(seed: string, bgColor?: string): string {
  const chosenBg = getBgColor(seed, bgColor);
  const cacheKey = `${seed}_${chosenBg}`;
  if (svgStringCache.has(cacheKey)) {
    return svgStringCache.get(cacheKey)!;
  }

  try {
    const avatar = new Avatar(style, {
      seed,
      backgroundColor: [chosenBg],
    });

    const rawSvg = avatar.toString();
    const cleaned = cleanDiceBearSvg(rawSvg);
    svgStringCache.set(cacheKey, cleaned);
    return cleaned;
  } catch (err) {
    console.warn('Failed to generate DiceBear SVG for seed:', seed, err);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="#${chosenBg}"/></svg>`;
  }
}

/**
 * Generates an Adventurer Neutral avatar data URI with a random or seeded background color.
 */
export function getDiceBearAvatar(seed: string, bgColor?: string): string {
  const chosenBg = getBgColor(seed, bgColor);
  const cacheKey = `${seed}_${chosenBg}`;
  if (avatarCache.has(cacheKey)) {
    return avatarCache.get(cacheKey)!;
  }

  try {
    const cleanedSvg = getDiceBearAvatarSvg(seed, chosenBg);
    const dataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(cleanedSvg)}`;
    avatarCache.set(cacheKey, dataUri);
    return dataUri;
  } catch (err) {
    console.warn('Failed to generate DiceBear avatar for seed:', seed, err);
    return `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${chosenBg}`;
  }
}

/**
 * Extracts raw SVG XML from either raw <svg> string or data:image/svg+xml data URI.
 */
export function extractSvgXml(uri: string): string | null {
  if (!uri) return null;
  const trimmed = uri.trim();
  if (trimmed.startsWith('<svg') || trimmed.includes('<svg xmlns=')) {
    return trimmed;
  }
  if (trimmed.startsWith('data:image/svg+xml')) {
    const commaIndex = trimmed.indexOf(',');
    if (commaIndex !== -1) {
      const data = trimmed.slice(commaIndex + 1);
      if (trimmed.includes(';base64,')) {
        try {
          if (typeof atob === 'function') {
            return atob(data);
          }
        } catch {
          // ignore
        }
      }
      try {
        return decodeURIComponent(data);
      } catch {
        return data;
      }
    }
  }
  return null;
}
