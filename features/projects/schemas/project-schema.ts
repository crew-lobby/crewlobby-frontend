import { z } from "zod";

export const projectStatusValues = [
  "planned",
  "active",
  "on_hold",
  "completed",
  "cancelled",
] as const;

export const projectPriorityValues = ["low", "medium", "high", "critical"] as const;

export const projectFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(150),
  code: z.string().min(1, "Code is required").max(30),
  description: z.string().optional(),
  status: z.enum(projectStatusValues),
  priority: z.enum(projectPriorityValues),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  budgetAmount: z.number().nonnegative().optional(),
  currencyCode: z.string().length(3).optional(),
  progressPercent: z.number().int().min(0).max(100),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;