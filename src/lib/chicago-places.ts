export type ChicagoPlace = {
  name: string;
  blurb: string;
  /** Address or place query used for Google Maps directions */
  mapsQuery: string;
};

export const chicagoLandmarks: ChicagoPlace[] = [
  {
    name: "Willis Tower (Skydeck)",
    blurb: "Chicago’s landmark skyscraper with skyline views from the glass-floor Skydeck.",
    mapsQuery: "Willis Tower Skydeck, 233 S Wacker Dr, Chicago, IL",
  },
  {
    name: "Millennium Park",
    blurb: "Home of Cloud Gate (“The Bean”), Crown Fountain, and summer outdoor concerts.",
    mapsQuery: "Millennium Park, Chicago, IL",
  },
  {
    name: "Navy Pier",
    blurb: "Lakefront destination with rides, walks, and views of the Chicago skyline.",
    mapsQuery: "Navy Pier, Chicago, IL",
  },
  {
    name: "Art Institute of Chicago",
    blurb: "World-class museum on Michigan Avenue — ideal for a quieter family outing.",
    mapsQuery: "Art Institute of Chicago, Chicago, IL",
  },
  {
    name: "Maggie Daley Park",
    blurb: "Playgrounds, climbing walls, and open green space next to Millennium Park.",
    mapsQuery: "Maggie Daley Park, Chicago, IL",
  },
  {
    name: "Chicago Riverwalk",
    blurb: "Scenic walkway along the river with bridges, boats, and downtown architecture.",
    mapsQuery: "Chicago Riverwalk, Chicago, IL",
  },
];

export const chicagoFoodSpots: ChicagoPlace[] = [
  {
    name: "Giordano's",
    blurb: "Famous stuffed deep-dish pizza — a classic Chicago first stop for many visitors.",
    mapsQuery: "Giordano's Pizza Magnificent Mile, Chicago, IL",
  },
  {
    name: "Portillo's",
    blurb: "Iconic Chicago dogs, Italian beef, and chocolate cake in a lively casual setting.",
    mapsQuery: "Portillo's, 100 W Ontario St, Chicago, IL",
  },
  {
    name: "Lou Malnati's Pizzeria",
    blurb: "Beloved deep-dish institution with buttery crusts and family-friendly dining.",
    mapsQuery: "Lou Malnati's Pizzeria, 439 N Wells St, Chicago, IL",
  },
  {
    name: "The Purple Pig",
    blurb: "Mediterranean small plates near Michigan Avenue — great for sharing.",
    mapsQuery: "The Purple Pig, 444 N Michigan Ave, Chicago, IL",
  },
  {
    name: "Girl & the Goat",
    blurb: "West Loop favorite known for bold seasonal plates and a lively atmosphere.",
    mapsQuery: "Girl & the Goat, 809 W Randolph St, Chicago, IL",
  },
  {
    name: "Garrett Popcorn Shops",
    blurb: "A Chicago snack tradition — perfect for a quick treat while sightseeing.",
    mapsQuery: "Garrett Popcorn Shops, 625 N Michigan Ave, Chicago, IL",
  },
];

export function mapsDirectionsUrl(mapsQuery: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapsQuery)}`;
}
