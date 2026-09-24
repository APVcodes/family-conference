export const conference = {
  title: "Mar Thoma North America Diocese 36th Family Conference 2027",
  shortTitle: "36th Family Conference 2027",
  tagline: "Rooted in Christ, Routed through the Family",
  subtitle:
    "A welcoming gathering for Mar Thoma families across North America. Conference dates, venue, registration, and program details will be announced here.",
  organization: "Mar Thoma Church · Diocese of North America",
  dates: "July 1–4, 2027",
  venue: {
    name: "Double Tree by Hilton",
    address: "1909 Spring Road, Oak Brook, IL 60523",
    label: "36th Family Conference Venue",
  },
  registration: {
    headline: "Registration",
    description:
      "Mar Thoma North America 36th Family Conference 2027",
    cta: "Register Now",
  },
  contactEmail: "marthomadiocese@gmail.com",
  councilUrl: "https://marthomana.org/council-members/",
};

export const theme = {
  title: "Faith Life: Rooted in Christ, Routed through the Family",
  malayalam: "വിശ്വാസജീവിതം: ക്രിസ്തുവിൽ വേരൂന്നി, കുടുംബ വഴികളിലൂടെ",
  verse: "2 Timothy 1:5",
};

export const bishop = {
  name: "Rt. Rev. Dr. Abraham Mar Paulos Episcopa",
  title: "Diocesan Bishop",
  organization: "Diocese of North America · Mar Thoma Church",
  image: "/images/DrAbrahamMarPaulos.webp",
};

export const speakers = [
  {
    name: "Rt. Rev. PD Dr. Joseph Mar Ivanios Episcopa",
    role: "Chief Guest",
  },
  {
    name: "Rev. K E Geevarghese",
    role: "Main Speaker",
  },
];

export type PricingTier = {
  label: string;
  note?: string;
  single: string;
  double: string;
  family: string;
};

export const pricing: { earlyBird: PricingTier; regular: PricingTier } = {
  earlyBird: {
    label: "Early Bird Pricing",
    note: "Ends January 31, 2027",
    single: "$899",
    double: "$1,499",
    family: "$1,999",
  },
  regular: {
    label: "Regular Pricing",
    note: "Starts February 1, 2027",
    single: "$950",
    double: "$1,600",
    family: "$2,200",
  },
};

export type AgendaDay = {
  dayLabel: string;
  date: string;
  note: string;
  items: { time: string; title: string; detail: string }[];
};

export const sampleAgendas: AgendaDay[] = [
  {
    dayLabel: "Day 1 - Agenda",
    date: "Friday, July 2",
    note: "A preview of one conference day. Full schedule coming soon.",
    items: [
      { time: "7:30 AM", title: "Morning Prayer", detail: "Chapel" },
      { time: "9:00 AM", title: "Opening Worship", detail: "Main hall" },
      { time: "10:30 AM", title: "Bible Study", detail: "Adults, youth & children" },
      { time: "12:30 PM", title: "Family Lunch", detail: "Dining hall" },
      { time: "2:00 PM", title: "Workshops & Fellowship", detail: "Breakout sessions" },
      { time: "6:00 PM", title: "Evening Worship", detail: "Main hall" },
      { time: "8:00 PM", title: "Family Night", detail: "Games, music & community" },
    ],
  },
  {
    dayLabel: "Day 2 - Agenda",
    date: "Saturday, July 3",
    note: "A preview of one conference day. Full schedule coming soon.",
    items: [
      { time: "7:30 AM", title: "Morning Prayer", detail: "Chapel" },
      { time: "9:00 AM", title: "Holy Qurbana", detail: "Main hall" },
      { time: "11:00 AM", title: "Keynote Session", detail: "Main hall" },
      { time: "12:30 PM", title: "Family Lunch", detail: "Dining hall" },
      { time: "2:00 PM", title: "Youth & Children's Programs", detail: "Breakout rooms" },
      { time: "4:00 PM", title: "Parish Fellowship Time", detail: "Campus grounds" },
      { time: "6:30 PM", title: "Cultural Night", detail: "Main hall" },
    ],
  },
  {
    dayLabel: "Day 3 - Agenda",
    date: "Sunday, July 4",
    note: "A preview of one conference day. Full schedule coming soon.",
    items: [
      { time: "7:30 AM", title: "Morning Prayer", detail: "Chapel" },
      { time: "9:00 AM", title: "Sunday Worship", detail: "Main hall" },
      { time: "11:00 AM", title: "Closing Message", detail: "Main hall" },
      { time: "12:30 PM", title: "Farewell Lunch", detail: "Dining hall" },
      { time: "2:00 PM", title: "Group Photos & Send-off", detail: "Venue lobby" },
    ],
  },
];

export const aboutSections = [
  {
    title: "Stay together",
    description:
      "Accommodation options and room guidance will be shared once the venue is confirmed.",
  },
  {
    title: "Children & youth",
    description:
      "Age-specific fellowship and activity details will be announced with the full program.",
  },
  {
    title: "Prepare & participate",
    description:
      "Watch this space for devotionals, packing guidance, and conference resources.",
  },
];

export const promoVideos = [
  {
    id: "promo-1",
    title: "36th Family Conference Promo",
    description: "A glimpse of fellowship, worship, and community.",
    embedUrl: "https://www.youtube.com/embed/mkBI9lEIE5c",
  },
  {
    id: "promo-2",
    title: "Highlights Reel",
    description: "Moments from past diocesan gatherings.",
    embedUrl: "https://www.youtube.com/embed/zl_mTp5uqVQ",
  },
];

// TODO: replace with the Google Doc link for souvenir submissions once available.
export const souvenirSubmissionUrl = "#";

export const souvenirs = [
  {
    name: "Conference T-Shirt",
    description: "Commemorative apparel featuring the 2027 conference theme.",
    status: "Details coming soon",
  },
  {
    name: "Program Booklet",
    description: "Schedule, devotionals, and conference information in one keepsake.",
    status: "Available at registration",
  },
  {
    name: "Conference Memento",
    description: "A special souvenir to remember your time together in fellowship.",
    status: "Details coming soon",
  },
];
