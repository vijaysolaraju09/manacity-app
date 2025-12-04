import React from 'react';
import { Screen } from '../../components/Screen';
import Placeholder from '../../components/Placeholder';

const OTPScreen = () => (
  <Screen>
    <Placeholder
      title="OTP verification"
      description="Confirm the code sent to the user to complete authentication and guard access across platforms."
      actions={["Capture phone input and country codes", "Validate OTP format and handle resend flows", "Route to profile setup on success"]}
    />
  </Screen>
);

export default OTPScreen;
