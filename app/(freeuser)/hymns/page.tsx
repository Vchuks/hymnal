"use client";
import HymnCardFree from "@/components/HymnCard";
import HymnToolbar from "@/components/HymnToolbar";
import { ChevronDown, Music4 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const UserDashboard = () => {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

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
            className="text-xs cursor-pointer px-3 py-1.5 rounded-full flex items-center justify-between relative"
            style={{
              background: "var(--parchment-dark)",
              color: "var(--ink-muted)",
              border: "1px solid var(--rule)",
            }}
          >
            <div
              className="flex items-center justify-between"
              onClick={() => setOpenDropdown(!openDropdown)}
            >
              v1.0
              <ChevronDown size={20} className="ml-3" />
            </div>
            {openDropdown && (
              <div className="w-28 lg:w-36 absolute  bg-white shadow-sm px-3 lg:px-5 py-3 -bottom-14 md:-bottom-16 -right-2 rounded-b-lg ">
                <p
                  className="cursor-pointer text-sm lg:text-base font-bold"
                  onClick={handleLogin}
                >
                  Admin Login
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-4 lg:py-8 space-y-6">
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

        {/* Toolbar */}
        <HymnToolbar />

        {/* Table */}

        <HymnCardFree />
      </main>
    </div>
  );
};

export default UserDashboard;
