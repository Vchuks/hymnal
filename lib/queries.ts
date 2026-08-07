"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  loginUser,
  fetchHymns,
  createHymn,
  updateHymn,
  deleteHymn,
  getCategories,
  createCategory,
  deleteCategory,
  updateAdminUser,
} from "@/lib/api";
import { Hymn, LoginCredentials, LoginResponse } from "@/types";
import { EachAdmin, useAuthStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { EachCategory, useCategoryStore } from "@/store/categoryStore";
import { useEffect } from "react";

export const HYMNS_KEY = ["hymns"] as const;
export const CATEGORY_KEY = ["categories"] as const;
export const ADMIN_KEY = ["admin"] as const;

//auth
export function login() {
  const { setUser } = useAuthStore();
  const router = useRouter();

  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: ({ username, password }) => loginUser(username, password),
    onSuccess: (data) => {
      if(!data?.token) {
        throw new Error(`Login failed: ${data}`);
      }
      setUser(data);
      if (data?.role === "admin") {
        router.prefetch("/dashboard")
        return router.replace("/dashboard");
      } else {
        router.prefetch("/dashboard")
        return router.replace("/hymns");
      }
    },

    onError: (error) => {
      // handle error
      console.error("Login failed:", error.message);
    },
  });
}

// admin
export function useUpdateAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<EachAdmin, "_id">) => updateAdminUser(data),
    onSuccess: (user) => {
      qc.setQueryData(ADMIN_KEY, () => user);
      qc.invalidateQueries({ queryKey: ADMIN_KEY });
    },
  });
}

// hymns
export function useHymns() {
  return useQuery({
    queryKey: HYMNS_KEY,
    queryFn: fetchHymns,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateHymn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Hymn, "_id">) => createHymn(data),
    onSuccess: (newHymn) => {
      qc.setQueryData<Hymn[]>(HYMNS_KEY, (old = []) => [...old, newHymn]);
      qc.invalidateQueries({ queryKey: HYMNS_KEY });
    },
  });
}

export function useUpdateHymn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Hymn> }) =>
      updateHymn(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: HYMNS_KEY });
    },
  });
}

export function useDeleteHymn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteHymn(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: HYMNS_KEY });
    },
  });
}

//category
export function useGetCategory() {
  const setCategory = useCategoryStore((state) => state.setCategory);
  const query = useQuery({
    queryKey: CATEGORY_KEY,
    queryFn: getCategories,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.data) {
      setCategory(query.data);
    }
  }, [query.data, setCategory]);

  return query;
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<EachCategory, "_id">) => createCategory(data),
    onSuccess: (category) => {
      qc.setQueryData<Hymn[]>(CATEGORY_KEY, (old = []) => [...old, category]);
      qc.invalidateQueries({ queryKey: CATEGORY_KEY });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CATEGORY_KEY });
    },
  });
}
