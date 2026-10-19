export type Language = 'en' | 'hi' | 'mr';
export type FontSizeLevel = 'normal' | 'large' | 'xlarge';
export type SimplicityLevel = 'standard' | 'ultra_simple';
export type VerificationStatus = 'VERIFIED' | 'PARTIALLY_GROUNDED' | 'GENERAL_GUIDANCE' | 'SAFETY_OVERRIDE';

export interface InteractionRecord {
  id: number;
  participant_id: string;
  input_modality: 'text' | 'voice';
  language: Language;
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
  language: Language;
  font_size: FontSizeLevel;
  simplicity_level: SimplicityLevel;
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

export interface EducationalGuide {
  id: string;
  title: string;
  category: string;
  summary: string;
  keywords: string[];
  chunks: {
    id: string;
    docId: string;
    docTitle: string;
    category: string;
    content: string;
    keywords: string[];
  }[];
}
