"use client";

import { useMemo } from "react";
import { useHymns, useDeleteHymn } from "@/lib/queries";
import { useHymnStore } from "@/store/hymnStore";
import { Hymn, SortField } from "@/types";
import {
  ChevronUp,
  ChevronDown,
  Pencil,
  Trash2,
  Music2,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import { useAuthStore } from "@/store/userStore";

const PAGE_SIZE = 10;
const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Praise: { bg: "#fef3c7", text: "#92400e" },
  Classic: { bg: "#e0e7ff", text: "#3730a3" },
  Worship: { bg: "#d1fae5", text: "#065f46" },
  Comfort: { bg: "#fce7f3", text: "#9d174d" },
  Assurance: { bg: "#f3e8ff", text: "#6b21a8" },
};

function SortIcon({
  field,
  activeField,
  direction,
}: {
  field: SortField;
  activeField: SortField;
  direction: "asc" | "desc";
}) {
  if (activeField !== field)
    return (
      <ChevronUp size={13} style={{ color: "var(--ink)", opacity: 0.4 }} />
    );
  return direction === "asc" ? (
    <ChevronUp size={13} style={{ color: "var(--gold)" }} />
  ) : (
    <ChevronDown size={13} style={{ color: "var(--gold)" }} />
  );
}

export default function HymnTable() {
  const { data: hymns = [], isLoading, isError } = useHymns();
  const {
    filters,
    openEditModal,
    openDeleteModal,
    setSortField,
    toggleSortDirection,
    currentPage,
    setPage,
  } = useHymnStore();
  const deleteHymn = useDeleteHymn();
  const { user } = useAuthStore();

  const filtered = useMemo(() => {
    let list = [...hymns];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (h) =>
          h.title.toLowerCase().includes(q) ||
          h.author?.toLowerCase().includes(q),
      );
    }

    if (filters.category !== "all") {
      list = list.filter((h) => h.category === filters.category);
    }
    list.sort((a, b) => {
      const dir = filters.sortDirection === "asc" ? 1 : -1;

      if (filters.sortField === "sortOrder") {
        const orderA = a.sort_order;
        const orderB = b.sort_order;

        // Handle missing sort_order values (push them to the bottom)
        if (orderA === undefined || orderA === null) return 1;
        if (orderB === undefined || orderB === null) return -1;

        // If both have sort_order, compare numbers normally
        return (orderA - orderB) * dir;
      }

      // Fallback to title sorting
      return a.title.localeCompare(b.title) * dir;
    });

    return list;
  }, [hymns, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  // Page-number buttons (window of ±2 around current)
  const pageNumbers = useMemo(() => {
    const left = Math.max(1, safePage - 2);
    const right = Math.min(totalPages, safePage + 2);
    return Array.from({ length: right - left + 1 }, (_, i) => left + i);
  }, [safePage, totalPages]);

  function handleSort(field: SortField) {
    if (filters.sortField === field) toggleSortDirection();
    else setSortField(field);
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Music2 size={32} style={{ color: "var(--gold)", opacity: 0.6 }} />
        <p className="text-sm" style={{ color: "var(--parchment)" }}>
          Loading hymnal…
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="rounded-xl p-8 text-center"
        style={{ background: "#fff5f5", border: "1px solid #fecaca" }}
      >
        <p className="text-sm font-medium text-red-700">
          Failed to load hymns. Please refresh.
        </p>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Music2 size={40} style={{ color: "var(--ink-faint)", opacity: 0.4 }} />
        <p style={{ color: "var(--ink-faint)" }} className="text-sm">
          No hymns found
        </p>
        {filters.search && (
          <p style={{ color: "var(--ink-faint)" }} className="text-xs">
            Try a different search term
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div
        className="rounded-t-2xl overflow-x-auto"
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
          <div className="flex items-center gap-1 py-3 ">
            <span>S/N</span>
          </div>
          <div
            className="flex items-center gap-1 py-3 cursor-pointer"
            onClick={() => handleSort("title")}
          >
            <span>Title</span>
            <SortIcon
              field="title"
              activeField={filters.sortField}
              direction={filters.sortDirection}
            />
          </div>
          <div
            className="flex items-center py-3 cursor-pointer"
            onClick={() => handleSort("sortOrder")}
          >
            <span>Order</span>
            <SortIcon
              field="sortOrder"
              activeField={filters.sortField}
              direction={filters.sortDirection}
            />
          </div>
          <div className="flex items-center py-3">Category</div>
          <div className="flex items-center py-3">Author</div>
          {user?.role === "admin" && (
            <div className="flex items-center justify-end py-3">Actions</div>
          )}
        </div>

        {/* Rows */}
        <div
          className="divide-y stagger-children"
          style={{ borderColor: "var(--rule)" }}
        >
          {paginated.map((hymn, idx) => {
            return (
              <HymnRow
                key={`${hymn._id} -hymn`}
                hymn={hymn}
                index={idx + 1}
                onEdit={() => openEditModal(hymn)}
                onDelete={() => openDeleteModal(hymn)}
                // onDelete={() => deleteHymn.mutate(hymn.id)}
                isDeleting={
                  deleteHymn.isPending && deleteHymn.variables === hymn._id
                }
              />
            );
          })}
        </div>
      </div>
      {/* Footer */}
      <div
        className="flex flex-col md:flex-row rounded-b-2xl  items-center justify-between gap-3 px-4 py-3"
        style={{
          borderTop: "1px solid var(--rule)",
          background: "var(--parchment)",
        }}
      >
        {/* Result range */}
        <p className="text-xs" style={{ color: "var(--ink-faint)" }}>
          Showing{" "}
          <span style={{ color: "var(--ink-muted)", fontWeight: 600 }}>
            {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filtered.length)}
          </span>{" "}
          of{" "}
          <span style={{ color: "var(--ink-muted)", fontWeight: 600 }}>
            {filtered.length}
          </span>{" "}
          hymn{filtered.length !== 1 ? "s" : ""}
          {filters.search || filters.category !== "all" ? " (filtered)" : ""}
        </p>

        {/* Page buttons */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <PageBtn
              onClick={() => setPage(1)}
              disabled={safePage === 1}
              title="First page"
            >
              <ChevronsLeft size={13} />
            </PageBtn>
            <PageBtn
              onClick={() => setPage(safePage - 1)}
              disabled={safePage === 1}
              title="Previous page"
            >
              <ChevronLeft size={13} />
            </PageBtn>

            {pageNumbers[0] > 1 && (
              <span
                className="px-1 text-xs"
                style={{ color: "var(--ink-faint)" }}
              >
                …
              </span>
            )}

            {pageNumbers.map((n) => (
              <PageBtn
                key={n}
                onClick={() => setPage(n)}
                active={n === safePage}
                title={`Page ${n}`}
              >
                {n}
              </PageBtn>
            ))}

            {pageNumbers[pageNumbers.length - 1] < totalPages && (
              <span
                className="px-1 text-xs"
                style={{ color: "var(--ink-faint)" }}
              >
                …
              </span>
            )}

            <PageBtn
              onClick={() => setPage(safePage + 1)}
              disabled={safePage === totalPages}
              title="Next page"
            >
              <ChevronRight size={13} />
            </PageBtn>
            <PageBtn
              onClick={() => setPage(totalPages)}
              disabled={safePage === totalPages}
              title="Last page"
            >
              <ChevronsRight size={13} />
            </PageBtn>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Pagination button ─────────────────────────────────────────
function PageBtn({
  children,
  onClick,
  disabled = false,
  active = false,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="inline-flex items-center justify-center min-w-[28px] h-7 px-1.5 rounded-lg text-xs font-medium transition-all"
      style={{
        background: active ? "var(--gold)" : "transparent",
        color: active
          ? "white"
          : disabled
            ? "var(--ink-faint)"
            : "var(--ink-muted)",
        border: active ? "1px solid var(--gold)" : "1px solid transparent",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !active)
          (e.currentTarget as HTMLElement).style.background =
            "var(--parchment-dark)";
      }}
      onMouseLeave={(e) => {
        if (!active)
          (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      {children}
    </button>
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
  const colors = CATEGORY_COLORS[hymn.category ?? ""] ?? {
    bg: "#f3f4f6",
    text: "#374151",
  };
  const { user } = useAuthStore();

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
        <p
          className="font-display text-sm font-medium capitalize"
          style={{ color: "var(--ink)" }}
        >
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
          {hymn.sort_order}
        </span>
      </div>

      {/* Category */}
      <div className="py-4">
        <span
          className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize"
          style={{ background: colors.bg, color: colors.text }}
        >
          {hymn.category}
        </span>
      </div>

      {/* Author */}
      <div className="py-4">
        <span
          className="text-sm capitalize"
          style={{ color: "var(--ink-muted)" }}
        >
          {hymn.author || "—"}
        </span>
      </div>

      {/* Actions */}
      {user?.role === "admin" && (
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
      )}
    </div>
  );
}
