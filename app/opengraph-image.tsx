import { ImageResponse } from "next/og";

export const alt =
  "Duo Verde à Montpellier — appartements neufs du T2 au T4, dès 186 538 €, Sélection Neuf";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fffaf2",
          color: "#314840",
          padding: "68px 76px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 28, letterSpacing: 6 }}>SÉLECTION NEUF</div>
          <div
            style={{
              display: "flex",
              background: "#ffcd73",
              color: "#183b30",
              padding: "16px 22px",
              fontSize: 26,
            }}
          >
            Jusqu’à 12 000 € offerts*
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 4 }}>MONTPELLIER · 34</div>
          <div style={{ display: "flex", fontSize: 96, lineHeight: 1, marginTop: 12 }}>Duo Verde</div>
          <div style={{ display: "flex", fontSize: 34, marginTop: 18 }}>
            Appartements neufs du T2 au T4, dans un parc de 5 000 m²
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 32,
            borderTop: "2px solid #d6ddd4",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex" }}>Dès 186 538 €*</div>
          <div style={{ display: "flex" }}>Route de Lavérune · Livraison fin 2027</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
