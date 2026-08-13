import { ImageResponse } from "next/og";

/**
 * The card that appears when the site is pasted into LinkedIn, WhatsApp, Slack
 * or a DM. Without one those links render as a bare grey box with a URL, which
 * is the opposite of the impression a portfolio is for.
 *
 * Drawn here rather than shipped as a PNG so it stays in the site's palette and
 * can be edited as code. Next serves it for both Open Graph and Twitter.
 */

export const alt = "Anbar Althaf — AI & Machine Learning Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          // the site's own warm paper and rose wash
          background:
            "linear-gradient(135deg, #fff8fa 0%, #fffdfc 45%, #ffeef1 100%)",
          position: "relative",
        }}
      >
        {/* a soft bloom in the corner, echoing the hero flower */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -160,
            width: 620,
            height: 620,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(251,207,232,0.85) 0%, rgba(253,164,175,0.35) 45%, rgba(255,255,255,0) 70%)",
          }}
        />
        <div
          style={{
            fontSize: 26,
            letterSpacing: 14,
            textTransform: "uppercase",
            color: "#e11d75",
            marginBottom: 28,
          }}
        >
          Software Developer
        </div>
        <div style={{ fontSize: 104, color: "#5c1a2e", lineHeight: 1.05, fontWeight: 600 }}>
          Anbar Althaf
        </div>
        <div style={{ fontSize: 40, color: "rgba(92,26,46,0.72)", marginTop: 18 }}>
          AI &amp; Machine Learning Engineer
        </div>
        <div
          style={{
            display: "flex",
            gap: 18,
            marginTop: 46,
            fontSize: 24,
            color: "rgba(92,26,46,0.55)",
          }}
        >
          <span>Machine Learning</span>
          <span>·</span>
          <span>Computer Vision</span>
          <span>·</span>
          <span>AI Security</span>
        </div>
        <div
          style={{
            position: "absolute",
            left: 96,
            bottom: 56,
            width: 132,
            height: 3,
            background: "linear-gradient(to right, #fb7185, rgba(251,113,133,0))",
          }}
        />
      </div>
    ),
    size
  );
}
