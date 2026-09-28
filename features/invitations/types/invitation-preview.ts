export type InvitationPreviewStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "canceled"
  | "expired";

export type InvitationPreview = {
  id: string;
  email: string;
  role: string | null;
  status: InvitationPreviewStatus;
  expiresAt: string;
  organizationId: string;
  organizationName: string;
  inviterName: string;
};