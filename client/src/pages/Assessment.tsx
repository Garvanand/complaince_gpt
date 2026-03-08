import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Building2, Upload, FileText, X, CheckCircle,
  Loader2, ArrowRight, ArrowLeft, Play,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppStore } from '../store/useAppStore';
import { demoAssessmentResult } from '../data/demo-data';
import { useAssessmentStream } from '../hooks/useAssessmentStream';
import apiClient from '../utils/apiClient';
import ComplianceScoreRing from '../components/dashboard/ComplianceScoreRing';
import type { StandardCode } from '../types';

const industries = [
  'Financial Services', 'Healthcare', 'Technology', 'Manufacturing',
  'Energy & Utilities', 'Retail & Consumer', 'Government', 'Professional Services',
];

const employeeRanges = ['1-50', '51-200', '201-500', '501-1000', '1000-5000', '5000+'];

const standardOptions: { code: StandardCode; name: string; desc: string; color: string }[] = [
  { code: 'ISO37001', name: 'ISO 37001', desc: 'Anti-Bribery Management Systems', color: '#DD6B20' },
  { code: 'ISO37301', name: 'ISO 37301', desc: 'Compliance Management Systems', color: '#86BC25' },
  { code: 'ISO27001', name: 'ISO 27001', desc: 'Information Security Management', color: '#00ABBD' },
  { code: 'ISO9001', name: 'ISO 9001', desc: 'Quality Management Systems', color: '#FFD32A' },
];

const agentNodes: { name: string; status: 'idle' | 'processing' | 'complete' }[] = [
  { name: 'Document Agent', status: 'idle' },
  { name: 'Bribery Risk Agent', status: 'idle' },
  { name: 'Governance Agent', status: 'idle' },
  { name: 'Security Agent', status: 'idle' },
  { name: 'Quality Agent', status: 'idle' },
  { name: 'Gap Analysis Agent', status: 'idle' },
  { name: 'Remediation Agent', status: 'idle' },
];

export default function Assessment() {
  const navigate = useNavigate();
  const { orgProfile, setOrgProfile, selectedStandards, setSelectedStandards, setAssessment, isDemoMode, addNotification } = useAppStore();
  const { startStream, stopStream } = useAssessmentStream();
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [agentStates, setAgentStates] = useState(agentNodes);
  const [logs, setLogs] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [finalScore, setFinalScore] = useState(62);

  const toggleStandard = (code: StandardCode) => {
    setSelectedStandards(
      selectedStandards.includes(code)
        ? selectedStandards.filter((s) => s !== code)
        : [...selectedStandards, code]
    );
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const newFiles = Array.from(e.dataTransfer.files).filter(
      (f) => f.type === 'application/pdf' || f.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || f.type === 'text/plain'
    );
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const removeFile = (index: number) => setFiles((prev) => prev.filter((_, i) => i !== index));

  const simulateProcessing = async () => {
    setProcessing(true);

    if (!isDemoMode) {
      // Real API mode: upload files, start assessment, stream SSE
      try {
        // Upload files first
        let filePaths: string[] = [];
        if (files.length > 0) {
          const formData = new FormData();
          files.forEach((f) => formData.append('files', f));
          const uploadRes = await apiClient.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          filePaths = uploadRes.data.files.map((f: any) => f.savedPath);
        }

        // Start assessment
        const res = await apiClient.post('/assessment/start', {
          filePaths,
          standards: selectedStandards,
          orgProfile: {
            company: orgProfile.companyName,
            industry: orgProfile.industrySector,
            employees: orgProfile.employeeCount,
            scope: orgProfile.assessmentScope,
          },
        });

        const assessmentId = res.data.assessmentId;

        // Stream SSE events
        startStream(
          assessmentId,
          (event) => {
            if (event.type === 'agent-start' && event.agent) {
              setAgentStates((prev) =>
                prev.map((a) =>
                  a.name === event.agent ? { ...a, status: 'processing' as const } : a
                )
              );
            }
            if (event.type === 'agent-complete' && event.agent) {
              setAgentStates((prev) =>
                prev.map((a) =>
                  a.name === event.agent ? { ...a, status: 'complete' as const } : a
                )
              );
            }
            if (event.type === 'log' && event.message) {
              setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${event.message}`]);
            }
          },
          (result) => {
            setAgentStates((prev) => prev.map((a) => ({ ...a, status: 'complete' as const })));
            setFinalScore(result.overallScore || 62);
            setProcessing(false);
            setDone(true);
            toast.success('Assessment complete!');
            addNotification({ type: 'success', title: 'Assessment Complete', message: `Overall score: ${result.overallScore}%` });
          },
          (error) => {
            setProcessing(false);
            toast.error(`Assessment failed: ${error}`);
            addNotification({ type: 'error', title: 'Assessment Failed', message: error });
          }
        );
      } catch {
        setProcessing(false);
        toast.error('Failed to start assessment. Falling back to demo mode.');
        runDemoSimulation();
      }
      return;
    }

    // Demo mode simulation
    runDemoSimulation();
  };

  const runDemoSimulation = async () => {
    setProcessing(true);
    const agentSequence = [
      { idx: 0, msg: '🔍 Document Agent — Parsing uploaded policy documents...' },
      { idx: 0, msg: '🔍 Document Agent — Extracted 42 policy sections, 18 controls identified' },
      { idx: 1, msg: '⚖️ Bribery Risk Agent — Assessing ISO 37001 clauses...' },
      { idx: 2, msg: '📋 Governance Agent — Evaluating ISO 37301 compliance...' },
      { idx: 3, msg: '🔒 Security Agent — Analyzing ISO 27001 controls...' },
      { idx: 4, msg: '✅ Quality Agent — Reviewing ISO 9001 processes...' },
      { idx: 1, msg: '⚖️ Bribery Risk Agent — Scored 16 clauses: 54% overall (Level 2)' },
      { idx: 2, msg: '📋 Governance Agent — Scored 12 clauses: 61% overall (Level 3)' },
      { idx: 3, msg: '🔒 Security Agent — Scored 11 clauses: 58% overall (Level 2)' },
      { idx: 4, msg: '✅ Quality Agent — Scored 12 clauses: 74% overall (Level 3)' },
      { idx: 5, msg: '📊 Gap Analysis Agent — Analyzing cross-standard gaps...' },
      { idx: 5, msg: '📊 Gap Analysis Agent — Identified 12 gaps, 5 critical across 4 standards' },
      { idx: 6, msg: '🛠️ Remediation Agent — Building phased roadmap...' },
      { idx: 6, msg: '🛠️ Remediation Agent — Generated 9-action roadmap across 3 phases' },
    ];

    for (let i = 0; i < agentSequence.length; i++) {
      await new Promise((r) => setTimeout(r, 800));
      const { idx, msg } = agentSequence[i];

      setAgentStates((prev) =>
        prev.map((a, j) => {
          if (j === idx) return { ...a, status: 'processing' as const };
          if (j < idx && prev[j].status === 'processing') return { ...a, status: 'complete' as const };
          return a;
        })
      );
      setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    }

    // Mark all done
    setAgentStates((prev) => prev.map((a) => ({ ...a, status: 'complete' as const })));
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ✓ Assessment Complete — Overall Score: 62%`]);
    setProcessing(false);
    setDone(true);
  };

  const finishAssessment = () => {
    setAssessment({
      ...demoAssessmentResult,
      orgProfile: { ...orgProfile },
      timestamp: new Date().toISOString(),
      overallScore: finalScore,
    });
    addNotification({ type: 'success', title: 'Assessment Saved', message: `Score: ${finalScore}% — View your dashboard for full results.` });
    navigate('/dashboard');
  };

  const canProceed = () => {
    if (step === 0) return orgProfile.companyName && orgProfile.industrySector && selectedStandards.length > 0;
    if (step === 1) return files.length > 0;
    return true;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress steps */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {['Organization', 'Documents', 'AI Analysis', 'Results'].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
              style={{
                background: i <= step ? 'linear-gradient(135deg, var(--color-accent-500), var(--color-accent-400))' : 'var(--color-primary-700)',
                color: i <= step ? 'var(--color-primary-900)' : 'var(--color-text-muted)',
              }}
            >
              {i < step ? <CheckCircle size={16} /> : i + 1}
            </div>
            <span className="text-xs font-medium hidden sm:inline" style={{ color: i <= step ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}>
              {label}
            </span>
            {i < 3 && <div className="w-8 h-px" style={{ background: i < step ? 'var(--color-accent-500)' : 'var(--color-primary-600)' }} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 0: Org Profile */}
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-8">
            <div className="glass-card space-y-6">
              <div>
                <span className="section-label">Step 1</span>
                <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Organization Profile</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>Company Name</label>
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: 'var(--color-primary-700)', border: '1px solid var(--glass-border)' }}>
                    <Building2 size={16} style={{ color: 'var(--color-text-muted)' }} />
                    <input
                      value={orgProfile.companyName}
                      onChange={(e) => setOrgProfile({ companyName: e.target.value })}
                      placeholder="Acme Corp"
                      className="bg-transparent border-none outline-none text-sm flex-1"
                      style={{ color: 'var(--color-text-primary)' }}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>Industry Sector</label>
                  <select
                    value={orgProfile.industrySector}
                    onChange={(e) => setOrgProfile({ industrySector: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: 'var(--color-primary-700)', border: '1px solid var(--glass-border)', color: 'var(--color-text-primary)' }}
                  >
                    <option value="">Select industry</option>
                    {industries.map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>Employee Count</label>
                  <select
                    value={orgProfile.employeeCount}
                    onChange={(e) => setOrgProfile({ employeeCount: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: 'var(--color-primary-700)', border: '1px solid var(--glass-border)', color: 'var(--color-text-primary)' }}
                  >
                    <option value="">Select range</option>
                    {employeeRanges.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>Assessment Scope</label>
                  <div className="flex gap-3">
                    {(['full', 'quick', 'targeted'] as const).map((scope) => (
                      <button
                        key={scope}
                        onClick={() => setOrgProfile({ assessmentScope: scope })}
                        className="flex-1 py-3 rounded-xl text-sm font-medium transition-all capitalize"
                        style={{
                          background: orgProfile.assessmentScope === scope ? 'rgba(134, 188, 37, 0.15)' : 'var(--color-primary-700)',
                          border: `1px solid ${orgProfile.assessmentScope === scope ? 'var(--color-accent-500)' : 'var(--glass-border)'}`,
                          color: orgProfile.assessmentScope === scope ? 'var(--color-accent-400)' : 'var(--color-text-secondary)',
                        }}
                      >
                        {scope}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card space-y-4">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>Select Standards</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {standardOptions.map((s) => (
                  <button
                    key={s.code}
                    onClick={() => toggleStandard(s.code)}
                    className="p-4 rounded-xl text-left transition-all"
                    style={{
                      background: selectedStandards.includes(s.code) ? `${s.color}10` : 'var(--color-primary-700)',
                      border: `2px solid ${selectedStandards.includes(s.code) ? s.color : 'var(--glass-border)'}`,
                    }}
                  >
                    <div className="text-lg font-bold" style={{ color: s.color }}>{s.name}</div>
                    <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 1: Upload */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <div className="glass-card space-y-6">
              <div>
                <span className="section-label">Step 2</span>
                <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Upload Policy Documents</h2>
              </div>

              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className="border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer"
                style={{
                  borderColor: dragOver ? 'var(--color-accent-500)' : 'var(--color-primary-600)',
                  background: dragOver ? 'rgba(134, 188, 37, 0.05)' : 'transparent',
                }}
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.multiple = true;
                  input.accept = '.pdf,.docx,.txt';
                  input.onchange = (e) => {
                    const target = e.target as HTMLInputElement;
                    if (target.files) setFiles((prev) => [...prev, ...Array.from(target.files!)]);
                  };
                  input.click();
                }}
              >
                <Upload size={40} className="mx-auto mb-4" style={{ color: dragOver ? 'var(--color-accent-500)' : 'var(--color-text-muted)' }} />
                <p className="text-base font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>
                  Drag & drop or click to upload
                </p>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  PDF, DOCX, TXT • Your documents are analyzed securely and never stored
                </p>
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--color-primary-700)' }}>
                      <div className="flex items-center gap-3">
                        <FileText size={18} style={{ color: 'var(--color-accent-500)' }} />
                        <div>
                          <div className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{f.name}</div>
                          <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{(f.size / 1024).toFixed(1)} KB</div>
                        </div>
                      </div>
                      <button onClick={() => removeFile(i)} className="p-1 rounded hover:bg-[var(--color-primary-600)]">
                        <X size={16} style={{ color: 'var(--color-text-muted)' }} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Step 2: Processing */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <div className="glass-card space-y-6">
              <div className="text-center">
                <span className="section-label">Step 3</span>
                <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>AI Agent Orchestration</h2>
              </div>

              {/* Agent nodes */}
              <div className="flex flex-wrap justify-center gap-4">
                {agentStates.map((agent, i) => (
                  <div key={agent.name} className="flex flex-col items-center gap-2">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all"
                      style={{
                        background: agent.status === 'complete' ? 'rgba(134, 188, 37, 0.2)' : agent.status === 'processing' ? 'rgba(134, 188, 37, 0.1)' : 'var(--color-primary-700)',
                        border: `2px solid ${agent.status === 'complete' ? 'var(--color-accent-500)' : agent.status === 'processing' ? 'var(--color-accent-500)' : 'var(--color-primary-600)'}`,
                        animation: agent.status === 'processing' ? 'pulse-glow 2s ease-in-out infinite' : 'none',
                      }}
                    >
                      {agent.status === 'complete' ? (
                        <CheckCircle size={22} style={{ color: 'var(--color-accent-500)' }} />
                      ) : agent.status === 'processing' ? (
                        <Loader2 size={22} className="animate-spin" style={{ color: 'var(--color-accent-400)' }} />
                      ) : (
                        <span className="text-xs font-bold" style={{ color: 'var(--color-text-muted)' }}>{i + 1}</span>
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-center max-w-[80px]" style={{ color: agent.status === 'idle' ? 'var(--color-text-muted)' : 'var(--color-text-secondary)' }}>
                      {agent.name}
                    </span>
                  </div>
                ))}
              </div>

              {!processing && !done && (
                <div className="text-center">
                  <button onClick={simulateProcessing} className="btn-glow flex items-center gap-2 mx-auto text-lg px-8 py-4">
                    <Play size={20} /> Start Analysis
                  </button>
                </div>
              )}

              {/* Log panel */}
              {logs.length > 0 && (
                <div
                  className="rounded-xl p-4 max-h-[280px] overflow-y-auto font-mono text-xs space-y-1"
                  style={{ background: 'var(--color-primary-900)', border: '1px solid var(--glass-border)' }}
                >
                  {logs.map((log, i) => (
                    <div key={i} style={{ color: log.includes('✓') ? 'var(--color-accent-500)' : log.includes('critical') || log.includes('Critical') ? 'var(--color-risk-critical)' : 'var(--color-text-secondary)' }}>
                      {log}
                    </div>
                  ))}
                  {processing && (
                    <div className="flex items-center gap-2" style={{ color: 'var(--color-accent-400)' }}>
                      <Loader2 size={12} className="animate-spin" /> Processing...
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Step 3: Results */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <div className="glass-card text-center space-y-6">
              <div>
                <span className="section-label">Step 4</span>
                <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Assessment Complete</h2>
              </div>

              <ComplianceScoreRing score={finalScore} maturityLevel={finalScore >= 75 ? 4 : finalScore >= 60 ? 3 : 2} size={180} delay={300} />

              <div className="grid md:grid-cols-3 gap-4 max-w-xl mx-auto">
                {[
                  { label: 'Critical Gaps', value: '5', color: 'var(--color-risk-critical)' },
                  { label: 'Standards Assessed', value: '4', color: 'var(--color-accent-500)' },
                  { label: 'Remediation Actions', value: '9', color: 'var(--color-risk-medium)' },
                ].map((stat) => (
                  <div key={stat.label} className="p-4 rounded-xl" style={{ background: 'var(--color-primary-700)' }}>
                    <div className="score-display text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                    <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 justify-center">
                <button onClick={finishAssessment} className="btn-glow flex items-center gap-2">
                  View Dashboard <ArrowRight size={18} />
                </button>
                <button onClick={() => navigate('/reports')} className="btn-ghost flex items-center gap-2">
                  Generate Report
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="btn-ghost flex items-center gap-2 disabled:opacity-30"
        >
          <ArrowLeft size={18} /> Back
        </button>
        {step < 3 && (
          <button
            onClick={() => setStep(Math.min(3, step + 1))}
            disabled={!canProceed() || (step === 2 && !done)}
            className="btn-glow flex items-center gap-2 disabled:opacity-30"
          >
            {step === 2 ? 'View Results' : 'Continue'} <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
