"use client";

import { useState, type ChangeEvent, type KeyboardEvent } from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

type TagInputProps = {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  className?: string;
};

export function TagInput({
  value,
  onChange,
  placeholder,
  maxTags = 30,
  className,
}: TagInputProps) {
  const [draft, setDraft] = useState("");

  function addTag(rawTag: string) {
    const tag = rawTag.trim();

    if (!tag || value.length >= maxTags || value.includes(tag)) {
      setDraft("");
      return;
    }

    onChange([...value, tag]);
    setDraft("");
  }

  function removeTag(tag: string) {
    onChange(value.filter((existing) => existing !== tag));
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.value;

    if (!next.includes(",")) {
      setDraft(next);
      return;
    }

    // Commit every comma-separated part in one go: calling addTag per part
    // would each read the same stale `value` and only the last tag of a
    // pasted list ("React, Node, Postgres") would survive.
    const merged = [...value];

    for (const part of next.split(",")) {
      const tag = part.trim();

      if (tag && !merged.includes(tag) && merged.length < maxTags) {
        merged.push(tag);
      }
    }

    if (merged.length !== value.length) {
      onChange(merged);
    }

    setDraft("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      addTag(draft);
      return;
    }

    if (event.key === "Backspace" && draft === "" && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  }

  return (
    <div
      className={cn(
        "flex min-h-10 w-full flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-transparent px-3 py-2 text-sm transition focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
        className,
      )}
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-foreground"
        >
          {tag}

          <button
            type="button"
            onClick={() => removeTag(tag)}
            aria-label={`Remove ${tag}`}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-3" />
          </button>
        </span>
      ))}

      <input
        value={draft}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={() => addTag(draft)}
        placeholder={value.length === 0 ? placeholder : undefined}
        disabled={value.length >= maxTags}
        className="min-w-24 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}