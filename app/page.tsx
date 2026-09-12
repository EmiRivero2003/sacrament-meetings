import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <section className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-500">
            Riverside Ward
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Sacrament Meeting Planner
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Plan, review, and access current and previous sacrament
            meeting programs in one place.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/meetings/current"
              className="rounded-md bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700"
            >
              Current Meeting
            </Link>

            <Link
              href="/meetings"
              className="rounded-md border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              View All Meetings
            </Link>
          </div>
        </div>

        <div className="flex justify-center">
          <Image
            src="/meeting.svg"
            alt="Illustration of a church meeting house"
            width={500}
            height={350}
            priority
            className="h-auto w-full max-w-md"
          />
        </div>
      </section>
    </div>
  );
}

