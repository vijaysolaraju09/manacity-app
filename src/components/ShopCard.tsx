import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Card, ThemedText } from './Themed';
import { Shop } from '../types/shops';
import { ShimmerImage } from './loading/ShimmerImage';

interface Props {
  shop: Shop;
  onPress?: () => void;
}

const ShopCard: React.FC<Props> = ({ shop, onPress }) => {
  const theme = useTheme();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`Shop ${shop.name}`}>
      <Card style={styles.card}>
        <ShimmerImage
          source={{ uri: shop.image || 'https://via.placeholder.com/400x200.png?text=Shop' }}
          style={styles.image}
          accessibilityLabel={`${shop.name} cover`}
        />
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <ThemedText style={styles.name}>{shop.name}</ThemedText>
            <View style={[styles.badge, { backgroundColor: shop.isOpen ? theme.colors.success : theme.colors.danger }]}>
              <ThemedText style={styles.badgeText}>{shop.isOpen ? 'Open' : 'Closed'}</ThemedText>
            </View>
          </View>
          <ThemedText style={styles.meta}>{shop.category} • {shop.area}</ThemedText>
          <View style={styles.footerRow}>
            <View style={styles.ratingRow}>
              <Ionicons name="star" color={theme.colors.accent} size={16} />
              <ThemedText style={styles.rating}>{shop.rating?.toFixed(1) ?? '4.5'}</ThemedText>
            </View>
            <View style={styles.footerRight}>
              <Ionicons name="location" size={14} color={theme.colors.muted} />
              <ThemedText style={styles.mutedText}>{shop.address || shop.area}</ThemedText>
            </View>
          </View>
        </View>
      </Card>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 160,
  },
  content: {
    padding: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
  },
  meta: {
    marginTop: 4,
    color: '#4A5568',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontWeight: '600',
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  mutedText: {
    color: '#4A5568',
    flexShrink: 1,
  },
});

export default ShopCard;
