type InvitationHeadingProps = {
  title: string;
  description: string;
};

export function InvitationHeading({
  title,
  description,
}: InvitationHeadingProps) {
  return (
    <div className="mb-8 space-y-2 text-center md:text-left">
      <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h1>

      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}