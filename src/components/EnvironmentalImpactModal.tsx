import React from 'react';
import {
  Leaf,
  X,
  ShieldCheck,
  Info,
  Scale,
  TreeDeciduous,
  Zap,
  BookOpen,
} from 'lucide-react';

interface EnvironmentalImpactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnvironmentalImpactModal: React.FC<EnvironmentalImpactModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const calculationFormulas = [
    {
      category: 'Plastic (PET / HDPE)',
      factor: '1.50 kg CO₂e / kg recycled',
      basis: 'EPA Waste Reduction Model (WARM) v15',
      note: 'Accounts for avoided petroleum cracking and virgin polymer polymerization energy.',
    },
    {
      category: 'Aluminum & Metal',
      factor: '9.10 kg CO₂e / kg recycled',
      basis: 'The Aluminum Association Life-Cycle Assessment',
      note: 'Recycling aluminum saves 95% of the massive electricity required for bauxite Bayer refining.',
    },
    {
      category: 'Paper & Cardboard',
      factor: '0.95 kg CO₂e / kg + 17 trees / ton',
      basis: 'US Forest Service & Paper Task Force',
      note: 'Reduces wood fiber extraction, chemical bleaching, and landfill methane release.',
    },
    {
      category: 'Organic Waste (Composting)',
      factor: '0.62 kg CO₂e / kg diverted',
      basis: 'IPCC Tier 1 Solid Waste Guidelines',
      note: 'Prevents anaerobic landfill decomposition which produces methane (CH₄, GWP = 28x CO₂).',
    },
    {
      category: 'Glass Containers',
      factor: '0.31 kg CO₂e / kg recycled',
      basis: 'Glass Packaging Institute Cullet Standard',
      note: 'Lower furnace melting temperature of cullet saves natural gas and silica quarrying.',
    },
    {
      category: 'E-Waste Recovery',
      factor: '12.40 kg CO₂e / kg electronics',
      basis: 'UN Global E-Waste Monitor / EMPA LCA',
      note: 'Avoids destructive gold, copper, and rare-earth heavy mining and prevents groundwater leaching.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-slate-900">
                Environmental Impact Methodology &amp; Assumptions
              </h3>
              <p className="text-xs text-slate-500">
                Scientific auditing formulas and carbon avoidance reference factors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Disclaimer Callout as explicitly instructed in Prompt */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-amber-800">
            <Info className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Academic Demonstration Transparency Notice</span>
          </div>
          <p className="text-[11px] text-amber-900 leading-relaxed">
            The environmental impact figures displayed across the SmartWaste AI dashboard (including tons of CO₂ avoided, energy conserved, and landfill space conserved) are calculated estimates modeled using internationally recognized life-cycle assessment (LCA) coefficients. They represent <strong>simulated municipal data</strong> for engineering demonstration and college evaluation, not certified real-time laboratory measurements.
          </p>
        </div>

        {/* Mathematical Models */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-emerald-600" />
            <span>Emission Reduction Coefficients by Stream</span>
          </h4>

          <div className="space-y-2 text-xs">
            {calculationFormulas.map((f) => (
              <div key={f.category} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{f.category}</span>
                  <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {f.factor}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 font-medium">
                  Basis: {f.basis}
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  {f.note}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Equivalencies */}
        <div className="bg-emerald-950 text-white rounded-2xl p-5 text-xs space-y-2">
          <div className="font-bold text-emerald-300 uppercase tracking-wider text-[11px]">
            Equivalency Models
          </div>
          <ul className="space-y-1.5 text-slate-300 text-[11px]">
            <li>• <strong>Tree Sequestration:</strong> 1 mature tree absorbs ~22 kg CO₂ per year (Arbor Day Foundation).</li>
            <li>• <strong>Clean Energy:</strong> Average household electricity consumption benchmarked at 30 kWh/day.</li>
            <li>• <strong>Landfill Volume:</strong> Compacted unsegregated municipal solid waste density averaged at 475 kg/m³.</li>
          </ul>
        </div>

        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
          >
            I Understand &amp; Agree
          </button>
        </div>
      </div>
    </div>
  );
};
