
"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  createMeeting,
  updateMeeting,
  type State,
} from "@/lib/actions";
import type { SacramentMeeting } from "@/lib/types";

interface MeetingFormProps {
  meeting?: SacramentMeeting;
}

const initialState: State = {
  message: null,
  errors: {},
};

const inputClass =
  "w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white focus-visible:outline-2 focus-visible:outline-blue-400";

type FieldProps = {
  name: string;
  label: string;
  defaultValue?: string | number;
  errors?: string[];
  type?: string;
  multiline?: boolean;
  help?: string;
};

function Field({
  name,
  label,
  defaultValue = "",
  errors,
  type = "text",
  multiline = false,
  help,
}: FieldProps) {
  const errorId = `${name}-error`;
  const helpId = `${name}-help`;
  const invalid = Boolean(errors?.length);

  const describedBy = [
    help ? helpId : "",
    errorId,
  ].filter(Boolean).join(" ");

  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block font-medium text-white"
      >
        {label}
      </label>

      {multiline ? (
        <textarea
          id={name}
          name={name}
          rows={4}
          defaultValue={defaultValue}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className={inputClass}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          defaultValue={defaultValue}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          min={type === "number" ? 1 : undefined}
          step={type === "number" ? 1 : undefined}
          className={inputClass}
        />
      )}

      {help && (
        <p
          id={helpId}
          className="mt-1 text-sm text-slate-400"
        >
          {help}
        </p>
      )}

      <div
        id={errorId}
        aria-live="polite"
        aria-atomic="true"
        className="mt-1"
      >
        {errors?.map((error, index) => (
          <p
            key={`${index}-${error}`}
            className="text-sm text-red-400"
          >
            {error}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function MeetingForm({
  meeting,
}: MeetingFormProps) {
  const action = meeting
    ? updateMeeting.bind(null, meeting.id)
    : createMeeting;

  const [state, formAction, isPending] = useActionState(
    action,
    initialState,
  );

  const errors = state.errors ?? {};

  const hymnSections = [
    {
      title: "Opening Hymn",
      prefix: "openingHymn",
      hymn: meeting?.openingHymn,
    },
    {
      title: "Sacrament Hymn",
      prefix: "sacramentHymn",
      hymn: meeting?.sacramentHymn,
    },
    {
      title: "Closing Hymn",
      prefix: "closingHymn",
      hymn: meeting?.closingHymn,
    },
  ];

  const speakerText = (meeting?.speakers ?? [])
    .map((speaker) =>
      `${speaker.name} | ${speaker.topic} | ${speaker.type}`,
    )
    .join("\n");

  const announcementsText =
    (meeting?.announcements ?? []).join("\n");

  const wardBusinessText =
    (meeting?.wardBusiness ?? [])
      .map((item) => item.description)
      .join("\n");

  return (
    <form
      action={formAction}
      noValidate
      className="space-y-7 rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-lg md:p-8"
    >
      <Field
        name="date"
        label="Meeting Date"
        type="date"
        defaultValue={meeting?.date}
        errors={errors.date}
      />

      <div>
        <label
          htmlFor="meetingType"
          className="mb-2 block font-medium text-white"
        >
          Meeting Type
        </label>

        <select
          id="meetingType"
          name="meetingType"
          defaultValue={meeting?.meetingType ?? "regular"}
          aria-describedby="meetingType-error"
          aria-invalid={Boolean(errors.meetingType?.length)}
          className={inputClass}
        >
          <option value="regular">Regular</option>
          <option value="testimony">Fast and Testimony</option>
          <option value="stake">Stake Conference</option>
          <option value="general">General Conference</option>
          <option value="special">Special Meeting</option>
        </select>

        <div
          id="meetingType-error"
          aria-live="polite"
          aria-atomic="true"
        >
          {errors.meetingType?.map((error, index) => (
            <p key={index} className="text-sm text-red-400">
              {error}
            </p>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Field
          name="presiding"
          label="Presiding"
          defaultValue={meeting?.presiding}
          errors={errors.presiding}
        />

        <Field
          name="conducting"
          label="Conducting"
          defaultValue={meeting?.conducting}
          errors={errors.conducting}
        />
      </div>

      <Field
        name="announcements"
        label="Announcements"
        defaultValue={announcementsText}
        errors={errors.announcements}
        multiline
        help="Enter one announcement per line."
      />

      {hymnSections.map((section) => (
        <fieldset
          key={section.prefix}
          className="rounded-lg border border-slate-700 p-5"
        >
          <legend className="px-2 text-xl font-semibold text-white">
            {section.title}
          </legend>

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              name={`${section.prefix}Number`}
              label="Hymn Number"
              type="number"
              defaultValue={section.hymn?.number}
              errors={errors[`${section.prefix}.number`]}
            />

            <Field
              name={`${section.prefix}Title`}
              label="Hymn Title"
              defaultValue={section.hymn?.title}
              errors={errors[`${section.prefix}.title`]}
            />
          </div>
        </fieldset>
      ))}

      <Field
        name="openingPrayer"
        label="Opening Prayer"
        defaultValue={meeting?.openingPrayer}
        errors={errors.openingPrayer}
      />

      <Field
        name="wardBusiness"
        label="Ward Business"
        defaultValue={wardBusinessText}
        errors={errors.wardBusiness}
        multiline
        help="Enter one ward business item per line."
      />

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="stakeBusiness"
          name="stakeBusiness"
          defaultChecked={meeting?.stakeBusiness ?? false}
          className="h-5 w-5 accent-blue-600"
        />
        <label htmlFor="stakeBusiness" className="text-white">
          Include Stake Business
        </label>
      </div>

      <Field
        name="speakers"
        label="Speakers and Musical Numbers"
        defaultValue={speakerText}
        errors={[
          ...(errors.speakers ?? []),
          ...Object.entries(errors)
            .filter(([key]) => key.startsWith("speakers."))
            .flatMap(([, messages]) => messages),
        ]}
        multiline
        help="One per line: Name | Topic | speaker or Name | Title | musical-number"
      />

      <Field
        name="closingPrayer"
        label="Closing Prayer"
        defaultValue={meeting?.closingPrayer}
        errors={errors.closingPrayer}
      />

      <div aria-live="polite" aria-atomic="true">
        {state.message && (
          <p
            role="status"
            className="text-sm text-red-400"
          >
            {state.message}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending
            ? "Saving..."
            : meeting
              ? "Update Meeting"
              : "Create Meeting"}
        </button>

        <Link
          href="/meetings"
          className="rounded-lg border border-slate-600 px-6 py-3 text-white hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
