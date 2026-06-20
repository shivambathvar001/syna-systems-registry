import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Syna Systems | Operational AI Infrastructure Partner",
  description: "Elite stateful agentic backbones and reliable automation for the high-friction enterprise.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#020617] text-slate-200 antialiased`}>
        {children}
      </body>
    </html>
  );
}
