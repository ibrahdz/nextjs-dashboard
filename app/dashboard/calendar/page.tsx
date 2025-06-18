'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

type Event = {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
};

export default function CalendarPage() {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!session?.accessToken) return;

      setLoading(true);
      const res = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );
      const data = await res.json();
      setEvents(data.items || []);
      setLoading(false);
    };

    fetchEvents();
  }, [session]);

  if (status === 'loading') return <p>Loading session...</p>;
  if (status === 'unauthenticated') return <p>You must be signed in.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Google Calendar Events</h1>
      {loading ? (
        <p>Loading events...</p>
      ) : events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul className="space-y-2">
          {events.map((event) => (
            <li key={event.id} className="p-2 border rounded">
              <strong>{event.summary || '(No title)'}</strong>
              <br />
              {event.start?.dateTime || event.start?.date}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
