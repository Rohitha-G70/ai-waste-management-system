import React, { useState } from 'react';

// 1. Donut / Pie Chart Component
interface DonutChartProps {
  data: { name: string; amountKg: number; percentage: number; color: string }[];
  size?: number;
  innerRadius?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({ data, size = 260, innerRadius = 70 }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const total = data.reduce((acc, curr) => acc + curr.amountKg, 0);

  const center = size / 2;
  const radius = (size / 2) - 15;

  let accumulatedAngle = -90; // Start at top

  const slices = data.map((item, index) => {
    const angle = (item.amountKg / (total || 1)) * 360;
    const startAngle = accumulatedAngle;
    const endAngle = accumulatedAngle + angle;
    accumulatedAngle += angle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const ix1 = center + innerRadius * Math.cos(endRad);
    const iy1 = center + innerRadius * Math.sin(endRad);
    const ix2 = center + innerRadius * Math.cos(startRad);
    const iy2 = center + innerRadius * Math.sin(startRad);

    const largeArc = angle > 180 ? 1 : 0;

    const pathData = `
      M ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
      L ${ix1} ${iy1}
      A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix2} ${iy2}
      Z
    `;

    return {
      ...item,
      pathData,
      index,
    };
  });

  const activeItem = hoveredIndex !== null ? data[hoveredIndex] : null;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="drop-shadow-sm">
          {slices.map((slice) => {
            const isHovered = hoveredIndex === slice.index;
            return (
              <path
                key={slice.name}
                d={slice.pathData}
                fill={slice.color}
                className="transition-all duration-200 cursor-pointer"
                style={{
                  opacity: hoveredIndex === null || isHovered ? 1 : 0.6,
                  transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                  transformOrigin: `${center}px ${center}px`,
                }}
                onMouseEnter={() => setHoveredIndex(slice.index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
          {activeItem ? (
            <>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {activeItem.name}
              </span>
              <span className="text-xl font-bold text-slate-900">
                {activeItem.percentage}%
              </span>
              <span className="text-xs text-slate-400">
                {(activeItem.amountKg / 1000).toFixed(1)}k kg
              </span>
            </>
          ) : (
            <>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total
              </span>
              <span className="text-2xl font-bold text-emerald-700">
                {(total / 1000).toFixed(1)}k
              </span>
              <span className="text-xs text-slate-500">Kilograms</span>
            </>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 text-xs flex-1">
        {data.map((item, idx) => (
          <div
            key={item.name}
            className={`flex items-center justify-between p-1.5 rounded-lg transition-colors cursor-pointer ${
              hoveredIndex === idx ? 'bg-emerald-50' : 'hover:bg-slate-50'
            }`}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-center gap-2 truncate pr-2">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-medium text-slate-700 truncate">{item.name}</span>
            </div>
            <span className="font-semibold text-slate-900 shrink-0">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 2. Dual Bar Chart (Collected vs Recycled)
interface BarChartProps {
  data: { month: string; collected: number; recycled: number }[];
  height?: number;
}

export const MonthlyBarChart: React.FC<BarChartProps> = ({ data, height = 240 }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxVal = Math.max(...data.map(d => Math.max(d.collected, d.recycled))) * 1.15 || 30000;

  return (
    <div className="w-full">
      <div className="flex items-center justify-end gap-5 mb-4 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-emerald-700 inline-block"></span>
          <span className="text-slate-600 font-medium">Collected (kg)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-emerald-400 inline-block"></span>
          <span className="text-slate-600 font-medium">Recycled (kg)</span>
        </div>
      </div>

      <div className="flex items-end gap-3 sm:gap-6 justify-between pt-6 border-b border-slate-200" style={{ height }}>
        {data.map((item, idx) => {
          const colHeight = (item.collected / maxVal) * (height - 40);
          const recHeight = (item.recycled / maxVal) * (height - 40);
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={item.month}
              className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-12 z-20 bg-slate-900 text-white text-[11px] py-1 px-2.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
                  <div className="font-semibold">{item.month}</div>
                  <div>Collected: {item.collected.toLocaleString()} kg</div>
                  <div>Recycled: {item.recycled.toLocaleString()} kg ({((item.recycled / item.collected) * 100).toFixed(1)}%)</div>
                </div>
              )}

              <div className="w-full flex items-end justify-center gap-1.5 h-full">
                {/* Bar 1: Collected */}
                <div
                  className="w-1/2 max-w-[24px] bg-emerald-700 rounded-t transition-all duration-300"
                  style={{
                    height: `${colHeight}px`,
                    opacity: hoveredIdx === null || isHovered ? 1 : 0.7,
                  }}
                />
                {/* Bar 2: Recycled */}
                <div
                  className="w-1/2 max-w-[24px] bg-emerald-400 rounded-t transition-all duration-300"
                  style={{
                    height: `${recHeight}px`,
                    opacity: hoveredIdx === null || isHovered ? 1 : 0.7,
                  }}
                />
              </div>

              <span className="text-xs font-medium text-slate-500 mt-2">{item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 3. Trend Line Chart Component (Segregation Accuracy / Recycling Trend)
interface LineChartProps {
  data: { month: string; accuracy: number; recycled: number }[];
  height?: number;
}

export const TrendLineChart: React.FC<LineChartProps> = ({ data, height = 220 }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const minAccuracy = 80;
  const maxAccuracy = 100;
  const width = 500;
  const paddingX = 40;
  const paddingY = 30;

  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingY * 2;

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * innerWidth;
    const y = height - paddingY - ((d.accuracy - minAccuracy) / (maxAccuracy - minAccuracy)) * innerHeight;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Segregation Accuracy Rate (%)
        </span>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          Peak: {Math.max(...data.map(d => d.accuracy))}%
        </span>
      </div>

      <div className="relative w-full" style={{ height }}>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* Grid lines */}
          {[80, 85, 90, 95, 100].map((val) => {
            const y = height - paddingY - ((val - minAccuracy) / (maxAccuracy - minAccuracy)) * innerHeight;
            return (
              <g key={val}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                />
                <text x={paddingX - 10} y={y + 4} textAnchor="end" fontSize="10" fill="#94a3b8">
                  {val}%
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path d={areaD} fill="url(#accuracyGradient)" opacity="0.4" />

          {/* Line stroke */}
          <path d={pathD} fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Points */}
          {points.map((p, idx) => (
            <g key={p.month}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIdx === idx ? 6 : 4}
                fill="#ffffff"
                stroke="#047857"
                strokeWidth="2.5"
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
              <text x={p.x} y={height - 10} textAnchor="middle" fontSize="11" fill="#64748b" fontWeight="500">
                {p.month}
              </text>
            </g>
          ))}
        </svg>

        {hoveredIdx !== null && (
          <div
            className="absolute z-20 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded shadow pointer-events-none transform -translate-x-1/2 -translate-y-full"
            style={{
              left: `${(points[hoveredIdx].x / width) * 100}%`,
              top: `${(points[hoveredIdx].y / height) * 100}%`,
            }}
          >
            <div className="font-semibold">{points[hoveredIdx].month}</div>
            <div className="text-emerald-300">Accuracy: {points[hoveredIdx].accuracy}%</div>
          </div>
        )}
      </div>
    </div>
  );
};
