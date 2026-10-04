// Fetchers and parsers for the figures that refresh automatically.
// Every function returns plain data and throws on anything unexpected, so a
// changed page or API can never write a wrong number into src/data/live.json.

const USER_AGENT = "noesisgym-data-updater (+https://github.com/Sharexi/noesisgym)";

async function get(url, init = {}) {
  const res = await fetch(url, { ...init, headers: { "user-agent": USER_AGENT, ...init.headers }, signal: AbortSignal.timeout(30_000) });
  if (!res.ok) throw new Error(`${url} answered ${res.status}`);
  return res;
}

const isoDate = (d) => d.toISOString().slice(0, 10);

/** Value at the given quantile (0–1) of a list, by nearest rank. */
export function quantile(values, q) {
  if (values.length === 0) throw new RangeError("quantile of an empty list");
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.max(0, Math.ceil(q * sorted.length) - 1)];
}

export function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

const round = (n, digits = 3) => Number(n.toFixed(digits));

/**
 * Low / typical / high from asking prices (USD per GPU-hour): the cheapest
 * offer, the median, and the 90th percentile.
 */
export function summarizeOffers(prices) {
  if (prices.length < 10) throw new Error(`only ${prices.length} offers`);
  return {
    low: round(Math.min(...prices)),
    typical: round(median(prices)),
    high: round(quantile(prices, 0.9)),
    offers: prices.length,
  };
}

/**
 * Vast.ai marketplace: single-GPU offers that can be rented right now, sorted
 * cheapest first. The search API returns at most 64 offers per query, so the
 * figures describe the 64 cheapest offers. `dph_base` is the host's asking
 * price per hour, before the renter-side surcharge.
 */
export async function fetchVastOffers(gpuName) {
  const q = {
    gpu_name: { eq: gpuName },
    num_gpus: { eq: 1 },
    rentable: { eq: true },
    rented: { eq: false },
    type: "ask",
    order: [["dph_base", "asc"]],
    limit: 1000,
  };
  const res = await get(`https://console.vast.ai/api/v0/bundles/?q=${encodeURIComponent(JSON.stringify(q))}`);
  const { offers } = await res.json();
  if (!Array.isArray(offers)) throw new Error("Vast.ai answer has no offers list");
  const prices = offers.map((o) => o.dph_base);
  if (!prices.every((p) => typeof p === "number" && p > 0)) throw new Error("Vast.ai offer without a price");
  return { ...summarizeOffers(prices), asOf: isoDate(new Date()) };
}

/** ECB euro reference rate, USD per 1 EUR. */
export function parseEcb(xml) {
  const day = /<Cube time=['"](\d{4}-\d{2}-\d{2})['"]/.exec(xml);
  const usd = /<Cube currency=['"]USD['"] rate=['"]([\d.]+)['"]/.exec(xml);
  if (!day || !usd) throw new Error("ECB feed not in the expected shape");
  return { value: Number(usd[1]), asOf: day[1] };
}

export async function fetchEcb() {
  const res = await get("https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml");
  return parseEcb(await res.text());
}

/** Last day of a Eurostat bi-annual period such as "2025-S2". */
export function periodEnd(period) {
  const m = /^(\d{4})-S([12])$/.exec(period);
  if (!m) throw new Error(`unexpected Eurostat period ${period}`);
  return m[2] === "1" ? `${m[1]}-06-30` : `${m[1]}-12-31`;
}

/**
 * Eurostat nrg_pc_204 (JSON-stat): household price per kWh in EUR, all taxes
 * included, for the 2,500–4,999 kWh a year band. Picks the latest period for
 * which every country has a value.
 */
export function parseEurostat(data, countries) {
  const { id, size, dimension, value } = data;
  const index = (dim) => dimension[dim].category.index;
  const geoIdx = index("geo");
  const timeIdx = index("time");
  const strides = {};
  let stride = 1;
  for (let i = id.length - 1; i >= 0; i--) {
    strides[id[i]] = stride;
    stride *= size[i];
  }
  const periods = Object.entries(timeIdx).sort((a, b) => b[1] - a[1]);
  for (const [period, t] of periods) {
    const prices = {};
    for (const [key, geo] of Object.entries(countries)) {
      const v = value[String(geoIdx[geo] * strides.geo + t * strides.time)];
      if (typeof v === "number") prices[key] = v;
    }
    if (Object.keys(prices).length === Object.keys(countries).length) return { prices, asOf: periodEnd(period) };
  }
  throw new Error("Eurostat has no period with every country");
}

export async function fetchEurostat() {
  const countries = { eu: "EU27_2020", de: "DE", it: "IT", es: "ES" };
  const params = new URLSearchParams({
    format: "JSON",
    lang: "en",
    nrg_cons: "KWH2500-4999",
    tax: "I_TAX",
    currency: "EUR",
    unit: "KWH",
    siec: "E7000",
    sinceTimePeriod: `${new Date().getUTCFullYear() - 2}-S1`,
  });
  for (const geo of Object.values(countries)) params.append("geo", geo);
  const res = await get(`https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_pc_204?${params}`);
  return parseEurostat(await res.json(), countries);
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** EIA Electric Power Monthly table 5.6.A: US residential average in US cents per kWh. */
export function parseEia(html) {
  const text = html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ");
  const month = new RegExp(`by State, (${MONTHS.join("|")}) (\\d{4}) and \\d{4}`).exec(text);
  const total = /U\.S\. Total (\d+\.\d+)/.exec(text);
  if (!month || !total) throw new Error("EIA table not in the expected shape");
  const monthNumber = MONTHS.indexOf(month[1]) + 1;
  const lastDay = new Date(Date.UTC(Number(month[2]), monthNumber, 0));
  return { value: round(Number(total[1]) / 100, 4), asOf: isoDate(lastDay) };
}

export async function fetchEia() {
  const res = await get("https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_6_a");
  return parseEia(await res.text());
}
