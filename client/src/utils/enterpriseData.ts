import type {
  AgentLogEntry,
  AgentStatus,
  AssessmentResult,
  Gap,
  RemediationAction,
  StandardAssessment,
  StandardCode,
} from '../types';

export const standardLabels: Record<string, string> = {
  ISO37001: 'ISO 37001',
  ISO37301: 'ISO 37301',
  ISO27001: 'ISO 27001',
  ISO9001: 'ISO 9001',
};

export const standardColors: Record<string, string> = {
  ISO37001: '#dd6b20',
  ISO37301: '#86bc25',
  ISO27001: '#0076a8',
  ISO9001: '#70563c',
};

export function getStandardLabel(code: string) {
  return standardLabels[code] || code.replace('ISO', 'ISO ');
}

export function getSeverityWeight(severity: string) {
  switch (severity) {
    case 'critical':
      return 4;
    case 'high':
      return 3;
    case 'medium':
      return 2;
    default:
      return 1;
  }
}

export function sortGapsByPriority(gaps: Gap[]) {
  return [...gaps].sort((left, right) => {
    const severityDelta = getSeverityWeight(right.impact) - getSeverityWeight(left.impact);
    if (severityDelta !== 0) return severityDelta;
    return right.impactScore - left.impactScore;
  });
}

export function getRiskDistribution(gaps: Gap[]) {
  return {
    critical: gaps.filter((gap) => gap.impact === 'critical').length,
    high: gaps.filter((gap) => gap.impact === 'high').length,
    medium: gaps.filter((gap) => gap.impact === 'medium').length,
    low: gaps.filter((gap) => gap.impact === 'low').length,
  };
}

export function getStandardStatus(score: number) {
  if (score >= 85) return 'compliant';
  if (score >= 60) return 'partial';
  return 'non-compliant';
}

export function getControlCoverage(standard: StandardAssessment) {
  const total = standard.clauseScores.length || 1;
  const implemented = standard.clauseScores.filter((clause) => clause.score >= 85).length;
  const partial = standard.clauseScores.filter((clause) => clause.score >= 50 && clause.score < 85).length;
  const missing = total - implemented - partial;

  return {
    implemented,
    partial,
    missing,
    implementedPct: Math.round((implemented / total) * 100),
  };
}

export function getRemediationSummary(actions: RemediationAction[]) {
  const totalEffortDays = actions.reduce((sum, action) => sum + action.effortDays, 0);
  const byPhase = [1, 2, 3].map((phase) => ({
    phase,
    count: actions.filter((action) => action.phase === phase).length,
  }));

  return { totalEffortDays, byPhase };
}

export function getAssessmentNarrative(assessment: AssessmentResult | null) {
  if (!assessment) {
    return 'No live assessment has been loaded. Run an assessment to unlock portfolio, controls, and remediation intelligence.';
  }

  const topGap = sortGapsByPriority(assessment.gaps)[0];
  const weakest = [...assessment.standards].sort((left, right) => left.overallScore - right.overallScore)[0];

  return [
    `${assessment.orgProfile.companyName || 'This organization'} is operating at ${assessment.overallScore}% overall compliance maturity across ${assessment.standards.length} assessed standards.`,
    weakest ? `The largest standards exposure is ${getStandardLabel(weakest.standardCode)} at ${weakest.overallScore}%.` : null,
    topGap ? `Highest priority gap: ${topGap.title} (${getStandardLabel(topGap.standardCode)} clause ${topGap.clauseId}).` : null,
  ].filter(Boolean).join(' ');
}

export function getAgentHealth(agentStatuses: AgentStatus[], agentLog: AgentLogEntry[]) {
  const processing = agentStatuses.filter((agent) => agent.status === 'processing').length;
  const errors = agentStatuses.filter((agent) => agent.status === 'error').length;
  const completed = agentStatuses.filter((agent) => agent.status === 'complete').length;
  const latestEntries = [...agentLog].slice(-6).reverse();

  return {
    processing,
    errors,
    completed,
    latestEntries,
  };
}

export function getAssessedStandardCodes(assessment: AssessmentResult | null): StandardCode[] {
  if (!assessment) {
    return ['ISO37001', 'ISO37301', 'ISO27001', 'ISO9001'];
  }

  return assessment.standards.map((standard) => standard.standardCode as StandardCode);
}