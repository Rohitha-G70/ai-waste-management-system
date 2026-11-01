import React from 'react';
import { Recycle, Heart, Shield, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenEcoBot: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenEcoBot }) => {
  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Recycle className="w-5 h-5 animate-spin-slow" />
              </div>
              <span className="font-heading text-xl font-bold text-white">
                SmartWaste AI <span className="text-sm">♻️</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transforming urban waste streams into valuable circular resources through Artificial Intelligence, computer vision, and IoT logistics.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950 border border-emerald-800 text-emerald-300 text-[10px] font-mono">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Gemini 3.8 Flash Vision Ready</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-slate-300 text-[11px]">
              System Navigation
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Home Landing Page
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Smart City Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('scanner')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  AI Waste Classifier
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('collection')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Waste Collection Logistics
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('analytics')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Analytics &amp; ESG Reports
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('register')}
                  className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  Create Account (Register)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('login')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Sign In / My History
                </button>
              </li>
            </ul>
          </div>

          {/* Supported Categories */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-slate-300 text-[11px]">
              7 Waste Streams
            </h4>
            <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-300">
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Plastic</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Paper</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Metal</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Glass</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Organic</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">E-Waste</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Hazardous</span>
            </div>
          </div>

          {/* Assistant & Contact */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-slate-300 text-[11px]">
              AI Assistant
            </h4>
            <p className="text-slate-400 text-xs">
              Need advice on recycling codes or local hazardous disposal?
            </p>
            <button
              onClick={onOpenEcoBot}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>Chat with EcoBot 🤖</span>
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 SmartWaste AI System. Built for smart city sustainable waste management.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('about')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              About Project
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Contact Team
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
