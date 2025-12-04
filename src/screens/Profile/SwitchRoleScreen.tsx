import React from 'react';
import { View } from 'react-native';
import { Screen } from '../../components/Screen';
import { ThemedText, Card } from '../../components/Themed';
import RolePill from '../../components/RolePill';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../hooks/useAuth';
import { Role } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const roleLabels: Record<Role, string> = {
  customer: 'Customer',
  business: 'Business',
  admin: 'Admin',
};

const SwitchRoleScreen = ({ navigation }: any) => {
  const { user, activeRole, switchRole } = useAuth();
  const theme = useTheme();

  const handleSwitch = (role: Role) => {
    switchRole(role);
    navigation.navigate('EditProfile');
  };

  return (
    <Screen>
      <View style={{ gap: theme.spacing.md }}>
        <ThemedText style={{ fontSize: 22, fontWeight: '700' }}>Switch role</ThemedText>
        <Card>
          <ThemedText style={{ marginBottom: 12 }}>Choose how you want to explore Manacity right now:</ThemedText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {user?.roles?.map((role) => (
              <RolePill
                key={role}
                label={roleLabels[role as Role] ?? role}
                active={activeRole === role}
                onPress={() => handleSwitch(role as Role)}
              />
            ))}
          </View>
          <PrimaryButton
            title={`Continue as ${roleLabels[activeRole]}`}
            onPress={() => navigation.goBack()}
            style={{ marginTop: theme.spacing.md }}
          />
        </Card>
      </View>
    </Screen>
  );
};

export default SwitchRoleScreen;
