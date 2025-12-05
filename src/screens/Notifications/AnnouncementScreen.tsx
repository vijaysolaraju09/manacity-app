import React from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Card, ThemedText } from '../../components/Themed';
import { Screen } from '../../components/Screen';
import { ProfileStackParamList } from '../../navigation/types';

const AnnouncementScreen = () => {
  const route = useRoute<RouteProp<ProfileStackParamList, 'Announcement'>>();
  const { announcementId, title, body } = route.params || {};

  return (
    <Screen>
      <Card>
        <ThemedText accessibilityRole="header" style={{ fontWeight: '700', fontSize: 20 }}>
          {title || 'Announcement'}
        </ThemedText>
        {announcementId ? (
          <ThemedText style={{ marginTop: 6, color: '#6b7280' }}>Ref: {announcementId}</ThemedText>
        ) : null}
        <ThemedText style={{ marginTop: 12 }}>{body || 'Stay tuned for more updates from the Manacity team.'}</ThemedText>
      </Card>
    </Screen>
  );
};

export default AnnouncementScreen;
