import React, { useState } from 'react';
import {
  Recycle,
  Lock,
  Mail,
  User as UserIcon,
  Shield,
  Truck,
  Sparkles,
  Award,
  Clock,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
  UserCheck,
  AlertCircle,
  Leaf,
  ScanLine,
} from 'lucide-react';
import { User } from '../types';
import { api } from '../services/api';

interface LoginPageProps {
  currentUser: User;
  onLoginSuccess: (user: User) => void;
  onNavigateTab: (tab: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  currentUser,
  onLoginSuccess,
  onNavigateTab,
}) => {
  const [activeMode, setActiveMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('eco2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<'citizen' | 'collector' | 'admin'>('citizen');
  const [phone, setPhone] = useState('');
  const [zone, setZone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Demo accounts for fast 1-click evaluation
  const demoAccounts: {
    user: User;
    description: string;
    icon: React.ElementType;
    tagColor: string;
  }[] = [
    {
      user: {
        id: 'u-1',
        name: 'Sarah Chen',
        email: 'citizen@smartwaste.ai',
        role: 'citizen',
        points: 420,
        zone: 'District 4 - Green Valley',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      },
      description: 'Active citizen with 3 saved AI scans, 1 scheduled e-waste pickup, and 420 Eco-Points.',
      icon: UserIcon,
      tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      user: {
        id: 'u-2',
        name: 'Marcus Ramirez',
        email: 'collector@smartwaste.ai',
        role: 'collector',
        points: 1250,
        zone: 'Metro Sector A & B',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      },
      description: 'Fleet driver managing electric collection trucks and smart bin route pickups.',
      icon: Truck,
      tagColor: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    {
      user: {
        id: 'u-3',
        name: 'Elena Rostova',
        email: 'admin@smartwaste.ai',
        role: 'admin',
        points: 3800,
        zone: 'City Central Command',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      },
      description: 'Municipal coordinator overseeing IoT bin thresholds, fleet TSP optimizer & city stats.',
      icon: Shield,
      tagColor: 'bg-purple-100 text-purple-800 border-purple-200',
    },
  ];

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await api.login(email, password, role);
      setSuccessNotice(`Welcome back, ${res.user.name}! Your history is loaded.`);
      setTimeout(() => {
        onLoginSuccess(res.user);
        onNavigateTab('history');
      }, 700);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials or use 1-click demo login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!name.trim() || !email.trim()) {
      setError('Please provide both your name and email address.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.register({
        name: name.trim(),
        email: email.trim(),
        role,
        phone: phone.trim() || '+1 (555) 345-6789',
        zone: zone.trim() || 'Sector 3 - North District',
      });
      setSuccessNotice(`Account registered! You earned 100 welcome Eco-Points.`);
      setTimeout(() => {
        onLoginSuccess(res.user);
        onNavigateTab('history');
      }, 700);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Try logging in or use demo accounts.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (account: User) => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await api.login(account.email);
      setSuccessNotice(`Logged in as ${res.user.name} (${res.user.role}).`);
      setTimeout(() => {
        onLoginSuccess(res.user);
        onNavigateTab('history');
      }, 500);
    } catch (err: any) {
      // Fallback
      onLoginSuccess(account);
      onNavigateTab('history');
    } finally {
      setIsLoading(false);
    }
  };

  const isLoggedInUser = currentUser && currentUser.email && currentUser.email !== 'guest@smartwaste.ai';

  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-300">
      {/* Top Banner & Value Proposition */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white p-8 sm:p-10 shadow-xl border border-emerald-800/40">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SmartWaste AI Citizen & Professional Portal</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Sign In to Save Your Recycling History
          </h1>

          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed mb-6">
            Log in to automatically preserve every AI waste scan, track scheduled collection
            pickups, earn Eco-Points for green vouchers, and maintain your personal waste diversion
            records across devices.
          </p>

          {/* Value highlights grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Save AI Scans</h4>
                <p className="text-[11px] text-emerald-200/80 leading-snug">
                  Keep photos, categories, confidence & disposal guidelines forever.
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Pickup Receipts</h4>
                <p className="text-[11px] text-emerald-200/80 leading-snug">
                  Real-time status updates on curbside collections and weights.
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Eco-Points & Rewards</h4>
                <p className="text-[11px] text-emerald-200/80 leading-snug">
                  Earn points per scan to redeem for public transit & store credits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* If already logged in, show current session banner with fast actions */}
      {isLoggedInUser && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              {currentUser.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">{currentUser.name}</h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 capitalize border border-emerald-200">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Logged in as <strong>{currentUser.email}</strong> •{' '}
                <span className="text-emerald-700 font-bold">{currentUser.points || 0} Eco-Points</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => onNavigateTab('history')}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
            >
              <Clock className="w-4 h-4" />
              <span>Open My History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateTab('scanner')}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <ScanLine className="w-4 h-4 text-emerald-600" />
              <span>Scan Item</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Form + 1-Click Demo Profiles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Sign In / Register Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
          {/* Tabs: Sign In / Create Account */}
          <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveMode('signin');
                setError(null);
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeMode === 'signin'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In to Existing Account
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('register')}
              className="flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer text-slate-600 hover:text-emerald-800 hover:bg-emerald-50"
            >
              Create New Eco Account (Register) →
            </button>
          </div>

          {/* Status Notifications */}
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successNotice && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {activeMode === 'signin' ? (
            /* Sign In Form */
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. sarah.chen@smartwaste.ai"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Password
                  </label>
                  <span className="text-[11px] text-emerald-600 font-semibold cursor-pointer hover:underline">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Keep me logged in on this browser</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="animate-spin text-base">⏳</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Sign In & Load History</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Don't have an account yet?</span>
                <button
                  type="button"
                  onClick={() => onNavigateTab('register')}
                  className="font-bold text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Create Account (+150 Pts)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-[11px] text-center text-slate-500 pt-1">
                Tip: You can use any demo email on the right or type any standard email to log in seamlessly.
              </p>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. David Miller"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. david@greenmail.org"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Select User Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('citizen')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      role === 'citizen'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <UserIcon className="w-4 h-4 text-emerald-600" />
                    <span>Citizen</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('collector')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      role === 'collector'
                        ? 'border-blue-500 bg-blue-50 text-blue-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span>Collector</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      role === 'admin'
                        ? 'border-purple-500 bg-purple-50 text-purple-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-purple-600" />
                    <span>Administrator</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Neighborhood / District Zone
                  </label>
                  <input
                    type="text"
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    placeholder="e.g. Westside Eco District"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-[11px] text-emerald-800 flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  New accounts receive an instant <strong>100 Eco-Points welcome reward</strong> and access to the community recycling leaderboard.
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="animate-spin text-base">⏳</span>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Create Account & Start Saving Scans</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right Column: 1-Click Fast Demo Logins */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">⚡</span>
              <h3 className="font-heading font-bold text-sm text-slate-900">
                1-Click Instant Demo Logins
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Select any pre-configured persona to test history preservation, collections, or administrator capabilities:
            </p>

            <div className="space-y-3">
              {demoAccounts.map((item) => {
                const Icon = item.icon;
                const isSelected = currentUser.email === item.user.email;
                return (
                  <div
                    key={item.user.id}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50/80'
                    }`}
                    onClick={() => handleQuickLogin(item.user)}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-emerald-700 shadow-xs">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-xs text-slate-900">{item.user.name}</h4>
                            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${item.tagColor}`}>
                              {item.user.role}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-mono">{item.user.email}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow-xs transition-colors shrink-0"
                      >
                        {isSelected ? 'Active' : 'Log In'}
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-snug">
                      {item.description}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                      <span>🌱 {item.user.points} Eco-Points</span>
                      <span className="font-medium text-emerald-700">{item.user.zone}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Privacy & Data Assurance */}
          <div className="bg-slate-100/80 rounded-2xl p-4 border border-slate-200/60 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px] uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Data Privacy & Security</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Your waste classification history is tied solely to your verified profile. Images are processed with privacy-first filters and never shared with commercial advertisers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
