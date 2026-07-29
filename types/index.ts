export interface Hymn {
  _id: string;
  title: string;
  sort_order: number | null;
  category?: string;
  author?: string;
}

export type SortField = "sortOrder" | "title";
export type SortDirection = "asc" | "desc";

export interface HymnFilters {
  search: string;
  category: string;
  sortField: SortField;
  sortDirection: SortDirection;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  name: string;
  token: string;
  role: string;
}
