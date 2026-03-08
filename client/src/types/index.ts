export interface OrgProfile {
  companyName: string;
  industrySector: string;
  employeeCount: string;
  assessmentScope: 'full' | 'quick' | 'targeted';
}

export interface ClauseData {
  id: string;
  title: string;
  description: string;
  category: string;
  weight: number;
}

export interface StandardData {
  code: string;
  name: string;
  edition: string;
  clauses: ClauseData[];
}

export interface StandardsLibrary {
  ISO37001: StandardData;
  ISO37301: StandardData;
  ISO27001: StandardData;
  ISO9001: StandardData;
}

export interface ClauseScore {
  clauseId: string;
  clauseTitle: string;
  score: number; // 0, 33, 66, 100
  status: 'not-started' | 'planned' | 'partial' | 'implemented';
  evidence: string;
  gap: string;
  remediation: string;
}

export interface StandardAssessment {
  standardCode: string;
  standardName: string;
  overallScore: number;
  maturityLevel: number; // 1-5
  maturityLabel: string;
  clauseScores: ClauseScore[];
  summary: string;
}

export interface Gap {
  id: string;
  clauseId: string;
  standardCode: string;
  title: string;
  description: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
  effort: number; // days
  impactScore: number; // 1-10
  effortScore: number; // 1-10
  crossStandardOverlap: string[];
  category: 'policy' | 'process' | 'training' | 'technology' | 'documentation';
}

export interface RemediationAction {
  id: string;
  title: string;
  phase: 1 | 2 | 3;
  phaseLabel: string;
  clauseIds: string[];
  standards: string[];
  responsibleFunction: string;
  effortDays: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  successMetric: string;
  description: string;
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

export interface EvidenceValidation {
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
  orgProfile: OrgProfile;
  timestamp: string;
  overallScore: number;
  overallMaturity: number;
  overallMaturityLabel: string;
  standards: StandardAssessment[];
  gaps: Gap[];
  evidenceValidation: EvidenceValidation;
  remediation: RemediationAction[];
  policyDocuments?: PolicyDocument[];
  executiveSummary: string;
}

export interface AgentStatus {
  name: string;
  status: 'idle' | 'processing' | 'complete' | 'error';
  progress: number;
  currentAction: string;
  startTime?: string;
  endTime?: string;
}

export interface AgentLogEntry {
  id: string;
  timestamp: string;
  agentName: string;
  message: string;
  type: 'info' | 'progress' | 'success' | 'error';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export type StandardCode = 'ISO37001' | 'ISO37301' | 'ISO27001' | 'ISO9001';

export interface Report {
  id: string;
  assessmentId: string;
  orgName: string;
  date: string;
  standardsCovered: string[];
  overallScore: number;
  status: 'ready' | 'generating' | 'error';
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}
