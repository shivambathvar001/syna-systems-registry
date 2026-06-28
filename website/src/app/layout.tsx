import "./globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Airwalk AI | Operational AI Infrastructure Partner",
  description: "Elite stateful agentic backbones and reliable automation for the high-friction enterprise. We deliver high-precision MVPs in 14 days.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.className} bg-[#020617] text-slate-200 antialiased`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
