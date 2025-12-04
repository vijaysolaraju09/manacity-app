import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import PrimaryButton from '../../components/PrimaryButton';
import { ServiceProviderCard } from '../../components/services/ServiceUI';
import { useServicesStore } from '../../store/useServicesStore';

const ServicesProvidersScreen = () => {
  const navigation = useNavigation();
  const { providers, categories } = useServicesStore();

  return (
    <Screen>
      <ThemedText accessibilityRole="header" style={{ fontSize: 22, fontWeight: '700', marginBottom: 8 }}>
        Providers & profiles
      </ThemedText>
      <Card>
        <ThemedText style={{ fontWeight: '700', marginBottom: 6 }}>Highlighted categories</ThemedText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {categories.map((category) => (
            <View
              key={category.id}
              style={{ borderWidth: 1, borderRadius: 12, padding: 10, borderColor: '#E5E7EB', minWidth: '45%' }}
            >
              <ThemedText style={{ fontWeight: '700' }}>{category.name}</ThemedText>
              <ThemedText numberOfLines={2} style={{ color: '#6B7280', marginTop: 4 }}>
                {category.summary}
              </ThemedText>
            </View>
          ))}
        </View>
      </Card>

      {providers.map((provider) => (
        <ServiceProviderCard
          key={provider.id}
          provider={provider}
          actions={
            <View style={{ gap: 8 }}>
              <PrimaryButton
                title="Request service"
                onPress={() => navigation.navigate('ServicesRequestForm' as never, { mode: 'direct', providerId: provider.id } as never)}
              />
              <ThemedText style={{ color: '#6B7280' }}>
                {provider.contact.email} • {provider.contact.phone}
              </ThemedText>
            </View>
          }
        />
      ))}
    </Screen>
  );
};

export default ServicesProvidersScreen;
