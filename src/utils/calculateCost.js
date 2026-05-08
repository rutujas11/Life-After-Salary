import { CITY_CONFIG } from "../data/cityConfig";

export function calculateOptionCost(option, decisionId, salary, city) {
  const cityData = CITY_CONFIG[city] || {};

  let total = 0;

  // RENT
  if (decisionId === "rent") {
    const rentData = cityData.rent || {};

    if (option.label === "Shared Apartment") {
      const [min, max] = rentData.shared || [8000, 12000];
      total = Math.round((min + max) / 2);
    }

    else if (option.label === "PG Accommodation") {
      const [min, max] = rentData.pg || [12000, 18000];
      total = Math.round((min + max) / 2);
    }

    else if (option.label === "1/2 BHK Flat") {
      const [min, max] = rentData.flat || [20000, 35000];
      total = Math.round((min + max) / 2);
    }
  }

  // FOOD
  else if (decisionId === "food") {
    const base =
      (option.baseCost || 0) *
      (cityData.foodMultiplier || 1);

    const extra =
      salary * (option.extraPercent || 0);

    total = base + extra;
  }

  // OTHER
  else {
    if (option.baseCost) {
      total += option.baseCost;
    }

    if (option.extraPercent) {
      total += salary * option.extraPercent;
    }

    if (option.costPercent) {
      total += salary * option.costPercent;
    }
  }

  return Math.round(total);
}