import { Metadata } from "next";
import Home from "@/components/Home";

export const metadata: Metadata = {
  title: "Anbar - AI Engineer Portfolio",
  description: "Portfolio of Anbar, an AI Engineer showcasing skills, projects, and experience.",
};

export default function Page() {
  return <Home />;
}

