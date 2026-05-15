"use client";

import { create } from "zustand";
import { Hymn, HymnFilters, SortDirection, SortField } from "@/types";

interface HymnUIState {
  filters: HymnFilters;
  selectedHymn: Hymn | null;
  isModalOpen: boolean;
  modalMode: "create" | "edit" | "delete";

  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  setSortField: (field: SortField) => void;
  toggleSortDirection: () => void;
  setSelectedHymn: (hymn: Hymn | null) => void;
  openCreateModal: () => void;
  openEditModal: (hymn: Hymn) => void;
  openDeleteModal: (hymn: Hymn) => void;
  closeModal: () => void;
}

export const useHymnStore = create<HymnUIState>((set) => ({
  filters: {
    search: "",
    category: "All",
    sortField: "sortOrder",
    sortDirection: "asc",
  },
  selectedHymn: null,
  isModalOpen: false,
  modalMode: "create",

  setSearch: (search) =>
    set((s) => ({ filters: { ...s.filters, search } })),

  setCategory: (category) =>
    set((s) => ({ filters: { ...s.filters, category } })),

  setSortField: (sortField) =>
    set((s) => ({ filters: { ...s.filters, sortField } })),

  toggleSortDirection: () =>
    set((s) => ({
      filters: {
        ...s.filters,
        sortDirection: s.filters.sortDirection === "asc" ? "desc" : "asc",
      },
    })),

  setSelectedHymn: (hymn) => set({ selectedHymn: hymn }),

  openCreateModal: () =>
    set({ isModalOpen: true, modalMode: "create", selectedHymn: null }),

  openEditModal: (hymn) =>
    set({ isModalOpen: true, modalMode: "edit", selectedHymn: hymn }),
  
  openDeleteModal: (hymn) => set({
    isModalOpen: true, modalMode: "delete", selectedHymn: hymn
  }),

  closeModal: () => set({ isModalOpen: false, selectedHymn: null }),
}));
