"use client";

import { create } from "zustand";
import { Hymn, HymnFilters, SortDirection, SortField } from "@/types";

interface HymnUIState {
  filters: HymnFilters;
  selectedHymn: Hymn | null;
  currentPage: number;
  isModalOpen: boolean;
  modalMode: "create" | "edit" | "delete";

  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  setSortField: (field: SortField) => void;
  toggleSortDirection: () => void;
  setPage: (page: number) => void;
  setSelectedHymn: (hymn: Hymn | null) => void;
  openCreateModal: () => void;
  openEditModal: (hymn: Hymn) => void;
  openDeleteModal: (hymn: Hymn) => void;
  closeModal: () => void;
}

export const useHymnStore = create<HymnUIState>((set) => ({
  filters: {
    search: "",
    category: "all",
    sortField: "sortOrder",
    sortDirection: "asc",
  },
  currentPage: 1,
  selectedHymn: null,
  isModalOpen: false,
  modalMode: "create",

  setSearch: (search) =>
    set((s) => ({ filters: { ...s.filters, search }, currentPage: 1 })),

  setCategory: (category) =>
    set((s) => ({ filters: { ...s.filters, category }, currentPage: 1 })),

  setSortField: (sortField) =>
    set((s) => ({ filters: { ...s.filters, sortField }, currentPage: 1 })),

  toggleSortDirection: () =>
    set((s) => ({
      filters: {
        ...s.filters,
        sortDirection: s.filters.sortDirection === "asc" ? "desc" : "asc",
      },
      currentPage: 1,
    })),

  setSelectedHymn: (hymn) => set({ selectedHymn: hymn }),
  setPage: (page) => set({ currentPage: page }),
  openCreateModal: () =>
    set({ isModalOpen: true, modalMode: "create", selectedHymn: null }),

  openEditModal: (hymn) =>
    set({ isModalOpen: true, modalMode: "edit", selectedHymn: hymn }),

  openDeleteModal: (hymn) =>
    set({
      isModalOpen: true,
      modalMode: "delete",
      selectedHymn: hymn,
    }),

  closeModal: () => set({ isModalOpen: false, selectedHymn: null }),
}));
