const INVITATION_PATH_PREFIX = "/accept-invitation/";

export function buildInvitationPath(invitationId: string): string {
  return `${INVITATION_PATH_PREFIX}${invitationId}`;
}

export function buildInvitationUrl(
  origin: string,
  invitationId: string,
): string {
  return `${origin}${buildInvitationPath(invitationId)}`;
}

export function getInvitationIdFromPath(path: string): string | null {
  if (!path.startsWith(INVITATION_PATH_PREFIX)) {
    return null;
  }

  const [invitationId] = path.slice(INVITATION_PATH_PREFIX.length).split(/[/?#]/);

  return invitationId || null;
}

export function isInvitationPath(path: string): boolean {
  return getInvitationIdFromPath(path) !== null;
}