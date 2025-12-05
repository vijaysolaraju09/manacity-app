import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';
import {
  createEventUpdate,
  fetchEventDetails,
  fetchEventUpdates,
  fetchEvents,
  fetchLeaderboard,
  registerForEvent,
  unregisterFromEvent,
} from '../api/events';
import { Event, EventFilters, EventUpdate, LeaderboardEntry } from '../types/events';
import { scheduleEventReminders, cancelEventReminders } from '../utils/events';

export const useEvents = (filters?: EventFilters) =>
  useQuery<Event[], Error>({
    queryKey: ['events', filters],
    queryFn: () => fetchEvents(filters),
  });

export const useEventDetails = (eventId?: string) =>
  useQuery<Event, Error>({
    queryKey: ['event', eventId],
    queryFn: () => fetchEventDetails(eventId as string),
    enabled: !!eventId,
  });

export const useEventUpdates = (eventId?: string, enabled = true) => {
  const lastUpdate = useRef<string | null>(null);
  const query = useQuery<EventUpdate[], Error>({
    queryKey: ['event-updates', eventId],
    queryFn: () => fetchEventUpdates(eventId as string),
    enabled: enabled && !!eventId,
    refetchInterval: enabled ? 1000 * 60 * 2 : undefined,
  });

  useEffect(() => {
    if (!query.data?.length) return;
    const newest = query.data[0]?.id;
    if (newest && newest !== lastUpdate.current) {
      Notifications.scheduleNotificationAsync({
        content: { title: 'Event update', body: query.data[0]?.title || 'New event update available' },
        trigger: null,
      });
    }
    lastUpdate.current = newest ?? null;
  }, [query.data]);

  return query;
};

export const useLeaderboard = (eventId?: string, enabled = true) =>
  useQuery<LeaderboardEntry[], Error>({
    queryKey: ['leaderboard', eventId],
    queryFn: () => fetchLeaderboard(eventId as string),
    enabled: enabled && !!eventId,
    refetchInterval: enabled ? 1000 * 30 : undefined,
  });

export const useEventRegistration = (eventId?: string) => {
  const queryClient = useQueryClient();

  const updateEventCaches = (updater: (event: Event) => Event) => {
    const listQueries = queryClient.getQueryCache().findAll({ queryKey: ['events'] });
    listQueries.forEach((query) => {
      const data = queryClient.getQueryData<Event[]>(query.queryKey);
      if (data) {
        queryClient.setQueryData<Event[]>(query.queryKey, data.map((ev) => (ev.id === eventId ? updater(ev) : ev)));
      }
    });

    const detail = queryClient.getQueryData<Event>(['event', eventId]);
    if (detail) {
      queryClient.setQueryData<Event>(['event', eventId], updater(detail));
    }
  };

  const register = useMutation({
    mutationFn: (remindersEnabled?: boolean) => registerForEvent(eventId as string, remindersEnabled),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['events'] });
      await queryClient.cancelQueries({ queryKey: ['event', eventId] });
      const previousLists = queryClient
        .getQueryCache()
        .findAll({ queryKey: ['events'] })
        .map((query) => ({ queryKey: query.queryKey, data: query.state.data as Event[] | undefined }));
      const previousDetail = queryClient.getQueryData<Event>(['event', eventId]);

      updateEventCaches((event) => ({ ...event, isRegistered: true }));

      return { previousLists, previousDetail };
    },
    onError: (_err, _vars, context) => {
      context?.previousLists?.forEach(({ queryKey, data }) => {
        if (data) queryClient.setQueryData(queryKey, data);
      });
      if (context?.previousDetail) {
        queryClient.setQueryData(['event', eventId], context.previousDetail);
      }
    },
    onSuccess: async (_, remindersEnabled = true) => {
      Toast.show({ type: 'success', text1: 'Registered', text2: 'You are confirmed for this event.' });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      const event = queryClient.getQueryData<Event>(['event', eventId]);
      if (event) {
        if (remindersEnabled) {
          await scheduleEventReminders(event);
        } else {
          await cancelEventReminders(event);
        }
      }
    },
  });

  const unregister = useMutation({
    mutationFn: () => unregisterFromEvent(eventId as string),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['events'] });
      await queryClient.cancelQueries({ queryKey: ['event', eventId] });
      const previousLists = queryClient
        .getQueryCache()
        .findAll({ queryKey: ['events'] })
        .map((query) => ({ queryKey: query.queryKey, data: query.state.data as Event[] | undefined }));
      const previousDetail = queryClient.getQueryData<Event>(['event', eventId]);

      updateEventCaches((event) => ({ ...event, isRegistered: false }));

      return { previousLists, previousDetail };
    },
    onError: (_err, _vars, context) => {
      context?.previousLists?.forEach(({ queryKey, data }) => {
        if (data) queryClient.setQueryData(queryKey, data);
      });
      if (context?.previousDetail) {
        queryClient.setQueryData(['event', eventId], context.previousDetail);
      }
    },
    onSuccess: async () => {
      Toast.show({ type: 'info', text1: 'Registration removed', text2: 'You will no longer receive updates.' });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      const event = queryClient.getQueryData<Event>(['event', eventId]);
      if (event) {
        await cancelEventReminders(event);
      }
    },
  });

  return { register, unregister };
};

export const useCreateEventUpdate = (eventId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Pick<EventUpdate, 'title' | 'body'>) => createEventUpdate(eventId as string, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-updates', eventId] });
      Toast.show({ type: 'success', text1: 'Update posted', text2: 'Participants will be notified.' });
    },
  });
};
