export type RootStackParamList = {
  Root: undefined;
  Auth: undefined;
  Business: undefined;
  Admin: undefined;
  Onboarding: undefined;
  ProfileSetup: undefined;
};

export type TabParamList = {
  Home: undefined;
  Shops: undefined;
  Services: undefined;
  Events: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  OTP: undefined;
  ProfileSetup: undefined;
};

export type ShopsStackParamList = {
  ShopsList: undefined;
  ShopDetails: { shopId: string };
  Products: { shopId: string } | undefined;
  Cart: undefined;
  Checkout: { orderNumber?: string } | undefined;
};

export type ServicesStackParamList = {
  ServicesPublic: undefined;
  ServicesPrivate: undefined;
  ServicesDirect: undefined;
  ServicesOffers: undefined;
  ServicesProviders: undefined;
  ServicesRequestForm: undefined;
};

export type EventsStackParamList = {
  EventsList: undefined;
  EventDetails: undefined;
  EventRegister: undefined;
  EventLeaderboard: undefined;
  EventUpdates: undefined;
};

export type ProfileStackParamList = {
  ProfileSettings: undefined;
  EditProfile: undefined;
  SwitchRole: undefined;
  Notifications: undefined;
  OrderHistory: undefined;
  OrderDetails: { orderId: string };
  OrderTracking: { orderId: string };
};

export type BusinessStackParamList = {
  BusinessDashboard: undefined;
  ManageShop: undefined;
  ManageProducts: undefined;
  ManageOrders: undefined;
};

export type AdminStackParamList = {
  AdminDashboard: undefined;
  AdminUsers: undefined;
  AdminShops: undefined;
  AdminServices: undefined;
  AdminEvents: undefined;
  AdminAssignments: undefined;
};
