/**
 * GenW.AI Bridge — Integration layer for Deloitte's GenW.AI platform
 * Maps ComplianceGPT agents to GenW.AI module capabilities
 */

export interface GenWAIModule {
  id: string;
  name: string;
  capability: string;
  endpoint: string;
}

export const genWAIModules: Record<string, GenWAIModule> = {
  documentIntelligence: {
    id: 'genw-doc-intel',
    name: 'Document Intelligence',
    capability: 'Multi-format document parsing with structural understanding',
    endpoint: '/api/genw/document-intelligence',
  },
  riskAnalytics: {
    id: 'genw-risk',
    name: 'Risk Analytics Engine',
    capability: 'Probabilistic risk scoring and heat mapping',
    endpoint: '/api/genw/risk-analytics',
  },
  complianceKnowledge: {
    id: 'genw-knowledge',
    name: 'Compliance Knowledge Graph',
    capability: 'Standards cross-referencing and clause mapping',
    endpoint: '/api/genw/knowledge-graph',
  },
  remediationEngine: {
    id: 'genw-remediation',
    name: 'Remediation Planning Engine',
    capability: 'Phased remediation roadmap generation with cost estimation',
    endpoint: '/api/genw/remediation',
  },
  auditTrail: {
    id: 'genw-audit',
    name: 'Audit Trail',
    capability: 'Immutable audit logging and evidence management',
    endpoint: '/api/genw/audit-trail',
  },
};

export interface GenWAIAgentMapping {
  agentName: string;
  genWAIModule: string;
  description: string;
}

export const agentModuleMappings: GenWAIAgentMapping[] = [
  { agentName: 'Document Agent', genWAIModule: 'documentIntelligence', description: 'Leverages GenW.AI Document Intelligence for multi-format parsing and structural understanding' },
  { agentName: 'Bribery Risk Agent', genWAIModule: 'riskAnalytics', description: 'Uses GenW.AI Risk Analytics for probabilistic bribery risk scoring' },
  { agentName: 'Governance Agent', genWAIModule: 'complianceKnowledge', description: 'Queries GenW.AI Compliance Knowledge Graph for governance mapping' },
  { agentName: 'Security Agent', genWAIModule: 'riskAnalytics', description: 'Applies GenW.AI Risk Analytics to information security posture' },
  { agentName: 'Quality Agent', genWAIModule: 'complianceKnowledge', description: 'Uses GenW.AI Knowledge Graph for quality management cross-referencing' },
  { agentName: 'Gap Analysis Agent', genWAIModule: 'complianceKnowledge', description: 'Cross-references all standards via GenW.AI Knowledge Graph' },
  { agentName: 'Remediation Agent', genWAIModule: 'remediationEngine', description: 'Generates phased roadmaps via GenW.AI Remediation Planning Engine' },
];

/**
 * In production, this would call GenW.AI APIs.
 * For the hackathon demo, agents use Claude directly.
 */
export function getGenWAIModuleForAgent(agentName: string): GenWAIModule | undefined {
  const mapping = agentModuleMappings.find((m) => m.agentName === agentName);
  if (!mapping) return undefined;
  return genWAIModules[mapping.genWAIModule];
}
