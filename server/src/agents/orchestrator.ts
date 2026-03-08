import { v4 as uuidv4 } from 'uuid';
import {
  runAgent,
  buildDocumentAgentPrompt,
  buildGapAnalysisPrompt,
  buildRemediationPrompt,
} from './agentRunner';
import { isoStandards } from '../data/standards';
import { scoreAllStandards } from '../services/HybridScoringService';

export interface OrchestratorCallbacks {
  onAgentStart: (agentName: string) => void;
  onAgentComplete: (agentName: string, result: string) => void;
  onAgentError: (agentName: string, error: string) => void;
  onLog: (message: string) => void;
  onComplete: (result: AssessmentResult) => void;
}

export interface AssessmentResult {
  id: string;
  orgProfile: { company: string; industry: string; employees: string; scope: string };
  overallScore: number;
  maturityLevel: number;
  standardAssessments: StandardAssessment[];
  gaps: Gap[];
  remediationActions: RemediationAction[];
  timestamp: string;
}

interface StandardAssessment {
  standard: string;
  name: string;
  overallScore: number;
  maturityLevel: number;
  clauseScores: { clauseId: string; score: number; finding: string }[];
}

interface Gap {
  id: string;
  title: string;
  severity: string;
  standard: string;
  clauseRef: string;
  impactScore: number;
  effortScore: number;
  description: string;
}

interface RemediationAction {
  id: string;
  title: string;
  description: string;
  priority: string;
  phase: number;
  effortDays: number;
  standard: string;
  responsible: string;
}

function safeParseJSON(text: string): Record<string, unknown> | null {
  try {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonStr = jsonMatch ? jsonMatch[1].trim() : text.trim();
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

function getMaturityLevel(score: number): number {
  if (score >= 90) return 5;
  if (score >= 75) return 4;
  if (score >= 60) return 3;
  if (score >= 40) return 2;
  return 1;
}

export async function runOrchestrator(
  documentText: string,
  standards: string[],
  orgProfile: { company: string; industry: string; employees: string; scope: string },
  callbacks: OrchestratorCallbacks,
): Promise<AssessmentResult> {
  const assessmentId = uuidv4();
  const standardAssessments: StandardAssessment[] = [];
  let allGaps: Gap[] = [];
  let allActions: RemediationAction[] = [];

  // Step 1: Document Agent
  callbacks.onAgentStart('Document Agent');
  callbacks.onLog('🔍 Document Agent — Parsing uploaded policy documents...');
  const docResult = await runAgent(
    'Document Agent',
    buildDocumentAgentPrompt(),
    `Analyze the following policy documents for ${orgProfile.company} (${orgProfile.industry} industry, ${orgProfile.employees} employees):\n\n${documentText}`,
    callbacks.onLog,
  );
  callbacks.onAgentComplete('Document Agent', docResult);
  const docParsed = safeParseJSON(docResult);
  const controlsIdentified = (docParsed?.controlsIdentified as number) || 0;
  callbacks.onLog(`🔍 Document Agent — Extracted content, ${controlsIdentified || 'multiple'} controls identified`);

  // Step 2: Standard-specific scoring via HybridScoringService
  const standardAgentNames: Record<string, string> = {
    ISO37001: 'Bribery Risk Agent',
    ISO37301: 'Governance Agent',
    ISO27001: 'Security Agent',
    ISO9001: 'Quality Agent',
  };

  for (const code of standards) {
    const agentName = standardAgentNames[code] || `${code} Agent`;
    callbacks.onAgentStart(agentName);
    callbacks.onLog(`⚖️ ${agentName} — Scoring ${code} clauses via HybridScoring...`);
  }

  const hybridResults = await scoreAllStandards(documentText, standards, callbacks.onLog);

  for (const result of hybridResults) {
    const agentName = standardAgentNames[result.standard] || `${result.standard} Agent`;
    const std = isoStandards[result.standard];

    standardAssessments.push({
      standard: result.standard,
      name: result.name,
      overallScore: result.overallScore,
      maturityLevel: result.maturityLevel,
      clauseScores: result.clauseScores.map(cs => ({
        clauseId: cs.clauseId,
        score: cs.score,
        finding: cs.finding,
      })),
    });

    callbacks.onAgentComplete(agentName, `Scored ${result.clauseScores.length} clauses: ${result.overallScore}% (${result.scoringMethod})`);
    callbacks.onLog(`⚖️ ${agentName} — ${result.overallScore}% overall (Level ${result.maturityLevel}, method: ${result.scoringMethod})`);
  }

  // Step 3: Gap Analysis Agent
  callbacks.onAgentStart('Gap Analysis Agent');
  callbacks.onLog('📊 Gap Analysis Agent — Analyzing cross-standard gaps...');
  const gapPrompt = `Analyze the following assessment results and identify compliance gaps:

${standardAssessments.map((sa) => `${sa.standard}: Overall ${sa.overallScore}%, Clauses: ${JSON.stringify(sa.clauseScores)}`).join('\n\n')}

Organization: ${orgProfile.company}, ${orgProfile.industry}, ${orgProfile.employees} employees`;

  const gapResult = await runAgent('Gap Analysis Agent', buildGapAnalysisPrompt(), gapPrompt, callbacks.onLog);
  callbacks.onAgentComplete('Gap Analysis Agent', gapResult);

  const gapParsed = safeParseJSON(gapResult);
  allGaps = (gapParsed?.gaps as Gap[]) || [];
  const criticalCount = allGaps.filter((g) => g.severity === 'critical').length;
  callbacks.onLog(`📊 Gap Analysis Agent — Identified ${allGaps.length} gaps, ${criticalCount} critical across ${standards.length} standards`);

  // Step 4: Remediation Agent
  callbacks.onAgentStart('Remediation Agent');
  callbacks.onLog('🛠️ Remediation Agent — Building phased roadmap...');
  const remPrompt = `Create a phased remediation roadmap for these gaps:

${JSON.stringify(allGaps, null, 2)}

Organization context: ${orgProfile.company}, ${orgProfile.industry}`;

  const remResult = await runAgent('Remediation Agent', buildRemediationPrompt(), remPrompt, callbacks.onLog);
  callbacks.onAgentComplete('Remediation Agent', remResult);

  const remParsed = safeParseJSON(remResult);
  allActions = (remParsed?.actions as RemediationAction[]) || [];
  callbacks.onLog(`🛠️ Remediation Agent — Generated ${allActions.length}-action roadmap`);

  // Compute overall
  const overallScore = standardAssessments.length > 0
    ? Math.round(standardAssessments.reduce((sum, sa) => sum + sa.overallScore, 0) / standardAssessments.length)
    : 0;

  const assessment: AssessmentResult = {
    id: assessmentId,
    orgProfile,
    overallScore,
    maturityLevel: getMaturityLevel(overallScore),
    standardAssessments,
    gaps: allGaps,
    remediationActions: allActions,
    timestamp: new Date().toISOString(),
  };

  callbacks.onComplete(assessment);
  callbacks.onLog(`✓ Assessment Complete — Overall Score: ${overallScore}%`);

  return assessment;
}
