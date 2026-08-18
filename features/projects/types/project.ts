export type Project = {
  id: string;
  name: string;
  code: string;
  status: string;
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