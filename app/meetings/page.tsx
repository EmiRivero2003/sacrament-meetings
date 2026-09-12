"use client";

import { useEffect, useState } from "react";
import MeetingCard from "@/components/meetingCard";
import type { SacramentMeeting } from "@/lib/types";

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<SacramentMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadMeetings() {
      try {
        const response = await fetch("/api/meetings");

        if (!response.ok) {
          throw new Error("Failed to fetch meetings.");
        }

        const data: SacramentMeeting[] = await response.json();
        setMeetings(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadMeetings();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-slate-600">Loading meetings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-red-600">
          Unable to load meetings.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Sacrament Meetings
        </h1>

        <p className="mt-2 text-slate-600">
          View current and previous meeting programs.
        </p>
      </div>

      {meetings.length > 0 ? (
        <div className="space-y-5">
          {meetings.map((meeting) => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
            />
          ))}
        </div>
      ) : (
        <p className="text-slate-600">
          No meetings are currently available.
        </p>
      )}
    </div>
  );
}