import { Calculator } from "@/components/calculator";
import { SourceList } from "@/components/source-list";
import { electricityPresets, gpus } from "@/data/inputs";
import { formatMoney, fromUsd, toUsd } from "@/lib/money";
import { defaultSettings, scenariosFor } from "@/lib/scenarios";

function headline() {
  const gpu = gpus.find((g) => g.id === "rtx-4090")!;
  const eu = electricityPresets.find((p) => p.id === "eu")!;
  const r = scenariosFor(gpu, defaultSettings(toUsd(eu.pricePerKwh.value, eu.currency)));
  const eur = (usd: number) => formatMoney(Math.abs(fromUsd(usd, "EUR")), "EUR");
  const phrase = (usd: number) => (usd < 0 ? `a ${eur(usd)} loss` : `a ${eur(usd)} profit`);
  return { low: phrase(r.low.netPer30Days), high: phrase(r.high.netPer30Days) };
}

export default function Home() {
  const h = headline();
  return (
    <div className="space-y-12">
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">What does your GPU really earn?</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Renting out a home RTX 4090 at EU-average electricity prices comes out anywhere from{" "}
          <strong className="text-foreground">
            {h.low} to {h.high} a month
          </strong>
          , after platform cut, power and idle time. Change any input below to match your setup.
        </p>
      </section>

      <section aria-labelledby="calc">
        <h2 id="calc" className="sr-only">
          Calculator
        </h2>
        <Calculator />
      </section>

      <section className="space-y-4" aria-labelledby="why">
        <h2 id="why" className="text-xl font-semibold">
          Why is it less than the claims I&apos;ve seen?
        </h2>
        <div className="max-w-2xl space-y-3 text-muted-foreground">
          <p>
            Most earnings claims quote the hourly rental price as if the card were rented around the clock. You are only paid while
            someone rents it, and new hosts are often skipped until they build a reliability record.
          </p>
          <p>
            Electricity is paid whenever the machine is on, rented or not, and for the whole PC, not just the graphics card. Above
            the break-even price shown in each card, hosting costs more than it earns.
          </p>
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="sources">
        <h2 id="sources" className="text-xl font-semibold">
          Sources
        </h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Every figure above comes from one of these. Figures marked &ldquo;not yet verified&rdquo; were taken from search summaries and
          are being checked against the original page.
        </p>
        <SourceList />
      </section>
    </div>
  );
}
