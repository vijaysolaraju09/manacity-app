import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import AdminTable from '../../components/admin/AdminTable';
import AdminBadge from '../../components/admin/AdminBadge';
import PrimaryButton from '../../components/PrimaryButton';
import FormTextInput from '../../components/FormTextInput';
import { useAdminStore, AdminShopStatus } from '../../store/useAdminStore';
import { useTheme } from '../../context/ThemeContext';

const AdminShopsScreen = () => {
  const theme = useTheme();
  const { shops, updateShopStatus } = useAdminStore();
  const [statusFilter, setStatusFilter] = useState<AdminShopStatus | 'all'>('all');
  const [note, setNote] = useState<string>('');

  const filteredShops = useMemo(
    () => shops.filter((shop) => (statusFilter === 'all' ? true : shop.status === statusFilter)),
    [shops, statusFilter],
  );

  const statusTone: Record<AdminShopStatus, 'success' | 'warning' | 'danger' | 'info'> = {
    approved: 'success',
    pending: 'warning',
    rejected: 'danger',
    disabled: 'danger',
  };

  return (
    <Screen>
      <ThemedText accessibilityRole="header" style={styles.title}>
        Shops review queue
      </ThemedText>
      <ThemedText style={{ color: theme.colors.muted, marginBottom: theme.spacing.md }}>
        Approve, reject, or temporarily disable storefronts. Add notes for the audit log.
      </ThemedText>

      <Card>
        <ThemedText style={styles.sectionTitle}>Filters</ThemedText>
        <View style={styles.filtersRow}>
          {(['all', 'pending', 'approved', 'rejected', 'disabled'] as const).map((status) => (
            <Pressable
              key={status}
              onPress={() => setStatusFilter(status as AdminShopStatus | 'all')}
              style={({ pressed }) => [
                styles.filterChip,
                {
                  backgroundColor: statusFilter === status ? `${theme.colors.primary}12` : theme.colors.card,
                  borderColor: statusFilter === status ? theme.colors.primary : theme.colors.border,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
            >
              <ThemedText style={{ color: statusFilter === status ? theme.colors.primary : theme.colors.text }}>
                {String(status).toUpperCase()}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </Card>

      <AdminTable
        columns={[
          {
            key: 'shop',
            title: 'Shop',
            width: '30%',
            render: (row) => (
              <View>
                <ThemedText style={{ fontFamily: 'Inter_600SemiBold' }}>{row.name}</ThemedText>
                <ThemedText style={{ color: theme.colors.muted, fontSize: 12 }}>Owner: {row.owner}</ThemedText>
                <ThemedText style={{ color: theme.colors.muted, fontSize: 12 }}>Docs: {row.documents.join(', ')}</ThemedText>
              </View>
            ),
          },
          {
            key: 'category',
            title: 'Category',
            width: '18%',
            dataIndex: 'category',
          },
          {
            key: 'status',
            title: 'Status',
            width: '18%',
            render: (row) => <AdminBadge label={row.status} tone={statusTone[row.status]} />,
          },
          {
            key: 'risk',
            title: 'Risk & notes',
            width: '20%',
            render: (row) => (
              <View>
                <ThemedText style={{ color: theme.colors.muted }}>{row.riskNotes || 'None'}</ThemedText>
                <ThemedText style={{ color: theme.colors.muted, fontSize: 12 }}>
                  Updated {new Date(row.updatedAt).toLocaleTimeString()}
                </ThemedText>
              </View>
            ),
          },
          {
            key: 'actions',
            title: 'Actions',
            width: '14%',
            render: (row) => (
              <View style={{ gap: 6 }}>
                <PrimaryButton
                  title="Approve"
                  onPress={() => updateShopStatus(row.id, 'approved', note)}
                  disabled={row.status === 'approved'}
                />
                <PrimaryButton
                  title="Reject"
                  onPress={() => updateShopStatus(row.id, 'rejected', note || 'Missing documents')}
                  disabled={row.status === 'rejected'}
                />
                <PrimaryButton
                  title="Disable"
                  onPress={() => updateShopStatus(row.id, 'disabled', note || 'Ops flagged')}
                  disabled={row.status === 'disabled'}
                />
              </View>
            ),
          },
        ]}
        data={filteredShops}
        rowKey={(row) => row.id}
      />

      <Card>
        <ThemedText style={styles.sectionTitle}>Compliance notes</ThemedText>
        <ThemedText style={{ color: theme.colors.muted, marginBottom: 6 }}>
          Add a note to apply to the next action (approve/reject/disable). Use this for quick audit tagging.
        </ThemedText>
        <FormTextInput
          label="Note"
          value={note}
          onChangeText={setNote}
          placeholder="E.g. request for updated CAC certificate"
        />
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
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
});

export default AdminShopsScreen;
