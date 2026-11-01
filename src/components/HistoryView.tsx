import React, { useState, useEffect } from 'react';
import {
  History,
  Trash2,
  Download,
  Search,
  Filter,
  Calendar,
  Leaf,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Bot,
  Truck,
  Layers,
  ArrowRight,
  User as UserIcon,
  LogIn,
  FileSpreadsheet,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { User, ClassificationRecord, CollectionRequest, WasteCategory } from '../types';
import { api } from '../services/api';

interface HistoryViewProps {
  currentUser: User;
  onNavigateTab: (tab: string) => void;
  onScheduleCollection?: (category: WasteCategory, notes: string) => void;
  onOpenEcoBot?: (initialQuery?: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  currentUser,
  onNavigateTab,
  onScheduleCollection,
  onOpenEcoBot,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'scans' | 'pickups'>('scans');
  const [scans, setScans] = useState<ClassificationRecord[]>([]);
  const [pickups, setPickups] = useState<CollectionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [recyclableFilter, setRecyclableFilter] = useState<'all' | 'recyclable' | 'non-recyclable'>('all');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadHistory();
  }, [currentUser.email]);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const res = await api.getHistory(currentUser.email);
      setScans(res.scans || []);
      setPickups(res.collections || []);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      setIsDeleting(id);
      await api.deleteScanHistory(id);
      setScans((prev) => prev.filter((item) => item.id !== id));
      setMessage({ type: 'success', text: 'Scan record removed from your history.' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete record.' });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleClearHistory = async () => {
    try {
      await api.clearScanHistory(currentUser.email);
      setScans([]);
      setShowClearModal(false);
      setMessage({ type: 'success', text: 'Your scan history has been cleared.' });
      setTimeout(() => setMessage(null), 3500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to clear history.' });
    }
  };

  const handleExportCsv = () => {
    window.open(`/api/history/export-csv?userEmail=${encodeURIComponent(currentUser.email)}`, '_blank');
  };

  // Category styles
  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'Plastic':
        return { bg: 'bg-blue-50 text-blue-800 border-blue-200', icon: '🥤', binColor: 'Blue' };
      case 'Paper':
        return { bg: 'bg-amber-50 text-amber-800 border-amber-200', icon: '📦', binColor: 'Yellow/Blue' };
      case 'Metal':
        return { bg: 'bg-sky-50 text-sky-800 border-sky-200', icon: '🥫', binColor: 'Blue' };
      case 'Glass':
        return { bg: 'bg-teal-50 text-teal-800 border-teal-200', icon: '🍾', binColor: 'Green/Teal' };
      case 'Organic Waste':
        return { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: '🍎', binColor: 'Green' };
      case 'E-Waste':
        return { bg: 'bg-purple-50 text-purple-800 border-purple-200', icon: '💻', binColor: 'Orange' };
      case 'Hazardous Waste':
        return { bg: 'bg-rose-50 text-rose-800 border-rose-200', icon: '⚠️', binColor: 'Red' };
      default:
        return { bg: 'bg-slate-50 text-slate-800 border-slate-200', icon: '♻️', binColor: 'Grey' };
    }
  };

  // Status badge for pickup
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Assigned':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  // Filtered scans
  const filteredScans = scans.filter((item) => {
    const matchesSearch =
      (item.subType || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.disposalMethod || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesRecyclable =
      recyclableFilter === 'all'
        ? true
        : recyclableFilter === 'recyclable'
        ? item.recyclable
        : !item.recyclable;

    return matchesSearch && matchesCategory && matchesRecyclable;
  });

  const categories = [
    'All',
    'Plastic',
    'Paper',
    'Metal',
    'Glass',
    'Organic Waste',
    'E-Waste',
    'Hazardous Waste',
  ];

  // Calculated Stats
  const totalScans = scans.length;
  const recyclableCount = scans.filter((s) => s.recyclable).length;
  const totalPointsFromScans = totalScans * 15;
  const isGuest = !currentUser.email || currentUser.email === 'guest@smartwaste.ai';

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Top Banner & Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-6 sm:p-8 shadow-lg border border-emerald-700/50">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
              <History className="w-3.5 h-3.5" />
              <span>Personal Environmental Archive</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              My Waste & Recycling History
            </h1>
            <p className="text-emerald-100/90 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Every item identified with the SmartWaste AI scanner and every scheduled curbside
              collection is automatically saved to your verified account.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportCsv}
              disabled={scans.length === 0}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold flex items-center gap-2 backdrop-blur-md transition-all cursor-pointer disabled:opacity-50"
              title="Download entire scan history as CSV"
            >
              <Download className="w-4 h-4 text-emerald-300" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => onNavigateTab('scanner')}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Scan New Item</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-emerald-700/40">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
              Total Scans Saved
            </p>
            <p className="text-2xl font-extrabold text-white mt-1">{totalScans}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
              Items Recyclable
            </p>
            <p className="text-2xl font-extrabold text-white mt-1">
              {recyclableCount}{' '}
              <span className="text-xs font-normal text-emerald-200">
                ({totalScans > 0 ? Math.round((recyclableCount / totalScans) * 100) : 0}%)
              </span>
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
              Eco-Points from Scans
            </p>
            <p className="text-2xl font-extrabold text-emerald-300 mt-1">
              +{totalPointsFromScans} <span className="text-xs font-normal text-white">pts</span>
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
              Curbside Pickups
            </p>
            <p className="text-2xl font-extrabold text-white mt-1">{pickups.length}</p>
          </div>
        </div>
      </div>

      {/* Guest Notice (if not logged in) */}
      {isGuest && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                You are currently viewing in Guest Mode
              </h4>
              <p className="text-[11px] text-slate-600">
                Log in or create a free Eco Profile so your scanned waste and scheduled collections are permanently saved across sessions and devices.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('login')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In / Register</span>
          </button>
        </div>
      )}

      {/* Message feedback */}
      {message && (
        <div
          className={`p-3.5 rounded-2xl text-xs flex items-center justify-between gap-2 border animate-in fade-in ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>
      )}

      {/* Main Tabs: Scans vs Pickups */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('scans')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'scans'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Waste Scans ({scans.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('pickups')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'pickups'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Scheduled Pickups ({pickups.length})</span>
          </button>
        </div>

        {activeSubTab === 'scans' && scans.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowClearModal(true)}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-3 py-1.5 rounded-xl hover:bg-rose-50 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Scans</span>
            </button>
          </div>
        )}
      </div>

      {/* SUB-TAB 1: AI SCANS HISTORY */}
      {activeSubTab === 'scans' && (
        <div className="space-y-6">
          {/* Search & Category Filter Controls */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search saved scans by item name, material, or disposal tip..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>

              {/* Recyclability Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 shrink-0">
                <button
                  onClick={() => setRecyclableFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                    recyclableFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Items
                </button>
                <button
                  onClick={() => setRecyclableFilter('recyclable')}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                    recyclableFilter === 'recyclable'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ✓ Recyclable
                </button>
                <button
                  onClick={() => setRecyclableFilter('non-recyclable')}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                    recyclableFilter === 'non-recyclable'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Specialized / Hazard
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
                Category:
              </span>
              {categories.map((cat) => {
                const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scans Grid */}
          {isLoading ? (
            <div className="py-20 text-center">
              <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-500 font-medium">Loading your scan records...</p>
            </div>
          ) : filteredScans.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto text-2xl shadow-xs">
                📸
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900">
                No matching scan records found
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {scans.length === 0
                  ? 'You haven\'t scanned any items yet. Capture or upload a photo with our AI Scanner to start saving your history!'
                  : 'No items match your active search or category filters. Try clearing the filters.'}
              </p>
              <div className="pt-2 flex justify-center gap-3">
                {scans.length > 0 && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setRecyclableFilter('all');
                    }}
                    className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                  >
                    Reset Filters
                  </button>
                )}
                <button
                  onClick={() => onNavigateTab('scanner')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Scan Waste Now</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredScans.map((scan) => {
                const theme = getCategoryTheme(scan.category);
                return (
                  <div
                    key={scan.id}
                    className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Thumbnail or Category Header */}
                      <div className="relative h-44 bg-slate-100 overflow-hidden border-b border-slate-100">
                        {scan.imageUrl ? (
                          <img
                            src={scan.imageUrl}
                            alt={scan.subType}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50/50">
                            <span className="text-4xl mb-1">{theme.icon}</span>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                              {scan.category}
                            </span>
                          </div>
                        )}

                        {/* Badges on image */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border shadow-xs ${theme.bg}`}>
                            {theme.icon} {scan.category}
                          </span>
                        </div>

                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold shadow-xs ${
                              scan.recyclable
                                ? 'bg-emerald-600 text-white'
                                : 'bg-rose-600 text-white'
                            }`}
                          >
                            {scan.recyclable ? '✓ Recyclable' : 'Specialized'}
                          </span>
                        </div>

                        <div className="absolute bottom-2.5 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-md font-mono">
                          {scan.timestamp}
                        </div>

                        <div className="absolute bottom-2.5 right-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-800 shadow-xs">
                          {scan.confidence}% Confidence
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-5 space-y-3">
                        <div>
                          <h3 className="font-heading font-bold text-base text-slate-900 leading-tight">
                            {scan.subType}
                          </h3>
                          <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                            Receptacle: <strong>{scan.suggestedBinColor}</strong>
                          </p>
                        </div>

                        {/* Disposal Instructions */}
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs text-slate-700 space-y-1">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Disposal Guide</span>
                          </p>
                          <p className="text-[11px] leading-relaxed line-clamp-3">
                            {scan.disposalMethod}
                          </p>
                        </div>

                        {/* Environmental Impact */}
                        {scan.environmentalImpact && (
                          <div className="bg-emerald-50/60 rounded-xl p-2.5 border border-emerald-100 text-[11px] text-emerald-900 leading-relaxed flex items-start gap-2">
                            <Leaf className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{scan.environmentalImpact}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {onScheduleCollection && (
                          <button
                            onClick={() =>
                              onScheduleCollection(
                                scan.category as WasteCategory,
                                `Saved item: ${scan.subType}`
                              )
                            }
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Schedule curbside pickup for this waste"
                          >
                            <Calendar className="w-3 h-3 text-emerald-600" />
                            <span>Pickup</span>
                          </button>
                        )}

                        {onOpenEcoBot && (
                          <button
                            onClick={() =>
                              onOpenEcoBot(
                                `How should I prepare and recycle ${scan.subType}?`
                              )
                            }
                            className="px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Ask EcoBot for upcycling and segregation tips"
                          >
                            <Bot className="w-3 h-3 text-teal-600" />
                            <span>Ask Bot</span>
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => handleDeleteItem(scan.id)}
                        disabled={isDeleting === scan.id}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete scan from history"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: SCHEDULED PICKUPS HISTORY */}
      {activeSubTab === 'pickups' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Your Curbside Collection Receipts
              </h3>
              <p className="text-xs text-slate-500">
                Track status updates and driver dispatch for on-demand waste pickups.
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('collection')}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
            >
              <Truck className="w-4 h-4" />
              <span>Book Collection</span>
            </button>
          </div>

          {pickups.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto text-2xl shadow-xs">
                🚛
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900">
                No scheduled pickups yet
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Need to dispose of bulk e-waste, hazardous materials, or high-volume recyclables? Book an on-demand pickup with our municipal fleet!
              </p>
              <button
                onClick={() => onNavigateTab('collection')}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Schedule Curbside Pickup
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Request ID</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Scheduled Date</th>
                      <th className="py-3.5 px-4">Address</th>
                      <th className="py-3.5 px-4">Est. Weight</th>
                      <th className="py-3.5 px-4">Collector</th>
                      <th className="py-3.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pickups.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{p.id}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-800">{p.category}</span>
                          {p.notes && (
                            <p className="text-[10px] text-slate-500 truncate max-w-[180px]">
                              {p.notes}
                            </p>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{p.scheduledDate}</td>
                        <td className="py-3.5 px-4 text-slate-700 max-w-[200px] truncate">{p.address}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">{p.weightKg} kg</td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {p.collectorName || <span className="text-slate-400 italic">Pending dispatch</span>}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(
                              p.status
                            )}`}
                          >
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Clear History Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Clear All AI Scan History?
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                This will permanently delete all saved AI waste classification cards associated with your profile (<strong>{currentUser.email}</strong>). This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearHistory}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm cursor-pointer"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
