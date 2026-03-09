import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ClipboardList, FileSearch, MessageCircle, Scale, Send, ShieldCheck, Sparkles, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { copilotApi } from '../../utils/apiClient';
import type { ChatMessage, CopilotContextSnapshot } from '../../types';

const suggestedQuestions = [
  'Why are my lowest clause scores low?',
  'Recommend the top remediation actions for the next 30 days.',
  'Summarize the current report for an audit committee.',
  'Guide me through the most relevant ISO requirements.',
];

function buildCopilotContext(
  currentAssessment: ReturnType<typeof useAppStore.getState>['currentAssessment'],
  uploadedDocuments: ReturnType<typeof useAppStore.getState>['uploadedDocuments']
): CopilotContextSnapshot | undefined {
  if (!currentAssessment) {
    return undefined;
  }

  const weakestClauses = currentAssessment.standards
    .flatMap((standard) => standard.clauseScores.map((clause) => ({
      standard: standard.standardCode,
      clauseId: clause.clauseId,
      clauseTitle: clause.clauseTitle,
      score: clause.score,
      finding: clause.finding || clause.gap || clause.evidence,
    })))
    .sort((left, right) => left.score - right.score)
    .slice(0, 12);

  return {
    orgProfile: {
      company: currentAssessment.orgProfile.companyName,
      industry: currentAssessment.orgProfile.industrySector,
      employees: currentAssessment.orgProfile.employeeCount,
      scope: currentAssessment.orgProfile.assessmentScope,
    },
    uploadedDocuments,
    overallScore: currentAssessment.overallScore,
    maturityLevel: currentAssessment.overallMaturity,
    executiveSummary: currentAssessment.executiveSummary,
    evidenceSummary: currentAssessment.evidenceValidation?.summary,
    standards: currentAssessment.standards.map((standard) => ({
      code: standard.standardCode,
      name: standard.standardName,
      overallScore: standard.overallScore,
      maturityLevel: standard.maturityLevel,
      summary: standard.summary,
    })),
    clauseScores: weakestClauses,
    gaps: currentAssessment.gaps.slice(0, 12).map((gap) => ({
      id: gap.id,
      standard: gap.standardCode,
      clauseRef: gap.clauseId,
      title: gap.title,
      severity: gap.impact,
      description: gap.description,
    })),
    remediationActions: currentAssessment.remediation.slice(0, 10).map((action) => ({
      id: action.id,
      title: action.title,
      priority: action.priority,
      phase: action.phase,
      description: action.description,
      standard: action.standards[0],
      responsible: action.responsibleFunction,
    })),
    orchestration: {
      provider: currentAssessment.orchestration?.provider,
      executionCount: currentAssessment.orchestration?.executions.length,
    },
  };
}

function ResponseSection({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof ShieldCheck;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="copilot-response-section">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <Icon size={14} style={{ color: 'var(--blue-700)' }} />
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--slate-500)' }}>{title}</div>
      </div>
      {children}
    </section>
  );
}

export default function ChatAssistant() {
  const {
    isChatOpen,
    toggleChat,
    chatMessages,
    addChatMessage,
    currentAssessment,
    activeAssessmentSessionId,
    uploadedDocuments,
  } = useAppStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = async (message?: string) => {
    const text = message || input.trim();
    if (!text || isTyping) {
      return;
    }

    setInput('');

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    addChatMessage(userMessage);
    setIsTyping(true);

    try {
      const structured = await copilotApi.askQuestion({
        message: text,
        assessmentId: activeAssessmentSessionId || currentAssessment?.sessionId || currentAssessment?.id || null,
        conversationHistory: chatMessages.slice(-6).map((messageItem) => ({ role: messageItem.role, content: messageItem.content })),
        context: buildCopilotContext(currentAssessment, uploadedDocuments),
      });

      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: structured.directAnswer,
        timestamp: new Date().toISOString(),
        structuredResponse: structured,
      };
      addChatMessage(reply);
    } catch (error) {
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: error instanceof Error ? error.message : 'The copilot could not complete this request.',
        timestamp: new Date().toISOString(),
      };
      addChatMessage(reply);
    }

    setIsTyping(false);
  };

  const contextSnapshot = currentAssessment ? {
    company: currentAssessment.orgProfile.companyName,
    documents: uploadedDocuments.length,
    gaps: currentAssessment.gaps.length,
    provider: currentAssessment.orchestration?.provider || 'local',
  } : null;

  return (
    <>
      <AnimatePresence>
        {!isChatOpen ? (
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={toggleChat}
            className="copilot-fab"
            aria-label="Open AI Compliance Copilot"
          >
            <MessageCircle size={24} />
          </motion.button>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isChatOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            className="copilot-drawer"
          >
            <div className="copilot-header">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 14, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--teal), var(--green))', color: 'white' }}>
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--slate-900)' }}>AI Compliance Copilot</div>
                    <div style={{ fontSize: 12, color: 'var(--slate-500)' }}>Structured, audit-friendly guidance grounded in the active workspace.</div>
                  </div>
                </div>
                <button onClick={toggleChat} style={{ color: 'var(--slate-400)' }} aria-label="Close AI Compliance Copilot">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="copilot-context">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <span className="badge badge-pending">Conversation interface</span>
                <span className="badge badge-compliant">Structured responses</span>
                {contextSnapshot ? <span className="badge badge-partial">{contextSnapshot.provider} pipeline context</span> : null}
              </div>

              {contextSnapshot ? (
                <div className="copilot-context-grid">
                  <div className="copilot-context-card">
                    <div className="summary-stat-label">Org</div>
                    <div className="summary-stat-copy" style={{ marginTop: 4, color: 'var(--slate-900)' }}>{contextSnapshot.company}</div>
                  </div>
                  <div className="copilot-context-card">
                    <div className="summary-stat-label">Docs</div>
                    <div className="summary-stat-copy" style={{ marginTop: 4, color: 'var(--slate-900)' }}>{contextSnapshot.documents}</div>
                  </div>
                  <div className="copilot-context-card">
                    <div className="summary-stat-label">Open gaps</div>
                    <div className="summary-stat-copy" style={{ marginTop: 4, color: 'var(--slate-900)' }}>{contextSnapshot.gaps}</div>
                  </div>
                  <div className="copilot-context-card">
                    <div className="summary-stat-label">Mode</div>
                    <div className="summary-stat-copy" style={{ marginTop: 4, color: 'var(--slate-900)' }}>{contextSnapshot.provider}</div>
                  </div>
                </div>
              ) : null}
            </div>

            <div ref={scrollRef} className="copilot-scroll">
              {chatMessages.length === 0 ? (
                <div className="copilot-empty-state">
                  <div className="copilot-empty-card" style={{ padding: 16 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--slate-900)', marginBottom: 6 }}>Ask about your assessment, gaps, or ISO obligations</div>
                    <div style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--slate-500)' }}>
                      The copilot uses the active assessment, uploaded evidence, and remediation context to return concise answers with audit-trail metadata.
                    </div>
                  </div>
                  {suggestedQuestions.map((question) => (
                    <button key={question} className="copilot-followup" onClick={() => handleSend(question)} style={{ padding: 14, textAlign: 'left' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--slate-900)' }}>{question}</div>
                    </button>
                  ))}
                </div>
              ) : null}

              {chatMessages.map((message) => {
                const structuredResponse = message.role === 'assistant' ? message.structuredResponse : undefined;

                return (
                  <div key={message.id} className={`copilot-message-row ${message.role === 'user' ? 'user' : 'assistant'}`}>
                    <div className={`copilot-message ${message.role === 'user' ? 'user' : 'assistant'}`}>
                      {structuredResponse ? (
                        <div className="copilot-response-stack">
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--blue-700)', marginBottom: 6 }}>{structuredResponse.headline}</div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--slate-900)', marginBottom: 6 }}>{structuredResponse.directAnswer}</div>
                            <div>{structuredResponse.explanation}</div>
                          </div>

                          {structuredResponse.evidence.length > 0 ? (
                            <ResponseSection icon={FileSearch} title="Evidence used">
                              <div className="copilot-response-stack">
                                {structuredResponse.evidence.slice(0, 4).map((item, index) => (
                                  <div key={`${item.label}-${index}`} style={{ fontSize: 12, color: 'var(--slate-700)' }}>
                                    <strong>{item.label}:</strong> {item.detail}
                                  </div>
                                ))}
                              </div>
                            </ResponseSection>
                          ) : null}

                          {structuredResponse.recommendedActions.length > 0 ? (
                            <ResponseSection icon={ClipboardList} title="Recommended actions">
                              <div className="copilot-response-stack">
                                {structuredResponse.recommendedActions.map((action, index) => (
                                  <div key={`${action.title}-${index}`} style={{ paddingBottom: index < structuredResponse.recommendedActions.length - 1 ? 10 : 0, borderBottom: index < structuredResponse.recommendedActions.length - 1 ? '1px solid rgba(19, 35, 58, 0.08)' : 'none' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                                      <strong>{action.title}</strong>
                                      <span className={`badge badge-${action.priority === 'critical' ? 'critical' : action.priority === 'high' ? 'partial' : 'pending'}`}>{action.priority}</span>
                                    </div>
                                    <div style={{ fontSize: 12, marginTop: 4 }}>{action.rationale}</div>
                                  </div>
                                ))}
                              </div>
                            </ResponseSection>
                          ) : null}

                          {structuredResponse.isoGuidance.length > 0 ? (
                            <ResponseSection icon={Scale} title="ISO guidance">
                              <div className="copilot-response-stack">
                                {structuredResponse.isoGuidance.map((guidance, index) => (
                                  <div key={`${guidance.standard}-${guidance.clause || index}`} style={{ fontSize: 12, color: 'var(--slate-700)' }}>
                                    <strong>{guidance.standard}{guidance.clause ? ` clause ${guidance.clause}` : ''}:</strong> {guidance.requirement}
                                    <div style={{ color: 'var(--slate-500)', marginTop: 4 }}>{guidance.guidance}</div>
                                  </div>
                                ))}
                              </div>
                            </ResponseSection>
                          ) : null}

                          <ResponseSection icon={ShieldCheck} title="Audit trail">
                            <div className="copilot-response-stack" style={{ gap: 6, fontSize: 12 }}>
                              <div><strong>Response mode:</strong> {structuredResponse.auditTrail.responseMode}</div>
                              <div><strong>Pipeline provider:</strong> {structuredResponse.auditTrail.pipelineProvider}</div>
                              <div><strong>Context sources:</strong> {structuredResponse.auditTrail.contextSources.join(', ') || 'Not declared'}</div>
                              {structuredResponse.auditTrail.caveats.map((caveat, index) => (
                                <div key={`${caveat}-${index}`} style={{ color: 'var(--slate-500)' }}>{caveat}</div>
                              ))}
                            </div>
                          </ResponseSection>

                          {structuredResponse.followUpQuestions.length > 0 ? (
                            <div className="copilot-followup-list">
                              {structuredResponse.followUpQuestions.slice(0, 2).map((followUp) => (
                                <button key={followUp} type="button" className="copilot-followup" onClick={() => handleSend(followUp)} style={{ padding: 12, textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                                  <span>{followUp}</span>
                                  <ArrowRight size={14} />
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        message.content
                      )}
                    </div>
                  </div>
                );
              })}

              {isTyping ? (
                <div className="copilot-message-row assistant">
                  <div className="copilot-message assistant" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="w-2 h-2 rounded-full bg-[var(--blue-700)] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[var(--blue-700)] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[var(--blue-700)] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              ) : null}
            </div>

            <div className="copilot-input">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && handleSend()}
                placeholder="Ask about your compliance posture..."
                className="copilot-input-field"
              />
              <button onClick={() => handleSend()} disabled={!input.trim()} className="copilot-send" style={{ opacity: input.trim() ? 1 : 0.4 }}>
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}