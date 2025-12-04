import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import { ShopsStackParamList } from '../../navigation/types';
import { useShopStore } from '../../store/useShopStore';
import { useTheme } from '../../context/ThemeContext';
import ProductCard from '../../components/ProductCard';
import ProductDetailModal from '../../components/ProductDetailModal';

type Route = RouteProp<ShopsStackParamList, 'ShopDetails'>;

const ShopDetailsScreen = () => {
  const { params } = useRoute<Route>();
  const theme = useTheme();
  const { currentShop, products, loading, loadShopDetails, loadProducts, addToCart } = useShopStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  useEffect(() => {
    loadShopDetails(params.shopId);
    loadProducts(params.shopId);
  }, [params.shopId]);

  const selectedProductData = useMemo(
    () => products.find((product) => product.id === selectedProduct),
    [selectedProduct, products],
  );

  const header = useMemo(
    () => (
      <View style={styles.header}>
        {currentShop && (
          <>
            <Image
              source={{ uri: currentShop.image || 'https://via.placeholder.com/600x300.png?text=Shop' }}
              style={styles.hero}
            />
            <View style={styles.headerContent}>
              <View style={styles.headerTopRow}>
                <View style={{ flex: 1 }}>
                  <ThemedText style={styles.shopName}>{currentShop.name}</ThemedText>
                  <ThemedText style={styles.meta}>{currentShop.category} • {currentShop.area}</ThemedText>
                </View>
                <View style={[styles.status, { backgroundColor: currentShop.isOpen ? theme.colors.success : theme.colors.danger }]}>
                  <ThemedText style={styles.statusText}>{currentShop.isOpen ? 'Open' : 'Closed'}</ThemedText>
                </View>
              </View>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Ionicons name="star" size={16} color={theme.colors.accent} />
                  <ThemedText>{currentShop.rating?.toFixed(1) ?? '4.6'}</ThemedText>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="location" size={16} color={theme.colors.muted} />
                  <ThemedText style={styles.muted}>{currentShop.address || currentShop.area}</ThemedText>
                </View>
              </View>
              <ThemedText style={styles.muted}>Timings: {currentShop.timings || '9:00 AM - 9:00 PM'}</ThemedText>
            </View>
          </>
        )}
        <View style={styles.toggleRow}>
          <ThemedText style={styles.sectionTitle}>Products</ThemedText>
          <View style={styles.toggleButtons}>
            <Pressable
              accessibilityRole="button"
              style={[styles.toggleButton, viewMode === 'grid' && { backgroundColor: theme.colors.primary }]}
              onPress={() => setViewMode('grid')}
            >
              <Ionicons name="grid" size={18} color={viewMode === 'grid' ? '#fff' : theme.colors.text} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              style={[styles.toggleButton, viewMode === 'list' && { backgroundColor: theme.colors.primary }]}
              onPress={() => setViewMode('list')}
            >
              <Ionicons name="list" size={18} color={viewMode === 'list' ? '#fff' : theme.colors.text} />
            </Pressable>
          </View>
        </View>
        {currentShop?.featuredProducts && currentShop.featuredProducts.length > 0 && (
          <Card>
            <ThemedText style={styles.sectionSubtitle}>Featured Products</ThemedText>
            {currentShop.featuredProducts.map((product) => (
              <Pressable key={product.id} onPress={() => setSelectedProduct(product.id)} style={styles.featuredRow}>
                <Ionicons name="flame" size={16} color={theme.colors.accent} />
                <ThemedText style={{ flex: 1 }}>{product.name}</ThemedText>
                <ThemedText style={styles.price}>${product.price.toFixed(2)}</ThemedText>
              </Pressable>
            ))}
          </Card>
        )}
      </View>
    ),
    [currentShop, theme, viewMode],
  );

  if (loading && !currentShop) {
    return (
      <Screen scroll={false}>
        <View style={styles.loader}> 
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll={false}>
      <FlatList
        data={products}
        numColumns={viewMode === 'grid' ? 2 : 1}
        contentContainerStyle={{ paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.xl }}
        columnWrapperStyle={viewMode === 'grid' ? { gap: 12 } : undefined}
        ItemSeparatorComponent={() => <View style={{ height: viewMode === 'list' ? 12 : 0 }} />}
        key={viewMode}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={header}
        renderItem={({ item }) => (
          <View style={viewMode === 'grid' ? styles.gridItem : undefined}>
            <ProductCard
              product={item}
              layout={viewMode}
              onAdd={() => addToCart(params.shopId, item)}
              onPress={() => setSelectedProduct(item.id)}
            />
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.loader}> 
            {loading ? <ActivityIndicator color={theme.colors.primary} /> : <ThemedText>No products found.</ThemedText>}
          </View>
        )}
      />
      <ProductDetailModal
        visible={!!selectedProduct}
        product={selectedProductData}
        onClose={() => setSelectedProduct(null)}
        onAdd={() => {
          if (selectedProductData) {
            addToCart(params.shopId, selectedProductData);
            setSelectedProduct(null);
          }
        }}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    gap: 12,
    paddingTop: 12,
    paddingBottom: 16,
  },
  hero: {
    width: '100%',
    height: 220,
    borderRadius: 12,
  },
  headerContent: {
    gap: 8,
    marginTop: 8,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopName: {
    fontSize: 22,
    fontWeight: '700',
  },
  meta: {
    color: '#4A5568',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  muted: {
    color: '#4A5568',
    flexShrink: 1,
  },
  status: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  toggleButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleButton: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  featuredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  price: {
    fontWeight: '700',
  },
  gridItem: {
    flex: 1,
  },
  loader: {
    alignItems: 'center',
    paddingVertical: 24,
  },
});

export default ShopDetailsScreen;
