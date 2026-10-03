"use client";

import { useEffect, useState } from "react";
import { useBrochureModal } from "@/components/BrochureModalProvider";
import { entryApartment } from "@/lib/site";

export function MobileCta({ priceLabel = entryApartment.priceLabel }: { priceLabel?: string }) {
  const [visible, setVisible] = useState(false);
  const { openModal } = useBrochureModal();

  useEffect(() => {
    const form = document.getElementById("contact");
    if (!form) return;

    const update = () => {
      const headerHeight = document.querySelector("header")?.offsetHeight ?? 0;
      setVisible(form.getBoundingClientRect().bottom <= headerHeight);
    };

    update();
    const observer = new IntersectionObserver(update, {
      threshold: [0, 1],
    });
    observer.observe(form);
    window.addEventListener("scroll", update, { passive: true });
    document.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
      document.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className={`mobile-cta${visible ? " is-visible" : ""}`} aria-hidden={!visible}>
      <span>
        Dès <strong>{priceLabel} €*</strong>
      </span>
      <button
        className="button small"
        type="button"
        tabIndex={visible ? undefined : -1}
        onClick={() => openModal()}
      >
        Recevoir les plans ↗
      </button>
    </div>
  );
}
