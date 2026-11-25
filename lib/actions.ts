
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";

import {
  createMeetingRecord,
  updateMeetingRecord,
  deleteMeetingRecord,
  type MeetingInput,
} from "@/lib/meetings-db";

// ============================================
// ACTION STATE
// ============================================

export type State = {
  message: string | null;
  errors?: Record<string, string[]>;
};

// ============================================
// VALIDATION SCHEMAS
// ============================================

const requiredText = z
  .string()
  .trim()
  .min(2, "This field must contain at least 2 characters.");

const HymnSchema = z.object({
  number: z.coerce
    .number<number>()
    .int("Hymn number must be a whole number.")
    .positive("Hymn number must be greater than zero."),
  title: z
    .string()
    .trim()
    .min(1, "Hymn title is required."),
});

const SpeakerSchema = z.object({
  name: z.string().trim().min(1, "Speaker name is required."),
  topic: z.string().trim().min(1, "Topic is required."),
  type: z.enum(["speaker", "musical-number"]),
});

const MeetingFormSchema = z.object({
  date: z.iso.date(),

  meetingType: z.enum([
    "regular",
    "testimony",
    "stake",
    "general",
    "special",
  ]),

  presiding: requiredText,
  conducting: requiredText,
  openingPrayer: requiredText,
  closingPrayer: requiredText,

  openingHymn: HymnSchema,
  sacramentHymn: HymnSchema,
  closingHymn: HymnSchema,

  announcements: z.array(z.string()),

  wardBusiness: z.array(
    z.object({
      description: z.string().min(1),
    }),
  ),

  stakeBusiness: z.boolean(),
  speakers: z.array(SpeakerSchema),
});

// ============================================
// FORM DATA HELPERS
// ============================================

function getText(
  formData: FormData,
  name: string,
): string {
  const value = formData.get(name);

  return typeof value === "string" ? value : "";
}

function parseLines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseSpeakers(value: string) {
  return parseLines(value).map((line) => {
    const parts = line
      .split("|")
      .map((part) => part.trim());

    return {
      name: parts[0] ?? "",
      topic: parts[1] ?? "",
      type: parts[2] ?? "speaker",
      validFormat: parts.length === 3,
    };
  });
}

// ============================================
// VALIDATE MEETING FORM
// ============================================

function validateMeeting(formData: FormData):
  | {
      success: true;
      data: MeetingInput;
    }
  | {
      success: false;
      state: State;
    } {
  const speakerLines = parseSpeakers(
    getText(formData, "speakers"),
  );

  const raw = {
    date: getText(formData, "date"),
    meetingType: getText(formData, "meetingType"),
    presiding: getText(formData, "presiding"),
    conducting: getText(formData, "conducting"),
    openingPrayer: getText(formData, "openingPrayer"),
    closingPrayer: getText(formData, "closingPrayer"),

    openingHymn: {
      number: getText(formData, "openingHymnNumber"),
      title: getText(formData, "openingHymnTitle"),
    },

    sacramentHymn: {
      number: getText(formData, "sacramentHymnNumber"),
      title: getText(formData, "sacramentHymnTitle"),
    },

    closingHymn: {
      number: getText(formData, "closingHymnNumber"),
      title: getText(formData, "closingHymnTitle"),
    },

    announcements: parseLines(
      getText(formData, "announcements"),
    ),

    wardBusiness: parseLines(
      getText(formData, "wardBusiness"),
    ).map((description) => ({ description })),

    stakeBusiness:
      formData.get("stakeBusiness") === "on",

    speakers: speakerLines.map(
      ({ name, topic, type }) => ({
        name,
        topic,
        type,
      }),
    ),
  };

  const result = MeetingFormSchema.safeParse(raw);

  const errors: Record<string, string[]> = {};

  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path.join(".");

      (errors[field] ??= []).push(issue.message);
    }
  }

  if (speakerLines.some((speaker) => !speaker.validFormat)) {
    (errors.speakers ??= []).push(
      "Each line must use: Name | Topic | speaker",
    );
  }

  if (!result.success || Object.keys(errors).length > 0) {
    return {
      success: false,
      state: {
        message: "Please correct the highlighted fields.",
        errors,
      },
    };
  }

  return {
    success: true,
    data: result.data as MeetingInput,
  };
}

// ============================================
// DATABASE ERROR HELPERS
// ============================================

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  );
}

// ============================================
// CREATE MEETING
// ============================================

export async function createMeeting(
  _prevState: State,
  formData: FormData,
): Promise<State> {
    await requireAdmin();

  const validation = validateMeeting(formData);

  if (!validation.success) {
    return validation.state;
  }

  try {
    await createMeetingRecord(validation.data);
  } catch (error) {
    console.error("Create meeting failed:", error);

    if (isUniqueViolation(error)) {
      return {
        message: "A meeting already exists for this date.",
        errors: {
          date: ["Please select a different meeting date."],
        },
      };
    }

    return {
      message: "Database error. Unable to create meeting.",
      errors: {},
    };
  }

  revalidatePath("/meetings");
  redirect("/meetings");
}

// ============================================
// UPDATE MEETING
// ============================================

export async function updateMeeting(
  id: number,
  _prevState: State,
  formData: FormData,
): Promise<State> {
    await requireAdmin();
  if (!Number.isSafeInteger(id) || id <= 0) {
    return {
      message: "Invalid meeting ID.",
      errors: {},
    };
  }

  const validation = validateMeeting(formData);

  if (!validation.success) {
    return validation.state;
  }

  try {
    const updated = await updateMeetingRecord(
      id,
      validation.data,
    );

    if (!updated) {
      return {
        message: "Meeting not found.",
        errors: {},
      };
    }
  } catch (error) {
    console.error("Update meeting failed:", error);

    if (isUniqueViolation(error)) {
      return {
        message: "A meeting already exists for this date.",
        errors: {
          date: ["Please select a different meeting date."],
        },
      };
    }

    return {
      message: "Database error. Unable to update meeting.",
      errors: {},
    };
  }

  revalidatePath("/meetings");
  revalidatePath(`/meetings/${id}`);

  redirect("/meetings");
}

// ============================================
// DELETE MEETING
// ============================================

export async function deleteMeeting(
  id: number,
): Promise<void> {
    await requireAdmin();
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("Invalid meeting ID.");
  }

  try {
    const deleted = await deleteMeetingRecord(id);

    if (!deleted) {
      throw new Error("Meeting not found.");
    }
  } catch (error) {
    console.error("Delete meeting failed:", error);

    throw new Error(
      "Unable to delete meeting. Please try again.",
    );
  }

  revalidatePath("/meetings");
  redirect("/meetings");
}
