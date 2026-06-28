import "./globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Syna Systems | Operational AI Operating System (AOS)",
  description: "Secure, reliable, and observable agentic workflows for enterprise revenue cycle management.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${plusJakarta.className} bg-[#020617] text-slate-200 antialiased min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
