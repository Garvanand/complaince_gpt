import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Upload, Bot, FileText, Shield, Lock, BarChart3, Cog, ChevronRight } from 'lucide-react';
import { useCountUp, useInView } from '../hooks/useCountUp';
import ComplianceScoreRing from '../components/dashboard/ComplianceScoreRing';

const standards = [
  { code: 'ISO 37001', name: 'Anti-Bribery Management', focus: 'Bribery Prevention & Detection', clauses: 33, color: '#FF6B35' },
  { code: 'ISO 37301', name: 'Compliance Management', focus: 'Regulatory Compliance', clauses: 28, color: '#00C389' },
  { code: 'ISO 27001', name: 'Information Security', focus: 'Data Protection & Cybersecurity', clauses: 24, color: '#4A90FF' },
  { code: 'ISO 9001', name: 'Quality Management', focus: 'Process Excellence & QA', clauses: 28, color: '#FFD32A' },
];

const steps = [
  { icon: Upload, title: 'Upload Policy Documents', desc: 'Drag & drop your governance policies, procedures, and manuals in PDF or DOCX format.' },
  { icon: Bot, title: 'AI Agents Analyze', desc: 'Seven specialized agents powered by Claude simultaneously assess your documents against ISO clauses.' },
  { icon: FileText, title: 'Receive Intelligence Report', desc: 'Get detailed readiness scores, gap analysis, maturity levels, and a phased remediation roadmap.' },
];

const genwMapping = [
  { from: 'RealmAI', to: 'Document Intelligence', icon: FileText, desc: 'RAG-powered policy knowledge base' },
  { from: 'Agent Builder', to: 'Multi-Agent Orchestration', icon: Bot, desc: 'Visual agent workflow design' },
  { from: 'Playground', to: 'Analytics Dashboard', icon: BarChart3, desc: 'No-code interactive dashboards' },
  { from: 'App Maker', to: 'Client Portal', icon: Cog, desc: 'Rapid application deployment' },
];

function StatCard({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) {
  const { ref, inView } = useInView();
  const count = useCountUp(inView ? value : 0, 2000);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <div className="score-display text-4xl font-bold" style={{ color: 'var(--color-accent-400)' }}>
        {count}{suffix}
      </div>
      <div className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>{label}</div>
    </motion.div>
  );
}

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-primary-900)' }}>
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden mesh-gradient">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating badges */}
        {standards.map((s, i) => (
          <motion.div
            key={s.code}
            className="absolute glass px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ color: s.color, left: `${15 + i * 20}%`, top: `${20 + (i % 2) * 50}%` }}
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
          >
            {s.code}
          </motion.div>
        ))}

        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass px-4 py-1.5 rounded-full text-xs font-medium mb-8"
            style={{ color: 'var(--color-accent-400)' }}
          >
            Built on Deloitte GenW.AI™ Platform
          </motion.div>

          {/* Score ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <ComplianceScoreRing score={87} maturityLevel={4} size={160} label="Demo Score" delay={500} />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display text-6xl md:text-7xl font-bold mb-4"
            style={{ color: 'var(--color-text-primary)' }}
          >
            ComplianceGPT<span style={{ color: 'var(--color-accent-500)' }}>™</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl mb-8 max-w-2xl"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            AI-Powered Multi-Standard Governance Intelligence
          </motion.p>

          {/* Cycling standards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-3 mb-10 text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {standards.map((s, i) => (
              <span key={s.code}>
                <span style={{ color: s.color }}>{s.code}</span>
                {i < standards.length - 1 && <span className="mx-3">·</span>}
              </span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-4"
          >
            <button onClick={() => navigate('/assessment')} className="btn-glow flex items-center gap-2 text-lg px-8 py-4">
              Start Assessment <ArrowRight size={20} />
            </button>
            <button onClick={() => navigate('/dashboard')} className="btn-ghost flex items-center gap-2 text-lg px-8 py-4">
              View Demo
            </button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronRight size={24} className="rotate-90" style={{ color: 'var(--color-text-muted)' }} />
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6" style={{ background: 'var(--color-primary-800)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCard value={500} suffix="+" label="Organizations Assessed" delay={0} />
          <StatCard value={37} suffix="+" label="Standards Covered" delay={200} />
          <StatCard value={80} suffix="%" label="Reduction in Assessment Time" delay={400} />
          <StatCard value={2} suffix="hrs" label="Average Assessment Duration" delay={600} />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="section-label">How It Works</span>
            <h2 className="font-display text-4xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Three Steps to Compliance Intelligence
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px"
              style={{ background: 'linear-gradient(90deg, transparent, var(--color-accent-500), var(--color-accent-500), transparent)', opacity: 0.3 }}
            />
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="glass-card text-center relative"
              >
                <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center pulse-glow"
                  style={{ background: 'linear-gradient(135deg, var(--color-accent-500), var(--color-accent-400))' }}
                >
                  <step.icon size={24} className="text-[var(--color-primary-900)]" />
                </div>
                <div className="text-xs font-bold mb-2" style={{ color: 'var(--color-accent-500)' }}>
                  STEP {i + 1}
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>{step.title}</h3>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Standards Showcase */}
      <section className="py-24 px-6" style={{ background: 'var(--color-primary-800)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="section-label">Standards Coverage</span>
            <h2 className="font-display text-4xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Multi-Standard Intelligence
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {standards.map((s, i) => (
              <motion.div
                key={s.code}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, boxShadow: `0 20px 40px ${s.color}15` }}
                className="glass-card cursor-pointer group"
              >
                <div className="text-2xl font-bold mb-1 font-display" style={{ color: s.color }}>{s.code}</div>
                <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>{s.name}</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>{s.focus}</p>
                <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--glass-border)' }}>
                  <span className="score-display text-sm font-bold" style={{ color: s.color }}>{s.clauses} Clauses</span>
                  <ArrowRight size={16} style={{ color: 'var(--color-text-muted)' }} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GenW.AI Integration */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="section-label">Platform Integration</span>
            <h2 className="font-display text-4xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Built for GenW.AI™
            </h2>
            <p className="mt-3 text-lg" style={{ color: 'var(--color-text-secondary)' }}>
              Native deployment on Deloitte's enterprise AI platform
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {genwMapping.map((item, i) => (
              <motion.div
                key={item.from}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(0, 195, 137, 0.1)' }}
                >
                  <item.icon size={22} style={{ color: 'var(--color-accent-500)' }} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold" style={{ color: 'var(--color-accent-400)' }}>
                      GenW {item.from}
                    </span>
                    <ArrowRight size={14} style={{ color: 'var(--color-text-muted)' }} />
                    <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                      {item.to}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center" style={{ borderTop: '1px solid var(--glass-border)' }}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield size={18} style={{ color: 'var(--color-accent-500)' }} />
          <span className="font-display text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
            ComplianceGPT™
          </span>
        </div>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          From Policy to Proof — Built on GenW.AI™ | Hacksplosion 2026
        </p>
      </footer>
    </div>
  );
}
