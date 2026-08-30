import { z } from "zod";

export const sectors = [
  { value: "technology", label: "Technology" },
  { value: "finance", label: "Finance & Banking" },
  { value: "healthcare", label: "Healthcare" },
  { value: "hr", label: "Human Resources" },
  { value: "retail", label: "Retail & E-commerce" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "education", label: "Education" },
  { value: "real_estate", label: "Real Estate" },
  { value: "media", label: "Media & Entertainment" },
  { value: "consulting", label: "Consulting" },
  { value: "nonprofit", label: "Nonprofit" },
  { value: "other", label: "Other" },
] as const;

export const organizationSchema = z.object({
  name: z.string().min(2, "Organization name must have at least 2 characters"),
  addressLine1: z.string().min(1, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  zip: z.string().min(1, "Zip code is required"),
  employeeCount: z
    .number({ message: "Number of employees is required" })
    .int("Must be a whole number")
    .positive("Must be greater than zero"),
  sector: z.enum(sectors.map((sector) => sector.value) as [string, ...string[]], {
    message: "Please select a sector",
  }),
});

export type OrganizationFormData = z.infer<typeof organizationSchema>;