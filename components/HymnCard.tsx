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
  User,
  Layers,
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

function SortButton({
  field,
  label,
  activeField,
  direction,
  onClick,
}: {
  field: SortField;
  label: string;
  activeField: SortField;
  direction: "asc" | "desc";
  onClick: () => void;
}) {
  const isActive = activeField === field;
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
      style={{
        background: isActive ? "var(--parchment-dark)" : "transparent",
        border: "1px solid var(--rule)",
        color: isActive ? "var(--gold-dark)" : "var(--ink-muted)",
      }}
    >
      <span>{label}</span>
      {!isActive ? (
        <ChevronUp size={13} style={{ opacity: 0.4 }} />
      ) : direction === "asc" ? (
        <ChevronUp size={13} />
      ) : (
        <ChevronDown size={13} />
      )}
    </button>
  );
}

export default function HymnCardFree() {
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

        if (orderA === undefined || orderA === null) return 1;
        if (orderB === undefined || orderB === null) return -1;

        return (orderA - orderB) * dir;
      }

      return a.title.localeCompare(b.title) * dir;
    });

    return list;
  }, [hymns, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(pageStart, pageStart + PAGE_SIZE);

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
    <div className="flex flex-col gap-6 min-h-96 md:min-h-[35rem] lg:min-h-96 justify-between">
      

      {/* Grid container layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 stagger-children">
        {paginated.map((hymn) => (
          <HymnCard
            key={`${hymn._id}-hymn`}
            hymn={hymn}
            onEdit={() => openEditModal(hymn)}
            onDelete={() => openDeleteModal(hymn)}
            isDeleting={
              deleteHymn.isPending && deleteHymn.variables === hymn._id
            }
          />
        ))}
      </div>

      {/* Footer Controls */}
      <div
        className="flex flex-col md:flex-row rounded-2xl items-center justify-between gap-1 md:gap-3 px-5 py-2 md:py-4"
        style={{
          border: "1px solid var(--rule)",
          background: "var(--parchment)",
        }}
      >
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

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <PageBtn onClick={() => setPage(1)} disabled={safePage === 1} title="First page">
              <ChevronsLeft size={13} />
            </PageBtn>
            <PageBtn onClick={() => setPage(safePage - 1)} disabled={safePage === 1} title="Previous page">
              <ChevronLeft size={13} />
            </PageBtn>

            {pageNumbers[0] > 1 && (
              <span className="px-1 text-xs" style={{ color: "var(--ink-faint)" }}>…</span>
            )}

            {pageNumbers.map((n) => (
              <PageBtn key={n} onClick={() => setPage(n)} active={n === safePage} title={`Page ${n}`}>
                {n}
              </PageBtn>
            ))}

            {pageNumbers[pageNumbers.length - 1] < totalPages && (
              <span className="px-1 text-xs" style={{ color: "var(--ink-faint)" }}>…</span>
            )}

            <PageBtn onClick={() => setPage(safePage + 1)} disabled={safePage === totalPages} title="Next page">
              <ChevronRight size={13} />
            </PageBtn>
            <PageBtn onClick={() => setPage(totalPages)} disabled={safePage === totalPages} title="Last page">
              <ChevronsRight size={13} />
            </PageBtn>
          </div>
        )}
      </div>
    </div>
  );
}


// ── Reusable Individual Card Component ──────────────────────────────
function HymnCard({
  hymn,
  onEdit,
  onDelete,
  isDeleting,
}: {
  hymn: Hymn;
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
      className="flex flex-col justify-between px-4 py-2 rounded-2xl transition-all group gap-4 relative overflow-hidden"
      style={{
        border: "1px solid var(--rule)",
        background: "white",
        opacity: isDeleting ? 0.4 : 1,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--gold)";
        el.style.boxShadow = "0 4px 20px -4px rgba(0,0,0,0.05)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--rule)";
        el.style.boxShadow = "none";
      }}
    >
      {/* 1. Header Information Area: Order Tag & Category Badge */}
      <div className="flex items-center justify-between w-full">
        <span
          className="inline-flex items-center justify-center min-w-[32px] h-8 px-2 rounded-xl text-xs font-mono font-semibold"
          style={{
            background: "var(--parchment-dark)",
            color: "var(--gold-dark)",
          }}
          title={`Sort Order: ${hymn.sort_order}`}
        >
          #{hymn.sort_order}
        </span>

        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize"
          style={{ background: colors.bg, color: colors.text }}
        >
          <Layers size={11} />
          {hymn.category}
        </span>
      </div>

      {/* 2. Central Content Body: Hymn Title and Author Metadata */}
      <div className="flex flex-col gap-1.5 flex-1">
        <h3
          className="font-display text-base font-bold capitalize leading-snug line-clamp-2"
          style={{ color: "var(--ink)" }}
        >
          {hymn.title}
        </h3>
        <div className="flex items-center gap-1.5" style={{ color: "var(--ink-muted)" }}>
          <User size={13} style={{ opacity: 0.6 }} />
          <span className="text-xs capitalize truncate">
            {hymn.author || "Unknown Author"}
          </span>
        </div>
      </div>

      {/* 3. Action Section Footer: Visible exclusively to Administrative Users */}
      {user?.role === "admin" && (
        <div 
          className="flex items-center justify-end gap-1.5 pt-3 w-full"
          style={{ borderTop: "1px solid var(--rule)" }}
        >
          <button
            onClick={onEdit}
            className="inline-flex items-center justify-center p-2 rounded-xl transition-all"
            style={{ color: "var(--ink-muted)", border: "1px solid var(--rule)" }}
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
            className="inline-flex items-center justify-center p-2 rounded-xl transition-all"
            style={{ color: "var(--ink-muted)", border: "1px solid var(--rule)" }}
            title="Delete"
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "#fff1f1";
              el.style.color = "#dc2626";
              el.style.borderColor = "#fecaca";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "transparent";
              el.style.color = "var(--ink-muted)";
              el.style.borderColor = "var(--rule)";
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

// ── Reusable Pagination Controller Link Button ──────────────────────
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
        color: active ? "white" : disabled ? "var(--ink-faint)" : "var(--ink-muted)",
        border: active ? "1px solid var(--gold)" : "1px solid transparent",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !active)
          (e.currentTarget as HTMLElement).style.background = "var(--parchment-dark)";
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
