"use client";

import { useState, useMemo } from "react";
import { brainDocs, watchdogLogs, healthcareLeads } from "@/data/brainDocs";
import { 
  FileText, 
  Search, 
  ChevronRight, 
  Menu, 
  X, 
  Calculator, 
  BookOpen, 
  Cpu, 
  Shield, 
  CheckCircle2, 
  DollarSign, 
  FileCode,
  ArrowRight,
  Activity,
  Users,
  AlertTriangle,
  Globe,
  Settings,
  HelpCircle
} from "lucide-react";

// Simple and high-fidelity custom Markdown parser for clean UI rendering
function parseMarkdown(md: string) {
  const lines = md.split("\n");
  let inCodeBlock = false;
  let codeContent: string[] = [];
  let codeLang = "";

  return lines.map((line, idx) => {
    // Code block detection
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        inCodeBlock = false;
        const rawCode = codeContent.join("\n");
        codeContent = [];
        return (
          <pre key={`code-${idx}`} className="bg-slate-900 border border-slate-800 p-4 rounded-xl font-mono text-cyan-400 text-xs overflow-x-auto my-4 shadow-inner max-w-full">
            <code>{rawCode}</code>
          </pre>
        );
      } else {
        inCodeBlock = true;
        codeLang = line.replace("```", "").trim();
        return null;
      }
    }

    if (inCodeBlock) {
      codeContent.push(line);
      return null;
    }

    // Headers
    if (line.startsWith("# ")) {
      return (
        <h1 key={idx} className="text-2xl md:text-3xl font-black text-white tracking-tight mt-8 mb-4 border-b border-slate-900 pb-2">
          {line.substring(2)}
        </h1>
      );
    }
    if (line.startsWith("## ")) {
      return (
        <h2 key={idx} className="text-xl md:text-2xl font-bold text-white tracking-tight mt-6 mb-3">
          {line.substring(3)}
        </h2>
      );
    }
    if (line.startsWith("### ")) {
      return (
        <h3 key={idx} className="text-lg md:text-xl font-bold text-slate-200 tracking-tight mt-5 mb-2">
          {line.substring(4)}
        </h3>
      );
    }

    // Bullet points
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      const cleanLine = line.trim().substring(2);
      return (
        <li key={idx} className="list-disc ml-5 text-slate-350 my-1.5 pl-1 leading-relaxed text-sm">
          {formatInlineStyles(cleanLine)}
        </li>
      );
    }

    // Tables
    if (line.startsWith("|")) {
      if (line.includes("---")) return null; // Separator row
      const cells = line.split("|").map(c => c.trim()).filter(c => c !== "");
      
      return (
        <div key={idx} className="overflow-x-auto my-3 max-w-full border border-slate-800 rounded-lg">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800">
                {cells.map((cell, cidx) => (
                  <th key={cidx} className="px-4 py-2 font-semibold text-slate-300">
                    {formatInlineStyles(cell)}
                  </th>
                ))}
              </tr>
            </thead>
          </table>
        </div>
      );
    }

    // Divider
    if (line.trim() === "---") {
      return <hr key={idx} className="border-slate-900 my-6" />;
    }

    // Paragraph
    if (line.trim() !== "") {
      return (
        <p key={idx} className="text-slate-400 my-3 text-sm leading-relaxed font-light">
          {formatInlineStyles(line)}
        </p>
      );
    }

    return <div key={idx} className="h-2" />;
  }).filter(el => el !== null);
}

function formatInlineStyles(text: string) {
  const parts: (string | JSX.Element)[] = [];
  let currentText = text;
  let keyIdx = 0;

  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const boldRegex = /\*\*([^*]+)\*\*/g;
  const codeRegex = /`([^`]+)`/g;

  const elements: { index: number; length: number; component: JSX.Element }[] = [];
  
  let linkMatch;
  while ((linkMatch = linkRegex.exec(text)) !== null) {
    const [full, label, url] = linkMatch;
    elements.push({
      index: linkMatch.index,
      length: full.length,
      component: (
        <span key={`link-${keyIdx++}`} className="text-cyan-400 font-mono text-xs border-b border-cyan-400/20 hover:border-cyan-400 transition-all cursor-pointer">
          {label}
        </span>
      )
    });
  }

  let boldMatch;
  while ((boldMatch = boldRegex.exec(text)) !== null) {
    elements.push({
      index: boldMatch.index,
      length: boldMatch[0].length,
      component: <strong key={`bold-${keyIdx++}`} className="font-semibold text-white">{boldMatch[1]}</strong>
    });
  }

  let codeMatch;
  while ((codeMatch = codeRegex.exec(text)) !== null) {
    elements.push({
      index: codeMatch.index,
      length: codeMatch[0].length,
      component: <code key={`code-${keyIdx++}`} className="bg-slate-900/85 border border-slate-800 px-1.5 py-0.5 rounded text-cyan-400 text-xs font-mono">{codeMatch[1]}</code>
    });
  }

  elements.sort((a, b) => a.index - b.index);
  
  let currentIndex = 0;
  for (const el of elements) {
    if (el.index >= currentIndex) {
      if (el.index > currentIndex) {
        parts.push(text.substring(currentIndex, el.index));
      }
      parts.push(el.component);
      currentIndex = el.index + el.length;
    }
  }
  
  if (currentIndex < text.length) {
    parts.push(text.substring(currentIndex));
  }

  return parts.length > 0 ? parts : text;
}

type TabType = "docs" | "pipeline" | "monitor";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("docs");
  const [selectedDoc, setSelectedDoc] = useState<string>("README.md");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  // ROI Calculator states
  const [monthlyClaims, setMonthlyClaims] = useState(3000);
  const [denialRate, setDenialRate] = useState(12); // %
  const [avgClaimValue, setAvgClaimValue] = useState(450); // USD
  const [recoveryImprovement, setRecoveryImprovement] = useState(45); // %

  const calculatorResults = useMemo(() => {
    const totalDenials = monthlyClaims * (denialRate / 100);
    const deniedValue = totalDenials * avgClaimValue;
    const recoveredWithSyna = deniedValue * (recoveryImprovement / 100);
    const annualRecovery = recoveredWithSyna * 12;
    return {
      totalDenials,
      deniedValue,
      recoveredWithSyna,
      annualRecovery
    };
  }, [monthlyClaims, denialRate, avgClaimValue, recoveryImprovement]);

  // Group files into categories/logical domains
  const categories = useMemo(() => {
    const groups: { [key: string]: { label: string; docs: { relPath: string; name: string }[] } } = {
      "README": { label: "Registry Root", docs: [{ relPath: "README.md", name: "AOS Readme" }] },
      "00_foundation": { label: "00 Foundation (DNA)", docs: [] },
      "01_brand": { label: "01 Brand Identity", docs: [] },
      "02_strategy": { label: "02 Business Strategy", docs: [] },
      "03_services": { label: "03 Capabilities", docs: [] },
      "04_sales": { label: "04 Sales Systems", docs: [] },
      "05_marketing": { label: "05 Marketing Engine", docs: [] },
      "06_website": { label: "06 Website Specs", docs: [] },
      "07_delivery": { label: "07 Delivery Ops", docs: [] },
      "08_agents": { label: "08 AI Agent specifications", docs: [] },
      "09_operations": { label: "09 Operations & Compliance", docs: [] },
      "10_templates": { label: "10 Legal Templates", docs: [] },
      "11_research": { label: "11 Market Research", docs: [] },
      "12_assets": { label: "12 Brand Assets", docs: [] },
    };

    Object.keys(brainDocs).forEach(relPath => {
      if (relPath === "README.md") return;
      const parts = relPath.split("/");
      const folder = parts[0];
      const filename = parts[1] || parts[0];
      const displayName = filename.replace(".md", "").replace(/_/g, " ");

      if (groups[folder]) {
        groups[folder].docs.push({
          relPath,
          name: displayName
        });
      }
    });

    return Object.entries(groups)
      .filter(([_, group]) => group.docs.length > 0)
      .map(([key, group]) => ({
        key,
        ...group
      }));
  }, []);

  // Filter documents based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;

    const query = searchQuery.toLowerCase();
    return categories.map(cat => {
      const matchingDocs = cat.docs.filter(doc => 
        doc.name.toLowerCase().includes(query) || 
        doc.relPath.toLowerCase().includes(query)
      );
      return {
        ...cat,
        docs: matchingDocs
      };
    }).filter(cat => cat.docs.length > 0);
  }, [categories, searchQuery]);

  const selectedDocContent = useMemo(() => {
    return brainDocs[selectedDoc] || "# Document Not Found";
  }, [selectedDoc]);

  // Lead search filter
  const filteredLeads = useMemo(() => {
    if (!searchQuery.trim()) return healthcareLeads;
    const query = searchQuery.toLowerCase();
    return healthcareLeads.filter(lead => 
      lead.Organization.toLowerCase().includes(query) ||
      lead.Location.toLowerCase().includes(query) ||
      lead.Status.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Monitor search filter
  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) return watchdogLogs;
    const query = searchQuery.toLowerCase();
    return watchdogLogs.filter(log => 
      log.agent_id.toLowerCase().includes(query) ||
      log.action_type.toLowerCase().includes(query) ||
      log.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#020617] text-slate-200">
      
      {/* SIDEBAR - Desktop */}
      <aside className="hidden md:flex flex-col w-80 bg-[#030712] border-r border-slate-900 shrink-0">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-slate-800 flex items-center justify-center text-cyan-400">
              <Cpu size={16} />
            </div>
            <span className="font-black text-sm tracking-widest text-white uppercase italic">
              SYNA<span className="text-cyan-400">.</span>SYSTEMS
            </span>
          </div>
          <div className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-400">
            AOS
          </div>
        </div>

        {/* Global tab selector */}
        <div className="px-4 pt-4 pb-2 border-b border-slate-900 grid grid-cols-3 gap-1">
          <button 
            onClick={() => setActiveTab("docs")} 
            className={`py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-center transition-all ${
              activeTab === "docs" ? "bg-slate-900 text-cyan-400 border border-slate-800" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <BookOpen size={10} className="inline mr-1 -mt-0.5" /> Docs
          </button>
          <button 
            onClick={() => setActiveTab("pipeline")} 
            className={`py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-center transition-all ${
              activeTab === "pipeline" ? "bg-slate-900 text-cyan-400 border border-slate-800" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <Users size={10} className="inline mr-1 -mt-0.5" /> leads
          </button>
          <button 
            onClick={() => setActiveTab("monitor")} 
            className={`py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-center transition-all ${
              activeTab === "monitor" ? "bg-slate-900 text-cyan-400 border border-slate-800" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <Activity size={10} className="inline mr-1 -mt-0.5" /> Monitor
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-slate-900 relative">
          <Search className="absolute left-7 top-6 text-slate-500" size={14} />
          <input
            type="text"
            placeholder={
              activeTab === "docs" ? "Search registry docs..." :
              activeTab === "pipeline" ? "Search leads..." : "Search logs..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-850 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-350 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all font-light"
          />
        </div>

        {/* Dynamic Category Navigation based on Tab */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4 custom-scrollbar">
          {activeTab === "docs" && (
            <>
              {filteredCategories.map(cat => (
                <div key={cat.key} className="space-y-1">
                  <h3 className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase px-3 mb-2">
                    {cat.label}
                  </h3>
                  <div className="space-y-0.5">
                    {cat.docs.map(doc => {
                      const isActive = selectedDoc === doc.relPath;
                      return (
                        <button
                          key={doc.relPath}
                          onClick={() => {
                            setSelectedDoc(doc.relPath);
                            setIsSidebarOpen(false);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs transition-all ${
                            isActive 
                              ? "bg-slate-900 text-white font-medium border-l-2 border-cyan-400" 
                              : "text-slate-400 hover:bg-slate-950 hover:text-slate-200"
                          }`}
                        >
                          <FileText size={12} className={isActive ? "text-cyan-400" : "text-slate-600"} />
                          <span className="truncate capitalize">{doc.name}</span>
                          {isActive && <ChevronRight size={10} className="ml-auto text-cyan-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === "pipeline" && (
            <div className="space-y-3">
              <div className="px-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                  Lead Queue
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Total Active Targets: {healthcareLeads.length}
                </span>
              </div>
              <div className="space-y-1">
                {filteredLeads.slice(0, 15).map((lead, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-900 text-xs space-y-1 hover:border-slate-800 transition-all">
                    <div className="font-bold text-white truncate">{lead.Organization}</div>
                    <div className="text-slate-450 text-[10px] truncate">{lead.Signal_Role}</div>
                    <div className="flex justify-between items-center text-[9px] font-mono pt-1">
                      <span className="text-slate-500">{lead.Location}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                        lead.Qualification_Score === 'HIGH' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' :
                        lead.Qualification_Score === 'MEDIUM' ? 'bg-amber-950 text-amber-400 border border-amber-900' :
                        'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}>
                        {lead.Qualification_Score} Score
                      </span>
                    </div>
                  </div>
                ))}
                {filteredLeads.length > 15 && (
                  <div className="text-center text-[10px] text-slate-500 pt-2 italic">
                    Showing first 15 of {filteredLeads.length} leads
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "monitor" && (
            <div className="space-y-3">
              <div className="px-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                  Active System Log
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Verified runs: {watchdogLogs.length}
                </span>
              </div>
              <div className="space-y-1">
                {filteredLogs.slice(-15).reverse().map((log, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-900 text-xs space-y-1.5 hover:border-slate-850 transition-all">
                    <div className="flex justify-between items-center text-[9px] font-mono">
                      <span className="text-slate-500">{log.timestamp}</span>
                      <span className={`px-1 rounded-sm text-[8px] font-bold ${
                        log.status === 'DONE' || log.status === 'OK' ? 'bg-emerald-950/80 text-emerald-400' : 'bg-red-950/80 text-red-400'
                      }`}>
                        {log.status}
                      </span>
                    </div>
                    <div className="text-white font-mono text-[10px] truncate">{log.agent_id}</div>
                    <div className="text-slate-400 leading-relaxed text-[11px] font-light">{log.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/50">
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="w-full flex items-center justify-center gap-2 bg-[#090d16] border border-slate-800 hover:border-cyan-500/30 text-cyan-400 py-2.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider shadow-md"
          >
            <Calculator size={14} />
            ROI Recovery Tool
          </button>
        </div>
      </aside>

      {/* MOBILE SIDEBAR/DRAWER */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-[#020617]/95 backdrop-blur-md">
          <div className="flex flex-col w-80 bg-[#030712] border-r border-slate-900 h-full p-6 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-slate-800 flex items-center justify-center text-cyan-400">
                  <Cpu size={16} />
                </div>
                <span className="font-black text-sm tracking-widest text-white uppercase italic">
                  SYNA<span className="text-cyan-400">.</span>SYSTEMS
                </span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Mobile Tab Selectors */}
            <div className="grid grid-cols-3 gap-1 mb-4 border-b border-slate-900 pb-3">
              <button 
                onClick={() => setActiveTab("docs")} 
                className={`py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-center transition-all ${
                  activeTab === "docs" ? "bg-slate-900 text-cyan-400 border border-slate-800" : "text-slate-500"
                }`}
              >
                Docs
              </button>
              <button 
                onClick={() => setActiveTab("pipeline")} 
                className={`py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-center transition-all ${
                  activeTab === "pipeline" ? "bg-slate-900 text-cyan-400 border border-slate-800" : "text-slate-500"
                }`}
              >
                leads
              </button>
              <button 
                onClick={() => setActiveTab("monitor")} 
                className={`py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-center transition-all ${
                  activeTab === "monitor" ? "bg-slate-900 text-cyan-400 border border-slate-800" : "text-slate-500"
                }`}
              >
                Monitor
              </button>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-350"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              {activeTab === "docs" && (
                <>
                  {filteredCategories.map(cat => (
                    <div key={cat.key} className="space-y-1">
                      <h3 className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase px-3">
                        {cat.label}
                      </h3>
                      <div className="space-y-0.5">
                        {cat.docs.map(doc => (
                          <button
                            key={doc.relPath}
                            onClick={() => {
                              setSelectedDoc(doc.relPath);
                              setIsSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs transition-all ${
                              selectedDoc === doc.relPath 
                                ? "bg-slate-900 text-white font-medium border-l-2 border-cyan-400" 
                                : "text-slate-400 hover:bg-slate-950"
                            }`}
                          >
                            <FileText size={12} />
                            <span className="truncate capitalize">{doc.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {activeTab === "pipeline" && (
                <div className="space-y-2">
                  {filteredLeads.slice(0, 10).map((lead, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-900 text-xs">
                      <div className="font-bold text-white">{lead.Organization}</div>
                      <div className="text-slate-450 text-[10px]">{lead.Signal_Role}</div>
                      <div className="flex justify-between items-center text-[9px] pt-1">
                        <span className="text-slate-500">{lead.Location}</span>
                        <span className="text-cyan-400 font-mono">{lead.Qualification_Score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "monitor" && (
                <div className="space-y-2">
                  {filteredLogs.slice(-10).reverse().map((log, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-900 text-xs">
                      <div className="flex justify-between text-[8px] text-slate-500">
                        <span>{log.timestamp}</span>
                        <span className="text-emerald-400">{log.status}</span>
                      </div>
                      <div className="font-mono text-[10px] text-white truncate">{log.agent_id}</div>
                      <div className="text-slate-450 text-[10px]">{log.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MAIN VIEW AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header bar */}
        <header className="h-16 border-b border-slate-900 px-4 md:px-6 flex items-center justify-between bg-[#030712]/40 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-slate-400 hover:text-white p-1"
            >
              <Menu size={20} />
            </button>
            
            {/* Title / Path */}
            <div className="flex items-center gap-2">
              <span className="font-black text-xs tracking-wider text-white uppercase italic md:hidden">
                SYNA<span className="text-cyan-400">.</span>SYSTEMS
              </span>
              <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 font-mono">
                <span>agency-brain</span>
                <span>/</span>
                {activeTab === "docs" && <span className="text-cyan-400 font-light truncate max-w-[200px]">{selectedDoc}</span>}
                {activeTab === "pipeline" && <span className="text-cyan-400 font-light">healthcare_leads.csv</span>}
                {activeTab === "monitor" && <span className="text-cyan-400 font-light">watchdog_log.csv</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider hidden sm:inline">
              OPERATIONAL COMPLIANCE SECURED
            </span>
            <button 
              onClick={() => setShowCalculator(!showCalculator)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 transition-all hover:bg-slate-800"
            >
              <Calculator size={16} />
            </button>
          </div>
        </header>

        {/* Content Panel */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Main Display: dynamic tabs */}
          <main className="flex-1 overflow-y-auto px-4 py-8 md:px-12 md:py-16 bg-[#020617] scroll-smooth custom-scrollbar">
            <div className="max-w-3xl mx-auto space-y-6">
              
              {activeTab === "docs" && (
                <>
                  {selectedDoc !== "README.md" && (
                    <button
                      onClick={() => setSelectedDoc("README.md")}
                      className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-350 font-mono mb-4"
                    >
                      <ArrowRight size={10} className="rotate-180" />
                      Return to AOS Index
                    </button>
                  )}
                  <article className="prose prose-invert max-w-none text-slate-350">
                    {parseMarkdown(selectedDocContent)}
                  </article>
                </>
              )}

              {activeTab === "pipeline" && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-black text-white tracking-tight mb-2 uppercase">
                      Prospect Pipeline Ledger
                    </h1>
                    <p className="text-xs text-slate-400 font-light leading-relaxed">
                      Real-time scrapers running on healthcare organizations detecting RCM pain signals and hiring patterns.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {filteredLeads.map((lead, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-900 space-y-3 shadow-md hover:border-slate-800 transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-extrabold text-sm text-white">{lead.Organization}</h3>
                            <span className="text-[10px] text-slate-500">{lead.Location}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                            lead.Qualification_Score === 'HIGH' ? 'bg-emerald-950 text-emerald-450 border border-emerald-905' :
                            lead.Qualification_Score === 'MEDIUM' ? 'bg-amber-950 text-amber-450 border border-amber-905' :
                            'bg-slate-900 text-slate-400 border border-slate-800'
                          }`}>
                            {lead.Qualification_Score} Priority
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-900/60">
                          <div>
                            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Detection Signal</div>
                            <div className="text-slate-300 font-light truncate">{lead.Signal_Role}</div>
                          </div>
                          <div>
                            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">EHR Mapping</div>
                            <div className="text-cyan-400 font-mono truncate">{lead.Primary_EHR || 'Unknown EHR'}</div>
                          </div>
                        </div>

                        {lead.Email && (
                          <div className="bg-slate-900/40 p-2.5 rounded-lg border border-slate-850 flex justify-between items-center text-[10px] font-mono mt-2">
                            <span className="text-slate-400">{lead.Decision_Maker}: {lead.Email}</span>
                            <span className="text-cyan-400/65">Enriched</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "monitor" && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-black text-white tracking-tight mb-2 uppercase">
                      Operational Uptime Monitor
                    </h1>
                    <p className="text-xs text-slate-400 font-light leading-relaxed">
                      Continuous system monitoring logs indicating background pipeline and synchronization actions.
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-slate-900 rounded-2xl overflow-hidden shadow-xl">
                    <div className="px-5 py-4 border-b border-slate-900 bg-slate-950 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                        Console Streams
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 font-mono">
                        Online
                      </span>
                    </div>

                    <div className="divide-y divide-slate-900/70 font-mono text-[11px] p-2 bg-[#02050e] space-y-0.5">
                      {filteredLogs.slice().reverse().map((log, idx) => (
                        <div key={idx} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-900/20">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-600">[{log.timestamp}]</span>
                              <span className="text-cyan-400 font-bold">{log.agent_id}</span>
                            </div>
                            <div className="text-slate-350">{log.description}</div>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold text-center self-start sm:self-center ${
                            log.status === 'DONE' || log.status === 'OK' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' : 'bg-red-950 text-red-400 border border-red-900'
                          }`}>
                            {log.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* ROI Calculator right side drawer panel (Desktop) */}
          {showCalculator && (
            <aside className="hidden lg:flex flex-col w-96 bg-[#030712] border-l border-slate-900 p-6 overflow-y-auto shrink-0 animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between pb-4 border-b border-slate-900">
                <div className="flex items-center gap-2">
                  <Calculator className="text-cyan-400" size={18} />
                  <h2 className="font-bold text-sm text-white uppercase tracking-wider">
                    RCM Calculator
                  </h2>
                </div>
                <button onClick={() => setShowCalculator(false)} className="text-slate-500 hover:text-white">
                  <X size={16} />
                </button>
              </div>

              <div className="py-6 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Monthly Claims Count: {monthlyClaims.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="500"
                    max="10000"
                    step="100"
                    value={monthlyClaims}
                    onChange={(e) => setMonthlyClaims(parseInt(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Average Denial Rate: {denialRate}%
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={denialRate}
                    onChange={(e) => setDenialRate(parseInt(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Avg Claim Value: ${avgClaimValue}
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="50"
                    value={avgClaimValue}
                    onChange={(e) => setAvgClaimValue(parseInt(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Syna Recovery Target: {recoveryImprovement}%
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="90"
                    step="5"
                    value={recoveryImprovement}
                    onChange={(e) => setRecoveryImprovement(parseInt(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>
              </div>

              <div className="mt-auto bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-4 shadow-xl">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    Total Leakage Exposure
                  </span>
                  <div className="text-2xl font-extrabold text-red-400 font-mono">
                    ${calculatorResults.deniedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    <span className="text-xs text-slate-500 font-light lowercase">/mo</span>
                  </div>
                </div>

                <div className="space-y-1 border-t border-slate-900/60 pt-3">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                    Expected Recovery Cashflow
                  </span>
                  <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                    +${calculatorResults.recoveredWithSyna.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    <span className="text-xs text-slate-500 font-light lowercase">/mo</span>
                  </div>
                </div>

                <div className="bg-[#041211] border border-cyan-950 rounded-xl p-4 text-center">
                  <span className="text-[9px] font-bold text-cyan-500 uppercase tracking-widest block mb-1">
                    Estimated Annual Recovered Cash
                  </span>
                  <span className="text-3xl font-black text-cyan-400 font-mono">
                    ${calculatorResults.annualRecovery.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* ROI Calculator Popup (Mobile) */}
      {showCalculator && (
        <div className="fixed inset-0 z-50 lg:hidden flex items-center justify-center p-4 bg-[#020617]/80 backdrop-blur-md">
          <div className="bg-[#030712] border border-slate-800 rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-900">
              <span className="font-bold text-sm text-white uppercase tracking-wider">RCM Recovery Assessment</span>
              <button onClick={() => setShowCalculator(false)} className="text-slate-500 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Monthly Claims: {monthlyClaims}
                </label>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="100"
                  value={monthlyClaims}
                  onChange={(e) => setMonthlyClaims(parseInt(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Denial Rate: {denialRate}%
                </label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={denialRate}
                  onChange={(e) => setDenialRate(parseInt(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Claim Value: ${avgClaimValue}
                </label>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={avgClaimValue}
                  onChange={(e) => setAvgClaimValue(parseInt(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Monthly Leakage:</span>
                <span className="text-red-400 font-mono">${calculatorResults.deniedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-slate-900/50 pt-2">
                <span className="text-cyan-400">Monthly Recovery:</span>
                <span className="text-emerald-400 font-mono font-bold">+${calculatorResults.recoveredWithSyna.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="bg-[#041211] p-3 rounded-xl text-center border border-cyan-950">
                <span className="text-[8px] font-bold text-cyan-500 uppercase block mb-1">Annual Recovery Target</span>
                <span className="text-2xl font-black text-cyan-400 font-mono">${calculatorResults.annualRecovery.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
