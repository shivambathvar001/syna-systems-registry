import type { Metadata } from "next";
import PilotClient from "./PilotClient";

export const metadata: Metadata = {
  title: "Velocity Pilot Registration | Airwalk AI",
  description: "Secure your 14-day velocity pilot slot with Airwalk AI. Seamlessly connect Epic, Cerner, Athenahealth EHRs and calculate your projected revenue recovery.",
  keywords: ["Healthcare RCM", "AI denial resolution", "EHR integration", "Epic Systems integration", "Cerner integration", "Athenahealth", "pilot project"],
};

export default function PilotIntakePage() {
  return (
    <PilotClient />
  );
}
