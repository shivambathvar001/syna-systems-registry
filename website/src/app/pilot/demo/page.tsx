"use client";

import { useState } from "react";
import { 
  Sparkles, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Play, 
  CheckCircle2, 
  RefreshCw,
  Clock,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import Button from "@/components/ui/Button";

interface StepState {
  name: string;
  status: "idle" | "running" | "completed";
  duration: number;
  details: string;
}

export default function EngineDemoPage() {
  const [denialCode, setDenialCode] = useState("CO-50");
  const [ehrSystem, setEhrSystem] = useState("Epic");
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [generatedAppeal, setGeneratedAppeal] = useState("");

  const steps: StepState[] = [
    { 
      name: "Local PHI Scrubbing (Sanitization Gateway)", 
      status: currentStep > 0 ? "completed" : (currentStep === 0 ? "running" : "idle"),
      duration: 600,
      details: "Detecting and tokenizing patient demographics, DOB, SSN, and addresses inside the local network."
    },
    { 
      name: "Payer Policy Retrieval", 
      status: currentStep > 1 ? "completed" : (currentStep === 1 ? "running" : "idle"),
      duration: 800,
      details: "Crawling commercial medical necessity logs and policy change registries for code criteria."
    },
    { 
      name: "Clinical Evidence Synthesis", 
      status: currentStep > 2 ? "completed" : (currentStep === 2 ? "running" : "idle"),
      duration: 900,
      details: "Extracting diagnostic reports, laboratory indexes, and physician notes from local EHR nodes."
    },
    { 
      name: "Appeal Generation Node", 
      status: currentStep > 3 ? "completed" : (currentStep === 3 ? "running" : "idle"),
      duration: 1000,
      details: "Compiling medical necessity arguments anchored strictly to clinical values."
    }
  ];

  const appealTemplates: Record<string, string> = {
    "CO-50": `[APPEAL TRANSCRIPTION LEDGER]
Payer Target: Aetna Clinical Claims Review
Patient Token: HASH_98A3C910023B (Scrubbed)
Reference Claim ID: CLM_88172901_CO50

SUBJECT: Formal Appeal for Denial Code CO-50 (Medical Necessity) - Cardiac Event Monitoring

Dear Medical Director,

This letter serves as a formal clinical appeal for the denial of coverage regarding the Ambulatory Cardiac Monitoring services rendered. 

Aetna Policy Bulletin #0311 states that outpatient cardiac event recording is covered when patient exhibits unexplained syncope, palpitations, or transient ischemic attacks. 

Clinical Evidence Summary:
- Patient record shows two syncopal episodes within prior 14 days (FHIR endpoint matched).
- Outpatient telemetry documented paroxysmal atrial fibrillation (Avg HR: 142 bpm) on Day 2 of monitoring.
- Supporting notes from Dr. Jenkins highlight clinical risk scoring justifying inpatient step-down telemetry.

As the documented symptoms directly align with Aetna Policy Bulletin #0311 criteria, we request immediate reversal of this denial and processing of the claim for payment.

Respectfully submitted,
Syna Systems Agent (On behalf of Client Coding Supervisor)
[VERIFIED BY HUMAN OVERVIEW GATEWAY]`,
    
    "CO-97": `[APPEAL TRANSCRIPTION LEDGER]
Payer Target: Blue Cross Blue Shield Adjudication
Patient Token: HASH_22D0A918C440 (Scrubbed)
Reference Claim ID: CLM_44291823_CO97

SUBJECT: Clinical Coding Dispute - Appeal for Denial Code CO-97 (Bundled Service Modification)

Dear Claims Administrator,

We are appealing the claim bundling denial under CPT Code 99214 and Modifier 25. The adjudication notes state the evaluation and management service was bundled into the minor surgical procedure performed on the same day.

Under CMS CCI Guidelines, Modifier 25 is valid when the evaluation service represents a significant, separately identifiable medical service.

Clinical Evidence Summary:
- Patient presented with chief complaint of acute respiratory distress (unrelated to planned procedure).
- Comprehensive history and diagnostic assessment were performed before deciding to proceed with the minor procedure.
- Time spent on separate clinical evaluations exceeded 25 minutes.

Therefore, the E&M code should be unbundled and reimbursed separately. Please re-adjudicate this claim accordingly.

Respectfully submitted,
Syna Systems Agent (On behalf of Client Coding Supervisor)
[VERIFIED BY HUMAN OVERVIEW GATEWAY]`,

    "CO-16": `[APPEAL TRANSCRIPTION LEDGER]
Payer Target: UnitedHealthcare Audit Division
Patient Token: HASH_77C982D019BA (Scrubbed)
Reference Claim ID: CLM_39018274_CO16

SUBJECT: Appeal for Denial Code CO-16 (Missing / Incomplete Claim Information)

Dear Claims Assessor,

We are submitting the required clinical documentation in response to the denial of CPT code 88305 due to missing diagnostic information.

Clinical Evidence Summary:
- Diagnosis Code: ICD-10 C44.311 (Basal cell carcinoma of skin of nose).
- Pathology Report Match: Diagnostic biopsy pathology report uploaded under local document registry reference DOC_77218_PATH.
- Prior authorization check indicates pre-certification was verified on the service date.

The missing pathological details are now attached. We request the immediate processing of this claim.

Respectfully submitted,
Syna Systems Agent (On behalf of Client Coding Supervisor)
[VERIFIED BY HUMAN OVERVIEW GATEWAY]`
  };

  const addLog = (msg: string) => {
    setLogMessages(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const runSimulation = async () => {
    setIsRunning(true);
    setGeneratedAppeal("");
    setLogMessages([]);
    
    addLog(`INIT: Spawning Post-Denial Resolution Engine instance.`);
    addLog(`CONFIG: EHR target: ${ehrSystem} | Denial Code: ${denialCode}`);

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      addLog(`RUNNING: ${steps[i].name}...`);
      await new Promise(resolve => setTimeout(resolve, steps[i].duration));
      addLog(`COMPLETED: ${steps[i].name}.`);
    }

    setCurrentStep(4);
    setGeneratedAppeal(appealTemplates[denialCode] || appealTemplates["CO-50"]);
    addLog(`SUCCESS: Appeal draft generated. Queued for human verification.`);
    setIsRunning(false);
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-[#020617] text-slate-200 grid-bg pt-32 pb-24">
      
      {/* HEADER */}
      <section className="relative w-full max-w-7xl mx-auto px-6 text-center mb-12">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[200px] w-[500px] rounded-full bg-cyan-500/5 blur-[80px] -z-10"></div>
        
        <div className="inline-flex items-center gap-2 mb-6 rounded-full border border-cyan-500/30 bg-slate-900/50 px-5 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">
          <Cpu size={12} className="animate-pulse" />
          Interactive Sandbox
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-white leading-none mb-6">
          LangGraph <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-500">Adjudication</span> <br />
          <span className="glow-text-cyan">Cockpit.</span>
        </h1>
        
        <p className="max-w-xl mx-auto text-sm sm:text-base text-slate-400 font-light">
          Configure parameters and trigger the stateful node execution flow to see the automated appeal synthesis engine in action.
        </p>
      </section>

      {/* COCKPIT WORKSPACE */}
      <section className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT COLUMN: PARAMETERS & GRAPH RUNNER */}
        <div className="lg:col-span-6 space-y-8">
          
          {/* PARAMETERS CONFIG */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 bg-[#030712]/70">
            <h3 className="text-lg font-bold text-white mb-6 border-b border-slate-900 pb-4">Configure Parameters</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Denial Code Target</label>
                <select 
                  value={denialCode} 
                  onChange={(e) => setDenialCode(e.target.value)}
                  disabled={isRunning}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-slate-200 focus:border-cyan-500/50 focus:outline-none transition-all font-mono"
                >
                  <option value="CO-50">CO-50: Medical Necessity</option>
                  <option value="CO-97">CO-97: Bundled Procedure</option>
                  <option value="CO-16">CO-16: Missing Claim Info</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">EHR System Environment</label>
                <select 
                  value={ehrSystem} 
                  onChange={(e) => setEhrSystem(e.target.value)}
                  disabled={isRunning}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-slate-200 focus:border-cyan-500/50 focus:outline-none transition-all"
                >
                  <option value="Epic">Epic Systems</option>
                  <option value="Cerner">Oracle Cerner</option>
                  <option value="Athenahealth">Athenahealth</option>
                </select>
              </div>
            </div>

            <Button
              variant="cyan-glow"
              disabled={isRunning}
              onClick={runSimulation}
              className="w-full flex items-center justify-center gap-3 py-5"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  Executing Node Pipeline...
                </>
              ) : (
                <>
                  <Play size={16} />
                  Trigger Engine Pipeline
                </>
              )}
            </Button>
          </div>

          {/* RUNTIME GRAPH VISUALIZER */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 bg-[#030712]/50 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Runtime Graph Execution</h3>
            
            <div className="space-y-4">
              {steps.map((step, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                    step.status === "running"
                      ? "border-cyan-500/30 bg-cyan-950/10 shadow-[0_0_15px_rgba(34,211,238,0.05)]"
                      : (step.status === "completed" ? "border-slate-900 bg-slate-950/20 opacity-80" : "border-slate-950 bg-slate-950/10 opacity-40")
                  }`}
                >
                  <div className="mt-1">
                    {step.status === "completed" ? (
                      <div className="h-5 w-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <CheckCircle2 size={12} />
                      </div>
                    ) : step.status === "running" ? (
                      <div className="h-5 w-5 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 animate-spin">
                        <RefreshCw size={10} />
                      </div>
                    ) : (
                      <div className="h-5 w-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 text-[10px] font-mono">
                        {idx + 1}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      {step.name}
                      {step.status === "running" && <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest animate-pulse">Running</span>}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-light">{step.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: RUNTIME LOGS & TRANSCRIPTION DRAFT */}
        <div className="lg:col-span-6 space-y-8">
          
          {/* RUNTIME LOG FEED */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-black/40">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Console Log Output</h3>
            <div className="h-40 rounded-xl bg-slate-950/95 border border-slate-900 p-4 font-mono text-[10px] text-cyan-400 overflow-y-auto space-y-2 scrollbar">
              {logMessages.length === 0 ? (
                <div className="text-slate-700 italic">No logs initialized. Click &apos;Trigger Engine Pipeline&apos; to run.</div>
              ) : (
                logMessages.map((log, idx) => <div key={idx}>{log}</div>)
              )}
            </div>
          </div>

          {/* GENERATED APPEAL TRANSCRIPT */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 bg-[#030712]/80 min-h-[400px] flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-br from-indigo-500/5 to-transparent blur-xl"></div>
            
            <div className="border-b border-slate-900 pb-4 mb-6">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="text-emerald-400 animate-pulse" size={16} />
                Verification Draft Interface
              </h3>
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Post-Adjudication Appeal Output</p>
            </div>

            <div className="flex-1">
              {generatedAppeal ? (
                <pre className="font-mono text-xs text-slate-300 bg-slate-950/50 p-6 rounded-2xl border border-slate-900 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {generatedAppeal}
                </pre>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-slate-600 text-center space-y-3">
                  <Cpu size={32} className="opacity-30" />
                  <div className="text-xs font-mono uppercase tracking-widest">Waiting for Engine Execution...</div>
                </div>
              )}
            </div>

            {generatedAppeal && (
              <div className="mt-8 pt-6 border-t border-slate-900 flex justify-end">
                <Button 
                  variant="cyan-glow" 
                  size="sm"
                  className="flex items-center gap-2 text-[10px] font-mono border-emerald-500/20 text-emerald-400 hover:border-emerald-400"
                >
                  Confirm Manual Review & Submit
                  <ArrowRight size={12} />
                </Button>
              </div>
            )}
          </div>

        </div>

      </section>

    </main>
  );
}
