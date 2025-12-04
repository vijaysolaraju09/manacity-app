import React from 'react';
import { Screen } from '../../components/Screen';
import Placeholder from '../../components/Placeholder';

const ProfileSetupScreen = () => (
  <Screen>
    <Placeholder
      title="Complete your profile"
      description="Collect user details, preferences, and roles to unlock tailored experiences for commerce, services, and events."
      actions={["Capture name, avatar, and role selection", "Guide users to switch between customer and business contexts", "Store onboarding state to skip repeats"]}
    />
  </Screen>
);

export default ProfileSetupScreen;
