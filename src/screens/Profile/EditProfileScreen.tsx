import React, { useState } from 'react';
import { View, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import FormTextInput from '../../components/FormTextInput';
import PrimaryButton from '../../components/PrimaryButton';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';

const EditProfileScreen = () => {
  const theme = useTheme();
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [location, setLocation] = useState(user?.location ?? '');
  const [avatar, setAvatar] = useState<string | undefined>(user?.avatar);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.6 });
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

  return (
    <Screen>
      <View style={{ gap: theme.spacing.md }}>
        <ThemedText style={{ fontSize: 22, fontWeight: '700' }}>Profile</ThemedText>
        <Card>
          <View style={{ alignItems: 'center', gap: theme.spacing.sm }}>
            <Image source={{ uri: avatar ?? 'https://placekitten.com/200/200' }} style={{ width: 90, height: 90, borderRadius: 999 }} />
            <PrimaryButton title="Change photo" onPress={pickImage} style={{ width: 160 }} />
          </View>
          <FormTextInput label="Name" value={name} onChangeText={setName} error={errors.name} />
          <FormTextInput label="Phone" value={user?.phone ?? ''} editable={false} />
          <FormTextInput label="Location" value={location} onChangeText={setLocation} error={errors.location} />
          <PrimaryButton title="Save changes" onPress={handleSave} loading={saving} />
        </Card>
      </View>
    </Screen>
  );
};

export default EditProfileScreen;
