# ComplianceGPT™

> **Agentic AI-Powered Multi-Standard Compliance Assessment Platform**  
> Built for Deloitte's Hacksplosion 2026 | Powered by GenW.AI™

![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![Anthropic](https://img.shields.io/badge/Claude-Opus%204-purple)
![License](https://img.shields.io/badge/License-Proprietary-red)

---

## 🚀 Overview

ComplianceGPT is a **production-grade enterprise web application** where clients upload policy documents and receive **instant readiness scores, gap analysis, maturity levels, and remediation roadmaps** across multiple ISO standards simultaneously.

### Supported Standards
- **ISO 37001** — Anti-Bribery Management Systems
- **ISO 37301** — Compliance Management Systems
- **ISO 27001** — Information Security Management Systems
- **ISO 9001** — Quality Management Systems

### Key Features
- 🤖 **7 Specialized AI Agents** orchestrated via multi-agent architecture
- 📊 **Real-time Visual Dashboard** with radar charts, heatmaps, and gap matrices
- 📄 **Multi-format Document Processing** (PDF, DOCX, TXT)
- 🔍 **Cross-standard Gap Analysis** with synergy detection
- 🛠️ **Phased Remediation Roadmaps** with effort estimates
- 💬 **AI-Powered Chat Assistant** for interactive compliance guidance
- 📋 **Executive Report Generation** with PDF export
- 🎯 **Demo Mode** for instant exploration without API keys

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework with strict typing |
| Vite 6 | Build tool with HMR |
| Tailwind CSS v4 | Utility-first styling |
| Framer Motion | Animations and page transitions |
| Recharts + D3 | Data visualizations |
| Zustand | Lightweight state management |
| React Router v6 | Client-side routing |
| Lucide React | Icon system |
| jsPDF + html2canvas | PDF report generation |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | API server |
| TypeScript | Type-safe server code |
| Anthropic SDK | Claude AI integration |
| pdf-parse + mammoth | Document parsing |
| Multer | File upload handling |
| SSE (Server-Sent Events) | Real-time agent progress |

### AI
| Model | Usage |
|---|---|
| Claude claude-sonnet-4-20250514 | Agent analysis and compliance assessment |

---

## 📂 Project Structure

```
compliancegpt/
├── client/                      # React frontend
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── layout/          # Sidebar, Navbar, AppLayout
│   │   │   ├── dashboard/       # Score ring, KPI cards, chat
│   │   │   ├── analytics/       # Heatmap, gap matrix
│   │   │   ├── agents/          # Agent activity feed
│   │   │   └── reports/         # Remediation timeline
│   │   ├── pages/               # Route pages
│   │   ├── store/               # Zustand state store
│   │   ├── data/                # ISO standards + demo data
│   │   ├── hooks/               # Custom React hooks
│   │   ├── types/               # TypeScript interfaces
│   │   ├── utils/               # Helper functions
│   │   └── styles/              # Global CSS + design system
│   └── index.html
├── server/                      # Express backend
│   └── src/
│       ├── agents/              # AI agent runner + orchestrator
│       ├── routes/              # API route handlers
│       ├── services/            # Document parser, GenW.AI bridge
│       ├── middleware/          # File upload middleware
│       └── data/                # Standards data
├── docs/                        # Documentation
└── .env.example
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9
- Anthropic API key (optional — demo mode works without it)

### Installation

```bash
# Clone the repository
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
# Edit server/.env with your Anthropic API key
```

### Development

```bash
# Terminal 1: Start frontend
cd client
npm run dev

# Terminal 2: Start backend
cd server
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### Demo Mode

Click the **"Demo Mode"** toggle in the navbar to instantly load sample assessment data without requiring an API key or document uploads.

---

## 📖 Pages

| Page | Route | Description |
|---|---|---|
| Landing | `/` | Hero, features showcase, standards overview |
| Dashboard | `/dashboard` | KPIs, radar chart, heatmap, gap matrix, agent feed |
| Assessment | `/assessment` | 4-step wizard: profile → upload → AI processing → results |
| Standards | `/standards` | Standards library browser with clause-level detail |
| Agent Workflow | `/agents` | Visual agent orchestration diagram |
| Analytics | `/analytics` | Maturity trends, benchmarks, cross-standard analysis |
| Reports | `/reports` | Executive report with PDF export |
| Settings | `/settings` | API configuration, preferences |

---

## 🤖 AI Agent Architecture

ComplianceGPT employs a **multi-agent orchestration pattern**:

1. **Document Agent** — Parses and structures uploaded policy documents
2. **Bribery Risk Agent** — Evaluates ISO 37001 anti-bribery clauses
3. **Governance Agent** — Assesses ISO 37301 compliance management
4. **Security Agent** — Analyzes ISO 27001 information security controls
5. **Quality Agent** — Reviews ISO 9001 quality management processes
6. **Gap Analysis Agent** — Identifies cross-standard gaps and synergies
7. **Remediation Agent** — Generates phased remediation roadmaps

Agents are orchestrated sequentially: Document parsing → parallel standard assessments → gap analysis → remediation planning.

---

## 🔗 GenW.AI™ Integration

ComplianceGPT integrates with Deloitte's GenW.AI platform through:

| GenW.AI Module | ComplianceGPT Agent | Capability |
|---|---|---|
| Document Intelligence | Document Agent | Multi-format parsing |
| Risk Analytics Engine | Bribery Risk + Security Agents | Probabilistic scoring |
| Compliance Knowledge Graph | Governance + Quality Agents | Standards cross-referencing |
| Remediation Planning Engine | Remediation Agent | Phased roadmap generation |
| Audit Trail | All Agents | Immutable logging |

---

## 📊 Design System

- **Theme**: Dark-first with glassmorphism
- **Colors**: Navy primary (#0A0E1A), Deloitte Green accent (#00C389)
- **Typography**: Playfair Display (display), DM Sans (interface), JetBrains Mono (code)
- **Animations**: Framer Motion spring physics with staggered reveals

---

## 📝 License

Proprietary — Built for Deloitte Hacksplosion 2026

---

**ComplianceGPT™** — *Where AI Meets Compliance Excellence* 🛡️
