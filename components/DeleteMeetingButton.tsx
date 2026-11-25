
"use client";

import { useState, useTransition } from "react";
import { deleteMeeting } from "@/lib/actions";

interface DeleteMeetingButtonProps {
  id: number;
}

export default function DeleteMeetingButton({
  id,
}: DeleteMeetingButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    setError(null);

    startTransition(async () => {
      try {
        await deleteMeeting(id);
      } catch (error) {
        console.error("Delete failed:", error);
        setError("Unable to delete the meeting. Please try again.");
        setShowConfirm(false);
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        disabled={isPending}
        className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
      >
        Delete
      </button>

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}

      {showConfirm && (
        <div
          role="presentation"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            aria-describedby="delete-description"
            className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-xl"
          >
            <h2
              id="delete-title"
              className="text-xl font-bold text-white"
            >
              Delete Meeting?
            </h2>

            <p
              id="delete-description"
              className="mt-3 text-slate-300"
            >
              Are you sure you want to delete this meeting?
              This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                className="rounded-lg border border-slate-600 px-4 py-2 text-white hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {isPending ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
