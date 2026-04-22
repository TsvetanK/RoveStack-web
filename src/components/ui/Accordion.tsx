"use client";

import { useState } from "react";

interface AccordionItem {
  q: string;
  a: string;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: number;
}

export function Accordion({ items, defaultOpen = 0 }: AccordionProps) {
  const [open, setOpen] = useState<number | null>(defaultOpen);

  return (
    <div className="flex flex-col">
      {items.map((item, i) => (
        <div
          key={i}
          className={[
            "border-t border-[var(--line-strong)] py-6 cursor-pointer",
            i === items.length - 1 ? "border-b border-[var(--line-strong)]" : "",
          ].join(" ")}
          onClick={() => setOpen(open === i ? null : i)}
        >
          <div className="flex justify-between items-center gap-6">
            <span className="font-display text-[1.25rem] font-medium tracking-[-0.015em]">
              {item.q}
            </span>
            <span
              className={[
                "w-7 h-7 flex-shrink-0 rounded-full border border-[var(--line-strong)]",
                "grid place-items-center transition-all duration-200",
                open === i ? "rotate-45 bg-ink text-paper border-ink" : "",
              ].join(" ")}
              aria-hidden="true"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
          </div>
          <div
            className={[
              "overflow-hidden transition-all duration-300 ease-in-out text-mute leading-relaxed",
              open === i ? "max-h-80 mt-4" : "max-h-0",
            ].join(" ")}
          >
            {item.a}
          </div>
        </div>
      ))}
    </div>
  );
}
