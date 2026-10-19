import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  BookOpen,
  Wifi,
  ZoomIn,
  ShieldAlert,
  Video,
  Camera,
  Battery,
  CreditCard,
  HeartHandshake,
  ArrowRight,
  Sparkles,
  Tag,
} from 'lucide-react';
import { EducationalGuide, Language } from '../types';

interface GuidesSearchProps {
  guides: EducationalGuide[];
  language: Language;
  onAskAboutGuide: (prompt: string) => void;
}

export const GuidesSearch: React.FC<GuidesSearchProps> = ({
  guides,
  language,
  onAskAboutGuide,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const set = new Set<string>();
    guides.forEach((g) => {
      if (g.category) set.add(g.category);
    });
    return ['All', ...Array.from(set)];
  }, [guides]);

  const quickKeywordChips = [
    { label: 'Wi-Fi', keyword: 'wifi' },
    { label: 'Bigger Text', keyword: 'font' },
    { label: 'Scam & OTP Alert', keyword: 'scam' },
    { label: 'Video Call', keyword: 'video' },
    { label: 'Send Photos', keyword: 'photo' },
    { label: 'UPI Safety', keyword: 'upi' },
    { label: 'Battery Life', keyword: 'battery' },
    { label: 'Confused / Stuck', keyword: 'confused' },
  ];

  // Client-side Local Search Filtering
  const filteredGuides = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return guides.filter((guide) => {
      // Category match
      if (selectedCategory !== 'All' && guide.category !== selectedCategory) {
        return false;
      }

      // Query match across title, summary, keywords, and chunks
      if (!q) return true;

      const titleMatch = guide.title.toLowerCase().includes(q);
      const summaryMatch = guide.summary.toLowerCase().includes(q);
      const keywordMatch = guide.keywords.some((k) => k.toLowerCase().includes(q));
      const chunkMatch = guide.chunks.some((c) => c.content.toLowerCase().includes(q));

      return titleMatch || summaryMatch || keywordMatch || chunkMatch;
    });
  }, [guides, searchQuery, selectedCategory]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Connectivity':
        return <Wifi className="w-5 h-5 text-blue-600" />;
      case 'Display':
        return <ZoomIn className="w-5 h-5 text-emerald-600" />;
      case 'Safety':
        return <ShieldAlert className="w-5 h-5 text-red-600" />;
      case 'Communication':
        return <Video className="w-5 h-5 text-purple-600" />;
      case 'Payments':
        return <CreditCard className="w-5 h-5 text-amber-600" />;
      case 'Device Care':
        return <Battery className="w-5 h-5 text-teal-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-amber-600" />
            Quick Learning Guides for Everyday Devices
          </h2>
          <p className="text-slate-600 text-sm md:text-base mt-1">
            Search our verified library of plain-language, step-by-step guides. Tap any guide to read or ask Buddy for interactive help.
          </p>
        </div>

        {/* Local Search Input with Instant Filtering */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5 text-blue-600" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides by keyword (e.g. wifi, text size, scam, video call, battery)..."
            className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-base md:text-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            aria-label="Search guides by keyword"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700"
              title="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick Keyword Tap Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" /> Popular Topics:
          </span>
          {quickKeywordChips.map((chip) => (
            <button
              key={chip.keyword}
              onClick={() => setSearchQuery(chip.keyword)}
              className={`text-xs md:text-sm px-3 py-1 rounded-full border transition-all ${
                searchQuery.toLowerCase() === chip.keyword
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs font-bold'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-500 shrink-0">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Live Filter Counter */}
        <div className="text-xs text-slate-500 font-medium">
          Showing <strong>{filteredGuides.length}</strong> of {guides.length} educational guides
          {searchQuery && ` matching "${searchQuery}"`}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </div>
      </div>

      {/* Guides Grid */}
      {filteredGuides.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No guides found for "{searchQuery}"</h3>
          <p className="text-slate-500 max-w-md mx-auto text-sm">
            Try searching with broader terms like "phone", "wifi", "call", "safe", or choose a category above.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-2xs"
          >
            Reset Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGuides.map((guide) => (
            <div
              key={guide.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2.5 rounded-xl bg-slate-100 shrink-0">
                      {getCategoryIcon(guide.category)}
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg leading-snug">{guide.title}</h3>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {guide.category}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-4">{guide.summary}</p>

                {/* Chunks / Steps Preview */}
                <div className="space-y-3">
                  {guide.chunks.map((chunk) => (
                    <div
                      key={chunk.id}
                      className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-700 text-sm leading-relaxed whitespace-pre-line"
                    >
                      {chunk.content}
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer: Keywords & Ask Action */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {guide.keywords.slice(0, 3).map((kw, i) => (
                    <span
                      key={i}
                      className="text-2xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => onAskAboutGuide(guide.title)}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs md:text-sm font-bold flex items-center gap-1.5 transition-colors shrink-0"
                  title="Ask Buddy to teach this in chat"
                >
                  <span>Ask Buddy</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
