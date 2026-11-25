
import { neon } from "@neondatabase/serverless";
import type { SacramentMeeting } from "./types";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is missing");
}

const sql = neon(databaseUrl);

const ITEMS_PER_PAGE = 5;

export type MeetingInput = Omit<SacramentMeeting, "id">;

// ============================================
// READ: Get all meetings
// ============================================

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
      ORDER BY date DESC, id DESC
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
    ORDER BY date DESC, id DESC
  `;

  return rows as unknown as SacramentMeeting[];
}

// ============================================
// READ: Get a meeting by ID
// ============================================

export async function getMeetingById(
  id: number,
): Promise<SacramentMeeting | null> {
  if (!Number.isSafeInteger(id) || id <= 0) {
    return null;
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
    WHERE id = ${id}
  `;

  return (rows[0] as unknown as SacramentMeeting) ?? null;
}

// ============================================
// READ: Search and paginate meetings
// ============================================

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
    ORDER BY date DESC, id DESC
    LIMIT ${ITEMS_PER_PAGE}
    OFFSET ${offset}
  `;

  return rows as unknown as SacramentMeeting[];
}

// ============================================
// READ: Count search result pages
// ============================================

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

// ============================================
// CREATE: Insert a meeting
// ============================================

export async function createMeetingRecord(
  meeting: MeetingInput,
): Promise<number> {
  const announcements = JSON.stringify(
    meeting.announcements ?? [],
  );

  const openingHymn = JSON.stringify(meeting.openingHymn);
  const wardBusiness = JSON.stringify(
    meeting.wardBusiness ?? [],
  );
  const sacramentHymn = JSON.stringify(
    meeting.sacramentHymn,
  );
  const speakers = JSON.stringify(meeting.speakers ?? []);
  const closingHymn = JSON.stringify(meeting.closingHymn);

  const rows = await sql`
    INSERT INTO meetings (
      date,
      meeting_type,
      presiding,
      conducting,
      announcements,
      opening_hymn,
      opening_prayer,
      ward_business,
      stake_business,
      sacrament_hymn,
      speakers,
      closing_hymn,
      closing_prayer
    )
    VALUES (
      ${meeting.date},
      ${meeting.meetingType},
      ${meeting.presiding},
      ${meeting.conducting},
      ARRAY(
        SELECT jsonb_array_elements_text(
          ${announcements}::jsonb
        )
      ),
      ${openingHymn}::jsonb,
      ${meeting.openingPrayer},
      ${wardBusiness}::jsonb,
      ${meeting.stakeBusiness},
      ${sacramentHymn}::jsonb,
      ${speakers}::jsonb,
      ${closingHymn}::jsonb,
      ${meeting.closingPrayer}
    )
    RETURNING id
  `;

  if (rows.length === 0) {
    throw new Error("Failed to create meeting.");
  }

  return Number(rows[0].id);
}

// ============================================
// UPDATE: Modify an existing meeting
// ============================================

export async function updateMeetingRecord(
  id: number,
  meeting: MeetingInput,
): Promise<boolean> {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("Invalid meeting ID.");
  }

  const announcements = JSON.stringify(
    meeting.announcements ?? [],
  );

  const openingHymn = JSON.stringify(meeting.openingHymn);
  const wardBusiness = JSON.stringify(
    meeting.wardBusiness ?? [],
  );
  const sacramentHymn = JSON.stringify(
    meeting.sacramentHymn,
  );
  const speakers = JSON.stringify(meeting.speakers ?? []);
  const closingHymn = JSON.stringify(meeting.closingHymn);

  const rows = await sql`
    UPDATE meetings
    SET
      date = ${meeting.date},
      meeting_type = ${meeting.meetingType},
      presiding = ${meeting.presiding},
      conducting = ${meeting.conducting},
      announcements = ARRAY(
        SELECT jsonb_array_elements_text(
          ${announcements}::jsonb
        )
      ),
      opening_hymn = ${openingHymn}::jsonb,
      opening_prayer = ${meeting.openingPrayer},
      ward_business = ${wardBusiness}::jsonb,
      stake_business = ${meeting.stakeBusiness},
      sacrament_hymn = ${sacramentHymn}::jsonb,
      speakers = ${speakers}::jsonb,
      closing_hymn = ${closingHymn}::jsonb,
      closing_prayer = ${meeting.closingPrayer}
    WHERE id = ${id}
    RETURNING id
  `;

  return rows.length > 0;
}

// ============================================
// DELETE: Remove a meeting
// ============================================

export async function deleteMeetingRecord(
  id: number,
): Promise<boolean> {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("Invalid meeting ID.");
  }

  const rows = await sql`
    DELETE FROM meetings
    WHERE id = ${id}
    RETURNING id
  `;

  return rows.length > 0;
}
