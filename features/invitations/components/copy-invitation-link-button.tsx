"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Link2 } from "lucide-react";

import { buildInvitationUrl } from "@/features/invitations/lib/invitation-link";

type CopyStatus = "idle" | "copied" | "failed";

const FEEDBACK_DURATION_MS = 2000;

export function CopyInvitationLinkButton({
  invitationId,
  isExpired,
}: {
  invitationId: string;
  isExpired: boolean;
}) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(
        buildInvitationUrl(window.location.origin, invitationId),
      );
      setStatus("copied");
    } catch {
      setStatus("failed");
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => setStatus("idle"), FEEDBACK_DURATION_MS);
  }

  if (isExpired) {
    return <p className="mt-1 text-xs font-medium text-destructive">Expired</p>;
  }

  return (
    <button type="button" onClick={handleCopy} aria-live="polite" className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80">
      {status === "copied" ? <Check className="size-3" /> : <Link2 className="size-3" />}
      {status === "copied" ? "Link copied" : status === "failed" ? "Couldn't copy" : "Copy invite link"}
    </button>
  );
}