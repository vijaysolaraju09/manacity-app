import React, { useMemo, useState } from 'react';
import { Modal, View, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import FormTextInput from '../../components/FormTextInput';
import PrimaryButton from '../../components/PrimaryButton';
import {
  ServiceCategoryCard,
  ServiceNotificationList,
  ServiceRequestCard,
  ServiceStatusTimeline,
  ServiceProviderCard,
} from '../../components/services/ServiceUI';
import { useServicesStore } from '../../store/useServicesStore';
import { ServiceStatus } from '../../types/services';
import { useTheme } from '../../context/ThemeContext';

const statusFilters: (ServiceStatus | 'All')[] = ['All', 'Open', 'AwaitingApproval', 'Accepted', 'InProgress'];

const ServicesPublicScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { categories, providers, requests, submitOffer, respondToOffer, updateStatus, notifications } = useServicesStore();
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [filter, setFilter] = useState<ServiceStatus | 'All'>('All');
  const [offerModalVisible, setOfferModalVisible] = useState(false);
  const [offerMessage, setOfferMessage] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [activeRequestId, setActiveRequestId] = useState<string | undefined>();
  const [selectedProviderId, setSelectedProviderId] = useState<string | undefined>();

  const publicRequests = useMemo(
    () =>
      requests.filter((r) =>
        r.type === 'public' &&
        (filter === 'All' ? true : r.status === filter) &&
        (selectedCategory ? r.categoryId === selectedCategory : true),
      ),
    [requests, filter, selectedCategory],
  );

  const filteredProviders = useMemo(
    () => providers.filter((p) => (selectedCategory ? p.services.includes(selectedCategory) : true)),
    [providers, selectedCategory],
  );

  const openOfferModal = (requestId: string) => {
    setActiveRequestId(requestId);
    setOfferModalVisible(true);
    setSelectedProviderId(filteredProviders[0]?.id);
  };

  const handleSendOffer = () => {
    if (!activeRequestId || !selectedProviderId) return;
    submitOffer({
      requestId: activeRequestId,
      providerId: selectedProviderId,
      message: offerMessage || 'I can help with this request.',
      price: Number(offerPrice) || 0,
    });
    setOfferMessage('');
    setOfferPrice('');
    setOfferModalVisible(false);
  };

  return (
    <Screen>
      <ThemedText accessibilityRole="header" style={styles.heading}>
        Services Catalog
      </ThemedText>

      <Card>
        <ThemedText style={styles.sectionTitle}>Browse categories</ThemedText>
        {categories.map((category) => (
          <ServiceCategoryCard
            key={category.id}
            category={category}
            selected={selectedCategory === category.id}
            onPress={() => setSelectedCategory(selectedCategory === category.id ? undefined : category.id)}
          />
        ))}
        <PrimaryButton
          title="Create public request"
          onPress={() => navigation.navigate('ServicesRequestForm' as never, { mode: 'public', categoryId: selectedCategory } as never)}
          style={{ marginTop: 12 }}
        />
      </Card>

      <Card>
        <ThemedText style={styles.sectionTitle}>Trusted providers</ThemedText>
        <ThemedText style={{ color: theme.colors.muted, marginBottom: 8 }}>
          Providers in this category with ratings and completed jobs
        </ThemedText>
        {filteredProviders.map((provider) => (
          <ServiceProviderCard key={provider.id} provider={provider} />
        ))}
      </Card>

      <Card>
        <ThemedText style={styles.sectionTitle}>Public requests</ThemedText>
        <View style={styles.filterRow}>
          {statusFilters.map((item) => (
            <Pressable
              key={item}
              onPress={() => setFilter(item)}
              style={({ pressed }) => [
                styles.filterChip,
                {
                  borderColor: filter === item ? theme.colors.primary : theme.colors.border,
                  backgroundColor: filter === item ? theme.colors.primary + '15' : theme.colors.card,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
            >
              <ThemedText style={{ color: filter === item ? theme.colors.primary : theme.colors.text }}>{item}</ThemedText>
            </Pressable>
          ))}
        </View>
        {publicRequests.map((request) => (
          <View key={request.id} style={{ marginTop: 12 }}>
            <ServiceRequestCard
              request={request}
              providers={providers}
              onOffer={() => openOfferModal(request.id)}
              onRespondOffer={(offerId, decision) => respondToOffer({ requestId: request.id, offerId, decision })}
              onUpdateStatus={(status) => updateStatus(request.id, status, 'Requester updated status')}
              actions={<ServiceStatusTimeline timeline={request.timeline} />}
            />
          </View>
        ))}
      </Card>

      <Card>
        <ThemedText style={styles.sectionTitle}>Notifications</ThemedText>
        <ServiceNotificationList items={notifications.filter((note) => note.audience !== 'admin')} />
      </Card>

      <Modal transparent visible={offerModalVisible} animationType="slide" onRequestClose={() => setOfferModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <ThemedText style={{ fontSize: 18, fontWeight: '700' }}>Offer help</ThemedText>
            <ThemedText style={{ color: theme.colors.muted, marginTop: 4 }}>
              Pick a provider profile, add a note, and propose your rate.
            </ThemedText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 12 }}>
              {filteredProviders.map((provider) => (
                <Pressable
                  key={provider.id}
                  onPress={() => setSelectedProviderId(provider.id)}
                  style={({ pressed }) => [
                    styles.filterChip,
                    {
                      borderColor: selectedProviderId === provider.id ? theme.colors.primary : theme.colors.border,
                      backgroundColor: selectedProviderId === provider.id ? theme.colors.primary + '10' : theme.colors.card,
                      opacity: pressed ? 0.9 : 1,
                    },
                  ]}
                >
                  <ThemedText>{provider.name}</ThemedText>
                </Pressable>
              ))}
            </View>
            <FormTextInput label="Message to requester" value={offerMessage} onChangeText={setOfferMessage} placeholder="I can start tomorrow by 9am" />
            <FormTextInput
              label="Proposed price"
              value={offerPrice}
              onChangeText={setOfferPrice}
              placeholder="50000"
              keyboardType="numeric"
            />
            <PrimaryButton title="Send offer" onPress={handleSendOffer} />
            <Pressable accessibilityRole="button" onPress={() => setOfferModalVisible(false)} style={styles.modalDismiss}>
              <ThemedText style={{ color: theme.colors.danger }}>Cancel</ThemedText>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  filterChip: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  modalDismiss: {
    marginTop: 10,
    alignItems: 'center',
  },
});

export default ServicesPublicScreen;
