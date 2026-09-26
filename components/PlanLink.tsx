"use client";

import type { ReactNode } from "react";
import { useTypology } from "@/components/TypologyProvider";

export function PlanLink({ type, children }: { type: string; children: ReactNode }) {
  const { selectTypology } = useTypology();

  return (
    <a
      href="#contact"
      data-type={type}
      className="type-link"
      onClick={() => selectTypology(type)}
    >
      {children}
    </a>
  );
}
