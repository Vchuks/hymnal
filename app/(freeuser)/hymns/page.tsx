"use client";
import CategoryModal from "@/components/CategoryModal";
import HymnModal from "@/components/HymnModal";
import HymnStats from "@/components/HymnStats";
import HymnTable from "@/components/HymnTable";
import HymnToolbar from "@/components/HymnToolbar";
import { useDeleteCategory } from "@/lib/queries";
import { EachCategory, useCategoryStore } from "@/store/categoryStore";
import { ChevronDown, Music4 } from "lucide-react";
import { useState } from "react";

const UserDashboard = () => {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const { openCategory } = useCategoryStore();

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--parchment-gold)" }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: "1px solid var(--rule)",
          background: "white",
          position: "relative",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "var(--gold)" }}
            >
              <Music4 size={20} color="white" />
            </div>
            <div>
              <h1
                className="font-display text-xl font-bold leading-none"
                style={{ color: "var(--ink)" }}
              >
                Hymnal
              </h1>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--ink-faint)" }}
              >
                Song Directory
              </p>
            </div>
          </div>

          <div
            className="text-xs cursor-pointer px-3 py-1.5 rounded-full flex items-center justify-between"
            style={{
              background: "var(--parchment-dark)",
              color: "var(--ink-muted)",
              border: "1px solid var(--rule)",
            }}
          >
            v1.0
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Page title */}
        <div>
          <h2
            className="font-display text-3xl font-bold"
            style={{ color: "var(--gold)" }}
          >
            Song Collection
          </h2>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--parchment-dark)" }}
          >
            Manage your hymnal with title and sort order
          </p>
        </div>

        {/* Stats */}
        <HymnStats />

        {/* Toolbar */}
        <HymnToolbar />

        {/* Table */}

        <HymnTable />
      </main>

      {/* Modal (portal) */}
      <HymnModal />
      <CategoryModal />
    </div>
  );
};

export default UserDashboard;
