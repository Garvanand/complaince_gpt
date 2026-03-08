import { motion } from 'framer-motion';
import { FileText, Bot, Search, Scale, Shield, Award, GitBranch, Wrench, ArrowRight, ShieldCheck } from 'lucide-react';

const agents = [
  { name: 'Document Agent', icon: Search, module: 'GenW RealmAI', input: 'Raw policy documents (PDF, DOCX)', output: 'Structured policy sections, controls, evidence artifacts', color: '#00ABBD', desc: 'Parses and structures compliance-relevant content from uploaded policy documents using NLP.' },
  { name: 'Bribery Risk Agent', icon: Scale, module: 'GenW Agent Builder', input: 'Parsed document content, Org profile', output: 'ISO 37001 clause scores, evidence, gaps', color: '#DD6B20', desc: 'Specialist agent for ISO 37001:2025 Anti-Bribery Management Systems assessment.' },
  { name: 'Governance Agent', icon: Shield, module: 'GenW Agent Builder', input: 'Parsed document content, Org profile', output: 'ISO 37301 clause scores, evidence, gaps', color: '#86BC25', desc: 'Evaluates compliance management systems against ISO 37301:2021 requirements.' },
  { name: 'Security Agent', icon: Shield, module: 'GenW Agent Builder', input: 'Parsed document content, Org profile', output: 'ISO 27001 clause scores, evidence, gaps', color: '#00ABBD', desc: 'Assesses information security management against ISO 27001:2022 controls.' },
  { name: 'Quality Agent', icon: Award, module: 'GenW Agent Builder', input: 'Parsed document content, Org profile', output: 'ISO 9001 clause scores, evidence, gaps', color: '#FFD32A', desc: 'Reviews quality management systems against ISO 9001:2015 requirements.' },
  { name: 'Gap Analysis Agent', icon: GitBranch, module: 'GenW Agent Builder', input: 'All standard assessment results', output: 'Prioritized gaps, cross-standard overlaps, effort estimates', color: '#E53E3E', desc: 'Cross-standard gap analyser that identifies prioritized gaps and overlap opportunities.' },
  { name: 'Evidence Validation Agent', icon: ShieldCheck, module: 'GenW Evidence Engine', input: 'Clause scores, evidence citations, gap analysis', output: 'Evidence sufficiency ratings, quality scores, cross-standard reuse map', color: '#0076A8', desc: 'Validates whether cited evidence actually supports compliance claims. Checks sufficiency, quality (direct/indirect/anecdotal), chain of custody, and identifies cross-standard evidence reuse opportunities.' },
  { name: 'Remediation Agent', icon: Wrench, module: 'GenW Agent Builder', input: 'Gap analysis results, Org profile', output: 'Phased remediation roadmap with actions', color: '#A8D048', desc: 'Generates a consultant-quality phased remediation roadmap with specific actions.' },
];

export default function AgentWorkflow() {
  return (
    <div className="space-y-8">
      {/* Flow diagram */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
      >
        <span className="section-label">Agent Orchestration</span>
        <h2 className="font-display text-2xl font-bold mb-8" style={{ color: 'var(--color-text-primary)' }}>
          Multi-Agent Workflow
        </h2>

        <div className="flex flex-col items-center gap-4">
          {/* Document Agent */}
          <AgentNode agent={agents[0]} />
          <FlowArrow />

          {/* Parallel agents */}
          <div className="flex flex-wrap justify-center gap-4">
            {agents.slice(1, 5).map((a) => (
              <AgentNode key={a.name} agent={a} />
            ))}
          </div>
          <FlowArrow />

          {/* Gap Analysis */}
          <AgentNode agent={agents[5]} />
          <FlowArrow />

          {/* Evidence Validation */}
          <AgentNode agent={agents[6]} />
          <FlowArrow />

          {/* Remediation */}
          <AgentNode agent={agents[7]} />
        </div>
      </motion.div>

      {/* Agent cards */}
      <div>
        <span className="section-label">Agent Details</span>
        <h2 className="font-display text-2xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
          Specialized AI Agents
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${agent.color}15`, color: agent.color }}
                >
                  <agent.icon size={22} />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>{agent.name}</h3>
                  <p className="text-sm mt-1 mb-3" style={{ color: 'var(--color-text-secondary)' }}>{agent.desc}</p>

                  <div className="space-y-2">
                    <InfoRow label="GenW.AI Module" value={agent.module} />
                    <InfoRow label="Input" value={agent.input} />
                    <InfoRow label="Output" value={agent.output} />
                    <InfoRow label="Model" value="claude-opus-4-5" />
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Status:</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(134, 188, 37, 0.15)', color: 'var(--color-accent-500)' }}>
                        Ready
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AgentNode({ agent }: { agent: typeof agents[number] }) {
  return (
    <div
      className="flex items-center gap-3 px-5 py-3 rounded-2xl transition-all hover:scale-105"
      style={{
        background: `${agent.color}10`,
        border: `1px solid ${agent.color}30`,
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: `${agent.color}20`, color: agent.color }}
      >
        <agent.icon size={18} />
      </div>
      <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{agent.name}</span>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-px h-6" style={{ background: 'var(--color-accent-500)', opacity: 0.4 }} />
      <ArrowRight size={14} className="rotate-90" style={{ color: 'var(--color-accent-500)', opacity: 0.6 }} />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-xs flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>{label}:</span>
      <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{value}</span>
    </div>
  );
}
