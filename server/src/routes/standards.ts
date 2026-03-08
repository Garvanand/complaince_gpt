import { Router, Request, Response } from 'express';
import { isoStandards } from '../data/standards';
import { isoStandardsEnhanced, getStandardSummary } from '../data/isoStandards';
import { checkMLServiceHealth } from '../services/HybridScoringService';

export const standardsRouter = Router();

standardsRouter.get('/', (_req: Request, res: Response) => {
  const summary = getStandardSummary();
  res.json(summary);
});

standardsRouter.get('/:code/clauses', (req: Request, res: Response) => {
  const code = req.params.code as string;
  const enhanced = isoStandardsEnhanced[code];

  if (enhanced) {
    res.json({
      code: enhanced.code,
      name: enhanced.name,
      fullName: enhanced.fullName,
      version: enhanced.version,
      clauses: enhanced.clauses,
    });
    return;
  }

  // Fallback to basic standards
  const standard = isoStandards[code as keyof typeof isoStandards];
  if (!standard) {
    res.status(404).json({ error: `Standard ${code} not found` });
    return;
  }

  res.json({
    code: standard.code,
    name: standard.name,
    fullName: standard.fullName,
    clauses: standard.clauses,
  });
});

standardsRouter.get('/health/ml', async (_req: Request, res: Response) => {
  const mlHealthy = await checkMLServiceHealth();
  const hasApiKey = !!process.env.ANTHROPIC_API_KEY;
  res.json({
    mlService: mlHealthy,
    anthropicApi: hasApiKey,
    scoringMode: mlHealthy && hasApiKey ? 'ml+claude' : mlHealthy ? 'ml-only' : hasApiKey ? 'claude-only' : 'keyword-fallback',
  });
});
