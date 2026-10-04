import { describe, expect, it } from "vitest";
import { checkRental } from "../../scripts/update-data.mjs";
import { median, parseEcb, parseEia, parseEurostat, periodEnd, quantile, summarizeOffers } from "../../scripts/feeds.mjs";
import live from "@/data/live.json";
import { gpus } from "@/data/inputs";

describe("summarizeOffers", () => {
  const prices = Array.from({ length: 20 }, (_, i) => 0.1 + i * 0.01);

  it("takes the cheapest, the median and the 90th percentile", () => {
    const s = summarizeOffers(prices);
    expect(s.low).toBe(0.1);
    expect(s.typical).toBe(0.195);
    expect(s.high).toBe(0.27);
    expect(s.offers).toBe(20);
  });

  it("refuses a thin market", () => {
    expect(() => summarizeOffers([0.1, 0.2])).toThrow();
  });

  it("computes median and quantile of unsorted input", () => {
    expect(median([3, 1, 2])).toBe(2);
    expect(median([4, 1, 3, 2])).toBe(2.5);
    expect(quantile([5, 1, 4, 2, 3], 0.9)).toBe(5);
  });
});

describe("parsers", () => {
  it("reads the ECB USD rate and date", () => {
    const xml = "<Cube><Cube time='2026-10-02'><Cube currency='USD' rate='1.1225'/><Cube currency='JPY' rate='170.1'/></Cube></Cube>";
    expect(parseEcb(xml)).toEqual({ value: 1.1225, asOf: "2026-10-02" });
    expect(() => parseEcb("<html/>")).toThrow();
  });

  it("reads the EIA US residential price and month", () => {
    const html = `<table><caption>Table 5.6.A. Average Price of Electricity, by State, July 2026 and 2025 (Cents per Kilowatthour)</caption>
      <tr><td>Maryland</td><td>21.41</td></tr><tr><td>U.S. Total</td><td>18.31</td><td>17.45</td></tr></table>`;
    expect(parseEia(html)).toEqual({ value: 0.1831, asOf: "2026-07-31" });
    expect(() => parseEia("<html/>")).toThrow();
  });

  it("maps Eurostat periods to their last day", () => {
    expect(periodEnd("2025-S1")).toBe("2025-06-30");
    expect(periodEnd("2025-S2")).toBe("2025-12-31");
    expect(() => periodEnd("2025")).toThrow();
  });

  it("reads Eurostat JSON-stat and skips a period that lacks a country", () => {
    const data = {
      id: ["freq", "geo", "time"],
      size: [1, 2, 2],
      dimension: { geo: { category: { index: { DE: 0, IT: 1 } } }, time: { category: { index: { "2025-S1": 0, "2025-S2": 1 } } } },
      // DE: S1, S2 — IT: S1, (no S2 yet)
      value: { "0": 0.39, "1": 0.3869, "2": 0.3 },
    };
    expect(parseEurostat(data, { de: "DE", it: "IT" })).toEqual({ prices: { de: 0.39, it: 0.3 }, asOf: "2025-06-30" });
  });
});

describe("update guards", () => {
  const prev = { low: 0.1, typical: 0.2, high: 0.3 };

  it("accepts a normal move", () => {
    expect(() => checkRental({ low: 0.11, typical: 0.21, high: 0.31 }, prev)).not.toThrow();
  });

  it("rejects a jump of more than 50%", () => {
    expect(() => checkRental({ low: 0.11, typical: 0.4, high: 0.5 }, prev)).toThrow();
  });

  it("rejects unordered prices", () => {
    expect(() => checkRental({ low: 0.15, typical: 0.12, high: 0.3 }, undefined)).toThrow();
  });
});

describe("live data", () => {
  it("is what the calculator uses", () => {
    for (const g of gpus) expect(g.rentalUsdPerHour.typical.value).toBe(live.rental[g.id as keyof typeof live.rental].typical);
  });
});
