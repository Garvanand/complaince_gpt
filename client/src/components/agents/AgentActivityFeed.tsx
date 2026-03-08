import { motion } from 'framer-motion';
import { Search, Bot, Scale, Shield, Award, GitBranch, Wrench, Clock } from 'lucide-react';

const feedItems = [
  { agent: 'Document Agent', icon: Search, message: 'Parsed Section 4.2 of Acme Corp Anti-Bribery Policy.pdf', time: '2 min ago', color: '#00ABBD' },
  { agent: 'Bribery Risk Agent', icon: Scale, message: 'Scored Clause 6.1: 33% (Planned) — Risk actions not yet implemented', time: '3 min ago', color: '#DD6B20' },
  { agent: 'Governance Agent', icon: Shield, message: 'Compliance function assessment complete — Level 3 maturity', time: '5 min ago', color: '#86BC25' },
  { agent: 'Security Agent', icon: Shield, message: 'IS risk treatment gap identified — Critical priority', time: '7 min ago', color: '#00ABBD' },
  { agent: 'Quality Agent', icon: Award, message: 'QMS process maturity at 74% — Design controls gap noted', time: '8 min ago', color: '#FFD32A' },
  { agent: 'Gap Analysis Agent', icon: GitBranch, message: 'Identified 12 gaps across 4 standards — 5 critical', time: '10 min ago', color: '#E53E3E' },
  { agent: 'Remediation Agent', icon: Wrench, message: 'Generated 9-action remediation roadmap across 3 phases', time: '12 min ago', color: '#A8D048' },
];

export default function AgentActivityFeed() {
  return (
    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2">
      {feedItems.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-start gap-3 p-3 rounded-xl transition-all hover:bg-[var(--color-primary-700)]"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `${item.color}15`, color: item.color }}
          >
            <item.icon size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-bold" style={{ color: item.color }}>{item.agent}</span>
            </div>
            <p className="text-sm truncate" style={{ color: 'var(--color-text-secondary)' }}>{item.message}</p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Clock size={12} style={{ color: 'var(--color-text-muted)' }} />
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{item.time}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
