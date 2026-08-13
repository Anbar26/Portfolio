import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import SiteBackground from "@/components/SiteBackground";
import AskAboutMe from "@/components/chat/AskAboutMe";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const dirtyline = localFont({
  src: "../../public/fonts/Dirtyline36Daysoftype2022/Dirtyline 36daysoftype 2022.otf",
  variable: "--font-dirtyline",
});

const absans = localFont({
  src: "../../public/fonts/absans-main/fonts/Absans-Regular.woff2",
  variable: "--font-absans",
});

const kenoky = localFont({
  src: "../../public/fonts/kenoky_coffekan/KenokyLight.ttf",
  variable: "--font-kenoky",
});

const elanor = localFont({
  src: "../../public/fonts/Elanor-Free/ElanorFreePersonalUse-ExBdIt.otf",
  variable: "--font-elanor",
});

/**
 * Where the site lives, for canonical links and social card images — both of
 * which need absolute URLs.
 *
 * Vercel exposes the production domain itself, so a deployment gets this right
 * with no configuration. Set NEXT_PUBLIC_SITE_URL to override once a custom
 * domain is attached, otherwise a preview build would advertise its own
 * throwaway URL as canonical.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const NAME = "Anbar Althaf";
const ROLE = "AI & Machine Learning Engineer";
const SUMMARY =
  "Computer Science student and AI/ML engineer. ML internships at Tenderd and PointMatrix building data pipelines over 58M+ records, and projects across AI security, reinforcement learning and AI agents.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  /*
   * A person's name first, because that is what a recruiter types into Google.
   * The template gives any future page a consistent suffix without repeating it.
   */
  title: {
    default: `${NAME} — ${ROLE}`,
    template: `%s · ${NAME}`,
  },
  description: SUMMARY,
  applicationName: `${NAME} — Portfolio`,
  authors: [{ name: NAME, url: "https://github.com/Anbar26" }],
  creator: NAME,
  keywords: [
    NAME, "Anbar", "AI engineer", "machine learning engineer", "ML intern",
    "deep learning", "computer vision", "reinforcement learning", "AI security",
    "Python", "PyTorch", "FastAPI", "portfolio", "Manipal Institute of Technology",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    firstName: "Anbar",
    lastName: "Althaf",
    title: `${NAME} — ${ROLE}`,
    description: SUMMARY,
    url: SITE_URL,
    siteName: `${NAME} — Portfolio`,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${NAME} — ${ROLE}`,
    description: SUMMARY,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${dirtyline.variable} ${absans.variable} ${kenoky.variable} ${elanor.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteBackground />
        <SmoothScroll>{children}</SmoothScroll>
        {/* Outside <SmoothScroll> on purpose: #smooth-content is permanently
            transformed, and `position: fixed` inside a transformed ancestor is
            fixed to that ancestor, not the viewport. */}
        <AskAboutMe />
      </body>
    </html>
  );
}
