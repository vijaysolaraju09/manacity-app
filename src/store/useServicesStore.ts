import { create } from 'zustand';
import {
  ServiceCategory,
  ServiceNotification,
  ServiceOffer,
  ServiceRequest,
  ServiceStatus,
  ServiceProvider,
} from '../types/services';

const now = () => new Date().toISOString();

interface ServicesState {
  categories: ServiceCategory[];
  providers: ServiceProvider[];
  requests: ServiceRequest[];
  notifications: ServiceNotification[];
  createCategory: (payload: Pick<ServiceCategory, 'name' | 'summary'> & { image?: string }) => void;
  updateCategory: (categoryId: string, updates: Partial<ServiceCategory>) => void;
  deleteCategory: (categoryId: string) => void;
  assignProviderToCategory: (payload: { providerId: string; categoryId: string }) => void;
  removeProviderFromCategory: (payload: { providerId: string; categoryId: string }) => void;
  createPublicRequest: (payload: Omit<ServiceRequest, 'id' | 'status' | 'timeline' | 'offers' | 'type' | 'contactReleased'>) => void;
  createPrivateRequest: (
    payload: Omit<ServiceRequest, 'id' | 'status' | 'timeline' | 'offers' | 'type' | 'contactReleased' | 'directProviderId'>,
  ) => void;
  createDirectRequest: (
    payload: Omit<ServiceRequest, 'id' | 'status' | 'timeline' | 'offers' | 'type' | 'contactReleased'>,
  ) => void;
  submitOffer: (payload: { requestId: string; providerId: string; message: string; price: number }) => void;
  respondToOffer: (payload: { requestId: string; offerId: string; decision: 'accept' | 'reject' }) => void;
  updateStatus: (requestId: string, status: ServiceStatus, note?: string) => void;
  assignProvider: (payload: { requestId: string; providerId: string; note?: string }) => void;
}

const seedCategories: ServiceCategory[] = [
  {
    id: 'repairs',
    name: 'Home Repairs',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    summary: 'Fix leaky taps, appliances, and electrical issues',
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    summary: 'Deep cleaning, moving out prep, and office refreshes',
  },
  {
    id: 'moving',
    name: 'Moving & Logistics',
    image: 'https://images.unsplash.com/photo-1541417904950-b855846fe074?auto=format&fit=crop&w=800&q=80',
    summary: 'Haulage trucks, movers, and item pickup/delivery',
  },
  {
    id: 'beauty',
    name: 'Beauty & Wellness',
    image: 'https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=800&q=80',
    summary: 'Hair, nails, spa-at-home, and personal care',
  },
];

const seedProviders: ServiceProvider[] = [
  {
    id: 'p1',
    name: 'Chidinma Okafor',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    jobsCompleted: 182,
    services: ['cleaning', 'repairs'],
    bio: 'Facility care specialist with a reliable crew for homes and offices.',
    location: 'Lekki Phase 1',
    responseTime: 'Responds in 15 mins',
    contact: { email: 'chidinma@cleanquick.ng', phone: '+234 801 222 3311' },
  },
  {
    id: 'p2',
    name: 'FixIt Brothers',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    rating: 4.7,
    jobsCompleted: 96,
    services: ['repairs'],
    bio: 'Electrical and appliance repair team with 24/7 emergency cover.',
    location: 'Victoria Island',
    responseTime: 'Responds in 30 mins',
    contact: { email: 'support@fixitbrothers.ng', phone: '+234 813 445 0909' },
  },
  {
    id: 'p3',
    name: 'MoveFast Logistics',
    avatar: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    jobsCompleted: 141,
    services: ['moving'],
    bio: 'Mini trucks, dispatch bikes, and dedicated movers across Lagos.',
    location: 'Ikeja',
    responseTime: 'Responds in 20 mins',
    contact: { email: 'ops@movefast.ng', phone: '+234 814 880 4433' },
  },
  {
    id: 'p4',
    name: 'Glow & Go',
    avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80',
    rating: 4.6,
    jobsCompleted: 72,
    services: ['beauty'],
    bio: 'On-demand beauty pros for braids, nails, spa, and make-up.',
    location: 'Yaba',
    responseTime: 'Responds in 45 mins',
    contact: { email: 'bookings@glowgo.ng', phone: '+234 810 661 5522' },
  },
];

const seedRequests: ServiceRequest[] = [
  {
    id: 'req1',
    type: 'public',
    categoryId: 'moving',
    title: 'Move 2-bedroom items to new flat',
    description: 'Need two movers and a mini truck to move furniture from Ikoyi to Lekki on Saturday.',
    location: 'Ikoyi ➝ Lekki',
    priceOffer: 55000,
    status: 'AwaitingApproval',
    requesterName: 'Adaeze U.',
    requesterContact: { email: 'adaeze@example.com', phone: '+234 808 111 2211' },
    offers: [
      {
        id: 'offer-1',
        providerId: 'p3',
        message: 'We have a covered mini truck and 3-man crew available by 9am.',
        price: 65000,
        status: 'pending',
        createdAt: now(),
      },
      {
        id: 'offer-2',
        providerId: 'p1',
        message: 'Can support with loading/unloading, truck can be arranged.',
        price: 52000,
        status: 'pending',
        createdAt: now(),
      },
    ],
    assignedProviderId: undefined,
    timeline: [
      { status: 'Open', timestamp: now(), note: 'Request posted to community' },
      { status: 'AwaitingApproval', timestamp: now(), note: 'Collecting offers from helpers' },
    ],
    contactReleased: false,
  },
  {
    id: 'req2',
    type: 'public',
    categoryId: 'repairs',
    title: 'Fix water heater and kitchen socket',
    description: 'Apartment in Lekki with tripped breaker when heater is on. Need quick diagnosis.',
    location: 'Lekki Phase 1',
    priceOffer: 20000,
    status: 'Accepted',
    requesterName: 'Tosin K.',
    requesterContact: { email: 'tosin@example.com', phone: '+234 809 555 7722' },
    assignedProviderId: 'p2',
    offers: [
      {
        id: 'offer-3',
        providerId: 'p2',
        message: 'Certified electrician, can come with parts for heater.',
        price: 25000,
        status: 'accepted',
        createdAt: now(),
      },
    ],
    timeline: [
      { status: 'Open', timestamp: now(), note: 'Request posted to community' },
      { status: 'AwaitingApproval', timestamp: now(), note: 'Provider offer submitted' },
      { status: 'Accepted', timestamp: now(), note: 'FixIt Brothers selected' },
      { status: 'InProgress', timestamp: now(), note: 'Provider on-site' },
    ],
    contactReleased: true,
  },
  {
    id: 'req-private',
    type: 'private',
    categoryId: 'cleaning',
    title: 'Quarterly office deep clean',
    description: 'Send discreet cleaning team on Friday night. Admin will assign provider.',
    location: 'Victoria Island',
    priceOffer: 80000,
    status: 'Open',
    requesterName: 'Exec Suite Admin',
    requesterContact: { email: 'ops@execsuite.ng', phone: '+234 802 222 8765' },
    assignedProviderId: undefined,
    offers: [],
    timeline: [{ status: 'Open', timestamp: now(), note: 'Visible only to admins' }],
    contactReleased: false,
  },
  {
    id: 'req-direct',
    type: 'direct',
    categoryId: 'beauty',
    title: 'Home spa session for 2',
    description: 'Looking to book Glow & Go on Sunday afternoon.',
    location: 'Magodo',
    priceOffer: 40000,
    status: 'AwaitingApproval',
    requesterName: 'Ireti A.',
    requesterContact: { email: 'ireti@example.com', phone: '+234 810 000 5566' },
    assignedProviderId: 'p4',
    directProviderId: 'p4',
    offers: [
      {
        id: 'offer-4',
        providerId: 'p4',
        message: 'We can bring full spa kit and two therapists.',
        price: 42000,
        status: 'pending',
        createdAt: now(),
      },
    ],
    timeline: [
      { status: 'AwaitingApproval', timestamp: now(), note: 'Waiting for provider to accept the booking' },
    ],
    contactReleased: false,
  },
];

const addTimeline = (request: ServiceRequest, status: ServiceStatus, note?: string): ServiceRequest => ({
  ...request,
  status,
  timeline: [...request.timeline, { status, timestamp: now(), note }],
});

export const useServicesStore = create<ServicesState>((set, get) => ({
  categories: seedCategories,
  providers: seedProviders,
  requests: seedRequests,
  notifications: [],
  createCategory: (payload) =>
    set((state) => ({
      categories: [
        ...state.categories,
        {
          id: payload.name.toLowerCase().replace(/\s+/g, '-'),
          image:
            payload.image ||
            'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80',
          name: payload.name,
          summary: payload.summary,
        },
      ],
    })),
  updateCategory: (categoryId, updates) =>
    set((state) => ({
      categories: state.categories.map((category) => (category.id === categoryId ? { ...category, ...updates } : category)),
    })),
  deleteCategory: (categoryId) =>
    set((state) => ({
      categories: state.categories.filter((category) => category.id !== categoryId),
      providers: state.providers.map((provider) => ({
        ...provider,
        services: provider.services.filter((service) => service !== categoryId),
      })),
    })),
  assignProviderToCategory: ({ providerId, categoryId }) =>
    set((state) => ({
      providers: state.providers.map((provider) =>
        provider.id === providerId
          ? { ...provider, services: Array.from(new Set([...provider.services, categoryId])) }
          : provider,
      ),
    })),
  removeProviderFromCategory: ({ providerId, categoryId }) =>
    set((state) => ({
      providers: state.providers.map((provider) =>
        provider.id === providerId
          ? { ...provider, services: provider.services.filter((service) => service !== categoryId) }
          : provider,
      ),
    })),
  createPublicRequest: (payload) =>
    set((state) => ({
      requests: [
        ...state.requests,
        {
          ...payload,
          id: `req-${state.requests.length + 1}`,
          type: 'public',
          status: 'Open',
          offers: [],
          timeline: [{ status: 'Open', timestamp: now(), note: 'Request posted' }],
          contactReleased: false,
        },
      ],
      notifications: [
        ...state.notifications,
        {
          id: `note-${state.notifications.length + 1}`,
          audience: 'provider',
          message: `${payload.title} is now open for offers`,
          timestamp: now(),
          relatedRequestId: `req-${state.requests.length + 1}`,
        },
      ],
    })),
  createPrivateRequest: (payload) =>
    set((state) => ({
      requests: [
        ...state.requests,
        {
          ...payload,
          id: `req-${state.requests.length + 1}`,
          type: 'private',
          status: 'Open',
          offers: [],
          timeline: [{ status: 'Open', timestamp: now(), note: 'Admin notified about new request' }],
          contactReleased: false,
        },
      ],
      notifications: [
        ...state.notifications,
        {
          id: `note-${state.notifications.length + 1}`,
          audience: 'admin',
          message: `${payload.title} requires an assignment`,
          timestamp: now(),
          relatedRequestId: `req-${state.requests.length + 1}`,
        },
      ],
    })),
  createDirectRequest: (payload) =>
    set((state) => ({
      requests: [
        ...state.requests,
        {
          ...payload,
          id: `req-${state.requests.length + 1}`,
          type: 'direct',
          status: 'AwaitingApproval',
          offers: [],
          timeline: [{ status: 'AwaitingApproval', timestamp: now(), note: 'Awaiting provider response' }],
          contactReleased: false,
        },
      ],
      notifications: [
        ...state.notifications,
        {
          id: `note-${state.notifications.length + 1}`,
          audience: 'provider',
          message: `Direct request sent to provider`,
          timestamp: now(),
          relatedRequestId: `req-${state.requests.length + 1}`,
        },
      ],
    })),
  submitOffer: ({ requestId, providerId, message, price }) =>
    set((state) => ({
      requests: state.requests.map((req) =>
        req.id === requestId
          ? {
              ...req,
              offers: [
                ...req.offers,
                { id: `offer-${req.offers.length + 1}`, providerId, message, price, status: 'pending', createdAt: now() },
              ],
            }
          : req,
      ),
      notifications: [
        ...state.notifications,
        {
          id: `note-${state.notifications.length + 1}`,
          audience: 'requester',
          message: `${get().providers.find((p) => p.id === providerId)?.name || 'A provider'} sent an offer`,
          timestamp: now(),
          relatedRequestId: requestId,
        },
      ],
    })),
  respondToOffer: ({ requestId, offerId, decision }) =>
    set((state) => {
      const requests = state.requests.map((req) => {
        if (req.id !== requestId) return req;
        const offers: ServiceOffer[] = req.offers.map((offer) => ({
          ...offer,
          status: offer.id === offerId ? (decision === 'accept' ? 'accepted' : 'rejected') : offer.status,
        }));
        const acceptedOffer = offers.find((o) => o.id === offerId && decision === 'accept');
        const updated = acceptedOffer
          ? addTimeline(
              {
                ...req,
                offers: offers.map((offer) =>
                  offer.id !== offerId && decision === 'accept' ? { ...offer, status: 'rejected' } : offer,
                ),
                assignedProviderId: acceptedOffer.providerId,
                contactReleased: true,
              },
              'Accepted',
              'Requester selected a helper',
            )
          : req;
        return decision === 'accept' ? updated : { ...req, offers };
      });
      const accepted = state.requests.find((r) => r.id === requestId)?.offers.find((o) => o.id === offerId)?.providerId;
      return {
        requests,
        notifications: [
          ...state.notifications,
          {
            id: `note-${state.notifications.length + 1}`,
            audience: 'provider',
            message: decision === 'accept' ? 'Your offer was accepted!' : 'Your offer was rejected',
            timestamp: now(),
            relatedRequestId: requestId,
          },
          accepted
            ? {
                id: `note-${state.notifications.length + 2}`,
                audience: 'requester',
                message: 'Contact details shared with your selected helper',
                timestamp: now(),
                relatedRequestId: requestId,
              }
            : undefined,
        ].filter(Boolean) as ServiceNotification[],
      };
    }),
  updateStatus: (requestId, status, note) =>
    set((state) => ({
      requests: state.requests.map((req) => (req.id === requestId ? addTimeline(req, status, note) : req)),
      notifications: [
        ...state.notifications,
        {
          id: `note-${state.notifications.length + 1}`,
          audience: 'requester',
          message: `${status} update shared`,
          timestamp: now(),
          relatedRequestId: requestId,
        },
      ],
    })),
  assignProvider: ({ requestId, providerId, note }) =>
    set((state) => ({
      requests: state.requests.map((req) => {
        if (req.id !== requestId) return req;
        const withTimeline = addTimeline(
          {
            ...req,
            assignedProviderId: providerId,
            offers: [
              ...req.offers,
              {
                id: `offer-${req.offers.length + 1}`,
                providerId,
                message: 'Admin assigned you to this request',
                price: req.priceOffer || 0,
                status: 'pending',
                createdAt: now(),
              },
            ],
          },
          'AwaitingApproval',
          note || 'Waiting for provider confirmation',
        );
        return withTimeline;
      }),
      notifications: [
        ...state.notifications,
        {
          id: `note-${state.notifications.length + 1}`,
          audience: 'provider',
          message: 'An admin assigned you to a private request',
          timestamp: now(),
          relatedRequestId: requestId,
        },
      ],
    })),
}));
