import React, { ReactNode } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, ThemedText } from '../Themed';
import PrimaryButton from '../PrimaryButton';
import { useTheme } from '../../context/ThemeContext';
import {
  ServiceCategory,
  ServiceNotification,
  ServiceOffer,
  ServiceProvider,
  ServiceRequest,
  ServiceStatus,
} from '../../types/services';
import { formatCurrency, formatServiceDate, getServiceStatusMeta } from '../../utils/services';

interface CategoryCardProps {
  category: ServiceCategory;
  onPress?: () => void;
  selected?: boolean;
}

export const ServiceCategoryCard: React.FC<CategoryCardProps> = ({ category, onPress, selected }) => {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.categoryCard,
        { borderColor: selected ? theme.colors.primary : theme.colors.border, opacity: pressed ? 0.92 : 1 },
      ]}
    >
      <Image source={{ uri: category.image }} style={styles.categoryImage} />
      <View style={styles.categoryCopy}>
        <ThemedText style={{ fontSize: 16, fontWeight: '700' }}>{category.name}</ThemedText>
        {category.summary ? <ThemedText style={{ color: theme.colors.muted }}>{category.summary}</ThemedText> : null}
      </View>
    </Pressable>
  );
};

interface ProviderCardProps {
  provider: ServiceProvider;
  actions?: ReactNode;
}

export const ServiceProviderCard: React.FC<ProviderCardProps> = ({ provider, actions }) => {
  const theme = useTheme();
  return (
    <Card style={styles.providerCard}>
      <View style={styles.providerHeader}>
        <Image source={{ uri: provider.avatar }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <ThemedText style={{ fontWeight: '700', fontSize: 16 }}>{provider.name}</ThemedText>
          <ThemedText style={{ color: theme.colors.muted }}>{provider.location}</ThemedText>
          <View style={styles.providerMetaRow}>
            <Ionicons name="star" color="#F4B000" />
            <ThemedText style={styles.metaText}>{provider.rating.toFixed(1)}</ThemedText>
            <ThemedText style={[styles.metaText, { color: theme.colors.muted }]}>• {provider.jobsCompleted} jobs</ThemedText>
          </View>
          <ThemedText style={{ marginTop: 4 }}>{provider.bio}</ThemedText>
          <ThemedText style={{ marginTop: 6, color: theme.colors.primary }}>Services: {provider.services.join(', ')}</ThemedText>
          <ThemedText style={{ color: theme.colors.muted }}>{provider.responseTime}</ThemedText>
        </View>
      </View>
      {actions ? <View style={{ marginTop: 12 }}>{actions}</View> : null}
    </Card>
  );
};

interface OfferListProps {
  offers: ServiceOffer[];
  providers: ServiceProvider[];
  onRespond?: (offerId: string, decision: 'accept' | 'reject') => void;
}

export const OfferList: React.FC<OfferListProps> = ({ offers, providers, onRespond }) => {
  const theme = useTheme();
  if (!offers.length) {
    return <ThemedText style={{ color: theme.colors.muted }}>No offers yet</ThemedText>;
  }
  return (
    <View style={{ gap: 8 }}>
      {offers.map((offer) => {
        const provider = providers.find((p) => p.id === offer.providerId);
        return (
          <Card key={offer.id} style={styles.offerCard}>
            <View style={styles.offerHeader}>
              <View style={{ flex: 1 }}>
                <ThemedText style={{ fontWeight: '600' }}>{provider?.name || 'Provider'}</ThemedText>
                <ThemedText style={{ color: theme.colors.muted }}>{formatServiceDate(offer.createdAt)}</ThemedText>
              </View>
              <View style={[styles.statusPill, { backgroundColor: theme.colors.card }]}> 
                <ThemedText style={{ color: theme.colors.text, fontSize: 12, fontWeight: '600' }}>
                  {offer.status === 'pending' ? 'Awaiting review' : offer.status === 'accepted' ? 'Accepted' : 'Rejected'}
                </ThemedText>
              </View>
            </View>
            <ThemedText style={{ marginTop: 4 }}>{offer.message}</ThemedText>
            <ThemedText style={{ marginTop: 6, fontWeight: '700' }}>{formatCurrency(offer.price)}</ThemedText>
            {onRespond && offer.status === 'pending' ? (
              <View style={styles.offerActions}>
                <PrimaryButton title="Accept" onPress={() => onRespond(offer.id, 'accept')} />
                <Pressable
                  accessibilityRole="button"
                  onPress={() => onRespond(offer.id, 'reject')}
                  style={({ pressed }) => [
                    styles.rejectButton,
                    { borderColor: theme.colors.border, backgroundColor: pressed ? theme.colors.border : 'transparent' },
                  ]}
                >
                  <ThemedText style={{ color: theme.colors.text }}>Reject</ThemedText>
                </Pressable>
              </View>
            ) : null}
          </Card>
        );
      })}
    </View>
  );
};

interface ServiceRequestCardProps {
  request: ServiceRequest;
  providers: ServiceProvider[];
  actions?: ReactNode;
  onOffer?: () => void;
  onRespondOffer?: (offerId: string, decision: 'accept' | 'reject') => void;
  onUpdateStatus?: (status: ServiceStatus) => void;
}

export const ServiceRequestCard: React.FC<ServiceRequestCardProps> = ({
  request,
  providers,
  actions,
  onOffer,
  onRespondOffer,
  onUpdateStatus,
}) => {
  const theme = useTheme();
  const statusMeta = getServiceStatusMeta(request.status);
  const provider = request.assignedProviderId
    ? providers.find((p) => p.id === request.assignedProviderId)
    : undefined;

  return (
    <Card>
      <View style={styles.requestHeader}>
        <View style={{ flex: 1 }}>
          <ThemedText style={{ fontSize: 18, fontWeight: '700' }}>{request.title}</ThemedText>
          <ThemedText style={{ color: theme.colors.muted }}>{request.location}</ThemedText>
        </View>
        <View style={[styles.statusPill, { backgroundColor: statusMeta.background, borderColor: statusMeta.border }]}>
          <ThemedText style={{ color: statusMeta.text, fontWeight: '700', fontSize: 12 }}>{statusMeta.label}</ThemedText>
        </View>
      </View>
      <ThemedText style={{ marginVertical: 8 }}>{request.description}</ThemedText>
      <View style={styles.metaRow}>
        <Ionicons name="pricetag" size={18} color={theme.colors.primary} />
        <ThemedText style={{ marginLeft: 8, fontWeight: '600' }}>{formatCurrency(request.priceOffer)}</ThemedText>
        <ThemedText style={{ marginLeft: 12, color: theme.colors.muted }}>Posted by {request.requesterName}</ThemedText>
      </View>
      {provider ? (
        <View style={[styles.metaRow, { marginTop: 8 }]}>
          <Ionicons name="people" size={18} color={theme.colors.primary} />
          <ThemedText style={{ marginLeft: 8 }}>Helper: {provider.name}</ThemedText>
        </View>
      ) : null}
      <View style={{ marginTop: 12 }}>{actions}</View>
      {onOffer ? (
        <PrimaryButton title="Offer help" onPress={onOffer} style={{ marginTop: 12 }} />
      ) : null}
      {onRespondOffer ? (
        <View style={{ marginTop: 12 }}>
          <ThemedText style={{ fontWeight: '600', marginBottom: 4 }}>Offers from helpers</ThemedText>
          <OfferList offers={request.offers} providers={providers} onRespond={onRespondOffer} />
        </View>
      ) : null}
      {request.contactReleased && provider ? (
        <View style={[styles.contactBox, { borderColor: theme.colors.border }]}>
          <ThemedText style={{ fontWeight: '600' }}>Contact details</ThemedText>
          <ThemedText>Email: {request.requesterContact.email}</ThemedText>
          <ThemedText>Phone: {request.requesterContact.phone}</ThemedText>
          <ThemedText style={{ marginTop: 6, color: theme.colors.muted }}>Shared with {provider.name} after acceptance.</ThemedText>
        </View>
      ) : null}
      {onUpdateStatus ? (
        <View style={{ marginTop: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {(['InProgress', 'Completed', 'Cancelled'] as ServiceStatus[]).map((status) => (
            <Pressable
              key={status}
              onPress={() => onUpdateStatus(status)}
              style={({ pressed }) => [
                styles.chip,
                {
                  backgroundColor: pressed ? theme.colors.border : theme.colors.card,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <ThemedText>{getServiceStatusMeta(status).label}</ThemedText>
            </Pressable>
          ))}
        </View>
      ) : null}
    </Card>
  );
};

interface TimelineProps {
  timeline: ServiceRequest['timeline'];
}

export const ServiceStatusTimeline: React.FC<TimelineProps> = ({ timeline }) => {
  const theme = useTheme();
  if (!timeline.length) return null;
  return (
    <View style={{ marginTop: 12 }}>
      {timeline.map((entry, index) => {
        const meta = getServiceStatusMeta(entry.status);
        const isLast = index === timeline.length - 1;
        return (
          <View key={`${entry.status}-${entry.timestamp}`} style={styles.timelineRow}>
            <View style={styles.timelineIconColumn}>
              <View
                style={[
                  styles.timelineDot,
                  { borderColor: meta.text, backgroundColor: meta.background, shadowColor: meta.text },
                ]}
              />
              {!isLast && <View style={[styles.timelineLine, { borderColor: theme.colors.border }]} />}
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={{ fontWeight: '700', color: meta.text }}>{meta.label}</ThemedText>
              <ThemedText style={{ color: theme.colors.muted }}>{formatServiceDate(entry.timestamp)}</ThemedText>
              {entry.note ? <ThemedText style={{ marginTop: 4 }}>{entry.note}</ThemedText> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
};

interface NotificationListProps {
  items: ServiceNotification[];
}

export const ServiceNotificationList: React.FC<NotificationListProps> = ({ items }) => {
  const theme = useTheme();
  if (!items.length) return <ThemedText style={{ color: theme.colors.muted }}>No notifications yet</ThemedText>;
  return (
    <View style={{ gap: 8 }}>
      {items.map((note) => (
        <Card key={note.id} style={{ paddingVertical: 12, paddingHorizontal: 14 }}>
          <View style={styles.metaRow}>
            <Ionicons name="notifications" size={18} color={theme.colors.primary} />
            <ThemedText style={{ marginLeft: 8, fontWeight: '600' }}>{note.message}</ThemedText>
          </View>
          <ThemedText style={{ color: theme.colors.muted, marginTop: 4 }}>{formatServiceDate(note.timestamp)}</ThemedText>
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  categoryCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 14,
    overflow: 'hidden',
    marginVertical: 6,
  },
  categoryImage: {
    width: 76,
    height: 76,
  },
  categoryCopy: {
    padding: 12,
    flex: 1,
  },
  providerCard: {
    marginVertical: 6,
  },
  providerHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  providerMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  metaText: {
    fontSize: 14,
  },
  offerCard: {
    padding: 12,
  },
  offerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  offerActions: {
    marginTop: 10,
    gap: 8,
  },
  rejectButton: {
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  timelineRow: {
    flexDirection: 'row',
  },
  timelineIconColumn: {
    width: 26,
    alignItems: 'center',
  },
  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  timelineLine: {
    flex: 1,
    borderLeftWidth: 1,
    marginTop: 2,
  },
});

export default ServiceCategoryCard;
