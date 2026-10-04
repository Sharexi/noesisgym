import { assumptions, type Gpu } from "@/data/inputs";
import { runScenario, type ScenarioResult } from "./model";

export type Level = "low" | "typical" | "high";
export const levels: Level[] = ["low", "typical", "high"];

export interface UserSettings {
  usdPerKwh: number;
  utilization: number;
  platformFee: number;
  systemWatts: number;
}

export const defaultSettings = (usdPerKwh: number): UserSettings => ({
  usdPerKwh,
  utilization: assumptions.utilization.typical,
  platformFee: assumptions.platformFee.typical,
  systemWatts: assumptions.systemWatts,
});

/** One result per rental-price level, everything else held at the user's settings. */
export function scenariosFor(gpu: Gpu, s: UserSettings): Record<Level, ScenarioResult> {
  const run = (level: Level) =>
    runScenario({
      rentalUsdPerHour: gpu.rentalUsdPerHour[level].value,
      utilization: s.utilization,
      platformFee: s.platformFee,
      loadWatts: gpu.loadWatts.value,
      idleWatts: gpu.idleWatts.value,
      systemWatts: s.systemWatts,
      usdPerKwh: s.usdPerKwh,
    });
  return { low: run("low"), typical: run("typical"), high: run("high") };
}
