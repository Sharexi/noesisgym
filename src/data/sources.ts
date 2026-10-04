/**
 * Every figure on the site points to an entry here.
 *
 * `verification` says how far we have checked it:
 * - "primary":   read on the publisher's own page (manufacturer, platform, statistics office)
 * - "secondary": read on a third-party page we opened ourselves
 * - "snippet":   seen only in a search result summary; must be checked before publishing
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
    verification: "snippet",
    note: "Hosts receive their asking price; Vast adds a renter-side surcharge of undisclosed size.",
  },
  rtx3090Power: {
    id: "rtx3090Power",
    title: "RTX 3090 wattage: power consumption requirements",
    url: "https://techbriefly.com/2024/01/08/rtx-3090-wattage-power-consumption/",
    publisher: "TechBriefly",
    asOf: "2024-01-08",
    verification: "snippet",
    note: "350 W board power; about 18 W at idle.",
  },
  rtx4090Power: {
    id: "rtx4090Power",
    title: "NVIDIA GeForce RTX 4090 full specs",
    url: "https://www.tweaktown.com/news/88450/nvidia-geforce-rtx-4090-full-specs-max-tgp-of-up-to-660w/index.html",
    publisher: "TweakTown",
    asOf: "2022-09-01",
    verification: "snippet",
    note: "450 W default board power.",
  },
  rtx5090Power: {
    id: "rtx5090Power",
    title: "RTX 5090 reportedly features TDP of 575W",
    url: "https://videocardz.com/newz/nvidia-geforce-rtx-5090-reportedly-features-tdp-of-575w-rtx-5080-set-at-360w",
    publisher: "VideoCardz",
    asOf: "2025-01-01",
    verification: "snippet",
    note: "575 W total graphics power.",
  },
  idlePowerTpu: {
    id: "idlePowerTpu",
    title: "RTX 5090 Founders Edition review: value and conclusion",
    url: "https://www.techpowerup.com/review/nvidia-geforce-rtx-5090-founders-edition/46.html",
    publisher: "TechPowerUp",
    asOf: "2025-01-23",
    verification: "snippet",
    note: "Idle: RTX 5090 about 30 W, RTX 4090 about 22 W.",
  },
  rtx3090Prices: {
    id: "rtx3090Prices",
    title: "RTX 3090 price on Vast.ai",
    url: "https://computeprices.com/providers/vast/gpus/rtx3090",
    publisher: "ComputePrices",
    asOf: "2026-09-01",
    verification: "snippet",
    note: "From $0.131/hr on Vast.ai.",
  },
  rtx3090PricesHigh: {
    id: "rtx3090PricesHigh",
    title: "NVIDIA RTX 3090 price on Vast.ai",
    url: "https://gpuperhour.com/rent/rtx-3090",
    publisher: "GPUPerHour",
    asOf: "2026-10-01",
    verification: "snippet",
    note: "$0.27/hr listed on Vast.ai.",
  },
  rtx4090PricesLow: {
    id: "rtx4090PricesLow",
    title: "What it costs to rent an H100, B200 or RTX 4090 in September 2026",
    url: "https://dev.to/fastgpu/what-it-costs-to-rent-an-h100-b200-or-rtx-4090-in-september-2026-live-prices-from-28-gpu-clouds-12n3",
    publisher: "DEV Community (fastgpu)",
    asOf: "2026-09-30",
    verification: "snippet",
    note: "RTX 4090 from $0.14/hr on marketplace hosts.",
  },
  rtx4090HostEarnings: {
    id: "rtx4090HostEarnings",
    title: "How to make money renting out your GPU in 2026",
    url: "https://earnifyhub.com/learning-guides/make-money-renting-out-gpu-2026",
    publisher: "EarnifyHub",
    asOf: "2026-01-01",
    verification: "snippet",
    note: "RTX 4090 earns about $0.25–0.35/hr after verification; 50–70% utilization is realistic.",
  },
  rtx5090Prices: {
    id: "rtx5090Prices",
    title: "RTX 5090 cloud pricing (September 2026)",
    url: "https://llmhosting.ai/gpus/rtx-5090",
    publisher: "LLMHosting",
    asOf: "2026-09-19",
    verification: "snippet",
    note: "Vast.ai marketplace: from $0.268/hr, median $0.537/hr.",
  },
  vastHostEarnings: {
    id: "vastHostEarnings",
    title: "How much money can you earn renting out your GPU on Vast.ai?",
    url: "https://vast.ai/article/how-much-money-can-you-earn-renting-out-your-gpu-on-vast-ai",
    publisher: "Vast.ai",
    asOf: "2026-01-01",
    verification: "snippet",
    note: "Consumer GPUs like the RTX 5090 typically earn $0.30–0.60 per GPU-hour. Published by the marketplace itself.",
  },
  eurostatH2_2025: {
    id: "eurostatH2_2025",
    title: "Electricity price statistics (households, 2nd half 2025)",
    url: "https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Electricity_price_statistics",
    publisher: "Eurostat",
    asOf: "2025-12-31",
    verification: "snippet",
    note: "EU €0.2896, Germany €0.3869, Italy €0.333, Spain €0.2872 per kWh, all taxes included.",
  },
  eiaResidential: {
    id: "eiaResidential",
    title: "Electric Power Monthly, Table 5.6.A (residential average)",
    url: "https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_6_a",
    publisher: "U.S. Energy Information Administration",
    asOf: "2026-03-31",
    verification: "snippet",
    note: "US residential average 18.83 ¢/kWh in March 2026.",
  },
  ecbEurUsd: {
    id: "ecbEurUsd",
    title: "Euro foreign exchange reference rates: USD",
    url: "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/eurofxref-graph-usd.en.html",
    publisher: "European Central Bank",
    asOf: "2026-09-30",
    verification: "snippet",
    note: "1 EUR = 1.1355 USD on 2026-09-30.",
  },
  utilizationRange: {
    id: "utilizationRange",
    title: "Vast AI rent my GPU: what GPU marketplace renting really means",
    url: "https://www.gmicloud.ai/en/blog/vast-ai-rent-my-gpu-explained",
    publisher: "GMI Cloud",
    asOf: "2026-01-01",
    verification: "snippet",
    note: "You earn only while rented; new listings without a reliability record are skipped.",
  },
} satisfies Record<string, Source>;

export type SourceId = keyof typeof sources;
