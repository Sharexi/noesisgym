import type { Metadata } from "next";
import { SourceList } from "@/components/source-list";
import { assumptions, eurUsd } from "@/data/inputs";

export const metadata: Metadata = {
  title: "Methodology",
  description: "How the GPU earnings calculator works: formulas, assumptions, sources and what is not included.",
};

const pct = (n: number) => `${Math.round(n * 100)}%`;

export default function Methodology() {
  return (
    <article className="max-w-2xl space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Methodology</h1>
        <p className="text-lg text-muted-foreground">
          The calculator estimates what a home GPU nets per month on a rental marketplace: what renters pay, minus the platform&apos;s
          cut, minus electricity for the whole machine, including the hours nobody rents it.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">How is net earnings calculated?</h2>
        <pre className="overflow-x-auto rounded-md border bg-muted p-4 font-mono text-sm leading-relaxed">
{`rented hours  = 24 × utilization
idle hours    = 24 − rented hours

earned / day  = rental price × rented hours × (1 − platform cut)

energy / day  = (GPU load W + rest of PC W) × rented hours
              + (GPU idle W + rest of PC W) × idle hours   [Wh ÷ 1000]

net / day     = earned / day − energy / day × price per kWh
net / 30 days = net / day × 30
break-even    = earned / day ÷ energy / day   [price per kWh at which net is 0]`}
        </pre>
        <p className="text-muted-foreground">
          The three result cards differ only in the rental price. Low and typical are the floor and median of live Vast.ai offers on 2026-10-04; high is the lowest in-stock offer on another price tracker (RTX 3090, 4090) or Vast.ai&apos;s own host-earnings figure (RTX 5090). These are listed prices at one moment, not what hosts realised. Everything else
          uses the values you enter.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Which numbers are assumptions?</h2>
        <p className="text-muted-foreground">These could not be pinned to a single published figure. Each is editable in the calculator.</p>
        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
          <li>
            <strong className="text-foreground">Utilization, default {pct(assumptions.utilization.typical)}.</strong> Share of hours the GPU
            is actually rented. No source gives a reliable figure; Vast.ai uses 80% in one example, and new hosts start lower.
          </li>
          <li>
            <strong className="text-foreground">Platform cut, default {pct(assumptions.platformFee.typical)}.</strong> Rental prices are what
            renters pay. Some platforms say hosts keep their full asking price and charge renters a surcharge on top; others don&apos;t
            publish their cut. The default allows for the gap between what renters pay and what hosts receive.
          </li>
          <li>
            <strong className="text-foreground">Rest of the PC, default {assumptions.systemWatts} W.</strong> CPU, motherboard, fans and power
            supply losses while the machine is online. Measure yours with a plug-in power meter for a better estimate.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">What is not included yet?</h2>
        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
          <li>Crypto mining and inference networks. Comparisons are planned once their data sources are checked.</li>
          <li>Taxes on earnings, which depend on where you live.</li>
          <li>Hardware wear, internet costs, and the time spent setting up and maintaining a host.</li>
          <li>Time waiting for verification, when a new host earns nothing.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">How are currencies handled?</h2>
        <p className="text-muted-foreground">
          Rental prices are in US dollars. When you pick a euro electricity price, results are converted at {eurUsd.value} USD per EUR, the
          European Central Bank reference rate listed below.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">How sure are these figures?</h2>
        <p className="text-muted-foreground">
          Each source carries a label: <em>primary source</em> (the publisher&apos;s own page), <em>third-party, checked</em>, or{" "}
          <em>not yet verified</em> (seen only in a search summary). Unverified figures are being checked against the original pages.
          Corrections are listed below with their dates.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Corrections</h2>
        <p className="text-muted-foreground">2026-10-04: all sources were checked against their original pages. Changes:</p>
        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
          <li>Italy electricity price corrected from €0.333 to €0.2966 per kWh, and Spain from €0.2872 to €0.2669, to match Eurostat&apos;s data.</li>
          <li>RTX 4090 rental prices replaced: the earlier $0.25–0.35/hr could not be found on its cited page and was well below live prices. Low and typical are now $0.27 and $0.477.</li>
          <li>RTX 3090 and RTX 5090 rental prices updated to the 2026-10-04 Vast.ai floor and median.</li>
          <li>Board power now comes from NVIDIA&apos;s own pages. US electricity price updated to July 2026 (18.31 ¢/kWh) and the EUR/USD rate to 1.1225 (2026-10-02).</li>
          <li>Still not confirmed: RTX 4090 and 5090 idle power (TechPowerUp blocks automated access).</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Sources</h2>
        <SourceList />
      </section>
    </article>
  );
}
