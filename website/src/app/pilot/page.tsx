"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { 
  Building, 
  Database, 
  User, 
  Mail, 
  Percent, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Coins, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  BarChart3
} from "lucide-react";

export default function PilotIntake() {
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
  
  // Interactive calculations
  const [estimatedLeakage, setEstimatedLeakage] = useState(0);
  const [estimatedRecovery, setEstimatedRecovery] = useState(0);

  useEffect(() => {
    // Annual Billing in USD * Denial Rate
    const leakage = (formData.annualBilling * 1000000) * (formData.denialRate / 100);
    // BIO-GUARD verified recovery rate of about 60% of denial leak (equivalent to $8.4M recovered out of $14M leakage)
    const recovery = leakage * 0.60;
    
    setEstimatedLeakage(leakage);
    setEstimatedRecovery(recovery);
  }, [formData.denialRate, formData.annualBilling]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "denialRate" || name === "annualBilling" ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center bg-[#020617] text-slate-200 grid-bg pt-32 pb-24">
        
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
              <div className="flex flex-col items-center justify-center py-16 text-center">
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

                  {/* EHR System */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                      <Database size={14} className="text-indigo-400" />
                      EHR System Environment
                    </label>
                    <select 
                      name="ehr"
                      value={formData.ehr}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-5 py-4 text-sm text-slate-200 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all font-light"
                    >
                      <option value="Epic">Epic Systems</option>
                      <option value="Cerner">Oracle Cerner</option>
                      <option value="eClinicalWorks">eClinicalWorks</option>
                      <option value="Allscripts">Allscripts / Veradigm</option>
                      <option value="Athenahealth">Athenahealth</option>
                      <option value="Other">Other / Proprietary API</option>
                    </select>
                  </div>

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

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 px-12 py-6 text-sm font-black uppercase tracking-widest text-white transition-all shadow-[0_0_35px_rgba(79,70,229,0.25)] hover:shadow-[0_0_50px_rgba(34,211,238,0.4)] disabled:opacity-50"
                >
                  {loading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    <>
                      Lock Pilot Slot & Generate Audit
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <p className="text-center text-[10px] text-slate-600 leading-relaxed font-mono">
                  *All EHR credentials and billing metrics are secured using end-to-end PII/PHI scrubbing filters. Under zero-trust architecture parameters, data is masked instantly on submit.
                </p>
              </form>
            )}
          </div>

          {/* RIGHT COLUMN: INTERACTIVE ROI PROJECTIONS */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* VALUE PROJECTION WIDGET */}
            <div className="glass-panel p-10 rounded-3xl border border-slate-800/80 bg-[#030712]/50 relative overflow-hidden shadow-2xl">
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
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Recoverable with Syna PDM</div>
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

            {/* INTEGRATION MILESTONES */}
            <div className="p-8 rounded-3xl border border-slate-900 bg-black/40">
              <h4 className="text-xs font-black uppercase tracking-[0.25em] text-slate-500 mb-8 flex items-center gap-3">
                <Zap size={14} className="text-indigo-400" />
                14-Day Delivery Milestones
              </h4>
              <div className="space-y-6">
                {[
                  { d: "Days 1-3", t: "EHR Endpoint Diagnostics", desc: "API bridge audit & pipeline sanitization." },
                  { d: "Days 4-7", t: "Stateful Graph Deployment", desc: "Configuration of payer rule patterns & clinical scorecards." },
                  { d: "Days 8-11", t: "Sanity Gateway Audit", desc: "PHI/PII masking and dry-run shadow submission trials." },
                  { d: "Days 12-14", t: "HITL Triage Handover", desc: "Human reviewer interface live, production rollout." }
                ].map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="text-[10px] font-mono text-indigo-400 font-bold w-16 pt-1 shrink-0">{step.d}</div>
                    <div>
                      <h5 className="text-xs font-bold text-white mb-1">{step.t}</h5>
                      <p className="text-[11px] text-slate-500 font-light leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </section>

      </main>
    </>
  );
}
