/**
 * Yellowstone Road Trip Fuel Data
 */

export interface FuelStop {
  id: number;
  location: string;
  state: string;
  pricePerGallon: number;
  gallons: number;
  odometer: number;
  distanceFromPrevious: number;
  mpg: number | null;
  cost: number;
  cumulativeDistance: number;
  cumulativeCost: number;
  cumulativeGallons: number;
  lat: number;
  lng: number;
  notes?: string;
}

export interface TripMetadata {
  finalTripA: number;
  finalTripB: number;
  finalOdometer: number;
  distanceToInitialGoMart: number;
  tripBResetOdometer: number;
  actualTotalTrip: number;
  tripBResetLocation: string;
}

interface RawStop {
  location: string;
  state: string;
  price: number;
  gallons: number;
  odometer: number;
  lat: number;
  lng: number;
  notes?: string;
}

const rawStops: RawStop[] = [
  { location: "Hurricane", state: "WV", price: 3.999, gallons: 11.253, odometer: 6027, lat: 38.4326, lng: -82.0201 },
  { location: "Morehead", state: "KY", price: 3.649, gallons: 13.153, odometer: 6159, lat: 38.1837, lng: -83.4327 },
  { location: "Magnolia", state: "KY", price: 3.599, gallons: 11.948, odometer: 6312, lat: 37.6984, lng: -85.7002 },
  { location: "Farley", state: "KY", price: 3.389, gallons: 14.901, odometer: 6516, lat: 37.8989, lng: -87.8561 },
  { location: "Pevely", state: "MO", price: 3.599, gallons: 14.726, odometer: 6703, lat: 38.2834, lng: -90.3926 },
  { location: "Boonville", state: "MO", price: 3.749, gallons: 14.402, odometer: 6895, lat: 38.9734, lng: -92.7432 },
  { location: "Lawrence", state: "KS", price: 3.699, gallons: 12.166, odometer: 7041, lat: 38.9717, lng: -95.2353 },
  { location: "Little Blue Township", state: "KS", price: 3.999, gallons: 14.061, odometer: 7197, lat: 39.3167, lng: -96.6167 },
  { location: "York", state: "NE", price: 3.999, gallons: 8.627, odometer: 7294, lat: 40.8681, lng: -97.592 },
  { location: "Broken Bow", state: "NE", price: 4.449, gallons: 12.408, odometer: 7428, lat: 41.4019, lng: -99.6393 },
  { location: "Valentine", state: "NE", price: 3.949, gallons: 11.903, odometer: 7558, lat: 42.8725, lng: -100.5508 },
  { location: "Wall", state: "SD", price: 4.279, gallons: 11.954, odometer: 7721, lat: 43.9922, lng: -102.2413 },
  { location: "Custer", state: "SD", price: 4.199, gallons: 13.324, odometer: 7950, lat: 43.7667, lng: -103.5988 },
  { location: "Spearfish", state: "SD", price: 4.039, gallons: 10.026, odometer: 8151, lat: 44.4908, lng: -103.8594 },
  { location: "Gillette", state: "WY", price: 4.359, gallons: 9.641, odometer: 8286, lat: 44.2911, lng: -105.5022 },
  { location: "Lovell", state: "WY", price: 4.429, gallons: 15.128, odometer: 8495, lat: 44.8375, lng: -108.3897 },
  { location: "Cody", state: "WY", price: 4.499, gallons: 4.069, odometer: 8552, lat: 44.5263, lng: -109.0565, notes: "Camper disconnected" },
  { location: "Yellowstone (Old Faithful)", state: "WY", price: 5.099, gallons: 6.114, odometer: 8644, lat: 44.4605, lng: -110.8281 },
  { location: "Yellowstone (Canyon)", state: "WY", price: 5.099, gallons: 6.81, odometer: 8766, lat: 44.734, lng: -110.4937, notes: "Trip B reset here" },
  { location: "Billings", state: "MT", price: 4.299, gallons: 10.066, odometer: 8939, lat: 45.7833, lng: -108.5007 },
  { location: "Hardin", state: "MT", price: 4.149, gallons: 7.222, odometer: 9028, lat: 45.7322, lng: -107.6117 },
  { location: "Miles City", state: "MT", price: 4.399, gallons: 9.32, odometer: 9148, lat: 46.4083, lng: -105.8406 },
  { location: "Dickinson", state: "ND", price: 4.069, gallons: 13.225, odometer: 9347, lat: 46.8792, lng: -102.7896 },
  { location: "Center", state: "ND", price: 3.999, gallons: 8.253, odometer: 9466, lat: 47.1164, lng: -101.2994 },
  { location: "Valley City", state: "ND", price: 3.949, gallons: 10.245, odometer: 9642, lat: 46.9233, lng: -98.0031 },
  { location: "Sauk Centre", state: "MN", price: 4.199, gallons: 13.056, odometer: 9831, lat: 45.7375, lng: -94.9525 },
  { location: "Eau Claire", state: "WI", price: 4.199, gallons: 15.021, odometer: 10028, lat: 44.8113, lng: -91.4985 },
  { location: "Madison", state: "WI", price: 4.099, gallons: 13.908, odometer: 10213, lat: 43.0731, lng: -89.4012 },
  { location: "Shelton", state: "IN", price: 3.339, gallons: 12.696, odometer: 10391, lat: 39.6031, lng: -85.7636 },
  { location: "New Haven", state: "IN", price: 3.349, gallons: 13.026, odometer: 10588, lat: 41.0706, lng: -85.0144 },
  { location: "Dayton", state: "OH", price: 4.299, gallons: 10.422, odometer: 10729, lat: 39.7589, lng: -84.1916 },
  { location: "Franklin Township", state: "OH", price: 4.179, gallons: 8.138, odometer: 10830, lat: 39.5489, lng: -82.4149 },
];

export const tripMetadata: TripMetadata = {
  finalTripA: 77.4,
  finalTripB: 2141.2,
  finalOdometer: 10907,
  distanceToInitialGoMart: 22.2,
  tripBResetOdometer: 10907 - 2141.2,
  actualTotalTrip: 10907 - (6027 - 22.2),
  tripBResetLocation: "Yellowstone (Canyon), WY",
};

export const fuelStops: FuelStop[] = rawStops.map((stop, index) => {
  const previousOdometer = index === 0 ? stop.odometer : rawStops[index - 1].odometer;
  const distanceFromPrevious = index === 0 ? 0 : stop.odometer - previousOdometer;
  const mpg = index === 0 ? null : distanceFromPrevious / stop.gallons;
  const cost = stop.price * stop.gallons;
  const previousStops = rawStops.slice(0, index);
  const cumulativeDistance = stop.odometer - rawStops[0].odometer;
  const cumulativeCost = previousStops.reduce((sum, s) => sum + s.price * s.gallons, 0) + cost;
  const cumulativeGallons = previousStops.reduce((sum, s) => sum + s.gallons, 0) + stop.gallons;

  return {
    id: index + 1,
    location: stop.location,
    state: stop.state,
    pricePerGallon: stop.price,
    gallons: stop.gallons,
    odometer: stop.odometer,
    distanceFromPrevious,
    mpg,
    cost,
    cumulativeDistance,
    cumulativeCost,
    cumulativeGallons,
    lat: stop.lat,
    lng: stop.lng,
    notes: stop.notes,
  };
});

export interface TripStats {
  totalMiles: number;
  totalGallons: number;
  totalCost: number;
  averageMpg: number;
  averagePricePerGallon: number;
  costPerMile: number;
  bestLeg: { from: string; to: string; mpg: number; index: number };
  worstLeg: { from: string; to: string; mpg: number; index: number };
  cheapestGas: { location: string; price: number; index: number };
  mostExpensiveGas: { location: string; price: number; index: number };
  statesVisited: string[];
  numberOfStops: number;
}

export function calculateTripStats(): TripStats {
  let bestLegIndex = 1;
  let worstLegIndex = 1;
  let bestMpg = 0;
  let worstMpg = Infinity;
  let cheapestIndex = 0;
  let mostExpensiveIndex = 0;
  let cheapestPrice = Infinity;
  let mostExpensivePrice = 0;

  fuelStops.forEach((stop, idx) => {
    if (stop.mpg !== null) {
      if (stop.mpg > bestMpg) {
        bestMpg = stop.mpg;
        bestLegIndex = idx;
      }
      if (stop.mpg < worstMpg) {
        worstMpg = stop.mpg;
        worstLegIndex = idx;
      }
    }
    if (stop.pricePerGallon < cheapestPrice) {
      cheapestPrice = stop.pricePerGallon;
      cheapestIndex = idx;
    }
    if (stop.pricePerGallon > mostExpensivePrice) {
      mostExpensivePrice = stop.pricePerGallon;
      mostExpensiveIndex = idx;
    }
  });

  const lastStop = fuelStops[fuelStops.length - 1];
  const statesVisited = [...new Set(fuelStops.map((s) => s.state))];
  const fromBest = fuelStops[bestLegIndex - 1];
  const toBest = fuelStops[bestLegIndex];
  const fromWorst = fuelStops[worstLegIndex - 1];
  const toWorst = fuelStops[worstLegIndex];
  const cheapest = fuelStops[cheapestIndex];
  const expensive = fuelStops[mostExpensiveIndex];

  return {
    totalMiles: lastStop.cumulativeDistance,
    totalGallons: lastStop.cumulativeGallons,
    totalCost: lastStop.cumulativeCost,
    averageMpg: lastStop.cumulativeDistance / lastStop.cumulativeGallons,
    averagePricePerGallon: lastStop.cumulativeCost / lastStop.cumulativeGallons,
    costPerMile: lastStop.cumulativeCost / lastStop.cumulativeDistance,
    bestLeg: {
      from: fromBest.location + ", " + fromBest.state,
      to: toBest.location + ", " + toBest.state,
      mpg: bestMpg,
      index: bestLegIndex,
    },
    worstLeg: {
      from: fromWorst.location + ", " + fromWorst.state,
      to: toWorst.location + ", " + toWorst.state,
      mpg: worstMpg,
      index: worstLegIndex,
    },
    cheapestGas: {
      location: cheapest.location + ", " + cheapest.state,
      price: cheapestPrice,
      index: cheapestIndex,
    },
    mostExpensiveGas: {
      location: expensive.location + ", " + expensive.state,
      price: mostExpensivePrice,
      index: mostExpensiveIndex,
    },
    statesVisited,
    numberOfStops: fuelStops.length,
  };
}
