import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { ChatMessage } from '../../types';

const suggestedQuestions = [
  "What's my biggest compliance risk?",
  "How do I fix Clause 8.2?",
  "What's my ISO 37001 maturity?",
  "Show me quick wins for this month",
];

export default function ChatAssistant() {
  const { isChatOpen, toggleChat, chatMessages, addChatMessage, currentAssessment } = useAppStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [chatMessages, streamingContent]);

  const handleSend = async (message?: string) => {
    const text = message || input.trim();
    if (!text || isTyping) return;
    setInput('');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    addChatMessage(userMsg);
    setIsTyping(true);
    setStreamingContent('');

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: currentAssessment
            ? { overallScore: currentAssessment.overallScore, standards: currentAssessment.standards.map((s) => ({ code: s.standardCode, score: s.overallScore })), gapCount: currentAssessment.gaps.length }
            : null,
        }),
      });

      if (!response.ok) throw new Error('Stream failed');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.type === 'delta' && data.text) {
                  fullText += data.text;
                  setStreamingContent(fullText);
                }
                if (data.type === 'done') {
                  break;
                }
                if (data.type === 'error') {
                  fullText = `Error: ${data.message}`;
                  break;
                }
              } catch {
                // ignore parse errors
              }
            }
          }
        }
      }

      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fullText || 'I can help you with compliance questions. Try asking about your score, gaps, or remediation plan.',
        timestamp: new Date().toISOString(),
      };
      addChatMessage(reply);
      setStreamingContent('');
    } catch {
      // Fallback to demo responses
      const demoResponses: Record<string, string> = {
        "What's my biggest compliance risk?":
          "Based on your assessment, your most critical risk is the **absence of a whistleblower mechanism** (ISO 37001 Clause 8.9) and **no due diligence framework** (Clause 8.2). Both carry significant legal liability exposure. I recommend establishing a whistleblower hotline within 30 days.",
        "How do I fix Clause 8.2?":
          "Clause 8.2 (Due Diligence) currently scores 0%. To address this:\n\n1. **Develop a risk-based due diligence policy** for all business associates\n2. **Create DD questionnaires** tiered by risk level\n3. **Implement screening** for top 50 business associates within 60 days\n4. **Set up ongoing monitoring** with annual re-assessments\n\nEstimated effort: 15 person-days.",
        "What's my ISO 37001 maturity?":
          "Your ISO 37001 maturity is at **Level 2 — Defined**. Key areas dragging you down:\n\n- Due diligence: 0%\n- Whistleblower mechanism: 0%\n- Training execution: 33%\n\nAddressing these three areas alone would elevate you to **Level 3 (Managed)** within 60-90 days.",
        "Show me quick wins for this month":
          "Top 3 quick wins for 30 days:\n\n1. 🎓 **Deploy Anti-Bribery Training** (5 days) — closes gaps in ISO 37001 & 37301\n2. 📞 **Launch Whistleblower Hotline** (10 days) — critical legal requirement\n3. 🎁 **Implement Gift Register** (3 days) — low effort, visible improvement\n\nProjected score improvement: +12% overall.",
      };

      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: demoResponses[text] || `Based on your ${currentAssessment ? `assessment showing ${currentAssessment.overallScore}% overall compliance` : 'current data'}, I can help you understand specific clause requirements, identify priority gaps, and plan remediation actions.`,
        timestamp: new Date().toISOString(),
      };
      addChatMessage(reply);
      setStreamingContent('');
    }

    setIsTyping(false);
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isChatOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={toggleChat}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center z-50 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, var(--color-accent-500), var(--color-accent-400))',
              boxShadow: '0 0 30px rgba(134, 188, 37, 0.3)',
            }}
          >
            <MessageCircle size={24} className="text-[var(--color-primary-900)]" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-[420px] h-[600px] rounded-2xl z-50 flex flex-col overflow-hidden"
            style={{
              background: 'var(--color-primary-800)',
              border: '1px solid var(--glass-border)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid var(--glass-border)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, var(--color-accent-500), var(--color-accent-400))' }}
                >
                  <Sparkles size={16} className="text-[var(--color-primary-900)]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    Compliance Assistant
                  </h3>
                  <span className="text-xs" style={{ color: 'var(--color-accent-500)' }}>
                    Powered by Claude
                  </span>
                </div>
              </div>
              <button onClick={toggleChat} className="p-1.5 rounded-lg hover:bg-[var(--color-primary-700)] transition">
                <X size={18} style={{ color: 'var(--color-text-muted)' }} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {chatMessages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    Ask me anything about your compliance assessment, gaps, or remediation plan.
                  </p>
                  <div className="space-y-2">
                    {suggestedQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSend(q)}
                        className="w-full text-left text-sm px-3 py-2 rounded-lg transition-all"
                        style={{
                          background: 'var(--color-primary-700)',
                          color: 'var(--color-text-secondary)',
                          border: '1px solid var(--glass-border)',
                        }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className="max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
                    style={{
                      background:
                        msg.role === 'user'
                          ? 'linear-gradient(135deg, var(--color-accent-500), var(--color-accent-400))'
                          : 'var(--color-primary-700)',
                      color:
                        msg.role === 'user'
                          ? 'var(--color-primary-900)'
                          : 'var(--color-text-primary)',
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && streamingContent && (
                <div className="flex justify-start">
                  <div
                    className="max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
                    style={{ background: 'var(--color-primary-700)', color: 'var(--color-text-primary)' }}
                  >
                    {streamingContent}
                    <span className="inline-block w-1.5 h-4 ml-0.5 animate-pulse" style={{ background: 'var(--color-accent-500)' }} />
                  </div>
                </div>
              )}
              {isTyping && !streamingContent && (
                <div className="flex justify-start">
                  <div
                    className="px-4 py-3 rounded-2xl flex items-center gap-1"
                    style={{ background: 'var(--color-primary-700)' }}
                  >
                    <span className="w-2 h-2 rounded-full bg-[var(--color-accent-500)] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[var(--color-accent-500)] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[var(--color-accent-500)] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div
              className="px-4 py-3 flex items-center gap-3"
              style={{ borderTop: '1px solid var(--glass-border)' }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about your compliance..."
                className="flex-1 bg-transparent border-none outline-none text-sm"
                style={{ color: 'var(--color-text-primary)' }}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                style={{
                  background: 'linear-gradient(135deg, var(--color-accent-500), var(--color-accent-400))',
                }}
              >
                <Send size={16} className="text-[var(--color-primary-900)]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
