import { create } from "zustand";

export interface EachCategory {
    _id: string;
    name: string
}
interface categoryState {
  category: EachCategory[];
  setCategory: (category: EachCategory[]) => void;
  selectedCategory: EachCategory | null;
  isCategoryModalOpen: boolean;
  modalMode: "create" | "edit" | "delete";
  openCreateModal: () => void
  openDeleteModal: () => void
  openCategory: () => void;
  closeCategory: () => void
}


export const useCategoryStore =create<categoryState>((set) => ({
    category: [],
    setCategory: (category) => set({category}),
    selectedCategory: null,
    isCategoryModalOpen: false,
     modalMode: "create",
     openCreateModal: () =>
    set({ isCategoryModalOpen: true, modalMode: "create", selectedCategory: null }),
     openDeleteModal: () =>
    set({ isCategoryModalOpen: true, modalMode: "delete", selectedCategory: null }),
    openCategory: () => set({isCategoryModalOpen: true, }),
    closeCategory: () => set({isCategoryModalOpen: false})
}))

export const useCategoryList = () => useCategoryStore(state =>[ "all", ...state?.category.map(each => each?.name?.toLowerCase())])