import live from "./live.json";

/**
 * Every figure on the site points to an entry here.
 *
 * `verification` says how far we have checked it:
 * - "primary":   read on the publisher's own page (manufacturer, platform, statistics office)
 * - "secondary": read on a third-party page we opened ourselves
 * - "snippet":   seen only in a search result summary, or the page could not be opened; not confirmed
 */
export type Verification = "primary" | "secondary" | "snippet";

export interface Source {
  id: string;
  title: string;
  url: string;
  publisher: string;
  /** Date the figure refers to, or when it was captured (ISO yyyy-mm-dd). */
  asOf: string;
  verification: Verification;
  note?: string;
}

export const sources = {
  vastFeesRemoved: {
    id: "vastFeesRemoved",
    title: "June 2024 Product Update (host fees removed)",
    url: "https://vast.ai/article/june-2024-product-update",
    publisher: "Vast.ai",
    asOf: "2024-06-01",
    verification: "primary",
    note: "Host fee removed and replaced by an internal surcharge; \"the prices hosts set will be the prices they earn\". Vast does not say how large the surcharge is.",
  },
  nvidiaRtx3090: {
    id: "nvidiaRtx3090",
    title: "GeForce RTX 3090 and 3090 Ti: graphics card power",
    url: "https://www.nvidia.com/en-us/geforce/graphics-cards/30-series/rtx-3090-3090ti/",
    publisher: "NVIDIA",
    asOf: "2026-10-04",
    verification: "primary",
    note: "Graphics card power 350 W for the RTX 3090 (450 W for the 3090 Ti).",
  },
  nvidiaRtx4090: {
    id: "nvidiaRtx4090",
    title: "GeForce RTX 4090 specifications",
    url: "https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4090/",
    publisher: "NVIDIA",
    asOf: "2026-10-04",
    verification: "primary",
    note: "Total graphics power 450 W.",
  },
  nvidiaRtx5090: {
    id: "nvidiaRtx5090",
    title: "GeForce RTX 5090 specifications",
    url: "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5090/",
    publisher: "NVIDIA",
    asOf: "2026-10-04",
    verification: "primary",
    note: "Total graphics power 575 W.",
  },
  rtx3090IdlePower: {
    id: "rtx3090IdlePower",
    title: "RTX 3090 wattage: power consumption requirements",
    url: "https://techbriefly.com/2024/01/08/rtx-3090-wattage-power-consumption/",
    publisher: "TechBriefly",
    asOf: "2024-01-08",
    verification: "secondary",
    note: "About 18 W at idle with one monitor, about 26 W with two. Not a measurement of ours.",
  },
  idlePowerTpu: {
    id: "idlePowerTpu",
    title: "RTX 5090 Founders Edition review: power consumption",
    url: "https://www.techpowerup.com/review/nvidia-geforce-rtx-5090-founders-edition/43.html",
    publisher: "TechPowerUp",
    asOf: "2025-01-23",
    verification: "snippet",
    note: "Idle: RTX 5090 about 30 W, RTX 4090 about 22 W. The page blocks automated access and the figures are in charts, so they were not confirmed.",
  },
  utilizationRange: {
    id: "utilizationRange",
    title: "Vast AI rent my GPU: what GPU marketplace renting really means",
    url: "https://www.gmicloud.ai/en/blog/vast-ai-rent-my-gpu-explained",
    publisher: "GMI Cloud",
    asOf: "2026-10-04",
    verification: "secondary",
    note: "Qualitative only: a card earns nothing while unrented, and hosts without a reliability record are skipped. It gives no utilization figure.",
  },
  vastRtx3090: {
    id: "vastRtx3090",
    title: "Vast.ai marketplace offers: RTX 3090",
    url: "https://docs.vast.ai/api-reference/search/search-offers",
    publisher: "Vast.ai",
    asOf: live.rental["rtx-3090"].asOf,
    verification: "primary",
    note: `Refreshed automatically from Vast.ai's search API: single-GPU RTX 3090 offers that can be rented now, host asking price per hour before the renter surcharge. Low is the cheapest, typical the median and high the 90th percentile of the ${live.rental["rtx-3090"].offers} cheapest offers (the API returns at most 64). Listed prices at one moment, not what hosts realised.`,
  },
  vastRtx4090: {
    id: "vastRtx4090",
    title: "Vast.ai marketplace offers: RTX 4090",
    url: "https://docs.vast.ai/api-reference/search/search-offers",
    publisher: "Vast.ai",
    asOf: live.rental["rtx-4090"].asOf,
    verification: "primary",
    note: `Refreshed automatically from Vast.ai's search API: single-GPU RTX 4090 offers that can be rented now, host asking price per hour before the renter surcharge. Low is the cheapest, typical the median and high the 90th percentile of the ${live.rental["rtx-4090"].offers} cheapest offers (the API returns at most 64). Listed prices at one moment, not what hosts realised.`,
  },
  vastRtx5090: {
    id: "vastRtx5090",
    title: "Vast.ai marketplace offers: RTX 5090",
    url: "https://docs.vast.ai/api-reference/search/search-offers",
    publisher: "Vast.ai",
    asOf: live.rental["rtx-5090"].asOf,
    verification: "primary",
    note: `Refreshed automatically from Vast.ai's search API: single-GPU RTX 5090 offers that can be rented now, host asking price per hour before the renter surcharge. Low is the cheapest, typical the median and high the 90th percentile of the ${live.rental["rtx-5090"].offers} cheapest offers (the API returns at most 64). Listed prices at one moment, not what hosts realised.`,
  },
  eurostatHouseholds: {
    id: "eurostatHouseholds",
    title: "Electricity prices for household consumers, bi-annual data (nrg_pc_204)",
    url: "https://ec.europa.eu/eurostat/databrowser/view/nrg_pc_204",
    publisher: "Eurostat",
    asOf: live.electricity.eu.asOf,
    verification: "primary",
    note: `Refreshed automatically from Eurostat's data API. Households using 2,500–4,999 kWh a year, all taxes included: EU €${live.electricity.eu.value}, Germany €${live.electricity.de.value}, Italy €${live.electricity.it.value}, Spain €${live.electricity.es.value} per kWh.`,
  },
  eiaResidential: {
    id: "eiaResidential",
    title: "Electric Power Monthly, Table 5.6.A (residential average)",
    url: "https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_6_a",
    publisher: "U.S. Energy Information Administration",
    asOf: live.electricity.us.asOf,
    verification: "primary",
    note: `Refreshed automatically. US residential average ${(live.electricity.us.value * 100).toFixed(2)} ¢/kWh (preliminary estimate for the latest month).`,
  },
  ecbEurUsd: {
    id: "ecbEurUsd",
    title: "Euro foreign exchange reference rates: USD",
    url: "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/eurofxref-graph-usd.en.html",
    publisher: "European Central Bank",
    asOf: live.eurUsd.asOf,
    verification: "primary",
    note: `Refreshed automatically. 1 EUR = ${live.eurUsd.value} USD on ${live.eurUsd.asOf}.`,
  },
} satisfies Record<string, Source>;

export type SourceId = keyof typeof sources;
