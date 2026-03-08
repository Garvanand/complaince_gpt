/**
 * HybridScoringService — Multi-tiered compliance scoring
 *
 * Tier 1: Local ML scoring via Python microservice (sentence-transformers)
 * Tier 2: Claude AI enhancement (if ANTHROPIC_API_KEY is set)
 * Tier 3: Keyword-based fallback (always available)
 *
 * The service gracefully degrades — works without ML service,
 * works without Anthropic API, and always has keyword fallback.
 */

import { isoStandardsEnhanced, ISOClause, ISOStandard } from '../data/isoStandards';

interface ClauseScoreResult {
  clauseId: string;
  clauseTitle: string;
  score: number;
  confidence: string;
  method: string;
  finding: string;
}

interface StandardScoringResult {
  standard: string;
  name: string;
  overallScore: number;
  maturityLevel: number;
  clauseScores: ClauseScoreResult[];
  scoringMethod: string;
}

interface MLScoreResponse {
  results: Array<{
    clauseId: string;
    clauseTitle: string;
    score: number;
    confidence: string;
    method: string;
    semanticSimilarity: number;
    keywordMatchRatio: number;
  }>;
  aggregate: {
    averageScore: number;
    totalClauses: number;
  };
}

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

function getMaturityLevel(score: number): number {
  if (score >= 90) return 5;
  if (score >= 75) return 4;
  if (score >= 60) return 3;
  if (score >= 40) return 2;
  return 1;
}

function generateFinding(clause: ISOClause, score: number): string {
  if (score >= 80) {
    return `Strong compliance with ${clause.title}. Evidence of implementation aligns well with ${clause.id} requirements.`;
  }
  if (score >= 60) {
    return `Partial compliance with ${clause.title}. Some evidence found but gaps remain in fully meeting ${clause.id} requirements.`;
  }
  if (score >= 30) {
    return `Limited compliance with ${clause.title}. Minimal evidence of ${clause.id} implementation. Remediation recommended.`;
  }
  return `Non-compliant with ${clause.title}. No evidence found for ${clause.id}. Immediate action required.`;
}

// ─── Tier 1: ML Scoring ──────────────────────────────────────────────────────

async function scoreWithML(
  documentText: string,
  clauses: ISOClause[],
): Promise<ClauseScoreResult[] | null> {
  try {
    const response = await fetch(`${ML_SERVICE_URL}/score-all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentText: documentText.slice(0, 8000),
        clauses: clauses.map(c => ({
          id: c.id,
          title: c.title,
          description: c.description,
          guidance: c.guidance,
          keywords: c.keywords,
        })),
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) return null;

    const data = await response.json() as MLScoreResponse;
    return data.results.map(r => ({
      clauseId: r.clauseId,
      clauseTitle: r.clauseTitle,
      score: r.score,
      confidence: r.confidence,
      method: r.method,
      finding: generateFinding(
        clauses.find(c => c.id === r.clauseId) || clauses[0],
        r.score,
      ),
    }));
  } catch {
    return null;
  }
}

// ─── Tier 2: Claude Enhancement ──────────────────────────────────────────────

async function enhanceWithClaude(
  documentText: string,
  standardCode: string,
  baseScores: ClauseScoreResult[],
): Promise<ClauseScoreResult[] | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  try {
    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const client = new Anthropic({ apiKey });

    const prompt = `You are a compliance assessment expert. Analyze this policy document against ${standardCode} clauses and refine the preliminary scores.

DOCUMENT (excerpt):
${documentText.slice(0, 4000)}

PRELIMINARY SCORES:
${baseScores.map(s => `${s.clauseId} (${s.clauseTitle}): ${s.score}% - ${s.finding}`).join('\n')}

For each clause, provide a refined score (0-100) and a specific finding based on the document content.
Return ONLY valid JSON:
{
  "clauseScores": [
    { "clauseId": "4.1", "score": 72, "finding": "..." },
    ...
  ]
}`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content
      .filter((b): b is Extract<typeof b, { type: 'text' }> => b.type === 'text')
      .map(b => b.text)
      .join('');

    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text];
    const parsed = JSON.parse(jsonMatch[1]?.trim() || '{}');

    if (parsed.clauseScores && Array.isArray(parsed.clauseScores)) {
      return baseScores.map(base => {
        const enhanced = parsed.clauseScores.find(
          (cs: { clauseId: string }) => cs.clauseId === base.clauseId,
        );
        if (enhanced) {
          return {
            ...base,
            score: Math.max(0, Math.min(100, enhanced.score)),
            finding: enhanced.finding || base.finding,
            method: 'ml+claude',
            confidence: 'high',
          };
        }
        return base;
      });
    }

    return null;
  } catch {
    return null;
  }
}

// ─── Tier 3: Keyword Fallback ────────────────────────────────────────────────

function scoreWithKeywords(
  documentText: string,
  clauses: ISOClause[],
): ClauseScoreResult[] {
  const textLower = documentText.toLowerCase();

  return clauses.map(clause => {
    const keywordMatches = clause.keywords.filter(kw => textLower.includes(kw.toLowerCase()));
    const matchRatio = clause.keywords.length > 0 ? keywordMatches.length / clause.keywords.length : 0;
    const score = Math.round(matchRatio * 85 + (matchRatio > 0.5 ? 15 : 0));

    return {
      clauseId: clause.id,
      clauseTitle: clause.title,
      score: Math.min(100, score),
      confidence: matchRatio > 0.6 ? 'medium' : 'low',
      method: 'keyword-fallback',
      finding: generateFinding(clause, score),
    };
  });
}

// ─── Main Entry Point ────────────────────────────────────────────────────────

export async function scoreStandard(
  documentText: string,
  standardCode: string,
  onLog?: (msg: string) => void,
): Promise<StandardScoringResult> {
  const standard = isoStandardsEnhanced[standardCode];
  if (!standard) {
    throw new Error(`Unknown standard: ${standardCode}`);
  }

  onLog?.(`[HybridScoring] Scoring ${standardCode} (${standard.clauses.length} clauses)...`);

  let clauseScores: ClauseScoreResult[];
  let scoringMethod = 'keyword-fallback';

  // Try Tier 1: ML scoring
  onLog?.(`[HybridScoring] Attempting ML scoring via ${ML_SERVICE_URL}...`);
  const mlScores = await scoreWithML(documentText, standard.clauses);

  if (mlScores) {
    onLog?.(`[HybridScoring] ML scoring successful. Attempting Claude enhancement...`);
    scoringMethod = 'ml-semantic';

    // Try Tier 2: Claude enhancement
    const enhancedScores = await enhanceWithClaude(documentText, standardCode, mlScores);
    if (enhancedScores) {
      clauseScores = enhancedScores;
      scoringMethod = 'ml+claude';
      onLog?.(`[HybridScoring] Claude enhancement applied.`);
    } else {
      clauseScores = mlScores;
      onLog?.(`[HybridScoring] Using ML scores (Claude unavailable).`);
    }
  } else {
    onLog?.(`[HybridScoring] ML service unavailable. Using keyword fallback...`);

    // Try Claude-only if ML fails
    const keywordScores = scoreWithKeywords(documentText, standard.clauses);
    const claudeEnhanced = await enhanceWithClaude(documentText, standardCode, keywordScores);

    if (claudeEnhanced) {
      clauseScores = claudeEnhanced;
      scoringMethod = 'claude-only';
      onLog?.(`[HybridScoring] Using Claude-only scoring.`);
    } else {
      clauseScores = keywordScores;
      scoringMethod = 'keyword-fallback';
      onLog?.(`[HybridScoring] Using keyword fallback scoring.`);
    }
  }

  const overallScore = Math.round(
    clauseScores.reduce((sum, cs) => sum + cs.score, 0) / clauseScores.length,
  );

  onLog?.(`[HybridScoring] ${standardCode} complete: ${overallScore}% (method: ${scoringMethod})`);

  return {
    standard: standardCode,
    name: standard.fullName,
    overallScore,
    maturityLevel: getMaturityLevel(overallScore),
    clauseScores,
    scoringMethod,
  };
}

export async function scoreAllStandards(
  documentText: string,
  standardCodes: string[],
  onLog?: (msg: string) => void,
): Promise<StandardScoringResult[]> {
  const results: StandardScoringResult[] = [];

  for (const code of standardCodes) {
    const result = await scoreStandard(documentText, code, onLog);
    results.push(result);
  }

  return results;
}

export async function checkMLServiceHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${ML_SERVICE_URL}/health`, {
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
