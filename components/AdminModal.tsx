"use client";
import { updateAdminUser } from "@/lib/api";
import { useCreateCategory, useUpdateAdmin } from "@/lib/queries";
import { EachCategory, useCategoryStore } from "@/store/categoryStore";
import { EachAdmin, useAuthStore } from "@/store/userStore";
import { EyeIcon, EyeOffIcon, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const AdminModal = () => {
  const updateAdminUser = useUpdateAdmin();
  const { closeAdmin, isAdminModalOpen } = useAuthStore();
  const [form, setForm] = useState<Omit<EachAdmin, "_id">>({
    username: "",
    password: "",
  });

  const [passwordType, setPasswordType] = useState("password");
  const handlePassword = () => {
    return passwordType === "password"
      ? setPasswordType("text")
      : setPasswordType("password");
  };

  const firstInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isAdminModalOpen) {
      setForm({ username: "", password: "" });

      setTimeout(() => firstInput.current?.focus(), 50);
    }
  }, [isAdminModalOpen]);

  if (!isAdminModalOpen) return null;

  const isPending = updateAdminUser.isPending;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (!form.username.trim()) return;

      await updateAdminUser.mutateAsync(form);

      closeAdmin();
    } catch {}
  }
  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          background: "rgba(26,20,16,0.55)",
          backdropFilter: "blur(2px)",
        }}
        onClick={(e) => e.target === e.currentTarget && closeAdmin()}
      >
        <div
          className="w-full max-w-md rounded-2xl shadow-2xl animate-fade-in"
          style={{
            background: "var(--parchment)",
            border: "1px solid var(--rule)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: "1px solid var(--rule)" }}
          >
            <h2
              className="font-display text-xl"
              style={{ color: "var(--ink)" }}
            >
              Add New Admin
            </h2>
            <button
              onClick={closeAdmin}
              className="rounded-lg p-1.5 transition-colors"
              style={{ color: "var(--ink-muted)" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "var(--parchment-dark)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "transparent")
              }
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--ink-muted)" }}
              >
                Admin Username
              </label>
              <input
                ref={firstInput}
                type="text"
                value={form.username}
                name="username"
                onChange={(e) =>
                  setForm((f) => ({ ...f, username: e.target.value }))
                }
                placeholder="e.g. update admin"
                required
                className="w-full rounded-lg px-3 py-2.5 text-sm transition-all"
                style={{
                  background: "white",
                  border: "1px solid var(--rule)",
                  color: "var(--ink)",
                }}
              />
            </div>
            <div className="flex flex-col relative transform hover:scale-105 transition-transform duration-200">
              <label htmlFor="password" className="font-medium text-sm pb-2">
                Password
              </label>
              <input
                type={passwordType}
                placeholder="Enter password"
                value={form.password}
                name="password"
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
                id="password"
                className="border border-[#22205747] rounded-lg px-6 py-3 transition-all duration-300"
              />
              <div
                className="absolute top-10 right-4 cursor-pointer hover:scale-110 transition-transform duration-200"
                onClick={handlePassword}
              >
                {passwordType === "password" ? (
                  <EyeOffIcon className="w-4 text-gray-500 hover:text-[#8a6f2e]" />
                ) : (
                  <EyeIcon className="w-4 text-gray-500 hover:text-[#8a6f2e]" />
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={closeAdmin}
                className="flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors"
                style={{
                  border: "1px solid var(--rule)",
                  color: "var(--ink-muted)",
                  background: "transparent",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "var(--parchment-dark)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "transparent")
                }
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 rounded-lg py-2.5 text-sm font-medium transition-all"
                style={{
                  background: isPending ? "var(--gold-dark)" : "var(--gold)",
                  color: "white",
                  border: "none",
                  opacity: isPending ? 0.8 : 1,
                }}
              >
                {isPending ? "Saving…" : "Update Admin"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminModal;
