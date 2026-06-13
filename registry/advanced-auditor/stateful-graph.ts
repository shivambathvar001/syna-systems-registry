import { StateGraph, END } from "@langchain/langgraph";
import { Annotation } from "@langchain/langgraph";

/**
 * Syna Systems: Advanced Stateful Document Auditor
 * Pattern: Multi-Agent Critique (Supervisor -> Extractor -> Auditor -> Human)
 */

const GraphState = Annotation.Root({
  raw_content: Annotation<string>(),
  extracted_data: Annotation<any>(),
  audit_report: Annotation<string>(),
  discrepancies_found: Annotation<boolean>(),
  iterations: Annotation<number>(),
});

async function extraction_node(state: typeof GraphState.State) {
  console.log("[SYNA_NODE] Extracting high-confidence entities...");
  return { extracted_data: { total_amount: 1540.20, carrier: "GlobalLink" }, iterations: 1 };
}

async function audit_node(state: typeof GraphState.State) {
  console.log("[SYNA_NODE] Auditing against trade policies...");
  const hasDiscrepancy = state.iterations < 2; // Simulate a first-pass error
  return { 
    audit_report: hasDiscrepancy ? "ERR_POLICY_MISMATCH" : "AUDIT_PASSED",
    discrepancies_found: hasDiscrepancy 
  };
}

function router(state: typeof GraphState.State) {
  if (state.discrepancies_found && state.iterations < 2) return "re-extract";
  return "end";
}

const workflow = new StateGraph(GraphState)
  .addNode("extractor", extraction_node)
  .addNode("auditor", audit_node)
  .addEdge("extractor", "auditor")
  .addConditionalEdges("auditor", router, {
    "re-extract": "extractor",
    "end": END
  });

export const documentAuditor = workflow.compile();
