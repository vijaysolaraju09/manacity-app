import React, { useState } from 'react';
import { Image, ImageProps, StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';

interface ShimmerImageProps extends ImageProps {
  aspectRatio?: number;
}

export const ShimmerImage: React.FC<ShimmerImageProps> = ({ aspectRatio = 16 / 9, style, onLoadEnd, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <View style={[styles.container, { aspectRatio }, style]} accessibilityLabel={rest.accessibilityLabel}>
      {!loaded && <Skeleton style={StyleSheet.absoluteFillObject} />}
      <Image
        style={[StyleSheet.absoluteFill, styles.image, style]}
        onLoadEnd={(e) => {
          setLoaded(true);
          onLoadEnd?.(e);
        }}
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
