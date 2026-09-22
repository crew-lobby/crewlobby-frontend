import { UserRound } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type PersonAvatarProps = {
  name?: string | null;
  image?: string | null;
  className?: string;
};

function getInitials(name?: string | null) {
  if (!name?.trim()) {
    return "?";
  }

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function PersonAvatar({
  name,
  image,
  className,
}: PersonAvatarProps) {
  return (
    <Avatar className={cn("size-10", className)}>
      {image ? (
        <AvatarImage src={image} alt={name ?? "Person"} />
      ) : null}

      <AvatarFallback>
        {name ? (
          getInitials(name)
        ) : (
          <UserRound className="size-4 text-muted-foreground" />
        )}
      </AvatarFallback>
    </Avatar>
  );
}