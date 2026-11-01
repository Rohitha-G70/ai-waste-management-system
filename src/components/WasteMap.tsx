import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { CollectionRequest, SmartBin, CollectionVehicle, OptimizedRoute } from '../types';

interface WasteMapProps {
  collections: CollectionRequest[];
  bins: SmartBin[];
  vehicles?: CollectionVehicle[];
  activeRoute?: OptimizedRoute | null;
  onSelectLocation?: (lat: number, lng: number) => void;
  selectedRequestId?: string | null;
}

export const WasteMap: React.FC<WasteMapProps> = ({
  collections,
  bins,
  vehicles = [],
  activeRoute = null,
  onSelectLocation,
  selectedRequestId,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialLat = 37.7749;
    const initialLng = -122.4194;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 13,
      zoomControl: true,
    });

    // OpenStreetMap Clean Carto Tile Layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    routeLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    // Click map to select pickup coordinates
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (onSelectLocation) {
        onSelectLocation(Number(e.latlng.lat.toFixed(5)), Number(e.latlng.lng.toFixed(5)));
      }
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers & Optimized Route Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !routeLayerRef.current) return;

    const layerGroup = markersLayerRef.current;
    const routeGroup = routeLayerRef.current;
    layerGroup.clearLayers();
    routeGroup.clearLayers();

    // 1. Add IoT Smart Bins (Empty, Half Full, Full)
    bins.forEach((bin) => {
      // Empty: 0-30%, Half Full: 31-79%, Full: >=80%
      let binColor = '#10b981'; // Green = Empty/Normal
      let statusLabel = 'Empty (0-30%)';

      if (bin.fillLevel >= 80 || bin.status === 'Full') {
        binColor = '#ef4444'; // Red = Full
        statusLabel = 'Full (≥80%)';
      } else if (bin.fillLevel >= 31 || bin.status === 'Half Full') {
        binColor = '#f59e0b'; // Amber = Half Full
        statusLabel = 'Half Full (31-79%)';
      }

      const iconHtml = `
        <div style="
          background-color: ${binColor};
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 11px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          border: 2.5px solid white;
          ${bin.fillLevel >= 80 ? 'animation: pulse 1.5s infinite;' : ''}
        ">
          ${bin.fillLevel}%
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'smart-bin-marker',
        html: iconHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([bin.lat, bin.lng], { icon: customIcon });

      const popupContent = `
        <div style="font-family: inherit; font-size: 13px; line-height: 1.4; min-width: 200px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
            <strong style="color: #0f172a;">${bin.name}</strong>
            <span style="background: ${binColor}20; color: ${binColor}; font-weight: 700; font-size: 10px; padding: 1px 6px; border-radius: 4px;">
              ${bin.status || statusLabel}
            </span>
          </div>
          <div style="color: #64748b; font-size: 11px; margin-bottom: 6px;">IoT Sensor ID: <strong>${bin.id}</strong></div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
            <span>Waste Stream:</span>
            <strong>${bin.category}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
            <span>Fill Percentage:</span>
            <strong style="color: ${binColor}; font-size: 14px;">${bin.fillLevel}%</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
            <span>Battery / Temp:</span>
            <span>⚡ ${bin.battery}% • 🌡️ ${bin.temperatureCelsius || 20}°C</span>
          </div>
          <div style="color: #64748b; font-size: 11px; margin-top: 6px; border-top: 1px solid #e2e8f0; padding-top: 4px;">
            📍 ${bin.address}
          </div>
          <div style="color: #64748b; font-size: 10px;">
            Last Service: ${bin.lastEmptied}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      layerGroup.addLayer(marker);
    });

    // 2. Add Collection Fleet Vehicles
    vehicles.forEach((veh) => {
      const isMoving = veh.status === 'En Route';
      const vehHtml = `
        <div style="
          background: #0f172a;
          color: #38bdf8;
          width: 38px;
          height: 38px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.4);
          border: 2.5px solid #38bdf8;
        ">
          🚛
        </div>
      `;

      const vehIcon = L.divIcon({
        className: 'vehicle-marker',
        html: vehHtml,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });

      const marker = L.marker([veh.lat, veh.lng], { icon: vehIcon });
      const popupContent = `
        <div style="font-family: inherit; font-size: 13px; line-height: 1.4; min-width: 190px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong style="color: #0f172a;">${veh.name}</strong>
            <span style="background: #38bdf820; color: #0284c7; font-weight: 700; font-size: 10px; padding: 1px 6px; border-radius: 4px;">
              ${veh.status}
            </span>
          </div>
          <div style="color: #64748b; font-size: 11px; margin-bottom: 4px;">ID: ${veh.id} • Driver: ${veh.driverName}</div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
            <span>Load:</span>
            <strong>${veh.currentLoadKg} / ${veh.capacityKg} kg</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
            <span>Battery:</span>
            <strong style="color: #10b981;">⚡ ${veh.fuelBatteryPercent}%</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Speed:</span>
            <strong>${veh.speedKmh} km/h</strong>
          </div>
        </div>
      `;
      marker.bindPopup(popupContent);
      layerGroup.addLayer(marker);
    });

    // 3. Add Collection Requests
    collections.forEach((req) => {
      const isSelected = selectedRequestId === req.id;
      let statusColor = '#f59e0b';
      if (req.status === 'Assigned') statusColor = '#3b82f6';
      if (req.status === 'In Progress') statusColor = '#8b5cf6';
      if (req.status === 'Completed') statusColor = '#10b981';

      const iconHtml = `
        <div style="
          background-color: ${statusColor};
          color: white;
          width: ${isSelected ? '36px' : '28px'};
          height: ${isSelected ? '36px' : '28px'};
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 13px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          border: 2px solid white;
          transform: rotate(45deg);
        ">
          <span style="transform: rotate(-45deg);">📦</span>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'collection-marker',
        html: iconHtml,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      const marker = L.marker([req.lat, req.lng], { icon: customIcon });

      const popupContent = `
        <div style="font-family: inherit; font-size: 13px; line-height: 1.4; min-width: 200px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <strong style="color: #0f172a;">${req.id}</strong>
            <span style="background: ${statusColor}22; color: ${statusColor}; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600;">
              ${req.status}
            </span>
          </div>
          <div style="font-weight: 600; color: #047857;">${req.category} (${req.weightKg} kg)</div>
          <div style="color: #475569; font-size: 12px;">Citizen: ${req.citizenName}</div>
          <div style="color: #64748b; font-size: 11px; margin-top: 4px;">📍 ${req.address}</div>
          <div style="color: #64748b; font-size: 11px;">📅 Scheduled: ${req.scheduledDate}</div>
        </div>
      `;

      marker.bindPopup(popupContent);
      layerGroup.addLayer(marker);
    });

    // 4. Render AI Optimized Route Polyline & Waypoint Badges
    if (activeRoute && activeRoute.waypoints.length > 1) {
      const latlngs: [number, number][] = activeRoute.waypoints.map((w) => [w.lat, w.lng]);

      // Route Polyline
      const polyline = L.polyline(latlngs, {
        color: '#0284c7',
        weight: 5,
        opacity: 0.85,
        dashArray: '8, 8',
      });
      routeGroup.addLayer(polyline);

      // Sequence Waypoints Markers
      activeRoute.waypoints.forEach((wp, idx) => {
        const isDepot = idx === 0;
        const isMRF = idx === activeRoute.waypoints.length - 1;

        const wpColor = isDepot ? '#0f172a' : isMRF ? '#059669' : '#0284c7';
        const labelText = isDepot ? 'START' : isMRF ? 'END' : `${wp.stepNumber}`;

        const wpHtml = `
          <div style="
            background: ${wpColor};
            color: white;
            width: ${isDepot || isMRF ? '44px' : '28px'};
            height: 28px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 11px;
            border: 2px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          ">
            ${labelText}
          </div>
        `;

        const wpIcon = L.divIcon({
          className: 'waypoint-marker',
          html: wpHtml,
          iconSize: [44, 28],
          iconAnchor: [22, 14],
        });

        const wpMarker = L.marker([wp.lat, wp.lng], { icon: wpIcon });
        wpMarker.bindPopup(`
          <div style="font-size: 12px; line-height: 1.4;">
            <div style="font-weight: 700; color: #0284c7;">Stop #${wp.stepNumber}: ${wp.label}</div>
            <div style="color: #64748b; font-size: 11px; margin-top: 2px;">Action: ${wp.action}</div>
          </div>
        `);
        routeGroup.addLayer(wpMarker);
      });
    }
  }, [collections, bins, vehicles, activeRoute, selectedRequestId]);

  return (
    <div className="relative w-full h-[470px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200 shadow-md text-xs space-y-1.5 max-w-[240px]">
        <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-1 flex items-center justify-between">
          <span>Smart Grid Legend</span>
          <span className="text-[10px] text-slate-400 font-normal">IoT v2.4</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white inline-block shadow-2xs" />
          <span className="text-slate-700">Empty (0-30%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-white inline-block shadow-2xs" />
          <span className="text-slate-700">Half Full (31-79%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-rose-500 border border-white inline-block shadow-2xs" />
          <span className="text-slate-700 font-bold text-rose-700">Full (≥80% Alert)</span>
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
          <span className="text-sm">🚛</span>
          <span className="text-slate-700">EV Fleet Vehicle</span>
        </div>
        {activeRoute && (
          <div className="flex items-center gap-2 pt-1 border-t border-slate-100 text-sky-700 font-bold">
            <span className="w-4 h-1 bg-sky-600 inline-block rounded" />
            <span>AI Optimized Route Active</span>
          </div>
        )}
      </div>

      {/* Real-time Notice Overlay */}
      <div className="absolute top-3 right-3 z-[1000] bg-slate-900/85 backdrop-blur-md text-white text-[11px] px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Simulated IoT Bins &amp; Fleet Telemetry</span>
      </div>
    </div>
  );
};
