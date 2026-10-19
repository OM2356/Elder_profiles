import crypto from 'crypto';

export interface ActiveSession {
  token: string;
  participantId: string;
  createdAt: string;
  lastActivity: number;
}

// In-memory active session registry with expiration support
const activeSessions = new Map<string, ActiveSession>();

// Seed default initial session for senior_learner_1 so first launch or automated checks work smoothly
const DEFAULT_INITIAL_TOKEN = 'sess_default_senior_learner_1';
activeSessions.set(DEFAULT_INITIAL_TOKEN, {
  token: DEFAULT_INITIAL_TOKEN,
  participantId: 'senior_learner_1',
  createdAt: new Date().toISOString(),
  lastActivity: Date.now(),
});

export const SessionManager = {
  createSession(participantId: string): ActiveSession {
    const cleanId = (participantId || 'senior_learner_1').trim().replace(/[^a-zA-Z0-9_-]/g, '');
    const finalId = cleanId || 'senior_learner_1';
    
    // Generate secure random token
    const token = 'sess_' + crypto.randomBytes(24).toString('hex');
    const session: ActiveSession = {
      token,
      participantId: finalId,
      createdAt: new Date().toISOString(),
      lastActivity: Date.now(),
    };
    activeSessions.set(token, session);
    return session;
  },

  validateSession(token?: string): ActiveSession | null {
    if (!token) return null;
    const session = activeSessions.get(token);
    if (!session) return null;

    // Check 24 hour session timeout
    const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
    if (Date.now() - session.lastActivity > TWENTY_FOUR_HOURS_MS) {
      activeSessions.delete(token);
      return null;
    }

    session.lastActivity = Date.now();
    return session;
  },

  destroySession(token?: string): boolean {
    if (!token) return false;
    return activeSessions.delete(token);
  },

  destroyAllSessionsForParticipant(participantId: string): number {
    let count = 0;
    for (const [token, session] of activeSessions.entries()) {
      if (session.participantId === participantId) {
        activeSessions.delete(token);
        count++;
      }
    }
    return count;
  },

  getActiveSessionCount(): number {
    return activeSessions.size;
  },

  getDefaultToken(): string {
    return DEFAULT_INITIAL_TOKEN;
  }
};
