"use client";
import { useCreateCategory } from "@/lib/queries";
import { EachCategory, useCategoryStore } from "@/store/categoryStore";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const AdminModal = () => {
  const createCategory = useCreateCategory();
  const { closeCategory, isCategoryModalOpen } = useCategoryStore();
  const [form, setForm] = useState<Omit<EachCategory, "_id">>({
    name: "",
  });

  const firstInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isCategoryModalOpen) {
      setForm({ name: "" });

      setTimeout(() => firstInput.current?.focus(), 50);
    }
  }, [isCategoryModalOpen]);

  if (!isCategoryModalOpen) return null;

  const isPending = createCategory.isPending;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (!form.name.trim()) return;

      await createCategory.mutateAsync(form);

      closeCategory();
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
        onClick={(e) => e.target === e.currentTarget && closeCategory()}
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
              onClick={closeCategory}
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
                Category name
              </label>
              <input
                ref={firstInput}
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. recessional"
                required
                className="w-full rounded-lg px-3 py-2.5 text-sm transition-all"
                style={{
                  background: "white",
                  border: "1px solid var(--rule)",
                  color: "var(--ink)",
                }}
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={closeCategory}
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
                {isPending ? "Saving…" : "Add Category"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminModal;
