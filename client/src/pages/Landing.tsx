import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Upload, Bot, FileText, Shield, BarChart3, Cog, ChevronDown, CheckCircle2 } from 'lucide-react';

const standards = [
  { code: 'ISO 37001', name: 'Anti-Bribery Management', focus: 'Bribery Prevention & Detection', clauses: 33, color: '#DD6B20' },
  { code: 'ISO 37301', name: 'Compliance Management', focus: 'Regulatory Compliance', clauses: 28, color: '#86BC25' },
  { code: 'ISO 27001', name: 'Information Security', focus: 'Data Protection & Cybersecurity', clauses: 24, color: '#00ABBD' },
  { code: 'ISO 9001', name: 'Quality Management', focus: 'Process Excellence & QA', clauses: 28, color: '#FFD32A' },
];

const steps = [
  { icon: Upload, title: 'Upload Policy Documents', desc: 'Drag & drop your governance policies, procedures, and manuals in PDF or DOCX format.' },
  { icon: Bot, title: 'AI Agents Analyze', desc: 'Seven specialized agents powered by Claude simultaneously assess your documents against ISO clauses.' },
  { icon: FileText, title: 'Receive Intelligence Report', desc: 'Get detailed scores, gap analysis, maturity levels, and a phased remediation roadmap.' },
];

const genwMapping = [
  { from: 'RealmAI', to: 'Document Intelligence', icon: FileText, desc: 'RAG-powered policy knowledge base' },
  { from: 'Agent Builder', to: 'Multi-Agent Orchestration', icon: Bot, desc: 'Visual agent workflow design' },
  { from: 'Playground', to: 'Analytics Dashboard', icon: BarChart3, desc: 'No-code interactive dashboards' },
  { from: 'App Maker', to: 'Client Portal', icon: Cog, desc: 'Rapid application deployment' },
];

const previewScores = [
  { code: 'ISO 37001', score: 87, color: '#DD6B20' },
  { code: 'ISO 37301', score: 92, color: '#86BC25' },
  { code: 'ISO 27001', score: 78, color: '#00ABBD' },
  { code: 'ISO 9001', score: 84, color: '#FFD32A' },
];

const stats = [
  { value: '500+', label: 'Organizations Assessed' },
  { value: '37+', label: 'Standards Covered' },
  { value: '80%', label: 'Faster Assessments' },
  { value: '<2hrs', label: 'Average Duration' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#05080F] text-white">
      {/* ── Fixed Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-50 h-16 bg-[#05080F]/80 backdrop-blur-xl border-b border-white/[0.06] flex items-center px-8">
        <div className="flex items-center gap-2.5">
          <Shield className="w-5 h-5 text-[#86BC25]" />
          <span className="font-display text-base font-bold tracking-tight">ComplianceGPT</span>
          <span className="text-[#86BC25] text-base font-bold">™</span>
        </div>
        <span className="ml-3 text-[10px] text-[#4A5568] font-medium tracking-widest uppercase border border-white/[0.08] rounded px-2 py-0.5">
          GenW.AI Platform
        </span>
        <div className="flex-1" />
        <div className="hidden md:flex items-center gap-8 text-sm text-[#8C9BAE]">
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#standards" className="hover:text-white transition-colors">Standards</a>
          <a href="#platform" className="hover:text-white transition-colors">Platform</a>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="ml-8 bg-[#86BC25] hover:bg-[#A8D048] text-white font-bold text-sm px-5 py-2 rounded-xl transition-all shadow-[0_0_20px_rgba(134,188,37,0.25)]"
        >
          Launch App
        </button>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden">
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />
        {/* Green glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#86BC25]/[0.06] blur-[120px]" />

        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl">
          {/* Badge row */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <span className="bg-white/[0.04] border border-white/[0.08] text-[#86BC25] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
              Built on GenW.AI™
            </span>
            <span className="bg-white/[0.04] border border-white/[0.08] text-[#8C9BAE] text-xs font-medium px-3 py-1.5 rounded-full">
              Hacksplosion 2026
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] mb-5"
          >
            AI-Powered<br />
            <span className="text-[#86BC25]">Multi-Standard</span> Governance<br />
            Intelligence
          </motion.h1>

          {/* Standards pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex flex-wrap justify-center gap-2 mb-8"
          >
            {standards.map(s => (
              <span key={s.code} className="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.08] rounded-full px-3 py-1 text-xs font-medium" style={{ color: s.color }}>
                <CheckCircle2 className="w-3 h-3" />
                {s.code}
              </span>
            ))}
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-[#8C9BAE] text-lg md:text-xl max-w-2xl mb-10"
          >
            Upload your governance documents. Seven AI agents simultaneously assess compliance 
            across ISO 37001, 37301, 27001 & 9001 — delivering instant readiness intelligence.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4 mb-16"
          >
            <button
              onClick={() => navigate('/assessment')}
              className="flex items-center gap-2 bg-[#86BC25] hover:bg-[#A8D048] text-white font-bold text-base px-8 py-4 rounded-2xl transition-all shadow-[0_0_30px_rgba(134,188,37,0.3)] hover:shadow-[0_0_40px_rgba(134,188,37,0.5)]"
            >
              Start Assessment <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.18] text-white font-medium text-base px-8 py-4 rounded-2xl transition-all"
            >
              View Demo
            </button>
          </motion.div>

          {/* Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full max-w-2xl bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-white font-bold text-sm">Compliance Overview</p>
                <p className="text-[#4A5568] text-xs">Sample multi-standard assessment</p>
              </div>
              <span className="text-[#86BC25] bg-[#86BC25]/10 text-xs font-bold px-3 py-1 rounded-full">LIVE PREVIEW</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {previewScores.map(s => (
                <div key={s.code} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-center">
                  <p className="text-[#4A5568] text-[10px] font-bold uppercase tracking-wider mb-2">{s.code}</p>
                  <p className="text-3xl font-bold font-mono" style={{ color: s.color }}>{s.score}%</p>
                  <div className="mt-2 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: s.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${s.score}%` }}
                      transition={{ delay: 0.8, duration: 1.2, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-12"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-5 h-5 text-[#4A5568]" />
        </motion.div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="py-12 px-6 bg-white/[0.02] border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl font-bold font-mono text-[#86BC25]">{s.value}</div>
              <div className="text-xs text-[#4A5568] mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#86BC25] text-xs font-bold uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Three Steps to Compliance Intelligence
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-[#86BC25]/30 to-transparent" />
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 text-center relative"
              >
                <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center bg-[#86BC25] shadow-[0_0_30px_rgba(134,188,37,0.3)]">
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-[#86BC25] text-[10px] font-bold uppercase tracking-widest mb-2">Step {i + 1}</p>
                <h3 className="text-base font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-[#8C9BAE]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Standards Showcase ── */}
      <section id="standards" className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#86BC25] text-xs font-bold uppercase tracking-widest mb-3">Standards Coverage</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Multi-Standard Intelligence
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {standards.map((s, i) => (
              <motion.div
                key={s.code}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 hover:border-white/[0.15] transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xl font-bold font-display" style={{ color: s.color }}>{s.code}</p>
                    <p className="text-sm font-semibold text-white mt-0.5">{s.name}</p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-white/[0.04]" style={{ color: s.color }}>
                    {s.clauses} clauses
                  </span>
                </div>
                <p className="text-sm text-[#8C9BAE]">{s.focus}</p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-[#4A5568] group-hover:text-white transition-colors">
                  Explore clauses <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GenW.AI Integration ── */}
      <section id="platform" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#86BC25] text-xs font-bold uppercase tracking-widest mb-3">Platform Integration</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
              Built for GenW.AI™
            </h2>
            <p className="text-[#8C9BAE] text-lg">Native deployment on Deloitte's enterprise AI platform</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {genwMapping.map((item, i) => (
              <motion.div
                key={item.from}
                initial={{ opacity: 0, x: i % 2 === 0 ? -16 : 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#86BC25]/10">
                  <item.icon className="w-5 h-5 text-[#86BC25]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-[#86BC25]">GenW {item.from}</span>
                    <ArrowRight className="w-3 h-3 text-[#4A5568]" />
                    <span className="text-sm font-semibold text-white">{item.to}</span>
                  </div>
                  <p className="text-sm text-[#8C9BAE]">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#86BC25]/[0.08] to-transparent border border-[#86BC25]/20 rounded-3xl p-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Compliance?
            </h2>
            <p className="text-[#8C9BAE] text-lg mb-8 max-w-xl mx-auto">
              Join 500+ organizations using AI-powered governance intelligence to go from policy to proof.
            </p>
            <button
              onClick={() => navigate('/assessment')}
              className="inline-flex items-center gap-2 bg-[#86BC25] hover:bg-[#A8D048] text-white font-bold text-base px-10 py-4 rounded-2xl transition-all shadow-[0_0_30px_rgba(134,188,37,0.3)] hover:shadow-[0_0_40px_rgba(134,188,37,0.5)]"
            >
              Start Your Assessment <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 px-6 text-center border-t border-white/[0.06]">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-[#86BC25]" />
          <span className="font-display text-sm font-bold">ComplianceGPT™</span>
        </div>
        <p className="text-[#4A5568] text-xs">
          From Policy to Proof — Built on GenW.AI™ | Hacksplosion 2026
        </p>
      </footer>
    </div>
  );
}
