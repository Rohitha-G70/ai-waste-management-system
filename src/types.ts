export type WasteCategory =
  | 'Plastic'
  | 'Paper'
  | 'Metal'
  | 'Glass'
  | 'Organic Waste'
  | 'E-Waste'
  | 'Hazardous Waste';

export interface ClassificationResult {
  id?: string;
  category: WasteCategory;
  subType: string;
  confidence: number;
  recyclable: boolean;
  recyclingPossibility: 'High' | 'Moderate' | 'Specialized Facility' | 'Non-Recyclable' | string;
  disposalInstructions: string;
  environmentalImpact: string;
  suggestedBinColor: string;
  segregationTip?: string;
  materialComposition?: string;
  timestamp?: string;
  imageUrl?: string;
  userEmail?: string;
  userId?: string;
}

export interface ClassificationRecord {
  id: string;
  timestamp: string;
  category: WasteCategory | string;
  subType: string;
  confidence: number;
  imageUrl?: string;
  recyclable: boolean;
  disposalMethod: string;
  environmentalImpact: string;
  suggestedBinColor: string;
  userRole?: string;
  userEmail?: string;
  userId?: string;
}

export interface HistoryResponse {
  scans: ClassificationRecord[];
  collections: CollectionRequest[];
  totalScans: number;
  totalPickups: number;
  user?: User | null;
}

export interface CollectionRequest {
  id: string;
  citizenName: string;
  citizenEmail: string;
  citizenPhone: string;
  category: WasteCategory | 'Mixed';
  weightKg: number;
  address: string;
  lat: number;
  lng: number;
  scheduledDate: string;
  status: 'Pending' | 'Assigned' | 'In Progress' | 'Completed';
  collectorName?: string;
  notes?: string;
  createdAt: string;
  completionTime?: string;
}

export interface SmartBin {
  id: string;
  name: string;
  category: string;
  fillLevel: number; // 0 - 100%
  status: 'Empty' | 'Half Full' | 'Full';
  battery: number;
  lat: number;
  lng: number;
  address: string;
  lastEmptied: string;
  capacityLiters?: number;
  temperatureCelsius?: number;
  isAlertGenerated?: boolean;
}

export interface CollectionVehicle {
  id: string;
  name: string;
  driverName: string;
  status: 'En Route' | 'Idle' | 'Returning to Depot';
  lat: number;
  lng: number;
  speedKmh: number;
  fuelBatteryPercent: number;
  capacityKg: number;
  currentLoadKg: number;
  assignedRouteId?: string;
}

export interface RouteWaypoint {
  lat: number;
  lng: number;
  label: string;
  stepNumber: number;
  binId?: string;
  action: string;
}

export interface OptimizedRoute {
  id: string;
  vehicleId: string;
  vehicleName: string;
  waypoints: RouteWaypoint[];
  binIds: string[];
  totalDistanceKm: number;
  estimatedMinutes: number;
  fuelSavedKgCO2: number;
  binsCount: number;
  status: 'Ready' | 'In Progress' | 'Completed';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'request' | 'bin_alert' | 'route' | 'reward' | 'system';
  timestamp: string;
  read: boolean;
  linkTab?: string;
  data?: any;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  category: string;
  progress: number;
  maxProgress: number;
}

export interface RewardItem {
  id: string;
  title: string;
  pointsCost: number;
  category: string;
  description: string;
  icon: string;
  partner: string;
  claimed?: boolean;
  code?: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  itemsRecycled: number;
  avatar?: string;
  badge: string;
  zone: string;
}

export interface WasteCategoryConfig {
  id: string;
  name: WasteCategory;
  binColor: string;
  recyclabilityRate: number;
  description: string;
  suggestedAction: string;
  contaminationPenaltyRate: string;
}

export interface User {
  id: string;
  name: string;
  username?: string;
  email: string;
  role: 'citizen' | 'collector' | 'admin';
  phone?: string;
  zone?: string;
  points?: number;
  avatar?: string;
  createdAt?: string;
}

export interface DashboardStats {
  totalWasteCollectedKg: number;
  totalRecycledKg: number;
  recyclingPercentage: number;
  segregationAccuracy: number;
  carbonEmissionsReducedKg: number;
  activeSmartBins: number;
  nearFullBins: number;
  pendingCollections: number;
  categoriesBreakdown: {
    name: string;
    amountKg: number;
    percentage: number;
    color: string;
  }[];
  monthlyTrends: {
    month: string;
    collected: number;
    recycled: number;
    accuracy: number;
  }[];
  recentClassifications: {
    id: string;
    timestamp: string;
    category: string;
    subType: string;
    confidence: number;
    recyclable: boolean;
    disposalMethod: string;
    environmentalImpact: string;
    suggestedBinColor: string;
  }[];
  collectionStatusCounts: {
    Pending: number;
    Assigned: number;
    InProgress: number;
    Completed: number;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isDemo?: boolean;
}
