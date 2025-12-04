import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, View, ActivityIndicator, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/Screen';
import { ThemedText } from '../../components/Themed';
import SearchBar from '../../components/SearchBar';
import CategoryChips from '../../components/CategoryChips';
import ShopCard from '../../components/ShopCard';
import { ShopsStackParamList } from '../../navigation/types';
import { useShopStore } from '../../store/useShopStore';
import { useTheme } from '../../context/ThemeContext';

type Navigation = NativeStackNavigationProp<ShopsStackParamList, 'ShopsList'>;

const ShopsListScreen = () => {
  const navigation = useNavigation<Navigation>();
  const theme = useTheme();
  const {
    shops,
    categories,
    selectedCategory,
    searchQuery,
    suggestions,
    hasMore,
    loading,
    setSearchQuery,
    setCategory,
    loadShops,
    loadMoreShops,
  } = useShopStore();

  const [debounceKey, setDebounceKey] = useState(0);

  useEffect(() => {
    loadShops(true);
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => {
      loadShops(true);
      setDebounceKey((prev) => prev + 1);
    }, 400);
    return () => clearTimeout(handle);
  }, [searchQuery, selectedCategory]);

  const ListHeader = useMemo(
    () => (
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <ThemedText accessibilityRole="header" style={styles.title}>
            Shops
          </ThemedText>
          <ThemedText style={styles.subtitle}>Discover local vendors & deals</ThemedText>
        </View>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by shop, category, or area"
          suggestions={suggestions}
          onSelectSuggestion={(value) => setSearchQuery(value)}
        />
        <CategoryChips categories={categories} selected={selectedCategory} onSelect={setCategory} />
      </View>
    ),
    [categories, selectedCategory, searchQuery, suggestions],
  );

  return (
    <Screen scroll={false}>
      <FlatList
        data={shops}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ShopCard shop={item} onPress={() => navigation.navigate('ShopDetails', { shopId: item.id })} />
        )}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={{ paddingBottom: theme.spacing.xl, paddingHorizontal: theme.spacing.lg }}
        onEndReached={() => loadMoreShops()}
        onEndReachedThreshold={0.4}
        ListFooterComponent={() =>
          loading ? (
            <View style={styles.loader}>
              <ActivityIndicator color={theme.colors.primary} />
            </View>
          ) : !hasMore ? (
            <ThemedText style={styles.footerText}>No more shops to show</ThemedText>
          ) : null
        }
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        extraData={debounceKey}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    gap: 12,
    paddingTop: 12,
    paddingBottom: 8,
  },
  titleRow: {
    gap: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: '#4A5568',
  },
  loader: {
    paddingVertical: 16,
  },
  footerText: {
    textAlign: 'center',
    paddingVertical: 12,
    color: '#4A5568',
  },
});

export default ShopsListScreen;
