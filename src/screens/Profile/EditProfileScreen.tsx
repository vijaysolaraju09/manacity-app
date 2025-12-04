import React from 'react';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';

const EditProfileScreen = () => (
  <Screen>
    <ThemedText accessibilityRole="header">Edit Profile</ThemedText>
    <Card>
      <ThemedText>Update your personal details and preferences.</ThemedText>
    </Card>
  </Screen>
);

export default EditProfileScreen;
