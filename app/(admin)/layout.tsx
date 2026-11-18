
import type { ReactNode } from "react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <h2 className="text-xl font-bold text-slate-900">
            Meeting Administration
          </h2>

          <Link
            href="/meetings"
            className="text-sm font-medium text-blue-700 hover:underline"
          >
            Public Meetings
          </Link>
        </div>
      </header>

      {children}
    </div>
  );
}
