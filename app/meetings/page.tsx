import { headers } from "next/headers";
import MeetingCard from "@/components/meetingCard";
import type { SacramentMeeting } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getMeetings(): Promise<SacramentMeeting[]> {
  const headerList = await headers();

  const host = headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "http";

  if (!host) {
    return [];
  }

  const response = await fetch(
    `${protocol}://${host}/api/meetings`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch meetings.");
  }

  return response.json();
}

export default async function MeetingsPage() {
  const meetings = await getMeetings();

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
            <MeetingCard key={meeting.id} meeting={meeting} />
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