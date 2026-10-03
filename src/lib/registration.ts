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

export const packages: {
  id: PackageId;
  label: string;
  included: number;
  earlyBird: number;
  regular: number;
}[] = [
  { id: "single", label: "Single Occupancy", included: 1, earlyBird: 849, regular: 949 },
  {
    id: "double",
    label: "Double Occupancy (per room)",
    included: 2,
    earlyBird: 1449,
    regular: 1599,
  },
  {
    id: "family3",
    label: "Family of 3 (per room)",
    included: 3,
    earlyBird: 1749,
    regular: 1999,
  },
  {
    id: "family4",
    label: "Family of 4 (per room)",
    included: 4,
    earlyBird: 1899,
    regular: 2199,
  },
];

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

export function packageById(id: PackageId) {
  return packages.find((item) => item.id === id) ?? packages[0];
}

export function ageCategoryById(id: AgeCategory) {
  return ageCategories.find((item) => item.id === id)!;
}

function billingRank(category: AgeCategory) {
  const billing = ageCategoryById(category).billing;
  if (billing === "adult") return 2;
  if (billing === "child") return 1;
  return 0;
}

const packageByOccupancy: PackageId[] = ["single", "double", "family3", "family4"];

/** Children ages 1–5 are free and do not count toward the room rate. */
export function quoteRegistration(categories: (AgeCategory | "")[], tier: PricingTier) {
  const partySize = categories.filter((category) => category !== "").length;
  const extraAdultRate = extraRates.adult[tier];
  const extraChildRate = extraRates.child[tier];

  const ranked = categories
    .map((category, index) => ({
      category,
      index,
      rank: category ? billingRank(category) : 0,
    }))
    .filter((person) => person.rank > 0)
    .sort((a, b) => b.rank - a.rank || a.index - b.index);

  const occupancy = ranked.length;
  const selected = occupancy === 0 ? null : packageById(packageByOccupancy[Math.min(occupancy, 4) - 1]);
  const room = partySize === 0 ? null : packageById(packageByOccupancy[Math.min(partySize, 4) - 1]);
  const includedIndexes = new Set(
    ranked.slice(0, selected?.included ?? 0).map((person) => person.index),
  );

  const lines = categories.map((category, index) => {
    if (!category) return null;
    if (billingRank(category) === 0) return { category, billing: "free" as const };
    if (includedIndexes.has(index)) return { category, billing: "included" as const };
    if (ageCategoryById(category).billing === "child") {
      return { category, billing: "extra-child" as const };
    }
    return { category, billing: "extra-adult" as const };
  });

  const extraAdults = lines.filter((line) => line?.billing === "extra-adult").length;
  const extraChildren = lines.filter((line) => line?.billing === "extra-child").length;
  const freeChildren = lines.filter((line) => line?.billing === "free").length;
  const packagePrice = selected ? selected[tier] : 0;
  const needsExtraRoom = partySize > 4;

  return {
    tier,
    packageId: selected?.id ?? null,
    packageLabel: selected?.label ?? "",
    roomLabel: room?.label ?? "",
    occupancy,
    partySize,
    included: selected?.included ?? 0,
    packagePrice,
    extraAdults,
    extraAdultRate,
    extraChildren,
    extraChildRate,
    freeChildren,
    needsExtraRoom,
    roomNote: needsExtraRoom ? "Needs extra room space" : "",
    total: packagePrice + extraAdults * extraAdultRate + extraChildren * extraChildRate,
    lines,
  };
}
