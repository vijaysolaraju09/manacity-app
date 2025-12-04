import React from 'react';
import { Screen } from '../../components/Screen';
import Placeholder from '../../components/Placeholder';

const LoginScreen = () => (
  <Screen>
    <Placeholder
      title="Sign in"
      description="Authenticate with your phone number or email to access personalized shops, services, and events."
      actions={["Enter credentials and request OTP", "Handle validation errors gracefully", "Persist tokens securely with Secure Store"]}
    />
  </Screen>
);

export default LoginScreen;
