import type { SacramentMeeting } from "@/lib/types";

interface MeetingDetailProps {
  meeting: SacramentMeeting;
}

export default function MeetingDetail({
  meeting,
}: MeetingDetailProps) {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${meeting.date}T00:00:00Z`));

  return (
    <article className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-sm print:shadow-none">
      <header className="mb-8 border-b border-slate-200 pb-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
          {meeting.meetingType} meeting
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Sacrament Meeting
        </h1>

        <p className="mt-2 text-slate-600">{formattedDate}</p>
      </header>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-bold text-slate-900">
          Meeting Leadership
        </h2>

        <div className="space-y-2 text-slate-700">
          <p>
            <strong>Presiding:</strong> {meeting.presiding}
          </p>

          <p>
            <strong>Conducting:</strong> {meeting.conducting}
          </p>
        </div>
      </section>

      {meeting.announcements && meeting.announcements.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-xl font-bold text-slate-900">
            Announcements
          </h2>

          <ul className="list-disc space-y-1 pl-6 text-slate-700">
            {meeting.announcements.map((announcement) => (
              <li key={announcement}>{announcement}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-bold text-slate-900">
          Opening
        </h2>

        <div className="space-y-3 text-slate-700">
          <p>
            <strong>Opening Hymn:</strong>{" "}
            {meeting.openingHymn.number} –{" "}
            {meeting.openingHymn.title}
          </p>

          <p>
            <strong>Opening Prayer:</strong>{" "}
            {meeting.openingPrayer}
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-bold text-slate-900">
          Ward Business
        </h2>

        {meeting.wardBusiness.length > 0 ? (
          <ul className="list-disc space-y-1 pl-6 text-slate-700">
            {meeting.wardBusiness.map((item, index) => (
              <li key={`${item.description}-${index}`}>
                {item.description}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-600">No ward business.</p>
        )}

        <p className="mt-3 text-slate-700">
          <strong>Stake Business:</strong>{" "}
          {meeting.stakeBusiness ? "Yes" : "No"}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-bold text-slate-900">
          Sacrament
        </h2>

        <p className="text-slate-700">
          <strong>Sacrament Hymn:</strong>{" "}
          {meeting.sacramentHymn.number} –{" "}
          {meeting.sacramentHymn.title}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-bold text-slate-900">
          Program
        </h2>

        <div className="space-y-4">
          {meeting.speakers.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="rounded-lg bg-slate-50 p-4"
            >
              <p className="font-semibold text-slate-900">
                {item.type === "musical-number"
                  ? "Musical Number"
                  : "Speaker"}
              </p>

              <p className="text-slate-700">{item.name}</p>

              {item.topic && (
                <p className="text-sm text-slate-500">
                  {item.topic}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-slate-900">
          Closing
        </h2>

        <div className="space-y-3 text-slate-700">
          <p>
            <strong>Closing Hymn:</strong>{" "}
            {meeting.closingHymn.number} –{" "}
            {meeting.closingHymn.title}
          </p>

          <p>
            <strong>Closing Prayer:</strong>{" "}
            {meeting.closingPrayer}
          </p>
        </div>
      </section>
    </article>
  );
}