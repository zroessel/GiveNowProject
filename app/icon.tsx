import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Inlined from lucide-react's Heart icon (ISC licensed) — the client-only
// lucide-react component can't be rendered from this server-only route.
const HEART_PATH =
  "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#E2703A",
          borderRadius: 16,
        }}
      >
        <svg width="34" height="34" viewBox="0 0 24 24" fill="#FFF8F0">
          <path d={HEART_PATH} />
        </svg>
      </div>
    ),
    size
  );
}
