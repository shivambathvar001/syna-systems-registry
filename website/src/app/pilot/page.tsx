import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PilotClient from "./PilotClient";

export const metadata: Metadata = {
  title: "Velocity Pilot Registration | Syna Systems",
  description: "Secure your 14-day velocity pilot slot with Syna Systems. Seamlessly connect Epic, Cerner, Athenahealth EHRs and calculate your projected revenue recovery.",
  keywords: ["Healthcare RCM", "AI denial resolution", "EHR integration", "Epic Systems integration", "Cerner integration", "Athenahealth", "pilot project"],
};

export default function PilotIntakePage() {
  return (
    <>
      <Navbar />
      <PilotClient />
    </>
  );
}
