export type ServiceStatus = 'Open' | 'AwaitingApproval' | 'Accepted' | 'InProgress' | 'Completed' | 'Cancelled';
export type ServiceRequestType = 'public' | 'private' | 'direct';
export type ServiceOfferStatus = 'pending' | 'accepted' | 'rejected';

export interface ServiceCategory {
  id: string;
  name: string;
  image: string;
  summary?: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  jobsCompleted: number;
  services: string[];
  bio: string;
  location: string;
  responseTime: string;
  contact: { email: string; phone: string };
}

export interface ServiceOffer {
  id: string;
  providerId: string;
  message: string;
  price: number;
  status: ServiceOfferStatus;
  createdAt: string;
}

export interface ServiceTimelineEntry {
  status: ServiceStatus;
  timestamp: string;
  note?: string;
}

export interface ServiceRequest {
  id: string;
  type: ServiceRequestType;
  categoryId: string;
  title: string;
  description: string;
  location: string;
  priceOffer?: number;
  status: ServiceStatus;
  offers: ServiceOffer[];
  assignedProviderId?: string;
  requesterName: string;
  requesterContact: { email: string; phone: string };
  timeline: ServiceTimelineEntry[];
  contactReleased?: boolean;
  directProviderId?: string;
}

export interface ServiceNotification {
  id: string;
  message: string;
  timestamp: string;
  audience: 'requester' | 'provider' | 'admin';
  relatedRequestId?: string;
}
