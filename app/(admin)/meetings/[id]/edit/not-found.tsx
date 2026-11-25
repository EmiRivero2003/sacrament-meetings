
import Link from "next/link";

export default function MeetingNotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-6 py-12">
      <section
        aria-labelledby="not-found-title"
        className="w-full rounded-xl border border-slate-700 bg-slate-900 p-8 text-center shadow-lg"
      >
        <h1
          id="not-found-title"
          className="text-3xl font-bold text-white"
        >
          Meeting Not Found
        </h1>

        <p className="mt-4 text-slate-300">
          The meeting you are looking for does not exist
          or may have been deleted.
        </p>

        <p className="mt-2 text-sm text-slate-400">
          Please check the meeting ID or return to
          the meetings list.
        </p>

        <div className="mt-8">
          <Link
            href="/meetings"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
          >
            Back to Meetings
          </Link>
        </div>
      </section>
    </main>
  );
}
