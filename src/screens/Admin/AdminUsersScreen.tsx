import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View, Switch } from 'react-native';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import FormTextInput from '../../components/FormTextInput';
import PrimaryButton from '../../components/PrimaryButton';
import RolePill from '../../components/RolePill';
import AdminTable from '../../components/admin/AdminTable';
import AdminBadge from '../../components/admin/AdminBadge';
import { useAdminStore, AdminRole } from '../../store/useAdminStore';
import { useTheme } from '../../context/ThemeContext';

const roles: AdminRole[] = ['Super Admin', 'Moderator', 'Support'];

const AdminUsersScreen = () => {
  const theme = useTheme();
  const { users, toggleUserStatus, updateUserRole, addAdminUser } = useAdminStore();
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AdminRole>('Moderator');

  const filteredUsers = useMemo(
    () => users.filter((user) => (filter === 'all' ? true : user.status === filter)),
    [filter, users],
  );

  const submitInvite = () => {
    if (!name || !email) return;
    addAdminUser({ name, email, role });
    setName('');
    setEmail('');
    setRole('Moderator');
  };

  return (
    <Screen>
      <ThemedText accessibilityRole="header" style={styles.title}>
        Manage admin users
      </ThemedText>
      <ThemedText style={{ color: theme.colors.muted, marginBottom: theme.spacing.md }}>
        Assign roles, deactivate accounts, and keep a clean audit trail.
      </ThemedText>

      <Card>
        <ThemedText style={styles.sectionTitle}>Invite new admin</ThemedText>
        <FormTextInput label="Full name" value={name} onChangeText={setName} placeholder="Ada Okafor" />
        <FormTextInput label="Work email" value={email} onChangeText={setEmail} placeholder="ops@manacity.app" />
        <View style={styles.rolesRow}>
          {roles.map((adminRole) => (
            <RolePill
              key={adminRole}
              label={adminRole}
              active={role === adminRole}
              onPress={() => setRole(adminRole)}
            />
          ))}
        </View>
        <PrimaryButton title="Add admin" onPress={submitInvite} />
      </Card>

      <Card>
        <View style={styles.filterRow}>
          <ThemedText style={styles.sectionTitle}>Current admins</ThemedText>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {(['all', 'active', 'inactive'] as const).map((item) => (
              <Pressable
                key={item}
                onPress={() => setFilter(item)}
                style={({ pressed }) => [
                  styles.filterChip,
                  {
                    backgroundColor: filter === item ? `${theme.colors.primary}12` : theme.colors.card,
                    borderColor: filter === item ? theme.colors.primary : theme.colors.border,
                    opacity: pressed ? 0.9 : 1,
                  },
                ]}
              >
                <ThemedText style={{ color: filter === item ? theme.colors.primary : theme.colors.text }}>
                  {item.toUpperCase()}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        <AdminTable
          columns={[
            {
              key: 'user',
              title: 'User',
              width: '35%',
              render: (row) => (
                <View>
                  <ThemedText style={{ fontFamily: 'Inter_600SemiBold' }}>{row.name}</ThemedText>
                  <ThemedText style={{ color: theme.colors.muted, fontSize: 12 }}>{row.email}</ThemedText>
                </View>
              ),
            },
            {
              key: 'role',
              title: 'Role',
              width: '25%',
              render: (row) => (
                <View style={{ gap: 6 }}>
                  <AdminBadge label={row.role} tone="info" />
                  <View style={styles.inlineRoles}>
                    {roles.map((adminRole) => (
                      <Pressable
                        key={`${row.id}-${adminRole}`}
                        onPress={() => updateUserRole(row.id, adminRole)}
                        style={({ pressed }) => [
                          styles.miniPill,
                          {
                            backgroundColor: row.role === adminRole ? `${theme.colors.primary}12` : theme.colors.card,
                            opacity: pressed ? 0.7 : 1,
                          },
                        ]}
                      >
                        <ThemedText style={{ color: row.role === adminRole ? theme.colors.primary : theme.colors.text }}>
                          {adminRole}
                        </ThemedText>
                      </Pressable>
                    ))}
                  </View>
                </View>
              ),
            },
            {
              key: 'status',
              title: 'Status',
              width: '20%',
              render: (row) => (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Switch value={row.status === 'active'} onValueChange={() => toggleUserStatus(row.id)} />
                  <ThemedText style={{ color: row.status === 'active' ? theme.colors.primary : theme.colors.muted }}>
                    {row.status}
                  </ThemedText>
                </View>
              ),
            },
            {
              key: 'notes',
              title: 'Notes',
              width: '20%',
              render: (row) => (
                <View>
                  <ThemedText style={{ color: theme.colors.muted, fontSize: 12 }}>Owns: {row.responsibleFor?.join(', ')}</ThemedText>
                  <ThemedText style={{ color: theme.colors.muted, fontSize: 12 }}>
                    Last active {new Date(row.lastActive).toLocaleTimeString()}
                  </ThemedText>
                </View>
              ),
            },
          ]}
          data={filteredUsers}
          rowKey={(row) => row.id}
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
  rolesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  filterChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  inlineRoles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  miniPill: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
});

export default AdminUsersScreen;
