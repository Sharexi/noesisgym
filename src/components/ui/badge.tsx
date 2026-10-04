import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-sm border px-1.5 py-0.5 text-xs font-medium whitespace-nowrap", {
  variants: {
    variant: {
      default: "border-transparent bg-muted text-muted-foreground",
      warning: "border-warning/40 text-warning",
      positive: "border-positive/40 text-positive",
    },
  },
  defaultVariants: { variant: "default" },
});

export function Badge({ className, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
