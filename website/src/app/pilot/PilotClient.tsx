"use client";

import { useState, useEffect } from "react";
import { 
  Building, 
  Database, 
  User, 
  Mail, 
  Percent, 
  ShieldCheck, 
  Zap, 
  Coins, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  BarChart3
} from "lucide-react";
import Dropdown from "@/components/ui/Dropdown";
import Button from "@/components/ui/Button";
import Accordion from "@/components/ui/Accordion";

export default function PilotClient() {
  // Form state
  const [formData, setFormData] = useState({
    organization: "",
    ehr: "Epic",
    contactName: "",
    contactEmail: "",
    denialRate: 12,
    annualBilling: 50, // in Millions
  });

  // UI state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Interactive calculations
  const [estimatedLeakage, setEstimatedLeakage] = useState(0);
  const [estimatedRecovery, setEstimatedRecovery] = useState(0);

  useEffect(() => {
    // Annual Billing in USD * Denial Rate
    const leakage = (formData.annualBilling * 1000000) * (formData.denialRate / 100);
    // BIO-GUARD verified recovery rate of about 60% of denial leak
    const recovery = leakage * 0.60;
    
    setEstimatedLeakage(leakage);
    setEstimatedRecovery(recovery);
  }, [formData.denialRate, formData.annualBilling]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "denialRate" || name === "annualBilling" ? Number(value) : value
    }));
  };

  const handleEhrChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      ehr: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/pilot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          estimatedLeakage,
          estimatedRecovery,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit pilot intake.");
      }

      setIsSubmitted(true);
    } catch (err: any) {
      console.error("[SUBMIT ERROR]", err);
      setErrorMsg(err.message || "Connection timed out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const ehrOptions = [
    { label: "Epic Systems", value: "Epic" },
    { label: "Oracle Cerner", value: "Cerner" },
    { label: "eClinicalWorks", value: "eClinicalWorks" },
    { label: "Allscripts / Veradigm", value: "Allscripts" },
    { label: "Athenahealth", value: "Athenahealth" },
    { label: "Other / Proprietary API", value: "Other" },
  ];

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-[#020617] text-slate-200 grid-bg pt-32 pb-24">
      
      {/* HERO SECTION */}
      <section className="relative w-full max-w-7xl mx-auto px-6 text-center mb-16">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[300px] w-[600px] rounded-full bg-indigo-500/10 blur-[100px] -z-10 animate-pulse"></div>
        
        <div className="inline-flex items-center gap-2 mb-6 rounded-full border border-indigo-500/30 bg-slate-900/50 px-5 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">
          <Sparkles size={12} className="animate-spin-slow" />
          14-Day Velocity Pilot Integration
        </div>
        
        <h1 className="text-4xl sm:text-7xl font-black tracking-tighter text-white leading-none mb-6">
          Initiate <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-500">Autonomous</span> <br />
          <span className="glow-text-cyan">Alignment.</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-400 font-light leading-relaxed">
          Submit your EHR parameters to lock in a slot. We build and deploy a functioning, secure agentic backbone in two weeks or we refund the setup.
        </p>
      </section>

      {/* INTERACTIVE WORKSPACE */}
      <section className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT COLUMN: THE PREMIUM INTAKE FORM */}
        <div className="lg:col-span-7 glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 bg-[#030712]/70 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-br from-cyan-500/10 to-transparent blur-2xl"></div>
          
          {/* Success State */}
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in duration-300">
              <div className="h-20 w-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-8 animate-bounce">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-3xl font-black text-white tracking-tight mb-4">Intake Registry Confirmed</h3>
              <p className="max-w-md text-slate-400 font-light leading-relaxed mb-10">
                Your EHR parameters and billing metrics have been securely logged. Our lead systems architect will contact you within 4 business hours with a custom stateful integration blueprint.
              </p>
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-left w-full max-w-md">
                <div className="text-[10px] font-mono text-cyan-400 mb-2 uppercase tracking-widest">Transaction Ledger</div>
                <div className="space-y-2 text-xs font-mono text-slate-400">
                  <div><span className="text-slate-600">Org:</span> {formData.organization}</div>
                  <div><span className="text-slate-600">EHR Environment:</span> {formData.ehr}</div>
                  <div><span className="text-slate-600">Expected Recovery:</span> ${ (estimatedRecovery / 1000000).toFixed(2) }M / Year</div>
                  <div><span className="text-slate-600">Status:</span> SECURE_PROVISIONING_ACTIVE</div>
                </div>
              </div>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="mt-12 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-cyan-400 transition-colors"
              >
                Submit Another Assessment
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="border-b border-slate-900 pb-6 mb-4">
                <h3 className="text-2xl font-bold text-white mb-2">Integration Parameters</h3>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">Fill out to request slot allocations</p>
              </div>

              <div className="space-y-6">
                {/* Org Name */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                    <Building size={14} className="text-indigo-400" />
                    Organization Name
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      name="organization" 
                      value={formData.organization}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Apex Health Alliance" 
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-5 py-4 text-sm text-slate-200 placeholder-slate-600 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all font-light"
                    />
                  </div>
                </div>

                {/* Reusable Dropdown component for EHR */}
                <Dropdown
                  options={ehrOptions}
                  value={formData.ehr}
                  onChange={handleEhrChange}
                  label="EHR System Environment"
                  icon={<Database size={14} className="text-indigo-400" />}
                />

                {/* Contact Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                      <User size={14} className="text-indigo-400" />
                      Primary Contact Name
                    </label>
                    <input 
                      type="text" 
                      name="contactName" 
                      value={formData.contactName}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Sarah Jenkins" 
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-5 py-4 text-sm text-slate-200 placeholder-slate-600 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all font-light"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                      <Mail size={14} className="text-indigo-400" />
                      Business Email
                    </label>
                    <input 
                      type="email" 
                      name="contactEmail" 
                      value={formData.contactEmail}
                      onChange={handleChange}
                      required
                      placeholder="sjenkins@apexhealth.org" 
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-5 py-4 text-sm text-slate-200 placeholder-slate-600 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all font-light"
                    />
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="space-y-6 pt-4 border-t border-slate-900">
                  
                  {/* Annual Billing Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                        <Coins size={14} className="text-indigo-400" />
                        Annual Claims Billing Value
                      </label>
                      <span className="text-cyan-400 font-mono text-sm font-bold">${formData.annualBilling}M</span>
                    </div>
                    <input 
                      type="range" 
                      name="annualBilling"
                      min="5" 
                      max="500" 
                      value={formData.annualBilling}
                      onChange={handleChange}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                    <div className="flex justify-between text-[9px] font-mono text-slate-600">
                      <span>$5M</span>
                      <span>$100M</span>
                      <span>$250M</span>
                      <span>$500M+</span>
                    </div>
                  </div>

                  {/* Denial Rate Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                        <Percent size={14} className="text-indigo-400" />
                        Current Est. Claim Denial Rate
                      </label>
                      <span className="text-cyan-400 font-mono text-sm font-bold">{formData.denialRate}%</span>
                    </div>
                    <input 
                      type="range" 
                      name="denialRate"
                      min="1" 
                      max="30" 
                      value={formData.denialRate}
                      onChange={handleChange}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                    <div className="flex justify-between text-[9px] font-mono text-slate-600">
                      <span>1%</span>
                      <span>10%</span>
                      <span>20%</span>
                      <span>30%</span>
                    </div>
                  </div>

                </div>
              </div>

              {errorMsg && (
                <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-4 text-xs font-mono text-red-400">
                  <span className="font-bold">Error:</span> {errorMsg}
                </div>
              )}

              {/* Reusable Button component with Custom variant */}
              <Button
                type="submit"
                variant="cyan-glow"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-6"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    Lock Pilot Slot & Generate Audit
                    <ArrowRight size={16} />
                  </>
                )}
              </Button>

              <p className="text-center text-[10px] text-slate-600 leading-relaxed font-mono">
                *All EHR credentials and billing metrics are secured using end-to-end PII/PHI scrubbing filters. Under zero-trust architecture parameters, data is masked instantly on submit.
              </p>
            </form>
          )}
        </div>

        {/* RIGHT COLUMN: INTERACTIVE ROI PROJECTIONS */}
        <div className="lg:col-span-5 space-y-8 w-full">
          
          {/* VALUE PROJECTION WIDGET */}
          <div className="glass-panel p-10 rounded-3xl border border-slate-800/80 bg-[#030712]/50 relative overflow-hidden shadow-2xl w-full">
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-cyan-500/5 blur-2xl"></div>
            
            <div className="flex items-center gap-4 mb-8">
              <BarChart3 className="text-cyan-400" size={24} />
              <h4 className="text-xs font-black uppercase tracking-[0.25em] text-slate-400">Projected Leakage Analysis</h4>
            </div>

            <div className="space-y-8 mb-8 border-b border-slate-900 pb-8">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Annual Revenue Leakage</div>
                <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tighter">
                  ${ (estimatedLeakage / 1000000).toFixed(2) }M
                </div>
                <div className="text-[10px] text-red-500 font-mono mt-1">Lost to Medical Necessity & documentation gaps</div>
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Recoverable with Airwalk PDM</div>
                <div className="text-4xl sm:text-5xl font-black text-cyan-400 font-mono tracking-tighter">
                  ${ (estimatedRecovery / 1000000).toFixed(2) }M
                </div>
                <div className="text-[10px] text-emerald-400 font-mono mt-1">Based on Project BIO-GUARD 12% clean claim boost</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Pilot System:</span>
                <span className="font-mono text-slate-300">BIO-GUARD PDM Engine</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Integration Lead-Time:</span>
                <span className="font-mono text-cyan-400 font-bold">14 Days Standard</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Compliance Boundary:</span>
                <span className="font-mono text-emerald-400 font-bold">HIPAA & SOC2</span>
              </div>
            </div>
          </div>

          {/* INTEGRATION MILESTONES (Using Reusable Accordions) */}
          <div className="p-8 rounded-3xl border border-slate-900 bg-black/40 w-full">
            <h4 className="text-xs font-black uppercase tracking-[0.25em] text-slate-500 mb-6 flex items-center gap-3">
              <Zap size={14} className="text-indigo-400" />
              14-Day Delivery Milestones
            </h4>
            
            <div className="space-y-1">
              <Accordion title="EHR Endpoint Diagnostics" subtitle="Days 1-3" defaultOpen={true}>
                API bridge audit & pipeline sanitization. Secure diagnostic connection logs established with mock data checks.
              </Accordion>
              <Accordion title="Stateful Graph Deployment" subtitle="Days 4-7">
                Configuration of payer rule patterns & clinical scorecards. Node logic testing with supervisor routers.
              </Accordion>
              <Accordion title="Sanity Gateway Audit" subtitle="Days 8-11">
                PHI/PII masking and dry-run shadow submission trials. Validation of HIPAA compliance boundaries.
              </Accordion>
              <Accordion title="HITL Triage Handover" subtitle="Days 12-14">
                Human reviewer interface live, production rollout, system SLA metrics calibration.
              </Accordion>
            </div>
          </div>

        </div>

      </section>

    </main>
  );
}
