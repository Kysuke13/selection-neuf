import { entryApartment } from "@/lib/site";

export function MobileCta() {
  return (
    <div className="mobile-cta">
      <span>
        Dès <strong>{entryApartment.priceLabel} €*</strong>
      </span>
      <a className="button small" href="#contact">
        Recevoir les plans ↗
      </a>
    </div>
  );
}
