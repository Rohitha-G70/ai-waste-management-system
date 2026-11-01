import React from 'react';
import {
  Recycle,
  Target,
  CheckCircle2,
  Sparkles,
  Layers,
  Cpu,
  Globe2,
  TrendingUp,
  ShieldCheck,
  Code2,
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const objectives = [
    {
      title: 'Reduce Improper Waste Disposal',
      desc: 'Eliminate confusion by giving citizens instant, automated computer vision classification and clear bin guidance.',
    },
    {
      title: 'Improve Waste Segregation',
      desc: 'Enforce strict 7-stream sorting (Plastic, Paper, Metal, Glass, Organic, E-Waste, Hazardous) at the source.',
    },
    {
      title: 'Increase Recycling Efficiency',
      desc: 'Supply municipal Materials Recovery Facilities (MRFs) with uncontaminated, high-purity sorted recyclables.',
    },
    {
      title: 'Reduce Environmental Pollution',
      desc: 'Prevent hazardous batteries, toxic solvents, and persistent microplastics from polluting groundwater and oceans.',
    },
    {
      title: 'Promote Sustainable Circularity',
      desc: 'Incentivize citizen engagement with Eco-Points, upcycling ideas, and verified compost conversion.',
    },
    {
      title: 'Support Next-Gen Smart Cities',
      desc: 'Integrate ultrasonic IoT bin sensors and dynamic GIS collection routing to slash municipal fuel and fleet costs.',
    },
  ];

  const categories = [
    { name: 'Plastic', desc: 'PET bottles, HDPE containers, LDPE film', bin: 'Blue Bin', icon: '🥤' },
    { name: 'Paper', desc: 'Cardboard boxes, magazines, newspapers', bin: 'Blue/Brown Bin', icon: '📦' },
    { name: 'Metal', desc: 'Aluminum soda cans, tin cans, steel scrap', bin: 'Blue Bin', icon: '🥫' },
    { name: 'Glass', desc: 'Beverage bottles, condiment jars', bin: 'Blue Bin', icon: '🍾' },
    { name: 'Organic Waste', desc: 'Food scraps, fruit peels, garden trimmings', bin: 'Green Bin', icon: '🍌' },
    { name: 'E-Waste', desc: 'Phones, laptops, circuit boards, batteries', bin: 'Orange / Depot', icon: '📱' },
    { name: 'Hazardous Waste', desc: 'Paints, chemicals, fluorescent lamps, medicines', bin: 'Red / Toxics Depot', icon: '⚠️' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
          <Recycle className="w-3.5 h-3.5 text-emerald-600" />
          <span>College Engineering Capstone Project</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          About SmartWaste AI
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
          The <strong>AI-Based Smart Waste Management System</strong> leverages cutting-edge Artificial Intelligence, computer vision, and IoT sensor networks to transform how urban communities classify, segregate, and collect waste.
        </p>
      </div>

      {/* Mission & Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-emerald-900 to-teal-900 rounded-3xl p-8 text-white space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-300 font-bold">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-white">Our Mission</h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            To eliminate recycling guesswork through accessible AI visual recognition, drastically lower municipal landfill contamination, and optimize citywide collection logistics with real-time IoT intelligence.
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-emerald-950 rounded-3xl p-8 text-white space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-teal-300 font-bold">
            <Globe2 className="w-6 h-6" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-white">Our Vision</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            A zero-waste circular urban future where every discarded material is automatically recognized, sorted with 95%+ precision, and redirected into high-value regenerative loops without harming our planetary ecosystems.
          </p>
        </div>
      </div>

      {/* Project Objectives */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Core Milestones
          </span>
          <h2 className="font-heading text-2xl font-bold text-slate-900 mt-1">
            Project Objectives
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Key functional goals realized by the SmartWaste AI engineering architecture:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {objectives.map((obj, i) => (
            <div key={obj.title} className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{`0${i + 1}. ${obj.title}`}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                {obj.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 7 Waste Categories Standard */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Sorting Framework
          </span>
          <h2 className="font-heading text-2xl font-bold text-slate-900 mt-1">
            Standard 7 Waste Categories
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Recognized and classified by our AI computer vision model:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((c) => (
            <div key={c.name} className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-400 bg-slate-50/40 transition-colors">
              <span className="text-3xl mb-2 block">{c.icon}</span>
              <h3 className="font-bold text-sm text-slate-900">{c.name}</h3>
              <p className="text-xs text-slate-500 mt-1 mb-3">{c.desc}</p>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                {c.bin}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Architecture Section */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white space-y-8">
        <div className="border-b border-white/10 pb-4">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Engineering Specifications
          </span>
          <h2 className="font-heading text-2xl font-bold text-white mt-1">
            System Architecture &amp; Technology Stack
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Production-grade modular stack supporting cloud multimodal AI, IoT telemetry, and mapping:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="text-emerald-400 font-bold uppercase tracking-wide">
              Frontend Client
            </div>
            <div className="font-bold text-sm text-white">React 19 + TypeScript</div>
            <p className="text-slate-400 leading-relaxed">
              Tailwind CSS, Lucide Icons, interactive custom SVG chart engines, responsive mobile layout.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="text-teal-400 font-bold uppercase tracking-wide">
              Full-Stack Backend
            </div>
            <div className="font-bold text-sm text-white">Node.js Express + TSX</div>
            <p className="text-slate-400 leading-relaxed">
              RESTful APIs for classifications, on-demand pickups, CSV reports, IoT sensor endpoints.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="text-cyan-400 font-bold uppercase tracking-wide">
              Artificial Intelligence
            </div>
            <div className="font-bold text-sm text-white">Gemini 3.8 Flash Vision</div>
            <p className="text-slate-400 leading-relaxed">
              Multimodal zero-shot image classification, structured schema extraction, EcoBot chatbot.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="text-green-400 font-bold uppercase tracking-wide">
              GIS &amp; IoT Telemetry
            </div>
            <div className="font-bold text-sm text-white">Leaflet + OpenStreetMap</div>
            <p className="text-slate-400 leading-relaxed">
              Smart bin coordinate mapping, ultrasonic fill sensors, driver route dispatch markers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
