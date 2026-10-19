import { VerificationStatus } from './verification';

export interface InteractionRecord {
  id: number;
  participant_id: string;
  input_modality: 'text' | 'voice';
  language: 'en' | 'hi' | 'mr';
  agent_used: string;
  question: string;
  answer: string;
  sources_retrieved: string[];
  verification_status: VerificationStatus;
  confidence_score: number;
  feedback?: 'Good' | 'Okay' | 'Not good';
  feedback_notes?: string;
  response_time_ms: number;
  created_at: string;
}

export interface FeedbackRecord {
  id: number;
  interaction_id: number;
  rating: 'Good' | 'Okay' | 'Not good';
  notes?: string;
  created_at: string;
}

export interface UserPreferences {
  participant_id: string;
  language: 'en' | 'hi' | 'mr';
  font_size: 'normal' | 'large' | 'xlarge';
  simplicity_level: 'standard' | 'ultra_simple';
  speech_rate: number;
  consent_history_retention: boolean;
  updated_at: string;
}

export interface TopicProgressRecord {
  id: number;
  participant_id: string;
  topic_id: string;
  topic_title: string;
  completed: boolean;
  visited_at: string;
}

export interface ResearchSummary {
  totalInteractions: number;
  totalFeedback: number;
  feedbackDistribution: {
    Good: number;
    Okay: number;
    NotGood: number;
    satisfactionRatePercent: number;
  };
  agentDistribution: Record<string, number>;
  verificationDistribution: Record<string, number>;
  languageDistribution: Record<string, number>;
  modalityDistribution: Record<string, number>;
  retrievalHitRatePercent: number;
  averageResponseLatencyMs: number;
}

// In-Memory Data Store with Schema Management & Migration Simulation
let nextInteractionId = 1;
let nextFeedbackId = 1;
let nextProgressId = 1;

const interactions: InteractionRecord[] = [];
const feedbacks: FeedbackRecord[] = [];
const preferencesMap = new Map<string, UserPreferences>();
const progressList: TopicProgressRecord[] = [];

// Initial Seed Record
interactions.push({
  id: nextInteractionId++,
  participant_id: 'senior_learner_1',
  input_modality: 'text',
  language: 'en',
  agent_used: 'Learning Agent',
  question: 'How do I connect to Wi-Fi at home?',
  answer:
    "Let's connect to your home Wi-Fi step by step:\n\n1. Open Settings on your phone (the gear icon).\n2. Tap Wi-Fi or Network & Internet.\n3. Turn Wi-Fi switch ON.\n4. Select your home network name.\n5. Type your password and tap Connect.",
  sources_retrieved: ['Connecting Safely to Internet and Home Wi-Fi'],
  verification_status: 'VERIFIED',
  confidence_score: 0.95,
  feedback: 'Good',
  response_time_ms: 120,
  created_at: new Date(Date.now() - 7200000).toISOString(),
});

feedbacks.push({
  id: nextFeedbackId++,
  interaction_id: 1,
  rating: 'Good',
  created_at: new Date(Date.now() - 7100000).toISOString(),
});

progressList.push({
  id: nextProgressId++,
  participant_id: 'senior_learner_1',
  topic_id: 'doc-wifi-internet',
  topic_title: 'Connecting Safely to Internet and Home Wi-Fi',
  completed: true,
  visited_at: new Date(Date.now() - 7200000).toISOString(),
});

export const Database = {
  // Interactions
  saveInteraction(
    data: Omit<InteractionRecord, 'id' | 'created_at'>
  ): InteractionRecord {
    const record: InteractionRecord = {
      ...data,
      id: nextInteractionId++,
      created_at: new Date().toISOString(),
    };
    interactions.push(record);
    return record;
  },

  getAllInteractions(): InteractionRecord[] {
    return [...interactions].reverse();
  },

  getInteractionsByParticipant(participantId: string): InteractionRecord[] {
    return interactions
      .filter((i) => i.participant_id === participantId)
      .reverse();
  },

  getInteractionById(id: number): InteractionRecord | undefined {
    return interactions.find((i) => i.id === id);
  },

  deleteInteraction(id: number): boolean {
    const idx = interactions.findIndex((i) => i.id === id);
    if (idx !== -1) {
      interactions.splice(idx, 1);
      return true;
    }
    return false;
  },

  // Feedback
  recordFeedback(
    interactionId: number,
    rating: 'Good' | 'Okay' | 'Not good',
    notes?: string
  ): FeedbackRecord | null {
    const interaction = interactions.find((i) => i.id === interactionId);
    if (!interaction) return null;

    interaction.feedback = rating;
    if (notes) interaction.feedback_notes = notes;

    const feedbackRec: FeedbackRecord = {
      id: nextFeedbackId++,
      interaction_id: interactionId,
      rating,
      notes,
      created_at: new Date().toISOString(),
    };
    feedbacks.push(feedbackRec);
    return feedbackRec;
  },

  getAllFeedback(): FeedbackRecord[] {
    return [...feedbacks];
  },

  // User Preferences (Adaptation System)
  getUserPreferences(participantId: string): UserPreferences {
    if (!preferencesMap.has(participantId)) {
      preferencesMap.set(participantId, {
        participant_id: participantId,
        language: 'en',
        font_size: 'large',
        simplicity_level: 'standard',
        speech_rate: 0.85,
        consent_history_retention: true,
        updated_at: new Date().toISOString(),
      });
    }
    return preferencesMap.get(participantId)!;
  },

  saveUserPreferences(
    prefs: Partial<UserPreferences> & { participant_id: string }
  ): UserPreferences {
    const current = this.getUserPreferences(prefs.participant_id);
    const updated: UserPreferences = {
      ...current,
      ...prefs,
      updated_at: new Date().toISOString(),
    };
    preferencesMap.set(prefs.participant_id, updated);
    return updated;
  },

  deleteUserPreferences(participantId: string): boolean {
    return preferencesMap.delete(participantId);
  },

  // Learning Progress Tracking
  recordTopicProgress(
    participantId: string,
    topicId: string,
    topicTitle: string,
    completed: boolean = true
  ): TopicProgressRecord {
    const existing = progressList.find(
      (p) => p.participant_id === participantId && p.topic_id === topicId
    );

    if (existing) {
      existing.completed = completed;
      existing.visited_at = new Date().toISOString();
      return existing;
    }

    const rec: TopicProgressRecord = {
      id: nextProgressId++,
      participant_id: participantId,
      topic_id: topicId,
      topic_title: topicTitle,
      completed,
      visited_at: new Date().toISOString(),
    };
    progressList.push(rec);
    return rec;
  },

  getTopicProgress(participantId: string): TopicProgressRecord[] {
    return progressList.filter((p) => p.participant_id === participantId);
  },

  // Research Summary Analytics
  getResearchSummary(): ResearchSummary {
    const totalInteractions = interactions.length;
    const totalFeedback = feedbacks.length;

    const good = feedbacks.filter((f) => f.rating === 'Good').length;
    const okay = feedbacks.filter((f) => f.rating === 'Okay').length;
    const notGood = feedbacks.filter((f) => f.rating === 'Not good').length;
    const satisfactionRatePercent =
      totalFeedback > 0 ? Math.round(((good + okay * 0.5) / totalFeedback) * 100) : 100;

    const agentDistribution: Record<string, number> = {};
    const verificationDistribution: Record<string, number> = {};
    const languageDistribution: Record<string, number> = {};
    const modalityDistribution: Record<string, number> = {};
    let totalLatency = 0;
    let retrievalHits = 0;

    for (const item of interactions) {
      agentDistribution[item.agent_used] = (agentDistribution[item.agent_used] || 0) + 1;
      verificationDistribution[item.verification_status] =
        (verificationDistribution[item.verification_status] || 0) + 1;
      languageDistribution[item.language] = (languageDistribution[item.language] || 0) + 1;
      modalityDistribution[item.input_modality] =
        (modalityDistribution[item.input_modality] || 0) + 1;
      totalLatency += item.response_time_ms || 0;
      if (item.sources_retrieved && item.sources_retrieved.length > 0) {
        retrievalHits++;
      }
    }

    const retrievalHitRatePercent =
      totalInteractions > 0 ? Math.round((retrievalHits / totalInteractions) * 100) : 0;
    const averageResponseLatencyMs =
      totalInteractions > 0 ? Math.round(totalLatency / totalInteractions) : 0;

    return {
      totalInteractions,
      totalFeedback,
      feedbackDistribution: {
        Good: good,
        Okay: okay,
        NotGood: notGood,
        satisfactionRatePercent,
      },
      agentDistribution,
      verificationDistribution,
      languageDistribution,
      modalityDistribution,
      retrievalHitRatePercent,
      averageResponseLatencyMs,
    };
  },

  clearAllData(): void {
    interactions.length = 0;
    feedbacks.length = 0;
    progressList.length = 0;
    nextInteractionId = 1;
    nextFeedbackId = 1;
    nextProgressId = 1;
  },

  exportDatabaseDump(): {
    exportedAt: string;
    interactions: InteractionRecord[];
    feedback: FeedbackRecord[];
    preferences: UserPreferences[];
    progress: TopicProgressRecord[];
  } {
    return {
      exportedAt: new Date().toISOString(),
      interactions,
      feedback: feedbacks,
      preferences: Array.from(preferencesMap.values()),
      progress: progressList,
    };
  },
};
