"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import MeetingDetail from "@/components/meetingDetail";
import type { SacramentMeeting } from "@/lib/types";

export default function MeetingPage() {
  const params = useParams();

  const rawId = params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const [meeting, setMeeting] =
    useState<SacramentMeeting | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }

    async function loadMeeting() {
      try {
        const response = await fetch(`/api/meetings/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch meeting.");
        }

        const data: SacramentMeeting = await response.json();
        setMeeting(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadMeeting();
  }, [id]);

  if (!id) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-2xl font-bold">
          Invalid meeting
        </h1>

        <Link
          href="/meetings"
          className="mt-4 inline-block font-medium text-slate-600 hover:text-slate-950"
        >
          ← Back to meetings
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-slate-600">
          Loading meeting...
        </p>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-2xl font-bold">
          Meeting not found
        </h1>

        <Link
          href="/meetings"
          className="mt-4 inline-block font-medium text-slate-600 hover:text-slate-950"
        >
          ← Back to meetings
        </Link>
      </div>
    );
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