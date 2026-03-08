# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (React)                     │
│  ┌──────────┐ ┌──────────┐ ┌───────────┐           │
│  │  Zustand  │ │  Router  │ │  Framer   │           │
│  │  Store    │ │  v6      │ │  Motion   │           │
│  └────┬─────┘ └────┬─────┘ └───────────┘           │
│       │             │                                │
│  ┌────┴─────────────┴────────────────────┐          │
│  │         Page Components                │          │
│  │  Landing │ Dashboard │ Assessment      │          │
│  │  Standards │ AgentWorkflow │ Analytics │          │
│  │  Reports │ Settings                    │          │
│  └────┬──────────────────────────────────┘          │
│       │ Axios + SSE                                  │
└───────┼─────────────────────────────────────────────┘
        │ HTTP/SSE (port 5173 → proxy → 3001)
┌───────┼─────────────────────────────────────────────┐
│       │          SERVER (Express)                     │
│  ┌────┴──────────────────────────────────┐          │
│  │           Route Handlers               │          │
│  │  /api/assessment │ /api/chat           │          │
│  │  /api/standards  │ /api/upload         │          │
│  │  /api/report     │ /api/demo           │          │
│  └────┬──────────────────────────────────┘          │
│       │                                              │
│  ┌────┴──────────────────────────────────┐          │
│  │         Agent Orchestrator             │          │
│  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐    │          │
│  │  │ Doc │ │Brib │ │ Gov │ │ Sec │    │          │
│  │  │Agent│ │Agent│ │Agent│ │Agent│    │          │
│  │  └─────┘ └─────┘ └─────┘ └─────┘    │          │
│  │  ┌─────┐ ┌──────┐ ┌───────┐         │          │
│  │  │Qual │ │ Gap  │ │Remed  │         │          │
│  │  │Agent│ │Agent │ │Agent  │         │          │
│  │  └─────┘ └──────┘ └───────┘         │          │
│  └────┬──────────────────────────────────┘          │
│       │                                              │
│  ┌────┴──────────────────────────────────┐          │
│  │         Services                       │          │
│  │  DocumentParser │ GenWAIBridge         │          │
│  └────┬──────────────────────────────────┘          │
│       │                                              │
└───────┼─────────────────────────────────────────────┘
        │
┌───────┼─────────────────────────────────────────────┐
│       │       EXTERNAL SERVICES                      │
│  ┌────┴──────┐  ┌────────────┐                      │
│  │ Anthropic │  │  GenW.AI™  │                      │
│  │   Claude  │  │  Platform  │                      │
│  └───────────┘  └────────────┘                      │
└─────────────────────────────────────────────────────┘
```

## Data Flow

### Assessment Flow
1. User fills org profile + selects standards
2. User uploads policy documents (PDF/DOCX/TXT)
3. Client POSTs to `/api/assessment/start`
4. Server returns `assessmentId` and begins async processing
5. Client connects to `/api/assessment/:id/stream` via SSE
6. Orchestrator runs 7 agents sequentially/parallel
7. Each agent event streamed to client in real-time
8. Final results stored and sent via SSE `complete` event
9. Client renders Dashboard with full results

### State Management
- **Zustand** store manages client-side state
- Assessment results persisted in store after completion
- Demo mode loads pre-computed results without API calls
- Chat messages managed in store with assistant responses

## Key Design Decisions

1. **SSE over WebSocket**: Simpler protocol for unidirectional server→client streaming
2. **Zustand over Redux**: Minimal boilerplate for hackathon speed
3. **Express 5**: Latest stable with improved TypeScript support
4. **Vite 6**: Fastest possible HMR for development
5. **Tailwind CSS v4**: Native CSS variables, no PostCSS config needed
6. **Glassmorphism UI**: Premium enterprise aesthetic matching Deloitte branding
