"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { BrochureModal } from "@/components/BrochureModal";
import { allureTypologies } from "@/lib/allure";
import { canopeaTypologies } from "@/lib/canopea";

type OpenModalOptions = { typology?: string };

type BrochureModalContextValue = {
  openModal: (options?: OpenModalOptions) => void;
};

const BrochureModalContext = createContext<BrochureModalContextValue | null>(null);

const SOURCE_BY_PATH: Record<string, string> = {
  "/allure": "allure-pontoise",
  "/canopea": "canopea-montpellier",
};

const TYPOLOGIES_BY_PATH: Record<string, readonly { value: string; label: string }[]> = {
  "/allure": allureTypologies,
  "/canopea": canopeaTypologies,
};

export function BrochureModalProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [typology, setTypology] = useState("");

  const source = SOURCE_BY_PATH[pathname ?? "/"] ?? "duo-verde-montpellier";
  const typologies = TYPOLOGIES_BY_PATH[pathname ?? "/"];

  const openModal = useCallback((options?: OpenModalOptions) => {
    setTypology(options?.typology ?? "");
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <BrochureModalContext.Provider value={{ openModal }}>
      {children}
      <BrochureModal
        open={open}
        onClose={closeModal}
        source={source}
        typologies={typologies}
        initialTypology={typology}
      />
    </BrochureModalContext.Provider>
  );
}

export function useBrochureModal() {
  const context = useContext(BrochureModalContext);
  if (!context) {
    throw new Error("useBrochureModal must be used within BrochureModalProvider");
  }
  return context;
}
