import { Badge } from "@/components/ui/badge";
import { sources, type SourceId, type Verification } from "@/data/sources";

const verificationLabel: Record<Verification, { text: string; variant: "positive" | "default" | "warning" }> = {
  primary: { text: "primary source", variant: "positive" },
  secondary: { text: "third-party, checked", variant: "default" },
  snippet: { text: "not yet verified", variant: "warning" },
};

export function SourceList({ ids }: { ids?: SourceId[] }) {
  const list = (ids ?? (Object.keys(sources) as SourceId[])).map((id) => sources[id]);
  return (
    <ol className="space-y-3 text-sm">
      {list.map((s) => {
        const v = verificationLabel[s.verification];
        return (
          <li key={s.id} id={`source-${s.id}`} className="scroll-mt-20">
            <div className="flex flex-wrap items-center gap-2">
              <a href={s.url} className="font-medium underline underline-offset-4 hover:text-muted-foreground" rel="noopener">
                {s.title}
              </a>
              <span className="text-muted-foreground">
                {s.publisher}, as of {s.asOf}
              </span>
              <Badge variant={v.variant}>{v.text}</Badge>
            </div>
            {s.note && <p className="mt-1 text-muted-foreground">{s.note}</p>}
          </li>
        );
      })}
    </ol>
  );
}
