import React from 'react';
import { Modal, View, StyleSheet, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Product } from '../types/shops';
import { ThemedText } from './Themed';
import PrimaryButton from './PrimaryButton';

interface Props {
  visible: boolean;
  product?: Product;
  onClose: () => void;
  onAdd: () => void;
}

const ProductDetailModal: React.FC<Props> = ({ visible, product, onClose, onAdd }) => {
  const theme = useTheme();
  if (!product) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.modal, { backgroundColor: theme.colors.surface }]}> 
          <Pressable accessibilityRole="button" onPress={onClose} style={styles.closeIcon}>
            <Ionicons name="close" size={20} color={theme.colors.text} />
          </Pressable>
          <Image
            source={{ uri: product.image || 'https://via.placeholder.com/400x200.png?text=Product' }}
            style={styles.image}
          />
          <ThemedText style={styles.title}>{product.name}</ThemedText>
          <ThemedText style={styles.price}>${product.price.toFixed(2)}</ThemedText>
          <ThemedText style={styles.description}>{product.description}</ThemedText>
          <ThemedText style={styles.stock}>{product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</ThemedText>
          <PrimaryButton title="Add to Cart" onPress={onAdd} disabled={product.stock <= 0} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 16,
  },
  modal: {
    borderRadius: 16,
    padding: 16,
  },
  closeIcon: {
    alignSelf: 'flex-end',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  price: {
    fontSize: 16,
    marginVertical: 6,
  },
  description: {
    color: '#4A5568',
    marginBottom: 8,
  },
  stock: {
    marginBottom: 12,
  },
});

export default ProductDetailModal;
