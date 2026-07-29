"use client";

import { useEffect, useRef, useState } from "react";
import { useHymnStore } from "@/store/hymnStore";
import { useCreateHymn, useDeleteHymn, useUpdateHymn } from "@/lib/queries";
import { X } from "lucide-react";
import { useCategoryList } from "@/store/categoryStore";
import { Hymn } from "@/types";

export default function HymnModal() {
  const { isModalOpen, modalMode, selectedHymn, closeModal } = useHymnStore();
  const createHymn = useCreateHymn();
  const updateHymn = useUpdateHymn();
  const deleteHymn = useDeleteHymn();
  const category = useCategoryList()

  const [form, setForm] = useState<Omit<Hymn, "_id">>({

    title: "",
    sort_order: 0,
    category: "",
    author: "",
  });

  const firstInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isModalOpen) {
      if (modalMode === "edit" && selectedHymn) {
        setForm({
          title: selectedHymn.title,
          sort_order: selectedHymn.sort_order,
          category: selectedHymn.category ?? "Praise",
          author: selectedHymn.author ?? "",
        });
      } else if (modalMode === "create") {
        setForm({ title: "", sort_order: null, category: "entrance", author: "" });
      }
      setTimeout(() => firstInput.current?.focus(), 50);
    }
  }, [isModalOpen, modalMode, selectedHymn]);

  if (!isModalOpen) return null;

  const isPending = createHymn.isPending || updateHymn.isPending;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (modalMode !== "delete") {
        if (!form.title.trim()) return;

        if (modalMode === "edit" && selectedHymn) {
          await updateHymn.mutateAsync({ id: selectedHymn._id, data: form });
        } else if (modalMode === "create") {
          await createHymn.mutateAsync(form);
        }
      } else {
        const deleteId = selectedHymn?._id;
        if (deleteId) deleteHymn.mutate(deleteId);
      }
      closeModal();
    } catch {}
  }

  return (
    <>
      {modalMode !== "delete" ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(26,20,16,0.55)",
            backdropFilter: "blur(2px)",
          }}
          onClick={(e) => e.target === e.currentTarget && closeModal()}
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
                {modalMode === "create"
                  ? "Add New Hymn"
                  : modalMode === "edit"
                    ? "Edit Hymn"
                    : "Delete Hymn"}
              </h2>
              <button
                onClick={closeModal}
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
                  Title
                </label>
                <input
                  ref={firstInput}
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder="e.g. Hallelujah"
                  required
                  className="w-full rounded-lg px-3 py-2.5 text-sm transition-all"
                  style={{
                    background: "white",
                    border: "1px solid var(--rule)",
                    color: "var(--ink)",
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: "var(--ink-muted)" }}
                  >
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={form.sort_order === null ? 0 : form.sort_order}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        sort_order: parseInt(e.target.value) || null,
                      }))
                    }
                    min={0}
                    className="w-full rounded-lg px-3 py-2.5 text-sm"
                    style={{
                      background: "white",
                      border: "1px solid var(--rule)",
                      color: "var(--ink)",
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: "var(--ink-muted)" }}
                  >
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, category: e.target.value }))
                    }
                    className="w-full rounded-lg px-3 py-2.5 text-sm"
                    style={{
                      background: "white",
                      border: "1px solid var(--rule)",
                      color: "var(--ink)",
                    }}
                  >
                    {category.filter((c) => c !== "all").map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--ink-muted)" }}
                >
                  Author{" "}
                  <span style={{ color: "var(--ink-faint)" }}>(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, author: e.target.value }))
                  }
                  placeholder="e.g. John Newton"
                  className="w-full rounded-lg px-3 py-2.5 text-sm"
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
                  onClick={closeModal}
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
                  {isPending
                    ? "Saving…"
                    : modalMode === "create"
                      ? "Add Hymn"
                      : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(26,20,16,0.55)",
            backdropFilter: "blur(2px)",
          }}
          onClick={(e) => e.target === e.currentTarget && closeModal()}
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
                Delete Hymn
              </h2>
              <button
                onClick={closeModal}
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
              <p>Are you sure you want to delete {selectedHymn?.title}?</p>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
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
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
