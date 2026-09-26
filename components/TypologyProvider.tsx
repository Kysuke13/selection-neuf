"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type TypologyContextValue = {
  typology: string;
  selectTypology: (value: string) => void;
};

const TypologyContext = createContext<TypologyContextValue | null>(null);

export function TypologyProvider({ children }: { children: ReactNode }) {
  const [typology, setTypology] = useState("");

  return (
    <TypologyContext.Provider value={{ typology, selectTypology: setTypology }}>
      {children}
    </TypologyContext.Provider>
  );
}

export function useTypology() {
  const context = useContext(TypologyContext);
  if (!context) {
    throw new Error("useTypology must be used within TypologyProvider");
  }
  return context;
}
