# Agent Design Document

## Multi-Agent Architecture

ComplianceGPT employs a **sequential-parallel orchestration pattern** where 7 specialized agents work together to produce a comprehensive compliance assessment.

## Agent Pipeline

```
                    ┌─────────────────┐
                    │  Document Agent  │
                    │  (Sequential)    │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │              │
     ┌────────┴───┐ ┌───────┴──┐ ┌────────┴──┐ ┌───────┴────┐
     │ Bribery    │ │Governance│ │ Security  │ │ Quality    │
     │ Risk Agent │ │ Agent    │ │ Agent     │ │ Agent      │
     │ (ISO37001) │ │(ISO37301)│ │(ISO27001) │ │ (ISO9001)  │
     └────────┬───┘ └───────┬──┘ └────────┬──┘ └───────┬────┘
              │              │              │              │
              └──────────────┼──────────────┘
                             │
                    ┌────────┴────────┐
                    │  Gap Analysis   │
                    │  Agent          │
                    └────────┬────────┘
                             │
                    ┌────────┴────────┐
                    │  Remediation    │
                    │  Agent          │
                    └─────────────────┘
```

## Agent Specifications

### 1. Document Agent
- **Purpose**: Parse and structure uploaded policy documents
- **Input**: Raw document text (PDF/DOCX/TXT)
- **Output**: Structured sections, controls identified, content summary
- **GenW.AI Module**: Document Intelligence

### 2. Bribery Risk Agent (ISO 37001)
- **Purpose**: Evaluate anti-bribery management clauses
- **Input**: Document analysis + ISO 37001 clause list
- **Output**: Clause-level scores (0-100), findings
- **GenW.AI Module**: Risk Analytics Engine

### 3. Governance Agent (ISO 37301)
- **Purpose**: Assess compliance management system maturity
- **Input**: Document analysis + ISO 37301 clause list
- **Output**: Clause-level scores, compliance findings
- **GenW.AI Module**: Compliance Knowledge Graph

### 4. Security Agent (ISO 27001)
- **Purpose**: Analyze information security controls
- **Input**: Document analysis + ISO 27001 clause list
- **Output**: Clause-level scores, security findings
- **GenW.AI Module**: Risk Analytics Engine

### 5. Quality Agent (ISO 9001)
- **Purpose**: Review quality management processes
- **Input**: Document analysis + ISO 9001 clause list
- **Output**: Clause-level scores, quality findings
- **GenW.AI Module**: Compliance Knowledge Graph

### 6. Gap Analysis Agent
- **Purpose**: Cross-standard gap identification and synergy detection
- **Input**: All standard assessment results
- **Output**: Gaps with severity, impact/effort scores, cross-standard overlaps
- **GenW.AI Module**: Compliance Knowledge Graph

### 7. Remediation Agent
- **Purpose**: Generate phased remediation roadmaps
- **Input**: Gap analysis results + org context
- **Output**: Prioritized actions across 3 phases with effort estimates
- **GenW.AI Module**: Remediation Planning Engine

## Orchestration Logic

1. **Sequential Start**: Document Agent must complete first (dependency)
2. **Parallel Execution**: 4 standard-specific agents run concurrently
3. **Aggregation**: Gap Analysis Agent waits for all standard agents
4. **Final Stage**: Remediation Agent processes gap analysis output
5. **Streaming**: All agent events streamed via SSE to the client

## Error Handling

- Each agent has independent error handling
- If a standard agent fails, others continue
- Gap Analysis uses available results even if some agents error
- Client shows partial results with error indicators

## Prompt Engineering

Each agent uses a carefully crafted system prompt that:
- Defines the agent's role and standard expertise
- Specifies the expected JSON output schema
- Includes scoring rubrics and maturity level definitions
- References the organizational context from the profile
