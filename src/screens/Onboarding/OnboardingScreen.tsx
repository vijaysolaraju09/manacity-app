import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { Screen } from '../../components/Screen';
import { ThemedText } from '../../components/Themed';
import PrimaryButton from '../../components/PrimaryButton';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';

const { width } = Dimensions.get('window');

const animations = [
  'https://assets5.lottiefiles.com/packages/lf20_UJNc2t.json',
  'https://assets10.lottiefiles.com/packages/lf20_fcfjwiyb.json',
];

const OnboardingScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { completeOnboarding } = useAuth();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % animations.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const handleContinue = async () => {
    await completeOnboarding();
    navigation.replace('Auth');
  };

  return (
    <Screen scroll={false}>
      <View style={styles.center}>
        <LottieView source={{ uri: animations[index] }} autoPlay loop style={{ width: width - 80, height: 280 }} />
        <ThemedText style={[styles.title, { color: theme.colors.text }]}>Welcome to Manacity</ThemedText>
        <ThemedText style={{ color: theme.colors.muted, textAlign: 'center' }}>
          Discover shops, services, and events near you. Manage your roles seamlessly across customer, business, and admin
          experiences.
        </ThemedText>
      </View>
      <PrimaryButton title="Continue" onPress={handleContinue} style={{ marginTop: theme.spacing.lg }} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
});

export default OnboardingScreen;
