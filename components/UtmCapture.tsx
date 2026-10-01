"use client";

import { useLayoutEffect } from "react";
import { persistLandingUtm } from "@/lib/utm";

/** Enregistre les UTM dès l'arrivée, avant toute navigation interne. */
export function UtmCapture() {
  useLayoutEffect(() => {
    persistLandingUtm();
  }, []);

  return null;
}
