export type ProfileLink = {
  label: string;
  url: string;
};

export type ProfileFields = {
  preferredName: string | null;
  photoUrl: string | null;
  location: string | null;
  timezone: string | null;
  about: string | null;
  skills: string[];
  github: string | null;
  linkedin: string | null;
  personalWebsite: string | null;
  otherLinks: ProfileLink[];
};

export type Employment = {
  jobTitle: string | null;
  workEmail: string | null;
  startDate: string | null;
  teamId: string | null;
  managerId: string | null;
};

export type ProfileView = {
  userId: string;
  name: string;
  email: string;
  image: string | null;
  profile: ProfileFields | null;
  employment: Employment | null;
};
