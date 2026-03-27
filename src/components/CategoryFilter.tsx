"use client";

import { Chip } from "@nextui-org/react";
import { CATEGORIES, CATEGORY_ICONS } from "@/types/expense";

interface Props {
  selected: string;
  onChange: (category: string) => void;
  counts: Record<string, number>;
}

export default function CategoryFilter({ selected, onChange, counts }: Props) {
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);

  return (
    <div className="flex gap-2 flex-wrap">
      <Chip
        key="All"
        variant={selected === "All" ? "solid" : "flat"}
        color={selected === "All" ? "primary" : "default"}
        className="cursor-pointer select-none"
        onClick={() => onChange("All")}
      >
        All {total > 0 && `(${total})`}
      </Chip>
      {CATEGORIES.map((cat) => {
        const count = counts[cat] ?? 0;
        if (count === 0) return null;
        return (
          <Chip
            key={cat}
            variant={selected === cat ? "solid" : "flat"}
            color={selected === cat ? "primary" : "default"}
            className="cursor-pointer select-none"
            onClick={() => onChange(cat)}
          >
            {CATEGORY_ICONS[cat]} {cat} ({count})
          </Chip>
        );
      })}
    </div>
  );
}
