import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { parseDocument, combineDocumentTexts } from '../services/documentParser';
import { runOrchestrator, AssessmentResult } from '../agents/orchestrator';

export const assessmentRouter = Router();

// In-memory store for assessments
const assessments = new Map<string, { status: string; result?: AssessmentResult; logs: string[] }>();
const sseClients = new Map<string, Response[]>();

assessmentRouter.post('/start', async (req: Request, res: Response) => {
  const { filePaths, standards, orgProfile } = req.body;

  if (!standards || !Array.isArray(standards) || standards.length === 0) {
    res.status(400).json({ error: 'At least one standard is required' });
    return;
  }

  const assessmentId = uuidv4();
  assessments.set(assessmentId, { status: 'processing', logs: [] });

  res.json({ assessmentId, status: 'processing' });

  // Run assessment asynchronously
  (async () => {
    try {
      let documentText = '';
      if (filePaths && Array.isArray(filePaths) && filePaths.length > 0) {
        const texts = await Promise.all(filePaths.map((fp: string) => parseDocument(fp)));
        documentText = combineDocumentTexts(texts);
      } else {
        documentText = 'No documents uploaded. Using organizational profile for assessment.';
      }

      const sendSSE = (data: Record<string, unknown>) => {
        const clients = sseClients.get(assessmentId) || [];
        const msg = `data: ${JSON.stringify(data)}\n\n`;
        clients.forEach((client) => {
          try { client.write(msg); } catch { /* client disconnected */ }
        });
      };

      await runOrchestrator(documentText, standards, orgProfile, {
        onAgentStart: (agentName) => {
          sendSSE({ type: 'agent-start', agent: agentName, timestamp: new Date().toISOString() });
        },
        onAgentComplete: (agentName, result) => {
          sendSSE({ type: 'agent-complete', agent: agentName, timestamp: new Date().toISOString() });
          const entry = assessments.get(assessmentId);
          if (entry) entry.logs.push(`${agentName} completed`);
        },
        onAgentError: (agentName, error) => {
          sendSSE({ type: 'agent-error', agent: agentName, error, timestamp: new Date().toISOString() });
        },
        onLog: (message) => {
          sendSSE({ type: 'log', message, timestamp: new Date().toISOString() });
          const entry = assessments.get(assessmentId);
          if (entry) entry.logs.push(message);
        },
        onComplete: (result) => {
          const entry = assessments.get(assessmentId);
          if (entry) {
            entry.status = 'complete';
            entry.result = result;
          }
          sendSSE({ type: 'complete', result, timestamp: new Date().toISOString() });

          // Close SSE connections
          const clients = sseClients.get(assessmentId) || [];
          clients.forEach((client) => {
            try { client.end(); } catch { /* ignore */ }
          });
          sseClients.delete(assessmentId);
        },
      });
    } catch (error) {
      const entry = assessments.get(assessmentId);
      if (entry) entry.status = 'error';
      const clients = sseClients.get(assessmentId) || [];
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      clients.forEach((client) => {
        try {
          client.write(`data: ${JSON.stringify({ type: 'error', message: errMsg })}\n\n`);
          client.end();
        } catch { /* ignore */ }
      });
    }
  })();
});

assessmentRouter.get('/:id/stream', (req: Request, res: Response) => {
  const id = req.params.id as string;
  const entry = assessments.get(id);

  if (!entry) {
    res.status(404).json({ error: 'Assessment not found' });
    return;
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send existing logs
  for (const log of entry.logs) {
    res.write(`data: ${JSON.stringify({ type: 'log', message: log })}\n\n`);
  }

  if (entry.status === 'complete' && entry.result) {
    res.write(`data: ${JSON.stringify({ type: 'complete', result: entry.result })}\n\n`);
    res.end();
    return;
  }

  if (!sseClients.has(id)) sseClients.set(id, []);
  sseClients.get(id)!.push(res);

  req.on('close', () => {
    const clients = sseClients.get(id);
    if (clients) {
      const idx = clients.indexOf(res);
      if (idx >= 0) clients.splice(idx, 1);
    }
  });
});

assessmentRouter.get('/:id/results', (req: Request, res: Response) => {
  const id = req.params.id as string;
  const entry = assessments.get(id);

  if (!entry) {
    res.status(404).json({ error: 'Assessment not found' });
    return;
  }

  if (entry.status !== 'complete') {
    res.json({ status: entry.status, logs: entry.logs });
    return;
  }

  res.json({ status: 'complete', result: entry.result });
});
