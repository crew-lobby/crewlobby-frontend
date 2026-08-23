export type ProjectStatus = "planned" | "active" | "on_hold" | "completed" | "cancelled";
export type ProjectPriority = "low" | "medium" | "high" | "critical";

export type Project = {
  id: string;
  companyId: string;
  name: string;
  code: string;
  description: string | null;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: string | null;
  dueDate: string | null;
  budgetAmount: string | null;
  currencyCode: string;
  progressPercent: number;
};

export type ProjectInput = {
  name: string;
  code: string;
  description?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  startDate?: string;
  dueDate?: string;
  budgetAmount?: number;
  currencyCode?: string;
  progressPercent?: number;
};

export type ProjectsResponse = {
  data: Project[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
};
