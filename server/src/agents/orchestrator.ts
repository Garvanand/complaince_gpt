import { v4 as uuidv4 } from 'uuid';
import {
  runAgent,
  buildDocumentAgentPrompt,
  buildGapAnalysisPrompt,
  buildEvidenceValidationPrompt,
  buildRemediationPrompt,
  buildPolicyGeneratorPrompt,
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

export interface EvidenceValidationItem {
  id: string;
  clauseId: string;
  standardCode: string;
  evidenceText: string;
  validationResult: 'sufficient' | 'partial' | 'insufficient' | 'missing';
  qualityScore: number;
  qualityLevel: 'direct' | 'indirect' | 'anecdotal' | 'none';
  issues: string[];
  recommendation: string;
  crossStandardReuse: string[];
}

export interface EvidenceValidationResult {
  evidenceItems: EvidenceValidationItem[];
  overallEvidenceScore: number;
  sufficientCount: number;
  partialCount: number;
  insufficientCount: number;
  missingCount: number;
  crossStandardOpportunities: number;
  summary: string;
}

export interface PolicySection {
  sectionNumber: string;
  title: string;
  clauseRef: string;
  content: string;
  status: 'new' | 'revised' | 'retained';
}

export interface PolicyDocument {
  id: string;
  standardCode: string;
  standardName: string;
  title: string;
  version: string;
  effectiveDate: string;
  sections: PolicySection[];
  complianceScore: number;
  gapsAddressed: number;
  summary: string;
}

export interface PolicyGeneratorResult {
  policyDocuments: PolicyDocument[];
  totalPoliciesGenerated: number;
  overallComplianceTarget: number;
  summary: string;
}

export interface AssessmentResult {
  id: string;
  orgProfile: { company: string; industry: string; employees: string; scope: string };
  overallScore: number;
  maturityLevel: number;
  standardAssessments: StandardAssessment[];
  gaps: Gap[];
  evidenceValidation: EvidenceValidationResult;
  remediationActions: RemediationAction[];
  policyDocuments: PolicyDocument[];
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

  // Step 4: Evidence Validation Agent
  callbacks.onAgentStart('Evidence Validation Agent');
  callbacks.onLog('🔐 Evidence Validation Agent — Validating evidence sufficiency and quality...');
  const evidencePrompt = `Validate the evidence cited for each clause in these assessment results:

${standardAssessments.map((sa) => `${sa.standard}: ${JSON.stringify(sa.clauseScores)}`).join('\n\n')}

Gaps identified: ${JSON.stringify(allGaps)}
Organization: ${orgProfile.company}, ${orgProfile.industry}, ${orgProfile.employees} employees`;

  const evidenceResult = await runAgent('Evidence Validation Agent', buildEvidenceValidationPrompt(), evidencePrompt, callbacks.onLog);
  callbacks.onAgentComplete('Evidence Validation Agent', evidenceResult);

  const evidenceParsed = safeParseJSON(evidenceResult);
  const evidenceValidation: EvidenceValidationResult = {
    evidenceItems: (evidenceParsed?.evidenceItems as EvidenceValidationItem[]) || [],
    overallEvidenceScore: (evidenceParsed?.overallEvidenceScore as number) || 0,
    sufficientCount: (evidenceParsed?.sufficientCount as number) || 0,
    partialCount: (evidenceParsed?.partialCount as number) || 0,
    insufficientCount: (evidenceParsed?.insufficientCount as number) || 0,
    missingCount: (evidenceParsed?.missingCount as number) || 0,
    crossStandardOpportunities: (evidenceParsed?.crossStandardOpportunities as number) || 0,
    summary: (evidenceParsed?.summary as string) || 'Evidence validation complete.',
  };
  callbacks.onLog(`🔐 Evidence Validation Agent — Score: ${evidenceValidation.overallEvidenceScore}%, ${evidenceValidation.sufficientCount} sufficient, ${evidenceValidation.insufficientCount} insufficient, ${evidenceValidation.missingCount} missing`);

  // Step 5: Remediation Agent
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

  // Step 6: Policy Generator Agent
  callbacks.onAgentStart('Policy Generator Agent');
  callbacks.onLog('📝 Policy Generator Agent — Generating 100% compliant policy documents...');
  const policyPrompt = `Generate complete, 100% compliant policy documents for each standard based on the assessment results, gaps, evidence validation, and remediation actions:

Assessment Results:
${standardAssessments.map((sa) => `${sa.standard} (${sa.name}): Overall ${sa.overallScore}%, ${sa.clauseScores.length} clauses assessed`).join('\n')}

Gaps Identified (${allGaps.length} total):
${JSON.stringify(allGaps, null, 2)}

Remediation Actions (${allActions.length} total):
${JSON.stringify(allActions, null, 2)}

Evidence Validation Summary: ${evidenceValidation.summary}

Organization: ${orgProfile.company}, ${orgProfile.industry}, ${orgProfile.employees} employees
Scope: ${orgProfile.scope}

Generate a complete, ready-to-adopt policy document for each standard that addresses ALL identified gaps and achieves 100% compliance.`;

  const policyResult = await runAgent('Policy Generator Agent', buildPolicyGeneratorPrompt(), policyPrompt, callbacks.onLog);
  callbacks.onAgentComplete('Policy Generator Agent', policyResult);

  const policyParsed = safeParseJSON(policyResult);
  const policyDocuments: PolicyDocument[] = (policyParsed?.policyDocuments as PolicyDocument[]) || [];
  callbacks.onLog(`📝 Policy Generator Agent — Generated ${policyDocuments.length} compliant policy documents targeting 100% compliance`);

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
    evidenceValidation,
    remediationActions: allActions,
    policyDocuments,
    timestamp: new Date().toISOString(),
  };

  callbacks.onComplete(assessment);
  callbacks.onLog(`✓ Assessment Complete — Overall Score: ${overallScore}%`);

  return assessment;
}
