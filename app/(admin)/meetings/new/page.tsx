
import Link from "next/link";
import MeetingForm from "@/components/MeetingForm";

export default function CreateMeetingPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <Link
        href="/meetings"
        className="text-blue-400 hover:underline"
      >
        ← Back to Meetings
      </Link>

      <h1 className="mb-8 mt-6 text-3xl font-bold text-white">
        Create New Meeting
      </h1>

      <MeetingForm />
    </main>
  );
}
