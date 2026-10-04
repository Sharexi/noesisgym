import { eurUsd } from "@/data/inputs";

export type Currency = "EUR" | "USD";

/** Convert an amount in `currency` to USD. */
export function toUsd(amount: number, currency: Currency): number {
  return currency === "EUR" ? amount * eurUsd.value : amount;
}

/** Convert a USD amount to `currency`. */
export function fromUsd(amountUsd: number, currency: Currency): number {
  return currency === "EUR" ? amountUsd / eurUsd.value : amountUsd;
}

export function formatMoney(amount: number, currency: Currency, digits = 0): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
