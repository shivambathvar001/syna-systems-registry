import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Syna Systems",
  description: "Read the Terms of Service for Syna Systems custom agentic solutions and 14-day velocity pilot projects.",
};

export default function TermsPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-[#020617] text-slate-200 grid-bg pt-48 pb-24">
      <div className="max-w-4xl mx-auto px-6 w-full prose prose-invert">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-white mb-10">
          Terms of <span className="glow-text-indigo">Service.</span>
        </h1>
        <p className="text-slate-400 font-light text-sm leading-relaxed mb-8">
          Last Updated: June 28, 2026
        </p>

        <section className="space-y-6 text-sm text-slate-400 font-light leading-relaxed">
          <h2 className="text-2xl font-bold text-white mt-10">1. Acceptance of Terms</h2>
          <p>
            By executing a Velocity Pilot engagement or utilizing Syna Systems open-source codebases, you agree to
            be bound by these terms. If you are accepting on behalf of an enterprise or hospital entity, you represent
            that you have full regulatory and organizational authority.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10">2. 14-Day Velocity Pilot SLA</h2>
          <p>
            Syna Systems commits to delivering a functional MVP in 14 days following client provisioning of secure API hooks.
            In the event that the system parameters fail to compile or deploy within the agreed schedule, any upfront pilot
            deposits will be fully returned.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10">3. Intellectual Property</h2>
          <p>
            All custom runtime agents, database bridges, and localized Model Context Protocol (MCP) integrations deployed
            inside client VPCs during the pilot period remain the exclusive operational property of the client.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10">4. Liability Disclaimer</h2>
          <p>
            Syna Systems operates strictly as an infrastructure provider. We do not adjudicate claims, write medical codes,
            or submit legal appeals directly. All actions processed by autonomous agents must be confirmed by human
            operators via the supplied verification interfaces.
          </p>
        </section>
      </div>
    </main>
  );
}

