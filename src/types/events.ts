export type EventCategory = 'event' | 'tournament';

export interface EventScheduleItem {
  time: string;
  title: string;
  description?: string;
}

export interface EventRules {
  title: string;
  details: string[];
}

export interface EventUpdate {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  author?: string;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  score: number;
}

export interface Event {
  id: string;
  title: string;
  category: EventCategory;
  startsAt: string;
  endsAt: string;
  location: string;
  image: string;
  description: string;
  schedule: EventScheduleItem[];
  rules: EventRules;
  isRegistered?: boolean;
  remindersEnabled?: boolean;
}

export interface EventRegistration {
  eventId: string;
  registeredAt: string;
  remindersEnabled: boolean;
}

export interface EventFilters {
  category?: 'all' | EventCategory;
  registeredOnly?: boolean;
}
