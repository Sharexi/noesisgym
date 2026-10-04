import live from "./live.json";
import type { SourceId } from "./sources";

/** A number with where it came from. */
export interface Sourced<T = number> {
  value: T;
  source: SourceId;
  /** Set when we computed the value from sourced figures instead of reading it. */
  derivation?: string;
}

/** A low / typical / high range, each end sourced separately. */
export interface SourcedRange {
  low: Sourced;
  typical: Sourced;
  high: Sourced;
}

export interface Gpu {
  id: string;
  name: string;
  /** Board power under sustained load, in watts. */
  loadWatts: Sourced;
  /** GPU power at idle, in watts. */
  idleWatts: Sourced;
  /** What renters pay per GPU-hour on marketplaces, in USD. */
  rentalUsdPerHour: SourcedRange;
}

export const gpus: Gpu[] = [
  {
    id: "rtx-3090",
    name: "RTX 3090",
    loadWatts: { value: 350, source: "nvidiaRtx3090" },
    idleWatts: { value: 18, source: "rtx3090IdlePower" },
    rentalUsdPerHour: {
      low: { value: live.rental["rtx-3090"].low, source: "vastRtx3090" },
      typical: { value: live.rental["rtx-3090"].typical, source: "vastRtx3090" },
      high: { value: live.rental["rtx-3090"].high, source: "vastRtx3090" },
    },
  },
  {
    id: "rtx-4090",
    name: "RTX 4090",
    loadWatts: { value: 450, source: "nvidiaRtx4090" },
    idleWatts: { value: 22, source: "idlePowerTpu" },
    rentalUsdPerHour: {
      low: { value: live.rental["rtx-4090"].low, source: "vastRtx4090" },
      typical: { value: live.rental["rtx-4090"].typical, source: "vastRtx4090" },
      high: { value: live.rental["rtx-4090"].high, source: "vastRtx4090" },
    },
  },
  {
    id: "rtx-5090",
    name: "RTX 5090",
    loadWatts: { value: 575, source: "nvidiaRtx5090" },
    idleWatts: { value: 30, source: "idlePowerTpu" },
    rentalUsdPerHour: {
      low: { value: live.rental["rtx-5090"].low, source: "vastRtx5090" },
      typical: { value: live.rental["rtx-5090"].typical, source: "vastRtx5090" },
      high: { value: live.rental["rtx-5090"].high, source: "vastRtx5090" },
    },
  },
];

export interface ElectricityPreset {
  id: string;
  name: string;
  /** Household price per kWh in the local currency, taxes included. */
  pricePerKwh: Sourced;
  currency: "EUR" | "USD";
}

export const electricityPresets: ElectricityPreset[] = [
  { id: "eu", name: "EU average", pricePerKwh: { value: live.electricity.eu.value, source: "eurostatHouseholds" }, currency: "EUR" },
  { id: "de", name: "Germany", pricePerKwh: { value: live.electricity.de.value, source: "eurostatHouseholds" }, currency: "EUR" },
  { id: "it", name: "Italy", pricePerKwh: { value: live.electricity.it.value, source: "eurostatHouseholds" }, currency: "EUR" },
  { id: "es", name: "Spain", pricePerKwh: { value: live.electricity.es.value, source: "eurostatHouseholds" }, currency: "EUR" },
  { id: "us", name: "United States", pricePerKwh: { value: live.electricity.us.value, source: "eiaResidential" }, currency: "USD" },
];

/** USD per 1 EUR. */
export const eurUsd: Sourced = { value: live.eurUsd.value, source: "ecbEurUsd" };

/**
 * Assumptions we could not source to a single figure. Shown as such on the
 * page, and every one is editable by the visitor.
 */
export const assumptions = {
  /** Share of hours the GPU is actually rented. */
  utilization: { low: 0.4, typical: 0.6, high: 0.8 },
  /** Platform's cut of the renter price before it reaches the host. */
  platformFee: { low: 0.2, typical: 0.1, high: 0 },
  /** Rest of the PC (CPU, board, fans, PSU losses) while hosting, in watts. */
  systemWatts: 80,
};
