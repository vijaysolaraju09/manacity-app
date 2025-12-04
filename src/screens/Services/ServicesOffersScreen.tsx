import React, { useMemo } from 'react';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import { OfferList, ServiceNotificationList, ServiceStatusTimeline } from '../../components/services/ServiceUI';
import { useServicesStore } from '../../store/useServicesStore';

const ServicesOffersScreen = () => {
  const { requests, providers, respondToOffer, notifications } = useServicesStore();

  const aggregatedOffers = useMemo(
    () =>
      requests.map((request) => ({
        request,
        offers: request.offers,
      })),
    [requests],
  );

  return (
    <Screen>
      <ThemedText accessibilityRole="header" style={{ fontSize: 22, fontWeight: '700', marginBottom: 8 }}>
        Offers & approvals
      </ThemedText>
      {aggregatedOffers.map(({ request, offers }) => (
        <Card key={request.id}>
          <ThemedText style={{ fontWeight: '700', marginBottom: 6 }}>{request.title}</ThemedText>
          <ThemedText style={{ color: '#6B7280', marginBottom: 10 }}>Status: {request.status}</ThemedText>
          <OfferList
            offers={offers}
            providers={providers}
            onRespond={(offerId, decision) => respondToOffer({ requestId: request.id, offerId, decision })}
          />
          <ServiceStatusTimeline timeline={request.timeline} />
        </Card>
      ))}

      <Card>
        <ThemedText style={{ fontWeight: '700', marginBottom: 6 }}>Notifications sent to helpers</ThemedText>
        <ServiceNotificationList items={notifications} />
      </Card>
    </Screen>
  );
};

export default ServicesOffersScreen;
