import { z } from "zod";

export const roleOptions = [
  { value: "user", label: "User" },
  { value: "manager", label: "Manager" },
  { value: "admin", label: "Admin" },
  { value: "owner", label: "Owner" },
] as const;

export const inviteMemberSchema = z.object({
  email: z.email("Enter a valid email address"),
  role: z.enum(["user", "manager", "admin", "owner"]),
});

export type InviteMemberFormData = z.infer<typeof inviteMemberSchema>;