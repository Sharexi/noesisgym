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
      low: { value: 0.108, source: "llmhosting3090" },
      typical: { value: 0.177, source: "llmhosting3090" },
      high: { value: 0.27, source: "rtx3090PricesHigh" },
    },
  },
  {
    id: "rtx-4090",
    name: "RTX 4090",
    loadWatts: { value: 450, source: "nvidiaRtx4090" },
    idleWatts: { value: 22, source: "idlePowerTpu" },
    rentalUsdPerHour: {
      low: { value: 0.27, source: "llmhosting4090" },
      typical: { value: 0.477, source: "llmhosting4090" },
      high: { value: 0.52, source: "rtx4090PricesHigh" },
    },
  },
  {
    id: "rtx-5090",
    name: "RTX 5090",
    loadWatts: { value: 575, source: "nvidiaRtx5090" },
    idleWatts: { value: 30, source: "idlePowerTpu" },
    rentalUsdPerHour: {
      low: { value: 0.404, source: "llmhosting5090" },
      typical: { value: 0.536, source: "llmhosting5090" },
      high: { value: 0.6, source: "vastHostEarnings" },
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
  { id: "eu", name: "EU average", pricePerKwh: { value: 0.2896, source: "eurostatH2_2025" }, currency: "EUR" },
  { id: "de", name: "Germany", pricePerKwh: { value: 0.3869, source: "eurostatH2_2025" }, currency: "EUR" },
  { id: "it", name: "Italy", pricePerKwh: { value: 0.2966, source: "eurostatH2_2025" }, currency: "EUR" },
  { id: "es", name: "Spain", pricePerKwh: { value: 0.2669, source: "eurostatH2_2025" }, currency: "EUR" },
  { id: "us", name: "United States", pricePerKwh: { value: 0.1831, source: "eiaResidential" }, currency: "USD" },
];

/** USD per 1 EUR. */
export const eurUsd: Sourced = { value: 1.1225, source: "ecbEurUsd" };

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
