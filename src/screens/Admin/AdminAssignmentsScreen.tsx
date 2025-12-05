import React, { useMemo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import PrimaryButton from '../../components/PrimaryButton';
import AdminBadge from '../../components/admin/AdminBadge';
import { useServicesStore } from '../../store/useServicesStore';
import { useTheme } from '../../context/ThemeContext';

const AdminAssignmentsScreen = () => {
  const theme = useTheme();
  const { requests, providers, assignProvider, updateStatus } = useServicesStore();

  const privateRequests = useMemo(() => requests.filter((req) => req.type === 'private'), [requests]);
  const directRequests = useMemo(() => requests.filter((req) => req.type === 'direct'), [requests]);

  const renderActions = (requestId: string) => (
    <View style={styles.providerRow}>
      {providers.map((provider) => (
        <Pressable
          key={`${requestId}-${provider.id}`}
          onPress={() => assignProvider({ requestId, providerId: provider.id })}
          style={({ pressed }) => [
            styles.providerChip,
            { borderColor: theme.colors.border, backgroundColor: pressed ? theme.colors.border : theme.colors.card },
          ]}
        >
          <ThemedText style={{ fontFamily: 'Inter_600SemiBold' }}>{provider.name}</ThemedText>
          <ThemedText style={{ color: theme.colors.muted, fontSize: 12 }}>{provider.services.join(', ')}</ThemedText>
        </Pressable>
      ))}
    </View>
  );

  return (
    <Screen>
      <ThemedText accessibilityRole="header" style={styles.title}>
        Private assignments
      </ThemedText>
      <ThemedText style={{ color: theme.colors.muted, marginBottom: theme.spacing.md }}>
        Dispatch trusted providers to confidential or direct jobs. Status updates are shared instantly with requesters.
      </ThemedText>

      <Card>
        <ThemedText style={styles.sectionTitle}>Private requests</ThemedText>
        {privateRequests.map((request) => (
          <View key={request.id} style={styles.requestCard}>
            <View style={{ flex: 1 }}>
              <ThemedText style={{ fontFamily: 'Inter_700Bold' }}>{request.title}</ThemedText>
              <ThemedText style={{ color: theme.colors.muted }}>{request.description}</ThemedText>
              <View style={styles.metaRow}>
                <AdminBadge label={request.status} tone="warning" />
                <AdminBadge label={`Budget: ₦${request.priceOffer || 0}`} tone="info" />
              </View>
              <ThemedText style={{ color: theme.colors.muted, fontSize: 12 }}>Location: {request.location}</ThemedText>
              <ThemedText style={{ color: theme.colors.muted, fontSize: 12 }}>
                Requester: {request.requesterName}
              </ThemedText>
            </View>
            <View style={{ width: 120 }}>
              <PrimaryButton
                title="Mark in progress"
                onPress={() => updateStatus(request.id, 'InProgress', 'Admin marked as in progress')}
              />
              <PrimaryButton
                title="Complete"
                onPress={() => updateStatus(request.id, 'Completed', 'Job completed by admin update')}
              />
            </View>
          </View>
        ))}
        {privateRequests.length === 0 ? (
          <ThemedText style={{ color: theme.colors.muted }}>No private requests yet.</ThemedText>
        ) : null}
      </Card>

      <Card>
        <ThemedText style={styles.sectionTitle}>Assign providers</ThemedText>
        <ThemedText style={{ color: theme.colors.muted, marginBottom: 8 }}>
          Tap a provider to assign them to the selected private request. They will confirm before contact details are shared.
        </ThemedText>
        {privateRequests.map((request) => (
          <View key={`${request.id}-providers`} style={{ marginBottom: 12 }}>
            <ThemedText style={{ fontFamily: 'Inter_600SemiBold' }}>{request.title}</ThemedText>
            {renderActions(request.id)}
          </View>
        ))}
      </Card>

      <Card>
        <ThemedText style={styles.sectionTitle}>Direct requests follow-up</ThemedText>
        <ThemedText style={{ color: theme.colors.muted, marginBottom: 8 }}>
          For direct bookings still awaiting confirmation, you can re-route to another provider.
        </ThemedText>
        {directRequests.map((request) => (
          <View key={`direct-${request.id}`} style={styles.requestCard}>
            <View style={{ flex: 1 }}>
              <ThemedText style={{ fontFamily: 'Inter_700Bold' }}>{request.title}</ThemedText>
              <ThemedText style={{ color: theme.colors.muted }}>{request.description}</ThemedText>
              <AdminBadge label={request.status} tone="warning" />
            </View>
            <View style={{ width: 140 }}>
              <PrimaryButton
                title="Reassign"
                disabled={!providers.length}
                onPress={() => providers[0] && assignProvider({ requestId: request.id, providerId: providers[0].id })}
              />
            </View>
          </View>
        ))}
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    marginBottom: 8,
  },
  requestCard: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 6,
    marginVertical: 6,
  },
  providerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  providerChip: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    width: 170,
    gap: 4,
  },
});

export default AdminAssignmentsScreen;
