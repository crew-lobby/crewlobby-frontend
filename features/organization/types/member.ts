export type MemberRole = "user" | "manager" | "admin" | "owner";

export type Member = {
  id: string;
  organizationId: string;
  userId: string;
  role: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
};

export type MembersResponse = {
  members: Member[];
  total: number;
};

export type Invitation = {
  id: string;
  organizationId: string;
  email: string;
  role: string;
  status: "pending" | "accepted" | "rejected" | "canceled";
  expiresAt: string;
  createdAt: string;
  inviterId: string;
};