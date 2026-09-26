import { Apartments } from "@/components/Apartments";
import { Contact } from "@/components/Contact";
import { Facts } from "@/components/Facts";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { Location } from "@/components/Location";
import { MapSection } from "@/components/MapSection";
import { MobileCta } from "@/components/MobileCta";
import { Residence } from "@/components/Residence";
import { TypologyProvider } from "@/components/TypologyProvider";

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <main id="contenu">
        <Hero />
        <Facts />
        <Residence />
        <TypologyProvider>
          <Apartments />
          <Location />
          <Contact />
          <MapSection />
          <Footer />
        </TypologyProvider>
      </main>
      <MobileCta />
    </>
  );
}
