import React, { useState, useEffect } from 'react';
import {
  Shield,
  Cpu,
  Truck,
  Users,
  Layers,
  Settings,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  Sliders,
  Download,
  MapPin,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Zap,
} from 'lucide-react';
import {
  SmartBin,
  CollectionRequest,
  CollectionVehicle,
  OptimizedRoute,
  User,
  WasteCategoryConfig,
} from '../types';
import { api } from '../services/api';

interface AdminDashboardProps {
  currentUser: User;
  bins: SmartBin[];
  collections: CollectionRequest[];
  onRefreshBins: () => void;
  onRefreshCollections: () => void;
  onRouteOptimized: (route: OptimizedRoute) => void;
  onSwitchToAdmin: () => void;
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  bins,
  collections,
  onRefreshBins,
  onRefreshCollections,
  onRouteOptimized,
  onSwitchToAdmin,
  onNavigateTab,
}) => {
  const [activeTab, setActiveTab] = useState<'bins' | 'routes' | 'categories' | 'users' | 'requests'>('bins');
  const [threshold, setThreshold] = useState<number>(80);
  const [vehicles, setVehicles] = useState<CollectionVehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('FLEET-EV-01');
  const [optimizing, setOptimizing] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<OptimizedRoute | null>(null);
  const [simulatingTick, setSimulatingTick] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<WasteCategoryConfig[]>([]);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const [threshRes, vehRes, usersRes, catRes] = await Promise.all([
        api.getBinThreshold().catch(() => ({ threshold: 80 })),
        api.getVehicles().catch(() => ({ vehicles: [] })),
        api.getUsers().catch(() => ({ users: [] })),
        api.getCategories().catch(() => ({ categories: [] })),
      ]);

      if (threshRes?.threshold) setThreshold(threshRes.threshold);
      if (vehRes?.vehicles) setVehicles(vehRes.vehicles);
      if (usersRes?.users) setAllUsers(usersRes.users);
      if (catRes?.categories) setCategories(catRes.categories);
    } catch (err) {
      console.error(err);
    }
  };

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // Update Threshold
  const handleUpdateThreshold = async (newVal: number) => {
    setThreshold(newVal);
    try {
      await api.setBinThreshold(newVal);
      showFeedback(`Configured Smart Bin Alert Threshold to ${newVal}%`);
      onRefreshBins();
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  // Trigger Simulated IoT Telemetry Tick
  const handleSimulateTick = async () => {
    setSimulatingTick(true);
    try {
      const res = await api.triggerIoTTick();
      onRefreshBins();
      showFeedback(
        `IoT Telemetry Tick processed across ${res.bins.length} bins. ${
          res.alertsTriggered > 0 ? `🚨 ${res.alertsTriggered} automated alert(s) generated!` : 'All bins within limits.'
        }`
      );
    } catch (err: any) {
      showFeedback(err.message, 'error');
    } finally {
      setSimulatingTick(false);
    }
  };

  // Adjust specific bin fill level (test alert generator)
  const handleManualBinFill = async (binId: string, level: number) => {
    try {
      await api.updateBinFill(binId, level);
      onRefreshBins();
      showFeedback(`Updated ${binId} fill level to ${level}%. Status: ${level >= threshold ? 'Full (Alert Generated)' : level >= 31 ? 'Half Full' : 'Empty'}`);
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  // Run AI Route Optimization
  const handleRunOptimizer = async () => {
    setOptimizing(true);
    try {
      const res = await api.optimizeRoute({
        vehicleId: selectedVehicleId,
        minFillPercent: threshold,
      });
      setCurrentRoute(res.route);
      onRouteOptimized(res.route);
      showFeedback(
        `AI Optimized Route generated! ${res.route.binsCount} stops sequenced. Estimated fuel saved: ${res.route.fuelSavedKgCO2} kg CO₂.`
      );
    } catch (err: any) {
      showFeedback(err.message, 'error');
    } finally {
      setOptimizing(false);
    }
  };

  // Promote / Update User Role
  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const res = await api.updateUserRole(userId, newRole);
      setAllUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole as any } : u)));
      showFeedback(`Updated user ${res.user.name} to role "${newRole}"`);
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  // Update Category Config
  const handleUpdateCategory = async (catId: string, patch: Partial<WasteCategoryConfig>) => {
    try {
      const res = await api.updateCategory(catId, patch);
      setCategories((prev) => prev.map((c) => (c.id === catId ? res.category : c)));
      showFeedback(`Updated category configuration for ${res.category.name}`);
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  // Access Control Guard
  if (currentUser.role !== 'admin') {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-slate-900">
          Administrator Authorization Required
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          The Admin Command Center allows managing IoT bins, thresholds, automated fleet routing, and user roles. Currently logged in as{' '}
          <strong className="text-emerald-700 capitalize">{currentUser.role}</strong> ({currentUser.email}).
        </p>

        <div className="pt-2">
          <button
            onClick={onSwitchToAdmin}
            className="px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md cursor-pointer inline-flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            <span>Switch to Administrator (Elena Rostova)</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
              City Administrator Command Center
            </h1>
            <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
              Admin Privileged
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure smart IoT sensors, run AI collection route optimization, manage waste streams, and audit requests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateTick}
            disabled={simulatingTick}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${simulatingTick ? 'animate-spin' : ''}`} />
            <span>Simulate IoT Telemetry Tick</span>
          </button>

          <a
            href="/api/analytics/export-csv"
            download
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Audit CSV</span>
          </a>
        </div>
      </div>

      {feedbackMsg && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border border-rose-200 text-rose-900'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto text-xs">
        {[
          { id: 'bins', label: 'IoT Smart Bins & Thresholds', icon: Cpu },
          { id: 'routes', label: 'AI Route Optimizer', icon: Truck },
          { id: 'categories', label: 'Waste Categories Config', icon: Layers },
          { id: 'users', label: 'User & Role Directory', icon: Users },
          { id: 'requests', label: 'Collection Requests', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Smart Bins & IoT Simulator Tab */}
      {activeTab === 'bins' && (
        <div className="space-y-6">
          {/* Threshold Configurator */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-emerald-600" />
                  <span>Configurable Automated Collection Alert Threshold</span>
                </h3>
                <p className="text-xs text-slate-500">
                  When a smart bin sensor reaches this fill percentage, a high-priority collection alert is generated automatically.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-2xl font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                  {threshold}%
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>50% (High Frequency Pickup)</span>
                <span>Current: {threshold}%</span>
                <span>95% (Near Overflow)</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={threshold}
                onChange={(e) => handleUpdateThreshold(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>
          </div>

          {/* Connected Bins Grid with Manual Sensor Simulation Override */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading text-base font-bold text-slate-900">
                  Smart Bin Fleet &amp; Sensor Calibration
                </h3>
                <p className="text-xs text-slate-500">
                  Adjust fill levels to test alert triggers or dispatch empties
                </p>
              </div>
              <span className="text-xs text-slate-500">{bins.length} Active Hardware Nodes</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bins.map((bin) => {
                const isFull = bin.fillLevel >= threshold || bin.status === 'Full';
                const isHalf = bin.fillLevel >= 31 && !isFull;

                return (
                  <div
                    key={bin.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isFull
                        ? 'border-rose-300 bg-rose-50/40'
                        : isHalf
                        ? 'border-amber-300 bg-amber-50/30'
                        : 'border-slate-200 bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          {bin.id}
                        </span>
                        <h4 className="font-bold text-xs text-slate-900">{bin.name}</h4>
                        <p className="text-[11px] text-slate-500">{bin.category}</p>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          isFull
                            ? 'bg-rose-600 text-white animate-pulse'
                            : isHalf
                            ? 'bg-amber-500 text-white'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {bin.status || (isFull ? 'Full' : isHalf ? 'Half Full' : 'Empty')}
                      </span>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-600">Fill Level</span>
                        <span className={isFull ? 'text-rose-600 font-bold' : 'text-slate-800'}>
                          {bin.fillLevel}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={bin.fillLevel}
                        onChange={(e) => handleManualBinFill(bin.id, parseInt(e.target.value, 10))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                      />
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                      <span>⚡ {bin.battery}% Battery</span>
                      <button
                        onClick={() => handleManualBinFill(bin.id, 0)}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                      >
                        Reset / Empty
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. AI Route Optimization Tab */}
      {activeTab === 'routes' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Fleet Logistics &amp; Algorithmic Dispatch
              </span>
              <h3 className="font-heading text-xl font-bold text-slate-900 mt-1">
                AI Waste Collection Route Optimization
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Sequences vehicle stops using a TSP Nearest-Neighbor heuristic, prioritizing smart bins at or above the alert threshold to minimize mileage and carbon emissions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Collection Vehicle
                </label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-emerald-500"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.status} - ⚡ {v.fuelBatteryPercent}%)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Priority Fill Threshold
                </label>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800">
                  Bins &ge; {threshold}% (or Status: Full)
                </div>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleRunOptimizer}
                  disabled={optimizing}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{optimizing ? 'Calculating Route...' : 'Generate Optimized Route'}</span>
                </button>
              </div>
            </div>

            {/* Generated Route Display */}
            {currentRoute && (
              <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sky-100 pb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-sky-800">
                      {currentRoute.id}
                    </span>
                    <h4 className="font-heading text-base font-bold text-slate-900">
                      Optimized Route for {currentRoute.vehicleName}
                    </h4>
                  </div>
                  <button
                    onClick={() => onNavigateTab('collection')}
                    className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View on Interactive Map</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-sky-100">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Total Stops</span>
                    <div className="font-heading text-xl font-bold text-slate-900">{currentRoute.waypoints.length} stops</div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-sky-100">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Route Distance</span>
                    <div className="font-heading text-xl font-bold text-sky-700">{currentRoute.totalDistanceKm} km</div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-sky-100">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Estimated Time</span>
                    <div className="font-heading text-xl font-bold text-slate-900">{currentRoute.estimatedMinutes} mins</div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-sky-100">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Fuel CO₂ Saved</span>
                    <div className="font-heading text-xl font-bold text-emerald-700">+{currentRoute.fuelSavedKgCO2} kg CO₂</div>
                  </div>
                </div>

                {/* Waypoint sequence */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Turn-by-Turn Waypoint Sequence:
                  </div>
                  <div className="divide-y divide-sky-100 bg-white rounded-xl border border-sky-100 text-xs">
                    {currentRoute.waypoints.map((wp) => (
                      <div key={wp.stepNumber} className="p-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-[10px]">
                            {wp.stepNumber}
                          </span>
                          <span className="font-medium text-slate-800">{wp.label}</span>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-500">{wp.action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Waste Categories Config Tab */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-heading text-base font-bold text-slate-900">
              Municipal Waste Stream Configurations
            </h3>
            <p className="text-xs text-slate-500">
              Customize bin colors, target recyclability rates, handling instructions, and contamination penalty schedules.
            </p>
          </div>

          <div className="space-y-4">
            {categories.map((cat) => (
              <div key={cat.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border border-white shadow-2xs" style={{ backgroundColor: cat.binColor }} />
                    <h4 className="font-bold text-sm text-slate-900">{cat.name}</h4>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Target Recyclability: {cat.recyclabilityRate}%
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-0.5">Description</label>
                    <input
                      type="text"
                      value={cat.description}
                      onChange={(e) => handleUpdateCategory(cat.id, { description: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-0.5">Citizen Instruction</label>
                    <input
                      type="text"
                      value={cat.suggestedAction}
                      onChange={(e) => handleUpdateCategory(cat.id, { suggestedAction: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-0.5">Contamination Rule</label>
                    <input
                      type="text"
                      value={cat.contaminationPenaltyRate}
                      onChange={(e) => handleUpdateCategory(cat.id, { contaminationPenaltyRate: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white text-slate-800"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. User & Role Directory Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-heading text-base font-bold text-slate-900">
                User Management &amp; Role Assignments
              </h3>
              <p className="text-xs text-slate-500">Promote or assign permissions across municipal roles</p>
            </div>
            <span className="text-xs text-slate-500">{allUsers.length} Users</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {allUsers.map((u) => (
              <div key={u.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900">{u.name}</div>
                  <div className="text-[11px] text-slate-500">
                    {u.email} • Zone: {u.zone || 'Metropolitan'} • {u.points || 0} Eco-Points
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-500">Role:</span>
                  <select
                    value={u.role}
                    onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                    className="p-1.5 rounded-lg border border-slate-200 font-semibold text-slate-800 text-xs capitalize bg-white"
                  >
                    <option value="citizen">Citizen</option>
                    <option value="collector">Waste Collector</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Collection Requests Tab */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-heading text-base font-bold text-slate-900">
                All Collection Logistics Requests
              </h3>
              <p className="text-xs text-slate-500">Manage and audit pickups submitted across the city</p>
            </div>
            <button
              onClick={() => onNavigateTab('collection')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              Open Full Logistics View →
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {collections.map((req) => (
              <div key={req.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-slate-800">{req.id}</span>
                  <span className="mx-2 text-slate-300">•</span>
                  <span className="font-semibold text-slate-900">{req.citizenName}</span>
                  <span className="mx-2 text-slate-300">•</span>
                  <span className="text-emerald-700 font-medium">{req.category} ({req.weightKg} kg)</span>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    📍 {req.address} • Scheduled: {req.scheduledDate}
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    req.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : req.status === 'In Progress'
                      ? 'bg-purple-100 text-purple-800'
                      : req.status === 'Assigned'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
