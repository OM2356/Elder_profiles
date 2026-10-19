import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { coordinateAndAnswer } from './server/coordinator';
import { generateSimplifiedAlternative, generateInstructionRecap } from './server/explanation';
import { Database } from './server/db';
import { educationalDocuments, ingestEducationalDocument } from './server/rag';
import { SessionManager } from './server/session';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(cors());
app.use(express.json());

// Session extraction helper
function extractSessionToken(req: Request): string | undefined {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  const customHeader = req.headers['x-session-token'];
  if (typeof customHeader === 'string' && customHeader.trim()) {
    return customHeader.trim();
  }
  if (req.body && typeof req.body.sessionToken === 'string' && req.body.sessionToken.trim()) {
    return req.body.sessionToken.trim();
  }
  if (typeof req.query.sessionToken === 'string' && req.query.sessionToken.trim()) {
    return req.query.sessionToken.trim();
  }
  return undefined;
}

// 1. Health check & Service status endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      server: 'running',
      database: 'connected',
      gemini_ai: process.env.GEMINI_API_KEY ? 'configured' : 'fallback_mode',
      rag_engine: 'active',
      documents_loaded: educationalDocuments.length,
    },
  });
});

// 1b. Session Management & Authentication Endpoints
app.post('/api/session/login', (req: Request, res: Response) => {
  try {
    const { participantId } = req.body;
    const session = SessionManager.createSession(participantId || 'senior_learner_1');
    const prefs = Database.getUserPreferences(session.participantId);
    res.json({
      success: true,
      sessionToken: session.token,
      participantId: session.participantId,
      preferences: prefs,
      message: 'Session created successfully',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create session' });
  }
});

app.post('/api/session/logout', (req: Request, res: Response) => {
  try {
    const token = extractSessionToken(req);
    if (token) {
      SessionManager.destroySession(token);
    }
    res.json({
      success: true,
      message: 'Session terminated. Session state cleared and chat history protected.',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to logout session' });
  }
});

app.get('/api/session/status', (req: Request, res: Response) => {
  const token = extractSessionToken(req);
  const session = SessionManager.validateSession(token);
  if (!session) {
    res.status(401).json({ authenticated: false, error: 'No active session or session expired' });
    return;
  }
  res.json({
    authenticated: true,
    participantId: session.participantId,
    createdAt: session.createdAt,
  });
});

// 2. Chat Pipeline: User Input -> Safety -> RAG -> Gemini -> Verification -> Explanation -> Database
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const token = extractSessionToken(req);
    const session = SessionManager.validateSession(token);

    if (!session) {
      res.status(401).json({
        error: 'Unauthorized: An active learner session is required. Please sign in to ask questions.',
      });
      return;
    }

    const { question, inputModality, language, simplicityLevel } = req.body;

    if (!question || typeof question !== 'string') {
      res.status(400).json({ error: 'Valid question is required' });
      return;
    }

    const result = await coordinateAndAnswer({
      question,
      participantId: session.participantId,
      inputModality: inputModality === 'voice' ? 'voice' : 'text',
      language: language === 'hi' ? 'hi' : language === 'mr' ? 'mr' : 'en',
      simplicityLevel: simplicityLevel === 'ultra_simple' ? 'ultra_simple' : 'standard',
    });

    res.json(result);
  } catch (error) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ error: 'Failed to process question' });
  }
});

// 3. Simplify Answer ("Explain more simply")
app.post('/api/simplify', (req: Request, res: Response) => {
  try {
    const { answer, language } = req.body;
    if (!answer) {
      res.status(400).json({ error: 'Answer is required' });
      return;
    }
    const simplified = generateSimplifiedAlternative(answer, language || 'en');
    res.json({ simplified });
  } catch (error) {
    res.status(500).json({ error: 'Failed to simplify answer' });
  }
});

// 4. Repeat Instructions
app.post('/api/repeat', (req: Request, res: Response) => {
  try {
    const { answer, language } = req.body;
    if (!answer) {
      res.status(400).json({ error: 'Answer is required' });
      return;
    }
    const repeated = generateInstructionRecap(answer, language || 'en');
    res.json({ repeated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to repeat instructions' });
  }
});

// 5. Feedback Collection
app.post('/api/feedback', (req: Request, res: Response) => {
  try {
    const { interactionId, rating, notes } = req.body;
    if (!interactionId || !['Good', 'Okay', 'Not good'].includes(rating)) {
      res.status(400).json({ error: 'Valid interactionId and rating (Good, Okay, Not good) required' });
      return;
    }

    const feedback = Database.recordFeedback(Number(interactionId), rating, notes);
    if (!feedback) {
      res.status(404).json({ error: 'Interaction not found' });
      return;
    }

    res.json({ success: true, feedback });
  } catch (error) {
    console.error('Error in /api/feedback:', error);
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

// 6. Educational Topics & Guides (Module 8 & 13)
app.get('/api/topics', (req: Request, res: Response) => {
  const query = ((req.query.q as string) || '').toLowerCase().trim();
  const category = ((req.query.category as string) || '').trim();

  let topics = educationalDocuments;

  if (category && category !== 'All') {
    topics = topics.filter((t) => t.category.toLowerCase() === category.toLowerCase());
  }

  if (query) {
    topics = topics.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        t.summary.toLowerCase().includes(query) ||
        t.keywords.some((k) => k.toLowerCase().includes(query)) ||
        t.chunks.some((c) => c.content.toLowerCase().includes(query))
    );
  }

  res.json({ topics });
});

// 7. Track User Progress on Learning Topics (Module 3 & 11)
app.get('/api/progress/:participantId', (req: Request, res: Response) => {
  const targetId = String(req.params.participantId);
  const token = extractSessionToken(req);
  const session = SessionManager.validateSession(token);
  const isAdmin =
    req.headers['x-admin-key'] === 'buddy-research-admin' ||
    req.query.admin === 'true';

  if (!isAdmin && (!session || session.participantId !== targetId)) {
    res.status(401).json({
      error: 'Unauthorized: Access to learning progress restricted to session owner',
      progress: [],
    });
    return;
  }

  const progress = Database.getTopicProgress(targetId);
  res.json({ progress });
});

app.post('/api/progress', (req: Request, res: Response) => {
  try {
    const { participantId, topicId, topicTitle, completed } = req.body;
    if (!participantId || !topicId) {
      res.status(400).json({ error: 'participantId and topicId are required' });
      return;
    }

    const rec = Database.recordTopicProgress(
      participantId,
      topicId,
      topicTitle || 'Learning Topic',
      completed !== false
    );
    res.json({ success: true, progress: rec });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record progress' });
  }
});

// 8. User Preferences (Adaptation System - Module 10)
app.get('/api/preferences/:participantId', (req: Request, res: Response) => {
  const participantId = String(req.params.participantId);
  const prefs = Database.getUserPreferences(participantId);
  res.json({ preferences: prefs });
});

app.post('/api/preferences', (req: Request, res: Response) => {
  try {
    const { participantId, language, fontSize, simplicityLevel, speechRate, consentHistoryRetention } =
      req.body;

    if (!participantId) {
      res.status(400).json({ error: 'participantId is required' });
      return;
    }

    const updated = Database.saveUserPreferences({
      participant_id: participantId,
      language,
      font_size: fontSize,
      simplicity_level: simplicityLevel,
      speech_rate: speechRate,
      consent_history_retention: consentHistoryRetention,
    });

    res.json({ success: true, preferences: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

app.delete('/api/preferences/:participantId', (req: Request, res: Response) => {
  const participantId = String(req.params.participantId);
  const deleted = Database.deleteUserPreferences(participantId);
  res.json({ success: deleted });
});

// 9. Document Ingestion Pipeline for Administrators (Module 8 & 13)
app.post('/api/documents/ingest', (req: Request, res: Response) => {
  try {
    const { title, category, content, keywords } = req.body;
    if (!title || !content || !category) {
      res.status(400).json({ error: 'title, category, and content are required' });
      return;
    }

    const doc = ingestEducationalDocument(
      title,
      category,
      content,
      Array.isArray(keywords) ? keywords : []
    );
    res.json({ success: true, document: doc });
  } catch (error) {
    res.status(500).json({ error: 'Failed to ingest document' });
  }
});

// 10. Research Summary Analytics & Audit
app.get('/api/summary', (_req: Request, res: Response) => {
  res.json(Database.getResearchSummary());
});

app.get('/api/interactions', (req: Request, res: Response) => {
  const isAdmin =
    req.headers['x-admin-key'] === 'buddy-research-admin' ||
    req.query.admin === 'true';

  if (isAdmin) {
    res.json({ interactions: Database.getAllInteractions(), isAdmin: true });
    return;
  }

  const token = extractSessionToken(req);
  const session = SessionManager.validateSession(token);

  if (!session) {
    res.status(401).json({
      error: 'Unauthorized: Active learner session required to access chat history',
      interactions: [],
    });
    return;
  }

  // Returns ONLY the interactions for the authenticated learner session
  const userInteractions = Database.getInteractionsByParticipant(session.participantId);
  res.json({
    interactions: userInteractions,
    participantId: session.participantId,
  });
});

// 11. Data Export & Reset Controls
app.get('/api/export', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="buddy_research_export.json"');
  res.send(JSON.stringify(Database.exportDatabaseDump(), null, 2));
});

app.post('/api/reset', (_req: Request, res: Response) => {
  Database.clearAllData();
  res.json({ success: true });
});

// Vite Middleware & Static Serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Buddy AI Application server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});
