import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import FormTextInput from '../../components/FormTextInput';
import PrimaryButton from '../../components/PrimaryButton';
import { ServiceCategoryCard, ServiceProviderCard } from '../../components/services/ServiceUI';
import { useServicesStore } from '../../store/useServicesStore';
import { ServicesStackParamList } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';

type RequestRoute = RouteProp<ServicesStackParamList, 'ServicesRequestForm'>;

const ServicesRequestFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RequestRoute>();
  const theme = useTheme();
  const { categories, providers, createPublicRequest, createPrivateRequest, createDirectRequest } = useServicesStore();

  const defaultCategory = route.params?.categoryId || categories[0]?.id;
  const [mode, setMode] = useState<'public' | 'private' | 'direct'>(route.params?.mode || 'public');
  const [categoryId, setCategoryId] = useState<string>(defaultCategory);
  const [providerId, setProviderId] = useState<string | undefined>(route.params?.providerId);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');

  const scopedProviders = useMemo(
    () => providers.filter((provider) => (categoryId ? provider.services.includes(categoryId) : true)),
    [providers, categoryId],
  );

  const submit = () => {
    const payload = {
      categoryId,
      title,
      description,
      location,
      priceOffer: Number(price) || undefined,
      requesterName: 'You',
      requesterContact: { email: 'you@example.com', phone: '+234 800 000 1111' },
      assignedProviderId: undefined,
    };
    if (mode === 'private') {
      createPrivateRequest(payload as any);
      navigation.navigate('ServicesPrivate' as never);
      return;
    }
    if (mode === 'direct') {
      const chosenProvider = providerId || scopedProviders[0]?.id;
      createDirectRequest({ ...payload, directProviderId: chosenProvider, assignedProviderId: chosenProvider } as any);
      navigation.navigate('ServicesDirect' as never);
      return;
    }
    createPublicRequest(payload as any);
    navigation.navigate('ServicesPublic' as never);
  };

  return (
    <Screen>
      <ThemedText accessibilityRole="header" style={styles.heading}>
        Create a service request
      </ThemedText>
      <Card>
        <ThemedText style={styles.sectionTitle}>Request type</ThemedText>
        <View style={styles.modeRow}>
          {(['public', 'private', 'direct'] as const).map((option) => (
            <Pressable
              key={option}
              onPress={() => setMode(option)}
              style={({ pressed }) => [
                styles.modeChip,
                {
                  borderColor: mode === option ? theme.colors.primary : theme.colors.border,
                  backgroundColor: mode === option ? theme.colors.primary + '10' : theme.colors.card,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
            >
              <ThemedText style={{ color: mode === option ? theme.colors.primary : theme.colors.text, fontWeight: '600' }}>
                {option.toUpperCase()}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </Card>

      <Card>
        <ThemedText style={styles.sectionTitle}>Pick a category</ThemedText>
        {categories.map((category) => (
          <ServiceCategoryCard
            key={category.id}
            category={category}
            selected={categoryId === category.id}
            onPress={() => setCategoryId(category.id)}
          />
        ))}
      </Card>

      {mode === 'direct' ? (
        <Card>
          <ThemedText style={styles.sectionTitle}>Preferred provider</ThemedText>
          <ThemedText style={{ color: theme.colors.muted }}>Contact is shared after acceptance.</ThemedText>
          {scopedProviders.map((provider) => (
            <ServiceProviderCard
              key={provider.id}
              provider={provider}
              actions={
                <Pressable
                  onPress={() => setProviderId(provider.id)}
                  style={({ pressed }) => [
                    styles.modeChip,
                    {
                      borderColor: providerId === provider.id ? theme.colors.primary : theme.colors.border,
                      backgroundColor: providerId === provider.id ? theme.colors.primary + '10' : theme.colors.card,
                      opacity: pressed ? 0.9 : 1,
                    },
                  ]}
                >
                  <ThemedText>{providerId === provider.id ? 'Selected' : 'Choose this provider'}</ThemedText>
                </Pressable>
              }
            />
          ))}
        </Card>
      ) : null}

      <Card>
        <FormTextInput label="Title" value={title} onChangeText={setTitle} placeholder="What do you need?" />
        <FormTextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the task, expected timeline, and any requirements"
          multiline
        />
        <FormTextInput label="Location" value={location} onChangeText={setLocation} placeholder="Estate, area, or landmark" />
        <FormTextInput
          label="Price offer"
          value={price}
          onChangeText={setPrice}
          placeholder="50000"
          keyboardType="numeric"
        />
        <PrimaryButton title="Submit request" onPress={submit} />
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 8,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  modeChip: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});

export default ServicesRequestFormScreen;
