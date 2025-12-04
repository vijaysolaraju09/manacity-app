import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Product } from '../types/shops';
import { Card, ThemedText } from './Themed';
import PrimaryButton from './PrimaryButton';

interface Props {
  product: Product;
  layout?: 'grid' | 'list';
  onAdd: () => void;
  onPress?: () => void;
}

const ProductCard: React.FC<Props> = ({ product, layout = 'grid', onAdd, onPress }) => {
  const theme = useTheme();
  const isGrid = layout === 'grid';

  return (
    <Pressable onPress={onPress} style={{ flex: isGrid ? 1 : undefined }} accessibilityRole="button">
      <Card style={[styles.card, { flexDirection: isGrid ? 'column' : 'row' }]}> 
        <Image
          source={{ uri: product.image || 'https://via.placeholder.com/200x200.png?text=Product' }}
          style={[styles.image, isGrid ? styles.gridImage : styles.listImage]}
        />
        <View style={[styles.content, { flex: 1 }]}>
          <ThemedText style={styles.title}>{product.name}</ThemedText>
          <ThemedText style={styles.subtitle}>{product.description}</ThemedText>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="pricetag" size={16} color={theme.colors.accent} />
              <ThemedText style={styles.price}>${product.price.toFixed(2)}</ThemedText>
            </View>
            <ThemedText style={styles.stock}>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</ThemedText>
          </View>
          <PrimaryButton
            title="Add to Cart"
            onPress={onAdd}
            disabled={product.stock <= 0}
            style={styles.button}
          />
        </View>
      </Card>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 12,
    gap: 12,
  },
  image: {
    borderRadius: 12,
    backgroundColor: '#f0f4f8',
  },
  gridImage: {
    width: '100%',
    height: 150,
  },
  listImage: {
    width: 120,
    height: 120,
  },
  content: {
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    color: '#4A5568',
    fontSize: 14,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
  },
  stock: {
    color: '#4A5568',
  },
  button: {
    marginTop: 4,
  },
});

export default ProductCard;
