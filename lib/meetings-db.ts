import type { SacramentMeeting } from "./types";

const meetings: SacramentMeeting[] = [
  {
    id: 1,
    date: "2026-09-06",
    meetingType: "testimony",
    presiding: "Bishop Anderson",
    conducting: "Brother Miller",
    announcements: [
      "Ward temple night this Friday",
      "Youth activity on Wednesday at 7:00 PM",
    ],
    openingHymn: {
      number: 85,
      title: "How Firm a Foundation",
    },
    openingPrayer: "Sister Johnson",
    wardBusiness: [
      {
        description: "Sustaining of a new Primary teacher",
      },
    ],
    stakeBusiness: false,
    sacramentHymn: {
      number: 169,
      title: "As Now We Take the Sacrament",
    },
    speakers: [
      {
        name: "Ward Members",
        topic: "Testimonies",
        type: "speaker",
      },
    ],
    closingHymn: {
      number: 301,
      title: "I Am a Child of God",
    },
    closingPrayer: "Brother Wilson",
  },
  {
    id: 2,
    date: "2026-08-30",
    meetingType: "regular",
    presiding: "Bishop Anderson",
    conducting: "Brother Thompson",
    announcements: ["Ward service project next Saturday"],
    openingHymn: {
      number: 2,
      title: "The Spirit of God",
    },
    openingPrayer: "Brother Davis",
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: {
      number: 196,
      title: "Jesus, Once of Humble Birth",
    },
    speakers: [
      {
        name: "Sister Brown",
        topic: "Faith in Jesus Christ",
        type: "speaker",
      },
      {
        name: "Brother Smith",
        topic: "Personal Revelation",
        type: "speaker",
      },
    ],
    closingHymn: {
      number: 89,
      title: "The Lord Is My Light",
    },
    closingPrayer: "Sister Taylor",
  },
  {
    id: 3,
    date: "2026-08-23",
    meetingType: "regular",
    presiding: "Bishop Anderson",
    conducting: "Brother Miller",
    announcements: ["Relief Society activity Thursday evening"],
    openingHymn: {
      number: 136,
      title: "I Know That My Redeemer Lives",
    },
    openingPrayer: "Sister Harris",
    wardBusiness: [
      {
        description: "Release and sustaining of Young Men advisers",
      },
    ],
    stakeBusiness: true,
    sacramentHymn: {
      number: 193,
      title: "I Stand All Amazed",
    },
    speakers: [
      {
        name: "Brother Clark",
        topic: "Serving Others",
        type: "speaker",
      },
      {
        name: "Ward Choir",
        topic: "Come Thou Fount",
        type: "musical-number",
      },
      {
        name: "Sister Lewis",
        topic: "Covenants",
        type: "speaker",
      },
    ],
    closingHymn: {
      number: 220,
      title: "Lord, I Would Follow Thee",
    },
    closingPrayer: "Brother Young",
  },
  {
    id: 4,
    date: "2026-08-16",
    meetingType: "stake",
    presiding: "President Williams",
    conducting: "President Moore",
    announcements: ["Stake conference meetings begin at 10:00 AM"],
    openingHymn: {
      number: 5,
      title: "High on the Mountain Top",
    },
    openingPrayer: "Sister Martinez",
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: {
      number: 169,
      title: "As Now We Take the Sacrament",
    },
    speakers: [
      {
        name: "President Williams",
        topic: "Following Jesus Christ",
        type: "speaker",
      },
      {
        name: "Sister Moore",
        topic: "Building Faith",
        type: "speaker",
      },
    ],
    closingHymn: {
      number: 134,
      title: "I Believe in Christ",
    },
    closingPrayer: "Brother Garcia",
  },
  {
    id: 5,
    date: "2026-08-09",
    meetingType: "regular",
    presiding: "Bishop Anderson",
    conducting: "Brother Thompson",
    announcements: ["Family history workshop after church"],
    openingHymn: {
      number: 6,
      title: "Redeemer of Israel",
    },
    openingPrayer: "Sister White",
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: {
      number: 174,
      title: "While of These Emblems We Partake",
    },
    speakers: [
      {
        name: "Brother Robinson",
        topic: "Family History",
        type: "speaker",
      },
      {
        name: "Sister Hall",
        topic: "Temple Worship",
        type: "speaker",
      },
    ],
    closingHymn: {
      number: 300,
      title: "Families Can Be Together Forever",
    },
    closingPrayer: "Brother Allen",
  },
];

export function getMeetings(
  date?: string | null,
): SacramentMeeting[] {
  if (date) {
    return meetings.filter((meeting) => meeting.date === date);
  }

  return meetings;
}

export function getMeetingById(
  id: number,
): SacramentMeeting | null {
  return meetings.find((meeting) => meeting.id === id) ?? null;
}