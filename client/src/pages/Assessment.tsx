import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, Upload, FileText, X, CheckCircle,
  Loader2, ArrowRight, ArrowLeft, Play, AlertCircle,
  ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppStore } from '../store/useAppStore';
import { demoAssessmentResult } from '../data/demo-data';
import { useAssessmentStream } from '../hooks/useAssessmentStream';
import { assessmentApi } from '../utils/apiClient';
import { adaptAssessmentResult } from '../utils/assessmentAdapter';
import type { AssessmentResult, OrgProfile, StandardCode } from '../types';

/* ── Static data ─────────────────────────────────────── */
const industries = [
  'Financial Services', 'Healthcare', 'Technology', 'Manufacturing',
  'Energy & Utilities', 'Retail & Consumer', 'Government', 'Professional Services',
];

const employeeRanges = ['1-50', '51-200', '201-500', '501-1000', '1000-5000', '5000+'];

const jurisdictions = [
  'Australia', 'Canada', 'European Union', 'Germany', 'Singapore',
  'United Kingdom', 'United States', 'Other',
];

const maturityOptions: Array<{ value: NonNullable<OrgProfile['currentMaturity']>; label: string; desc: string }> = [
  { value: 'initial',     label: 'Initial (Level 1)',     desc: 'Ad-hoc processes, no formal program' },
  { value: 'developing',  label: 'Developing (Level 2)',  desc: 'Some documented policies, inconsistent' },
  { value: 'defined',     label: 'Defined (Level 3)',     desc: 'Formal program established and maintained' },
  { value: 'managed',     label: 'Managed (Level 4)',     desc: 'Monitored, measured and controlled' },
  { value: 'optimizing',  label: 'Optimizing (Level 5)', desc: 'Continuous improvement culture' },
];

const standardOptions: { code: StandardCode; name: string; desc: string; clauses: number; scope: string }[] = [
  { code: 'ISO37001', name: 'ISO 37001:2025', desc: 'Anti-Bribery Management Systems', clauses: 33, scope: 'Anti-bribery, gifts & hospitality, third-party risk' },
  { code: 'ISO37301', name: 'ISO 37301:2021', desc: 'Compliance Management Systems', clauses: 28, scope: 'Governance framework, obligations register, culture' },
  { code: 'ISO27001', name: 'ISO 27001:2022', desc: 'Information Security Management', clauses: 24, scope: 'ISMS, controls, risk treatment, incident response' },
  { code: 'ISO9001',  name: 'ISO 9001:2015',  desc: 'Quality Management Systems',    clauses: 28, scope: 'Process control, customer focus, continual improvement' },
];

const steps = [
  { id: 0, label: 'Organization' },
  { id: 1, label: 'Documents' },
  { id: 2, label: 'Standards' },
  { id: 3, label: 'Analysis' },
  { id: 4, label: 'Results' },
];

const agentNodes = [
  { name: 'Document Agent', task: 'Parsing uploaded policies and extracting control evidence' },
  { name: 'Bribery Risk Agent', task: 'Scoring ISO 37001 controls against anti-bribery evidence' },
  { name: 'Governance Agent', task: 'Assessing ISO 37301 governance and compliance obligations' },
  { name: 'Security Agent', task: 'Evaluating ISO 27001 information security controls' },
  { name: 'Quality Agent', task: 'Assessing ISO 9001 quality management controls' },
  { name: 'Gap Analysis Agent', task: 'Synthesizing legal, control, and certification gaps' },
  { name: 'Evidence Validation Agent', task: 'Testing evidence sufficiency and cross-standard reuse' },
  { name: 'Remediation Agent', task: 'Generating a phased remediation program' },
  { name: 'Policy Generator Agent', task: 'Drafting policy artifacts for weak control areas' },
];

/* ── Step Progress Header ─────────────────────────────── */
function StepProgress({ step }: { step: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 24 }}>
      {steps.map((s, i) => (
        <div key={s.id} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : undefined }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              background: i < step ? 'var(--blue-800)' : i === step ? 'var(--blue-800)' : 'var(--white)',
              color: i <= step ? 'var(--white)' : 'var(--slate-400)',
              border: `2px solid ${i <= step ? 'var(--blue-800)' : 'var(--border-strong)'}`,
              transition: 'all 200ms ease',
              flexShrink: 0,
            }}>
              {i < step ? <CheckCircle size={14} /> : i + 1}
            </div>
            <span style={{
              fontSize: 10,
              fontWeight: i === step ? 700 : 500,
              color: i === step ? 'var(--blue-800)' : i < step ? 'var(--slate-600)' : 'var(--slate-400)',
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div style={{
              flex: 1,
              height: 1,
              background: i < step ? 'var(--blue-800)' : 'var(--border)',
              margin: '0 8px',
              marginBottom: 18,
              transition: 'background 200ms ease',
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Form Field ───────────────────────────────────────── */
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="form-label">
        {label}
        {required && <span style={{ color: 'var(--risk-critical)', marginLeft: 2 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

/* ── Main Component ───────────────────────────────────── */
export default function Assessment() {
  const navigate = useNavigate();
  const { orgProfile, setOrgProfile, selectedStandards, setSelectedStandards, setAssessment, isDemoMode, addNotification } = useAppStore();
  const { startStream } = useAssessmentStream();
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [agentStates, setAgentStates] = useState(
    agentNodes.map(a => ({ ...a, status: 'idle' as 'idle' | 'processing' | 'complete', progress: 0 }))
  );
  const [logs, setLogs] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [finalScore, setFinalScore] = useState(62);
  const [completedAssessment, setCompletedAssessment] = useState<AssessmentResult | null>(null);

  const toggleStandard = (code: StandardCode) => {
    setSelectedStandards(
      selectedStandards.includes(code)
        ? selectedStandards.filter(s => s !== code)
        : [...selectedStandards, code]
    );
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const newFiles = Array.from(e.dataTransfer.files).filter(
      f => ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'].includes(f.type)
    );
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const removeFile = (i: number) => setFiles(prev => prev.filter((_, idx) => idx !== i));

  const runDemoSimulation = async () => {
    setProcessing(true);
    setDone(false);
    setCompletedAssessment(null);
    const sequence = [
      { idx: 0, msg: 'Document Agent — Extracting content from uploaded policy documents...' },
      { idx: 1, msg: 'Bribery Risk Agent — Evaluating anti-bribery control evidence...' },
      { idx: 2, msg: 'Governance Agent — Reviewing obligations register and governance structure...' },
      { idx: 3, msg: 'Security Agent — Mapping security controls to ISO 27001 clauses...' },
      { idx: 4, msg: 'Quality Agent — Assessing process consistency and ownership evidence...' },
      { idx: 5, msg: 'Gap Analysis Agent — Identified 12 compliance gaps, 5 critical severity...' },
      { idx: 6, msg: 'Evidence Validation Agent — Testing sufficiency and reuse potential...' },
      { idx: 7, msg: 'Remediation Agent — Building a phased remediation roadmap...' },
      { idx: 8, msg: 'Policy Generator Agent — Drafting policies for missing controls...' },
    ];

    for (let i = 0; i < sequence.length; i++) {
      await new Promise(r => setTimeout(r, 750));
      const { idx, msg } = sequence[i];
      setAgentStates(prev => prev.map((a, j) => {
        if (j === idx) return { ...a, status: 'processing' as const };
        if (j < idx && prev[j].status !== 'complete') return { ...a, status: 'complete' as const };
        return a;
      }));
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    }

    setAgentStates(prev => prev.map(a => ({ ...a, status: 'complete' as const })));
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Assessment complete — Overall Score: 62%`]);
    setCompletedAssessment({
      ...demoAssessmentResult,
      orgProfile: { ...demoAssessmentResult.orgProfile, ...orgProfile },
      timestamp: new Date().toISOString(),
      overallScore: 62,
    });
    setProcessing(false);
    setDone(true);
    setFinalScore(62);
  };

  const startAnalysis = async () => {
    setProcessing(true);
    setDone(false);
    setLogs([]);
    setCompletedAssessment(null);
    setAgentStates(agentNodes.map((agent) => ({ ...agent, status: 'idle' as const, progress: 0 })));
    if (!isDemoMode) {
      try {
        const filePaths = await assessmentApi.uploadDocuments(files);
        const res = await assessmentApi.startAssessment({
          filePaths,
          standards: selectedStandards,
          orgProfile: { company: orgProfile.companyName, industry: orgProfile.industrySector, employees: orgProfile.employeeCount, scope: orgProfile.assessmentScope },
        });
        startStream(
          res.assessmentId,
          (event) => {
            if (event.type === 'agent-start' && event.agent) {
              setAgentStates(prev => prev.map(a => a.name === event.agent ? { ...a, status: 'processing' as const } : a));
            }
            if (event.type === 'agent-complete' && event.agent) {
              setAgentStates(prev => prev.map(a => a.name === event.agent ? { ...a, status: 'complete' as const } : a));
            }
            if (event.type === 'log' && event.message) {
              setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${event.message}`]);
            }
          },
          (result) => {
            const normalizedResult = adaptAssessmentResult(result);
            setAgentStates(prev => prev.map(a => ({ ...a, status: 'complete' as const })));
            setCompletedAssessment(normalizedResult);
            setFinalScore(normalizedResult.overallScore || 62);
            setProcessing(false);
            setDone(true);
            toast.success('Assessment complete');
            addNotification({ type: 'success', title: 'Assessment Complete', message: `Overall score: ${normalizedResult.overallScore}%` });
          },
          (error) => {
            setProcessing(false);
            setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Assessment failed: ${error}`]);
            toast.error(`Assessment failed: ${error}`);
            addNotification({ type: 'error', title: 'Assessment Failed', message: String(error) });
          }
        );
      } catch (error) {
        setProcessing(false);
        const message = error instanceof Error ? error.message : 'Unable to start assessment';
        toast.error(message);
        addNotification({ type: 'error', title: 'Assessment Failed', message });
      }
      return;
    }
    runDemoSimulation();
  };

  const finishAssessment = () => {
    if (!completedAssessment) {
      toast.error('No completed assessment is available to save.');
      return;
    }

    setAssessment(completedAssessment);
    addNotification({ type: 'success', title: 'Assessment Saved', message: `Score: ${finalScore}%` });
    navigate('/dashboard');
  };

  const canProceed = () => {
    if (step === 0) return !!(orgProfile.companyName && orgProfile.industrySector);
    if (step === 1) return true;
    if (step === 2) return selectedStandards.length > 0;
    if (step === 3) return done;
    return true;
  };

  const scoreColor = finalScore >= 75 ? 'var(--status-compliant)' : finalScore >= 50 ? 'var(--risk-medium)' : 'var(--risk-critical)';
  const scoreLabel = finalScore >= 75 ? 'Compliant' : finalScore >= 50 ? 'Partially Compliant' : 'Non-Compliant';
  const criticalGapCount = completedAssessment?.gaps.filter((gap) => gap.impact === 'critical').length || 0;
  const highGapCount = completedAssessment?.gaps.filter((gap) => gap.impact === 'high').length || 0;
  const remediationCount = completedAssessment?.remediation.length || 0;
  const assessedStandardsCount = completedAssessment?.standards.length || selectedStandards.length || 0;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <StepProgress step={step} />

      {/* Step 0 — Organization Setup */}
      {step === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-header">
              <div>
                <span className="section-label">Step 1 of 5</span>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--slate-900)' }}>Organization Profile</h2>
              </div>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Legal Entity Name" required>
                  <div style={{ position: 'relative' }}>
                    <Building2 size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                    <input
                      value={orgProfile.companyName}
                      onChange={e => setOrgProfile({ companyName: e.target.value })}
                      placeholder="Acme Corporation"
                      className="form-input"
                      style={{ paddingLeft: 30 }}
                    />
                  </div>
                </Field>

                <Field label="Industry Sector" required>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={orgProfile.industrySector}
                      onChange={e => setOrgProfile({ industrySector: e.target.value })}
                      className="form-select"
                    >
                      <option value="">Select sector...</option>
                      {industries.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                    <ChevronDown size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)', pointerEvents: 'none' }} />
                  </div>
                </Field>

                <Field label="Employee Count">
                  <div style={{ position: 'relative' }}>
                    <select
                      value={orgProfile.employeeCount}
                      onChange={e => setOrgProfile({ employeeCount: e.target.value })}
                      className="form-select"
                    >
                      <option value="">Select range...</option>
                      {employeeRanges.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <ChevronDown size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)', pointerEvents: 'none' }} />
                  </div>
                </Field>

                <Field label="Jurisdiction">
                  <div style={{ position: 'relative' }}>
                    <select
                      value={orgProfile.jurisdiction || ''}
                      onChange={e => setOrgProfile({ jurisdiction: e.target.value })}
                      className="form-select"
                    >
                      <option value="">Select jurisdiction...</option>
                      {jurisdictions.map(j => <option key={j} value={j}>{j}</option>)}
                    </select>
                    <ChevronDown size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)', pointerEvents: 'none' }} />
                  </div>
                </Field>

                <div style={{ gridColumn: '1 / -1' }}>
                  <Field label="Current Compliance Maturity">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginTop: 4 }}>
                      {maturityOptions.map(m => (
                        <button
                          key={m.value}
                          type="button"
                          onClick={() => setOrgProfile({ currentMaturity: m.value })}
                          style={{
                            padding: '10px 8px',
                            borderRadius: 'var(--radius-md)',
                            border: `2px solid ${orgProfile.currentMaturity === m.value ? 'var(--blue-700)' : 'var(--border)'}`,
                            background: orgProfile.currentMaturity === m.value ? 'var(--blue-50)' : 'var(--white)',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 120ms ease',
                          }}
                        >
                          <div style={{ fontSize: 12, fontWeight: 700, color: orgProfile.currentMaturity === m.value ? 'var(--blue-800)' : 'var(--slate-700)', marginBottom: 2 }}>
                            {m.label}
                          </div>
                          <div style={{ fontSize: 10, color: 'var(--slate-500)', lineHeight: 1.3 }}>{m.desc}</div>
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 1 — Document Upload */}
      {step === 1 && (
        <div className="card">
          <div className="card-header">
            <div>
              <span className="section-label">Step 2 of 5</span>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--slate-900)' }}>Document Ingestion</h2>
            </div>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontSize: 13, color: 'var(--slate-600)' }}>
              Upload policy documents, procedures, and governance frameworks for analysis. Supported formats: PDF, DOCX, TXT.
            </p>

            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.multiple = true;
                input.accept = '.pdf,.docx,.txt';
                input.onchange = e => {
                  const t = e.target as HTMLInputElement;
                  if (t.files) setFiles(prev => [...prev, ...Array.from(t.files!)]);
                };
                input.click();
              }}
              style={{
                border: `2px dashed ${dragOver ? 'var(--blue-500)' : 'var(--border-strong)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '32px 24px',
                textAlign: 'center',
                cursor: 'pointer',
                background: dragOver ? 'var(--blue-50)' : 'var(--slate-50)',
                transition: 'all 150ms ease',
              }}
            >
              <Upload size={28} style={{ color: dragOver ? 'var(--blue-700)' : 'var(--slate-400)', marginBottom: 12 }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--slate-700)', marginBottom: 4 }}>
                Drag files here or click to browse
              </div>
              <div style={{ fontSize: 12, color: 'var(--slate-500)' }}>
                PDF, DOCX, TXT — Documents are processed securely and not stored
              </div>
            </div>

            {/* File list */}
            {files.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {files.length} Document{files.length !== 1 ? 's' : ''} Queued
                </div>
                {files.map((f, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 14px',
                    background: 'var(--white)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                  }}>
                    <FileText size={16} style={{ color: 'var(--blue-600)', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--slate-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--slate-500)' }}>{(f.size / 1024).toFixed(1)} KB • {f.name.split('.').pop()?.toUpperCase()}</div>
                    </div>
                    <span className="badge badge-compliant" style={{ flexShrink: 0 }}>Ready</span>
                    <button
                      onClick={e => { e.stopPropagation(); removeFile(i); }}
                      style={{ padding: 4, borderRadius: 'var(--radius-sm)', background: 'transparent', border: 'none', color: 'var(--slate-400)', cursor: 'pointer', flexShrink: 0 }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 14px',
              background: 'var(--blue-50)',
              border: '1px solid var(--blue-100)',
              borderRadius: 'var(--radius-md)',
              fontSize: 12,
              color: 'var(--blue-800)',
            }}>
              <AlertCircle size={14} style={{ flexShrink: 0 }} />
              Real assessments can run without uploaded files, but document evidence produces materially better clause scoring and remediation outputs.
            </div>
          </div>
        </div>
      )}

      {/* Step 2 — Standards Selection */}
      {step === 2 && (
        <div className="card">
          <div className="card-header">
            <div>
              <span className="section-label">Step 3 of 5</span>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--slate-900)' }}>Standards Selection</h2>
            </div>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontSize: 13, color: 'var(--slate-600)', marginBottom: 4 }}>
              Select the ISO standards to assess. Each standard is evaluated independently with cross-standard gap analysis.
            </p>
            {standardOptions.map(s => {
              const selected = selectedStandards.includes(s.code);
              return (
                <button
                  key={s.code}
                  onClick={() => toggleStandard(s.code)}
                  type="button"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 16,
                    padding: '16px',
                    borderRadius: 'var(--radius-lg)',
                    border: `2px solid ${selected ? 'var(--blue-700)' : 'var(--border)'}`,
                    background: selected ? 'var(--blue-50)' : 'var(--white)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 120ms ease',
                    width: '100%',
                  }}
                >
                  <div style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    border: `2px solid ${selected ? 'var(--blue-700)' : 'var(--slate-400)'}`,
                    background: selected ? 'var(--blue-800)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 1,
                  }}>
                    {selected && <CheckCircle size={12} color="white" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 3 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: selected ? 'var(--blue-900)' : 'var(--slate-800)', fontFamily: 'var(--font-mono)' }}>
                        {s.name}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--slate-600)', fontFamily: 'var(--font-sans)' }}>{s.desc}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--slate-500)' }}>
                      {s.clauses} clauses · {s.scope}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span className="badge badge-pending">{s.clauses} clauses</span>
                  </div>
                </button>
              );
            })}

            {selectedStandards.length === 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#FEF2F2', border: '1px solid var(--risk-critical-border)', borderRadius: 'var(--radius-md)', fontSize: 12, color: 'var(--risk-critical)' }}>
                <AlertCircle size={14} />
                Select at least one ISO standard to proceed.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 3 — AI Analysis */}
      {step === 3 && (
        <div className="card">
          <div className="card-header">
            <div>
              <span className="section-label">Step 4 of 5</span>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--slate-900)' }}>AI Agent Analysis</h2>
            </div>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Agent Status Table */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                Agent Pipeline Status
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {agentStates.map((agent, i) => (
                  <div key={agent.name} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    background: agent.status === 'complete' ? 'var(--status-compliant-bg)' : agent.status === 'processing' ? 'var(--blue-50)' : 'var(--white)',
                    transition: 'all 200ms ease',
                  }}>
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: agent.status === 'complete' ? 'var(--status-compliant-bg)' : agent.status === 'processing' ? 'var(--blue-100)' : 'var(--slate-100)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {agent.status === 'complete' ? (
                        <CheckCircle size={14} color="var(--status-compliant)" />
                      ) : agent.status === 'processing' ? (
                        <Loader2 size={14} color="var(--blue-700)" className="animate-spin" />
                      ) : (
                        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--slate-400)' }}>{i + 1}</span>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--slate-800)' }}>{agent.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--slate-500)' }}>
                        {agent.status === 'processing' ? agent.task : agent.status === 'complete' ? 'Completed' : 'Waiting'}
                      </div>
                    </div>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 3,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      background: agent.status === 'complete' ? 'var(--status-compliant-bg)' : agent.status === 'processing' ? 'var(--blue-100)' : 'var(--slate-100)',
                      color: agent.status === 'complete' ? 'var(--status-compliant)' : agent.status === 'processing' ? 'var(--blue-800)' : 'var(--slate-500)',
                    }}>
                      {agent.status === 'processing' ? 'Active' : agent.status === 'complete' ? 'Done' : 'Idle'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Start button */}
            {!processing && !done && (
              <div style={{ textAlign: 'center' }}>
                <button onClick={startAnalysis} className="btn btn-primary" style={{ padding: '10px 28px', fontSize: 14 }}>
                  <Play size={15} /> Start Analysis
                </button>
              </div>
            )}

            {/* Log console */}
            {logs.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                  Analysis Log
                </div>
                <div
                  className="custom-scrollbar"
                  style={{
                    background: 'var(--slate-900)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 16px',
                    maxHeight: 220,
                    overflowY: 'auto',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    lineHeight: 1.6,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                  }}
                >
                  {logs.map((log, i) => (
                    <div key={i} style={{
                      color: log.includes('complete') || log.includes('Complete') ? '#86EFAC'
                        : log.includes('critical') || log.includes('Critical') || log.includes('Error') ? '#FCA5A5'
                        : '#94A3B8',
                    }}>
                      {log}
                    </div>
                  ))}
                  {processing && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#93C5FD' }}>
                      <Loader2 size={10} className="animate-spin" /> Processing...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 4 — Results */}
      {step === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-header">
              <div>
                <span className="section-label">Step 5 of 5</span>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--slate-900)' }}>Assessment Results</h2>
              </div>
              <span className="badge badge-compliant">Complete</span>
            </div>
            <div className="card-body">
              {/* Score summary */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, alignItems: 'center' }}>
                <div style={{ textAlign: 'center', padding: 24, background: 'var(--slate-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 48, fontWeight: 800, color: scoreColor, lineHeight: 1 }} className="score-display">{finalScore}%</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: scoreColor, marginTop: 6 }}>{scoreLabel}</div>
                  <div style={{ fontSize: 11, color: 'var(--slate-500)', marginTop: 2 }}>Overall Compliance Score</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[
                    { label: 'Critical Gaps', value: String(criticalGapCount), color: 'var(--risk-critical)' },
                    { label: 'High Gaps', value: String(highGapCount), color: 'var(--risk-high)' },
                    { label: 'Standards Assessed', value: String(assessedStandardsCount), color: 'var(--blue-700)' },
                    { label: 'Remediation Actions', value: String(remediationCount), color: 'var(--status-partial)' },
                  ].map(stat => (
                    <div key={stat.label} style={{
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      background: 'var(--white)',
                    }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: stat.color }} className="score-display">{stat.value}</div>
                      <div style={{ fontSize: 11, color: 'var(--slate-500)', marginTop: 2 }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {completedAssessment && (
                <div style={{ marginTop: 18, padding: 16, borderRadius: 'var(--radius-lg)', background: 'var(--blue-50)', border: '1px solid var(--blue-100)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--blue-800)', marginBottom: 8 }}>
                    Executive Summary
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--slate-700)' }}>
                    {completedAssessment.executiveSummary}
                  </div>
                </div>
              )}
            </div>
            <div className="card-footer" style={{ display: 'flex', gap: 10 }}>
              <button onClick={finishAssessment} className="btn btn-primary">
                Open Dashboard <ArrowRight size={13} />
              </button>
              <button onClick={() => navigate('/reports')} className="btn btn-secondary">
                View Full Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
        padding: '14px 0',
        borderTop: '1px solid var(--border)',
      }}>
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="btn btn-ghost"
        >
          <ArrowLeft size={14} /> Back
        </button>

        {step < 4 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--slate-500)' }}>Step {step + 1} of {steps.length}</span>
            <button
              onClick={() => setStep(s => Math.min(4, s + 1))}
              disabled={!canProceed() || (step === 3 && !done)}
              className="btn btn-primary"
            >
              {step === 3 ? 'View Results' : 'Continue'} <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
