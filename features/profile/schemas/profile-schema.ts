import { z } from "zod";

export const profileLinkFormSchema = z.object({
  label: z.string().min(1, "Add a label").max(60),
  url: z.url("Enter a valid URL"),
});

export const updateProfileSchema = z.object({
  preferredName: z.string().max(120).or(z.literal("")),
  photoUrl: z.union([z.url(), z.literal("")]),
  location: z.string().max(160).or(z.literal("")),
  timezone: z.string().max(80).or(z.literal("")),
  about: z.string().max(4000).or(z.literal("")),
  skills: z.array(z.string().min(1).max(40)).max(30),
  github: z.union([z.url(), z.literal("")]),
  linkedin: z.union([z.url(), z.literal("")]),
  personalWebsite: z.union([z.url(), z.literal("")]),
  otherLinks: z.array(profileLinkFormSchema).max(10),
  jobTitle: z.string().max(120).or(z.literal("")),
  workEmail: z.union([z.email(), z.literal("")]),
  startDate: z.string().or(z.literal("")),
  teamId: z.string(),
  managerId: z.string(),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;