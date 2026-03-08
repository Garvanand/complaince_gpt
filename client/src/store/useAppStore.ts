import { create } from 'zustand';
import type {
  AssessmentResult,
  OrgProfile,
  AgentStatus,
  AgentLogEntry,
  ChatMessage,
  StandardCode,
} from '../types';
import { demoAssessmentResult } from '../data/demo-data';

interface AppState {
  // Assessment
  currentAssessment: AssessmentResult | null;
  assessmentHistory: AssessmentResult[];
  isAssessing: boolean;
  assessmentStep: number;

  // Organization profile
  orgProfile: OrgProfile;
  selectedStandards: StandardCode[];

  // Agent tracking
  agentStatuses: AgentStatus[];
  agentLog: AgentLogEntry[];

  // Chat
  chatMessages: ChatMessage[];
  isChatOpen: boolean;

  // UI
  isDemoMode: boolean;
  sidebarCollapsed: boolean;

  // Actions
  setAssessment: (result: AssessmentResult) => void;
  setIsAssessing: (v: boolean) => void;
  setAssessmentStep: (step: number) => void;
  setOrgProfile: (profile: Partial<OrgProfile>) => void;
  setSelectedStandards: (standards: StandardCode[]) => void;
  addAgentLog: (entry: AgentLogEntry) => void;
  updateAgentStatus: (name: string, update: Partial<AgentStatus>) => void;
  resetAgentStatuses: () => void;
  addChatMessage: (msg: ChatMessage) => void;
  toggleChat: () => void;
  toggleDemoMode: () => void;
  loadDemoData: () => void;
  toggleSidebar: () => void;
  resetAssessment: () => void;
}

const defaultAgentStatuses: AgentStatus[] = [
  { name: 'Document Agent', status: 'idle', progress: 0, currentAction: '' },
  { name: 'Bribery Risk Agent', status: 'idle', progress: 0, currentAction: '' },
  { name: 'Governance Agent', status: 'idle', progress: 0, currentAction: '' },
  { name: 'Security Agent', status: 'idle', progress: 0, currentAction: '' },
  { name: 'Quality Agent', status: 'idle', progress: 0, currentAction: '' },
  { name: 'Gap Analysis Agent', status: 'idle', progress: 0, currentAction: '' },
  { name: 'Remediation Agent', status: 'idle', progress: 0, currentAction: '' },
];

export const useAppStore = create<AppState>((set) => ({
  currentAssessment: null,
  assessmentHistory: [],
  isAssessing: false,
  assessmentStep: 0,
  orgProfile: {
    companyName: '',
    industrySector: '',
    employeeCount: '',
    assessmentScope: 'full',
  },
  selectedStandards: [],
  agentStatuses: [...defaultAgentStatuses],
  agentLog: [],
  chatMessages: [],
  isChatOpen: false,
  isDemoMode: false,
  sidebarCollapsed: false,

  setAssessment: (result) =>
    set((s) => ({
      currentAssessment: result,
      assessmentHistory: [...s.assessmentHistory, result],
      isAssessing: false,
    })),

  setIsAssessing: (v) => set({ isAssessing: v }),
  setAssessmentStep: (step) => set({ assessmentStep: step }),

  setOrgProfile: (profile) =>
    set((s) => ({ orgProfile: { ...s.orgProfile, ...profile } })),

  setSelectedStandards: (standards) => set({ selectedStandards: standards }),

  addAgentLog: (entry) =>
    set((s) => ({ agentLog: [...s.agentLog, entry] })),

  updateAgentStatus: (name, update) =>
    set((s) => ({
      agentStatuses: s.agentStatuses.map((a) =>
        a.name === name ? { ...a, ...update } : a
      ),
    })),

  resetAgentStatuses: () => set({ agentStatuses: [...defaultAgentStatuses], agentLog: [] }),

  addChatMessage: (msg) =>
    set((s) => ({ chatMessages: [...s.chatMessages, msg] })),

  toggleChat: () => set((s) => ({ isChatOpen: !s.isChatOpen })),

  toggleDemoMode: () =>
    set((s) => {
      if (!s.isDemoMode) {
        return { isDemoMode: true, currentAssessment: demoAssessmentResult };
      }
      return { isDemoMode: false, currentAssessment: null };
    }),

  loadDemoData: () =>
    set({
      isDemoMode: true,
      currentAssessment: demoAssessmentResult,
      orgProfile: {
        companyName: 'Acme Corp Financial Services',
        industrySector: 'Financial Services',
        employeeCount: '1000-5000',
        assessmentScope: 'full',
      },
      selectedStandards: ['ISO37001', 'ISO37301', 'ISO27001', 'ISO9001'],
    }),

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  resetAssessment: () =>
    set({
      currentAssessment: null,
      isAssessing: false,
      assessmentStep: 0,
      agentStatuses: [...defaultAgentStatuses],
      agentLog: [],
    }),
}));
