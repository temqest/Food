import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export type TrailSide = 'left' | 'right' | 'center';

interface TrailSteppingBridgeProps {
  fromSide?: TrailSide;
  toSide?: TrailSide;
  status: 'completed' | 'active' | 'upcoming';
  height?: number;
}

// Global anchor X resolver: anchors road exit/entry points on the cards
export const getTrailAnchorX = (side: TrailSide = 'center', width: number): number => {
  if (side === 'left') return Math.round(width * 0.28);
  if (side === 'right') return Math.round(width * 0.72);
  return Math.round(width * 0.50);
};

export const TrailSteppingBridge: React.FC<TrailSteppingBridgeProps> = ({
  fromSide = 'left',
  toSide = 'right',
  status,
  height = 50, // Optimal vertical height for a graceful, natural winding road S-curve
}) => {
  const { width: screenWidth } = useWindowDimensions();

  const startX = getTrailAnchorX(fromSide, screenWidth);
  const endX = getTrailAnchorX(toSide, screenWidth);

  const isCompleted = status === 'completed';
  const isActive = status === 'active';

  // Sili Red for completed/active, warm vintage parchment neutral for upcoming
  const strokeColor = isCompleted
    ? '#D42F13'
    : isActive
    ? '#D42F13'
    : 'rgba(135, 125, 115, 0.45)';

  // Cubic Bezier S-curve with strictly vertical perpendicular tangents at start and end
  // This guarantees the road seamlessly docks straight into the top/bottom borders of the cards
  const pathD = `M ${startX} 0 C ${startX} ${height * 0.55}, ${endX} ${height * 0.45}, ${endX} ${height}`;

  return (
    <View style={[styles.container, { height, width: screenWidth }]}>
      <Svg width={screenWidth} height={height} style={StyleSheet.absoluteFill}>
        {/* Soft underlying road shadow track */}
        <Path
          d={pathD}
          stroke="rgba(0, 0, 0, 0.05)"
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
        />

        {/* Winding Dashed Road Line: - - - - - */}
        <Path
          d={pathD}
          stroke={strokeColor}
          strokeWidth={3}
          strokeDasharray="7, 5"
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'visible',
    alignSelf: 'center',
    marginVertical: 0,
    zIndex: 1,
  },
});
