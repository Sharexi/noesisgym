import { describe, expect, it } from "vitest";
import { gpus, electricityPresets } from "@/data/inputs";
import { sources } from "@/data/sources";
import { kwhPerDay, runScenario, type ScenarioInput } from "./model";

const base: ScenarioInput = {
  rentalUsdPerHour: 0.25,
  utilization: 0.6,
  platformFee: 0.1,
  loadWatts: 450,
  idleWatts: 22,
  systemWatts: 80,
  usdPerKwh: 0.2,
};

describe("runScenario", () => {
  it("matches a hand-computed RTX 4090 example", () => {
    // Rented 14.4 h, idle 9.6 h.
    // Gross: 0.25 × 14.4 × 0.9 = 3.24
    // Energy: (530 × 14.4 + 102 × 9.6) / 1000 = 7.632 + 0.9792 = 8.6112 kWh
    // Power cost: 8.6112 × 0.2 = 1.72224
    const r = runScenario(base);
    expect(r.grossPerDay).toBeCloseTo(3.24, 6);
    expect(r.powerCostPerDay).toBeCloseTo(1.72224, 6);
    expect(r.netPerDay).toBeCloseTo(1.51776, 6);
    expect(r.netPer30Days).toBeCloseTo(45.5328, 4);
    expect(r.breakEvenUsdPerKwh).toBeCloseTo(3.24 / 8.6112, 6);
  });

  it("goes negative when the machine is never rented", () => {
    const r = runScenario({ ...base, utilization: 0 });
    expect(r.grossPerDay).toBe(0);
    expect(r.netPerDay).toBeLessThan(0);
    expect(r.breakEvenUsdPerKwh).toBe(0);
  });

  it("has zero net exactly at the break-even price", () => {
    const { breakEvenUsdPerKwh } = runScenario(base);
    expect(runScenario({ ...base, usdPerKwh: breakEvenUsdPerKwh }).netPerDay).toBeCloseTo(0, 9);
  });

  it("rejects out-of-range inputs", () => {
    expect(() => runScenario({ ...base, utilization: 1.2 })).toThrow(RangeError);
    expect(() => runScenario({ ...base, platformFee: -0.1 })).toThrow(RangeError);
    expect(() => runScenario({ ...base, usdPerKwh: Number.NaN })).toThrow(RangeError);
  });
});

describe("kwhPerDay", () => {
  it("counts system power for all 24 hours", () => {
    expect(kwhPerDay({ utilization: 1, loadWatts: 0, idleWatts: 0, systemWatts: 100 })).toBeCloseTo(2.4, 9);
    expect(kwhPerDay({ utilization: 0, loadWatts: 0, idleWatts: 0, systemWatts: 100 })).toBeCloseTo(2.4, 9);
  });
});

describe("data integrity", () => {
  const allSourced = [
    ...gpus.flatMap((g) => [g.loadWatts, g.idleWatts, g.rentalUsdPerHour.low, g.rentalUsdPerHour.typical, g.rentalUsdPerHour.high]),
    ...electricityPresets.map((p) => p.pricePerKwh),
  ];

  it("points every figure at a known source", () => {
    for (const s of allSourced) expect(sources).toHaveProperty(s.source);
  });

  it("orders every price range low ≤ typical ≤ high", () => {
    for (const g of gpus) {
      const { low, typical, high } = g.rentalUsdPerHour;
      expect(low.value).toBeLessThanOrEqual(typical.value);
      expect(typical.value).toBeLessThanOrEqual(high.value);
    }
  });

  it("gives every source an ISO date and an https URL", () => {
    for (const s of Object.values(sources)) {
      expect(s.asOf).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(s.url).toMatch(/^https:\/\//);
    }
  });
});
