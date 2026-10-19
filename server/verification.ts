import { RetrievalResult } from './rag';

export type VerificationStatus = 'VERIFIED' | 'PARTIALLY_GROUNDED' | 'GENERAL_GUIDANCE' | 'SAFETY_OVERRIDE';

export interface VerificationReport {
  status: VerificationStatus;
  confidenceScore: number;
  citedSources: string[];
  evidenceFound: boolean;
  notes: string;
}

export function verifyAnswerAgainstEvidence(
  answer: string,
  retrievedResults: RetrievalResult[],
  isSafetyOverride: boolean = false
): VerificationReport {
  if (isSafetyOverride) {
    return {
      status: 'SAFETY_OVERRIDE',
      confidenceScore: 1.0,
      citedSources: ['Emergency Cyber Safety Protocol'],
      evidenceFound: true,
      notes: 'Response triggered safety protocol to prevent scam or credential exposure.',
    };
  }

  if (retrievedResults.length === 0) {
    return {
      status: 'GENERAL_GUIDANCE',
      confidenceScore: 0.7,
      citedSources: [],
      evidenceFound: false,
      notes: 'No specific approved educational document chunk matched; answer provides safe general guidance.',
    };
  }

  // Check which documents were matched
  const retrievedTitles = Array.from(new Set(retrievedResults.map((r) => r.chunk.docTitle)));
  const answerLower = answer.toLowerCase();

  const answerTokens = answer
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3);

  const allChunkContent = retrievedResults
    .map((r) => r.chunk.content.toLowerCase())
    .join(' ');

  let supportedAnswerTokens = 0;
  for (const token of answerTokens) {
    if (allChunkContent.includes(token)) {
      supportedAnswerTokens++;
    }
  }

  const overlapRatio = answerTokens.length > 0 ? supportedAnswerTokens / answerTokens.length : 0;

  // Determine status based on overlap ratio
  let status: VerificationStatus = 'PARTIALLY_GROUNDED';
  let confidenceScore = 0.8;

  if (overlapRatio > 0.35) {
    status = 'VERIFIED';
    confidenceScore = 0.95;
  } else if (overlapRatio > 0.15) {
    status = 'PARTIALLY_GROUNDED';
    confidenceScore = 0.82;
  } else {
    status = 'GENERAL_GUIDANCE';
    confidenceScore = 0.65;
  }

  return {
    status,
    confidenceScore: Math.round(confidenceScore * 100) / 100,
    citedSources: retrievedTitles,
    evidenceFound: true,
    notes:
      status === 'VERIFIED'
        ? 'Answer closely aligns with approved educational materials.'
        : 'Answer combines approved materials with conversational tutoring steps.',
  };
}
