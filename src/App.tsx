import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { DashboardView } from './components/DashboardView';
import { WasteScanner } from './components/WasteScanner';
import { CollectionManagement } from './components/CollectionManagement';
import { AnalyticsView } from './components/AnalyticsView';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { UserManagementView } from './components/UserManagementView';
import { EcoBotChat } from './components/EcoBotChat';
import { EcoRewardsView } from './components/EcoRewardsView';
import { AdminDashboard } from './components/AdminDashboard';
import { NotificationPanel } from './components/NotificationPanel';
import { EnvironmentalImpactModal } from './components/EnvironmentalImpactModal';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { HistoryView } from './components/HistoryView';
import { Footer } from './components/Footer';
import { api } from './services/api';
import {
  CollectionRequest,
  DashboardStats,
  SmartBin,
  User,
  WasteCategory,
  CollectionVehicle,
  OptimizedRoute,
  AppNotification,
} from './types';
import { Bot } from 'lucide-react';

const DEFAULT_USER: User = {
  id: 'u-1',
  name: 'Sarah Chen',
  email: 'citizen@smartwaste.ai',
  role: 'citizen',
  phone: '+1 (555) 234-5678',
  zone: 'District 4 - Green Valley',
  points: 420,
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bins, setBins] = useState<SmartBin[]>([]);
  const [collections, setCollections] = useState<CollectionRequest[]>([]);
  const [vehicles, setVehicles] = useState<CollectionVehicle[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeRoute, setActiveRoute] = useState<OptimizedRoute | null>(null);
  const [hasAiKey, setHasAiKey] = useState<boolean>(false);
  const [isEcoBotOpen, setIsEcoBotOpen] = useState<boolean>(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState<boolean>(false);
  const [isImpactModalOpen, setIsImpactModalOpen] = useState<boolean>(false);

  // Pre-fill state when booking collection directly from the AI scanner
  const [scannerPreFill, setScannerPreFill] = useState<{
    category?: WasteCategory;
    notes?: string;
  }>({});

  // Active User session (persisted in localStorage)
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem('smartwaste_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignored
    }
    return DEFAULT_USER;
  });

  const handleUpdateUser = (newUser: User) => {
    setCurrentUser(newUser);
    try {
      localStorage.setItem('smartwaste_user', JSON.stringify(newUser));
    } catch {
      // Ignored
    }
  };

  const handleLogout = () => {
    const guestUser: User = {
      id: 'u-guest',
      name: 'Guest Citizen',
      email: 'guest@smartwaste.ai',
      role: 'citizen',
      points: 0,
    };
    handleUpdateUser(guestUser);
    setActiveTab('login');
  };

  // Initial Data Loading
  useEffect(() => {
    loadData();
    loadNotifications();
  }, []);

  const loadData = async () => {
    try {
      const [statusRes, statsRes, binsRes, collectionsRes, vehRes] = await Promise.all([
        api.getStatus().catch(() => ({ hasAiKey: false })),
        api.getDashboardStats().catch(() => null),
        api.getBins().catch(() => ({ bins: [] })),
        api.getCollections().catch(() => ({ requests: [] })),
        api.getVehicles().catch(() => ({ vehicles: [] })),
      ]);

      setHasAiKey(Boolean(statusRes?.hasAiKey));
      if (statsRes) setStats(statsRes);
      if (binsRes?.bins) setBins(binsRes.bins);
      if (collectionsRes?.requests) setCollections(collectionsRes.requests);
      if (vehRes?.vehicles) setVehicles(vehRes.vehicles);
    } catch (err) {
      console.error('Initial data load error:', err);
    }
  };

  const loadNotifications = async () => {
    try {
      const res = await api.getNotifications();
      if (res?.notifications) setNotifications(res.notifications);
    } catch {
      // Ignored
    }
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Called when citizen clicks "Request Pickup for this Waste" in the scanner
  const handleScheduleFromScanner = (category: WasteCategory, notes: string) => {
    setScannerPreFill({ category, notes });
    setActiveTab('collection');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Create Collection Request
  const handleCreateRequest = async (data: Partial<CollectionRequest>) => {
    const res = await api.createCollection(data);
    setCollections((prev) => [res.request, ...prev]);
    loadNotifications();

    // Reward points for scheduling pickup
    setCurrentUser((prev) => ({ ...prev, points: (prev.points || 0) + 50 }));

    if (stats) {
      setStats({
        ...stats,
        pendingCollections: stats.pendingCollections + 1,
        collectionStatusCounts: {
          ...stats.collectionStatusCounts,
          Pending: stats.collectionStatusCounts.Pending + 1,
        },
      });
    }
  };

  // Update Collection Status (Collector or Admin)
  const handleUpdateRequestStatus = async (
    id: string,
    status: string,
    collectorName?: string,
    notes?: string
  ) => {
    const res = await api.updateCollection(id, { status, collectorName, notes });
    setCollections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...res.request } : c))
    );
    loadNotifications();
  };

  // Empty IoT Smart Bin
  const handleEmptyBin = async (binId: string) => {
    await api.emptyBin(binId);
    setBins((prev) =>
      prev.map((b) =>
        b.id === binId
          ? {
              ...b,
              fillLevel: 0,
              status: 'Empty',
              lastEmptied: new Date().toISOString().replace('T', ' ').slice(0, 16),
            }
          : b
      )
    );
    loadNotifications();
  };

  // Notification handlers
  const handleMarkNotificationRead = async (id: string) => {
    await api.markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMarkAllNotificationsRead = async () => {
    await api.markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAllNotifications = async () => {
    await api.clearNotifications();
    setNotifications([]);
  };

  // Switch to Administrator
  const handleSwitchToAdmin = () => {
    handleUpdateUser({
      id: 'u-3',
      name: 'Elena Rostova',
      email: 'admin@smartwaste.ai',
      role: 'admin',
      phone: '+1 (555) 901-2345',
      zone: 'City Central Command',
      points: 3800,
    });
    setActiveTab('admin');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 text-slate-800">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        currentUser={currentUser}
        onSwitchUser={handleUpdateUser}
        onOpenEcoBot={() => setIsEcoBotOpen(true)}
        hasAiKey={hasAiKey}
        unreadNotificationsCount={unreadCount}
        onOpenNotifications={() => setIsNotificationPanelOpen(true)}
        onOpenImpactModal={() => setIsImpactModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'home' && (
          <HomeHero onNavigate={handleNavigate} stats={stats} />
        )}

        {activeTab === 'login' && (
          <LoginPage
            currentUser={currentUser}
            onLoginSuccess={handleUpdateUser}
            onNavigateTab={handleNavigate}
          />
        )}

        {activeTab === 'register' && (
          <RegisterPage
            onRegisterSuccess={(newUser) => {
              handleUpdateUser(newUser);
              loadNotifications();
            }}
            onNavigateTab={handleNavigate}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            currentUser={currentUser}
            onNavigateTab={handleNavigate}
            onScheduleCollection={handleScheduleFromScanner}
            onOpenEcoBot={(initialQuery) => {
              setIsEcoBotOpen(true);
            }}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            stats={stats}
            bins={bins}
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onRefresh={() => {
              loadData();
              loadNotifications();
            }}
            onEmptyBin={handleEmptyBin}
          />
        )}

        {activeTab === 'scanner' && (
          <WasteScanner
            hasAiKey={hasAiKey}
            currentUser={currentUser}
            onScheduleCollection={handleScheduleFromScanner}
            onNavigateToHistory={() => handleNavigate('history')}
            onNavigateToLogin={() => handleNavigate('login')}
          />
        )}

        {activeTab === 'collection' && (
          <CollectionManagement
            collections={collections}
            bins={bins}
            vehicles={vehicles}
            activeRoute={activeRoute}
            currentUser={currentUser}
            onCreateRequest={handleCreateRequest}
            onUpdateRequestStatus={handleUpdateRequestStatus}
            prefilledCategory={scannerPreFill.category}
            prefilledNotes={scannerPreFill.notes}
            onNavigateToOptimizer={() => setActiveTab('admin')}
          />
        )}

        {activeTab === 'rewards' && (
          <EcoRewardsView
            currentUser={currentUser}
            onPointsUpdated={(pts) => {
              handleUpdateUser({ ...currentUser, points: pts });
              loadNotifications();
            }}
            onNavigateTab={handleNavigate}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            currentUser={currentUser}
            bins={bins}
            collections={collections}
            onRefreshBins={loadData}
            onRefreshCollections={loadData}
            onRouteOptimized={(route) => {
              setActiveRoute(route);
              loadNotifications();
            }}
            onSwitchToAdmin={handleSwitchToAdmin}
            onNavigateTab={handleNavigate}
          />
        )}

        {activeTab === 'analytics' && <AnalyticsView stats={stats} />}

        {activeTab === 'about' && <AboutView />}

        {activeTab === 'contact' && <ContactView />}

        {activeTab === 'users' && (
          <UserManagementView
            currentUser={currentUser}
            onLoginUser={handleUpdateUser}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Persistent Floating EcoBot AI Widget Launcher */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsEcoBotOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-xl shadow-emerald-700/30 hover:scale-105 transition-all cursor-pointer group"
        >
          <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
          </div>
          <span className="hidden sm:inline">Ask EcoBot AI</span>
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
        </button>
      </div>

      {/* EcoBot Modal Drawer */}
      {isEcoBotOpen && (
        <EcoBotChat
          isOpenAsModal={true}
          onClose={() => setIsEcoBotOpen(false)}
          hasAiKey={hasAiKey}
        />
      )}

      {/* Notifications Drawer */}
      <NotificationPanel
        notifications={notifications}
        isOpen={isNotificationPanelOpen}
        onClose={() => setIsNotificationPanelOpen(false)}
        onMarkRead={handleMarkNotificationRead}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onClearAll={handleClearAllNotifications}
        onNavigateTab={handleNavigate}
      />

      {/* Environmental Methodology & Assumptions Modal */}
      <EnvironmentalImpactModal
        isOpen={isImpactModalOpen}
        onClose={() => setIsImpactModalOpen(false)}
      />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} onOpenEcoBot={() => setIsEcoBotOpen(true)} />
    </div>
  );
}
