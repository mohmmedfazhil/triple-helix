import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import FrequentlyAskedQuestions from '../ui/frequently-asked-questions-with-accordion';
import { ArrowLeft, Search, HelpCircle, MessageSquare } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const { setActivePage, faqList, contactSettings } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const categories = ['All', ...Array.from(new Set(faqList.map(f => f.category || 'General')))];

  const filteredFaqs = faqList.filter(item => {
    const matchesCategory = selectedCategory === 'All' || (item.category || 'General') === selectedCategory;
    const matchesQuery = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="w-full min-h-screen py-8 bg-[#F7FAFC]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setActivePage('home')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#10233F] hover:text-[#1769AA] transition-colors bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 px-3.5 py-2 rounded-xl cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </button>

          <span className="text-xs font-mono font-medium text-slate-500 uppercase tracking-widest hidden xs:inline-block">
            Knowledge Base & Support
          </span>
        </div>

        {/* Search & Category Filter */}
        <div className="bg-white/85 backdrop-blur-md border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search frequently asked questions..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion Component */}
        <div className="bg-white/60 backdrop-blur-xs border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
          <FrequentlyAskedQuestions 
            title="Frequently Asked Questions"
            description="Find direct answers regarding the Triple Helix Innovation Framework, institution registration, student team rosters, mentor pairings, and milestone approvals."
            data={filteredFaqs}
            supportEmail={contactSettings.primaryEmail}
          />
        </div>

        {/* Still Have Questions Banner */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Still have questions?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Our District Collectorate IT Cell and Innovation Desk are available to assist you.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActivePage('contact')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1769AA] hover:bg-[#125386] text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors shrink-0"
          >
            <span>Contact Innovation Cell</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default FaqPage;
