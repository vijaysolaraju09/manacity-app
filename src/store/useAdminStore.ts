import { create } from 'zustand';
import { Event, EventUpdate, LeaderboardEntry } from '../types/events';
import { ServiceCategory } from '../types/services';

export type AdminRole = 'Super Admin' | 'Moderator' | 'Support';
export type AdminUserStatus = 'active' | 'inactive';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: AdminUserStatus;
  lastActive: string;
  responsibleFor?: string[];
}

export type AdminShopStatus = 'pending' | 'approved' | 'rejected' | 'disabled';

export interface AdminShop {
  id: string;
  name: string;
  owner: string;
  category: string;
  status: AdminShopStatus;
  documents: string[];
  riskNotes?: string;
  updatedAt: string;
}

export interface AdminEvent extends Event {
  updates: EventUpdate[];
  leaderboard: LeaderboardEntry[];
  team?: string;
}

export interface AdminAnnouncement {
  id: string;
  title: string;
  body: string;
  audience: 'all' | 'shoppers' | 'providers' | 'admins';
  channel: 'push' | 'email';
  sentAt: string;
}

interface AdminState {
  users: AdminUser[];
  shops: AdminShop[];
  events: AdminEvent[];
  announcements: AdminAnnouncement[];
  serviceCategories: (ServiceCategory & { owner?: string; compliance?: string })[];
  toggleUserStatus: (userId: string) => void;
  updateUserRole: (userId: string, role: AdminRole) => void;
  addAdminUser: (payload: Pick<AdminUser, 'name' | 'email' | 'role'>) => void;
  updateShopStatus: (shopId: string, status: AdminShopStatus, riskNotes?: string) => void;
  updateCategory: (categoryId: string, updates: Partial<ServiceCategory & { owner?: string; compliance?: string }>) => void;
  createCategory: (payload: Pick<ServiceCategory, 'name' | 'summary'> & { image?: string; owner?: string; compliance?: string }) => void;
  deleteCategory: (categoryId: string) => void;
  createEvent: (payload: Pick<AdminEvent, 'title' | 'category' | 'location' | 'startsAt' | 'endsAt'> & { image?: string }) => void;
  updateEvent: (eventId: string, updates: Partial<AdminEvent>) => void;
  addEventUpdate: (eventId: string, payload: Pick<EventUpdate, 'title' | 'body'>) => void;
  setLeaderboard: (eventId: string, leaderboard: LeaderboardEntry[]) => void;
  addAnnouncement: (payload: Pick<AdminAnnouncement, 'title' | 'body' | 'audience' | 'channel'>) => void;
}

const now = () => new Date().toISOString();

const seedUsers: AdminUser[] = [
  {
    id: 'u1',
    name: 'Chinwe Adeyemi',
    email: 'chinwe@manacity.app',
    role: 'Super Admin',
    status: 'active',
    lastActive: now(),
    responsibleFor: ['Shops', 'Compliance'],
  },
  {
    id: 'u2',
    name: 'Victor Nwachukwu',
    email: 'victor@manacity.app',
    role: 'Moderator',
    status: 'inactive',
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    responsibleFor: ['Events'],
  },
  {
    id: 'u3',
    name: 'Halima Danladi',
    email: 'halima@manacity.app',
    role: 'Support',
    status: 'active',
    lastActive: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    responsibleFor: ['Services', 'Private requests'],
  },
];

const seedShops: AdminShop[] = [
  {
    id: 's1',
    name: 'Fresh Basket Grocers',
    owner: 'Temi Aluko',
    category: 'Groceries',
    status: 'pending',
    documents: ['CAC certificate', 'Utility bill'],
    riskNotes: 'Pending address verification',
    updatedAt: now(),
  },
  {
    id: 's2',
    name: 'Tech Plaza Outlet',
    owner: 'Ike Nnaji',
    category: 'Electronics',
    status: 'approved',
    documents: ['CAC certificate', 'NIN'],
    updatedAt: now(),
  },
  {
    id: 's3',
    name: 'Cafe Bloom',
    owner: 'Sarah Okon',
    category: 'Cafe',
    status: 'disabled',
    documents: ['CAC certificate'],
    riskNotes: 'Chargeback spike detected',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
];

const seedCategories: (ServiceCategory & { owner?: string; compliance?: string })[] = [
  { id: 'cleaning', name: 'Cleaning', summary: 'Apartments, offices, and move out cleans', image: '', owner: 'Halima', compliance: 'Enhanced KYC' },
  { id: 'repairs', name: 'Repairs', summary: 'Electrical, plumbing, and home maintenance', image: '', owner: 'Victor', compliance: 'Background checks' },
  { id: 'beauty', name: 'Beauty & Wellness', summary: 'On-demand salon, spa, and make up', image: '', owner: 'Halima' },
];

const seedEvents: AdminEvent[] = [
  {
    id: 'ev-admin-1',
    title: 'Merchant Summit',
    category: 'event',
    startsAt: now(),
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(),
    location: 'Innovation Hub',
    image: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f',
    description: 'Townhall with top merchants. Approvals, payouts, and support clinics.',
    schedule: [],
    rules: { title: 'House rules', details: ['Arrive 15 minutes early', 'Bring ID card'] },
    updates: [
      { id: 'u-admin-1', title: 'Prep call', body: 'Send the final agenda to speakers.', createdAt: now(), author: 'Chinwe' },
    ],
    leaderboard: [
      { id: 'lb1', rank: 1, name: 'Engagement', score: 78 },
      { id: 'lb2', rank: 2, name: 'Registrations', score: 42 },
    ],
    team: 'Events',
  },
];

export const useAdminStore = create<AdminState>((set) => ({
  users: seedUsers,
  shops: seedShops,
  events: seedEvents,
  announcements: [],
  serviceCategories: seedCategories,
  toggleUserStatus: (userId) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } : user,
      ),
    })),
  updateUserRole: (userId, role) =>
    set((state) => ({
      users: state.users.map((user) => (user.id === userId ? { ...user, role } : user)),
    })),
  addAdminUser: (payload) =>
    set((state) => ({
      users: [
        ...state.users,
        {
          ...payload,
          id: `user-${state.users.length + 1}`,
          status: 'active' as AdminUserStatus,
          lastActive: now(),
          responsibleFor: [],
        },
      ],
    })),
  updateShopStatus: (shopId, status, riskNotes) =>
    set((state) => ({
      shops: state.shops.map((shop) => (shop.id === shopId ? { ...shop, status, riskNotes, updatedAt: now() } : shop)),
    })),
  updateCategory: (categoryId, updates) =>
    set((state) => ({
      serviceCategories: state.serviceCategories.map((cat) => (cat.id === categoryId ? { ...cat, ...updates } : cat)),
    })),
  createCategory: (payload) =>
    set((state) => ({
      serviceCategories: [
        ...state.serviceCategories,
        {
          id: payload.name.toLowerCase().replace(/\s+/g, '-'),
          image: payload.image || '',
          summary: payload.summary,
          name: payload.name,
          owner: payload.owner,
          compliance: payload.compliance,
        },
      ],
    })),
  deleteCategory: (categoryId) =>
    set((state) => ({
      serviceCategories: state.serviceCategories.filter((cat) => cat.id !== categoryId),
    })),
  createEvent: (payload) =>
    set((state) => ({
      events: [
        ...state.events,
        {
          id: `ev-admin-${state.events.length + 1}`,
          title: payload.title,
          category: payload.category,
          startsAt: payload.startsAt,
          endsAt: payload.endsAt,
          location: payload.location,
          image:
            payload.image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
          description: 'Admin curated event',
          schedule: [],
          rules: { title: 'Guidelines', details: [] },
          updates: [],
          leaderboard: [],
        },
      ],
    })),
  updateEvent: (eventId, updates) =>
    set((state) => ({
      events: state.events.map((event) => (event.id === eventId ? { ...event, ...updates } : event)),
    })),
  addEventUpdate: (eventId, payload) =>
    set((state) => ({
      events: state.events.map((event) =>
        event.id === eventId
          ? {
              ...event,
              updates: [
                { id: `${event.id}-u-${event.updates.length + 1}`, createdAt: now(), ...payload, author: 'Admin' },
                ...event.updates,
              ],
            }
          : event,
      ),
    })),
  setLeaderboard: (eventId, leaderboard) =>
    set((state) => ({
      events: state.events.map((event) => (event.id === eventId ? { ...event, leaderboard } : event)),
    })),
  addAnnouncement: (payload) =>
    set((state) => ({
      announcements: [
        { id: `announcement-${state.announcements.length + 1}`, sentAt: now(), ...payload },
        ...state.announcements,
      ],
    })),
}));
