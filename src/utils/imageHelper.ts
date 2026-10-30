import { ImageSourcePropType } from 'react-native';

export type FoodImageSource = ImageSourcePropType | string | undefined | null;

/**
 * Universal resolver for food images.
 * Transparently accepts either a static require(...) bundle asset
 * or a string URL / URI ({ uri: '...' }).
 */
export function resolveFoodImage(
  source: FoodImageSource,
  fallback?: ImageSourcePropType
): ImageSourcePropType {
  if (!source) {
    return fallback ?? require('../../assets/images/dishes/kinalas.webp');
  }
  if (typeof source === 'string') {
    return { uri: source };
  }
  return source as ImageSourcePropType;
}

