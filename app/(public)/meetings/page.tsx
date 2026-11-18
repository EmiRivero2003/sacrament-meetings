
import Link from "next/link";
import MeetingCard from "@/components/meetingCard";
import {
  getFilteredMeetings,
  getMeetingsTotalPages,
} from "@/lib/meetings-db";

export const dynamic = "force-dynamic";

interface MeetingsPageProps {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}

export default async function MeetingsPage({
  searchParams,
}: MeetingsPageProps) {
  const params = await searchParams;

  const query =
    typeof params.query === "string"
      ? params.query.trim().slice(0, 100)
      : "";

  const requestedPage = Number(params.page ?? "1");

  const currentPage =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const [meetings, totalPages] = await Promise.all([
    getFilteredMeetings(query, currentPage),
    getMeetingsTotalPages(query),
  ]);

  function createPageURL(page: number) {
    const params = new URLSearchParams();

    if (query) {
      params.set("query", query);
    }

    params.set("page", String(page));

    return `/meetings?${params.toString()}`;
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Sacrament Meetings
        </h1>

        <p className="mt-2 text-slate-300">
          Search and browse sacrament meeting programs.
        </p>
      </div>

      <form
        action="/meetings"
        method="GET"
        className="mb-8 flex flex-col gap-3 sm:flex-row"
      >
        <input
          type="search"
          name="query"
          defaultValue={query}
          placeholder="Search by speaker, leader, or meeting type..."
          maxLength={100}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900"
        />

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
        >
          Search
        </button>
      </form>

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
        <p className="text-slate-300">
          No meetings found.
        </p>
      )}

      {totalPages > 1 && (
        <nav
          aria-label="Meeting pagination"
          className="mt-10 flex items-center justify-center gap-4"
        >
          {currentPage > 1 ? (
            <Link
              href={createPageURL(currentPage - 1)}
              className="rounded-lg border border-slate-500 px-4 py-2 text-white hover:bg-slate-800"
            >
              Previous
            </Link>
          ) : (
            <span className="rounded-lg border border-slate-700 px-4 py-2 text-slate-500">
              Previous
            </span>
          )}

          <span className="text-slate-200">
            Page {currentPage} of {totalPages}
          </span>

          {currentPage < totalPages ? (
            <Link
              href={createPageURL(currentPage + 1)}
              className="rounded-lg border border-slate-500 px-4 py-2 text-white hover:bg-slate-800"
            >
              Next
            </Link>
          ) : (
            <span className="rounded-lg border border-slate-700 px-4 py-2 text-slate-500">
              Next
            </span>
          )}
        </nav>
      )}
    </main>
  );
}
