import { StateGraph, END } from "@langchain/langgraph";
import { Annotation } from "@langchain/langgraph";

// Syna Systems: Agentic Recruitment Triage Template
// Logic: Triage -> Technical Audit -> Cultural Alignment -> Final Report

const AgentState = Annotation.Root({
  candidate_data: Annotation<any>(),
  technical_audit: Annotation<string>(),
  cultural_fit: Annotation<string>(),
  status: Annotation<string>(),
});

async function triage_node(state: typeof AgentState.State) {
  console.log("--- TRIAGING CANDIDATE ---");
  return { status: "TRIAGED" };
}

async function audit_node(state: typeof AgentState.State) {
  console.log("--- PERFORMING TECHNICAL AUDIT ---");
  return { technical_audit: "SCORE: 92/100 - Strong TypeScript & System Design" };
}

const workflow = new StateGraph(AgentState)
  .addNode("triage", triage_node)
  .addNode("audit", audit_node)
  .addEdge("triage", "audit")
  .addEdge("audit", END);

export const recruitmentAgent = workflow.compile();
