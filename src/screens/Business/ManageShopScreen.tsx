import React, { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import FormTextInput from '../../components/FormTextInput';
import PrimaryButton from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import { useTheme } from '../../context/ThemeContext';
import { useBusinessShop, useUpdateBusinessShop } from '../../hooks/useBusiness';
import { BusinessHours, BusinessShopProfile } from '../../types/shops';

const defaultHours: BusinessHours[] = [
  { day: 'Monday', open: '08:00', close: '21:00' },
  { day: 'Tuesday', open: '08:00', close: '21:00' },
  { day: 'Wednesday', open: '08:00', close: '21:00' },
  { day: 'Thursday', open: '08:00', close: '21:00' },
  { day: 'Friday', open: '08:00', close: '21:00' },
  { day: 'Saturday', open: '09:00', close: '20:00' },
  { day: 'Sunday', open: '09:00', close: '18:00', closed: false },
];

type FormState = Pick<BusinessShopProfile, 'name' | 'category' | 'address' | 'description' | 'phone' | 'timings' | 'coverImage'>;

const ManageShopScreen = () => {
  const theme = useTheme();
  const { data: shop } = useBusinessShop();
  const mutation = useUpdateBusinessShop();
  const [form, setForm] = useState<FormState>({
    name: '',
    category: '',
    address: '',
    description: '',
    phone: '',
    timings: '',
    coverImage: '',
  });
  const [hours, setHours] = useState<BusinessHours[]>(defaultHours);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!shop) return;
    setForm({
      name: shop.name,
      category: shop.category,
      address: shop.address || '',
      description: shop.description || '',
      phone: shop.phone || '',
      timings: shop.timings || '',
      coverImage: shop.coverImage || shop.image || '',
    });
    setHours(shop.workingHours?.length ? shop.workingHours : defaultHours);
  }, [shop]);

  const validationErrors = useMemo(() => {
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = 'Shop name is required';
    if (!form.category.trim()) nextErrors.category = 'Category is required';
    if (!form.address.trim()) nextErrors.address = 'Address is required';
    hours.forEach((hour, idx) => {
      if (!hour.closed) {
        if (!hour.open) nextErrors[`open-${idx}`] = 'Open time required';
        if (!hour.close) nextErrors[`close-${idx}`] = 'Close time required';
      }
    });
    return nextErrors;
  }, [form.address, form.category, form.name, hours]);

  const handleChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateHours = (index: number, patch: Partial<BusinessHours>) => {
    setHours((prev) => prev.map((hour, idx) => (idx === index ? { ...hour, ...patch } : hour)));
  };

  const handleSubmit = () => {
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;
    mutation.mutate({ ...shop, ...form, workingHours: hours });
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <ThemedText accessibilityRole="header" style={styles.title}>
          Shop Profile
        </ThemedText>
        <ThemedText style={styles.subtitle}>Update storefront details, hours, and imagery.</ThemedText>

        <Card>
          <FormTextInput
            label="Shop Name"
            value={form.name}
            onChangeText={(text) => handleChange('name', text)}
            placeholder="e.g. Sunrise Grocers"
            error={errors.name}
          />
          <FormTextInput
            label="Category"
            value={form.category}
            onChangeText={(text) => handleChange('category', text)}
            placeholder="Groceries, Cafe, Fashion"
            error={errors.category}
          />
          <FormTextInput
            label="Address"
            value={form.address}
            onChangeText={(text) => handleChange('address', text)}
            placeholder="123 Market Street"
            error={errors.address}
          />
          <FormTextInput
            label="Contact"
            value={form.phone}
            onChangeText={(text) => handleChange('phone', text)}
            placeholder="+233 555 010 010"
            keyboardType="phone-pad"
          />
          <FormTextInput
            label="Short Description"
            value={form.description}
            onChangeText={(text) => handleChange('description', text)}
            placeholder="What makes your shop special?"
            multiline
            style={{ minHeight: 80 }}
          />
          <FormTextInput
            label="Displayed Hours"
            value={form.timings}
            onChangeText={(text) => handleChange('timings', text)}
            placeholder="8:00 AM - 9:00 PM"
          />
        </Card>

        <Card>
          <ThemedText style={styles.sectionTitle}>Cover Image</ThemedText>
          {form.coverImage ? (
            <Image source={{ uri: form.coverImage }} style={styles.cover} />
          ) : null}
          <FormTextInput
            label="Image URL"
            value={form.coverImage}
            onChangeText={(text) => handleChange('coverImage', text)}
            placeholder="https://"
          />
          <ThemedText style={[styles.helper, { color: theme.colors.muted }]}>
            Paste a hosted image URL to update your storefront banner.
          </ThemedText>
        </Card>

        <Card>
          <ThemedText style={styles.sectionTitle}>Working Hours</ThemedText>
          {hours.map((hour, idx) => (
            <View key={hour.day} style={styles.hoursRow}>
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.hoursLabel}>{hour.day}</ThemedText>
                <View style={styles.inlineInputs}>
                  <FormTextInput
                    label="Open"
                    value={hour.open}
                    onChangeText={(text) => updateHours(idx, { open: text })}
                    error={errors[`open-${idx}`]}
                    style={styles.inlineInput}
                    editable={!hour.closed}
                  />
                  <FormTextInput
                    label="Close"
                    value={hour.close}
                    onChangeText={(text) => updateHours(idx, { close: text })}
                    error={errors[`close-${idx}`]}
                    style={styles.inlineInput}
                    editable={!hour.closed}
                  />
                </View>
              </View>
              <View style={styles.switchContainer}>
                <ThemedText style={styles.switchLabel}>Closed</ThemedText>
                <Switch
                  value={!!hour.closed}
                  onValueChange={(value) => updateHours(idx, { closed: value })}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                />
              </View>
            </View>
          ))}
        </Card>

        <Card>
          <ThemedText style={styles.sectionTitle}>Actions</ThemedText>
          <PrimaryButton
            title={mutation.isLoading ? 'Saving...' : 'Save Changes'}
            onPress={handleSubmit}
            loading={mutation.isLoading}
          />
          {Object.keys(errors).length ? (
            <ThemedText style={[styles.helper, { color: theme.colors.danger }]}>Fix errors above to continue.</ThemedText>
          ) : null}
          {mutation.isSuccess ? (
            <ThemedText style={[styles.helper, { color: theme.colors.success || '#22c55e' }]}>Profile updated.</ThemedText>
          ) : null}
        </Card>

        <Pressable style={styles.supportCard}>
          <ThemedText style={styles.supportTitle}>Need help setting up?</ThemedText>
          <ThemedText style={[styles.helper, { color: theme.colors.muted }]}>Our team can assist with onboarding and audits.</ThemedText>
        </Pressable>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: '#4B5563',
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 12,
  },
  cover: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    marginBottom: 12,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  hoursLabel: {
    fontWeight: '600',
    marginBottom: 6,
  },
  inlineInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  inlineInput: {
    flex: 1,
  },
  switchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchLabel: {
    marginBottom: 4,
  },
  helper: {
    marginTop: 8,
  },
  supportCard: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
  },
  supportTitle: {
    fontWeight: '700',
  },
});

export default ManageShopScreen;
