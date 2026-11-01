import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  Trophy,
  Gift,
  CheckCircle2,
  Clock,
  ArrowRight,
  Info,
  Zap,
  TrendingUp,
  ShieldCheck,
  Tag,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Badge, LeaderboardEntry, RewardItem, User } from '../types';
import { api } from '../services/api';

interface EcoRewardsViewProps {
  currentUser: User;
  onPointsUpdated: (newPoints: number) => void;
  onNavigateTab: (tab: string) => void;
}

export const EcoRewardsView: React.FC<EcoRewardsViewProps> = ({
  currentUser,
  onPointsUpdated,
  onNavigateTab,
}) => {
  const [rewards, setRewards] = useState<RewardItem[]>([
    {
      id: 'REW-1',
      title: 'Free Municipal Transit Day Pass',
      pointsCost: 200,
      category: 'Public Mobility',
      description: 'Unlimited subway and eco-bus rides for 1 full day across all city zones.',
      icon: '🚌',
      partner: 'SF Municipal Transportation Agency',
    },
    {
      id: 'REW-2',
      title: 'Organic Urban Compost Bag (20 kg)',
      pointsCost: 350,
      category: 'Gardening & Soil',
      description: 'High-nutrient cured compost produced directly from diverted organic municipal waste.',
      icon: '🌱',
      partner: 'Community Garden Trust',
    },
    {
      id: 'REW-3',
      title: '$15 Zero-Waste Grocery Voucher',
      pointsCost: 500,
      category: 'Sustainable Living',
      description: 'Valid for bulk grains, oils, and package-free fresh produce at local partner co-ops.',
      icon: '🥦',
      partner: 'Green Earth Co-op Network',
    },
    {
      id: 'REW-4',
      title: 'Residential Solar Consultation & $50 Credit',
      pointsCost: 750,
      category: 'Clean Energy',
      description: 'Free rooftop solar feasibility audit plus clean power credit on municipal utility bill.',
      icon: '⚡',
      partner: 'CleanPower City Alliance',
    },
  ]);

  const [leaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, name: 'Elena Rostova', points: 3800, itemsRecycled: 240, badge: 'Eco Titan', zone: 'Downtown Central' },
    { rank: 2, name: 'Marcus Ramirez', points: 1250, itemsRecycled: 98, badge: 'Fleet Hero', zone: 'Metro Sector A' },
    { rank: 3, name: 'David Kim', points: 680, itemsRecycled: 52, badge: 'Plastic Crusher', zone: 'Mission District' },
    { rank: 4, name: 'Sarah Chen (You)', points: currentUser.points || 420, itemsRecycled: 34, badge: 'Zero Waste Star', zone: 'District 4' },
    { rank: 5, name: 'Priya Sharma', points: 390, itemsRecycled: 31, badge: 'Compost Master', zone: 'Sunset Corridor' },
    { rank: 6, name: 'Carlos Mendez', points: 310, itemsRecycled: 25, badge: 'Green Scout', zone: 'Bayview' },
  ]);

  const [badges] = useState<Badge[]>([
    {
      id: 'b-1',
      title: 'Zero-Waste Novice',
      description: 'Scanned your first discarded packaging item with AI Vision.',
      icon: '🌱',
      unlocked: true,
      category: 'Milestone',
      progress: 1,
      maxProgress: 1,
    },
    {
      id: 'b-2',
      title: 'Plastic Pioneer',
      description: 'Classified and rinsed 10 PET or HDPE plastic containers.',
      icon: '🥤',
      unlocked: true,
      category: 'Plastic',
      progress: 10,
      maxProgress: 10,
    },
    {
      id: 'b-3',
      title: 'Compost Champion',
      description: 'Diverted 25 kg of kitchen food scraps to the Green Bin.',
      icon: '🍌',
      unlocked: (currentUser.points || 0) >= 300,
      category: 'Compost',
      progress: Math.min(25, Math.round(((currentUser.points || 0) / 400) * 25)),
      maxProgress: 25,
    },
    {
      id: 'b-4',
      title: 'E-Waste Guardian',
      description: 'Safely booked an on-demand pickup for toxic battery or phone disposal.',
      icon: '📱',
      unlocked: true,
      category: 'Electronics',
      progress: 3,
      maxProgress: 3,
    },
    {
      id: 'b-5',
      title: 'Cardboard Conqueror',
      description: 'Cleaned and flattened 20 shipping boxes before binning.',
      icon: '📦',
      unlocked: (currentUser.points || 0) >= 600,
      category: 'Paper',
      progress: Math.min(20, Math.round(((currentUser.points || 0) / 700) * 20)),
      maxProgress: 20,
    },
    {
      id: 'b-6',
      title: 'Community Green Hero',
      description: 'Earned 1,000+ Eco-Points and ranked in the top 10% citywide.',
      icon: '🏆',
      unlocked: (currentUser.points || 0) >= 1000,
      category: 'Honorary',
      progress: Math.min(1000, currentUser.points || 0),
      maxProgress: 1000,
    },
  ]);

  const [activeVoucher, setActiveVoucher] = useState<{ code: string; title: string } | null>(null);
  const [redeemError, setRedeemError] = useState<string | null>(null);
  const [isRedeeming, setIsRedeeming] = useState<string | null>(null);

  const handleRedeem = async (reward: RewardItem) => {
    setRedeemError(null);
    setIsRedeeming(reward.id);
    try {
      const res = await api.redeemReward(reward.id, currentUser.email);
      onPointsUpdated(res.newBalance);
      setActiveVoucher({ code: res.voucherCode, title: reward.title });

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#f59e0b', '#0284c7'],
      });
    } catch (err: any) {
      setRedeemError(err.message || 'Failed to redeem reward');
    } finally {
      setIsRedeeming(null);
    }
  };

  const userPoints = currentUser.points || 0;
  const currentTier =
    userPoints >= 1000
      ? 'Level 4: Green Guardian 🌳'
      : userPoints >= 500
      ? 'Level 3: Eco Specialist 🌿'
      : userPoints >= 200
      ? 'Level 2: Active Recycler 🌱'
      : 'Level 1: Eco Seedling 🍃';

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Top Header Card */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SmartWaste Citizen Rewards Program</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
              Eco-Points &amp; Recycling Rewards
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Every item you scan with AI Vision, properly rinse, and divert from landfills earns verified Eco-Points redeemable for public transit passes, organic compost, and local green discounts.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-lg bg-white/10 text-emerald-200 border border-white/10">
                📸 Scan Item: +15 pts
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/10 text-teal-200 border border-white/10">
                📦 Request Pickup: +50 pts
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/10 text-amber-200 border border-white/10">
                ✨ Zero Contamination: +25 pts
              </span>
            </div>
          </div>

          {/* User Wallet Card */}
          <div className="md:col-span-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center space-y-3 shadow-xl">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Your Current Balance
            </div>
            <div className="font-heading text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              {userPoints.toLocaleString()} <span className="text-lg font-bold text-emerald-300">pts</span>
            </div>
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-semibold">
              {currentTier}
            </div>

            <p className="text-[11px] text-slate-300 pt-1">
              Account: <strong className="text-white">{currentUser.name}</strong> ({currentUser.email})
            </p>

            <button
              onClick={() => onNavigateTab('scanner')}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-md"
            >
              Scan Items to Earn Points
            </button>
          </div>
        </div>
      </div>

      {/* Demonstration Notice */}
      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
        <Info className="w-4 h-4 text-amber-700 shrink-0" />
        <span>
          <strong>Demonstration Points System:</strong> Points and vouchers are simulated for student project demonstration and municipal evaluation. Verified points reflect simulated activity unless connected to city smart weigh scales.
        </span>
      </div>

      {/* Voucher Generated Modal Banner */}
      {activeVoucher && (
        <div className="p-5 rounded-3xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 shadow-md space-y-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-heading text-base font-bold text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Reward Claimed: {activeVoucher.title}</span>
            </div>
            <p className="text-xs text-emerald-800">
              Present this municipal voucher code at any participating station or partner store:
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-white rounded-xl border border-emerald-300 font-mono text-base font-extrabold text-emerald-800 tracking-wider shadow-xs">
              {activeVoucher.code}
            </div>
            <button
              onClick={() => setActiveVoucher(null)}
              className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer font-semibold"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {redeemError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
          {redeemError}
        </div>
      )}

      {/* Rewards Catalog */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-heading text-xl font-bold text-slate-900 flex items-center gap-2">
              <Gift className="w-5 h-5 text-emerald-600" />
              <span>Redeemable Rewards Catalog</span>
            </h2>
            <p className="text-xs text-slate-500">
              Exchange your verified recycling points for municipal vouchers and sustainable goods
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Available: {rewards.length} Rewards
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {rewards.map((rew) => {
            const canAfford = userPoints >= rew.pointsCost;
            return (
              <div
                key={rew.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all bg-slate-50/50 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-3xl p-2 rounded-xl bg-white shadow-2xs">
                      {rew.icon}
                    </span>
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {rew.pointsCost} pts
                    </span>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {rew.category}
                  </span>
                  <h3 className="font-heading text-sm font-bold text-slate-900 mt-0.5 line-clamp-1">
                    {rew.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-3">
                    {rew.description}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">
                    Partner: {rew.partner}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-200/80">
                  <button
                    onClick={() => handleRedeem(rew)}
                    disabled={!canAfford || isRedeeming === rew.id}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      canAfford
                        ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <span>
                      {isRedeeming === rew.id
                        ? 'Redeeming...'
                        : canAfford
                        ? 'Redeem Reward'
                        : `Need ${rew.pointsCost - userPoints} more pts`}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievement Badges Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="font-heading text-xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <span>Recycling Achievement Badges</span>
          </h2>
          <p className="text-xs text-slate-500">
            Unlock badges by practicing accurate waste segregation and booking pickups
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                b.unlocked
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : 'border-slate-200 bg-slate-50 opacity-60'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-2xs ${
                  b.unlocked ? 'bg-white border border-emerald-300' : 'bg-slate-200'
                }`}
              >
                {b.icon}
              </div>

              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900">{b.title}</h4>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      b.unlocked
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {b.unlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {b.description}
                </p>

                {/* Progress bar */}
                <div className="mt-2.5">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>Progress</span>
                    <span>
                      {b.progress} / {b.maxProgress}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        b.unlocked ? 'bg-emerald-600' : 'bg-slate-400'
                      }`}
                      style={{ width: `${(b.progress / b.maxProgress) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Recycling Leaderboard */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-heading text-xl font-bold text-slate-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Citywide Recycling Leaderboard</span>
            </h2>
            <p className="text-xs text-slate-500">
              Top neighborhood environmental champions ranked by verified diversion volume
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Updated Weekly
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Rank</th>
                <th className="py-3 px-3">Citizen</th>
                <th className="py-3 px-3">Municipal Zone</th>
                <th className="py-3 px-3">Items Diverted</th>
                <th className="py-3 px-3">Achievement Tier</th>
                <th className="py-3 px-3 text-right">Eco-Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {leaderboard.map((entry) => {
                const isCurrentUser = entry.name.includes('Sarah Chen');
                return (
                  <tr
                    key={entry.rank}
                    className={`transition-colors ${
                      isCurrentUser ? 'bg-emerald-50/70 font-semibold text-emerald-950' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-3 font-heading font-bold text-sm">
                      {entry.rank === 1 ? '🥇 #1' : entry.rank === 2 ? '🥈 #2' : entry.rank === 3 ? '🥉 #3' : `#${entry.rank}`}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <span>{entry.name}</span>
                        {isCurrentUser && (
                          <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded">
                            YOU
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{entry.zone}</td>
                    <td className="py-3 px-3 font-mono font-medium">{entry.itemsRecycled} items</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                        {entry.badge}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-heading font-extrabold text-sm text-emerald-700">
                      {entry.points.toLocaleString()} pts
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
