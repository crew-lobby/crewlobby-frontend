import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageTitleProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function PageTitle({
  title,
  description,
  action,
  className,
}: PageTitleProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>

        {description ? (
          <p className="mt-1.5 max-w-2xl font-[family-name:var(--font-sans)] text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
