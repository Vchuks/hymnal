"use client";

import { useHymnStore } from "@/store/hymnStore";
import { useGetCategory, useHymns } from "@/lib/queries";
import { Search, Plus, SlidersHorizontal } from "lucide-react";
import { useCategoryList, useCategoryStore } from "@/store/categoryStore";
import { useAuthStore } from "@/store/userStore";


export default function HymnToolbar() {
  const { filters, setSearch, setCategory, openCreateModal } = useHymnStore();
  const { openCreateModal: openCat } = useCategoryStore();
  const { data: hymns = [] } = useHymns();
  const { user } = useAuthStore();

  useGetCategory();
  const category = useCategoryList();

  const categoryCounts = category.reduce<Record<string, number>>((acc, cat) => {
    acc[cat] =
      cat === "all"
        ? hymns.length
        : hymns.filter((h) => h.category === cat).length;
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-4">
      {/* Search + Add */}
      <div className="flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
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
        {user?.role === "admin" && (
          <div className="flex justify-between gap-4 w-full md:w-auto">
            <button
              onClick={openCat}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap"
              style={{
                background: "var(--gold)",
                color: "white",
                border: "none",
                boxShadow: "0 2px 8px rgba(201,168,76,0.35)",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "var(--gold-dark)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "var(--gold)")
              }
            >
              <Plus size={16} />
              Add Category
            </button>
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
                ((e.currentTarget as HTMLElement).style.background =
                  "var(--gold-dark)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "var(--gold)")
              }
            >
              <Plus size={16} />
              Add Hymn
            </button>
          </div>
        )}
      </div>

      {/* Category pills */}
      <div className="flex items-baseline gap-2">
        
        <div className={`flex items-center gap-2 md:flex-wrap w-full max-w-[30rem] md:max-w-full overflow-x-auto`}>
          {category.sort().map((cat, idx) => {
            const active = filters.category === cat;
            return (
              <button
                key={idx}
                onClick={() => setCategory(cat)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs capitalize font-medium transition-all"
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
                    background: active
                      ? "rgba(255,255,255,0.25)"
                      : "var(--parchment-dark)",
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
    </div>
  );
}
