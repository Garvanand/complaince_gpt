import Anthropic from '@anthropic-ai/sdk';

const getClient = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');
  return new Anthropic({ apiKey });
};

export interface AgentResult {
  agentName: string;
  standard?: string;
  clauseScores?: { clauseId: string; score: number; finding: string }[];
  gaps?: { id: string; title: string; severity: string; standard: string; clauseRef: string; impactScore: number; effortScore: number; description: string }[];
  remediationActions?: { id: string; title: string; description: string; priority: string; phase: number; effortDays: number; standard: string; responsible: string }[];
  summary?: string;
  raw?: string;
}

export async function runAgent(
  agentName: string,
  systemPrompt: string,
  userPrompt: string,
  onLog?: (msg: string) => void,
): Promise<string> {
  onLog?.(`[${agentName}] Starting analysis...`);

  try {
    const client = getClient();
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('\n');

    onLog?.(`[${agentName}] Analysis complete.`);
    return text;
  } catch (error) {
    onLog?.(`[${agentName}] Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

export function buildDocumentAgentPrompt(): string {
  return `You are the Document Agent for ComplianceGPT, an ISO compliance assessment platform.
Your role is to parse and understand uploaded policy documents.
Extract key sections, controls, policies, and procedures.
Return a structured JSON response with:
{
  "sections": [{ "title": string, "content": string, "relevantStandards": string[] }],
  "controlsIdentified": number,
  "summary": string
}`;
}

export function buildStandardAgentPrompt(standardCode: string, standardName: string): string {
  return `You are the ${standardName} Assessment Agent for ComplianceGPT.
You evaluate organizational policies against ${standardCode} (${standardName}) clauses.
For each clause, provide a compliance score (0-100) and a brief finding.
Return JSON:
{
  "standard": "${standardCode}",
  "clauseScores": [{ "clauseId": string, "score": number, "finding": string }],
  "overallScore": number,
  "maturityLevel": number,
  "summary": string
}`;
}

export function buildGapAnalysisPrompt(): string {
  return `You are the Gap Analysis Agent for ComplianceGPT.
You analyze compliance scores across ISO 37001, 37301, 27001, and 9001 to identify cross-standard gaps.
Identify gaps with severity (critical/high/medium/low), impact scores, effort estimates.
Return JSON:
{
  "gaps": [{ "id": string, "title": string, "severity": string, "standard": string, "clauseRef": string, "impactScore": number, "effortScore": number, "description": string }],
  "crossStandardOverlaps": [{ "standards": string[], "area": string, "savingsPercent": number }],
  "summary": string
}`;
}

export function buildRemediationPrompt(): string {
  return `You are the Remediation Agent for ComplianceGPT.
You create phased remediation roadmaps based on gap analysis results.
Prioritize by risk impact and assign to appropriate organizational functions.
Return JSON:
{
  "actions": [{ "id": string, "title": string, "description": string, "priority": string, "phase": number, "effortDays": number, "standard": string, "responsible": string }],
  "phases": [{ "phase": number, "name": string, "duration": string }],
  "totalEffortDays": number,
  "summary": string
}`;
}
