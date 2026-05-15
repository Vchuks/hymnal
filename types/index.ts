export interface Hymn {
  id: string;
  title: string;
  sortOrder: number;
  category?: string;
  author?: string;
  createdAt?: string;
}

export type SortField = "sortOrder" | "title";
export type SortDirection = "asc" | "desc";

export interface HymnFilters {
  search: string;
  category: string;
  sortField: SortField;
  sortDirection: SortDirection;
}
