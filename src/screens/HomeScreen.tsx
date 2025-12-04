import React from 'react';
import { Screen } from '../components/Screen';
import Placeholder from '../components/Placeholder';

const HomeScreen = () => (
  <Screen>
    <Placeholder
      title="Welcome to Manacity"
      description="Explore shops, book services, join events, and manage your business or admin responsibilities from one place."
      actions={['Browse curated shops and add products to your cart', 'Request services directly from trusted providers', 'Stay updated on events, tournaments, and announcements']}
    />
  </Screen>
);

export default HomeScreen;
