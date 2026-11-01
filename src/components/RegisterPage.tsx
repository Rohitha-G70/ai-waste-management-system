import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Recycle,
  User,
  AtSign,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Truck,
  Leaf,
  FileText,
  Home,
  LogIn,
  Award,
  TreePine,
  ShieldAlert,
} from 'lucide-react';
import { api } from '../services/api';
import { User as UserType } from '../types';

interface RegisterPageProps {
  onRegisterSuccess: (user: UserType) => void;
  onNavigateTab: (tab: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onRegisterSuccess,
  onNavigateTab,
}) => {
  // Form Fields
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'citizen' | 'collector'>('citizen');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registeredUser, setRegisteredUser] = useState<UserType | null>(null);
  const [countdown, setCountdown] = useState(5);

  // Modals for Terms & Privacy
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // Touched states for inline validation
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Password criteria verification
  const passwordCriteria = useMemo(() => {
    return {
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    };
  }, [password]);

  // Overall password strength calculation
  const strengthScore = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (passwordCriteria.minLength) score += 1;
    if (passwordCriteria.hasUpper) score += 1;
    if (passwordCriteria.hasLower) score += 1;
    if (passwordCriteria.hasNumber) score += 1;
    if (passwordCriteria.hasSpecial) score += 1;
    return score; // 0 to 5
  }, [password, passwordCriteria]);

  const strengthMeta = useMemo(() => {
    if (strengthScore <= 1) {
      return { label: 'Weak', color: 'bg-rose-500', textColor: 'text-rose-600', width: '20%' };
    } else if (strengthScore === 2) {
      return { label: 'Fair', color: 'bg-amber-500', textColor: 'text-amber-600', width: '40%' };
    } else if (strengthScore === 3) {
      return { label: 'Moderate', color: 'bg-yellow-500', textColor: 'text-yellow-600', width: '65%' };
    } else if (strengthScore === 4) {
      return { label: 'Good', color: 'bg-teal-500', textColor: 'text-teal-600', width: '85%' };
    }
    return { label: 'Strong & Secure', color: 'bg-emerald-600', textColor: 'text-emerald-600', width: '100%' };
  }, [strengthScore]);

  // Field validations
  const isEmailValid = useMemo(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }, [email]);

  const cleanUsername = useMemo(() => {
    return username.trim().replace(/^@/, '');
  }, [username]);

  const isUsernameValid = useMemo(() => {
    return /^[a-zA-Z0-9_]{3,30}$/.test(cleanUsername);
  }, [cleanUsername]);

  const isPhoneValid = useMemo(() => {
    if (!phone.trim()) return true; // Optional format
    return /^[+0-9()\s-]{7,25}$/.test(phone.trim());
  }, [phone]);

  const passwordsMatch = useMemo(() => {
    if (!confirmPassword) return false;
    return password === confirmPassword;
  }, [password, confirmPassword]);

  const isFormValid =
    fullName.trim().length >= 2 &&
    isUsernameValid &&
    isEmailValid &&
    isPhoneValid &&
    strengthScore >= 4 &&
    passwordsMatch &&
    agreedToTerms;

  // Reset form handler
  const handleResetForm = () => {
    setFullName('');
    setUsername('');
    setEmail('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setRole('citizen');
    setAgreedToTerms(false);
    setErrorMessage(null);
    setTouched({});
  };

  // Submit handler
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Explicit client-side assertions
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!cleanUsername) {
      setErrorMessage('Please provide a username.');
      return;
    }
    if (!isUsernameValid) {
      setErrorMessage('Username must be 3-30 alphanumeric characters or underscores.');
      return;
    }
    if (!isEmailValid) {
      setErrorMessage('Please enter a valid email address (e.g., citizen@example.com).');
      return;
    }
    if (phone.trim() && !isPhoneValid) {
      setErrorMessage('Please enter a valid mobile phone number format.');
      return;
    }
    if (strengthScore < 3) {
      setErrorMessage('Your password is too weak. Please meet the required criteria below.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify both fields.');
      return;
    }
    if (!agreedToTerms) {
      setErrorMessage('You must agree to the Terms and Conditions and Privacy Policy to create an account.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.register({
        name: fullName.trim(),
        username: `@${cleanUsername.toLowerCase()}`,
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        password,
        role,
        zone: role === 'collector' ? 'Metro Eco Collection Sector' : 'Green Living District 1',
      });

      // Fire celebratory confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#059669', '#10b981', '#34d399', '#6ee7b7', '#14b8a6'],
      });

      setRegisteredUser(res.user);

      // Countdown to redirect to login
      let timer = 5;
      const interval = setInterval(() => {
        timer -= 1;
        setCountdown(timer);
        if (timer <= 0) {
          clearInterval(interval);
          onRegisterSuccess(res.user);
          onNavigateTab('login');
        }
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] py-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      {/* Nature-inspired background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 rounded-full bg-teal-200/30 blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 w-80 h-80 rounded-full bg-emerald-100/50 blur-3xl" />

        {/* Subtle decorative leaf vectors */}
        <svg
          className="absolute top-12 left-8 w-24 h-24 text-emerald-600/10 animate-pulse"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
        </svg>
        <svg
          className="absolute bottom-16 right-12 w-32 h-32 text-teal-600/10 -rotate-45"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
        </svg>
      </div>

      {/* Breadcrumb Navigation Header */}
      <div className="w-full max-w-4xl mb-4 flex items-center justify-between text-xs">
        <button
          onClick={() => onNavigateTab('home')}
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-emerald-700 font-medium transition-colors cursor-pointer py-1 px-2.5 rounded-lg hover:bg-white/80"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2 text-slate-500">
          <span>Already registered?</span>
          <button
            onClick={() => onNavigateTab('login')}
            className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline cursor-pointer inline-flex items-center gap-1"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        </div>
      </div>

      {/* Main Registration Container */}
      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-3xl border border-emerald-100 shadow-xl shadow-emerald-950/5 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Brand Story & Environmental Value Props */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-56 h-56 rounded-full bg-teal-400/10 blur-2xl pointer-events-none" />

          {/* Logo & Intro */}
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-emerald-200">
              <Recycle className="w-5 h-5 text-emerald-400 animate-spin-slow" />
              <span className="font-heading font-bold text-sm tracking-wide text-white">SmartWaste AI ♻️</span>
            </div>

            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Join the Green Recycling Revolution
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                Create your verified eco account to save every AI scan, earn rewards for diverting
                landfill waste, and schedule smart collection pick-ups.
              </p>
            </div>

            {/* Feature Perks */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xs">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 shrink-0 mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">150 Welcome Eco-Points</h4>
                  <p className="text-[11px] text-emerald-200/80 leading-snug">
                    Instantly credited to redeem eco vouchers, tree planting tokens, and coffee discounts.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xs">
                <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Persistent Scan History</h4>
                  <p className="text-[11px] text-emerald-200/80 leading-snug">
                    Access your full waste classification records, recycling tips, and carbon metrics anytime.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xs">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 shrink-0 mt-0.5">
                  <TreePine className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">100% Free & Transparent</h4>
                  <p className="text-[11px] text-emerald-200/80 leading-snug">
                    No subscriptions or hidden fees. Built with zero-data-sale privacy standards.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Environmental Mission Footnote */}
          <div className="relative z-10 pt-6 border-t border-white/10 mt-6 flex items-center gap-3">
            <Leaf className="w-4 h-4 text-emerald-400 shrink-0" />
            <p className="text-[11px] text-emerald-200/70 leading-snug">
              Every item properly classified diverts an average of 0.42 kg CO₂e from our atmosphere.
            </p>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          {/* Header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200 mb-2">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Free Account Creation</span>
            </div>
            <h2 className="font-heading text-2xl font-extrabold text-slate-900 tracking-tight">
              Create SmartWaste AI Account
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Fill in your details below to activate your environmental profile.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-rose-900">Registration Error</p>
                <p className="text-rose-700 mt-0.5">{errorMessage}</p>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-rose-500 hover:text-rose-700 text-xs font-bold px-1.5 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* 1. Full Name & 2. Username */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-emerald-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onBlur={() => handleBlur('fullName')}
                    placeholder="e.g. Sarah Chen"
                    className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      touched.fullName && fullName.trim().length < 2
                        ? 'border-rose-300 focus:ring-rose-500/20'
                        : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                    }`}
                  />
                </div>
                {touched.fullName && fullName.trim().length < 2 && (
                  <p className="text-[10px] text-rose-600 mt-1">Full name is required (min 2 chars).</p>
                )}
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Username <span className="text-emerald-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <AtSign className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/\s+/g, ''))}
                    onBlur={() => handleBlur('username')}
                    placeholder="sarah_eco"
                    className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      touched.username && !isUsernameValid
                        ? 'border-rose-300 focus:ring-rose-500/20'
                        : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                    }`}
                  />
                  {username && isUsernameValid && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-emerald-600">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
                {touched.username && !isUsernameValid && (
                  <p className="text-[10px] text-rose-600 mt-1">
                    3-30 letters, numbers, or underscores.
                  </p>
                )}
              </div>
            </div>

            {/* 3. Email & 4. Mobile Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address <span className="text-emerald-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => handleBlur('email')}
                    placeholder="sarah@example.com"
                    className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      touched.email && !isEmailValid
                        ? 'border-rose-300 focus:ring-rose-500/20'
                        : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                    }`}
                  />
                  {email && isEmailValid && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-emerald-600">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
                {touched.email && !isEmailValid && (
                  <p className="text-[10px] text-rose-600 mt-1">Please enter a valid email format.</p>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    placeholder="+1 (555) 234-5678"
                    className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      touched.phone && !isPhoneValid
                        ? 'border-rose-300 focus:ring-rose-500/20'
                        : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                    }`}
                  />
                </div>
                {touched.phone && !isPhoneValid && (
                  <p className="text-[10px] text-rose-600 mt-1">Invalid phone format.</p>
                )}
              </div>
            </div>

            {/* 7. User Role Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Select Your Eco Role <span className="text-emerald-600">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('citizen')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                    role === 'citizen'
                      ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl shrink-0 ${
                      role === 'citizen' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      <span>Citizen</span>
                      {role === 'citizen' && <span className="text-[10px] text-emerald-600">● Selected</span>}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                      Residential recycling, AI scanner & pick-up booking.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('collector')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                    role === 'collector'
                      ? 'border-teal-500 bg-teal-50/80 ring-2 ring-teal-500/20 shadow-xs'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl shrink-0 ${
                      role === 'collector' ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      <span>Waste Collector</span>
                      {role === 'collector' && <span className="text-[10px] text-teal-600">● Selected</span>}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                      Fleet vehicle driver, smart bin IoT route optimization.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* 5. Password & 6. Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password <span className="text-emerald-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur('password')}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm Password <span className="text-emerald-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() => handleBlur('confirmPassword')}
                    placeholder="••••••••"
                    className={`w-full pl-9 pr-9 py-2 text-xs rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      touched.confirmPassword && confirmPassword && !passwordsMatch
                        ? 'border-rose-300 focus:ring-rose-500/20'
                        : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {touched.confirmPassword && confirmPassword && (
                  <p
                    className={`text-[10px] mt-1 flex items-center gap-1 ${
                      passwordsMatch ? 'text-emerald-600 font-semibold' : 'text-rose-600'
                    }`}
                  >
                    {passwordsMatch ? (
                      <>
                        <Check className="w-3 h-3" /> Passwords match
                      </>
                    ) : (
                      <>
                        <X className="w-3 h-3" /> Passwords do not match
                      </>
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Password Strength Indicator & Checklist */}
            {password && (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-600">Password Strength:</span>
                  <span className={`font-bold ${strengthMeta.textColor}`}>{strengthMeta.label}</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strengthMeta.color}`}
                    style={{ width: strengthMeta.width }}
                  />
                </div>

                {/* Requirements Checklist */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1 text-[10px]">
                  <div
                    className={`flex items-center gap-1 ${
                      passwordCriteria.minLength ? 'text-emerald-600 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    {passwordCriteria.minLength ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 inline-block">•</span>}
                    <span>8+ characters</span>
                  </div>
                  <div
                    className={`flex items-center gap-1 ${
                      passwordCriteria.hasUpper ? 'text-emerald-600 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    {passwordCriteria.hasUpper ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 inline-block">•</span>}
                    <span>Uppercase (A-Z)</span>
                  </div>
                  <div
                    className={`flex items-center gap-1 ${
                      passwordCriteria.hasLower ? 'text-emerald-600 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    {passwordCriteria.hasLower ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 inline-block">•</span>}
                    <span>Lowercase (a-z)</span>
                  </div>
                  <div
                    className={`flex items-center gap-1 ${
                      passwordCriteria.hasNumber ? 'text-emerald-600 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    {passwordCriteria.hasNumber ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 inline-block">•</span>}
                    <span>Number (0-9)</span>
                  </div>
                  <div
                    className={`flex items-center gap-1 ${
                      passwordCriteria.hasSpecial ? 'text-emerald-600 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    {passwordCriteria.hasSpecial ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 inline-block">•</span>}
                    <span>Special symbol (!@#$)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Terms and Conditions Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-[11px] text-slate-600 leading-snug">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => setIsTermsModalOpen(true)}
                    className="text-emerald-700 hover:text-emerald-900 font-bold underline cursor-pointer"
                  >
                    Terms and Conditions
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    onClick={() => setIsPrivacyModalOpen(true)}
                    className="text-emerald-700 hover:text-emerald-900 font-bold underline cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                  .
                </span>
              </label>
            </div>

            {/* Action Buttons: Create Account + Reset Form */}
            <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                disabled={isLoading || !isFormValid}
                className={`w-full sm:flex-1 py-3 px-5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                  isLoading || !isFormValid
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-700/25 hover:shadow-lg hover:scale-[1.01]'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating Eco Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleResetForm}
                disabled={isLoading}
                className="w-full sm:w-auto py-3 px-4 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Clear all fields"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Form</span>
              </button>
            </div>
          </form>

          {/* Already have an account? Login */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => onNavigateTab('login')}
                className="font-bold text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer ml-1 inline-flex items-center gap-1"
              >
                <span>Login</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL / CELEBRATION OVERLAY */}
      {registeredUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl border border-emerald-100 relative overflow-hidden animate-in zoom-in-95">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-9 h-9 animate-bounce" />
            </div>

            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Registration Successful!</span>
            </div>

            <h3 className="font-heading text-2xl font-extrabold text-slate-900">
              Welcome, {registeredUser.name}!
            </h3>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Your <span className="font-semibold text-emerald-700">{registeredUser.role}</span> account{' '}
              <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">
                {registeredUser.username || registeredUser.email}
              </span>{' '}
              has been activated.
            </p>

            <div className="my-5 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-left">
              <div className="flex items-center justify-between text-xs text-emerald-900 font-bold mb-1">
                <span>🌱 Eco-Points Bonus:</span>
                <span className="text-emerald-700 font-extrabold">+150 Points</span>
              </div>
              <p className="text-[11px] text-emerald-800/80">
                You can now save your AI scans, track pickups in My History, and claim sustainable rewards.
              </p>
            </div>

            <p className="text-[11px] text-slate-400 mb-4">
              Redirecting to Sign In in <span className="font-bold text-emerald-700">{countdown}s</span>...
            </p>

            <button
              onClick={() => {
                onRegisterSuccess(registeredUser);
                onNavigateTab('login');
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 cursor-pointer"
            >
              <span>Sign In Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TERMS AND CONDITIONS MODAL */}
      {isTermsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-600 text-white">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-slate-900">
                    SmartWaste AI Terms & Conditions
                  </h3>
                  <p className="text-[11px] text-slate-500">Effective Date: November 2026</p>
                </div>
              </div>
              <button
                onClick={() => setIsTermsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm cursor-pointer border border-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-600 leading-relaxed">
              <section>
                <h4 className="font-bold text-slate-900 mb-1">1. Acceptance of Environmental Terms</h4>
                <p>
                  By creating an account on SmartWaste AI, you agree to comply with local municipality
                  waste segregation guidelines, accurate waste categorization, and responsible disposal
                  practices.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-slate-900 mb-1">2. AI Classification Model Advisory</h4>
                <p>
                  SmartWaste AI utilizes deep learning vision models (Google Gemini) to identify waste
                  materials. While segregation accuracy exceeds 94%, recommendations serve as intelligent
                  guidance. Always follow local hazardous waste regulations for medical or toxic items.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-slate-900 mb-1">3. Eco-Points and Rewards Program</h4>
                <p>
                  Eco-Points are awarded for genuine waste classification, scheduled collection
                  participations, and community recycling activities. Points possess no cash surrender
                  value and may be redeemed only through authorized green partners.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-slate-900 mb-1">4. Collection Scheduling Responsibilities</h4>
                <p>
                  Citizens are responsible for providing accessible pickup points and reasonable packaging
                  for e-waste or bulky recyclables during designated driver pickup windows.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-slate-900 mb-1">5. Account Integrity</h4>
                <p>
                  You agree to provide accurate information and refrain from submitting fraudulent waste
                  images or abusive bulk requests. Violations may result in point forfeiture or account
                  suspension.
                </p>
              </section>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setAgreedToTerms(true);
                  setIsTermsModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
              >
                I Agree & Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRIVACY POLICY MODAL */}
      {isPrivacyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-teal-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-600 text-white">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-slate-900">
                    SmartWaste AI Privacy Policy
                  </h3>
                  <p className="text-[11px] text-slate-500">Your privacy and data rights pledge</p>
                </div>
              </div>
              <button
                onClick={() => setIsPrivacyModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm cursor-pointer border border-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-600 leading-relaxed">
              <section>
                <h4 className="font-bold text-slate-900 mb-1">1. Zero Sale of Personal Data</h4>
                <p>
                  SmartWaste AI never sells, rents, or monetizes your personal data, email, phone number,
                  or uploaded item photographs with third-party advertisers.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-slate-900 mb-1">2. Secure Password & Hash Storage</h4>
                <p>
                  Passwords are cryptographic hashes using industry-standard salted SHA-256 algorithms.
                  Raw passwords are never stored in plaintext and cannot be read by administrators.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-slate-900 mb-1">3. Waste Classification Images</h4>
                <p>
                  Photographs uploaded for AI classification are processed strictly to recognize materials
                  and recommend recycling avenues. You may clear or delete your scan history at any time
                  from the My History dashboard.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-slate-900 mb-1">4. Geolocation & Fleet Privacy</h4>
                <p>
                  Address information provided during pickup booking is only shared with the assigned
                  municipal collector for route optimization and logistics dispatch.
                </p>
              </section>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setAgreedToTerms(true);
                  setIsPrivacyModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs cursor-pointer"
              >
                Understood & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
