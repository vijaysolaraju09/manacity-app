import React, { useMemo, useState } from 'react';
import { Image, Pressable, View, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import FormTextInput from '../../components/FormTextInput';
import PrimaryButton from '../../components/PrimaryButton';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { ProfileStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const ActionRow: React.FC<{
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  description?: string;
}> = ({ label, icon, onPress, description }) => {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: theme.spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
        <Ionicons name={icon} size={20} color={theme.colors.primary} />
        <View>
          <ThemedText style={{ fontWeight: '600' }}>{label}</ThemedText>
          {description ? <ThemedText style={{ color: theme.colors.muted }}>{description}</ThemedText> : null}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.colors.muted} />
    </Pressable>
  );
};

type Props = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { user, updateProfile, activeRole } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [location, setLocation] = useState(user?.location ?? '');
  const [avatar, setAvatar] = useState<string | undefined>(user?.avatar);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentRoleLabel = useMemo(() => {
    if (activeRole === 'business') return 'Business owner';
    if (activeRole === 'admin') return 'Administrator';
    return 'Customer';
  }, [activeRole]);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = 'Name is required';
    if (!location.trim()) nextErrors.location = 'Location is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow access to your photos to upload an avatar.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.7, aspect: [1, 1] });
    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    await updateProfile({ name, location, avatar });
    setSaving(false);
  };

  const quickLinks = [
    { label: 'Switch role', icon: 'swap-horizontal', onPress: () => navigation.navigate('SwitchRole') },
    { label: 'Notifications', icon: 'notifications-outline', onPress: () => navigation.navigate('Notifications') },
    { label: 'Orders & history', icon: 'receipt-outline', onPress: () => navigation.navigate('OrderHistory') },
    { label: 'Settings', icon: 'settings-outline', onPress: () => navigation.navigate('ProfileSettings') },
    { label: 'Help center', icon: 'help-circle-outline', onPress: () => navigation.navigate('HelpCenter') },
    { label: 'Privacy policy', icon: 'shield-checkmark-outline', onPress: () => navigation.navigate('PrivacyPolicy') },
    { label: 'About Manacity', icon: 'information-circle-outline', onPress: () => navigation.navigate('About') },
  ];

  return (
    <Screen>
      <View style={{ gap: theme.spacing.md }}>
        <ThemedText style={{ fontSize: 22, fontWeight: '700' }}>Profile</ThemedText>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
            <Image
              source={{ uri: avatar ?? 'https://placekitten.com/200/200' }}
              style={{ width: 90, height: 90, borderRadius: 18 }}
            />
            <View style={{ flex: 1, gap: 6 }}>
              <ThemedText style={{ fontSize: 18, fontWeight: '700' }}>{name || 'Your name'}</ThemedText>
              <ThemedText style={{ color: theme.colors.muted }}>{user?.phone || 'Add your phone'}</ThemedText>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  paddingVertical: 4,
                  paddingHorizontal: 10,
                  alignSelf: 'flex-start',
                  backgroundColor: theme.colors.primary + '15',
                  borderRadius: 999,
                }}
              >
                <Ionicons name="briefcase" size={14} color={theme.colors.primary} />
                <ThemedText style={{ color: theme.colors.primary, fontWeight: '600' }}>{currentRoleLabel}</ThemedText>
              </View>
              <PrimaryButton title="Change photo" onPress={pickImage} style={{ alignSelf: 'flex-start' }} />
            </View>
          </View>
        </Card>

        <Card>
          <ThemedText style={{ fontSize: 16, fontWeight: '700', marginBottom: theme.spacing.sm }}>Profile details</ThemedText>
          <FormTextInput label="Name" value={name} onChangeText={setName} error={errors.name} />
          <FormTextInput label="Phone" value={user?.phone ?? ''} editable={false} />
          <FormTextInput label="Location" value={location} onChangeText={setLocation} error={errors.location} />
          <PrimaryButton title="Save changes" onPress={handleSave} loading={saving} />
        </Card>

        <Card>
          <ThemedText style={{ fontSize: 16, fontWeight: '700', marginBottom: theme.spacing.sm }}>Explore</ThemedText>
          <View style={{ gap: theme.spacing.xs }}>
            {quickLinks.map((link) => (
              <ActionRow
                key={link.label}
                label={link.label}
                icon={link.icon as keyof typeof Ionicons.glyphMap}
                onPress={link.onPress}
              />
            ))}
          </View>
        </Card>
      </View>
    </Screen>
  );
};

export default EditProfileScreen;
