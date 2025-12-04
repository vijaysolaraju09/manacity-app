import React, { useEffect } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { ShopsStackParamList } from '../../navigation/types';
import { Screen } from '../../components/Screen';
import { ThemedText } from '../../components/Themed';
import ProductCard from '../../components/ProductCard';
import { useShopStore } from '../../store/useShopStore';
import { useTheme } from '../../context/ThemeContext';

type Route = RouteProp<ShopsStackParamList, 'Products'>;

const ProductsScreen = () => {
  const { params } = useRoute<Route>();
  const theme = useTheme();
  const { products, loadProducts, addToCart } = useShopStore();

  useEffect(() => {
    if (params?.shopId) {
      loadProducts(params.shopId);
    }
  }, [params?.shopId]);

  return (
    <Screen scroll={false}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: theme.spacing.lg, gap: 12 }}
        ListHeaderComponent={() => (
          <View style={styles.header}> 
            <ThemedText accessibilityRole="header" style={styles.title}>
              Products
            </ThemedText>
            <ThemedText style={styles.subtitle}>Explore products offered by this shop.</ThemedText>
          </View>
        )}
        renderItem={({ item }) => (
          <ProductCard product={item} layout="list" onAdd={() => params?.shopId && addToCart(params.shopId, item)} />
        )}
        ListEmptyComponent={() => (
          <ThemedText style={{ textAlign: 'center' }}>No products available.</ThemedText>
        )}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    gap: 4,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: '#4A5568',
  },
});

export default ProductsScreen;
