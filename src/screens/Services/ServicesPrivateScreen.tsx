import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import FormTextInput from '../../components/FormTextInput';
import PrimaryButton from '../../components/PrimaryButton';
import {
  ServiceCategoryCard,
  ServiceRequestCard,
  ServiceStatusTimeline,
  ServiceProviderCard,
} from '../../components/services/ServiceUI';
import { useServicesStore } from '../../store/useServicesStore';
import { useTheme } from '../../context/ThemeContext';
import { ServiceStatus } from '../../types/services';

const ServicesPrivateScreen = () => {
  const theme = useTheme();
  const { categories, providers, requests, createPrivateRequest, assignProvider, respondToOffer, updateStatus } = useServicesStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('cleaning');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');

  const privateRequests = useMemo(() => requests.filter((r) => r.type === 'private'), [requests]);
  const eligibleProviders = useMemo(
    () => providers.filter((p) => (selectedCategory ? p.services.includes(selectedCategory) : true)),
    [providers, selectedCategory],
  );

  const submitPrivateRequest = () => {
    if (!title || !description) return;
    createPrivateRequest({
      id: '',
      categoryId: selectedCategory,
      title,
      description,
      location,
      priceOffer: Number(price) || undefined,
      requesterName: 'You',
      requesterContact: { email: 'you@example.com', phone: '+234 800 000 1111' },
      assignedProviderId: undefined,
      offers: [],
      timeline: [],
      type: 'private',
      status: 'Open' as ServiceStatus,
      contactReleased: false,
    });
    setTitle('');
    setDescription('');
    setLocation('');
    setPrice('');
  };

  return (
    <Screen>
      <ThemedText accessibilityRole="header" style={styles.heading}>
        Private requests (Admin controlled)
      </ThemedText>
      <Card>
        <ThemedText style={styles.sectionTitle}>Send a private request</ThemedText>
        <ThemedText style={{ color: theme.colors.muted }}>
          Only admins can see these requests. They will pick a provider and share acceptance updates.
        </ThemedText>
        {categories.map((category) => (
          <ServiceCategoryCard
            key={category.id}
            category={category}
            selected={selectedCategory === category.id}
            onPress={() => setSelectedCategory(category.id)}
          />
        ))}
        <FormTextInput label="Title" value={title} onChangeText={setTitle} placeholder="Confidential facility support" />
        <FormTextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Explain what needs to be done"
          multiline
        />
        <FormTextInput label="Location" value={location} onChangeText={setLocation} placeholder="E.g. Victoria Island" />
        <FormTextInput
          label="Budget"
          value={price}
          onChangeText={setPrice}
          placeholder="50000"
          keyboardType="numeric"
        />
        <PrimaryButton title="Send to Admin" onPress={submitPrivateRequest} />
      </Card>

      <Card>
        <ThemedText style={styles.sectionTitle}>Admin assignment</ThemedText>
        <ThemedText style={{ color: theme.colors.muted }}>
          Choose a provider to assign. They can accept or reject before the requester sees contact details.
        </ThemedText>
        {eligibleProviders.map((provider) => (
          <ServiceProviderCard key={provider.id} provider={provider} />
        ))}
      </Card>

      {privateRequests.map((request) => (
        <Card key={request.id}>
          <ServiceRequestCard
            request={request}
            providers={providers}
            onRespondOffer={(offerId, decision) => respondToOffer({ requestId: request.id, offerId, decision })}
            onUpdateStatus={(status) => updateStatus(request.id, status, 'Admin updated status')}
            actions={<ServiceStatusTimeline timeline={request.timeline} />}
          />
          <View style={{ marginTop: 12 }}>
            <ThemedText style={styles.sectionTitle}>Admin actions</ThemedText>
            <ThemedText style={{ color: theme.colors.muted }}>Assign a provider from the curated list.</ThemedText>
            <View style={styles.chipsRow}>
              {eligibleProviders.map((provider) => (
                <Pressable
                  key={`${request.id}-${provider.id}`}
                  onPress={() => assignProvider({ requestId: request.id, providerId: provider.id })}
                  style={({ pressed }) => [
                    styles.assignChip,
                    { backgroundColor: pressed ? theme.colors.border : theme.colors.card, borderColor: theme.colors.border },
                  ]}
                >
                  <ThemedText>{provider.name}</ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
        </Card>
      ))}
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
    marginBottom: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  assignChip: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});

export default ServicesPrivateScreen;
