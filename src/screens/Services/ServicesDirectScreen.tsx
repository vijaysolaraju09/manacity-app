import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import PrimaryButton from '../../components/PrimaryButton';
import { ServiceProviderCard, ServiceRequestCard, ServiceStatusTimeline } from '../../components/services/ServiceUI';
import { useServicesStore } from '../../store/useServicesStore';

const ServicesDirectScreen = () => {
  const navigation = useNavigation();
  const { providers, requests, respondToOffer, updateStatus } = useServicesStore();
  const directRequests = requests.filter((req) => req.type === 'direct');

  return (
    <Screen>
      <ThemedText accessibilityRole="header" style={{ fontSize: 22, fontWeight: '700', marginBottom: 8 }}>
        Book a provider directly
      </ThemedText>
      <Card>
        <ThemedText style={{ fontWeight: '700', marginBottom: 6 }}>Top provider profiles</ThemedText>
        <ThemedText style={{ marginBottom: 10 }}>
          Tap request to send your task straight to a provider. They can accept or reject before starting.
        </ThemedText>
        {providers.map((provider) => (
          <ServiceProviderCard
            key={provider.id}
            provider={provider}
            actions={
              <PrimaryButton
                title="Request this provider"
                onPress={() => navigation.navigate('ServicesRequestForm' as never, { mode: 'direct', providerId: provider.id } as never)}
              />
            }
          />
        ))}
      </Card>

      <Card>
        <ThemedText style={{ fontWeight: '700', marginBottom: 6 }}>Your direct requests</ThemedText>
        {directRequests.map((request) => (
          <View key={request.id} style={{ marginVertical: 8 }}>
            <ServiceRequestCard
              request={request}
              providers={providers}
              onRespondOffer={(offerId, decision) => respondToOffer({ requestId: request.id, offerId, decision })}
              onUpdateStatus={(status) => updateStatus(request.id, status, 'Status updated with provider')}
              actions={<ServiceStatusTimeline timeline={request.timeline} />}
            />
          </View>
        ))}
      </Card>
    </Screen>
  );
};

export default ServicesDirectScreen;
