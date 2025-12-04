import React, { useState } from 'react';
import { View, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Screen } from '../../components/Screen';
import FormTextInput from '../../components/FormTextInput';
import PrimaryButton from '../../components/PrimaryButton';
import { ThemedText } from '../../components/Themed';
import RolePill from '../../components/RolePill';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { Role } from '../../context/AuthContext';

const roles: Role[] = ['customer', 'business', 'admin'];

const ProfileSetupScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { user, updateProfile, switchRole } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [location, setLocation] = useState(user?.location ?? '');
  const [avatar, setAvatar] = useState<string | undefined>(user?.avatar);
  const [selectedRoles, setSelectedRoles] = useState<Role[]>((user?.roles as Role[]) ?? ['customer']);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow access to your photos to upload an avatar.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.6 });
    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const toggleRole = (role: Role) => {
    setSelectedRoles((prev) => {
      if (prev.includes(role)) {
        return prev.length === 1 ? prev : prev.filter((r) => r !== role);
      }
      return [...prev, role];
    });
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = 'Name is required';
    if (!location.trim()) nextErrors.location = 'Location is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleContinue = async () => {
    if (!validate()) return;
    setSaving(true);
    await updateProfile({ name, location, avatar, roles: selectedRoles });
    switchRole(selectedRoles[0]);
    setSaving(false);
    navigation.replace('Root');
  };

  return (
    <Screen>
      <View style={{ gap: theme.spacing.md }}>
        <ThemedText style={{ fontSize: 22, fontWeight: '700' }}>Complete your profile</ThemedText>
        <ThemedText style={{ color: theme.colors.muted }}>
          Add your personal details and choose which roles you want to use in Manacity.
        </ThemedText>
        <View style={{ alignItems: 'center', gap: theme.spacing.sm }}>
          <Image
            source={{ uri: avatar ?? 'https://placekitten.com/200/200' }}
            style={{ width: 100, height: 100, borderRadius: 999 }}
          />
          <PrimaryButton title="Upload photo" onPress={pickImage} style={{ width: 180 }} />
        </View>
        <FormTextInput label="Name" value={name} onChangeText={setName} error={errors.name} />
        <FormTextInput label="Phone" value={user?.phone ?? ''} editable={false} />
        <FormTextInput label="Location" value={location} onChangeText={setLocation} error={errors.location} />
        <View>
          <ThemedText style={{ marginBottom: 8 }}>Roles</ThemedText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {roles.map((role) => (
              <RolePill key={role} label={role} active={selectedRoles.includes(role)} onPress={() => toggleRole(role)} />
            ))}
          </View>
        </View>
        <PrimaryButton title="Save & continue" onPress={handleContinue} loading={saving} />
      </View>
    </Screen>
  );
};

export default ProfileSetupScreen;
