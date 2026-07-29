"use client";

import { useHymns } from "@/lib/queries";
import { BookOpen, Music2, Star } from "lucide-react";

export default function HymnStats() {
  const { data: hymns = [], isLoading } = useHymns();
  
  if (isLoading) return null;

  const total = hymns.length;
  const categories = new Set(hymns.map((h) => h.category)).size;
  const highest = hymns.reduce((max, h) => Math.max(max, h.sort_order ?? 0), 0);

  const stats = [
    { icon: BookOpen, label: "Total Hymns", value: total },
    { icon: Star, label: "Categories", value: categories },
    { icon: Music2, label: "Highest Order", value: highest },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="rounded-xl p-2 md:px-4 md:py-3 flex items-center gap-1 md:gap-3"
          style={{ background: "white", border: "1px solid var(--rule)" }}
        >
          <div
            className="w-6 h-6 md:w-9 md:h-9 rounded-lg hidden md:flex items-center justify-center flex-shrink-0 "
            style={{ background: "var(--parchment-dark)" }}
          >
            <Icon size={16} style={{ color: "var(--gold-dark)" }} />
          </div>
          <div className="m-auto md:m-0">
            <p
              className="text-center md:text-left text-xl font-display font-semibold leading-none"
              style={{ color: "var(--ink)" }}
            >
              {value}
            </p>
            <p
              className="text-center md:text-left text-xs mt-0.5"
              style={{ color: "var(--ink-faint)" }}
            >
              {label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
