import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/core/lib/utils";

export function ButtonLink({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      preventScrollReset
      className={cn(
        "inline-flex w-fit items-center gap-2 rounded-full border border-border/80 bg-background/80 px-3 py-1.5 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:border-border hover:bg-muted/50 hover:text-foreground",
        className,
      )}
    >
      <ArrowLeft className="size-3.5 shrink-0" aria-hidden />
      All products
    </Link>
  );
}

