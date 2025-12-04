import apiClient from './client';
import { Event, EventFilters, EventRegistration, EventUpdate, LeaderboardEntry } from '../types/events';

const fallbackEvents: Event[] = [
  {
    id: 'ev1',
    title: 'City Cultural Fest',
    category: 'event',
    startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 60 * 4).toISOString(),
    location: 'Central Park Amphitheater',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
    description:
      'Celebrate the city with live music, food trucks, and community performances. Enjoy interactive installations and family friendly activities.',
    schedule: [
      { time: '10:00 AM', title: 'Opening Parade', description: 'Performers and local artists open the festivities.' },
      { time: '12:00 PM', title: 'Food Tasting', description: 'Taste curated bites from top local chefs.' },
      { time: '3:00 PM', title: 'Evening Concert', description: 'Headliners perform on the main stage.' },
    ],
    rules: {
      title: 'Event Guidelines',
      details: ['No outside food or drinks', 'Pets must be leashed', 'Follow on-ground safety instructions'],
    },
  },
  {
    id: 'ev2',
    title: 'Mile Run Challenge',
    category: 'event',
    startsAt: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 49).toISOString(),
    location: 'Riverwalk Track',
    image: 'https://images.unsplash.com/photo-1546484959-f9a9c6c0f165',
    description:
      'Community 5K run for all fitness levels. Pacers available for beginners and prizes for the fastest finishers.',
    schedule: [
      { time: '6:30 AM', title: 'Check-in & Warmup' },
      { time: '7:00 AM', title: 'Race Start' },
      { time: '8:15 AM', title: 'Award Ceremony' },
    ],
    rules: {
      title: 'Race Rules',
      details: ['Bib numbers must be visible', 'Headphones allowed at low volume', 'Follow pacers for safety'],
    },
  },
  {
    id: 'ev3',
    title: 'E-sports Arena Clash',
    category: 'tournament',
    startsAt: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(),
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 72 + 1000 * 60 * 60 * 6).toISOString(),
    location: 'Innovation Hub Hall B',
    image: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef',
    description:
      'Double elimination tournament featuring top squads from the region. Live shoutcasting, spectator zone, and prize pool.',
    schedule: [
      { time: '11:00 AM', title: 'Check-in & Seeding' },
      { time: '12:00 PM', title: 'Group Stage' },
      { time: '5:00 PM', title: 'Finals & Awards' },
    ],
    rules: {
      title: 'Tournament Rules',
      details: ['Teams must check-in 30 minutes before match', 'Best-of-three format', 'Standard competitive settings'],
    },
  },
];

const fallbackUpdates: Record<string, EventUpdate[]> = {
  ev1: [
    {
      id: 'u1',
      title: 'Lineup confirmed',
      body: 'Local bands EchoStreet and Nightshift have been confirmed for the evening concert slot.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      author: 'City Admin',
    },
  ],
  ev3: [
    {
      id: 'u2',
      title: 'Brackets posted',
      body: 'Tournament brackets are live. Check your seedings before match day.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      author: 'Arena Ops',
    },
  ],
};

const fallbackLeaderboard: Record<string, LeaderboardEntry[]> = {
  ev3: [
    { id: 'l1', rank: 1, name: 'Team Phoenix', score: 48 },
    { id: 'l2', rank: 2, name: 'Valkyrie Esports', score: 42 },
    { id: 'l3', rank: 3, name: 'Night Owls', score: 36 },
    { id: 'l4', rank: 4, name: 'Crimson Tide', score: 29 },
  ],
};

const registrations = new Map<string, EventRegistration>();

const normalizeEvents = (events: Event[]): Event[] =>
  events.map((event) => ({
    ...event,
    isRegistered: registrations.has(event.id) || event.isRegistered,
    remindersEnabled: registrations.get(event.id)?.remindersEnabled ?? event.remindersEnabled ?? false,
  }));

export const fetchEvents = async (filters?: EventFilters): Promise<Event[]> => {
  const params = {
    category: filters?.category,
    registered: filters?.registeredOnly,
  };

  try {
    const response = await apiClient.get('/events', { params });
    const data = response.data?.data || response.data;
    return normalizeEvents(data?.items || data?.events || data || []);
  } catch (error) {
    let events = [...fallbackEvents];
    if (filters?.category && filters.category !== 'all') {
      events = events.filter((event) => event.category === filters.category);
    }
    if (filters?.registeredOnly) {
      events = events.filter((event) => registrations.has(event.id));
    }
    return normalizeEvents(events);
  }
};

export const fetchEventDetails = async (eventId: string): Promise<Event> => {
  try {
    const response = await apiClient.get(`/events/${eventId}`);
    const data = response.data?.data || response.data;
    return normalizeEvents([data])[0];
  } catch (error) {
    const event = fallbackEvents.find((e) => e.id === eventId) || fallbackEvents[0];
    return normalizeEvents([event])[0];
  }
};

export const registerForEvent = async (
  eventId: string,
  remindersEnabled = true,
): Promise<EventRegistration> => {
  try {
    const response = await apiClient.post(`/events/${eventId}/register`, { remindersEnabled });
    const registration = response.data?.data || response.data;
    registrations.set(eventId, registration as EventRegistration);
    return registration as EventRegistration;
  } catch (error) {
    const registration = {
      eventId,
      registeredAt: new Date().toISOString(),
      remindersEnabled,
    } satisfies EventRegistration;
    registrations.set(eventId, registration);
    return registration;
  }
};

export const unregisterFromEvent = async (eventId: string) => {
  try {
    await apiClient.delete(`/events/${eventId}/register`);
  } finally {
    registrations.delete(eventId);
  }
  return { success: true };
};

export const fetchEventUpdates = async (eventId: string): Promise<EventUpdate[]> => {
  try {
    const response = await apiClient.get(`/events/${eventId}/updates`);
    const data = response.data?.data || response.data;
    return data?.items || data?.updates || data || [];
  } catch (error) {
    return [...(fallbackUpdates[eventId] || [])].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }
};

export const createEventUpdate = async (
  eventId: string,
  payload: Pick<EventUpdate, 'title' | 'body'>,
): Promise<EventUpdate> => {
  try {
    const response = await apiClient.post(`/events/${eventId}/updates`, payload);
    return response.data?.data || response.data;
  } catch (error) {
    const update: EventUpdate = {
      id: `local-${Date.now()}`,
      title: payload.title,
      body: payload.body,
      createdAt: new Date().toISOString(),
      author: 'Admin',
    };
    fallbackUpdates[eventId] = [...(fallbackUpdates[eventId] || []), update];
    return update;
  }
};

export const fetchLeaderboard = async (eventId: string): Promise<LeaderboardEntry[]> => {
  try {
    const response = await apiClient.get(`/events/${eventId}/leaderboard`);
    const data = response.data?.data || response.data;
    return data?.items || data?.leaderboard || data || [];
  } catch (error) {
    return fallbackLeaderboard[eventId] || [];
  }
};
