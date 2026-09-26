import type { MetadataRoute } from "next";
import { PAGE_DESCRIPTION } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Duo Verde — Sélection Neuf",
    short_name: "Duo Verde",
    description: PAGE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#fffaf2",
    theme_color: "#4a7063",
    lang: "fr",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
