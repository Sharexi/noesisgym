/**
 * Net earnings model for renting out a home GPU.
 *
 * All money values are USD. All formulas are documented on /methodology and
 * covered by model.test.ts; change them together.
 */

export interface ScenarioInput {
  /** What renters pay per GPU-hour, USD. */
  rentalUsdPerHour: number;
  /** Share of hours rented, 0–1. */
  utilization: number;
  /** Platform cut of the rental price, 0–1. */
  platformFee: number;
  /** GPU watts while rented. */
  loadWatts: number;
  /** GPU watts while waiting for a renter. */
  idleWatts: number;
  /** Rest of the machine, watts, drawn whenever it is online. */
  systemWatts: number;
  /** Electricity price, USD per kWh. */
  usdPerKwh: number;
}

export interface ScenarioResult {
  grossPerDay: number;
  powerCostPerDay: number;
  netPerDay: number;
  netPer30Days: number;
  /** Electricity price (USD/kWh) at which net is zero. */
  breakEvenUsdPerKwh: number;
}

const HOURS_PER_DAY = 24;

export function kwhPerDay(i: Pick<ScenarioInput, "utilization" | "loadWatts" | "idleWatts" | "systemWatts">): number {
  const rentedHours = HOURS_PER_DAY * i.utilization;
  const idleHours = HOURS_PER_DAY - rentedHours;
  const wattHours = (i.loadWatts + i.systemWatts) * rentedHours + (i.idleWatts + i.systemWatts) * idleHours;
  return wattHours / 1000;
}

export function runScenario(i: ScenarioInput): ScenarioResult {
  validate(i);
  const grossPerDay = i.rentalUsdPerHour * HOURS_PER_DAY * i.utilization * (1 - i.platformFee);
  const kwh = kwhPerDay(i);
  const powerCostPerDay = kwh * i.usdPerKwh;
  const netPerDay = grossPerDay - powerCostPerDay;
  return {
    grossPerDay,
    powerCostPerDay,
    netPerDay,
    netPer30Days: netPerDay * 30,
    breakEvenUsdPerKwh: kwh > 0 ? grossPerDay / kwh : Infinity,
  };
}

function validate(i: ScenarioInput): void {
  const fractions: [string, number][] = [
    ["utilization", i.utilization],
    ["platformFee", i.platformFee],
  ];
  for (const [name, v] of fractions) {
    if (!(v >= 0 && v <= 1)) throw new RangeError(`${name} must be between 0 and 1, got ${v}`);
  }
  const nonNegative: [string, number][] = [
    ["rentalUsdPerHour", i.rentalUsdPerHour],
    ["loadWatts", i.loadWatts],
    ["idleWatts", i.idleWatts],
    ["systemWatts", i.systemWatts],
    ["usdPerKwh", i.usdPerKwh],
  ];
  for (const [name, v] of nonNegative) {
    if (!(v >= 0) || !Number.isFinite(v)) throw new RangeError(`${name} must be a non-negative number, got ${v}`);
  }
}
