import React from 'react';
import { View, StyleSheet, StyleProp, ImageStyle, ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Image as ExpoImage } from 'expo-image';
import { extractSvgXml } from '@/utils/dicebearAvatar';

export interface UserAvatarProps {
  uri: string;
  size?: number;
  style?: StyleProp<ImageStyle | ViewStyle>;
  borderRadius?: number;
  accessibilityLabel?: string;
}

/**
 * Universal Avatar component that renders DiceBear SVG natively on Android, iOS, and Web.
 * Automatically detects SVG data URIs, raw SVG XML, or HTTP bitmap image URLs.
 */
export const UserAvatar: React.FC<UserAvatarProps> = ({
  uri,
  size,
  style,
  borderRadius: customRadius,
  accessibilityLabel,
}) => {
  const flattened = (StyleSheet.flatten(style) || {}) as Record<string, any>;
  const width = size || flattened.width || 40;
  const height = size || flattened.height || 40;
  const borderRadius =
    customRadius !== undefined
      ? customRadius
      : flattened.borderRadius !== undefined
      ? flattened.borderRadius
      : Number(width) / 2;

  const svgXml = extractSvgXml(uri);

  if (svgXml) {
    return (
      <View
        style={[
          styles.container,
          {
            width,
            height,
            borderRadius,
          },
          style,
        ]}
        accessibilityRole="image"
        accessibilityLabel={accessibilityLabel || 'User avatar'}
      >
        <SvgXml xml={svgXml} width={width} height={height} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
          borderRadius,
        },
        style,
      ]}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel || 'User avatar'}
    >
      <ExpoImage
        source={{ uri }}
        style={styles.image}
        contentFit="cover"
        transition={150}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
