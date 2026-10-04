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
  llmhosting3090: {
    id: "llmhosting3090",
    title: "RTX 3090 cloud pricing (October 2026)",
    url: "https://llmhosting.ai/gpus/rtx-3090",
    publisher: "LLMHosting",
    asOf: "2026-10-04",
    verification: "secondary",
    note: "Vast.ai marketplace, 64 live offers: floor $0.108/hr, median $0.177/hr.",
  },
  llmhosting4090: {
    id: "llmhosting4090",
    title: "RTX 4090 cloud pricing (October 2026)",
    url: "https://llmhosting.ai/gpus/rtx-4090",
    publisher: "LLMHosting",
    asOf: "2026-10-04",
    verification: "secondary",
    note: "Vast.ai marketplace, 50 live offers: floor $0.270/hr, median $0.477/hr.",
  },
  llmhosting5090: {
    id: "llmhosting5090",
    title: "RTX 5090 cloud pricing (October 2026)",
    url: "https://llmhosting.ai/gpus/rtx-5090",
    publisher: "LLMHosting",
    asOf: "2026-10-04",
    verification: "secondary",
    note: "Vast.ai marketplace, 64 live offers: floor $0.404/hr, median $0.536/hr.",
  },
  rtx3090PricesHigh: {
    id: "rtx3090PricesHigh",
    title: "NVIDIA RTX 3090 price on Vast.ai",
    url: "https://gpuperhour.com/rent/rtx-3090",
    publisher: "GPUPerHour",
    asOf: "2026-10-04",
    verification: "secondary",
    note: "Lowest in-stock offer $0.27/hr on Vast.ai (11 offers reported in stock). This tracker's floor sits above LLMHosting's median.",
  },
  rtx4090PricesHigh: {
    id: "rtx4090PricesHigh",
    title: "NVIDIA RTX 4090 price on Vast.ai",
    url: "https://gpuperhour.com/rent/rtx-4090",
    publisher: "GPUPerHour",
    asOf: "2026-10-04",
    verification: "secondary",
    note: "Lowest in-stock offer $0.52/hr on Vast.ai (8 offers reported in stock). This tracker's floor sits above LLMHosting's median.",
  },
  vastHostEarnings: {
    id: "vastHostEarnings",
    title: "How much money can you earn renting out your GPU on Vast.ai?",
    url: "https://vast.ai/article/how-much-money-can-you-earn-renting-out-your-gpu-on-vast-ai",
    publisher: "Vast.ai",
    asOf: "2026-10-04",
    verification: "primary",
    note: "Consumer GPUs like the RTX 5090 typically earn $0.30–0.60 per GPU-hour. Published by the marketplace itself, so treat as an upper-end claim.",
  },
  eurostatH2_2025: {
    id: "eurostatH2_2025",
    title: "Electricity prices for household consumers, bi-annual data (nrg_pc_204)",
    url: "https://ec.europa.eu/eurostat/databrowser/view/nrg_pc_204",
    publisher: "Eurostat",
    asOf: "2025-12-31",
    verification: "primary",
    note: "Second half of 2025, households using 2,500–4,999 kWh a year, all taxes included: EU €0.2896, Germany €0.3869, Italy €0.2966, Spain €0.2669 per kWh. Read from Eurostat's data API.",
  },
  eiaResidential: {
    id: "eiaResidential",
    title: "Electric Power Monthly, Table 5.6.A (residential average)",
    url: "https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_6_a",
    publisher: "U.S. Energy Information Administration",
    asOf: "2026-07-31",
    verification: "primary",
    note: "US residential average 18.31 ¢/kWh in July 2026 (preliminary).",
  },
  ecbEurUsd: {
    id: "ecbEurUsd",
    title: "Euro foreign exchange reference rates: USD",
    url: "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/eurofxref-graph-usd.en.html",
    publisher: "European Central Bank",
    asOf: "2026-10-02",
    verification: "primary",
    note: "1 EUR = 1.1225 USD on 2026-10-02.",
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
} satisfies Record<string, Source>;

export type SourceId = keyof typeof sources;
