# GenW.AI™ Integration Guide

## Overview

ComplianceGPT integrates with Deloitte's **GenW.AI™** (Generative Workforce AI) platform, leveraging its enterprise-grade AI infrastructure for scalable, auditable compliance assessment. The integration is implemented through a clean bridge layer (`GenWAIBridge.ts`) that maps each ComplianceGPT agent to its corresponding GenW.AI module.

## Module Mapping

| GenW.AI Module | ID | ComplianceGPT Agent(s) | Capability |
|---|---|---|---|
| **Document Intelligence** | `genw-doc-intel` | Document Agent | Multi-format document parsing with structural understanding, entity extraction, and section classification |
| **Risk Analytics Engine** | `genw-risk` | Bribery Risk Agent, Security Agent | Probabilistic risk scoring, heat map generation, and quantitative impact assessment |
| **Compliance Knowledge Graph** | `genw-knowledge` | Governance Agent, Quality Agent, Gap Analysis Agent | Standards cross-referencing, clause mapping, regulatory knowledge base queries |
| **Remediation Planning Engine** | `genw-remediation` | Remediation Agent | Phased roadmap generation, resource estimation, priority optimization |
| **Audit Trail** | `genw-audit` | All Agents | Immutable logging of all agent actions, decisions, and scoring rationale |
| **Evidence Validation Engine** | `genw-evidence` | Evidence Validation Agent | AI-powered evidence sufficiency analysis, chain-of-custody verification, cross-standard reuse detection |
| **Policy Generation Engine** | `genw-policy` | Policy Generator Agent | AI-powered compliant policy document generation with clause-level coverage and download capability |

## Integration Architecture

```
┌─────────────────────────────────────────────────────┐
│         ComplianceGPT Agent Layer                    │
│                                                      │
│  Doc Agent → Bribery → Governance → Security         │
│  Quality → Gap Analysis → Evidence Val. → Remediation│
│  → Policy Generator                                  │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌──────────────────────┴──────────────────────────────┐
│         GenW.AI Bridge  (GenWAIBridge.ts)            │
│                                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │  Module Registry                             │    │
│  │  7 modules with IDs, names, capabilities,    │    │
│  │  and API endpoints                           │    │
│  └─────────────────────────────────────────────┘    │
│                                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │  Agent-Module Mappings                       │    │
│  │  9 agent → module mappings with descriptions │    │
│  └─────────────────────────────────────────────┘    │
│                                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │  getGenWAIModuleForAgent(agentName)          │    │
│  │  → Resolves agent name to GenW.AI module     │    │
│  └─────────────────────────────────────────────┘    │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌──────────────────────┴──────────────────────────────┐
│         GenW.AI™ Platform (Production)               │
│                                                      │
│  /api/genw/document-intelligence                     │
│  /api/genw/risk-analytics                            │
│  /api/genw/knowledge-graph                           │
│  /api/genw/remediation                               │
│  /api/genw/audit-trail                               │
│  /api/genw/evidence-validation                       │
│  /api/genw/policy-generation                          │
└─────────────────────────────────────────────────────┘
```

## Agent-Module Mapping Detail

| Agent | GenW.AI Module | Integration Description |
|---|---|---|
| Document Agent | Document Intelligence | Leverages GenW.AI Document Intelligence for multi-format parsing and structural understanding |
| Bribery Risk Agent | Risk Analytics Engine | Uses GenW.AI Risk Analytics for probabilistic bribery risk scoring |
| Governance Agent | Compliance Knowledge Graph | Queries GenW.AI Compliance Knowledge Graph for governance mapping |
| Security Agent | Risk Analytics Engine | Applies GenW.AI Risk Analytics to information security posture |
| Quality Agent | Compliance Knowledge Graph | Uses GenW.AI Knowledge Graph for quality management cross-referencing |
| Gap Analysis Agent | Compliance Knowledge Graph | Cross-references all standards via GenW.AI Knowledge Graph |
| Evidence Validation Agent | Evidence Validation Engine | Validates evidence sufficiency and quality via GenW.AI Evidence Validation Engine |
| Remediation Agent | Remediation Planning Engine | Generates phased roadmaps via GenW.AI Remediation Planning Engine |
| Policy Generator Agent | Policy Generation Engine | Generates 100% compliant policy documents via GenW.AI Policy Generation Engine |

## Current Implementation (Hackathon)

For the hackathon demo, the GenW.AI Bridge provides:

- **Module Registry**: Defines all 7 GenW.AI modules with their IDs, names, capabilities, and API endpoints
- **Agent-Module Mapping**: Maps each of the 9 ComplianceGPT agents to its corresponding GenW.AI module
- **Module Resolution**: `getGenWAIModuleForAgent()` function resolves any agent name to its GenW.AI module configuration
- **Fallback to Claude**: When GenW.AI endpoints are not available (as in the hackathon environment), agents use Claude claude-sonnet-4-20250514 directly via the Anthropic SDK

The bridge is designed for zero-friction migration — when GenW.AI endpoints are available, agents route through them instead of Claude, with no changes to the orchestrator or agent logic.

## Production Roadmap

| Phase | Integration | Benefit |
|---|---|---|
| **Phase 1** | Document Intelligence API | Enhanced multi-format parsing with entity extraction, structural metadata |
| **Phase 2** | Knowledge Graph queries | Live standards cross-referencing, regulatory update awareness |
| **Phase 3** | Risk Analytics Engine | Probabilistic scoring with historical benchmarking |
| **Phase 4** | Evidence Validation Engine | Enterprise-grade evidence chain-of-custody verification |
| **Phase 5** | Audit Trail integration | Immutable compliance-grade logging for regulatory audit |
| **Phase 6** | Remediation Planning Engine | ML-optimized roadmaps with organizational context learning |
| **Phase 7** | Policy Generation Engine | AI-generated compliant policy documents with organizational context |

## Benefits of GenW.AI Integration

| Benefit | Description |
|---|---|
| **Enterprise Scale** | Handle thousands of concurrent assessments via GenW.AI infrastructure |
| **Audit Compliance** | Immutable audit trail satisfies regulatory audit requirements |
| **Knowledge Base** | Continuously updated standards knowledge graph ensures currency |
| **Cost Optimization** | Shared infrastructure across Deloitte services reduces per-assessment cost |
| **Security** | Enterprise-grade data handling, encryption at rest and in transit |
| **Evidence Integrity** | Chain-of-custody verification for evidence artifacts |

## Code Reference

The GenW.AI Bridge is implemented in:
- `server/src/services/GenWAIBridge.ts` — Module registry, agent mappings, resolution function
- Each agent in `server/src/agents/agentRunner.ts` — Can be routed through GenW.AI or Claude
