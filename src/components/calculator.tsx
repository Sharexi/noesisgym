"use client";

import { useId, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/field";
import { assumptions, electricityPresets, gpus } from "@/data/inputs";
import { formatMoney, fromUsd, toUsd, type Currency } from "@/lib/money";
import { defaultSettings, levels, scenariosFor, type Level } from "@/lib/scenarios";
import { cn } from "@/lib/utils";

const levelLabel: Record<Level, string> = {
  low: "Low rental price",
  typical: "Typical rental price",
  high: "High rental price",
};

function clamp(n: number, min: number, max: number) {
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min;
}

export function Calculator() {
  const id = useId();
  const [gpuId, setGpuId] = useState("rtx-4090");
  const [presetId, setPresetId] = useState("eu");
  const preset = electricityPresets.find((p) => p.id === presetId) ?? electricityPresets[0];
  const currency: Currency = preset.currency;
  const [kwhPrice, setKwhPrice] = useState(String(preset.pricePerKwh.value));
  const [utilizationPct, setUtilizationPct] = useState(String(assumptions.utilization.typical * 100));
  const [feePct, setFeePct] = useState(String(assumptions.platformFee.typical * 100));
  const [systemWatts, setSystemWatts] = useState(String(assumptions.systemWatts));

  const gpu = gpus.find((g) => g.id === gpuId) ?? gpus[0];
  const settings = {
    ...defaultSettings(toUsd(clamp(parseFloat(kwhPrice), 0, 10), currency)),
    utilization: clamp(parseFloat(utilizationPct), 0, 100) / 100,
    platformFee: clamp(parseFloat(feePct), 0, 100) / 100,
    systemWatts: clamp(parseFloat(systemWatts), 0, 2000),
  };
  const results = scenariosFor(gpu, settings);
  const money = (usd: number, digits = 0) => formatMoney(fromUsd(usd, currency), currency, digits);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-gpu`}>GPU</Label>
          <Select id={`${id}-gpu`} value={gpuId} onChange={(e) => setGpuId(e.target.value)}>
            {gpus.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-country`}>Electricity prices for</Label>
          <Select
            id={`${id}-country`}
            value={presetId}
            onChange={(e) => {
              const next = electricityPresets.find((p) => p.id === e.target.value) ?? electricityPresets[0];
              setPresetId(next.id);
              setKwhPrice(String(next.pricePerKwh.value));
            }}
          >
            {electricityPresets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-kwh`}>Your price per kWh ({currency})</Label>
          <Input id={`${id}-kwh`} type="number" inputMode="decimal" min={0} step={0.01} value={kwhPrice} onChange={(e) => setKwhPrice(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-util`}>Hours actually rented (%)</Label>
          <Input id={`${id}-util`} type="number" inputMode="decimal" min={0} max={100} step={5} value={utilizationPct} onChange={(e) => setUtilizationPct(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-fee`}>Platform cut (%)</Label>
          <Input id={`${id}-fee`} type="number" inputMode="decimal" min={0} max={100} step={1} value={feePct} onChange={(e) => setFeePct(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-sys`}>Rest of the PC (watts)</Label>
          <Input id={`${id}-sys`} type="number" inputMode="numeric" min={0} step={10} value={systemWatts} onChange={(e) => setSystemWatts(e.target.value)} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3" aria-live="polite">
        {levels.map((level) => {
          const r = results[level];
          const positive = r.netPerDay >= 0;
          return (
            <Card key={level} className={cn(level === "typical" && "border-foreground/30")}>
              <CardHeader>
                <CardTitle>{levelLabel[level]}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Renters pay {formatMoney(gpu.rentalUsdPerHour[level].value, "USD", 3)}/hr
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className={cn("text-3xl font-semibold tabular-nums", positive ? "text-positive" : "text-negative")}>{money(r.netPer30Days)}</p>
                  <p className="text-xs text-muted-foreground">net per 30 days</p>
                </div>
                <dl className="grid grid-cols-2 gap-y-1 text-sm tabular-nums">
                  <dt className="text-muted-foreground">Earned</dt>
                  <dd className="text-right">{money(r.grossPerDay * 30)}</dd>
                  <dt className="text-muted-foreground">Electricity</dt>
                  <dd className="text-right">−{money(r.powerCostPerDay * 30)}</dd>
                  <dt className="text-muted-foreground">Break-even power price</dt>
                  <dd className="text-right">{money(r.breakEvenUsdPerKwh, 2)}/kWh</dd>
                </dl>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        Estimates, not promises. Results vary with demand, your reliability score, internet connection and hardware.
        {currency === "EUR" && " Rental prices are in USD and converted at the ECB reference rate."} See the{" "}
        <a href="/methodology/" className="underline underline-offset-4">
          methodology
        </a>{" "}
        for every formula and source.
      </p>
    </div>
  );
}
