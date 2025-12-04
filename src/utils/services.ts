import { palette } from '../theme/colors';
import { ServiceStatus } from '../types/services';

export const serviceStatusCopy: Record<ServiceStatus, { label: string; helper: string }> = {
  Open: { label: 'Open', helper: 'Visible to providers and awaiting offers' },
  AwaitingApproval: { label: 'Awaiting Approval', helper: 'Waiting for provider confirmation or admin assignment' },
  Accepted: { label: 'Accepted', helper: 'A helper has been chosen' },
  InProgress: { label: 'In Progress', helper: 'Work has started' },
  Completed: { label: 'Completed', helper: 'Request delivered successfully' },
  Cancelled: { label: 'Cancelled', helper: 'Request closed' },
};

export const serviceStatusColors: Record<
  ServiceStatus,
  { background: string; text: string; border: string }
> = {
  Open: { background: '#EEF2FF', text: palette.primary, border: '#C7D2FE' },
  AwaitingApproval: { background: '#FFF7E6', text: palette.accent, border: '#FFE4B5' },
  Accepted: { background: '#E0F7EF', text: palette.secondary, border: '#C3EEDC' },
  InProgress: { background: '#E6F2FF', text: palette.primary, border: '#C8DFFF' },
  Completed: { background: '#E7F4EF', text: palette.secondary, border: '#C6E6D6' },
  Cancelled: { background: '#FDECEC', text: palette.danger, border: '#FAC7C7' },
};

export const getServiceStatusMeta = (status: ServiceStatus) => ({
  ...serviceStatusCopy[status],
  ...serviceStatusColors[status],
});

export const formatCurrency = (value?: number) => {
  if (value === undefined || value === null) return '—';
  return `₦${value.toLocaleString(undefined, { minimumFractionDigits: 0 })}`;
};

export const formatServiceDate = (iso?: string) => {
  if (!iso) return 'Just now';
  const date = new Date(iso);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};
