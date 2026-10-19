import React from 'react';
import {
  Award,
  CheckCircle2,
  Circle,
  Clock,
  ThumbsUp,
  MessageSquare,
  BookOpen,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import { EducationalGuide, InteractionRecord, TopicProgressRecord } from '../types';

interface ProgressDashboardProps {
  participantId: string;
  interactions: InteractionRecord[];
  progress: TopicProgressRecord[];
  guides: EducationalGuide[];
  onPracticeTopic: (title: string) => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  participantId,
  interactions,
  progress,
  guides,
  onPracticeTopic,
}) => {
  const completedTopicIds = new Set(
    progress.filter((p) => p.completed).map((p) => p.topic_id)
  );

  const totalTopicsCount = guides.length || 7;
  const completedCount = completedTopicIds.size;
  const completionPercentage = Math.round((completedCount / totalTopicsCount) * 100);

  const ratedInteractions = interactions.filter((i) => i.feedback);
  const goodRatingsCount = ratedInteractions.filter((i) => i.feedback === 'Good').length;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2.5 rounded-2xl bg-amber-100 text-amber-700">
              <Award className="w-6 h-6" />
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
              My Learning Journey & Progress
            </h2>
          </div>
          <p className="text-xs md:text-sm text-slate-500">
            Real recorded learning milestones for learner: <strong>{participantId}</strong>
          </p>
        </div>

        {/* Big Percentage Badge */}
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-3 px-5">
          <div className="text-right">
            <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">Course Progress</div>
            <div className="text-2xl font-extrabold text-amber-900">
              {completedCount} of {totalTopicsCount} Topics
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-500 text-white font-black text-sm flex items-center justify-center shadow-xs">
            {completionPercentage}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-2xs space-y-2">
        <div className="flex justify-between text-xs font-bold text-slate-700">
          <span>Overall Everyday Tech Mastery</span>
          <span className="text-amber-700">{completionPercentage}% Completed</span>
        </div>
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div
            className="bg-amber-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase">Questions Asked</span>
            <MessageSquare className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{interactions.length}</div>
          <div className="text-xs text-slate-500 mt-1">Interactions with Buddy tutor</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase">Topics Mastered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">{completedCount}</div>
          <div className="text-xs text-slate-500 mt-1">Step-by-step guides practiced</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase">Helpful Answers</span>
            <ThumbsUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600">{goodRatingsCount}</div>
          <div className="text-xs text-slate-500 mt-1">Answers rated Good by you</div>
        </div>
      </div>

      {/* 7 Core Learning Topics Checklists */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          Everyday Tech Checklist (Click to Practice Any Topic)
        </h3>
        <p className="text-xs text-slate-500">
          Topics you have explored with Buddy are automatically marked as completed.
        </p>

        <div className="divide-y divide-slate-100">
          {guides.map((guide) => {
            const isCompleted = completedTopicIds.has(guide.id);

            return (
              <div
                key={guide.id}
                className="py-3.5 flex flex-wrap items-center justify-between gap-3 hover:bg-slate-50/60 rounded-xl px-2 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-300 shrink-0" />
                  )}
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm md:text-base">{guide.title}</h4>
                    <span className="text-xs text-slate-500">{guide.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {isCompleted ? 'Practiced' : 'Not Started'}
                  </span>
                  <button
                    onClick={() => onPracticeTopic(guide.title)}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1 transition-colors"
                  >
                    <span>Practice</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
