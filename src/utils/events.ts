import * as Notifications from 'expo-notifications';
import { Linking, Platform } from 'react-native';
import { Event } from '../types/events';

export const formatEventDateTime = (startsAt: string, endsAt: string) => {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  const sameDay = start.toDateString() === end.toDateString();
  const dateLabel = start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const timeLabel = `${start.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })} - ${end.toLocaleTimeString(
    undefined,
    { hour: 'numeric', minute: '2-digit' },
  )}`;
  return sameDay ? `${dateLabel} · ${timeLabel}` : `${dateLabel} - ${end.toLocaleDateString()} · ${timeLabel}`;
};

export const scheduleEventReminders = async (event: Event) => {
  const startTime = new Date(event.startsAt).getTime();
  const now = Date.now();
  const leadTimes = [60, 1440]; // minutes before start

  const notifications = leadTimes
    .map((minutes) => startTime - minutes * 60 * 1000)
    .filter((timestamp) => timestamp > now)
    .map((trigger) =>
      Notifications.scheduleNotificationAsync({
        content: {
          title: `Upcoming: ${event.title}`,
          body: `Starting at ${new Date(event.startsAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`,
        },
        trigger: new Date(trigger),
      }),
    );

  await Promise.all(notifications);
};

export const cancelEventReminders = async (event: Event) => {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const matchingIds = scheduled
    .filter((notification) => notification.content.title?.includes(event.title))
    .map((notification) => notification.identifier);

  await Promise.all(matchingIds.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
};

export const openCalendarSync = async (event: Event) => {
  const start = new Date(event.startsAt).toISOString().replace(/[-:]|\.\d{3}/g, '');
  const end = new Date(event.endsAt).toISOString().replace(/[-:]|\.\d{3}/g, '');
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    event.title,
  )}&dates=${start}%2F${end}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;

  if (Platform.OS === 'ios') {
    const appleUrl = `webcal://add?text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent(
      event.description,
    )}&location=${encodeURIComponent(event.location)}`;
    const canOpen = await Linking.canOpenURL(appleUrl);
    if (canOpen) {
      await Linking.openURL(appleUrl);
      return;
    }
  }

  await Linking.openURL(url);
};
