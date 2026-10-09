export type PricingTier = "earlyBird" | "regular";

export type PackageId = "single" | "double" | "family3" | "family4";

export type AgeCategory =
  | "young-adult"
  | "adult"
  | "senior"
  | "child"
  | "child-free";

export type BillingRole = "included" | "extra-adult" | "extra-child" | "free";

/** Early bird ends at the close of January 31, 2027, Chicago time. */
const REGULAR_PRICING_START = new Date("2027-02-01T06:00:00.000Z");

/** Second installment is charged at the start of March 1, 2027, Chicago time. */
export const installmentDueDate = new Date("2027-03-01T06:00:00.000Z");
export const installmentDueLabel = "March 1, 2027";

export type PaymentPlan = "full" | "installments";

export type PaymentMethod = "card" | "ach" | "pay-later";

export const paymentMethodOptions: {
  id: PaymentMethod;
  label: string;
  rate: string;
}[] = [
  { id: "card", label: "Card", rate: "2.9% + $0.30" },
  { id: "ach", label: "ACH bank debit", rate: "0.8%, up to $5" },
  { id: "pay-later", label: "Pay later", rate: "5.99% + $0.30" },
];

export type BasePackage = {
  id: PackageId;
  label: string;
  /** Adults (ages 13+) covered by the base package. */
  adults: number;
  /** Children (ages 6–12) covered by the base package. */
  children: number;
  earlyBird: number;
  regular: number;
};

export const packages: BasePackage[] = [
  { id: "single", label: "Single Occupancy", adults: 1, children: 0, earlyBird: 849, regular: 949 },
  { id: "double", label: "Double Occupancy", adults: 2, children: 0, earlyBird: 1449, regular: 1599 },
  { id: "family3", label: "Family of 3", adults: 2, children: 1, earlyBird: 1749, regular: 1999 },
  { id: "family4", label: "Family of 4", adults: 2, children: 2, earlyBird: 1899, regular: 2199 },
];

/** Plain-text description of who a base package covers, e.g. "2 adults and 1 child (6–12)". */
export function packageIncludedText(item: Pick<BasePackage, "adults" | "children">) {
  const adults = `${item.adults} ${item.adults === 1 ? "adult" : "adults"}`;
  if (item.children === 0) return adults;
  return `${adults} and ${item.children} ${item.children === 1 ? "child" : "children"} (6–12)`;
}

export const extraRates = {
  adult: { earlyBird: 449, regular: 499 },
  child: { earlyBird: 349, regular: 399 },
};

export const ageCategories: {
  id: AgeCategory;
  label: string;
  billing: "adult" | "child" | "free";
}[] = [
  { id: "young-adult", label: "Young Adult (ages 13–35)", billing: "adult" },
  { id: "adult", label: "Adult (ages 36–59)", billing: "adult" },
  { id: "senior", label: "Senior (ages 60+)", billing: "adult" },
  { id: "child", label: "Child (ages 6–12)", billing: "child" },
  { id: "child-free", label: "Child (ages 1–5, free)", billing: "free" },
];

export const regions = [
  "North East",
  "South East",
  "Midwest",
  "Southern",
  "South West",
  "Western",
  "Canada",
  "Other",
] as const;

export const includedBenefits = [
  "Conference registration",
  "Conference fees",
  "Accommodation",
  "Meals during the conference",
  "Ground transportation between the airport and the conference hotel, if you need it",
];

export function currentPricingTier(now = new Date()): PricingTier {
  return now.getTime() < REGULAR_PRICING_START.getTime() ? "earlyBird" : "regular";
}

export function formatUsd(amount: number) {
  const hasCents = Math.round(amount * 100) % 100 !== 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  }).format(amount);
}

/** Stripe rejects USD charges under $0.50. Card pay-in-full tests use $0.50. ACH pay-in-full tests use $0.55. */
export const testPaymentAmount = 0.5;
export const testAchPaymentAmount = 0.55;
/** Each card test installment is $0.55: one today, one tomorrow. */
export const testInstallmentAmount = 0.55;
/** Each ACH test installment is $0.56: one today, one tomorrow. */
export const testAchInstallmentAmount = 0.56;

export function testInstallmentDueLabel(now = new Date()) {
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function installmentsAvailable(now = new Date()) {
  return now.getTime() < installmentDueDate.getTime();
}

function stripeFeeCents(chargeCents: number, method: PaymentMethod) {
  if (method === "ach") return Math.min(Math.round(chargeCents * 0.008), 500);
  if (method === "pay-later") return Math.round(chargeCents * 0.0599) + 30;
  return Math.round(chargeCents * 0.029) + 30;
}

/** Smallest charge whose Stripe fee still leaves the conference with the package amount. */
export function chargeWithProcessingFee(netDollars: number, method: PaymentMethod) {
  const netCents = Math.round(netDollars * 100);
  let chargeCents = netCents;
  while (chargeCents - stripeFeeCents(chargeCents, method) < netCents) {
    chargeCents += 1;
  }
  return { chargeCents, feeCents: chargeCents - netCents };
}

export function priceForMethod(packageTotal: number, plan: PaymentPlan, method: PaymentMethod) {
  if (plan === "installments") {
    const schedule = paymentSchedule(packageTotal, "installments");
    const installmentMethod = method === "pay-later" ? "card" : method;
    const today = chargeWithProcessingFee(schedule.dueToday, installmentMethod);
    const later = chargeWithProcessingFee(schedule.balance, installmentMethod);
    return {
      dueToday: today.chargeCents / 100,
      balance: later.chargeCents / 100,
      fee: (today.feeCents + later.feeCents) / 100,
    };
  }
  const full = chargeWithProcessingFee(packageTotal, method);
  return { dueToday: full.chargeCents / 100, balance: 0, fee: full.feeCents / 100 };
}

/** Split an integer dollar total into two charges that add back to the total. */
export function paymentSchedule(total: number, plan: PaymentPlan) {
  const totalCents = Math.round(total * 100);
  if (plan === "installments") {
    const dueTodayCents = Math.ceil(totalCents / 2);
    return {
      plan,
      dueToday: dueTodayCents / 100,
      balance: (totalCents - dueTodayCents) / 100,
      dueLabel: installmentDueLabel,
    };
  }
  return { plan: "full" as const, dueToday: total, balance: 0, dueLabel: "" };
}

export function ageCategoryById(id: AgeCategory) {
  return ageCategories.find((item) => item.id === id)!;
}

/** Largest base package whose adults and children are both covered by the room's group. */
function packageForRoom(adults: number, children: number) {
  let best = packages[0];
  for (const item of packages) {
    if (adults >= item.adults && children >= item.children) best = item;
  }
  return best;
}

/**
 * Hotel policy: a room holds at most four people, free children included. Larger groups are not blocked;
 * the registration is collected and the team contacts the registrant to finish it.
 */
export const MAX_AUTOMATIC_PARTY = 4;

/**
 * One room is one base package. Anyone past the base package is billed at the extra adult or
 * child rate, and children ages 1–5 are free and never priced. A registration needs at least one
 * adult. Parties of more than four people (free children included) get no automatic price and
 * `needsTeamFollowUp` is set instead.
 */
export function quoteRegistration(categories: (AgeCategory | "")[], tier: PricingTier) {
  const partySize = categories.filter((category) => category !== "").length;
  const extraAdultRate = extraRates.adult[tier];
  const extraChildRate = extraRates.child[tier];

  const adultIndexes: number[] = [];
  const childIndexes: number[] = [];
  categories.forEach((category, index) => {
    if (!category) return;
    const billing = ageCategoryById(category).billing;
    if (billing === "adult") adultIndexes.push(index);
    else if (billing === "child") childIndexes.push(index);
  });

  const occupancy = adultIndexes.length + childIndexes.length;
  const needsTeamFollowUp = partySize > MAX_AUTOMATIC_PARTY;
  const priced = adultIndexes.length > 0 && !needsTeamFollowUp;

  const base = priced ? packageForRoom(adultIndexes.length, childIndexes.length) : null;
  const extraAdultIndexes = new Set(adultIndexes.slice(base?.adults ?? 0));
  const extraChildIndexes = new Set(childIndexes.slice(base?.children ?? 0));

  const lines = categories.map((category, index) => {
    if (!category) return null;
    if (ageCategoryById(category).billing === "free") return { category, billing: "free" as const };
    if (extraAdultIndexes.has(index)) return { category, billing: "extra-adult" as const };
    if (extraChildIndexes.has(index)) return { category, billing: "extra-child" as const };
    return { category, billing: "included" as const };
  });

  const extraAdults = priced ? extraAdultIndexes.size : 0;
  const extraChildren = priced ? extraChildIndexes.size : 0;
  const freeChildren = lines.filter((line) => line?.billing === "free").length;
  const packagePrice = base ? base[tier] : 0;

  return {
    tier,
    base,
    roomCount: base ? 1 : 0,
    needsTeamFollowUp,
    packageLabel: base?.label ?? "",
    occupancy,
    adultCount: adultIndexes.length,
    childCount: childIndexes.length,
    partySize,
    packagePrice,
    extraAdults,
    extraAdultRate,
    extraChildren,
    extraChildRate,
    freeChildren,
    total: packagePrice + extraAdults * extraAdultRate + extraChildren * extraChildRate,
    lines,
  };
}
