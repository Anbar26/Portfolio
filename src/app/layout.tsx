import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import SiteBackground from "@/components/SiteBackground";

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

export const metadata: Metadata = {
  title: "Anbar — AI Engineer",
  description: "Portfolio of Anbar, an AI Engineer specializing in machine learning, deep learning, and AI product development.",
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
      </body>
    </html>
  );
}
