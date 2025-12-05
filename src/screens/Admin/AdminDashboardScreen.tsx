import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import AdminStatCard from '../../components/admin/AdminStatCard';
import AdminBadge from '../../components/admin/AdminBadge';
import { useAdminStore } from '../../store/useAdminStore';
import { useServicesStore } from '../../store/useServicesStore';
import PrimaryButton from '../../components/PrimaryButton';
import { AdminStackParamList } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';

type Props = NativeStackScreenProps<AdminStackParamList, 'AdminDashboard'>;

const AdminDashboardScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { users, shops, events, announcements } = useAdminStore();
  const { requests } = useServicesStore();

  const activeUsers = users.filter((user) => user.status === 'active').length;
  const pendingShops = shops.filter((shop) => shop.status === 'pending').length;
  const privateRequests = requests.filter((request) => request.type === 'private').length;
  const liveEvents = events.length;

  return (
    <Screen>
      <ThemedText accessibilityRole="header" style={styles.title}>
        Admin control center
      </ThemedText>
      <ThemedText style={{ color: theme.colors.muted, marginBottom: theme.spacing.md }}>
        Monitor approvals, roles, and operational dashboards in one place.
      </ThemedText>

      <View style={styles.statsRow}>
        <AdminStatCard label="Active admins" value={activeUsers} helper="invited team members" />
        <AdminStatCard label="Shops awaiting review" value={pendingShops} helper="compliance queue" accent="#DC6B05" />
      </View>
      <View style={styles.statsRow}>
        <AdminStatCard label="Private requests" value={privateRequests} helper="assign providers" accent="#2563EB" />
        <AdminStatCard label="Live events" value={liveEvents} helper="with updates & scores" accent="#1F9D55" />
      </View>

      <Card>
        <ThemedText style={styles.sectionTitle}>Quick actions</ThemedText>
        <View style={styles.actionsRow}>
          <PrimaryButton title="Manage users" onPress={() => navigation.navigate('AdminUsers')} />
          <PrimaryButton title="Approve shops" onPress={() => navigation.navigate('AdminShops')} />
        </View>
        <View style={styles.actionsRow}>
          <PrimaryButton title="Service catalog" onPress={() => navigation.navigate('AdminServices')} />
          <PrimaryButton title="Assignments" onPress={() => navigation.navigate('AdminAssignments')} />
        </View>
      </Card>

      <Card>
        <ThemedText style={styles.sectionTitle}>Announcements</ThemedText>
        {announcements.slice(0, 3).map((announcement) => (
          <View key={announcement.id} style={styles.announcementRow}>
            <View style={{ flex: 1 }}>
              <ThemedText style={{ fontFamily: 'Inter_600SemiBold' }}>{announcement.title}</ThemedText>
              <ThemedText style={{ color: theme.colors.muted }}>{announcement.body}</ThemedText>
            </View>
            <AdminBadge label={announcement.channel.toUpperCase()} tone="info" />
          </View>
        ))}
        <PrimaryButton
          title="Push announcement"
          onPress={() => navigation.navigate('AdminAnnouncements')}
          style={{ marginTop: theme.spacing.sm }}
        />
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  announcementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
});

export default AdminDashboardScreen;
