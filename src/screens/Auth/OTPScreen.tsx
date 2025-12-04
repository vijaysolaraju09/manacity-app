import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Screen } from '../../components/Screen';
import OTPInput from '../../components/OTPInput';
import PrimaryButton from '../../components/PrimaryButton';
import { ThemedText } from '../../components/Themed';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';

const OTPScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { pendingPhone, verify } = useAuth();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const readClipboard = async () => {
      const content = await Clipboard.getStringAsync();
      if (/^\d{6}$/.test(content)) {
        setOtp(content);
      }
    };
    readClipboard();
  }, []);

  useEffect(() => {
    if (otp.length === 6) {
      handleVerify();
    }
  }, [otp]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Enter the 6-digit code');
      return;
    }
    setLoading(true);
    try {
      await verify(otp);
      navigation.replace('ProfileSetup');
    } catch (err: any) {
      setError(err?.message ?? 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll={false}>
      <View style={{ gap: theme.spacing.md, alignItems: 'center' }}>
        <ThemedText style={{ fontSize: 22, fontWeight: '700' }}>Enter OTP</ThemedText>
        <ThemedText style={{ color: theme.colors.muted }}>
          We sent a 6-digit code to {pendingPhone ?? 'your phone'}. It will auto-fill if detected in your clipboard.
        </ThemedText>
        <OTPInput value={otp} onChange={setOtp} />
        {error ? <ThemedText style={{ color: theme.colors.danger }}>{error}</ThemedText> : null}
        <PrimaryButton title="Verify" onPress={handleVerify} loading={loading} />
      </View>
    </Screen>
  );
};

export default OTPScreen;
