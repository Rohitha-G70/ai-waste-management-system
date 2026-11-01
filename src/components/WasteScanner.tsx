import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info,
  Calendar,
  Layers,
  Leaf,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { ClassificationResult, WasteCategory, User } from '../types';

interface WasteScannerProps {
  onScheduleCollection?: (category: WasteCategory, notes: string) => void;
  hasAiKey: boolean;
  currentUser?: User;
  onNavigateToHistory?: () => void;
  onNavigateToLogin?: () => void;
}

export const WasteScanner: React.FC<WasteScannerProps> = ({
  onScheduleCollection,
  hasAiKey,
  currentUser,
  onNavigateToHistory,
  onNavigateToLogin,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(!hasAiKey);
  const [demoNotice, setDemoNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Ready-to-test sample items
  const sampleItems = [
    {
      id: 'plastic-bottle',
      name: 'PET Water Bottle',
      category: 'Plastic',
      icon: '🥤',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      img: 'https://images.unsplash.com/photo-1558882224-dda166733046?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'cardboard-box',
      name: 'Shipping Box',
      category: 'Paper',
      icon: '📦',
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      img: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'aluminum-can',
      name: 'Soda Can',
      category: 'Metal',
      icon: '🥫',
      color: 'bg-sky-50 text-sky-800 border-sky-200',
      img: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'banana-peel',
      name: 'Banana Peels',
      category: 'Organic Waste',
      icon: '🍌',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      img: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'broken-phone',
      name: 'Old Smartphone',
      category: 'E-Waste',
      icon: '📱',
      color: 'bg-purple-50 text-purple-800 border-purple-200',
      img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'glass-bottle',
      name: 'Glass Beverage Jar',
      category: 'Glass',
      icon: '🍾',
      color: 'bg-teal-50 text-teal-800 border-teal-200',
      img: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'battery-hazard',
      name: 'Lithium Battery',
      category: 'Hazardous Waste',
      icon: '🔋',
      color: 'bg-rose-50 text-rose-800 border-rose-200',
      img: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?w=400&auto=format&fit=crop&q=80',
    },
  ];

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setSelectedImage(base64);
      analyzeWaste(base64, file.type, file.name);
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handler
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Select sample item
  const handleSelectSample = (sample: (typeof sampleItems)[0]) => {
    setError(null);
    setSelectedImage(sample.img);
    analyzeWaste(undefined, 'image/jpeg', sample.id);
  };

  // Camera start / capture
  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      setIsCameraActive(false);
      setError('Camera access denied or unavailable: ' + err.message);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      stopCamera();
      setSelectedImage(dataUrl);
      analyzeWaste(dataUrl, 'image/jpeg', 'camera-capture');
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Main classification runner
  const analyzeWaste = async (base64?: string, mimeType?: string, sampleItem?: string) => {
    setIsAnalyzing(true);
    setResult(null);
    setError(null);

    try {
      const res = await api.classifyWaste({
        imageBase64: base64,
        mimeType,
        sampleItem,
        userEmail: currentUser?.email,
        userId: currentUser?.id,
        imageUrl: base64 ? undefined : selectedImage || undefined,
      });

      setResult(res.result);
      setIsDemoMode(res.isDemoMode);
      setDemoNotice(res.demoNotice || null);

      if (res.result.recyclable) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#10b981', '#059669', '#34d399', '#3b82f6'],
        });
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred while analyzing image');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetScanner = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
    stopCamera();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Category styling helper
  const getCategoryTheme = (category: WasteCategory) => {
    switch (category) {
      case 'Plastic':
        return {
          bg: 'bg-blue-500/10 text-blue-800 border-blue-200',
          badge: 'bg-blue-600 text-white',
          binColor: 'Blue (Recyclables)',
          icon: '🥤',
        };
      case 'Paper':
        return {
          bg: 'bg-amber-500/10 text-amber-800 border-amber-200',
          badge: 'bg-amber-600 text-white',
          binColor: 'Blue / Brown (Paper & Cardboard)',
          icon: '📦',
        };
      case 'Metal':
        return {
          bg: 'bg-sky-500/10 text-sky-800 border-sky-200',
          badge: 'bg-sky-600 text-white',
          binColor: 'Blue (Recyclables)',
          icon: '🥫',
        };
      case 'Organic Waste':
        return {
          bg: 'bg-emerald-500/10 text-emerald-800 border-emerald-200',
          badge: 'bg-emerald-600 text-white',
          binColor: 'Green (Compost & Organic)',
          icon: '🍌',
        };
      case 'Glass':
        return {
          bg: 'bg-teal-500/10 text-teal-800 border-teal-200',
          badge: 'bg-teal-600 text-white',
          binColor: 'Blue (Glass Receptacle)',
          icon: '🍾',
        };
      case 'E-Waste':
        return {
          bg: 'bg-purple-500/10 text-purple-800 border-purple-200',
          badge: 'bg-purple-600 text-white',
          binColor: 'Orange (Specialized E-Waste Kiosk)',
          icon: '📱',
        };
      case 'Hazardous Waste':
        return {
          bg: 'bg-rose-500/10 text-rose-800 border-rose-200',
          badge: 'bg-rose-600 text-white',
          binColor: 'Red (Hazardous Depot / Facility)',
          icon: '⚠️',
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-800 border-slate-200',
          badge: 'bg-slate-600 text-white',
          binColor: 'General Trash',
          icon: '🗑️',
        };
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
          <ScanLine className="w-3.5 h-3.5 text-emerald-600" />
          <span>Multimodal AI Vision Classifier</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
          AI Waste Detection &amp; Classification
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Upload or capture an image of any discarded packaging or material. Our AI identifies the category, segregates accurately, and provides verified disposal instructions.
        </p>

        {/* Clear Demonstration Mode Banner as explicitly requested in prompt */}
        {isDemoMode && (
          <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-center gap-2 text-left">
            <Info className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Demonstration Mode Active:</strong> Running heuristic AI vision classification engine. Set a valid <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-semibold">GEMINI_API_KEY</code> in Secrets for live Gemini 3.8 Flash multimodal scanning.
            </span>
          </div>
        )}
      </div>

      {/* Main Scanner Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        {!selectedImage && !isCameraActive ? (
          <div>
            {/* Upload & Drop Zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-emerald-200 hover:border-emerald-500 rounded-3xl p-8 sm:p-14 text-center bg-emerald-50/20 hover:bg-emerald-50/50 transition-all cursor-pointer group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform mb-4 shadow-xs">
                <Upload className="w-8 h-8" />
              </div>

              <h3 className="font-heading text-lg font-bold text-slate-800 mb-1">
                Drag and drop your waste image here
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                Supports PNG, JPG, JPEG, and WEBP formats up to 15MB.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-sm flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose from Device</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    startCamera();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 shadow-xs flex items-center gap-2"
                >
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span>Use Camera</span>
                </button>
              </div>
            </div>

            {/* Quick-Pick Sample Gallery */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Or Test with Sample Waste Presets:
                </span>
                <span className="text-[11px] text-slate-500">1-Click Instant AI Evaluation</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                {sampleItems.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-left flex flex-col items-center text-center group cursor-pointer"
                  >
                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                      {sample.icon}
                    </span>
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">
                      {sample.name}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      {sample.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : isCameraActive ? (
          /* Live Camera View */
          <div className="text-center space-y-4">
            <div className="relative max-w-lg mx-auto rounded-2xl overflow-hidden bg-slate-900 shadow-lg aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-2 border-emerald-400/60 pointer-events-none rounded-2xl flex items-center justify-center">
                <div className="w-48 h-48 border border-dashed border-emerald-300/80 rounded-xl animate-pulse" />
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={capturePhoto}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Capture &amp; Analyze</span>
              </button>
              <button
                onClick={stopCamera}
                className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          /* Analysis / Result View */
          <div className="space-y-6">
            {isAnalyzing ? (
              <div className="py-16 text-center space-y-4">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="w-20 h-20 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ScanLine className="w-8 h-8 text-emerald-600 animate-pulse" />
                  </div>
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-800">
                  Analyzing Waste Object...
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Extracting visual textures, material signatures, and municipal recycling classifications.
                </p>
              </div>
            ) : result ? (
              /* Classification Result Card */
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Image Preview */}
                  <div className="lg:col-span-5 space-y-3">
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm aspect-4/3 bg-slate-100">
                      <img
                        src={selectedImage!}
                        alt="Uploaded waste item"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-mono px-2.5 py-1 rounded-lg">
                        {result.id || 'PREDICTED'}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-xs">
                        Match Confidence: <span className="text-emerald-700">{result.confidence}%</span>
                      </div>
                    </div>

                    <button
                      onClick={resetScanner}
                      className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <RotateCcw className="w-4 h-4 text-slate-500" />
                      <span>Scan Another Image</span>
                    </button>
                  </div>

                  {/* Right Column: AI Insights Card */}
                  <div className="lg:col-span-7 space-y-5">
                    {/* Category Title & Badge */}
                    <div className="border-b border-slate-100 pb-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                            getCategoryTheme(result.category).bg
                          }`}
                        >
                          {getCategoryTheme(result.category).icon} {result.category}
                        </span>

                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            result.recyclable
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {result.recyclable ? '✓ Recyclable' : '✗ Specialized / Non-Recyclable'}
                        </span>
                      </div>

                      <h2 className="font-heading text-2xl font-bold text-slate-900">
                        {result.subType}
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Recycling Possibility: <strong className="text-slate-800">{result.recyclingPossibility}</strong>
                      </p>
                    </div>

                    {/* Suggested Bin Indicator */}
                    <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
                        🗑️
                      </div>
                      <div>
                        <div className="text-[11px] uppercase tracking-wider font-bold text-emerald-700">
                          Recommended Municipal Receptacle
                        </div>
                        <div className="text-sm font-bold text-slate-900">
                          {result.suggestedBinColor}
                        </div>
                        <div className="text-[11px] text-slate-600">
                          Ensure container is emptied of organic liquids before disposal.
                        </div>
                      </div>
                    </div>

                    {/* Step-by-Step Citizen Disposal Instructions */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Recommended Disposal Instructions</span>
                      </h4>
                      <div className="bg-slate-50 rounded-2xl p-4 text-xs text-slate-700 whitespace-pre-line leading-relaxed border border-slate-200/80">
                        {result.disposalInstructions}
                      </div>
                    </div>

                    {/* Environmental Impact Statistics */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Leaf className="w-4 h-4 text-emerald-600" />
                        <span>Environmental Impact Analysis</span>
                      </h4>
                      <div className="bg-emerald-900/5 rounded-2xl p-4 text-xs text-slate-800 leading-relaxed border border-emerald-200/50">
                        {result.environmentalImpact}
                      </div>
                    </div>

                    {/* Saved to History Notice & Eco-Points Reward */}
                    <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-emerald-900">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <span className="font-bold">Scan Saved to Your History</span>
                          <span className="text-slate-500 ml-1.5 hidden sm:inline">
                            (+15 Eco-Points logged for {currentUser?.email || 'your account'})
                          </span>
                        </div>
                      </div>
                      {onNavigateToHistory && (
                        <button
                          onClick={onNavigateToHistory}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs cursor-pointer shrink-0 transition-colors"
                        >
                          View History →
                        </button>
                      )}
                    </div>

                    {/* Action: Book on-demand collection */}
                    {onScheduleCollection && (
                      <div className="pt-2 flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() =>
                            onScheduleCollection(
                              result.category,
                              `Item: ${result.subType} (${result.category})`
                            )
                          }
                          className="flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                        >
                          <Calendar className="w-4 h-4" />
                          <span>Request Pickup for this Waste</span>
                        </button>

                        <button
                          onClick={resetScanner}
                          className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                        >
                          Scan New Item
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* 7 Waste Categories Educational Reference */}
      <div className="bg-slate-50/80 rounded-3xl p-6 sm:p-8 border border-slate-200/80">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-emerald-700" />
          <h3 className="font-heading text-lg font-bold text-slate-900">
            Supported Waste Categories (Smart Segregation Standard)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {[
            { name: 'Plastic', desc: 'PET, HDPE, PP bottles, tubs, rigid containers', color: 'border-l-4 border-l-blue-500' },
            { name: 'Paper', desc: 'Cardboard, newspapers, magazines, clean cartons', color: 'border-l-4 border-l-amber-500' },
            { name: 'Metal', desc: 'Aluminum beverage cans, tin cans, foil trays', color: 'border-l-4 border-l-sky-500' },
            { name: 'Glass', desc: 'Beverage bottles, condiment jars, clear glassware', color: 'border-l-4 border-l-teal-500' },
            { name: 'Organic Waste', desc: 'Food trimmings, coffee grounds, landscape biomass', color: 'border-l-4 border-l-emerald-500' },
            { name: 'E-Waste', desc: 'Old electronics, lithium batteries, circuit boards', color: 'border-l-4 border-l-purple-500' },
            { name: 'Hazardous Waste', desc: 'Paint solvents, motor oil, medical waste, corrosive toxics', color: 'border-l-4 border-l-rose-500' },
          ].map((cat) => (
            <div key={cat.name} className={`bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs ${cat.color}`}>
              <div className="font-bold text-slate-800">{cat.name}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{cat.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
