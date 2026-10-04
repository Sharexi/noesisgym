// Refreshes src/data/live.json from the original sources.
//
//   node scripts/update-data.mjs
//
// Each group (a GPU's prices, EU electricity, US electricity, EUR/USD) is
// replaced only if the new figures pass the checks below. A group that fails
// keeps its old values and the script exits 1 after writing the others.

import { readFile, writeFile } from "node:fs/promises";
import { fetchEcb, fetchEia, fetchEurostat, fetchVastOffers } from "./feeds.mjs";

const FILE = new URL("../src/data/live.json", import.meta.url);
const MAX_MOVE = 0.5; // reject a figure that moved more than 50% since the last run

const GPUS = { "rtx-3090": "RTX 3090", "rtx-4090": "RTX 4090", "rtx-5090": "RTX 5090" };

/** Throws if `next` is outside [min, max] or moved too far from `prev`. */
export function check(label, next, prev, [min, max]) {
  if (!Number.isFinite(next) || next < min || next > max) throw new Error(`${label}: ${next} outside ${min}–${max}`);
  if (prev && Math.abs(next / prev - 1) > MAX_MOVE) throw new Error(`${label}: moved from ${prev} to ${next}`);
}

export function checkRental(next, prev) {
  check("low", next.low, prev?.low, [0.03, 10]);
  check("typical", next.typical, prev?.typical, [0.03, 10]);
  check("high", next.high, prev?.high, [0.03, 10]);
  if (!(next.low <= next.typical && next.typical <= next.high)) throw new Error("prices not ordered low ≤ typical ≤ high");
}

async function main() {
  const live = JSON.parse(await readFile(FILE, "utf8"));
  const errors = [];
  const attempt = async (name, fn) => {
    try {
      await fn();
    } catch (e) {
      errors.push(`${name}: ${e.message}`);
    }
  };

  await Promise.all([
    ...Object.entries(GPUS).map(([id, gpuName]) =>
      attempt(`rental ${id}`, async () => {
        const next = await fetchVastOffers(gpuName);
        checkRental(next, live.rental[id]);
        live.rental[id] = next;
      }),
    ),
    attempt("eurostat", async () => {
      const { prices, asOf } = await fetchEurostat();
      for (const [key, value] of Object.entries(prices)) check(`eurostat ${key}`, value, live.electricity[key]?.value, [0.03, 1]);
      for (const [key, value] of Object.entries(prices)) live.electricity[key] = { value, asOf };
    }),
    attempt("eia", async () => {
      const next = await fetchEia();
      check("eia us", next.value, live.electricity.us?.value, [0.03, 1]);
      live.electricity.us = next;
    }),
    attempt("ecb", async () => {
      const next = await fetchEcb();
      check("ecb eurUsd", next.value, live.eurUsd?.value, [0.5, 2]);
      live.eurUsd = next;
    }),
  ]);

  await writeFile(FILE, `${JSON.stringify(live, null, 2)}\n`);
  if (errors.length) {
    console.error(`Kept old values for ${errors.length} group(s):\n${errors.map((e) => `- ${e}`).join("\n")}`);
    process.exit(1);
  }
  console.log("All figures refreshed.");
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
