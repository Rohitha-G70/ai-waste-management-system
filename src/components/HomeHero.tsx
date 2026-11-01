import React from 'react';
import {
  ScanLine,
  ArrowRight,
  Sparkles,
  Recycle,
  CheckCircle2,
  TrendingUp,
  Cpu,
  MapPin,
  ShieldCheck,
  ChevronRight,
  Leaf,
} from 'lucide-react';
import { DashboardStats } from '../types';

interface HomeHeroProps {
  onNavigate: (tab: string) => void;
  stats: DashboardStats | null;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ onNavigate, stats }) => {
  const animatedStats = [
    {
      label: 'Total Waste Collected',
      value: stats ? `${(stats.totalWasteCollectedKg / 1000).toFixed(1)}k kg` : '148.4k kg',
      subtext: 'Monitored across 14 municipal sectors',
      color: 'from-emerald-600 to-teal-600',
      icon: Recycle,
    },
    {
      label: 'Waste Recycled',
      value: stats ? `${(stats.totalRecycledKg / 1000).toFixed(1)}k kg` : '112.8k kg',
      subtext: `${stats ? stats.recyclingPercentage : '76.0'}% diverted from landfills`,
      color: 'from-teal-600 to-cyan-600',
      icon: TrendingUp,
    },
    {
      label: 'Waste Segregation Accuracy',
      value: stats ? `${stats.segregationAccuracy}%` : '94.6%',
      subtext: 'Powered by Gemini Vision Model',
      color: 'from-emerald-700 to-green-600',
      icon: CheckCircle2,
    },
    {
      label: 'Carbon Emissions Reduced',
      value: stats ? `${(stats.carbonEmissionsReducedKg / 1000).toFixed(1)} T` : '186.4 T',
      subtext: 'CO₂ equivalent greenhouse gas offset',
      color: 'from-green-600 to-lime-600',
      icon: Leaf,
    },
  ];

  const features = [
    {
      icon: ScanLine,
      title: 'Multimodal AI Vision Scanner',
      desc: 'Instant visual classification of waste materials across 7 categories with actionable disposal instructions and recycling guidance.',
      tab: 'scanner',
    },
    {
      icon: Cpu,
      title: 'IoT Smart Bins Telemetry',
      desc: 'Real-time bin fill level and battery monitoring to prevent street overflows and dispatch waste trucks dynamically.',
      tab: 'collection',
    },
    {
      icon: MapPin,
      title: 'On-Demand Smart Pickup',
      desc: 'Geolocation-based waste collection scheduling with live route dispatch for Citizens, Collectors, and City Admins.',
      tab: 'collection',
    },
    {
      icon: TrendingUp,
      title: 'Citywide ESG Analytics',
      desc: 'Deep analytics tracking waste diversion rates, municipal trends, carbon mitigation, and exportable CSV reports.',
      tab: 'analytics',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Snap or Select',
      description: 'Upload a picture of any discarded item or packaging from your smartphone or computer.',
    },
    {
      step: '02',
      title: 'AI Classification',
      description: 'SmartWaste AI pinpoints material composition, recyclability grade, and the exact bin color in milliseconds.',
    },
    {
      step: '03',
      title: 'Smart Collection',
      description: 'Deposit in the recommended bin or book an on-demand municipal pickup with live GPS tracking.',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-20 bg-gradient-to-b from-emerald-50/70 via-white to-slate-50/50 rounded-3xl border border-emerald-100/60 shadow-xs">
        {/* Decorative Nature Accents */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-200/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-teal-200/25 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Next-Generation Sustainable City Infrastructure</span>
          </div>

          {/* Heading */}
          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
            Smart Waste Management <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent">
              Powered by AI
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 mb-10 leading-relaxed font-normal">
            Transform waste into valuable resources through intelligent waste classification, smart recycling, and efficient collection.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm shadow-lg shadow-emerald-700/25 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('scanner')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-800 font-semibold text-sm border-2 border-emerald-600/30 hover:border-emerald-600 shadow-xs transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ScanLine className="w-4 h-4 text-emerald-600" />
              <span>Scan Waste</span>
            </button>

            <button
              onClick={() => onNavigate('register')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-900 font-semibold text-sm border border-teal-200 shadow-xs transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Register Account (+150 Pts)</span>
            </button>
          </div>

          {/* Environmental Graphic Banner */}
          <div className="mt-14 relative rounded-2xl overflow-hidden border border-emerald-200/80 shadow-2xl bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 text-white p-6 sm:p-10 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-emerald-400">
                  AI Computer Vision &amp; IoT
                </span>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold mt-2 mb-3 text-white">
                  Automated Waste Segregation for Smart Cities
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                  Combining multimodal vision models, live telemetry from smart IoT solar bins, and automated collection routing to reach 85%+ recycling diversion by 2030.
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-3 py-1 rounded-lg bg-emerald-800/80 border border-emerald-600 text-emerald-200">
                    🌱 7-Category Segregation
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-teal-800/80 border border-teal-600 text-teal-200">
                    ⚡ Live Telemetry Bins
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-cyan-800/80 border border-cyan-600 text-cyan-200">
                    🤖 EcoBot AI Assistant
                  </span>
                </div>
              </div>

              {/* Graphic Mockup Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                    <ScanLine className="w-4 h-4 animate-pulse" />
                    <span>Live AI Scanner Feed</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full font-mono">
                    ONLINE
                  </span>
                </div>

                <div className="flex items-center gap-4 bg-slate-900/60 p-3.5 rounded-xl border border-white/10">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-3xl shadow-md">
                    🥤
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">PET Plastic Bottle</span>
                      <span className="text-xs font-bold text-emerald-400">97.4% Match</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">Recyclability: High</p>
                    <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-emerald-200 bg-emerald-950/80 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Rinse, crush, and place in Blue Bin</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                  <span>Carbon Offset: +1.5 kg CO₂</span>
                  <button
                    onClick={() => onNavigate('scanner')}
                    className="text-emerald-300 hover:text-emerald-200 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Test Scanner</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="font-heading text-2xl font-bold text-slate-900">
            Real-Time Environmental Impact
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Live telemetry data aggregated across municipal recycling facilities and citizen requests
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {animatedStats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 relative overflow-hidden group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-md shadow-emerald-600/15`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                    Live Telemetry
                  </span>
                </div>

                <div className="font-heading text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
                  {item.value}
                </div>

                <div className="text-sm font-semibold text-slate-700 mb-1">
                  {item.label}
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.subtext}
                </p>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              </div>
            );
          })}
        </div>
      </section>

      {/* Core AI Modules Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Comprehensive Platform
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              End-to-End Smart Waste Ecosystem
            </h2>
          </div>
          <button
            onClick={() => onNavigate('about')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start md:self-auto cursor-pointer"
          >
            <span>Learn about our mission</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                onClick={() => onNavigate(feat.tab)}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-slate-800 mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    {feat.desc}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 group-hover:translate-x-1 transition-transform">
                  <span>Explore Feature</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3-Step Interactive Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-emerald-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              User Experience
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold mt-2 mb-3 text-white">
              How SmartWaste AI Works
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              Empowering citizens and municipal collectors with intuitive computer vision in 3 effortless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((st) => (
              <div
                key={st.step}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 relative backdrop-blur-xs hover:bg-white/10 transition-colors"
              >
                <div className="text-3xl font-heading font-extrabold text-emerald-400/50 mb-3">
                  {st.step}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{st.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {st.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('scanner')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <ScanLine className="w-4 h-4" />
              <span>Launch AI Scanner Now</span>
            </button>
            <button
              onClick={() => onNavigate('history')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              <span>View Saved History</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
