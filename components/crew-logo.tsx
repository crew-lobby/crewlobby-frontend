import Link from "next/link";

import { cn } from "@/lib/utils";

type CrewLogoProps = {
  href?: string;
  showName?: boolean;
  className?: string;
};

export function CrewLogo({
  href = "/dashboard",
  showName = true,
  className,
}: CrewLogoProps) {
  return (
    <Link
      href={href}
      aria-label="CrewLobby"
      className={cn(
        "flex w-full items-center rounded-lg outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        showName ? "gap-2.5" : "justify-center",
        className,
      )}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
        C
      </span>

      {showName ? (
        <span className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-foreground">
          CrewLobby
        </span>
      ) : null}
    </Link>
  );
}