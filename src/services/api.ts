import {
  ClassificationResult,
  ClassificationRecord,
  CollectionRequest,
  DashboardStats,
  SmartBin,
  User,
  CollectionVehicle,
  OptimizedRoute,
  AppNotification,
  RewardItem,
  LeaderboardEntry,
  WasteCategoryConfig,
  HistoryResponse,
} from '../types';

export const api = {
  async getStatus() {
    const res = await fetch('/api/status');
    return res.json();
  },

  async classifyWaste(payload: {
    imageBase64?: string;
    mimeType?: string;
    sampleItem?: string;
    userEmail?: string;
    userId?: string;
    imageUrl?: string;
  }) {
    const res = await fetch('/api/waste/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to classify waste item');
    }
    return res.json() as Promise<{
      success: boolean;
      isDemoMode: boolean;
      demoNotice?: string;
      result: ClassificationResult;
    }>;
  },

  async chatEcoBot(message: string, conversationHistory: { role: string; content: string }[]) {
    const res = await fetch('/api/chat/ecobot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, conversationHistory }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Chat service currently unavailable');
    }
    return res.json() as Promise<{
      reply: string;
      isDemoMode: boolean;
      demoNotice?: string;
    }>;
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch('/api/stats/dashboard');
    if (!res.ok) throw new Error('Failed to load dashboard metrics');
    return res.json();
  },

  async getCollections(status?: string, citizenEmail?: string) {
    const params = new URLSearchParams();
    if (status && status !== 'All') params.set('status', status);
    if (citizenEmail) params.set('citizenEmail', citizenEmail);

    const res = await fetch(`/api/collections?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to load collections');
    return res.json() as Promise<{ total: number; requests: CollectionRequest[] }>;
  },

  async createCollection(data: Partial<CollectionRequest>) {
    const res = await fetch('/api/collections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to submit collection request');
    }
    return res.json() as Promise<{ success: boolean; request: CollectionRequest }>;
  },

  async updateCollection(id: string, update: { status?: string; collectorName?: string; notes?: string }) {
    const res = await fetch(`/api/collections/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    });
    if (!res.ok) throw new Error('Failed to update collection');
    return res.json() as Promise<{ success: boolean; request: CollectionRequest }>;
  },

  async getBins() {
    const res = await fetch('/api/bins');
    if (!res.ok) throw new Error('Failed to load IoT bins');
    return res.json() as Promise<{ total: number; threshold: number; bins: SmartBin[] }>;
  },

  async emptyBin(id: string) {
    const res = await fetch(`/api/bins/${id}/empty`, { method: 'PATCH' });
    if (!res.ok) throw new Error('Failed to empty bin');
    return res.json();
  },

  async updateBinFill(id: string, fillLevel: number) {
    const res = await fetch(`/api/bins/${id}/fill`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fillLevel }),
    });
    if (!res.ok) throw new Error('Failed to update bin fill');
    return res.json() as Promise<{ success: boolean; bin: SmartBin; threshold: number }>;
  },

  async getBinThreshold() {
    const res = await fetch('/api/bins/threshold');
    return res.json() as Promise<{ threshold: number }>;
  },

  async setBinThreshold(threshold: number) {
    const res = await fetch('/api/bins/threshold', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threshold }),
    });
    if (!res.ok) throw new Error('Failed to set alert threshold');
    return res.json() as Promise<{ success: boolean; threshold: number }>;
  },

  async getVehicles() {
    const res = await fetch('/api/vehicles');
    if (!res.ok) throw new Error('Failed to load vehicle fleet');
    return res.json() as Promise<{ total: number; vehicles: CollectionVehicle[] }>;
  },

  async optimizeRoute(payload?: { vehicleId?: string; specificBinIds?: string[]; minFillPercent?: number }) {
    const res = await fetch('/api/routes/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload || {}),
    });
    if (!res.ok) throw new Error('Failed to calculate optimized route');
    return res.json() as Promise<{ success: boolean; route: OptimizedRoute; vehicle: CollectionVehicle }>;
  },

  async getNotifications() {
    const res = await fetch('/api/notifications');
    if (!res.ok) throw new Error('Failed to load notifications');
    return res.json() as Promise<{ total: number; unreadCount: number; notifications: AppNotification[] }>;
  },

  async markNotificationRead(id: string) {
    const res = await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
    return res.json();
  },

  async markAllNotificationsRead() {
    const res = await fetch('/api/notifications/mark-all-read', { method: 'POST' });
    return res.json();
  },

  async clearNotifications() {
    const res = await fetch('/api/notifications', { method: 'DELETE' });
    return res.json();
  },

  async getRewards() {
    const res = await fetch('/api/rewards');
    if (!res.ok) throw new Error('Failed to load rewards');
    return res.json() as Promise<{ rewards: RewardItem[] }>;
  },

  async redeemReward(rewardId: string, userEmail: string) {
    const res = await fetch('/api/rewards/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rewardId, userEmail }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Reward redemption failed');
    }
    return res.json() as Promise<{ success: boolean; voucherCode: string; newBalance: number; reward: RewardItem }>;
  },

  async getLeaderboard() {
    const res = await fetch('/api/leaderboard');
    if (!res.ok) throw new Error('Failed to load leaderboard');
    return res.json() as Promise<{ leaderboard: LeaderboardEntry[] }>;
  },

  async getCategories() {
    const res = await fetch('/api/categories');
    if (!res.ok) throw new Error('Failed to load categories');
    return res.json() as Promise<{ categories: WasteCategoryConfig[] }>;
  },

  async updateCategory(id: string, payload: Partial<WasteCategoryConfig>) {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update category config');
    return res.json() as Promise<{ success: boolean; category: WasteCategoryConfig }>;
  },

  async updateUserRole(id: string, role: string, zone?: string) {
    const res = await fetch(`/api/auth/users/${id}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, zone }),
    });
    if (!res.ok) throw new Error('Failed to update user role');
    return res.json() as Promise<{ success: boolean; user: User }>;
  },

  async triggerIoTTick() {
    const res = await fetch('/api/simulation/iot-tick', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to simulate IoT tick');
    return res.json() as Promise<{ success: boolean; threshold: number; bins: SmartBin[]; alertsTriggered: number }>;
  },

  async getAnalytics(period: string = 'month') {
    const res = await fetch(`/api/analytics?period=${period}`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  async getHistory(userEmail?: string): Promise<HistoryResponse> {
    const params = new URLSearchParams();
    if (userEmail) params.set('userEmail', userEmail);
    const res = await fetch(`/api/history?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to load user history');
    return res.json();
  },

  async deleteScanHistory(id: string) {
    const res = await fetch(`/api/history/scan/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete history item');
    return res.json();
  },

  async clearScanHistory(userEmail?: string) {
    const res = await fetch('/api/history/scans', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail }),
    });
    if (!res.ok) throw new Error('Failed to clear history');
    return res.json();
  },

  async login(email: string, password?: string, role?: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Login failed');
    }
    return res.json() as Promise<{ success: boolean; token: string; user: User }>;
  },

  async register(payload: {
    name: string;
    username?: string;
    email: string;
    phone?: string;
    password?: string;
    role: 'citizen' | 'collector' | 'admin' | string;
    zone?: string;
  }) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Registration failed');
    }
    return res.json() as Promise<{ success: boolean; token: string; user: User; message?: string }>;
  },

  async getUsers() {
    const res = await fetch('/api/auth/users');
    if (!res.ok) throw new Error('Failed to load users');
    return res.json() as Promise<{ users: User[] }>;
  },

  async submitContact(data: { name: string; email: string; subject: string; message: string }) {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to send contact inquiry');
    return res.json();
  },
};
