# ComplianceGPT™

> **Agentic AI-Powered Multi-Standard Compliance Assessment Platform**  
> Built for Deloitte's Hacksplosion 2026 | Powered by GenW.AI™

![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![React](https://img.shields.io/badge/React-19-61dafb)
![Anthropic](https://img.shields.io/badge/Claude-Sonnet%204-purple)
![Express](https://img.shields.io/badge/Express-5-green)
![License](https://img.shields.io/badge/License-Proprietary-red)

---

## Overview

ComplianceGPT is a **production-grade enterprise web application** that transforms how organizations approach regulatory compliance. Clients upload policy documents and receive **instant readiness scores, gap analysis, evidence validation, maturity levels, and phased remediation roadmaps** across multiple ISO standards simultaneously — powered by 8 specialized AI agents and a 3-tier hybrid scoring engine.

### What Makes It Novel

| Differentiator | Description |
|---|---|
| **8-Agent Orchestrated Pipeline** | Not a single LLM prompt — a coordinated team of specialized AI agents, each with domain expertise, that hand off context through a structured pipeline |
| **3-Tier Hybrid Scoring Engine** | ML semantic scoring (sentence-transformers) → Claude AI enhancement → keyword fallback. Gracefully degrades so it always works |
| **Evidence Validation Agent** | Industry-first: validates whether cited evidence actually supports compliance claims. Checks sufficiency, quality (direct/indirect/anecdotal), chain of custody, and cross-standard evidence reuse |
| **Cross-Standard Synergy Detection** | Identifies where a single remediation action satisfies requirements across multiple ISO standards, reducing cost |
| **Real-Time Agent Streaming** | SSE-based live progress as each agent works, not a black-box "processing…" spinner |
| **GenW.AI Platform Integration** | Architected for Deloitte's GenW.AI infrastructure with a clean bridge layer for production deployment |

### Supported Standards
- **ISO 37001:2025** — Anti-Bribery Management Systems
- **ISO 37301:2021** — Compliance Management Systems
- **ISO 27001:2022** — Information Security Management Systems
- **ISO 9001:2015** — Quality Management Systems

### Key Features
- **8 Specialized AI Agents** orchestrated via sequential-parallel multi-agent architecture
- **3-Tier Hybrid Scoring** — ML → Claude AI → Keyword fallback with graceful degradation
- **Evidence Validation** — AI-powered evidence sufficiency and quality assessment
- **Real-time Visual Dashboard** with radar charts, heatmaps, and gap priority matrices
- **Multi-format Document Processing** (PDF, DOCX, TXT) with structural understanding
- **Cross-standard Gap Analysis** with synergy detection and overlap mapping
- **Phased Remediation Roadmaps** with effort estimates and responsible functions
- **AI-Powered Chat Assistant** for interactive compliance guidance
- **Executive Report Generation** with PDF export
- **Demo Mode** for instant exploration without API keys

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + TypeScript | UI framework with strict typing |
| Vite 6 | Build tool with HMR |
| Tailwind CSS v4 | Utility-first styling with native CSS variables |
| Framer Motion | Page transitions and micro-animations |
| Recharts | Radar charts, bar charts, data visualizations |
| Zustand | Lightweight state management |
| React Router v6 | Client-side routing with lazy loading |
| Lucide React | Consistent icon system |
| jsPDF + html2canvas | Client-side PDF report generation |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | API server with TypeScript |
| Anthropic SDK | Claude claude-sonnet-4-20250514 integration |
| pdf-parse + mammoth | PDF and DOCX document parsing |
| Multer | Multi-file upload handling (max 10 × 20MB) |
| SSE (Server-Sent Events) | Real-time agent progress streaming |
| uuid | Assessment ID generation |

### AI & Scoring
| Component | Role |
|---|---|
| Claude claude-sonnet-4-20250514 | Agent analysis, scoring enhancement, chat |
| sentence-transformers (Python) | Tier 1 ML semantic similarity scoring |
| HybridScoringService | 3-tier orchestration with graceful degradation |

---

## Project Structure

```
compliancegpt/
├── client/                         # React 19 frontend
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── layout/             # Sidebar, Navbar, AppLayout
│   │   │   ├── dashboard/          # Score ring, KPI cards, chat assistant
│   │   │   ├── analytics/          # Heatmap, gap matrix, benchmarks
│   │   │   ├── agents/             # Agent activity feed
│   │   │   └── reports/            # Remediation timeline, evidence validation panel
│   │   ├── pages/                  # 8 route pages (lazy-loaded)
│   │   ├── store/                  # Zustand state store
│   │   ├── data/                   # ISO standards data + demo assessment data
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── types/                  # TypeScript interfaces (20+ types)
│   │   ├── utils/                  # Helper functions
│   │   └── styles/                 # Global CSS + Deloitte design system
│   └── index.html
├── server/                         # Express 5 backend
│   └── src/
│       ├── agents/                 # Agent runner + orchestrator (8 agents)
│       ├── routes/                 # 6 API route modules
│       ├── services/               # HybridScoringService, DocumentParser, GenWAIBridge
│       ├── middleware/             # File upload middleware
│       └── data/                   # Enhanced ISO standards with clauses & keywords
├── docs/                           # Architecture & design documentation
│   ├── AGENT_DESIGN.md            # Multi-agent pipeline specification
│   ├── API_REFERENCE.md           # Complete API endpoint reference
│   ├── ARCHITECTURE.md            # System architecture deep-dive
│   ├── EVIDENCE_VALIDATION.md     # Evidence Validation Agent guide
│   ├── GENW_AI_INTEGRATION.md     # GenW.AI platform integration
│   ├── NOVELTY.md                 # Value proposition & differentiators
│   ├── SCORING_ENGINE.md          # 3-tier hybrid scoring documentation
│   └── WIREFRAMES.md             # UI flow wireframes & design tokens
└── .env.example
```

---

## Quick Start

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9
- Anthropic API key (optional — demo mode and keyword scoring work without it)
- Python 3.9+ with sentence-transformers (optional — for Tier 1 ML scoring)

### Installation

```bash
# Clone and enter the repository
cd compliancegpt

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install

# Configure environment
cd ..
cp .env.example server/.env
# Edit server/.env and add your ANTHROPIC_API_KEY
```

### Development

```bash
# Terminal 1: Start frontend (port 5173)
cd client
npm run dev

# Terminal 2: Start backend (port 3001)
cd server
npm run dev

# Terminal 3 (optional): Start ML scoring service (port 5001)
cd ml-service
python app.py
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3001 |
| ML Service | http://localhost:5001 (optional) |

### Demo Mode

Click the **"Try Demo"** pill button in the navbar to instantly load a complete sample assessment (Acme Corp) with all 8 agents' output pre-computed — no API key or document uploads required.

---

## Pages

| Page | Route | Description |
|---|---|---|
| Landing | `/` | Deloitte-branded hero, features showcase, standards overview, GenW.AI section |
| Dashboard | `/dashboard` | KPI cards, radar chart, compliance heatmap, gap priority matrix, evidence validation panel, remediation timeline, chat assistant |
| Assessment | `/assessment` | 4-step wizard: org profile → document upload → AI processing (live) → results |
| Standards | `/standards` | Standards library browser with clause-level detail and keyword tags |
| Agent Workflow | `/agents` | Visual 8-agent orchestration diagram with IO specifications |
| Analytics | `/analytics` | Maturity trends, industry benchmarks, cross-standard analysis |
| Reports | `/reports` | Executive report builder with PDF export |
| Settings | `/settings` | API key configuration, ML service health, preferences |

---

## AI Agent Architecture

ComplianceGPT employs a **sequential-parallel orchestration pattern** with **8 specialized agents**:

```
┌──────────────────┐
│  Document Agent   │  Step 1 — Parse & structure documents
└────────┬─────────┘
         │
  ┌──────┼──────┬──────────┐
  │      │      │          │
  ▼      ▼      ▼          ▼
┌─────┐┌─────┐┌─────┐┌─────┐
│Brib.││Gov. ││Sec. ││Qual.│  Step 2 — Parallel standard scoring
│37001││37301││27001││9001 │         via HybridScoringService
└──┬──┘└──┬──┘└──┬──┘└──┬──┘
   └──────┼──────┴──────┘
          │
  ┌───────┴────────┐
  │ Gap Analysis    │  Step 3 — Cross-standard gaps & synergies
  └───────┬────────┘
          │
  ┌───────┴────────┐
  │ Evidence        │  Step 4 — Validate evidence sufficiency
  │ Validation      │         & quality (NOVEL)
  └───────┬────────┘
          │
  ┌───────┴────────┐
  │ Remediation     │  Step 5 — Phased roadmap generation
  └────────────────┘
```

| # | Agent | Standard/Role | GenW.AI Module |
|---|---|---|---|
| 1 | Document Agent | Document parsing & NLP | Document Intelligence |
| 2 | Bribery Risk Agent | ISO 37001 | Risk Analytics Engine |
| 3 | Governance Agent | ISO 37301 | Compliance Knowledge Graph |
| 4 | Security Agent | ISO 27001 | Risk Analytics Engine |
| 5 | Quality Agent | ISO 9001 | Compliance Knowledge Graph |
| 6 | Gap Analysis Agent | Cross-standard analysis | Compliance Knowledge Graph |
| 7 | Evidence Validation Agent | Evidence sufficiency & quality | Evidence Validation Engine |
| 8 | Remediation Agent | Phased roadmap planning | Remediation Planning Engine |

> See [docs/AGENT_DESIGN.md](docs/AGENT_DESIGN.md) for full agent specifications.

---

## 3-Tier Hybrid Scoring Engine

The `HybridScoringService` implements a novel multi-tiered scoring approach that gracefully degrades:

| Tier | Method | Confidence | Requirements |
|---|---|---|---|
| **Tier 1** | ML semantic similarity (sentence-transformers) | High | Python ML microservice running |
| **Tier 2** | Claude AI enhancement | High | Anthropic API key configured |
| **Tier 3** | Keyword-based fallback | Medium-Low | None (always available) |

**Scoring Flow:**
1. Try ML scoring → if available, enhance with Claude → return `ml+claude` scores
2. If ML unavailable → try keyword scoring enhanced by Claude → return `claude-only` scores
3. If Claude unavailable → return `keyword-fallback` scores

> See [docs/SCORING_ENGINE.md](docs/SCORING_ENGINE.md) for complete scoring documentation.

---

## Evidence Validation (Novel Feature)

The **Evidence Validation Agent** is an industry-first capability that validates whether the evidence cited for each compliance clause actually supports the compliance claim:

- **Sufficiency Rating**: `sufficient` | `partial` | `insufficient` | `missing`
- **Quality Assessment**: `direct` (policy text) | `indirect` (inferred) | `anecdotal` | `none`
- **Chain of Custody**: Verifies evidence traceability
- **Cross-Standard Reuse**: Identifies evidence that satisfies multiple standards simultaneously

> See [docs/EVIDENCE_VALIDATION.md](docs/EVIDENCE_VALIDATION.md) for the full evidence validation specification.

---

## GenW.AI Integration

ComplianceGPT is architected to integrate with Deloitte's GenW.AI platform through a clean bridge layer (`GenWAIBridge.ts`):

| GenW.AI Module | ComplianceGPT Agent(s) | Capability |
|---|---|---|
| Document Intelligence | Document Agent | Multi-format parsing with structural understanding |
| Risk Analytics Engine | Bribery Risk + Security Agents | Probabilistic risk scoring and heat mapping |
| Compliance Knowledge Graph | Governance + Quality + Gap Analysis Agents | Standards cross-referencing and clause mapping |
| Evidence Validation Engine | Evidence Validation Agent | AI-powered evidence sufficiency analysis |
| Remediation Planning Engine | Remediation Agent | Phased roadmap generation with cost estimation |
| Audit Trail | All Agents | Immutable audit logging and evidence management |

> See [docs/GENW_AI_INTEGRATION.md](docs/GENW_AI_INTEGRATION.md) for the integration architecture.

---

## Design System

ComplianceGPT uses a **Deloitte-inspired professional design system**:

| Token | Value |
|---|---|
| Primary | Teal `#0076A8` |
| Secondary | Deloitte Green `#86BC25` |
| Background | Black `#000000` (sidebar/landing), White (app pages) |
| Display Font | Libre Baskerville (serif) |
| Body Font | Source Sans 3 |
| Code Font | JetBrains Mono |
| Border Radius (buttons) | `999px` (pill-shaped) |
| Border Radius (cards) | `6px` |
| Animations | Framer Motion spring/ease with staggered reveals |

---

## Documentation

| Document | Description |
|---|---|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture, data flow, design decisions |
| [AGENT_DESIGN.md](docs/AGENT_DESIGN.md) | 8-agent pipeline specification and orchestration logic |
| [SCORING_ENGINE.md](docs/SCORING_ENGINE.md) | 3-tier hybrid scoring engine deep-dive |
| [EVIDENCE_VALIDATION.md](docs/EVIDENCE_VALIDATION.md) | Evidence Validation Agent specification |
| [API_REFERENCE.md](docs/API_REFERENCE.md) | Complete REST API reference with schemas |
| [GENW_AI_INTEGRATION.md](docs/GENW_AI_INTEGRATION.md) | GenW.AI platform integration guide |
| [WIREFRAMES.md](docs/WIREFRAMES.md) | UI flow wireframes and design tokens |
| [NOVELTY.md](docs/NOVELTY.md) | Value proposition and differentiators |

---

## License

Proprietary — Built for Deloitte Hacksplosion 2026

---

**ComplianceGPT™** — *Where AI Meets Compliance Excellence*
