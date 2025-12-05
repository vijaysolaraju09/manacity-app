import React, { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../hooks/useAuth';
import { Role } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { resetNavigation } from '../../navigation/navigationRef';

const roleDescriptions: Record<Role, string> = {
  customer: 'Discover shops, services, and events tailored for you.',
  business: 'Manage your storefront, products, and customer orders.',
  admin: 'Oversee marketplace health and keep communities safe.',
};

const roleLabels: Record<Role, string> = {
  customer: 'Customer',
  business: 'Business',
  admin: 'Admin',
};

const SwitchRoleScreen = () => {
  const { user, activeRole, switchRole } = useAuth();
  const theme = useTheme();
  const [selectedRole, setSelectedRole] = useState<Role>(activeRole);

  const availableRoles = useMemo(() => user?.roles ?? ['customer'], [user?.roles]);

  const handleApply = () => {
    switchRole(selectedRole);
    const routeName = selectedRole === 'customer' ? 'Root' : selectedRole === 'business' ? 'Business' : 'Admin';
    resetNavigation(routeName);
  };

  return (
    <Screen>
      <View style={{ gap: theme.spacing.md }}>
        <ThemedText style={{ fontSize: 22, fontWeight: '700' }}>Choose a role</ThemedText>
        <Card>
          <ThemedText style={{ marginBottom: theme.spacing.sm }}>
            Switch between roles to see the right navigation, tools, and notifications.
          </ThemedText>
          <View style={{ gap: theme.spacing.sm }}>
            {availableRoles.map((role) => {
              const isActive = selectedRole === role;
              return (
                <Pressable
                  key={role}
                  onPress={() => setSelectedRole(role as Role)}
                  style={{
                    borderWidth: 1,
                    borderColor: isActive ? theme.colors.primary : theme.colors.border,
                    padding: theme.spacing.md,
                    borderRadius: theme.roundness,
                    backgroundColor: isActive ? theme.colors.primary + '12' : theme.colors.surface,
                    flexDirection: 'row',
                    gap: theme.spacing.sm,
                    alignItems: 'center',
                  }}
                >
                  <Ionicons
                    name={role === 'customer' ? 'person' : role === 'business' ? 'storefront' : 'shield-checkmark'}
                    size={22}
                    color={isActive ? theme.colors.primary : theme.colors.text}
                  />
                  <View style={{ flex: 1 }}>
                    <ThemedText style={{ fontWeight: '700' }}>{roleLabels[role as Role]}</ThemedText>
                    <ThemedText style={{ color: theme.colors.muted }}>{roleDescriptions[role as Role]}</ThemedText>
                  </View>
                  {isActive ? <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} /> : null}
                </Pressable>
              );
            })}
          </View>
          <PrimaryButton
            title={`Continue as ${roleLabels[selectedRole]}`}
            onPress={handleApply}
            style={{ marginTop: theme.spacing.md }}
          />
        </Card>
      </View>
    </Screen>
  );
};

export default SwitchRoleScreen;
