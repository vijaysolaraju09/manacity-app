export type RootStackParamList = {
  Root: undefined;
  Auth: undefined;
  Business: undefined;
  Admin: undefined;
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
  ShopDetails: undefined;
  Products: undefined;
  Cart: undefined;
  Checkout: undefined;
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
  Orders: undefined;
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
