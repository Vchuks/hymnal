"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchHymns, createHymn, updateHymn, deleteHymn } from "@/lib/api";
import { Hymn } from "@/types";

export const HYMNS_KEY = ["hymns"] as const;

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
    mutationFn: (data: Omit<Hymn, "id" | "createdAt">) => createHymn(data),
    onSuccess: (newHymn) => {
      qc.setQueryData<Hymn[]>(HYMNS_KEY, (old = []) => [...old, newHymn]);
    },
  });
}

export function useUpdateHymn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Hymn> }) =>
      updateHymn(id, data),
    onSuccess: (updated) => {
      qc.setQueryData<Hymn[]>(HYMNS_KEY, (old = []) =>
        old.map((h) => (h.id === updated.id ? updated : h))
      );
    },
  });
}

export function useDeleteHymn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteHymn(id),
    onSuccess: (_, id) => {
      qc.setQueryData<Hymn[]>(HYMNS_KEY, (old = []) =>
        old.filter((h) => h.id !== id)
      );
    },
  });
}
