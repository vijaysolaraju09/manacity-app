import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import { selectCartTotals, useShopStore } from '../../store/useShopStore';
import { ShopsStackParamList } from '../../navigation/types';
import PrimaryButton from '../../components/PrimaryButton';
import { useTheme } from '../../context/ThemeContext';

type Navigation = NativeStackNavigationProp<ShopsStackParamList, 'Cart'>;

const CartScreen = () => {
  const navigation = useNavigation<Navigation>();
  const theme = useTheme();
  const { cart, updateQuantity, removeFromCart, clearCart } = useShopStore();
  const totals = useShopStore(selectCartTotals);

  const renderItem = ({ item }: any) => (
    <Card style={styles.card}>
      <View style={{ flex: 1 }}>
        <ThemedText style={styles.title}>{item.name}</ThemedText>
        <ThemedText style={styles.subtitle}>${item.price.toFixed(2)} • {item.quantity} pcs</ThemedText>
      </View>
      <View style={styles.quantityRow}>
        <Pressable
          accessibilityRole="button"
          onPress={() => updateQuantity(item.id, item.quantity - 1)}
          style={[styles.qtyButton, { borderColor: theme.colors.border }]}
        >
          <ThemedText>-</ThemedText>
        </Pressable>
        <ThemedText style={styles.qtyValue}>{item.quantity}</ThemedText>
        <Pressable
          accessibilityRole="button"
          onPress={() => updateQuantity(item.id, item.quantity + 1)}
          style={[styles.qtyButton, { borderColor: theme.colors.border }]}
        >
          <ThemedText>+</ThemedText>
        </Pressable>
      </View>
      <Pressable accessibilityRole="button" onPress={() => removeFromCart(item.id)}>
        <ThemedText style={styles.remove}>Remove</ThemedText>
      </Pressable>
    </Card>
  );

  return (
    <Screen scroll={false}>
      <View style={styles.header}> 
        <ThemedText accessibilityRole="header" style={styles.titleHeader}>
          Cart
        </ThemedText>
        <ThemedText style={styles.subtitle}>Review items before checkout</ThemedText>
      </View>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <Card>
            <ThemedText>Your cart is empty. Add items from a shop.</ThemedText>
          </Card>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.xl }}
      />
      <Card style={[styles.summary, { marginHorizontal: theme.spacing.lg }]}> 
        <ThemedText style={styles.summaryTitle}>Order Summary</ThemedText>
        <View style={styles.summaryRow}>
          <ThemedText>Subtotal</ThemedText>
          <ThemedText>${totals.subtotal.toFixed(2)}</ThemedText>
        </View>
        <View style={styles.summaryRow}>
          <ThemedText>Tax (placeholder)</ThemedText>
          <ThemedText>${totals.tax.toFixed(2)}</ThemedText>
        </View>
        <View style={styles.summaryRow}>
          <ThemedText style={styles.total}>Total</ThemedText>
          <ThemedText style={styles.total}>${totals.total.toFixed(2)}</ThemedText>
        </View>
        <PrimaryButton
          title="Proceed to Checkout"
          onPress={() => navigation.navigate('Checkout')}
          disabled={cart.length === 0}
          style={{ marginTop: 12 }}
        />
        <Pressable accessibilityRole="button" onPress={clearCart} style={styles.clear}>
          <ThemedText style={styles.remove}>Clear Cart</ThemedText>
        </Pressable>
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  titleHeader: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: '#4A5568',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  qtyButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  qtyValue: {
    fontWeight: '700',
  },
  remove: {
    color: '#E11D48',
  },
  summary: {
    gap: 8,
  },
  summaryTitle: {
    fontWeight: '700',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  total: {
    fontSize: 18,
    fontWeight: '700',
  },
  clear: {
    marginTop: 8,
    alignSelf: 'center',
  },
});

export default CartScreen;
