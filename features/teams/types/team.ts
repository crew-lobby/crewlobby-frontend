export type Team = {
  id: string;
  organizationId: string;
  name: string;
  createdAt: string;
};

export type TeamMember = {
  id: string;
  userId: string;
  name: string;
  email: string;
  image: string | null;
  jobTitle: string | null;
};

export type TeamWithMembers = Team & {
  members: TeamMember[];
};

export type TeamsResponse = {
  data: Team[];
};