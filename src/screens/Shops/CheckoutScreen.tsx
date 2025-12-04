import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import { selectCartTotals, useShopStore } from '../../store/useShopStore';
import PrimaryButton from '../../components/PrimaryButton';
import { ShopsStackParamList } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';

type Navigation = NativeStackNavigationProp<ShopsStackParamList, 'Checkout'>;

const CheckoutScreen = () => {
  const navigation = useNavigation<Navigation>();
  const theme = useTheme();
  const totals = useShopStore(selectCartTotals);
  const { orderConfirmation, submitOrder } = useShopStore();
  const [note, setNote] = useState('Cash on Delivery');
  const [address, setAddress] = useState('');
  const [method, setMethod] = useState<'cod' | 'pickup'>('cod');
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    setSubmitting(true);
    await submitOrder({ note: method === 'cod' ? 'Cash on Delivery' : 'Pickup from store', address });
    setSubmitting(false);
  };

  return (
    <Screen scroll>
      <View style={styles.header}> 
        <ThemedText accessibilityRole="header" style={styles.title}>
          Checkout
        </ThemedText>
        <ThemedText style={styles.subtitle}>Local/manual checkout flow</ThemedText>
      </View>
      <Card style={styles.card}> 
        <ThemedText style={styles.sectionTitle}>Order Summary</ThemedText>
        <View style={styles.row}>
          <ThemedText>Subtotal</ThemedText>
          <ThemedText>${totals.subtotal.toFixed(2)}</ThemedText>
        </View>
        <View style={styles.row}>
          <ThemedText>Tax</ThemedText>
          <ThemedText>${totals.tax.toFixed(2)}</ThemedText>
        </View>
        <View style={styles.row}>
          <ThemedText style={styles.total}>Total</ThemedText>
          <ThemedText style={styles.total}>${totals.total.toFixed(2)}</ThemedText>
        </View>
      </Card>

      <Card style={styles.card}> 
        <ThemedText style={styles.sectionTitle}>Delivery Preferences</ThemedText>
        <View style={styles.toggleRow}>
          {['cod', 'pickup'].map((option) => (
            <Pressable
              key={option}
              accessibilityRole="button"
              onPress={() => setMethod(option as 'cod' | 'pickup')}
              style={[styles.toggle, method === option && { backgroundColor: theme.colors.primary }]}
            >
              <ThemedText style={{ color: method === option ? '#fff' : theme.colors.text }}>
                {option === 'cod' ? 'Cash on Delivery' : 'Pickup Note'}
              </ThemedText>
            </Pressable>
          ))}
        </View>
        <ThemedText style={styles.fieldLabel}>Delivery Address (future-proof)</ThemedText>
        <TextInput
          placeholder="Enter delivery address"
          placeholderTextColor={theme.colors.muted}
          style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
          value={address}
          onChangeText={setAddress}
        />
        <ThemedText style={styles.fieldLabel}>Notes</ThemedText>
        <TextInput
          placeholder="Add a note for the rider or pickup"
          placeholderTextColor={theme.colors.muted}
          style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
          value={note}
          onChangeText={setNote}
          multiline
        />
      </Card>

      <PrimaryButton title="Confirm Order" onPress={handleConfirm} style={styles.button} loading={submitting} />

      {orderConfirmation && (
        <Card style={styles.card}> 
          <ThemedText style={styles.sectionTitle}>Order Confirmed</ThemedText>
          <ThemedText>Order Number: {orderConfirmation.orderNumber}</ThemedText>
          <ThemedText>ETA: {orderConfirmation.eta}</ThemedText>
          <PrimaryButton
            title="Back to Shops"
            onPress={() => navigation.navigate('ShopsList')}
            style={{ marginTop: 12 }}
          />
        </Card>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 12,
    gap: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: '#4A5568',
  },
  card: {
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  total: {
    fontSize: 18,
    fontWeight: '700',
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  toggle: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  fieldLabel: {
    marginTop: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    minHeight: 44,
  },
  button: {
    marginVertical: 12,
  },
});

export default CheckoutScreen;
