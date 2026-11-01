import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
  Plus,
  Send,
  UserCheck,
  ChevronRight,
  Info,
  X,
  PackageCheck,
} from 'lucide-react';
import { CollectionRequest, SmartBin, User, WasteCategory, CollectionVehicle, OptimizedRoute } from '../types';
import { WasteMap } from './WasteMap';

interface CollectionManagementProps {
  collections: CollectionRequest[];
  bins: SmartBin[];
  vehicles?: CollectionVehicle[];
  activeRoute?: OptimizedRoute | null;
  currentUser: User;
  onCreateRequest: (data: Partial<CollectionRequest>) => Promise<void>;
  onUpdateRequestStatus: (id: string, status: string, collectorName?: string, notes?: string) => Promise<void>;
  prefilledCategory?: WasteCategory;
  prefilledNotes?: string;
  onNavigateToOptimizer?: () => void;
}

export const CollectionManagement: React.FC<CollectionManagementProps> = ({
  collections,
  bins,
  vehicles = [],
  activeRoute = null,
  currentUser,
  onCreateRequest,
  onUpdateRequestStatus,
  prefilledCategory,
  prefilledNotes,
  onNavigateToOptimizer,
}) => {
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('All');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form State
  const [category, setCategory] = useState<string>(prefilledCategory || 'Plastic');
  const [weightKg, setWeightKg] = useState<number>(10);
  const [address, setAddress] = useState<string>('550 Market Street, San Francisco, CA');
  const [lat, setLat] = useState<number>(37.7749);
  const [lng, setLng] = useState<number>(-122.4194);
  const [scheduledDate, setScheduledDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState<string>(prefilledNotes || '');
  const [citizenName, setCitizenName] = useState<string>(currentUser.name);
  const [citizenPhone, setCitizenPhone] = useState<string>(currentUser.phone || '+1 (555) 234-5678');

  // Handle map click to update coordinates and reverse-geocode label
  const handleMapLocationSelect = (newLat: number, newLng: number) => {
    setLat(newLat);
    setLng(newLng);
    setAddress(`Coordinates [${newLat}, ${newLng}] near Market Corridor`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onCreateRequest({
        citizenName,
        citizenEmail: currentUser.email,
        citizenPhone,
        category: category as any,
        weightKg: Number(weightKg),
        address,
        lat,
        lng,
        scheduledDate,
        notes,
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsModalOpen(false);
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter collections
  const filteredCollections = collections.filter((item) => {
    if (activeStatusFilter === 'All') return true;
    return item.status.toLowerCase() === activeStatusFilter.toLowerCase();
  });

  const getStatusBadge = (status: CollectionRequest['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Assigned':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'In Progress':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
              Smart Waste Collection &amp; Route Logistics
            </h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              Live Map
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Dispatch, track, and complete municipal waste collection requests with geolocation tracking.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 cursor-pointer transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Request Waste Pickup</span>
        </button>
      </div>

      {/* Interactive Map Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>City Collection Grid &amp; IoT Bin Locations</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Interactive OpenStreetMap showing real-time collection sites, smart bins, and overflow telemetry.
            </p>
          </div>
          <span className="text-xs text-slate-500">
            {collections.length} Total Requests • {bins.length} Smart Bins
          </span>
        </div>

        {/* Leaflet Map */}
        <WasteMap
          collections={collections}
          bins={bins}
          vehicles={vehicles}
          activeRoute={activeRoute}
          selectedRequestId={selectedRequestId}
          onSelectLocation={handleMapLocationSelect}
        />

        {/* AI Route Banner if route is active */}
        {activeRoute && (
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🚛</span>
              <div>
                <span className="font-bold text-sky-900">
                  Active Optimized Route for {activeRoute.vehicleName}
                </span>
                <p className="text-sky-700 text-[11px]">
                  {activeRoute.waypoints.length} sequenced stops ({activeRoute.totalDistanceKm} km) • Est. {activeRoute.estimatedMinutes} mins • Offset: +{activeRoute.fuelSavedKgCO2} kg CO₂
                </p>
              </div>
            </div>

            {onNavigateToOptimizer && (
              <button
                onClick={onNavigateToOptimizer}
                className="px-3 py-1.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-semibold text-[11px] cursor-pointer"
              >
                Re-Optimize in Admin
              </button>
            )}
          </div>
        )}
      </div>

      {/* Requests Management Table / Cards */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-heading text-lg font-bold text-slate-900">
              Waste Collection Requests
            </h3>
            <p className="text-xs text-slate-500">
              {currentUser.role === 'citizen'
                ? 'Your scheduled pickups and municipal status updates'
                : currentUser.role === 'collector'
                ? 'Assigned dispatch jobs and status management'
                : 'All municipal collection logistics and dispatcher controls'}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {['All', 'Pending', 'Assigned', 'In Progress', 'Completed'].map((st) => (
              <button
                key={st}
                onClick={() => setActiveStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                  activeStatusFilter === st
                    ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-3">
          {filteredCollections.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No collection requests found matching "{activeStatusFilter}".
            </div>
          ) : (
            filteredCollections.map((req) => (
              <div
                key={req.id}
                onClick={() => setSelectedRequestId(req.id)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer ${
                  selectedRequestId === req.id
                    ? 'border-emerald-500 bg-emerald-50/20 shadow-xs'
                    : 'border-slate-200/80 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-lg shrink-0">
                    {req.category === 'Plastic'
                      ? '🥤'
                      : req.category === 'Organic Waste'
                      ? '🍌'
                      : req.category === 'E-Waste'
                      ? '📱'
                      : req.category === 'Metal'
                      ? '🥫'
                      : req.category === 'Glass'
                      ? '🍾'
                      : req.category === 'Hazardous Waste'
                      ? '⚠️'
                      : '📦'}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-slate-800">
                        {req.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getStatusBadge(
                          req.status
                        )}`}
                      >
                        {req.status}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {req.category} • {req.weightKg} kg
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-800">
                      Citizen: {req.citizenName}
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{req.address}</span>
                    </div>

                    {req.notes && (
                      <p className="text-[11px] text-slate-600 mt-1 italic">
                        "{req.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right side: Dates & Collector Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <div className="text-left md:text-right space-y-0.5">
                    <div className="text-slate-700 font-semibold flex items-center md:justify-end gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Pickup: {req.scheduledDate}</span>
                    </div>
                    {req.collectorName && (
                      <div className="text-[11px] text-blue-600 font-medium">
                        Collector: {req.collectorName}
                      </div>
                    )}
                  </div>

                  {/* Role-Specific Status Controls */}
                  {(currentUser.role === 'collector' || currentUser.role === 'admin') && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      {req.status === 'Pending' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateRequestStatus(req.id, 'Assigned', currentUser.name);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] cursor-pointer"
                        >
                          Claim / Assign
                        </button>
                      )}
                      {req.status === 'Assigned' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateRequestStatus(req.id, 'In Progress', currentUser.name);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-[11px] cursor-pointer"
                        >
                          Start Route
                        </button>
                      )}
                      {req.status === 'In Progress' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateRequestStatus(req.id, 'Completed', currentUser.name);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] cursor-pointer flex items-center gap-1"
                        >
                          <PackageCheck className="w-3 h-3" />
                          <span>Mark Completed</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-heading text-lg font-bold text-slate-900">
                  Schedule Waste Collection
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-heading text-lg font-bold text-slate-800">
                  Request Confirmed!
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Your smart collection dispatch has been routed to our regional waste fleet.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
                {/* Waste Category Selection */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Waste Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:outline-emerald-500"
                  >
                    <option value="Plastic">Plastic (PET, HDPE, containers)</option>
                    <option value="Paper">Paper &amp; Cardboard</option>
                    <option value="Metal">Metal (Aluminum cans, scrap copper/iron)</option>
                    <option value="Glass">Glass (Bottles &amp; Jars)</option>
                    <option value="Organic Waste">Organic Waste &amp; Compost</option>
                    <option value="E-Waste">E-Waste (Phones, Batteries, Laptops)</option>
                    <option value="Hazardous Waste">Hazardous Waste (Chemicals, Solvents)</option>
                    <option value="Mixed">Mixed Bulk Recyclables</option>
                  </select>
                </div>

                {/* Weight & Date */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Estimated Weight (kg) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="500"
                      value={weightKg}
                      onChange={(e) => setWeightKg(parseFloat(e.target.value) || 1)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:outline-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Collection Date *
                    </label>
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:outline-emerald-500"
                      required
                    />
                  </div>
                </div>

                {/* Address & Coordinates */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Pickup Street Address *
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 742 Evergreen Terrace, Sector 4"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:outline-emerald-500"
                    required
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Tip: Click anywhere on the map to pin exact GPS location.
                  </p>
                </div>

                {/* Citizen Details */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Citizen Name *
                    </label>
                    <input
                      type="text"
                      value={citizenName}
                      onChange={(e) => setCitizenName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:outline-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      value={citizenPhone}
                      onChange={(e) => setCitizenPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:outline-emerald-500"
                      required
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Handling Instructions / Notes
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Boxed separately, curbside pickup near green gate"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:outline-emerald-500"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Dispatching...' : 'Confirm Request'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
