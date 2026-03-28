import { Suspense, type ReactNode } from "react";

export function PageLoadingFallback() {
  return (
    <div className="p-8 text-center text-sm text-muted-foreground">
      Loading…
    </div>
  );
}

export function SuspensePage({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageLoadingFallback />}>{children}</Suspense>;
}
