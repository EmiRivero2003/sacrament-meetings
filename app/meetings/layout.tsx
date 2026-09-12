import Link from "next/link";

export default function MeetingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="border-b border-slate-200 bg-white">
        <nav
          aria-label="Meeting navigation"
          className="mx-auto flex max-w-5xl gap-4 px-6 py-4"
        >
          <Link
            href="/meetings"
            className="font-medium text-slate-700 hover:text-slate-950"
          >
            All Meetings
          </Link>

          <Link
            href="/meetings/current"
            className="font-medium text-slate-700 hover:text-slate-950"
          >
            Current Meeting
          </Link>
        </nav>
      </div>

      {children}
    </div>
  );
}