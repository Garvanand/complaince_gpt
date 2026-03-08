import {
  Activity,
  BarChart3,
  BookOpen,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  LibraryBig,
  ShieldCheck,
  Siren,
  Target,
  Workflow,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

export interface NavigationItem {
  path: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

export interface NavigationSection {
  label: string;
  items: NavigationItem[];
}

export const navigationSections: NavigationSection[] = [
  {
    label: 'Workspace',
    items: [
      { path: '/dashboard', label: 'Dashboard', description: 'Executive posture and exposure summary', icon: LayoutDashboard },
      { path: '/assessment', label: 'Assessment', description: 'Run AI-led compliance assessments', icon: ClipboardCheck },
      { path: '/standards', label: 'Standards', description: 'Clause library, questionnaires, and compliance overlays', icon: BookOpen },
      { path: '/reports', label: 'Reports', description: 'Executive packs, findings, and downloadable outputs', icon: FileText },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { path: '/knowledge-base', label: 'Knowledge Base', description: 'Legal frameworks, maturity, and crosswalks', icon: LibraryBig },
      { path: '/risk-intelligence', label: 'Risk Intelligence', description: 'Benchmarking, top risks, and pressure indicators', icon: Siren },
      { path: '/control-library', label: 'Control Library', description: 'Control inventory mapped to clause coverage', icon: ShieldCheck },
      { path: '/analytics', label: 'Analytics', description: 'Trends, heatmaps, and portfolio analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Operations',
    items: [
      { path: '/agents', label: 'Agent Workflow', description: 'Orchestration design and pipeline outputs', icon: Workflow },
      { path: '/agent-monitoring', label: 'Agent Monitoring', description: 'Runtime execution state and activity logs', icon: Activity },
      { path: '/remediation-tracker', label: 'Remediation Tracker', description: 'Phased action plan and accountable owners', icon: Wrench },
      { path: '/settings', label: 'Settings', description: 'Environment configuration and workspace controls', icon: Target },
    ],
  },
];

export const navigationItems = navigationSections.flatMap((section) => section.items);

export const pageMetaByPath = Object.fromEntries(
  navigationItems.map((item) => [item.path, { title: item.label, subtitle: item.description }])
) as Record<string, { title: string; subtitle: string }>;