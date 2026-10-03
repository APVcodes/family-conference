/**
 * Registration receiver for the Family Conference site.
 *
 * Setup:
 * 1. Create a Google Sheet named "Family Conference 2027 Registrations".
 * 2. Extensions → Apps Script, replace the default file with this script, and save.
 * 3. Deploy → New deployment → Web app.
 *    Execute as: Me
 *    Who has access: Anyone
 * 4. Copy the web app URL ending in /exec into src/lib/registration-endpoint.ts.
 * 5. Authorize the script when Google asks. Confirmation mail is sent from the
 *    Google account that owns this script.
 * 6. In Apps Script, open Project Settings → Script properties and add
 *    STRIPE_SECRET_KEY (use the Stripe secret key, sk_test_... or sk_live_...).
 * 7. Deploy → Manage deployments → Edit → New version → Deploy.
 *    The site charges the registration total on Stripe Checkout, then records
 *    the row and emails the primary registrant only after Stripe reports the
 *    payment as paid.
 * 8. To collect the second installment automatically, run installInstallmentTrigger
 *    once from the Apps Script editor. It charges the saved card on March 1, 2027.
 * 9. For a private test charge, add script property TEST_PAYMENT_SECRET.
 *    Open the registration page with ?test= that secret. Pay in full charges $0.50.
 *    Two installments charge $0.55 today and $0.55 tomorrow. Stripe cannot charge $0.10.
 *
 * Redeploy as a new version after every script change.
 */

var CONFERENCE_EMAIL = "infomarthomanafc27@gmail.com";
var CONFERENCE_PHONE = "516-377-3311";
var NOTIFY_EMAIL = "infomarthomanafc27@gmail.com";

var REGISTRATION_HEADERS = [
  "Submitted at",
  "Registration ID",
  "Pricing tier",
  "Package",
  "Package price",
  "Extra adults",
  "Extra adult rate",
  "Extra children",
  "Extra child rate",
  "Free children (ages 1–5)",
  "Occupancy count",
  "Party size",
  "Extra room space",
  "Total",
  "First name",
  "Last name",
  "Email",
  "Phone",
  "Parish",
  "Region",
  "Airport transportation",
  "Accessibility needed",
  "Accessibility details",
  "Emergency contact name",
  "Emergency contact phone",
  "Participants",
  "Stripe session ID",
  "Payment status",
  "Payment plan",
  "Amount charged",
  "Balance remaining",
  "Balance due",
  "Payment method",
  "Processing fee",
  "Room needed",
];

var PARTICIPANT_HEADERS = [
  "Submitted at",
  "Registration ID",
  "Name",
  "Age group",
  "Billing",
  "Allergies",
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var data = JSON.parse(e.postData.contents);
    if (data.website) {
      return json_({ ok: true });
    }
    if (data.action === "create-checkout") {
      return createCheckout_(data);
    }
    if (data.action === "confirm-payment") {
      return confirmPayment_(data.sessionId);
    }
    return json_({ ok: false, error: "Payment is required to complete registration." });
  } catch (error) {
    return json_({ ok: false, error: String(error) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json_({ ok: true, service: "family-conference-registration" });
}

function appendRegistration_(submittedAt, registrationId, data, quote, participants) {
  var sheet = getSheet_("Registrations", REGISTRATION_HEADERS);
  var summary = participants
    .map(function (person) {
      return (
        person.name +
        " (" +
        person.categoryLabel +
        ", " +
        person.billingLabel +
        ", allergies: " +
        (person.allergies || "none") +
        ")"
      );
    })
    .join("; ");

  sheet.appendRow([
    submittedAt,
    registrationId,
    quote.tierLabel || "",
    quote.packageLabel || "",
    quote.packagePrice || 0,
    quote.extraAdults || 0,
    quote.extraAdultRate || 0,
    quote.extraChildren || 0,
    quote.extraChildRate || 0,
    quote.freeChildren || 0,
    quote.occupancy || 0,
    quote.partySize || 0,
    quote.needsExtraRoom ? "Yes — needs extra room space" : "No",
    quote.total || 0,
    data.firstName || "",
    data.lastName || "",
    data.email || "",
    data.phone || "",
    data.parish || "",
    data.region || "",
    data.airportTransportation || "",
    data.accessibilityNeeded || "",
    data.accessibilityDetails || "",
    data.emergencyName || "",
    data.emergencyPhone || "",
    summary,
    data.stripeSessionId || "",
    data.paymentStatus || "",
    data.payment ? data.payment.planLabel : "",
    data.payment ? data.payment.chargeCents / 100 : "",
    data.payment ? data.payment.balanceCents / 100 : "",
    data.payment ? data.payment.dueLabel : "",
    data.payment ? data.payment.methodLabel || "" : "",
    data.payment && data.payment.feeCents ? data.payment.feeCents / 100 : 0,
    quote.roomLabel || "",
  ]);
}

function appendParticipants_(submittedAt, registrationId, participants) {
  var sheet = getSheet_("Participants", PARTICIPANT_HEADERS);
  participants.forEach(function (person) {
    sheet.appendRow([
      submittedAt,
      registrationId,
      person.name || "",
      person.categoryLabel || "",
      person.billingLabel || "",
      person.allergies || "None",
    ]);
  });
}

function getSheet_(name, headers) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(name);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(name);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
    return sheet;
  }
  var width = Math.max(sheet.getLastColumn(), 1);
  var current = sheet.getRange(1, 1, 1, width).getValues()[0].filter(function (value) {
    return value !== "";
  });
  var missing = headers.filter(function (header) {
    return current.indexOf(header) === -1;
  });
  if (missing.length) {
    sheet.getRange(1, current.length + 1, 1, missing.length).setValues([missing]).setFontWeight("bold");
  }
  return sheet;
}

function sendConfirmation_(registrationId, data, quote, participants) {
  var participantLines = participants
    .map(function (person) {
      return (
        "- " +
        person.name +
        " — " +
        person.categoryLabel +
        " (" +
        person.billingLabel +
        ")\n  Allergies: " +
        (person.allergies || "none")
      );
    })
    .join("\n");

  var money = function (amount) {
    return "$" + Number(amount || 0).toLocaleString("en-US");
  };

  var text = [
    "Hello " + data.firstName + ",",
    "",
    "We received your registration for the Mar Thoma Diocese of North America 36th Family Conference 2027. This confirmation was sent to the primary registrant at " + data.email + ".",
    "",
    "Registration ID: " + registrationId,
    "Pricing: " + (quote.tierLabel || ""),
    "Package charged: " + (quote.packageLabel || "") + " — " + money(quote.packagePrice),
    "Room needed: " + (quote.roomLabel || ""),
    "Extra adults: " + (quote.extraAdults || 0) + " × " + money(quote.extraAdultRate),
    "Extra children (ages 6–12): " + (quote.extraChildren || 0) + " × " + money(quote.extraChildRate),
    "Children ages 1–5 (free): " + (quote.freeChildren || 0),
    "People counted toward the room rate: " + (quote.occupancy || 0),
    registrationPaymentLine_(quote, data),
    quote.needsExtraRoom ? "Your group has more than four people. The registration team will follow up about extra room space." : null,
    "",
    "Registrant",
    data.firstName + " " + data.lastName,
    data.email,
    data.phone,
    "Parish: " + data.parish,
    "Region: " + data.region,
    "",
    "Participants",
    participantLines,
    "",
    "Airport transportation needed: " + data.airportTransportation,
    "Accessibility accommodations needed: " + data.accessibilityNeeded,
    data.accessibilityDetails ? "Details: " + data.accessibilityDetails : null,
    "Emergency contact: " + data.emergencyName + ", " + data.emergencyPhone,
    "",
    "Card numbers are entered on Stripe’s page and are not stored by the conference website. Stripe will also email a receipt for this charge.",
    "",
    "The registration fee is an all-inclusive package: conference registration, conference fees, accommodation, meals during the conference, and ground transportation between the airport and the hotel if you requested it.",
    "",
    "Questions or changes",
    "Email: " + CONFERENCE_EMAIL,
    "Phone: " + CONFERENCE_PHONE,
    "Dates: July 1–4, 2027",
    "Venue: DoubleTree by Hilton, 1909 Spring Road, Oak Brook, IL 60523",
    "",
    "Mar Thoma Diocese of North America",
  ]
    .filter(function (line) {
      return line !== null;
    })
    .join("\n");

  MailApp.sendEmail({
    to: data.email,
    bcc: NOTIFY_EMAIL,
    name: "36th Family Conference 2027",
    replyTo: CONFERENCE_EMAIL,
    subject: (data.payment && data.payment.testPayment ? "TEST payment — " : "Registration received — ") + "36th Family Conference 2027",
    body: text,
  });
}

var PENDING_HEADERS = ["Created at", "Registration ID", "Stripe session ID", "Status", "Payload"];
var INSTALLMENT_HEADERS = [
  "Registration ID",
  "Email",
  "Name",
  "Stripe customer ID",
  "Payment method ID",
  "Balance cents",
  "Due at",
  "Status",
  "Second payment ID",
];

var CATEGORY_LABELS = {
  "young-adult": "Young Adult (ages 13–35)",
  adult: "Adult (ages 36–59)",
  senior: "Senior (ages 60+)",
  child: "Child (ages 6–12)",
  "child-free": "Child (ages 1–5, free)",
};

var BILLING_LABELS = {
  included: "Included in package",
  "extra-adult": "Extra adult",
  "extra-child": "Extra child",
  free: "Free",
};

function createCheckout_(data) {
  var registration = normalizeRegistration_(data);
  var registrationId = Utilities.getUuid();
  savePending_(registrationId, registration);
  var origin = returnOrigin_(data.origin);
  var sessionPayload = {
    mode: "payment",
    customer_email: registration.email,
    client_reference_id: registrationId,
    "metadata[registrationId]": registrationId,
    success_url: origin + "/registration/success/?session_id={CHECKOUT_SESSION_ID}",
    cancel_url:
      origin +
      "/registration/?" +
      (registration.payment.testPayment ? "test=" + encodeURIComponent(data.testCode) + "&" : "") +
      "payment=cancelled",
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "usd",
    "payment_method_types[0]": registration.payment.stripeType || "card",
    "line_items[0][price_data][unit_amount]": String(registration.payment.chargeCents),
    "line_items[0][price_data][product_data][name]": registration.payment.chargeName,
    "line_items[0][price_data][product_data][description]": registration.quote.packageLabel,
  };
  if (registration.payment.balanceCents > 0) {
    sessionPayload.customer_creation = "always";
    sessionPayload["payment_intent_data[setup_future_usage]"] = "off_session";
  }
  var session = stripeRequest_("/checkout/sessions", sessionPayload);
  setPendingSession_(registrationId, session.id);
  return json_({ ok: true, url: session.url, registrationId: registrationId });
}

function confirmPayment_(sessionId) {
  if (!sessionId || String(sessionId).indexOf("cs_") !== 0) {
    throw new Error("Missing Stripe checkout session.");
  }
  var existingId = findRegistrationIdBySession_(sessionId);
  if (existingId) {
    return json_({ ok: true, registrationId: existingId, alreadyRecorded: true });
  }
  var session = stripeRequest_(
    "/checkout/sessions/" + encodeURIComponent(sessionId) + "?expand[]=payment_intent"
  );
  if (session.payment_status !== "paid") {
    throw new Error("Payment is not complete yet.");
  }
  var registrationId = session.metadata && session.metadata.registrationId;
  var registration = loadPending_(registrationId);
  if (!registration) {
    throw new Error("This payment could not be matched to a registration.");
  }
  if (session.amount_total !== registration.payment.chargeCents) {
    throw new Error("The paid amount does not match this registration.");
  }
  registration.stripeSessionId = session.id;
  registration.paymentStatus = registration.payment.testPayment
    ? registration.payment.balanceCents > 0
      ? "Test installment 1 of 2 paid"
      : "Test payment"
    : registration.payment.balanceCents > 0
      ? "Installment 1 of 2 paid"
      : "Paid in full";
  if (registration.payment.balanceCents > 0) {
    scheduleInstallment_(registrationId, registration, session);
  }
  var submittedAt = new Date();
  appendRegistration_(submittedAt, registrationId, registration, registration.quote, registration.participants);
  appendParticipants_(submittedAt, registrationId, registration.participants);
  sendConfirmation_(registrationId, registration, registration.quote, registration.participants);
  markPending_(registrationId, "recorded");
  return json_({
    ok: true,
    registrationId: registrationId,
    summary: {
      firstName: registration.firstName,
      lastName: registration.lastName,
      email: registration.email,
      parish: registration.parish,
      region: registration.region,
      packageLabel: registration.quote.packageLabel,
      roomLabel: registration.quote.roomLabel || "",
      total: registration.quote.total,
      paymentPlan: registration.payment.planLabel,
      charged: registration.payment.chargeCents / 100,
      balance: registration.payment.balanceCents / 100,
      dueLabel: registration.payment.dueLabel,
      paymentMethod: registration.payment.methodLabel || "",
      processingFee: registration.payment.feeCents ? registration.payment.feeCents / 100 : 0,
      participants: registration.participants,
    },
  });
}

function normalizeRegistration_(data) {
  var participants = (data.participants || []).map(function (person) {
    var category = person.category;
    if (!person.name || !CATEGORY_LABELS[category]) {
      throw new Error("Each participant needs a name and age group.");
    }
    if (person.hasAllergy !== "Yes" && person.hasAllergy !== "No") {
      throw new Error("Tell us whether each participant has allergies.");
    }
    var allergies = person.hasAllergy === "Yes" ? String(person.allergies || "").trim() : "";
    if (person.hasAllergy === "Yes" && !allergies) {
      throw new Error("List the allergies for each participant who has them.");
    }
    return {
      name: String(person.name).trim(),
      category: category,
      categoryLabel: CATEGORY_LABELS[category],
      allergies: allergies,
    };
  });
  if (!data.firstName || !data.lastName) throw new Error("Enter the registrant’s name.");
  if (!data.email || String(data.email).indexOf("@") === -1) throw new Error("Enter a valid email address.");
  if (!data.phone || String(data.phone).replace(/\D/g, "").length < 10) throw new Error("Enter a phone number.");
  if (!data.parish || !data.region) throw new Error("Enter the parish and region.");
  if (!data.airportTransportation) throw new Error("Tell us whether airport transportation is needed.");
  if (!data.accessibilityNeeded) throw new Error("Tell us whether accessibility accommodations are needed.");
  if (data.accessibilityNeeded === "Yes" && !String(data.accessibilityDetails || "").trim()) {
    throw new Error("Describe the accessibility accommodations you need.");
  }
  if (!data.emergencyName || !data.emergencyPhone) throw new Error("Enter an emergency contact.");
  if (!data.disclaimerAccepted) throw new Error("Please acknowledge the payment disclaimer.");
  var quote = priceRegistration_(participants.map(function (person) { return person.category; }));
  if (!quote.packageId) {
    throw new Error("Include at least one participant age 6 or older.");
  }
  var payment = buildPayment_(quote.total, data.testCode ? "full" : data.paymentPlan);
  if (!String(data.testCode || "").trim()) payment = applyProcessingFee_(payment, data.paymentMethod);
  payment = applyTestPayment_(payment, data.testCode, data.paymentPlan);
  participants.forEach(function (person, index) {
    person.billing = quote.lines[index].billing;
    person.billingLabel = BILLING_LABELS[person.billing];
  });
  return {
    firstName: String(data.firstName).trim(),
    lastName: String(data.lastName).trim(),
    email: String(data.email).trim(),
    phone: String(data.phone || "").trim(),
    parish: String(data.parish).trim(),
    region: String(data.region).trim(),
    airportTransportation: data.airportTransportation,
    accessibilityNeeded: data.accessibilityNeeded,
    accessibilityDetails: data.accessibilityDetails || "",
    emergencyName: String(data.emergencyName).trim(),
    emergencyPhone: String(data.emergencyPhone).trim(),
    participants: participants,
    quote: quote,
    payment: payment,
  };
}

function stripeFeeCents_(chargeCents, method) {
  if (method === "ach") return Math.min(Math.round(chargeCents * 0.008), 500);
  if (method === "pay-later") return Math.round(chargeCents * 0.0599) + 30;
  return Math.round(chargeCents * 0.029) + 30;
}

function chargeWithProcessingFee_(netDollars, method) {
  var netCents = Math.round(Number(netDollars) * 100);
  var chargeCents = netCents;
  while (chargeCents - stripeFeeCents_(chargeCents, method) < netCents) chargeCents += 1;
  return { chargeCents: chargeCents, feeCents: chargeCents - netCents };
}

function applyProcessingFee_(payment, method) {
  var methods = {
    card: { label: "Card", stripeType: "card" },
    ach: { label: "ACH bank debit", stripeType: "us_bank_account" },
    "pay-later": { label: "Pay later", stripeType: "klarna" },
  };
  var selected = methods[method];
  if (!selected) throw new Error("Choose a payment method.");
  if (payment.balanceCents > 0 && method !== "card") {
    throw new Error("The March installment plan is available for card payments. ACH and pay later are charged in full.");
  }
  var today = chargeWithProcessingFee_(payment.chargeCents / 100, method === "ach" || method === "pay-later" ? method : "card");
  var later = payment.balanceCents > 0 ? chargeWithProcessingFee_(payment.balanceCents / 100, "card") : { chargeCents: 0, feeCents: 0 };
  payment.chargeCents = today.chargeCents;
  payment.balanceCents = later.chargeCents;
  payment.feeCents = today.feeCents + later.feeCents;
  payment.methodLabel = selected.label;
  payment.stripeType = selected.stripeType;
  return payment;
}

function applyTestPayment_(payment, testCode, plan) {
  var code = String(testCode || "").trim();
  if (!code) return payment;
  var secret = PropertiesService.getScriptProperties().getProperty("TEST_PAYMENT_SECRET");
  if (!secret || code !== String(secret).trim()) {
    throw new Error("Test payment code was not accepted.");
  }
  if (plan === "installments") {
    var due = new Date();
    due.setDate(due.getDate() + 1);
    due.setHours(0, 5, 0, 0);
    return {
      planLabel: "Test payment — two installments",
      chargeCents: 55,
      balanceCents: 55,
      dueLabel: Utilities.formatDate(due, Session.getScriptTimeZone(), "MMMM d, yyyy"),
      dueAt: due.toISOString(),
      chargeName: "36th Family Conference 2027 — test installment 1 of 2",
      feeCents: 0,
      methodLabel: "Card",
      stripeType: "card",
      testPayment: true,
    };
  }
  return {
    planLabel: "Test payment — paid in full",
    chargeCents: 50,
    balanceCents: 0,
    dueLabel: "",
    dueAt: "",
    chargeName: "36th Family Conference 2027 — test payment",
    feeCents: 0,
    methodLabel: "Card",
    stripeType: "card",
    testPayment: true,
  };
}

function buildPayment_(totalDollars, plan) {
  var totalCents = Math.round(Number(totalDollars) * 100);
  var due = new Date("2027-03-01T06:00:00.000Z");
  if (plan === "installments") {
    if (new Date().getTime() >= due.getTime()) {
      throw new Error("Installments are no longer available. Please pay in full.");
    }
    var dueToday = Math.ceil(totalCents / 2);
    return {
      planLabel: "Two installments",
      chargeCents: dueToday,
      balanceCents: totalCents - dueToday,
      dueLabel: "March 1, 2027",
      dueAt: "2027-03-01T06:00:00.000Z",
      chargeName: "36th Family Conference 2027 — installment 1 of 2",
    };
  }
  return {
    planLabel: "Paid in full",
    chargeCents: totalCents,
    balanceCents: 0,
    dueLabel: "",
    dueAt: "",
    chargeName: "36th Family Conference 2027 registration",
  };
}

function registrationPaymentLine_(quote, data) {
  var payment = data.payment || {};
  if (payment.testPayment && payment.balanceCents > 0) {
    return (
      "TEST PAYMENT. Installment 1 of 2 charged today: " +
      money_(payment.chargeCents / 100) +
      ". Installment 2 of 2, " +
      money_(payment.balanceCents / 100) +
      ", will be charged on " +
      payment.dueLabel +
      " to the same card. The package total of " +
      money_(quote.total) +
      " was not charged."
    );
  }
  if (payment.testPayment) {
    return (
      "TEST PAYMENT. Amount charged in full through Stripe: " +
      money_(payment.chargeCents / 100) +
      ". The package total of " +
      money_(quote.total) +
      " was not charged."
    );
  }
  var feeNote =
    " Package price: " +
    money_(quote.total) +
    ". Stripe processing fee (" +
    (payment.methodLabel || "Card") +
    "): " +
    money_((payment.feeCents || 0) / 100) +
    ".";
  if (payment.balanceCents > 0) {
    return (
      "Amount paid today through Stripe: " +
      money_(payment.chargeCents / 100) +
      " (installment 1 of 2). Remaining balance: " +
      money_(payment.balanceCents / 100) +
      (payment.cardSaved === false
        ? ". We could not save the card for the second charge, so the registration team will contact you about the remaining balance."
        : ", to be charged automatically on March 1, 2027 to the same card.") +
      feeNote
    );
  }
  return "Amount paid in full through Stripe: " + money_((payment.chargeCents || Math.round(quote.total * 100)) / 100) + "." + feeNote;
}

function money_(amount) {
  var cents = Math.round(Number(amount || 0) * 100);
  var dollars = Math.floor(Math.abs(cents) / 100);
  var remainder = Math.abs(cents) % 100;
  var text = "$" + dollars.toLocaleString("en-US");
  if (remainder) text += "." + ("0" + remainder).slice(-2);
  return cents < 0 ? "-" + text : text;
}

function priceRegistration_(categories) {
  var tier = new Date().getTime() < new Date("2027-02-01T06:00:00.000Z").getTime() ? "earlyBird" : "regular";
  var packages = [
    { id: "single", label: "Single Occupancy", included: 1, earlyBird: 849, regular: 949 },
    { id: "double", label: "Double Occupancy (per room)", included: 2, earlyBird: 1449, regular: 1599 },
    { id: "family3", label: "Family of 3 (per room)", included: 3, earlyBird: 1749, regular: 1999 },
    { id: "family4", label: "Family of 4 (per room)", included: 4, earlyBird: 1899, regular: 2199 },
  ];
  var extraAdultRate = tier === "earlyBird" ? 449 : 499;
  var extraChildRate = tier === "earlyBird" ? 349 : 399;
  function rank(category) {
    if (category === "child-free") return 0;
    if (category === "child") return 1;
    return 2;
  }
  var ranked = categories
    .map(function (category, index) { return { index: index, rank: rank(category) }; })
    .filter(function (person) { return person.rank > 0; })
    .sort(function (a, b) { return b.rank - a.rank || a.index - b.index; });
  var selected = ranked.length ? packages[Math.min(ranked.length, 4) - 1] : null;
  var included = {};
  ranked.slice(0, selected ? selected.included : 0).forEach(function (person) { included[person.index] = true; });
  var lines = categories.map(function (category, index) {
    if (rank(category) === 0) return { billing: "free" };
    if (included[index]) return { billing: "included" };
    return { billing: category === "child" ? "extra-child" : "extra-adult" };
  });
  var extraAdults = lines.filter(function (line) { return line.billing === "extra-adult"; }).length;
  var extraChildren = lines.filter(function (line) { return line.billing === "extra-child"; }).length;
  var freeChildren = lines.filter(function (line) { return line.billing === "free"; }).length;
  var packagePrice = selected ? selected[tier] : 0;
  var partySize = categories.length;
  var room = partySize ? packages[Math.min(partySize, 4) - 1] : null;
  return {
    tier: tier,
    tierLabel: tier === "earlyBird" ? "Early bird (through January 31, 2027)" : "Regular (from February 1, 2027)",
    packageId: selected ? selected.id : "",
    packageLabel: selected ? selected.label : "",
    roomLabel: room ? room.label : "",
    packagePrice: packagePrice,
    occupancy: ranked.length,
    partySize: partySize,
    extraAdults: extraAdults,
    extraAdultRate: extraAdultRate,
    extraChildren: extraChildren,
    extraChildRate: extraChildRate,
    freeChildren: freeChildren,
    needsExtraRoom: categories.length > 4,
    total: packagePrice + extraAdults * extraAdultRate + extraChildren * extraChildRate,
    lines: lines,
  };
}

function returnOrigin_(origin) {
  var clean = String(origin || "").replace(/\/$/, "");
  var allowed = {
    "https://marthomanafc27.org": true,
    "https://www.marthomanafc27.org": true,
    "http://127.0.0.1:3000": true,
    "http://localhost:3000": true,
  };
  return allowed[clean] ? clean : "https://marthomanafc27.org";
}

function stripeSecret_() {
  var key = PropertiesService.getScriptProperties().getProperty("STRIPE_SECRET_KEY");
  if (!key) {
    throw new Error("Stripe is not configured yet. Add STRIPE_SECRET_KEY in the Apps Script project settings, then redeploy.");
  }
  return key;
}

function stripeRequest_(path, payload) {
  var options = {
    method: payload ? "post" : "get",
    headers: { Authorization: "Bearer " + stripeSecret_() },
    muteHttpExceptions: true,
  };
  if (payload) options.payload = payload;
  var response = UrlFetchApp.fetch("https://api.stripe.com/v1" + path, options);
  var body = JSON.parse(response.getContentText() || "{}");
  if (response.getResponseCode() >= 400) {
    throw new Error(body.error && body.error.message ? body.error.message : "Stripe request failed.");
  }
  return body;
}

function savePending_(registrationId, registration) {
  var sheet = getSheet_("Pending", PENDING_HEADERS);
  sheet.appendRow([new Date(), registrationId, "", "pending", JSON.stringify(registration)]);
}

function setPendingSession_(registrationId, sessionId) {
  updatePending_(registrationId, { sessionId: sessionId });
}

function markPending_(registrationId, status) {
  updatePending_(registrationId, { status: status });
}

function updatePending_(registrationId, patch) {
  var sheet = getSheet_("Pending", PENDING_HEADERS);
  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (values[i][1] === registrationId) {
      if (patch.sessionId) sheet.getRange(i + 1, 3).setValue(patch.sessionId);
      if (patch.status) sheet.getRange(i + 1, 4).setValue(patch.status);
      return;
    }
  }
}

function loadPending_(registrationId) {
  if (!registrationId) return null;
  var sheet = getSheet_("Pending", PENDING_HEADERS);
  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (values[i][1] === registrationId) {
      return JSON.parse(values[i][4]);
    }
  }
  return null;
}

function scheduleInstallment_(registrationId, registration, session) {
  var intent = session.payment_intent;
  var paymentMethod = intent && typeof intent === "object" ? intent.payment_method : "";
  if (paymentMethod && typeof paymentMethod === "object") paymentMethod = paymentMethod.id;
  var customer = session.customer || "";
  var saved = Boolean(customer && paymentMethod);
  registration.payment.cardSaved = saved;
  var sheet = getSheet_("Installments", INSTALLMENT_HEADERS);
  sheet.appendRow([
    registrationId,
    registration.email,
    registration.firstName + " " + registration.lastName,
    customer,
    paymentMethod,
    registration.payment.balanceCents,
    registration.payment.dueAt ? new Date(registration.payment.dueAt) : new Date("2027-03-01T06:00:00.000Z"),
    saved ? "scheduled" : "card not saved",
    "",
  ]);
}

function installInstallmentTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === "chargeDueInstallments") return;
  }
  ScriptApp.newTrigger("chargeDueInstallments").timeBased().everyDays(1).create();
}

function chargeDueInstallments() {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var sheet = getSheet_("Installments", INSTALLMENT_HEADERS);
    if (sheet.getLastRow() < 2) return;
    var values = sheet.getDataRange().getValues();
    var now = new Date().getTime();
    for (var i = 1; i < values.length; i++) {
      if (values[i][7] !== "scheduled") continue;
      if (new Date(values[i][6]).getTime() > now) continue;
      var registrationId = values[i][0];
      var email = values[i][1];
      var name = values[i][2];
      var balanceCents = Number(values[i][5]);
      try {
        var intent = stripeRequest_("/payment_intents", {
          amount: String(balanceCents),
          currency: "usd",
          customer: values[i][3],
          payment_method: values[i][4],
          off_session: "true",
          confirm: "true",
          description:
            balanceCents === 55
              ? "36th Family Conference 2027 — test installment 2 of 2"
              : "36th Family Conference 2027 — installment 2 of 2",
          "metadata[registrationId]": registrationId,
        });
        sheet.getRange(i + 1, 8).setValue("paid");
        sheet.getRange(i + 1, 9).setValue(intent.id);
        updateRegistrationPaymentStatus_(
          registrationId,
          balanceCents === 55 ? "Test payment — paid in full" : "Paid in full",
          0
        );
        MailApp.sendEmail({
          to: email,
          bcc: NOTIFY_EMAIL,
          name: "36th Family Conference 2027",
          replyTo: CONFERENCE_EMAIL,
          subject: (balanceCents === 55 ? "TEST installment received — " : "Installment received — ") + "36th Family Conference 2027",
          body:
            "Hello " +
            name +
            ",\n\nWe charged the remaining " +
            money_(balanceCents / 100) +
            " for your 36th Family Conference 2027 registration. Your balance is now paid in full.\n\nQuestions: " +
            CONFERENCE_EMAIL +
            " or " +
            CONFERENCE_PHONE +
            ".",
        });
      } catch (error) {
        sheet.getRange(i + 1, 8).setValue("failed");
        MailApp.sendEmail({
          to: email,
          bcc: NOTIFY_EMAIL,
          name: "36th Family Conference 2027",
          replyTo: CONFERENCE_EMAIL,
          subject: "Installment payment needs attention — 36th Family Conference 2027",
          body:
            "Hello " +
            name +
            ",\n\nWe could not charge the remaining " +
            money_(balanceCents / 100) +
            " on the card used for your first installment. Please contact " +
            CONFERENCE_EMAIL +
            " or " +
            CONFERENCE_PHONE +
            " to complete the balance.\n\n" +
            error,
        });
      }
    }
  } finally {
    lock.releaseLock();
  }
}

function updateRegistrationPaymentStatus_(registrationId, status, balance) {
  var sheet = getSheet_("Registrations", REGISTRATION_HEADERS);
  if (sheet.getLastRow() < 2) return;
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var idCol = headers.indexOf("Registration ID");
  var statusCol = headers.indexOf("Payment status");
  var balanceCol = headers.indexOf("Balance remaining");
  if (idCol === -1) return;
  var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  for (var i = 0; i < rows.length; i++) {
    if (rows[i][idCol] === registrationId) {
      if (statusCol !== -1) sheet.getRange(i + 2, statusCol + 1).setValue(status);
      if (balanceCol !== -1) sheet.getRange(i + 2, balanceCol + 1).setValue(balance);
      return;
    }
  }
}

function findRegistrationIdBySession_(sessionId) {
  var sheet = getSheet_("Registrations", REGISTRATION_HEADERS);
  if (sheet.getLastRow() < 2) return "";
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var sessionCol = headers.indexOf("Stripe session ID");
  var idCol = headers.indexOf("Registration ID");
  if (sessionCol === -1 || idCol === -1) return "";
  var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  for (var i = 0; i < values.length; i++) {
    if (values[i][sessionCol] === sessionId) return values[i][idCol];
  }
  return "";
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
