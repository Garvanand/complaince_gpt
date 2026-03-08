import { Router, Request, Response } from 'express';
import { isoStandards } from '../data/standards';

export const standardsRouter = Router();

standardsRouter.get('/', (_req: Request, res: Response) => {
  const summary = Object.values(isoStandards).map((s) => ({
    code: s.code,
    name: s.name,
    fullName: s.fullName,
    clauseCount: s.clauses.length,
  }));
  res.json(summary);
});

standardsRouter.get('/:code/clauses', (req: Request, res: Response) => {
  const code = req.params.code as string;
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
