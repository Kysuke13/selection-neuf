"use client";

import { useEffect, useState } from "react";
import { entryApartment } from "@/lib/site";

export function MobileCta({ priceLabel = entryApartment.priceLabel }: { priceLabel?: string }) {
  const [visible, setVisible] = useState(false);

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
      <a className="button small" href="#contact" tabIndex={visible ? undefined : -1}>
        Recevoir les plans ↗
      </a>
    </div>
  );
}
