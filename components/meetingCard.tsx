
import Link from "next/link";
import type { SacramentMeeting } from "@/lib/types";
import DeleteMeetingButton from "@/components/DeleteMeetingButton";

interface MeetingCardProps {
  meeting: SacramentMeeting;
}

export default function MeetingCard({
  meeting,
}: MeetingCardProps) {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${meeting.date}T00:00:00Z`));

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            {meeting.meetingType} meeting
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            {formattedDate}
          </h2>

          <div className="mt-3 space-y-1 text-sm text-slate-600">
            <p>
              <strong>Presiding:</strong> {meeting.presiding}
            </p>

            <p>
              <strong>Conducting:</strong> {meeting.conducting}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/meetings/${meeting.id}`}
            className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            View Program
          </Link>

          <Link
            href={`/meetings/${meeting.id}/edit`}
            className="inline-flex rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
          >
            Edit
          </Link>

          <DeleteMeetingButton id={meeting.id} />
        </div>
      </div>
    </article>
  );
}
