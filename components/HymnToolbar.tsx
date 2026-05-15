"use client";

import { useHymnStore } from "@/store/hymnStore";
import { useHymns } from "@/lib/queries";
import { CATEGORIES } from "@/lib/api";
import { Search, Plus, SlidersHorizontal } from "lucide-react";

export default function HymnToolbar() {
  const { filters, setSearch, setCategory, openCreateModal } = useHymnStore();
  const { data: hymns = [] } = useHymns();

  const categoryCounts = CATEGORIES.reduce<Record<string, number>>((acc, cat) => {
    acc[cat] = cat === "All" ? hymns.length : hymns.filter((h) => h.category === cat).length;
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-4">
      {/* Search + Add */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--ink-faint)" }}
          />
          <input
            type="text"
            placeholder="Search hymns or authors…"
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm transition-all"
            style={{
              background: "white",
              border: "1px solid var(--rule)",
              color: "var(--ink)",
            }}
          />
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap"
          style={{
            background: "var(--gold)",
            color: "white",
            border: "none",
            boxShadow: "0 2px 8px rgba(201,168,76,0.35)",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "var(--gold-dark)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "var(--gold)")
          }
        >
          <Plus size={16} />
          Add Hymn
        </button>
      </div>

      {/* Category pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <SlidersHorizontal size={13} style={{ color: "var(--ink-faint)" }} />
        {CATEGORIES.map((cat) => {
          const active = filters.category === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all"
              style={{
                background: active ? "var(--gold)" : "white",
                color: active ? "white" : "var(--ink-muted)",
                border: `1px solid ${active ? "var(--gold)" : "var(--rule)"}`,
              }}
            >
              {cat}
              <span
                className="rounded-full px-1.5 py-0.5 text-xs"
                style={{
                  background: active ? "rgba(255,255,255,0.25)" : "var(--parchment-dark)",
                  color: active ? "white" : "var(--ink-faint)",
                  fontSize: "10px",
                }}
              >
                {categoryCounts[cat] ?? 0}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
