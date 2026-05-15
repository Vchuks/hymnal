"use client";

import { useMemo } from "react";
import { useHymns, useDeleteHymn } from "@/lib/queries";
import { useHymnStore } from "@/store/hymnStore";
import { Hymn, SortField } from "@/types";
import { ChevronUp, ChevronDown, Pencil, Trash2, Music2 } from "lucide-react";

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Praise:    { bg: "#fef3c7", text: "#92400e" },
  Classic:   { bg: "#e0e7ff", text: "#3730a3" },
  Worship:   { bg: "#d1fae5", text: "#065f46" },
  Comfort:   { bg: "#fce7f3", text: "#9d174d" },
  Assurance: { bg: "#f3e8ff", text: "#6b21a8" },
};

function SortIcon({ field, activeField, direction }: {
  field: SortField;
  activeField: SortField;
  direction: "asc" | "desc";
}) {
  if (activeField !== field)
    return <ChevronUp size={13} style={{ color: "var(--ink)", opacity: 0.4 }} />;
  return direction === "asc"
    ? <ChevronUp size={13} style={{ color: "var(--gold)" }} />
    : <ChevronDown size={13} style={{ color: "var(--gold)" }} />;
}

export default function HymnTable() {
  const { data: hymns = [], isLoading, isError } = useHymns();
  const { filters, openEditModal, openDeleteModal, setSortField, toggleSortDirection } = useHymnStore();
  const deleteHymn = useDeleteHymn();
  

  const filtered = useMemo(() => {
    let list = [...hymns];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (h) =>
          h.title.toLowerCase().includes(q) ||
          h.author?.toLowerCase().includes(q)
      );
    }

    if (filters.category !== "All") {
      list = list.filter((h) => h.category === filters.category);
    }

    list.sort((a, b) => {
      const dir = filters.sortDirection === "asc" ? 1 : -1;
      if (filters.sortField === "sortOrder") return (a.sortOrder - b.sortOrder) * dir;
      return a.title.localeCompare(b.title) * dir;
    });

    return list;
  }, [hymns, filters]);

  function handleSort(field: SortField) {
    if (filters.sortField === field) toggleSortDirection();
    else setSortField(field);
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Music2 size={32} style={{ color: "var(--gold)", opacity: 0.6 }} />
        <p className="text-sm" style={{ color: "var(--parchment)" }}>Loading hymnal…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="rounded-xl p-8 text-center"
        style={{ background: "#fff5f5", border: "1px solid #fecaca" }}
      >
        <p className="text-sm font-medium text-red-700">Failed to load hymns. Please refresh.</p>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Music2 size={40} style={{ color: "var(--ink-faint)", opacity: 0.4 }} />
        <p style={{ color: "var(--ink-muted)" }} className="text-sm">No hymns found</p>
        {filters.search && (
          <p style={{ color: "var(--ink-faint)" }} className="text-xs">
            Try a different search term
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-x-auto"
      style={{ border: "1px solid var(--rule)", background: "white" }}
    >
      {/* Table header */}
      <div
        className="grid grid-box text-xs font-medium uppercase tracking-widest select-none"
        style={{
        
          borderBottom: "1px solid var(--rule)",
          background: "var(--parchment)",
          padding: "0 16px",
          color: "var(--ink-muted)",
        }}
      >
        <div
          className="flex items-center gap-1 py-3 "
          
        >
          <span>S/N</span>
          
        </div>
        <div
          className="flex items-center gap-1 py-3 cursor-pointer"
          onClick={() => handleSort("title")}
        >
          <span>Title</span>
          <SortIcon field="title" activeField={filters.sortField} direction={filters.sortDirection} />
        </div>
        <div className="flex items-center py-3 cursor-pointer"
        onClick={() => handleSort("sortOrder")}>
          <span>
            Order
            </span>
          <SortIcon field="sortOrder" activeField={filters.sortField} direction={filters.sortDirection} />
        </div>
        <div className="flex items-center py-3">Category</div>
        <div className="flex items-center py-3">Author</div>
        <div className="flex items-center justify-end py-3">Actions</div>
      </div>

      {/* Rows */}
      <div className="divide-y stagger-children" style={{ borderColor: "var(--rule)" }}>
        {filtered.map((hymn, idx) => (
          <HymnRow
            key={hymn.id}
            hymn={hymn}
            index={idx + 1}
            onEdit={() => openEditModal(hymn)}
            onDelete={() => openDeleteModal(hymn)}
            // onDelete={() => deleteHymn.mutate(hymn.id)}
            isDeleting={deleteHymn.isPending && deleteHymn.variables === hymn.id}
          />
        ))}
      </div>

      {/* Footer */}
      <div
        className="px-4 py-3 text-xs"
        style={{
          borderTop: "1px solid var(--rule)",
          color: "var(--ink-faint)",
          background: "var(--parchment)",
        }}
      >
        {filtered.length} hymn{filtered.length !== 1 ? "s" : ""}
        {filters.search || filters.category !== "All" ? " (filtered)" : " total"}
      </div>
    </div>
  );
}

function HymnRow({
  hymn,
  index,
  onEdit,
  onDelete,
  isDeleting,
}: {
  hymn: Hymn;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const colors = CATEGORY_COLORS[hymn.category ?? ""] ?? { bg: "#f3f4f6", text: "#374151" };

  return (
    <div
      className="grid grid-box items-center row-enter transition-colors group"
      style={{
       
        padding: "0 16px",
        opacity: isDeleting ? 0.4 : 1,
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.background = "var(--parchment)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.background = "transparent")
      }
    >
      {/* Row number */}
      <div
        className="py-4 text-xs font-mono"
        style={{ color: "var(--ink-faint)" }}
      >
        {String(index).padStart(2, "0")}
      </div>

      {/* Title */}
      <div className="py-4">
        <p className="font-display text-sm font-medium" style={{ color: "var(--ink)" }}>
          {hymn.title}
        </p>
      </div>

      {/* Sort order */}
      <div className="py-4">
        <span
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-mono font-medium"
          style={{
            background: "var(--parchment-dark)",
            color: "var(--gold-dark)",
          }}
        >
          {hymn.sortOrder}
        </span>
      </div>

      {/* Category */}
      <div className="py-4">
        <span
          className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium"
          style={{ background: colors.bg, color: colors.text }}
        >
          {hymn.category}
        </span>
      </div>

      {/* Author */}
      <div className="py-4">
        <span className="text-sm" style={{ color: "var(--ink-muted)" }}>
          {hymn.author || "—"}
        </span>
      </div>

      {/* Actions */}
      <div className="py-4 flex items-center justify-end gap-1">
        <button
          onClick={onEdit}
          className="p-1.5 rounded-lg transition-all opacity-50 group-hover:opacity-100"
          style={{ color: "var(--ink-muted)" }}
          title="Edit"
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "var(--parchment-dark)";
            el.style.color = "var(--gold-dark)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "transparent";
            el.style.color = "var(--ink-muted)";
          }}
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="p-1.5 rounded-lg transition-all opacity-50 group-hover:opacity-100"
          style={{ color: "var(--ink-muted)" }}
          title="Delete"
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "#fff1f1";
            el.style.color = "#dc2626";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "transparent";
            el.style.color = "var(--ink-muted)";
          }}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
