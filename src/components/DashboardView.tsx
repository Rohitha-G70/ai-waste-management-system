import React, { useState } from 'react';
import {
  Recycle,
  Trash2,
  TrendingUp,
  Cpu,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  PlusCircle,
  Truck,
  Layers,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import { DashboardStats, SmartBin, User, WasteCategory } from '../types';
import { DonutChart, MonthlyBarChart, TrendLineChart } from './ChartComponents';

interface DashboardViewProps {
  stats: DashboardStats | null;
  bins: SmartBin[];
  currentUser: User;
  onNavigate: (tab: string) => void;
  onRefresh: () => void;
  onEmptyBin: (binId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  bins,
  currentUser,
  onNavigate,
  onRefresh,
  onEmptyBin,
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  if (!stats) {
    return (
      <div className="py-20 text-center">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-600">Loading municipal dashboard analytics...</p>
      </div>
    );
  }

  // Find specific category stats
  const getCatAmount = (name: string) => {
    const item = stats.categoriesBreakdown.find((c) =>
      c.name.toLowerCase().includes(name.toLowerCase())
    );
    return item ? (item.amountKg / 1000).toFixed(1) : '0.0';
  };

  const metricCards = [
    {
      label: 'Total Waste Collected',
      value: `${(stats.totalWasteCollectedKg / 1000).toFixed(1)} T`,
      sub: 'Cumulative city collection',
      change: '+4.2% this month',
      color: 'border-l-4 border-l-emerald-600',
      icon: Trash2,
      iconBg: 'bg-emerald-100 text-emerald-700',
    },
    {
      label: 'Total Recycled Waste',
      value: `${(stats.totalRecycledKg / 1000).toFixed(1)} T`,
      sub: `${stats.recyclingPercentage}% diversion rate`,
      change: '+6.8% YoY growth',
      color: 'border-l-4 border-l-teal-600',
      icon: Recycle,
      iconBg: 'bg-teal-100 text-teal-700',
    },
    {
      label: 'Total Organic Waste',
      value: `${getCatAmount('Organic')} T`,
      sub: 'Diverted to urban compost',
      change: '28.5% of total mass',
      color: 'border-l-4 border-l-green-600',
      icon: Layers,
      iconBg: 'bg-green-100 text-green-700',
    },
    {
      label: 'Total Plastic Waste',
      value: `${getCatAmount('Plastic')} T`,
      sub: 'Processed in clean sorting',
      change: '23.0% of total mass',
      color: 'border-l-4 border-l-blue-600',
      icon: Recycle,
      iconBg: 'bg-blue-100 text-blue-700',
    },
    {
      label: 'Total E-Waste',
      value: `${getCatAmount('E-Waste')} T`,
      sub: 'High-value mineral recovery',
      change: '98.7% safe processing',
      color: 'border-l-4 border-l-purple-600',
      icon: Cpu,
      iconBg: 'bg-purple-100 text-purple-700',
    },
    {
      label: 'Recycling Efficiency',
      value: `${stats.recyclingPercentage}%`,
      sub: 'Target: 80% by Q4 2027',
      change: '+3.1% over benchmark',
      color: 'border-l-4 border-l-amber-500',
      icon: TrendingUp,
      iconBg: 'bg-amber-100 text-amber-700',
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner / Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
              Smart Waste Command Dashboard
            </h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              Live Feed
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time telemetry, classification metrics, and smart bin sensors across city zones.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onRefresh}
            className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Telemetry</span>
          </button>

          <button
            onClick={() => onNavigate('scanner')}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Classify Waste</span>
          </button>
        </div>
      </div>

      {/* Demo Data Notice */}
      <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 text-xs flex items-center gap-2">
        <Info className="w-4 h-4 text-emerald-700 shrink-0" />
        <span>
          <strong>Telemetry Notice:</strong> Displaying initial municipal demonstration dataset for college demonstration &amp; evaluation. All dynamic classifications and collection bookings persist live in the system.
        </span>
      </div>

      {/* Top 6 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all ${card.color}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500">{card.label}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
                {card.value}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>{card.sub}</span>
                <span className="text-emerald-700 font-semibold">{card.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Waste Category Distribution (Pie / Donut) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-heading text-base font-bold text-slate-900">
                Waste Category Distribution
              </h3>
              <p className="text-[11px] text-slate-500">Breakdown across 7 segregated waste streams</p>
            </div>
            <button
              onClick={() => onNavigate('analytics')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-0.5"
            >
              <span>Details</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <DonutChart data={stats.categoriesBreakdown} />
        </div>

        {/* Right: Monthly Waste Collection Bar Chart */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-heading text-base font-bold text-slate-900">
                Monthly Waste Collection vs Recycled
              </h3>
              <p className="text-[11px] text-slate-500">Total volume collected and diverted over past 6 months</p>
            </div>
            <div className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Avg. 76.0% Diverted
            </div>
          </div>

          <MonthlyBarChart data={stats.monthlyTrends} height={230} />
        </div>
      </div>

      {/* Row 2: Trend Line Chart & Collection Status Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Segregation Accuracy Line Chart */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-heading text-base font-bold text-slate-900">
                AI Waste Segregation Accuracy Trend
              </h3>
              <p className="text-[11px] text-slate-500">Citizen classification accuracy assisted by Gemini models</p>
            </div>
          </div>

          <TrendLineChart data={stats.monthlyTrends} height={210} />
        </div>

        {/* Collection Status Dashboard Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="font-heading text-base font-bold text-slate-900">
                  Waste Collection Status
                </h3>
                <p className="text-[11px] text-slate-500">Citizen requests lifecycle distribution</p>
              </div>
              <button
                onClick={() => onNavigate('collection')}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-0.5"
              >
                <span>View Map</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                  Pending Review
                </span>
                <div className="font-heading text-2xl font-bold text-amber-900 mt-1">
                  {stats.collectionStatusCounts.Pending}
                </div>
                <p className="text-[11px] text-amber-700 mt-0.5">Awaiting collector dispatch</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                  Assigned
                </span>
                <div className="font-heading text-2xl font-bold text-blue-900 mt-1">
                  {stats.collectionStatusCounts.Assigned}
                </div>
                <p className="text-[11px] text-blue-700 mt-0.5">Assigned to team</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                  In Progress
                </span>
                <div className="font-heading text-2xl font-bold text-purple-900 mt-1">
                  {stats.collectionStatusCounts.InProgress}
                </div>
                <p className="text-[11px] text-purple-700 mt-0.5">Truck in transit</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Completed
                </span>
                <div className="font-heading text-2xl font-bold text-emerald-900 mt-1">
                  {stats.collectionStatusCounts.Completed}
                </div>
                <p className="text-[11px] text-emerald-700 mt-0.5">Delivered to MRF</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('collection')}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Truck className="w-4 h-4 text-emerald-400" />
            <span>Manage Pickup Dispatches</span>
          </button>
        </div>
      </div>

      {/* IoT Smart Bins Status Strip */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-600" />
              <h3 className="font-heading text-base font-bold text-slate-900">
                Connected Smart Bins Grid (IoT Telemetry)
              </h3>
            </div>
            <p className="text-[11px] text-slate-500">Live fill level ultrasonic sensors and solar battery telemetry</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> {bins.filter(b => b.fillLevel < 65).length} Normal
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> {bins.filter(b => b.fillLevel >= 65 && b.fillLevel < 85).length} Near Full
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> {bins.filter(b => b.fillLevel >= 85).length} Overflow Alert
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bins.map((bin) => {
            const isCritical = bin.fillLevel >= 85;
            const isWarning = bin.fillLevel >= 65 && !isCritical;

            return (
              <div
                key={bin.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isCritical
                    ? 'border-rose-300 bg-rose-50/40'
                    : isWarning
                    ? 'border-amber-300 bg-amber-50/30'
                    : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-semibold text-slate-400">
                      {bin.id}
                    </span>
                    <h4 className="font-bold text-xs text-slate-800 line-clamp-1">
                      {bin.name}
                    </h4>
                    <p className="text-[11px] text-slate-500">{bin.category}</p>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      isCritical
                        ? 'bg-rose-600 text-white animate-pulse'
                        : isWarning
                        ? 'bg-amber-500 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {bin.status}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-600">Fill Level</span>
                    <span className={isCritical ? 'text-rose-600 font-bold' : 'text-slate-800'}>
                      {bin.fillLevel}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCritical
                          ? 'bg-rose-600'
                          : isWarning
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${bin.fillLevel}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Battery: {bin.battery}%</span>
                  {(isCritical || isWarning || currentUser.role === 'collector' || currentUser.role === 'admin') && (
                    <button
                      onClick={() => onEmptyBin(bin.id)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                    >
                      Empty Bin
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900">
              Recent AI Classifications &amp; Activity
            </h3>
            <p className="text-[11px] text-slate-500">Real-time scans logged across the platform</p>
          </div>
          <button
            onClick={() => onNavigate('scanner')}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
          >
            Scan New Item
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {stats.recentClassifications.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
                  {item.category === 'Plastic'
                    ? '🥤'
                    : item.category === 'Organic Waste'
                    ? '🍌'
                    : item.category === 'E-Waste'
                    ? '📱'
                    : '📦'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-800">{item.subType}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.2 bg-slate-100 text-slate-600 rounded">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{item.disposalMethod}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs font-bold text-emerald-700">
                  {item.confidence}% Match
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1 justify-end">
                  <Clock className="w-3 h-3" />
                  <span>{item.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
