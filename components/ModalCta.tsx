"use client";

import type { ReactNode } from "react";
import { useBrochureModal } from "@/components/BrochureModalProvider";

export function ModalCta({
  className,
  children,
  typology,
}: {
  className?: string;
  children: ReactNode;
  typology?: string;
}) {
  const { openModal } = useBrochureModal();

  return (
    <button
      type="button"
      className={className}
      onClick={() => openModal(typology ? { typology } : undefined)}
    >
      {children}
    </button>
  );
}
