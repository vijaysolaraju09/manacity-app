import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  style?: ViewStyle;
  borderRadius?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({ width = '100%', height = 16, style, borderRadius }) => {
  const shimmer = useRef(new Animated.Value(0)).current;
  const theme = useTheme();

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [shimmer]);

  const backgroundColor = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.border, '#e8eef6'],
  });

  return <Animated.View style={[styles.skeleton, { width, height, borderRadius: borderRadius ?? theme.roundness, backgroundColor }, style]} />;
};

export const SkeletonBlock: React.FC<{ lines?: number } & Pick<SkeletonProps, 'height'> > = ({ lines = 3, height }) => {
  const rows = Array.from({ length: lines });
  return (
    <View style={styles.block}>
      {rows.map((_, idx) => (
        <Skeleton key={idx} height={height ?? 14} width={`${90 - idx * 10}%`} style={idx === rows.length - 1 ? undefined : styles.spacing} />
      ))}
    </View>
  );
};

export default Skeleton;

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
  block: {
    gap: 8,
  },
  spacing: {
    marginBottom: 8,
  },
});
