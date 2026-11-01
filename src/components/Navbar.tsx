import React, { useState } from 'react';
import {
  Recycle,
  LayoutDashboard,
  ScanLine,
  Truck,
  BarChart3,
  Info,
  Mail,
  Bot,
  UserCheck,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Bell,
  Award,
  Shield,
  Leaf,
  History,
  LogIn,
  LogOut,
  UserPlus,
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User;
  onSwitchUser: (user: User) => void;
  onOpenEcoBot: () => void;
  hasAiKey: boolean;
  unreadNotificationsCount?: number;
  onOpenNotifications: () => void;
  onOpenImpactModal: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onSwitchUser,
  onOpenEcoBot,
  hasAiKey,
  unreadNotificationsCount = 0,
  onOpenNotifications,
  onOpenImpactModal,
  onLogout,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Recycle },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scanner', label: 'AI Scanner', icon: ScanLine },
    { id: 'history', label: 'My History', icon: History },
    { id: 'collection', label: 'Collection', icon: Truck },
    { id: 'rewards', label: 'Eco-Rewards', icon: Award },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'admin', label: 'Admin Portal', icon: Shield },
    { id: 'about', label: 'About', icon: Info },
  ];

  const demoAccounts: User[] = [
    {
      id: 'u-1',
      name: 'Sarah Chen',
      email: 'citizen@smartwaste.ai',
      role: 'citizen',
      points: 420,
      zone: 'District 4 - Green Valley',
    },
    {
      id: 'u-2',
      name: 'Marcus Ramirez',
      email: 'collector@smartwaste.ai',
      role: 'collector',
      points: 1250,
      zone: 'Metro Sector A & B',
    },
    {
      id: 'u-3',
      name: 'Elena Rostova',
      email: 'admin@smartwaste.ai',
      role: 'admin',
      points: 3800,
      zone: 'City Central Command',
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Recycle className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 bg-clip-text text-transparent">
                  SmartWaste AI
                </span>
                <span className="text-base">♻️</span>
              </div>
              <p className="text-[10px] tracking-wider uppercase font-semibold text-emerald-600/90 -mt-1 hidden sm:block">
                Intelligent Eco-System
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions & Role Switcher */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Notifications Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 transition-all cursor-pointer"
              title="View Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-extrabold text-[9px] flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* LCA Assumptions Info Button */}
            <button
              onClick={onOpenImpactModal}
              className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 transition-all cursor-pointer"
              title="Environmental Methodology & Assumptions"
            >
              <Leaf className="w-4 h-4 text-emerald-600" />
            </button>

            {/* EcoBot Trigger */}
            <button
              onClick={onOpenEcoBot}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold transition-all shadow-xs hover:shadow-sm"
              title="Chat with EcoBot AI recycling assistant"
            >
              <Bot className="w-4 h-4 text-teal-600" />
              <span>Ask EcoBot</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>

            {/* AI Status Badge */}
            <span
              className={`text-[11px] px-2.5 py-1 rounded-full font-medium flex items-center gap-1 border ${
                hasAiKey
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
              title={hasAiKey ? 'Gemini 3.8 Flash Active' : 'Running in Validated Demonstration Mode'}
            >
              <Sparkles className="w-3 h-3" />
              {hasAiKey ? 'Gemini AI Live' : 'Demo Mode'}
            </span>

            {/* User Profile / Role Picker */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-300 bg-white text-xs font-medium text-slate-700 shadow-xs hover:shadow-sm transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs uppercase">
                  {currentUser.name[0]}
                </div>
                <div className="text-left leading-tight hidden md:block">
                  <div className="font-bold text-slate-800 text-[11px] truncate max-w-[100px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] capitalize text-emerald-600 font-semibold">
                    {currentUser.role}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">Current Profile</p>
                    <p className="text-xs text-slate-500 truncate">
                      <span className="font-semibold text-emerald-600">{currentUser.email}</span>
                    </p>
                    <div className="mt-1 flex items-center justify-between text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                      <span>🌱 {currentUser.points || 0} Eco-Points</span>
                      <span className="text-[10px] text-amber-800 font-bold uppercase">{currentUser.role}</span>
                    </div>
                  </div>

                  {/* Primary Profile Actions */}
                  <div className="p-1 border-b border-slate-100">
                    <button
                      onClick={() => {
                        setActiveTab('history');
                        setIsRoleDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs text-emerald-800 bg-emerald-50/80 hover:bg-emerald-100 font-bold transition-colors cursor-pointer mb-1"
                    >
                      <History className="w-3.5 h-3.5 text-emerald-600" />
                      <span>View Saved Scans & Pickups</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('login');
                        setIsRoleDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-left text-xs text-slate-700 hover:bg-slate-50 font-medium transition-colors cursor-pointer"
                    >
                      <LogIn className="w-3.5 h-3.5 text-slate-400" />
                      <span>Login / Switch Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('register');
                        setIsRoleDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-left text-xs text-emerald-700 hover:bg-emerald-50/70 font-semibold transition-colors cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Create New Account (Register)</span>
                    </button>
                  </div>

                  <div className="p-1">
                    <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      1-Click Switch Demo Account:
                    </p>
                    {demoAccounts.map((account) => (
                      <button
                        key={account.id}
                        onClick={() => {
                          onSwitchUser(account);
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                          currentUser.role === account.role && currentUser.email === account.email
                            ? 'bg-emerald-50 text-emerald-800 font-semibold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="font-medium text-[11px]">{account.name}</div>
                          <div className="text-[10px] text-slate-400 capitalize">{account.role}</div>
                        </div>
                        {currentUser.role === account.role && currentUser.email === account.email && (
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                      </button>
                    ))}

                    {onLogout && (
                      <button
                        onClick={() => {
                          onLogout();
                          setIsRoleDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-left text-xs text-rose-600 hover:bg-rose-50 font-medium transition-colors cursor-pointer mt-1 border-t border-slate-100 pt-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-500" />
                        <span>Sign Out (Guest Mode)</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick CTA */}
            <button
              onClick={() => setActiveTab('scanner')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
            >
              <ScanLine className="w-3.5 h-3.5" />
              <span>Scan Waste</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-extrabold text-[9px] flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
            <button
              onClick={onOpenEcoBot}
              className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200"
            >
              <Bot className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                setActiveTab('login');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold"
            >
              <div className="flex items-center gap-2">
                <LogIn className="w-4 h-4 text-emerald-600" />
                <span>Log In / Switch Account</span>
              </div>
              <span className="text-[10px] text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200 font-mono">
                {currentUser.email}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('register');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold"
            >
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-teal-600" />
                <span>Create New Account (Register)</span>
              </div>
              <span className="text-[10px] text-teal-700 bg-white px-2 py-0.5 rounded border border-teal-200 font-semibold">
                +150 Pts
              </span>
            </button>

            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 pt-1">
              Quick Role Select
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {demoAccounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => {
                    onSwitchUser(account);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`p-2 rounded-xl text-xs text-center border font-medium ${
                    currentUser.role === account.role && currentUser.email === account.email
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="capitalize">{account.role}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
