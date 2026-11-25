
"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  useEffect(() => {
    console.error("Meetings route error:", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-6 py-12">
      <section
        role="alert"
        aria-labelledby="error-title"
        className="w-full rounded-xl border border-red-800/50 bg-slate-900 p-8 text-center shadow-lg"
      >
        <h1
          id="error-title"
          className="text-3xl font-bold text-white"
        >
          Something Went Wrong!
        </h1>

        <p className="mt-4 text-slate-300">
          An unexpected error occurred while loading
          the meeting information.
        </p>

        <p className="mt-2 text-sm text-slate-400">
          Please try again or return to the meetings list.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
          >
            Try Again
          </button>

          <Link
            href="/meetings"
            className="rounded-lg border border-slate-600 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
          >
            Back to Meetings
          </Link>
        </div>
      </section>
    </main>
  );
}
