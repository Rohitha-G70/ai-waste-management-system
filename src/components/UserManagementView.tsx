import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Shield,
  Truck,
  User as UserIcon,
  LogIn,
  UserPlus,
  LogOut,
  Award,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { User } from '../types';
import { api } from '../services/api';

interface UserManagementViewProps {
  currentUser: User;
  onLoginUser: (user: User) => void;
  onLogout: () => void;
  onNavigate: (tab: string) => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  currentUser,
  onLoginUser,
  onLogout,
  onNavigate,
}) => {
  const [authMode, setAuthMode] = useState<'profile' | 'login' | 'register'>('profile');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('password123');
  const [nameInput, setNameInput] = useState('');
  const [roleInput, setRoleInput] = useState<'citizen' | 'collector' | 'admin'>('citizen');
  const [phoneInput, setPhoneInput] = useState('');
  const [zoneInput, setZoneInput] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await api.getUsers();
      setAllUsers(res.users);
    } catch {
      // Fallback
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.login(emailInput);
      onLoginUser(res.user);
      setSuccessMsg(`Welcome back, ${res.user.name}!`);
      setTimeout(() => setSuccessMsg(null), 2500);
      setAuthMode('profile');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.register({
        name: nameInput,
        email: emailInput,
        role: roleInput,
        phone: phoneInput,
        zone: zoneInput,
      });
      onLoginUser(res.user);
      setSuccessMsg(`Account created for ${res.user.name} (${res.user.role})!`);
      setTimeout(() => setSuccessMsg(null), 2500);
      setAuthMode('profile');
      loadUsers();
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  const quickLoginAs = async (email: string) => {
    setError(null);
    try {
      const res = await api.login(email);
      onLoginUser(res.user);
      setSuccessMsg(`Switched to ${res.user.name} (${res.user.role})!`);
      setTimeout(() => setSuccessMsg(null), 2000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
              Identity &amp; Role-Based Governance
            </h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase">
              Role: {currentUser.role}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access-controlled capabilities tailored for Citizens, Municipal Collectors, and City Administrators.
          </p>
        </div>

        {/* Quick Role Switch Buttons for College Evaluation */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => quickLoginAs('citizen@smartwaste.ai')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              currentUser.role === 'citizen'
                ? 'bg-emerald-700 text-white border-emerald-700'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            👤 Demo Citizen
          </button>
          <button
            onClick={() => quickLoginAs('collector@smartwaste.ai')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              currentUser.role === 'collector'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            🚛 Demo Collector
          </button>
          <button
            onClick={() => quickLoginAs('admin@smartwaste.ai')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              currentUser.role === 'admin'
                ? 'bg-purple-700 text-white border-purple-700'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            🛡️ Demo Admin
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Profile Card & Role Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* User Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-6">
          <div className="text-center pb-6 border-b border-slate-100">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white text-3xl font-bold flex items-center justify-center mx-auto shadow-md mb-3">
              {currentUser.name[0]}
            </div>
            <h2 className="font-heading text-xl font-bold text-slate-900">
              {currentUser.name}
            </h2>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold mt-1 capitalize">
              <Shield className="w-3.5 h-3.5" />
              <span>{currentUser.role} Role</span>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email Address:</span>
              </span>
              <span className="font-semibold text-slate-800">{currentUser.email}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Phone:</span>
              </span>
              <span className="font-semibold text-slate-800">{currentUser.phone || 'N/A'}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Operational Zone:</span>
              </span>
              <span className="font-semibold text-slate-800">{currentUser.zone || 'Metropolitan Area'}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-emerald-800 flex items-center gap-1.5 font-bold">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Green Eco-Points:</span>
              </span>
              <span className="font-heading font-extrabold text-emerald-800 text-base">
                {currentUser.points || 0} pts
              </span>
            </div>
          </div>

          {/* Action Links */}
          <div className="space-y-2 pt-2">
            {currentUser.role === 'citizen' && (
              <button
                onClick={() => onNavigate('scanner')}
                className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span>Scan New Waste Item</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {currentUser.role === 'collector' && (
              <button
                onClick={() => onNavigate('collection')}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span>View Assigned Pickup Queue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {currentUser.role === 'admin' && (
              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span>Admin Master Telemetry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => setAuthMode(authMode === 'login' ? 'profile' : 'login')}
              className="w-full py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
            >
              {authMode === 'login' ? 'View Profile' : 'Switch or Sign In to Another Account'}
            </button>
          </div>
        </div>

        {/* Right Column: Role Permissions Matrix & Auth Forms */}
        <div className="lg:col-span-7 space-y-6">
          {authMode === 'login' ? (
            /* Login Form */
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg font-bold text-slate-900">
                    Sign In to SmartWaste AI
                  </h3>
                  <p className="text-xs text-slate-500">Access role-authorized portal</p>
                </div>
                <button
                  onClick={() => setAuthMode('register')}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  Create New Account
                </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="e.g. citizen@smartwaste.ai"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-emerald-500"
                    required
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setAuthMode('profile')}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold cursor-pointer shadow-xs"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            </div>
          ) : authMode === 'register' ? (
            /* Registration Form */
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg font-bold text-slate-900">
                    Create New Account
                  </h3>
                  <p className="text-xs text-slate-500">Join the smart municipal recycling network</p>
                </div>
                <button
                  onClick={() => setAuthMode('login')}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  Already have an account?
                </button>
              </div>

              <form onSubmit={handleRegister} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="e.g. Dr. Alex Morgan"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-emerald-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="alex@domain.com"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Role</label>
                    <select
                      value={roleInput}
                      onChange={(e) => setRoleInput(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:outline-emerald-500"
                    >
                      <option value="citizen">Citizen</option>
                      <option value="collector">Waste Collector</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Municipal Zone</label>
                    <input
                      type="text"
                      value={zoneInput}
                      onChange={(e) => setZoneInput(e.target.value)}
                      placeholder="e.g. Sector 7 North"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setAuthMode('profile')}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold cursor-pointer shadow-xs"
                  >
                    Register Account
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Role Capabilities Matrix */
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-heading text-base font-bold text-slate-900">
                  Role-Based Access Control Matrix
                </h3>
                <p className="text-[11px] text-slate-500">
                  Platform authorization specifications implemented for this project
                </p>
              </div>

              <div className="space-y-4">
                {/* Citizen */}
                <div className={`p-4 rounded-2xl border transition-all ${currentUser.role === 'citizen' ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-emerald-700" />
                      <h4 className="font-bold text-xs text-slate-800">1. Citizen Role</h4>
                    </div>
                    {currentUser.role === 'citizen' && (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                        ACTIVE ROLE
                      </span>
                    )}
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    <li>Scan waste via AI camera/upload to get instant classification.</li>
                    <li>View step-by-step cleaning and disposal instructions.</li>
                    <li>Schedule on-demand waste collection for bulky/e-waste.</li>
                    <li>Track collection request statuses and earn Eco-Points.</li>
                  </ul>
                </div>

                {/* Waste Collector */}
                <div className={`p-4 rounded-2xl border transition-all ${currentUser.role === 'collector' ? 'border-blue-500 bg-blue-50/20' : 'border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <h4 className="font-bold text-xs text-slate-800">2. Waste Collector Role</h4>
                    </div>
                    {currentUser.role === 'collector' && (
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
                        ACTIVE ROLE
                      </span>
                    )}
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    <li>View assigned collection requests and dynamic route stops.</li>
                    <li>Update collection status (Assigned → In Progress → Completed).</li>
                    <li>Inspect real-time IoT smart bin fill levels and trigger empty actions.</li>
                    <li>Access interactive map with turn-by-turn coordinate pins.</li>
                  </ul>
                </div>

                {/* Administrator */}
                <div className={`p-4 rounded-2xl border transition-all ${currentUser.role === 'admin' ? 'border-purple-500 bg-purple-50/20' : 'border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-purple-700" />
                      <h4 className="font-bold text-xs text-slate-800">3. Administrator Role</h4>
                    </div>
                    {currentUser.role === 'admin' && (
                      <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md">
                        ACTIVE ROLE
                      </span>
                    )}
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    <li>View citywide aggregated waste metrics and real-time trends.</li>
                    <li>Manage all citizen collection requests and re-assign fleet trucks.</li>
                    <li>Monitor IoT bin overflow alerts and hardware sensor health.</li>
                    <li>Export ESG compliance data and downloadable CSV reports.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* User Directory Table (Visible to Admin or for evaluation) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-3">
            <h4 className="font-heading text-sm font-bold text-slate-900">
              Registered Users &amp; Role Assignments
            </h4>
            <div className="divide-y divide-slate-100 text-xs">
              {allUsers.map((u) => (
                <div key={u.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800">{u.name}</span>
                    <span className="text-slate-400 text-[11px] ml-2">({u.email})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {u.role}
                    </span>
                    <button
                      onClick={() => quickLoginAs(u.email)}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                      Login As
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
