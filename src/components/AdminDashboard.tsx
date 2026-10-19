import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Trash2,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Globe,
  Mic,
  MessageSquare,
  ThumbsUp,
  FileText,
  PieChart as PieIcon,
  Lock,
  Unlock,
  PlusCircle,
  AlertCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { InteractionRecord, ResearchSummary } from '../types';

interface AdminDashboardProps {
  summary: ResearchSummary | null;
  interactions: InteractionRecord[];
  onRefresh: () => void;
  onClearData: () => void;
  onDocumentIngested?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  summary,
  interactions,
  onRefresh,
  onClearData,
  onDocumentIngested,
}) => {
  // Admin Protection Gate (Default passkey: admin123)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Filters
  const [filterAgent, setFilterAgent] = useState('All');
  const [filterRating, setFilterRating] = useState('All');
  const [filterLanguage, setFilterLanguage] = useState('All');

  // Document Ingestion Form State
  const [showDocForm, setShowDocForm] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCategory, setNewDocCategory] = useState('Smartphone Basics');
  const [newDocContent, setNewDocContent] = useState('');
  const [newDocKeywords, setNewDocKeywords] = useState('');
  const [ingestStatus, setIngestStatus] = useState<string | null>(null);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkeyInput === 'admin123' || passkeyInput === 'buddy2026') {
      setIsAdminAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleIngestDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim() || !newDocContent.trim()) return;

    try {
      const res = await fetch('/api/documents/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newDocTitle.trim(),
          category: newDocCategory,
          content: newDocContent.trim(),
          keywords: newDocKeywords
            .split(',')
            .map((k) => k.trim())
            .filter(Boolean),
        }),
      });

      if (res.ok) {
        setIngestStatus('Document successfully ingested into the RAG vector engine!');
        setNewDocTitle('');
        setNewDocContent('');
        setNewDocKeywords('');
        if (onDocumentIngested) onDocumentIngested();
        setTimeout(() => setIngestStatus(null), 4000);
      }
    } catch (err) {
      setIngestStatus('Failed to ingest document.');
    }
  };

  const filteredInteractions = interactions.filter((item) => {
    if (filterAgent !== 'All' && item.agent_used !== filterAgent) return false;
    if (filterRating !== 'All' && item.feedback !== filterRating) return false;
    if (filterLanguage !== 'All' && item.language !== filterLanguage) return false;
    return true;
  });

  const handleExportJSON = () => {
    window.open('/api/export', '_blank');
  };

  // 1. Data for Feedback Distribution Pie Chart
  const goodCount = summary?.feedbackDistribution?.Good ?? 0;
  const okayCount = summary?.feedbackDistribution?.Okay ?? 0;
  const notGoodCount = summary?.feedbackDistribution?.NotGood ?? 0;
  const totalFeedbackCount = goodCount + okayCount + notGoodCount;

  const feedbackChartData = [
    {
      name: 'Good (😊)',
      value: goodCount,
      color: '#10b981', // emerald-500
    },
    {
      name: 'Okay (😐)',
      value: okayCount,
      color: '#f59e0b', // amber-500
    },
    {
      name: 'Not Good (🙁)',
      value: notGoodCount,
      color: '#f43f5e', // rose-500
    },
  ];

  // 2. Data for Language Usage Bar Chart
  const languageChartData = [
    {
      language: 'English',
      label: 'English',
      queries: summary?.languageDistribution?.en ?? 0,
      fill: '#2563eb', // blue-600
    },
    {
      language: 'Hindi',
      label: 'हिन्दी (Hindi)',
      queries: summary?.languageDistribution?.hi ?? 0,
      fill: '#0284c7', // sky-600
    },
    {
      language: 'Marathi',
      label: 'मराठी (Marathi)',
      queries: summary?.languageDistribution?.mr ?? 0,
      fill: '#7c3aed', // violet-600
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-slate-900 text-white text-xs rounded-xl px-3 py-2 shadow-lg border border-slate-700">
          <p className="font-bold">{data.name || data.payload?.label || data.payload?.language}</p>
          <p className="text-slate-200">
            Count: <span className="font-mono font-bold text-amber-300">{data.value}</span>
            {totalFeedbackCount > 0 && data.value > 0 && (
              <span className="text-slate-400 ml-1">
                ({Math.round((data.value / totalFeedbackCount) * 100)}%)
              </span>
            )}
          </p>
        </div>
      );
    }
    return null;
  };

  // If Admin Gate is locked, display secure access challenge
  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center space-y-5 animate-in fade-in">
        <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Protected Administrator Dashboard</h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Participant and research records are confidential. Enter the researcher passkey to view telemetry.
          </p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <input
              type="password"
              value={passkeyInput}
              onChange={(e) => setPasskeyInput(e.target.value)}
              placeholder="Enter Admin Passkey (default: admin123)"
              className="w-full text-center px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {authError && (
              <p className="text-xs text-red-600 mt-1.5 flex items-center justify-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Incorrect passkey. Try `admin123`
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm transition-colors shadow-xs"
          >
            Unlock Dashboard
          </button>
        </form>

        <p className="text-2xs text-slate-400 font-mono">
          Demo researcher key: <strong>admin123</strong>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
              Research & Evaluation Dashboard
            </h2>
            <span className="text-2xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <Unlock className="w-3 h-3" /> Authenticated
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-500">
            Real-time telemetry, visual charts, verification rates, latency metrics, and audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowDocForm(!showDocForm)}
            className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs md:text-sm flex items-center gap-1.5 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{showDocForm ? 'Close Ingest' : 'Upload Educational Doc'}</span>
          </button>
          <button
            onClick={onRefresh}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
            title="Refresh analytics data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleExportJSON}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs md:text-sm flex items-center gap-2 transition-colors shadow-2xs"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON Audit</span>
          </button>
          <button
            onClick={onClearData}
            className="px-3.5 py-2.5 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 font-semibold text-xs md:text-sm flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Logs</span>
          </button>
        </div>
      </div>

      {/* Optional Document Ingestion Form (Module 8 & Module 13) */}
      {showDocForm && (
        <div className="bg-white rounded-3xl border border-blue-200 p-6 md:p-8 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base md:text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Ingest New Educational Material (RAG Engine)
              </h3>
              <p className="text-xs text-slate-500">
                Upload approved teaching instructions. Content is chunked and indexed into the vector search engine.
              </p>
            </div>
            {ingestStatus && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                {ingestStatus}
              </span>
            )}
          </div>

          <form onSubmit={handleIngestDocument} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  placeholder="e.g. Setting Up Emergency Contacts (ICE)"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Topic Category
                </label>
                <select
                  value={newDocCategory}
                  onChange={(e) => setNewDocCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Smartphone Basics">Smartphone Basics</option>
                  <option value="Internet & Wi-Fi">Internet & Wi-Fi</option>
                  <option value="WhatsApp & Messaging">WhatsApp & Messaging</option>
                  <option value="Email & Video Calling">Email & Video Calling</option>
                  <option value="Online Fraud Awareness">Online Fraud Awareness</option>
                  <option value="Digital Payments & Privacy">Digital Payments & Privacy</option>
                  <option value="Accessibility Settings">Accessibility Settings</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Keywords (comma separated)
              </label>
              <input
                type="text"
                value={newDocKeywords}
                onChange={(e) => setNewDocKeywords(e.target.value)}
                placeholder="e.g. emergency, ice, lock screen, family, medical"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Educational Content / Numbered Steps
              </label>
              <textarea
                value={newDocContent}
                onChange={(e) => setNewDocContent(e.target.value)}
                rows={4}
                placeholder="Step 1. Open Settings... Step 2. Tap Safety & Emergency..."
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors shadow-2xs"
            >
              Ingest into RAG Engine
            </button>
          </form>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Interactions</span>
            <MessageSquare className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {summary?.totalInteractions ?? interactions.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Total questions processed</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Satisfaction</span>
            <ThumbsUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">
            {summary?.feedbackDistribution.satisfactionRatePercent ?? 100}%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {summary?.totalFeedback ?? 0} feedback reviews submitted
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">RAG Retrieval Hit Rate</span>
            <FileText className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600">
            {summary?.retrievalHitRatePercent ?? 0}%
          </div>
          <div className="text-xs text-slate-500 mt-1">Queries grounded in approved docs</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Latency</span>
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-extrabold text-purple-600">
            {summary?.averageResponseLatencyMs ?? 0} ms
          </div>
          <div className="text-xs text-slate-500 mt-1">End-to-end pipeline speed</div>
        </div>
      </div>

      {/* Visual Analytics Charts (Recharts Visualizations) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 1: Feedback Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-slate-900 text-base md:text-lg flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-emerald-600" />
                Feedback Distribution (Pie Chart)
              </h3>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {totalFeedbackCount} Total Ratings
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Visual breakdown of user ratings between Good (😊), Okay (😐), and Not Good (🙁)
            </p>
          </div>

          <div className="w-full h-64 min-h-[256px]">
            {totalFeedbackCount === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                <PieIcon className="w-12 h-12 stroke-1" />
                <p className="text-sm">No feedback ratings submitted yet</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={feedbackChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {feedbackChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                  <RechartsLegend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={(value) => <span className="text-xs font-semibold text-slate-700">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <div className="text-xs font-semibold">Good 😊</div>
              <div className="text-lg font-bold">{goodCount}</div>
            </div>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-800">
              <div className="text-xs font-semibold">Okay 😐</div>
              <div className="text-lg font-bold">{okayCount}</div>
            </div>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-800">
              <div className="text-xs font-semibold">Not Good 🙁</div>
              <div className="text-lg font-bold">{notGoodCount}</div>
            </div>
          </div>
        </div>

        {/* CHART 2: Language Usage Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-slate-900 text-base md:text-lg flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                Language Usage (Bar Chart)
              </h3>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Active Languages
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Distribution of educational interactions across English, Hindi, and Marathi
            </p>
          </div>

          <div className="w-full h-64 min-h-[256px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={languageChartData}
                margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="language"
                  tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <RechartsTooltip content={<CustomTooltip />} />
                <Bar dataKey="queries" radius={[8, 8, 0, 0]} barSize={48}>
                  {languageChartData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-800">
              <div className="text-xs font-semibold">English (en)</div>
              <div className="text-lg font-bold">{summary?.languageDistribution?.en ?? 0}</div>
            </div>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-800">
              <div className="text-xs font-semibold">हिन्दी (hi)</div>
              <div className="text-lg font-bold">{summary?.languageDistribution?.hi ?? 0}</div>
            </div>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-800">
              <div className="text-xs font-semibold">मराठी (mr)</div>
              <div className="text-lg font-bold">{summary?.languageDistribution?.mr ?? 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Verification Status Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <h3 className="font-bold text-slate-900 text-sm md:text-base mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Verification Status Outcomes
          </h3>
          <div className="space-y-2.5">
            {Object.entries(summary?.verificationDistribution || {}).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between text-xs md:text-sm">
                <span className="text-slate-600">{status}</span>
                <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {count}
                </span>
              </div>
            ))}
            {Object.keys(summary?.verificationDistribution || {}).length === 0 && (
              <div className="text-xs text-slate-400 py-3 text-center">No verification records yet</div>
            )}
          </div>
        </div>

        {/* Agent Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <h3 className="font-bold text-slate-900 text-sm md:text-base mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-600" />
            Specialist Agent Routing
          </h3>
          <div className="space-y-2.5">
            {Object.entries(summary?.agentDistribution || {}).map(([agent, count]) => (
              <div key={agent} className="flex items-center justify-between text-xs md:text-sm">
                <span className="text-slate-600">{agent}</span>
                <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {count}
                </span>
              </div>
            ))}
            {Object.keys(summary?.agentDistribution || {}).length === 0 && (
              <div className="text-xs text-slate-400 py-3 text-center">No agent records yet</div>
            )}
          </div>
        </div>

        {/* Input Modality Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <h3 className="font-bold text-slate-900 text-sm md:text-base mb-3 flex items-center gap-2">
            <Mic className="w-4 h-4 text-red-500" />
            Input Modality Distribution
          </h3>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs md:text-sm">
              <span className="text-slate-600">Keyboard / Text Input</span>
              <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {summary?.modalityDistribution?.text || 0}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs md:text-sm">
              <span className="text-slate-600">Voice / Speech Input</span>
              <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {summary?.modalityDistribution?.voice || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filterable Interaction Logs Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base md:text-lg">
              Audit Logs ({filteredInteractions.length})
            </h3>
            <p className="text-xs text-slate-500">
              Pseudonymous participant interactions with verification and citation trail.
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={filterAgent}
              onChange={(e) => setFilterAgent(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded-lg px-2.5 py-1.5"
            >
              <option value="All">All Agents</option>
              <option value="Learning Agent">Learning Agent</option>
              <option value="Safety Agent">Safety Agent</option>
              <option value="Support Agent">Support Agent</option>
              <option value="Communication Agent">Communication Agent</option>
              <option value="Accessibility Agent">Accessibility Agent</option>
              <option value="Feedback Agent">Feedback Agent</option>
            </select>

            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded-lg px-2.5 py-1.5"
            >
              <option value="All">All Ratings</option>
              <option value="Good">Good</option>
              <option value="Okay">Okay</option>
              <option value="Not good">Not good</option>
            </select>

            <select
              value={filterLanguage}
              onChange={(e) => setFilterLanguage(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded-lg px-2.5 py-1.5"
            >
              <option value="All">All Languages</option>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="mr">Marathi</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-2xs border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Participant</th>
                <th className="px-4 py-3">Agent</th>
                <th className="px-4 py-3">Verification</th>
                <th className="px-4 py-3">Lang / Mode</th>
                <th className="px-4 py-3">Question</th>
                <th className="px-4 py-3">Sources</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInteractions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-400">
                    No matching logs found.
                  </td>
                </tr>
              ) : (
                filteredInteractions.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-mono text-2xs text-slate-400">#{row.id}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{row.participant_id}</td>
                    <td className="px-4 py-3">
                      <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {row.agent_used}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-2xs font-bold px-2 py-0.5 rounded-full ${
                          row.verification_status === 'VERIFIED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : row.verification_status === 'SAFETY_OVERRIDE'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {row.verification_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 uppercase font-mono text-2xs">
                      {row.language} / {row.input_modality}
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate" title={row.question}>
                      {row.question}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-2xs max-w-xs truncate">
                      {row.sources_retrieved?.length > 0
                        ? row.sources_retrieved.join(', ')
                        : 'None'}
                    </td>
                    <td className="px-4 py-3">
                      {row.feedback ? (
                        <span
                          className={`text-2xs font-bold px-2 py-0.5 rounded-full ${
                            row.feedback === 'Good'
                              ? 'bg-emerald-100 text-emerald-800'
                              : row.feedback === 'Okay'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {row.feedback}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-2xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-2xs font-mono">
                      {row.response_time_ms}ms
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
