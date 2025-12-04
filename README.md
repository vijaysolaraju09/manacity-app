# Manacity

Manacity is a React Native application bootstrapped with Expo and written entirely in TypeScript. The app scaffolds a multi-role experience with authentication, commerce, services, events, notifications, business, and admin areas.

## Features
- Expo-managed workflow targeting Android and iOS.
- React Navigation with deep linking and bottom tabs (Home, Shops, Services, Events, Profile).
- Global theming with shared colors, spacing, typography, and responsive utilities.
- API client with Axios, Secure Store-backed auth helpers, React Query setup, and network/error handling utilities.
- Push notification handler powered by `expo-notifications`.
- Placeholder screens for authentication, shops, services, events, orders, notifications, profile, business, and admin modules.

## Structure
```
/src
  api/            // Axios client configuration
  auth/           // Auth helpers using Secure Store
  components/     // Shared UI primitives
  context/        // Theming context provider
  hooks/          // Notifications, network, and error handling hooks
  navigation/     // Navigators and deep-linking config
  screens/        // Feature screens grouped by domain
  store/          // Zustand stores
  utils/          // Cross-cutting utilities (theme, responsive, notifications)
  theme/          // Color, spacing, typography tokens
```

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the app in Expo:
   ```bash
   npm run start
   ```
3. Use the Expo Go app or an emulator to preview the app via the QR code or platform-specific commands.

## Testing & Linting
- Lint: `npm run lint`

## Deep Linking
The app is configured with the `manacity://` scheme and supports navigation to primary tabs and auth screens.

## Assets
Binary icon and splash assets were removed to keep the repository lightweight. Add your own platform icons and splash images to an `assets/` directory and update `app.json` before publishing.
