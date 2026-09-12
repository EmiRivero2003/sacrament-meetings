import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import MeetingDetail from "@/components/meetingDetail";
import type { SacramentMeeting } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getMeeting(
  id: string
): Promise<SacramentMeeting | null> {
  const headerList = await headers();

  const host = headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "http";

  if (!host) {
    return null;
  }

  const response = await fetch(
    `${protocol}://${host}/api/meetings/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const meeting = await getMeeting(id);

  if (!meeting) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6 print:hidden">
        <Link
          href="/meetings"
          className="font-medium text-slate-600 hover:text-slate-950"
        >
          ← Back to meetings
        </Link>
      </div>

      <MeetingDetail meeting={meeting} />

      <p className="mt-6 text-center text-sm text-slate-500 print:hidden">
        Use Ctrl + P to print this meeting program.
      </p>
    </div>
  );
}