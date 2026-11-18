
import { neon } from "@neondatabase/serverless";
import type { SacramentMeeting } from "./types";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is missing");
}

const sql = neon(databaseUrl);

const ITEMS_PER_PAGE = 5;

// Preserve the existing date-filtering functionality.
export async function getMeetings(
  date?: string | null,
): Promise<SacramentMeeting[]> {
  if (date) {
    const rows = await sql`
      SELECT
        id,
        to_char(date, 'YYYY-MM-DD') AS "date",
        meeting_type AS "meetingType",
        presiding,
        conducting,
        announcements,
        opening_hymn AS "openingHymn",
        opening_prayer AS "openingPrayer",
        ward_business AS "wardBusiness",
        stake_business AS "stakeBusiness",
        sacrament_hymn AS "sacramentHymn",
        speakers,
        closing_hymn AS "closingHymn",
        closing_prayer AS "closingPrayer"
      FROM meetings
      WHERE to_char(date, 'YYYY-MM-DD') = ${date}
      ORDER BY date DESC
    `;

    return rows as unknown as SacramentMeeting[];
  }

  const rows = await sql`
    SELECT
      id,
      to_char(date, 'YYYY-MM-DD') AS "date",
      meeting_type AS "meetingType",
      presiding,
      conducting,
      announcements,
      opening_hymn AS "openingHymn",
      opening_prayer AS "openingPrayer",
      ward_business AS "wardBusiness",
      stake_business AS "stakeBusiness",
      sacrament_hymn AS "sacramentHymn",
      speakers,
      closing_hymn AS "closingHymn",
      closing_prayer AS "closingPrayer"
    FROM meetings
    ORDER BY date DESC
  `;

  return rows as unknown as SacramentMeeting[];
}

// Get one meeting by its ID.
export async function getMeetingById(
  id: number,
): Promise<SacramentMeeting | null> {
  const rows = await sql`
    SELECT
      id,
      to_char(date, 'YYYY-MM-DD') AS "date",
      meeting_type AS "meetingType",
      presiding,
      conducting,
      announcements,
      opening_hymn AS "openingHymn",
      opening_prayer AS "openingPrayer",
      ward_business AS "wardBusiness",
      stake_business AS "stakeBusiness",
      sacrament_hymn AS "sacramentHymn",
      speakers,
      closing_hymn AS "closingHymn",
      closing_prayer AS "closingPrayer"
    FROM meetings
    WHERE id = ${id}
  `;

  return (rows[0] as unknown as SacramentMeeting) ?? null;
}

// Search and paginate meetings.
export async function getFilteredMeetings(
  query: string = "",
  currentPage: number = 1,
): Promise<SacramentMeeting[]> {
  const safeQuery = query.trim().slice(0, 100);
  const searchTerm = `%${safeQuery}%`;

  const safePage =
    Number.isSafeInteger(currentPage) && currentPage > 0
      ? currentPage
      : 1;

  const offset = (safePage - 1) * ITEMS_PER_PAGE;

  const rows = await sql`
    SELECT
      id,
      to_char(date, 'YYYY-MM-DD') AS "date",
      meeting_type AS "meetingType",
      presiding,
      conducting,
      announcements,
      opening_hymn AS "openingHymn",
      opening_prayer AS "openingPrayer",
      ward_business AS "wardBusiness",
      stake_business AS "stakeBusiness",
      sacrament_hymn AS "sacramentHymn",
      speakers,
      closing_hymn AS "closingHymn",
      closing_prayer AS "closingPrayer"
    FROM meetings
    WHERE
      presiding ILIKE ${searchTerm}
      OR conducting ILIKE ${searchTerm}
      OR meeting_type ILIKE ${searchTerm}
      OR speakers::text ILIKE ${searchTerm}
    ORDER BY date DESC
    LIMIT ${ITEMS_PER_PAGE}
    OFFSET ${offset}
  `;

  return rows as unknown as SacramentMeeting[];
}

// Calculate the number of result pages.
export async function getMeetingsTotalPages(
  query: string = "",
): Promise<number> {
  const safeQuery = query.trim().slice(0, 100);
  const searchTerm = `%${safeQuery}%`;

  const rows = await sql`
    SELECT COUNT(*) AS total
    FROM meetings
    WHERE
      presiding ILIKE ${searchTerm}
      OR conducting ILIKE ${searchTerm}
      OR meeting_type ILIKE ${searchTerm}
      OR speakers::text ILIKE ${searchTerm}
  `;

  const total = Number(rows[0]?.total ?? 0);

  return Math.ceil(total / ITEMS_PER_PAGE);
}
