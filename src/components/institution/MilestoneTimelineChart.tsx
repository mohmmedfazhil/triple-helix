import React, { useState } from 'react';
import { Milestone, MilestoneStatus } from '../../types';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  BarChart,
  Bar, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid, 
  ReferenceLine,
  Cell
} from 'recharts';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  TrendingUp, 
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';

interface Props {
  milestones: Milestone[];
  activeMilestoneId: 1 | 2 | 3;
  onSelectMilestone: (id: 1 | 2 | 3) => void;
}

export const MilestoneTimelineChart: React.FC<Props> = ({
  milestones,
  activeMilestoneId,
  onSelectMilestone
}) => {
  const [viewMode, setViewMode] = useState<'velocity' | 'duration'>('velocity');

  // Helper to compute numeric progress from status
  const getProgressPercentage = (status: MilestoneStatus): number => {
    switch (status) {
      case 'Approved':
        return 100;
      case 'Under Review':
        return 75;
      case 'Submitted':
        return 60;
      case 'Rejected':
        return 35;
      case 'Draft':
        return 15;
      case 'Deadline Passed':
        return 20;
      default:
        return 0;
    }
  };

  // Helper to calculate days between two dates
  const calculateDays = (startStr: string, endStr: string): number => {
    const s = new Date(startStr);
    const e = new Date(endStr);
    const diff = e.getTime() - s.getTime();
    return Math.max(Math.round(diff / (1000 * 60 * 60 * 24)), 1);
  };

  // Build chart dataset
  const chartData = milestones.map(m => {
    const durationDays = calculateDays(m.startDate, m.deadlineDate);
    const progress = getProgressPercentage(m.status);
    const docsCount = m.requiredDocuments.length;
    const uploadedCount = m.uploadedFiles?.length || (m.status === 'Approved' ? docsCount : 0);

    return {
      id: m.id,
      name: `Gate 0${m.id}`,
      fullName: m.name,
      stageName: m.id === 1 ? 'Docs & Survey' : m.id === 2 ? 'Prototype & Arch' : 'Final Solution',
      status: m.status,
      startDate: m.startDate,
      deadlineDate: m.deadlineDate,
      durationDays,
      progress,
      targetProgress: 100,
      uploadedCount,
      docsCount,
      rejectionReason: m.rejectionReason,
      reviewComments: m.reviewComments
    };
  });

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1.5 max-w-xs pointer-events-none z-50">
          <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
            <span className="font-bold text-sky-400 font-mono">{data.name}: {data.stageName}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
              data.status === 'Approved' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' :
              data.status === 'Submitted' ? 'bg-sky-950 text-sky-300 border border-sky-700' :
              data.status === 'Rejected' ? 'bg-rose-950 text-rose-300 border border-rose-700' :
              'bg-slate-800 text-slate-300'
            }`}>
              {data.status}
            </span>
          </div>

          <div className="text-slate-300 text-[11px] leading-snug">
            {data.fullName}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800 text-[11px]">
            <div>
              <span className="text-slate-400 block text-[10px]">Start Date</span>
              <span className="font-mono">{data.startDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Target Deadline</span>
              <span className="font-mono text-amber-300">{data.deadlineDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Progress Score</span>
              <span className="font-mono font-bold text-sky-300">{data.progress}%</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Window</span>
              <span className="font-mono">{data.durationDays} days</span>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
            Documents: {data.uploadedCount} of {data.docsCount} required uploaded
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
      
      {/* Timeline Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-800">
              Interactive Milestone Timeline
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Progress Tracking vs. Scheduled Project Milestones
          </h3>
          <p className="text-xs text-slate-500">
            Visualized with Recharts. Tracks chronological gates, submission readiness, and Super Admin verification status.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold self-start sm:self-center">
          <button
            type="button"
            onClick={() => setViewMode('velocity')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              viewMode === 'velocity'
                ? 'bg-white text-sky-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completion Velocity (%)
          </button>
          <button
            type="button"
            onClick={() => setViewMode('duration')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              viewMode === 'duration'
                ? 'bg-white text-sky-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Timeline Duration (Days)
          </button>
        </div>
      </div>

      {/* RECHARTS VISUALIZATION CONTAINER */}
      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'velocity' ? (
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
            >
              <defs>
                <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              
              <YAxis 
                domain={[0, 100]} 
                ticks={[0, 25, 50, 75, 100]}
                unit="%"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />

              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} 
                iconType="circle"
              />

              <ReferenceLine y={100} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Approval Target (100%)', position: 'top', fill: '#10b981', fontSize: 10 }} />

              {/* Shaded Area for velocity */}
              <Area 
                type="monotone" 
                dataKey="progress" 
                name="Current Progress %" 
                fill="url(#progressGradient)" 
                stroke="#0284c7" 
                strokeWidth={3}
                dot={{ r: 5, fill: '#0284c7', strokeWidth: 2, stroke: '#ffffff' }}
                activeDot={{ r: 7, fill: '#0369a1', stroke: '#ffffff', strokeWidth: 2 }}
              />

              {/* Bar representing documents readiness */}
              <Bar 
                dataKey="uploadedCount" 
                name="Attached Deliverables (Count)" 
                barSize={24}
                radius={[4, 4, 0, 0]}
              >
                {chartData.map((entry) => (
                  <Cell 
                    key={`cell-${entry.id}`} 
                    fill={entry.status === 'Approved' ? '#10b981' : entry.id === activeMilestoneId ? '#38bdf8' : '#cbd5e1'} 
                    cursor="pointer"
                    onClick={() => onSelectMilestone(entry.id as 1 | 2 | 3)}
                  />
                ))}
              </Bar>
            </ComposedChart>
          ) : (
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 20, right: 30, bottom: 20, left: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              
              <XAxis 
                type="number"
                unit=" days"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              
              <YAxis 
                type="category" 
                dataKey="name" 
                tick={{ fontSize: 12, fill: '#334155', fontWeight: 600 }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />

              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

              <Bar 
                dataKey="durationDays" 
                name="Milestone Window (Days Allocated)" 
                fill="#0ea5e9" 
                barSize={20}
                radius={[0, 6, 6, 0]}
              >
                {chartData.map((entry) => (
                  <Cell 
                    key={`cell-bar-${entry.id}`}
                    fill={entry.id === activeMilestoneId ? '#0284c7' : '#94a3b8'}
                    cursor="pointer"
                    onClick={() => onSelectMilestone(entry.id as 1 | 2 | 3)}
                  />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Interactive Milestone Step Selector Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
        {chartData.map((item) => {
          const isSelected = item.id === activeMilestoneId;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectMilestone(item.id as 1 | 2 | 3)}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-sky-50/80 border-sky-400 ring-2 ring-sky-200 shadow-xs'
                  : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/70 hover:border-slate-300'
              }`}
            >
              <div className="space-y-1.5 w-full">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-sky-800">
                    {item.name}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    item.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                    item.status === 'Submitted' ? 'bg-sky-100 text-sky-800' :
                    item.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-900 truncate">
                  {item.fullName.split('–')[1] || item.fullName}
                </div>

                {/* Progress bar inside card */}
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      item.status === 'Approved' ? 'bg-emerald-600' : 'bg-sky-600'
                    }`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mt-3 pt-2 border-t border-slate-200/60 w-full">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Due: {item.deadlineDate}
                </span>
                <span className="font-semibold text-slate-700">
                  {item.progress}%
                </span>
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
};
