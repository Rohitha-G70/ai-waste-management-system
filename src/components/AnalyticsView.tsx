import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Leaf,
  Zap,
  TrendingUp,
  Percent,
  Layers,
  Clock,
  Sparkles,
  TreeDeciduous,
  ShieldCheck,
} from 'lucide-react';
import { DashboardStats } from '../types';
import { DonutChart, MonthlyBarChart, TrendLineChart } from './ChartComponents';
import { EnvironmentalImpactModal } from './EnvironmentalImpactModal';

interface AnalyticsViewProps {
  stats: DashboardStats | null;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ stats }) => {
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month' | 'year'>('month');
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  // Multiplier adjustments based on timeframe filter to make the view dynamic & responsive
  const multiplier = timeframe === 'today' ? 0.033 : timeframe === 'week' ? 0.23 : timeframe === 'month' ? 1.0 : 11.8;

  const totalCollected = stats ? Math.round(stats.totalWasteCollectedKg * multiplier) : 148420;
  const totalRecycled = stats ? Math.round(stats.totalRecycledKg * multiplier) : 112800;
  const co2AvoidedTons = (totalRecycled * 0.00165).toFixed(1);
  const energyKwhSaved = Math.round(totalRecycled * 3.65);
  const treesEquivalent = Math.round(Number(co2AvoidedTons) * 44);

  // Timeframe labels
  const timeframeLabels = {
    today: 'Today (Past 24 Hours)',
    week: 'This Week (Last 7 Days)',
    month: 'This Month (October 2026)',
    year: 'This Year (2026 YTD)',
  };

  const handleExportCSV = () => {
    // Trigger download of real CSV report from backend API
    window.location.href = '/api/analytics/export-csv';
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header and Filter Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
              Waste Analytics &amp; ESG Intelligence
            </h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              {timeframeLabels[timeframe]}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Comprehensive lifecycle metrics, municipal collection trends, and carbon reduction auditing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Timeframe Filter Buttons */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs">
            {(['today', 'week', 'month', 'year'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 rounded-xl font-semibold capitalize transition-all cursor-pointer ${
                  timeframe === t
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t === 'today' ? 'Today' : t === 'week' ? 'This Week' : t === 'month' ? 'This Month' : 'This Year'}
              </button>
            ))}
          </div>

          {/* Methodology Button */}
          <button
            onClick={() => setIsMethodologyOpen(true)}
            className="px-3.5 py-2 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span>Methodology</span>
          </button>

          {/* Download CSV Report */}
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV Report</span>
          </button>
        </div>
      </div>

      <EnvironmentalImpactModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

      {/* Environmental Impact Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-gradient-to-br from-emerald-900 to-teal-900 rounded-3xl p-6 text-white shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
              Carbon Avoided
            </span>
            <Leaf className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="font-heading text-3xl font-extrabold">{co2AvoidedTons} Tons</div>
          <p className="text-xs text-emerald-200/80 leading-relaxed">
            CO₂ equivalent prevented from entering the atmosphere through recycling.
          </p>
        </div>

        <div className="bg-gradient-to-br from-teal-900 to-cyan-950 rounded-3xl p-6 text-white shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-300">
              Clean Energy Conserved
            </span>
            <Zap className="w-5 h-5 text-teal-400" />
          </div>
          <div className="font-heading text-3xl font-extrabold">
            {(energyKwhSaved / 1000).toFixed(1)}k kWh
          </div>
          <p className="text-xs text-teal-200/80 leading-relaxed">
            Enough electrical power to supply 450 residential homes for 6 months.
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-emerald-950 rounded-3xl p-6 text-white shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-green-300">
              Tree Offset Equivalent
            </span>
            <TreeDeciduous className="w-5 h-5 text-green-400" />
          </div>
          <div className="font-heading text-3xl font-extrabold">
            {treesEquivalent.toLocaleString()} Trees
          </div>
          <p className="text-xs text-green-200/80 leading-relaxed">
            Equivalent carbon sequestration of mature urban forest trees planted.
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-800 to-green-900 rounded-3xl p-6 text-white shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
              Collection Efficiency
            </span>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="font-heading text-3xl font-extrabold">98.2%</div>
          <p className="text-xs text-emerald-200/80 leading-relaxed">
            On-time fulfillment rate with average response time of 4.2 hours.
          </p>
        </div>
      </div>

      {/* Primary Analytics Charts */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Category Breakdown */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-heading text-base font-bold text-slate-900">
                Segregated Waste Distribution
              </h3>
              <p className="text-[11px] text-slate-500">
                Percentage and kilograms recorded during {timeframeLabels[timeframe]}
              </p>
            </div>

            <DonutChart data={stats.categoriesBreakdown} />
          </div>

          {/* Right: Monthly & Weekly Collection Trends */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-heading text-base font-bold text-slate-900">
                Waste Collection vs. Diversion Volume
              </h3>
              <p className="text-[11px] text-slate-500">
                Mass in kilograms collected from citizens vs diverted to recycling streams
              </p>
            </div>

            <MonthlyBarChart data={stats.monthlyTrends} height={230} />
          </div>
        </div>
      )}

      {/* Segregation Accuracy Trend & Performance Audit */}
      {stats && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-heading text-base font-bold text-slate-900">
                Segregation Quality &amp; Contamination Prevention
              </h3>
              <p className="text-[11px] text-slate-500">
                Tracking municipal contamination drop rates assisted by AI visual scanning verification
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Current Accuracy: 94.6%
              </span>
            </div>
          </div>

          <TrendLineChart data={stats.monthlyTrends} height={220} />
        </div>
      )}

      {/* Key Metric Audit Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900">
              Sustainable City Metric Benchmarks
            </h3>
            <p className="text-[11px] text-slate-500">
              Performance metrics measured against global zero-waste municipal standards
            </p>
          </div>
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Metric Indicator</th>
                <th className="py-3 px-3">Current Performance</th>
                <th className="py-3 px-3">Smart City Target</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-900">Recycling Diversion Rate</td>
                <td className="py-3 px-3 font-mono font-bold text-emerald-700">76.0%</td>
                <td className="py-3 px-3">75.0% by 2026</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    Goal Exceeded
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-900">AI Segregation Accuracy</td>
                <td className="py-3 px-3 font-mono font-bold text-emerald-700">94.6%</td>
                <td className="py-3 px-3">90.0%</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    Optimal
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-900">Average Pickup Turnaround</td>
                <td className="py-3 px-3 font-mono font-bold text-emerald-700">4.2 hours</td>
                <td className="py-3 px-3">&lt; 8.0 hours</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    Excellent
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-900">IoT Bin Overflow Incident Rate</td>
                <td className="py-3 px-3 font-mono font-bold text-emerald-700">1.4%</td>
                <td className="py-3 px-3">&lt; 3.0%</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    Under Control
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
