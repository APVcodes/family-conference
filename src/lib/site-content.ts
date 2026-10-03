export const conference = {
  title: "Mar Thoma Diocese of North America 36th Family Conference 2027",
  shortTitle: "36th Family Conference 2027",
  tagline: "Rooted in Christ, Routed through the Family",
  subtitle:
    "A welcoming gathering for Mar Thoma families across North America. Conference dates, venue, registration, and program details will be announced here.",
  organization: "Mar Thoma Diocese of North America",
  host: "Hosted by MidWest Regional Activities Committee",
  dates: "July 1–4, 2027",
  venue: {
    name: "Double Tree by Hilton",
    address: "1909 Spring Road, Oak Brook, IL 60523",
    label: "36th Family Conference Venue",
  },
  registration: {
    headline: "Registration",
    description:
      "Mar Thoma Diocese of North America 36th Family Conference 2027",
    cta: "Register Now",
  },
  contactEmail: "infomarthomanafc27@gmail.com",
  contactPhone: "516-377-3311",
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
  organization: "Mar Thoma Diocese of North America",
  image: "/images/DrAbrahamMarPaulos.webp",
};

export const committee = [
  { name: "Rev. Jaisen A. Thomas", role: "Vice President", phone: "832-841-0322" },
  { name: "Mr. Jacob George", role: "General Convenor", phone: "630-440-9985" },
  { name: "Dr. Joe M. George", role: "Co-Convenor", phone: "224-381-2174" },
  { name: "Mr. Alan John", role: "Co-Convenor", phone: "313-999-3365" },
  { name: "Mr. Vinod Thomas", role: "Treasurer", phone: "586-770-1294" },
  { name: "Dr. Shijy Alex", role: "Accountant", phone: "224-436-9371" },
];

export const speakers = [
  {
    name: "Rt. Rev. PD Dr. Joseph Mar Ivanios Episcopa",
    role: "Chief Guest",
    office: "Diocesan Bishop, UK-Europe-Africa Dioceses and Mumbai Diocese",
  },
  {
    name: "Rev. K.E. Geevarghese",
    role: "Main Speaker",
    office: "Secretary to the Mar Thoma Metropolitan",
  },
];

export type AgendaDay = {
  dayLabel: string;
  date: string;
  note: string;
  items: { time: string; title: string; detail: string }[];
};

export const sampleAgendas: AgendaDay[] = [
  {
    dayLabel: "Day 1 - Agenda",
    date: "Thursday, July 1",
    note: "A preview of one conference day. Full schedule coming soon.",
    items: [
      { time: "3:00 PM", title: "Arrival & Check-in", detail: "Venue lobby" },
      { time: "5:00 PM", title: "Opening Worship", detail: "Main hall" },
      { time: "7:00 PM", title: "Welcome Dinner", detail: "Dining hall" },
      { time: "8:30 PM", title: "Fellowship", detail: "Main hall" },
    ],
  },
  {
    dayLabel: "Day 2 - Agenda",
    date: "Friday, July 2",
    note: "A preview of one conference day. Full schedule coming soon.",
    items: [
      { time: "7:30 AM", title: "Morning Prayer", detail: "Chapel" },
      { time: "9:00 AM", title: "Worship", detail: "Main hall" },
      { time: "10:30 AM", title: "Bible Study", detail: "Adults, youth & children" },
      { time: "12:30 PM", title: "Family Lunch", detail: "Dining hall" },
      { time: "2:00 PM", title: "Workshops & Fellowship", detail: "Breakout sessions" },
      { time: "6:00 PM", title: "Evening Worship", detail: "Main hall" },
      { time: "8:00 PM", title: "Family Night", detail: "Games, music & community" },
    ],
  },
  {
    dayLabel: "Day 3 - Agenda",
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
    dayLabel: "Day 4 - Agenda",
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
