import { Router, Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';

export const chatRouter = Router();

chatRouter.post('/', async (req: Request, res: Response) => {
  const { message, context } = req.body;

  if (!message) {
    res.status(400).json({ error: 'Message is required' });
    return;
  }

  // If no API key, return a simulated response
  if (!process.env.ANTHROPIC_API_KEY) {
    const simulated = getSimulatedResponse(message);
    res.json({ response: simulated });
    return;
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const systemPrompt = `You are ComplianceGPT Assistant, an AI expert in ISO compliance standards (ISO 37001, 37301, 27001, 9001).
You help users understand compliance requirements, assessment results, and remediation strategies.
${context ? `Current assessment context: ${JSON.stringify(context)}` : ''}
Keep responses concise and actionable.`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: message }],
    });

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('\n');

    res.json({ response: text });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errMsg });
  }
});

function getSimulatedResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('score') || lower.includes('overall')) {
    return 'Your overall compliance score is 62%, which indicates a Maturity Level 3 (Defined). Key areas for improvement include ISO 37001 clauses on financial controls and due diligence, as well as ISO 27001 risk treatment procedures.';
  }
  if (lower.includes('gap') || lower.includes('risk')) {
    return 'The assessment identified 12 gaps across 4 standards. The most critical are: (1) Insufficient due diligence procedures (ISO 37001 §8.2), (2) Missing risk treatment plan (ISO 27001 §8.3), and (3) Incomplete compliance obligation register (ISO 37301 §4.5). I recommend prioritizing these in Phase 1 of your remediation roadmap.';
  }
  if (lower.includes('remediation') || lower.includes('fix') || lower.includes('improve')) {
    return 'Your remediation roadmap has 3 phases: Phase 1 (Immediate, 30 days) — Address 4 critical gaps including policy documentation and risk assessments. Phase 2 (Short-term, 90 days) — Implement training programs and control frameworks. Phase 3 (Long-term, 180 days) — Establish continuous monitoring and improvement processes.';
  }
  if (lower.includes('iso 37001') || lower.includes('bribery') || lower.includes('anti-bribery')) {
    return 'ISO 37001 scored 54% (Maturity Level 2). Key findings: Due diligence procedures need significant enhancement (§8.2: 30%), financial controls lack documentation (§8.3: 35%), and whistleblowing channels are insufficiently promoted (§8.6: 40%). Strengths include leadership commitment (§5.1: 72%).';
  }
  return 'I can help you understand your compliance assessment results, identify gaps, and plan remediation strategies. Try asking about your overall score, specific standards, gap analysis, or remediation recommendations.';
}
