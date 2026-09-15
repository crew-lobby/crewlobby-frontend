import { z } from "zod";

export const updateProfileSchema = z.object({
  preferredName: z.string().max(120).or(z.literal("")),
  location: z.string().max(160).or(z.literal("")),
  timezone: z.string().max(80).or(z.literal("")),
  about: z.string().max(4000).or(z.literal("")),
  github: z.union([z.url(), z.literal("")]),
  linkedin: z.union([z.url(), z.literal("")]),
  personalWebsite: z.union([z.url(), z.literal("")]),
  jobTitle: z.string().max(120).or(z.literal("")),
  workEmail: z.union([z.email(), z.literal("")]),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
