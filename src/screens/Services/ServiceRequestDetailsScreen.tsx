import React, { useEffect } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import { ServicesStackParamList } from '../../navigation/types';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import { useTheme } from '../../context/ThemeContext';
import { useServicesStore } from '../../store/useServicesStore';

const ServiceRequestDetailsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ServicesStackParamList, 'ServiceRequestDetails'>>();
  const requestId = route.params?.requestId;
  const request = useServicesStore((state) => state.requests.find((r) => r.id === requestId));

  useEffect(() => {
    navigation.setOptions({ title: 'Request Details' });
  }, [navigation]);

  if (!request) {
    return (
      <Screen>
        <Card>
          <ThemedText style={{ fontWeight: '600' }}>Request not found</ThemedText>
          <ThemedText style={{ marginTop: 8 }}>We could not locate the service request linked to this notification.</ThemedText>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <Card>
        <ThemedText style={styles.title}>{request.title}</ThemedText>
        <ThemedText style={{ color: theme.colors.muted, marginBottom: 8 }}>{request.location}</ThemedText>
        <ThemedText style={styles.meta}>Type: {request.type}</ThemedText>
        <ThemedText style={styles.meta}>Status: {request.status}</ThemedText>
        {request.priceOffer ? <ThemedText style={styles.meta}>Offer: ₦{request.priceOffer.toLocaleString()}</ThemedText> : null}
      </Card>
      <Card>
        <ThemedText style={styles.sectionLabel}>Description</ThemedText>
        <ThemedText style={{ marginTop: 4 }}>{request.description}</ThemedText>
      </Card>
      <Card>
        <ThemedText style={styles.sectionLabel}>Timeline</ThemedText>
        {request.timeline.map((entry) => (
          <View key={entry.timestamp} style={[styles.timelineRow, { borderBottomColor: theme.colors.border }]}> 
            <View style={styles.timelineBullet} />
            <View style={{ flex: 1 }}>
              <ThemedText style={{ fontWeight: '600' }}>{entry.status}</ThemedText>
              <ThemedText style={{ color: theme.colors.muted }}>{new Date(entry.timestamp).toLocaleString()}</ThemedText>
              {entry.note ? <ThemedText style={{ marginTop: 4 }}>{entry.note}</ThemedText> : null}
            </View>
          </View>
        ))}
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  meta: { marginTop: 4 },
  sectionLabel: { fontWeight: '700', marginBottom: 6 },
  timelineRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 12,
  },
  timelineBullet: {
    width: 10,
    height: 10,
    borderRadius: 6,
    marginTop: 6,
    backgroundColor: '#4F46E5',
  },
});

export default ServiceRequestDetailsScreen;
