import React, { useState } from 'react';
import { View } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import { Screen } from '../../components/Screen';
import PrimaryButton from '../../components/PrimaryButton';
import { ThemedText } from '../../components/Themed';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';

const LoginScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { login, pendingPhone } = useAuth();
  const [phone, setPhone] = useState(pendingPhone ?? '');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async () => {
    setError(null);
    if (!phone || phone.length < 8) {
      setError('Enter a valid phone number');
      return;
    }
    setIsSending(true);
    try {
      await login(phone);
      navigation.navigate('OTP');
    } catch (err: any) {
      setError(err?.message ?? 'Unable to send OTP');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Screen scroll={false}>
      <View style={{ gap: theme.spacing.md }}>
        <ThemedText style={{ fontSize: 22, fontWeight: '700' }}>Sign in with your phone</ThemedText>
        <ThemedText style={{ color: theme.colors.muted }}>
          We will send you a 6-digit verification code. Message and data rates may apply.
        </ThemedText>
        <PhoneInput
          defaultCode="GH"
          layout="first"
          textInputProps={{ placeholder: 'Phone number' }}
          containerStyle={{ borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border }}
          textContainerStyle={{ borderRadius: 12, backgroundColor: theme.colors.card }}
          onChangeFormattedText={(text) => setPhone(text)}
          value={phone}
        />
        {error ? <ThemedText style={{ color: theme.colors.danger }}>{error}</ThemedText> : null}
        <PrimaryButton title="Send OTP" onPress={handleSendOtp} loading={isSending} />
      </View>
    </Screen>
  );
};

export default LoginScreen;
