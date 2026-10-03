import type { Metadata, Viewport } from "next";
import { Frank_Ruhl_Libre, Source_Sans_3 } from "next/font/google";
import { BrochureModalProvider } from "@/components/BrochureModalProvider";
import { GoogleTag } from "@/components/GoogleTag";
import { Header } from "@/components/Header";
import { UtmCapture } from "@/components/UtmCapture";
import { PAGE_DESCRIPTION, PAGE_TITLE, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const frankRuhl = Frank_Ruhl_Libre({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: PAGE_TITLE,
    template: "%s | Sélection Neuf",
  },
  description: PAGE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "immobilier",
  keywords: [
    "Duo Verde",
    "appartement neuf Montpellier",
    "Sélection Neuf",
    "route de Lavérune",
    "T2 Montpellier",
    "T3 Montpellier",
    "T4 Montpellier",
  ],
  alternates: {
    canonical: "/",
    languages: { "fr-FR": "/" },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: SITE_NAME,
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  other: {
    "geo.region": "FR-34",
    "geo.placename": "Montpellier",
  },
};

export const viewport: Viewport = {
  themeColor: "#4a7063",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${sourceSans.variable} ${frankRuhl.variable}`}>
      <body>
        <GoogleTag />
        <UtmCapture />
        <BrochureModalProvider>
          <a className="skip-link" href="#contenu">
            Aller au contenu
          </a>
          <Header />
          {children}
        </BrochureModalProvider>
      </body>
    </html>
  );
}
