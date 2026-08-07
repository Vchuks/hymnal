"use client"
import AdminModal from "@/components/AdminModal"
import CategoryModal from "@/components/CategoryModal"
import HymnModal from "@/components/HymnModal"
import HymnStats from "@/components/HymnStats"
import HymnTable from "@/components/HymnTable"
import HymnToolbar from "@/components/HymnToolbar"
import { useDeleteCategory } from "@/lib/queries"
import { EachCategory, useCategoryStore } from "@/store/categoryStore"
import { useAuthStore } from "@/store/userStore"
import { useQueryClient } from "@tanstack/react-query"
import { ChevronDown, Music4 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

const AdminDashboard = () => {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false)
  const {openAdmin} = useAuthStore()
  const {openDeleteModal} = useCategoryStore()
  const logout = useAuthStore(state=>state.logout)
  const router = useRouter()
  const queryClient = useQueryClient()
  const dropdownRef = useRef<HTMLUListElement | null>(null);

   useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

const handleLogout = () => {
    // 1. Clear the entire TanStack Query cache in memory
    queryClient.clear();

    // 2. Wipe the Zustand store state and localStorage tokens
    logout();

    // 3. Force redirect the user back to the login page
    router.replace("/login");
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
          position: "relative"
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
            <ChevronDown size={20} className="ml-3"/>
            </div>
          {openDropdown && <ul ref={dropdownRef} className="absolute block bg-white shadow-sm list-disc px-5 py-3 -bottom-32 -right-2 rounded-b-lg w-44 space-y-2">
          <li onClick={openAdmin} className="cursor-pointer text-base xl:text-lg" >Update Admin</li>
          <li onClick={openDeleteModal} className="cursor-pointer text-base xl:text-lg" >Delete Category</li>
          <li className="cursor-pointer text-base xl:text-lg" onClick={handleLogout}>Logout</li>
           
        </ul>}
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

        {/* Stats */}
        <HymnStats />

        {/* Toolbar */}
        <HymnToolbar />

        {/* Table */}
        
          <HymnTable />
        
      </main>

      {/* Modal (portal) */}
      <HymnModal />
      <CategoryModal/>
      <AdminModal/>
      
    </div>
  )
}

export default AdminDashboard
